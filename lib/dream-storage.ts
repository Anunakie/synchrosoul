// lib/dream-storage.ts
import { getDreamReading } from './dream-meanings'
import { getCurrentUserId, getDreamsFromDB, saveDreamToDB, deleteDreamFromDB } from './supabase-db'

export interface DreamEntry {
  id: string
  title: string
  description: string
  symbols: string[]
  moods: string[]
  angelNumbers: string[]
  reading: string
  voiceNoteUrl: string | null
  createdAt: string
}

const DREAM_KEY = 'synchrosoul_dreams'

function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2)
}

function getLocalDreams(): DreamEntry[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(DREAM_KEY)
    if (!raw) return []
    return JSON.parse(raw) as DreamEntry[]
  } catch { return [] }
}

export async function getDreams(): Promise<DreamEntry[]> {
  try {
    const userId = await getCurrentUserId()
    if (userId) {
      const dbDreams = await getDreamsFromDB()
      const localDreams = getLocalDreams()
      // Merge: db dreams take priority, add any local-only dreams
      const dbIds = new Set(dbDreams.map(d => d.id))
      const localOnly = localDreams.filter(d => !dbIds.has(d.id))
      return [...dbDreams, ...localOnly]
    }
  } catch {}
  return getLocalDreams()
}

export async function migrateLocalDreamsToSupabase(): Promise<{ migrated: number }> {
  try {
    const userId = await getCurrentUserId()
    if (!userId) return { migrated: 0 }
    const localDreams = getLocalDreams()
    if (localDreams.length === 0) return { migrated: 0 }
    const dbDreams = await getDreamsFromDB()
    const dbMinutes = new Set(dbDreams.map(d => d.createdAt.slice(0, 16)))
    let migrated = 0
    const failed: DreamEntry[] = []
    for (const dream of localDreams) {
      const minute = dream.createdAt.slice(0, 16)
      if (dbMinutes.has(minute)) continue
      try {
        await saveDreamToDB({
          title: dream.title,
          description: dream.description,
          symbols: dream.symbols,
          moods: dream.moods,
          angelNumbers: dream.angelNumbers,
          reading: dream.reading,
        })
        migrated++
      } catch {
        failed.push(dream)
      }
    }
    if (migrated > 0) {
      console.log('[SynchroSoul] Migrated', migrated, 'dreams to Supabase')
      if (failed.length === 0) {
        localStorage.removeItem(DREAM_KEY)
      } else {
        localStorage.setItem(DREAM_KEY, JSON.stringify(failed))
      }
    }
    return { migrated }
  } catch (e) {
    console.error('[SynchroSoul] Dream migration error:', e)
    return { migrated: 0 }
  }
}

export async function saveDream(data: {
  title: string
  description: string
  symbols: string[]
  moods: string[]
  angelNumbers: string[]
  voiceNoteUrl: string | null
}): Promise<DreamEntry> {
  const reading = getDreamReading(data.symbols, data.angelNumbers)
  const dream: DreamEntry = {
    id: generateId(),
    title: data.title,
    description: data.description,
    symbols: data.symbols,
    moods: data.moods,
    angelNumbers: data.angelNumbers,
    reading,
    voiceNoteUrl: data.voiceNoteUrl,
    createdAt: new Date().toISOString(),
  }
  try {
    const userId = await getCurrentUserId()
    if (userId) {
      const dbId = await saveDreamToDB({ ...data, reading })
      if (dbId) return { ...dream, id: dbId }
    }
  } catch {}
  const existing = getLocalDreams()
  localStorage.setItem(DREAM_KEY, JSON.stringify([dream, ...existing]))
  return dream
}

export async function deleteDream(id: string): Promise<void> {
  try {
    const userId = await getCurrentUserId()
    if (userId) {
      await deleteDreamFromDB(id)
      // Also remove from localStorage if present
      const local = getLocalDreams().filter(d => d.id !== id)
      localStorage.setItem(DREAM_KEY, JSON.stringify(local))
      return
    }
  } catch {}
  const dreams = getLocalDreams().filter(d => d.id !== id)
  localStorage.setItem(DREAM_KEY, JSON.stringify(dreams))
}

export async function searchDreams(query: string): Promise<DreamEntry[]> {
  const all = await getDreams()
  const q = query.toLowerCase().trim()
  if (!q) return all
  return all.filter(d =>
    d.title.toLowerCase().includes(q) ||
    d.description.toLowerCase().includes(q) ||
    d.symbols.some(s => s.toLowerCase().includes(q)) ||
    d.angelNumbers.some(n => n.includes(q))
  )
}
