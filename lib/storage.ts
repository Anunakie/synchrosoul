// lib/storage.ts
import { getAngelMeaning } from './angel-meanings'
import {
  getCurrentUserId,
  getLogsFromDB,
  saveLogToDB,
  deleteLogFromDB,
  upsertProfile,
  getProfile,
} from './supabase-db'

export interface AngelLog {
  id: string
  number: string
  thought: string
  screenshotUrl: string | null
  truthScore: boolean
  miniReading: string
  readingTitle: string
  readingColor: string
  createdAt: string
  shared: boolean
}

const STORAGE_KEY = 'synchrosoul_logs'

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2)
}

function enrichLog(log: AngelLog): AngelLog {
  if (!log.miniReading || !log.readingTitle) {
    const meaning = getAngelMeaning(log.number)
    return {
      ...log,
      miniReading: log.miniReading || meaning.message,
      readingTitle: log.readingTitle || meaning.title,
      readingColor: log.readingColor || meaning.color,
    }
  }
  return log
}

function getLocalLogs(): AngelLog[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    return JSON.parse(raw) as AngelLog[]
  } catch {
    return []
  }
}

// Sync status tracking
let _syncStatus: 'idle' | 'syncing' | 'synced' | 'offline' = 'idle'
let _syncListeners: Array<(s: typeof _syncStatus) => void> = []

export function getSyncStatus() { return _syncStatus }
export function onSyncStatusChange(fn: (s: typeof _syncStatus) => void) {
  _syncListeners.push(fn)
  return () => { _syncListeners = _syncListeners.filter(l => l !== fn) }
}
function setSyncStatus(s: typeof _syncStatus) {
  _syncStatus = s
  _syncListeners.forEach(l => l(s))
}

export async function getLogs(): Promise<AngelLog[]> {
  try {
    const userId = await getCurrentUserId()
    if (userId) {
      setSyncStatus('syncing')
      const dbLogs = await getLogsFromDB()
      const localLogs = getLocalLogs()
      // Merge: db logs take priority, add any local-only logs not yet synced
      const dbIds = new Set(dbLogs.map(l => l.id))
      const localOnly = localLogs.filter(l => !dbIds.has(l.id))
      setSyncStatus('synced')
      return [...dbLogs, ...localOnly].map(enrichLog)
    }
  } catch {
    setSyncStatus('offline')
  }
  return getLocalLogs().map(enrichLog)
}

// Migrate localStorage logs to Supabase (call once on login)
export async function migrateLocalLogsToSupabase(): Promise<{ migrated: number }> {
  try {
    const userId = await getCurrentUserId()
    if (!userId) return { migrated: 0 }
    const localLogs = getLocalLogs()
    if (localLogs.length === 0) return { migrated: 0 }
    // Get existing DB log IDs to avoid duplicates
    const dbLogs = await getLogsFromDB()
    const dbMinutes = new Set(dbLogs.map(l => l.createdAt.slice(0, 16)))
    let migrated = 0
    const failed: AngelLog[] = []
    for (const log of localLogs) {
      const minute = log.createdAt.slice(0, 16)
      if (dbMinutes.has(minute)) continue
      try {
        await saveLogToDB({
          number: log.number,
          thought: log.thought,
          screenshotUrl: log.screenshotUrl,
        })
        migrated++
      } catch {
        failed.push(log)
      }
    }
    if (migrated > 0) {
      console.log('[SynchroSoul] Migrated', migrated, 'logs to Supabase')
      // Only keep failed ones in localStorage
      if (failed.length === 0) {
        localStorage.removeItem(STORAGE_KEY)
      } else {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(failed))
      }
    }
    return { migrated }
  } catch (e) {
    console.error('[SynchroSoul] Log migration error:', e)
    return { migrated: 0 }
  }
}

export async function saveLog(data: {
  number: string
  thought: string
  screenshotUrl: string | null
  miniReadingOverride?: string
  readingTitleOverride?: string
}): Promise<AngelLog> {
  const meaning = getAngelMeaning(data.number)
  const log: AngelLog = {
    id: generateId(),
    number: data.number,
    thought: data.thought,
    screenshotUrl: data.screenshotUrl,
    truthScore: !!data.screenshotUrl,
    miniReading: data.miniReadingOverride || meaning.message,
    readingTitle: data.readingTitleOverride || meaning.title,
    readingColor: meaning.color,
    createdAt: new Date().toISOString(),
    shared: false,
  }
  try {
    const userId = await getCurrentUserId()
    if (userId) {
      setSyncStatus('syncing')
      const dbId = await saveLogToDB({
      ...data,
      miniReading: data.miniReadingOverride || meaning.message,
      readingTitle: data.readingTitleOverride || meaning.title,
      readingColor: meaning.color,
    })
      if (dbId) {
        setSyncStatus('synced')
        return { ...log, id: dbId }
      }
    }
  } catch {
    setSyncStatus('offline')
  }
  // Fallback to localStorage (will be migrated on next login)
  const existing = getLocalLogs()
  localStorage.setItem(STORAGE_KEY, JSON.stringify([log, ...existing]))
  return log
}

