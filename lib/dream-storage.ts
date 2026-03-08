import { getDreamReading } from './dream-meanings'

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

export function getDreams(): DreamEntry[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(DREAM_KEY)
    if (!raw) return []
    return JSON.parse(raw) as DreamEntry[]
  } catch {
    return []
  }
}

export function saveDream(data: {
  title: string
  description: string
  symbols: string[]
  moods: string[]
  angelNumbers: string[]
  voiceNoteUrl: string | null
}): DreamEntry {
  const reading = getDreamReading(data.symbols, data.angelNumbers)
  const entry: DreamEntry = {
    id: generateId(),
    title: data.title || 'Untitled Dream',
    description: data.description,
    symbols: data.symbols,
    moods: data.moods,
    angelNumbers: data.angelNumbers,
    reading,
    voiceNoteUrl: data.voiceNoteUrl,
    createdAt: new Date().toISOString(),
  }
  const existing = getDreams()
  localStorage.setItem(DREAM_KEY, JSON.stringify([entry, ...existing]))
  return entry
}

export function deleteDream(id: string): void {
  const dreams = getDreams().filter(d => d.id !== id)
  localStorage.setItem(DREAM_KEY, JSON.stringify(dreams))
}

export function searchDreams(query: string): DreamEntry[] {
  const q = query.toLowerCase().trim()
  if (!q) return getDreams()
  return getDreams().filter(d =>
    d.title.toLowerCase().includes(q) ||
    d.description.toLowerCase().includes(q) ||
    d.symbols.some(s => s.includes(q)) ||
    d.angelNumbers.some(n => n.includes(q)) ||
    d.moods.some(m => m.toLowerCase().includes(q))
  )
}
