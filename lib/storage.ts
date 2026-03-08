import { getAngelMeaning } from './angel-meanings'

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

export function getLogs(): AngelLog[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    return JSON.parse(raw) as AngelLog[]
  } catch {
    return []
  }
}

export function saveLog(data: {
  number: string
  thought: string
  screenshotUrl: string | null
}): AngelLog {
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
  const existing = getLogs()
  const updated = [log, ...existing]
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated))
  return log
}

export function deleteLog(id: string): void {
  const logs = getLogs().filter(l => l.id !== id)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(logs))
}

export function toggleShare(id: string): void {
  const logs = getLogs().map(l => l.id === id ? { ...l, shared: !l.shared } : l)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(logs))
}

export function searchLogs(query: string): AngelLog[] {
  const q = query.toLowerCase().trim()
  if (!q) return getLogs()
  return getLogs().filter(l =>
    l.number.includes(q) ||
    l.thought.toLowerCase().includes(q) ||
    l.readingTitle.toLowerCase().includes(q) ||
    l.miniReading.toLowerCase().includes(q)
  )
}

export function getStats() {
  const logs = getLogs()
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
