
export interface Badge {
  id: string
  name: string
  emoji: string
  description: string
  color: string
  unlocked: boolean
  unlockedAt?: string
}

const BADGE_DEFS = [
  { id: 'first_log', name: 'First Sighting', emoji: '👁️', description: 'Log your first angel number', color: '#c9a84c', threshold: 1, type: 'logs' },
  { id: 'logs_7', name: 'Week Watcher', emoji: '🌟', description: 'Log 7 angel numbers', color: '#a78bfa', threshold: 7, type: 'logs' },
  { id: 'logs_33', name: 'Sacred 33', emoji: '✦', description: 'Log 33 angel numbers', color: '#fbbf24', threshold: 33, type: 'logs' },
  { id: 'logs_111', name: 'Angel Aligned', emoji: '👼', description: 'Log 111 angel numbers', color: '#60a5fa', threshold: 111, type: 'logs' },
  { id: 'streak_3', name: 'Trinity Streak', emoji: '🔥', description: '3-day logging streak', color: '#f87171', threshold: 3, type: 'streak' },
  { id: 'streak_7', name: 'Sacred Week', emoji: '💫', description: '7-day logging streak', color: '#f472b6', threshold: 7, type: 'streak' },
  { id: 'streak_30', name: 'Moon Cycle', emoji: '🌕', description: '30-day logging streak', color: '#c9a84c', threshold: 30, type: 'streak' },
  { id: 'streak_111', name: 'Ascended', emoji: '🦋', description: '111-day logging streak', color: '#e0e7ff', threshold: 111, type: 'streak' },
  { id: 'truth_1', name: 'Truth Seeker', emoji: '📸', description: 'First Angel Approved entry', color: '#34d399', threshold: 1, type: 'truth' },
  { id: 'truth_11', name: 'Verified Mystic', emoji: '✅', description: '11 Angel Approved entries', color: '#34d399', threshold: 11, type: 'truth' },
  { id: 'numbers_3', name: 'Number Collector', emoji: '🔢', description: 'Log 3 different angel numbers', color: '#818cf8', threshold: 3, type: 'unique' },
  { id: 'numbers_7', name: 'Cosmic Decoder', emoji: '🔮', description: 'Log 7 different angel numbers', color: '#a78bfa', threshold: 7, type: 'unique' },
  { id: 'numbers_12', name: 'Full Spectrum', emoji: '🌈', description: 'Log 12 different angel numbers', color: '#fbbf24', threshold: 12, type: 'unique' },
  { id: 'dream_1', name: 'Dream Walker', emoji: '🌙', description: 'Record your first dream', color: '#818cf8', threshold: 1, type: 'dreams' },
  { id: 'dream_7', name: 'Lucid Soul', emoji: '💤', description: 'Record 7 dreams', color: '#a78bfa', threshold: 7, type: 'dreams' },
]

const BADGES_KEY = 'synchrosoul_badges'

export function checkAndAwardBadges(stats: {
  totalLogs: number
  streak: number
  truthCount: number
  uniqueNumbers: number
  dreamCount: number
}): Badge[] {
  const saved: Record<string, string> = JSON.parse(localStorage.getItem(BADGES_KEY) || '{}')
  const newlyUnlocked: Badge[] = []

  for (const def of BADGE_DEFS) {
    if (saved[def.id]) continue
    let val = 0
    if (def.type === 'logs') val = stats.totalLogs
    else if (def.type === 'streak') val = stats.streak
    else if (def.type === 'truth') val = stats.truthCount
    else if (def.type === 'unique') val = stats.uniqueNumbers
    else if (def.type === 'dreams') val = stats.dreamCount

    if (val >= def.threshold) {
      saved[def.id] = new Date().toISOString()
      newlyUnlocked.push({ ...def, unlocked: true, unlockedAt: saved[def.id] })
    }
  }

  localStorage.setItem(BADGES_KEY, JSON.stringify(saved))
  return newlyUnlocked
}

export function getAllBadges(stats: {
  totalLogs: number
  streak: number
  truthCount: number
  uniqueNumbers: number
  dreamCount: number
}): Badge[] {
  const saved: Record<string, string> = typeof window !== 'undefined'
    ? JSON.parse(localStorage.getItem(BADGES_KEY) || '{}')
    : {}

  return BADGE_DEFS.map(def => {
    let val = 0
    if (def.type === 'logs') val = stats.totalLogs
    else if (def.type === 'streak') val = stats.streak
    else if (def.type === 'truth') val = stats.truthCount
    else if (def.type === 'unique') val = stats.uniqueNumbers
    else if (def.type === 'dreams') val = stats.dreamCount
    const unlocked = !!saved[def.id] || val >= def.threshold
    return { ...def, unlocked, unlockedAt: saved[def.id] }
  })
}
