import { getLogs } from './storage'
import { ANGEL_MEANINGS } from './angel-meanings'

export interface CosmicPattern {
  number: string
  count: number
  meaning: string
  keyword: string
  color: string
  thoughts: string[]
}

export interface WeeklySynthesis {
  weekStart: string
  weekEnd: string
  totalLogs: number
  dominantNumber: string
  patterns: CosmicPattern[]
  cosmicStory: string
  insight: string
  affirmation: string
  verifiedCount: number
}

function getWeekRange() {
  const now = new Date()
  const day = now.getDay()
  const start = new Date(now)
  start.setDate(now.getDate() - day)
  start.setHours(0,0,0,0)
  const end = new Date(start)
  end.setDate(start.getDate() + 6)
  end.setHours(23,59,59,999)
  return { start, end }
}

export function generateWeeklySynthesis(): WeeklySynthesis {
  const logs = getLogs()
  const { start, end } = getWeekRange()
  const weekLogs = logs.filter(l => {
    const d = new Date(l.createdAt)
    return d >= start && d <= end
  })

  const counts: Record<string, { count: number; thoughts: string[] }> = {}
  let verifiedCount = 0
  weekLogs.forEach(l => {
    if (!counts[l.number]) counts[l.number] = { count: 0, thoughts: [] }
    counts[l.number].count++
    if (l.thought) counts[l.number].thoughts.push(l.thought)
    if (l.screenshotUrl) verifiedCount++
  })

  const patterns: CosmicPattern[] = Object.entries(counts)
    .sort((a, b) => b[1].count - a[1].count)
    .slice(0, 5)
    .map(([number, data]) => {
      const meaning = ANGEL_MEANINGS[number] || ANGEL_MEANINGS['default']
      return {
        number,
        count: data.count,
        meaning: meaning?.message || 'A powerful cosmic signal',
        keyword: meaning?.keywords?.[0] || 'transformation',
        color: meaning?.color || '#c9a84c',
        thoughts: data.thoughts.slice(0, 3),
      }
    })

  const dominant = patterns[0]
  const dominantNumber = dominant?.number || '111'

  const storyParts: string[] = []
  if (patterns.length === 0) {
    storyParts.push('The universe is waiting for you to begin logging your angel numbers.')
  } else {
    storyParts.push(`This week, ${dominantNumber} appeared ${dominant.count} times — a clear signal of ${dominant.keyword}.`)
    if (patterns.length > 1) {
      const second = patterns[1]
      storyParts.push(`Combined with ${second.number} (${second.keyword}), the universe weaves a story of aligned transformation.`)
    }
    if (dominant.thoughts.length > 0) {
      storyParts.push(`When you saw ${dominantNumber}, you were thinking: "${dominant.thoughts[0]}". This is not coincidence — it is alignment.`)
    }
    if (verifiedCount > 0) {
      storyParts.push(`${verifiedCount} sightings were verified with screenshots, earning Angel Approved status.`)
    }
  }

  const insights = [
    `Your dominant number ${dominantNumber} is calling you toward ${dominant?.keyword || 'awakening'}.`,
    'The patterns in your logs reveal a soul in active communication with the universe.',
    'Your angel numbers this week form a constellation of guidance — trust the sequence.',
  ]

  const affirmations = [
    'I am in perfect alignment with the universe plan for me.',
    'Every number I see is a love letter from the cosmos.',
    'I trust the divine timing of my journey.',
    'My soul recognizes the signs meant for me.',
  ]

  return {
    weekStart: start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    weekEnd: end.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    totalLogs: weekLogs.length,
    dominantNumber,
    patterns,
    cosmicStory: storyParts.join(' '),
    insight: insights[Math.floor(Math.random() * insights.length)],
    affirmation: affirmations[Math.floor(Math.random() * affirmations.length)],
    verifiedCount,
  }
}