export async function deleteLog(id: string): Promise<void> {
  try {
    const userId = await getCurrentUserId()
    if (userId) {
      await deleteLogFromDB(id)
      // Also remove from localStorage if present
      const local = getLocalLogs().filter(l => l.id !== id)
      localStorage.setItem(STORAGE_KEY, JSON.stringify(local))
      return
    }
  } catch {}
  const logs = getLocalLogs().filter(l => l.id !== id)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(logs))
}

export async function searchLogs(query: string): Promise<AngelLog[]> {
  const all = await getLogs()
  const q = query.toLowerCase().trim()
  if (!q) return all
  return all.filter(l =>
    l.number.includes(q) ||
    l.thought.toLowerCase().includes(q) ||
    l.readingTitle.toLowerCase().includes(q) ||
    l.miniReading.toLowerCase().includes(q)
  )
}

export async function getStats() {
  const logs = await getLogs()
  const counts: Record<string, number> = {}
  logs.forEach(l => { counts[l.number] = (counts[l.number] || 0) + 1 })
  const topNumber = Object.entries(counts).sort((a, b) => b[1] - a[1])[0]
  return {
    total: logs.length,
    topNumber: topNumber ? topNumber[0] : null,
    topCount: topNumber ? topNumber[1] : 0,
    withProof: logs.filter(l => l.truthScore).length,
    streak: calculateStreak(logs),
  }
}

function calculateStreak(logs: AngelLog[]): number {
  if (!logs.length) return 0
  const days = new Set(logs.map(l => l.createdAt.slice(0, 10)))
  let streak = 0
  const today = new Date()
  for (let i = 0; i < 365; i++) {
    const d = new Date(today)
    d.setDate(d.getDate() - i)
    if (days.has(d.toISOString().slice(0, 10))) streak++
    else if (i > 0) break
  }
  return streak
}

// ── Numerology Profile Storage ─────────────────────────────────────────────
import type { NumerologyProfile } from './numerology'

const NUMEROLOGY_KEY = 'synchrosoul_numerology'

export async function saveNumerologyProfile(profile: NumerologyProfile): Promise<void> {
  if (typeof window === 'undefined') return
  // Save to localStorage as cache
  localStorage.setItem(NUMEROLOGY_KEY, JSON.stringify(profile))
  // Save to Supabase as source of truth
  try {
    const userId = await getCurrentUserId()
    if (userId) {
      await upsertProfile({
        life_path: profile.lifePath,
        soul_urge: profile.soulUrge,
        destiny: profile.destiny,
        birthdate: profile.birthdate,
        display_name: (profile as any).name,
      })
    }
  } catch (e) {
    console.error('[SynchroSoul] Failed to save numerology to Supabase:', e)
  }
}

export async function getNumerologyProfile(): Promise<NumerologyProfile | null> {
  try {
    const userId = await getCurrentUserId()
    if (userId) {
      const dbProfile = await getProfile()
      if (dbProfile?.life_path) {
        const profile = {
          name: dbProfile.display_name ?? '',
          birthdate: dbProfile.birthdate ?? '',
          lifePath: dbProfile.life_path ?? 0,
          soulUrge: dbProfile.soul_urge ?? 0,
          destiny: dbProfile.destiny ?? 0,
          lifePathMeaning: '',
          lifePathColor: '#9b59b6',
        } as NumerologyProfile & { name: string }
        // Update localStorage cache
        if (typeof window !== 'undefined') {
          localStorage.setItem(NUMEROLOGY_KEY, JSON.stringify(profile))
        }
        return profile
      }
    }
  } catch {}
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem(NUMEROLOGY_KEY)
    if (!raw) return null
    return JSON.parse(raw) as NumerologyProfile
  } catch {
    return null
  }
}

export function clearNumerologyProfile(): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem(NUMEROLOGY_KEY)
}

export async function toggleShare(id: string): Promise<void> {
  // Update localStorage
  const logs = getLocalLogs().map(l => l.id === id ? { ...l, shared: !l.shared } : l)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(logs))
  // TODO: update Supabase shared field when column is added
}

// ── Full Sync (call from settings Sync Now button) ─────────────────────────
export async function syncAllToCloud(): Promise<{ logs: number; dreams: number }> {
  setSyncStatus('syncing')
  try {
    const { migrateLocalDreamsToSupabase } = await import('./dream-storage')
    const [logsResult, dreamsResult] = await Promise.all([
      migrateLocalLogsToSupabase(),
      migrateLocalDreamsToSupabase(),
    ])
    setSyncStatus('synced')
    return { logs: logsResult.migrated, dreams: dreamsResult.migrated }
  } catch (e) {
    setSyncStatus('offline')
    throw e
  }
}
