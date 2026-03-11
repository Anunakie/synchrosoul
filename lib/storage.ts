// lib/storage.ts
import { getAngelMeaning } from './angel-meanings'
import {
  getCurrentUserId,
  getLogsFromDB,
  saveLogToDB,
  deleteLogFromDB,
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

export async function getLogs(): Promise<AngelLog[]> {
  try {
    const userId = await getCurrentUserId()
    if (userId) {
      const dbLogs = await getLogsFromDB()
      return dbLogs.map(enrichLog)
    }
  } catch {}
  return getLocalLogs().map(enrichLog)
}

export async function saveLog(data: {
  number: string
  thought: string
  screenshotUrl: string | null
}): Promise<AngelLog> {
  const meaning = getAngelMeaning(data.number)
  const log: AngelLog = {
    id: generateId(),
    number: data.number,
    thought: data.thought,
    screenshotUrl: data.screenshotUrl,
    truthScore: !!data.screenshotUrl,
    miniReading: meaning.message,
    readingTitle: meaning.title,
    readingColor: meaning.color,
    createdAt: new Date().toISOString(),
    shared: false,
  }
  try {
    const userId = await getCurrentUserId()
    if (userId) {
      const dbId = await saveLogToDB(data)
      if (dbId) return { ...log, id: dbId }
    }
  } catch {}
  // Fallback to localStorage
  const existing = getLocalLogs()
  localStorage.setItem(STORAGE_KEY, JSON.stringify([log, ...existing]))
  return log
}

export async function deleteLog(id: string): Promise<void> {
  try {
    const userId = await getCurrentUserId()
    if (userId) {
      await deleteLogFromDB(id)
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
import { upsertProfile, getProfile } from './supabase-db'

const NUMEROLOGY_KEY = 'synchrosoul_numerology'

export async function saveNumerologyProfile(profile: NumerologyProfile): Promise<void> {
  if (typeof window === 'undefined') return
  localStorage.setItem(NUMEROLOGY_KEY, JSON.stringify(profile))
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
  } catch {}
}

export async function getNumerologyProfile(): Promise<NumerologyProfile | null> {
  try {
    const userId = await getCurrentUserId()
    if (userId) {
      const dbProfile = await getProfile()
      if (dbProfile?.life_path) {
        return {
          name: dbProfile.display_name ?? '',
          birthdate: dbProfile.birthdate ?? '',
          lifePath: dbProfile.life_path ?? 0,
          soulUrge: dbProfile.soul_urge ?? 0,
          destiny: dbProfile.destiny ?? 0,
          lifePathMeaning: '',
          lifePathColor: '#9b59b6',
        } as NumerologyProfile
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
  const logs = getLocalLogs().map(l => l.id === id ? { ...l, shared: !l.shared } : l)
  localStorage.setItem('synchrosoul_logs', JSON.stringify(logs))
}
