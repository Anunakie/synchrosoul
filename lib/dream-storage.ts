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
      if (dbDreams.length > 0) return dbDreams
    }
  } catch {}
  return getLocalDreams()
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
