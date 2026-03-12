import { getLogs } from './storage'
import { ANGEL_MEANINGS } from './angel-meanings'

export interface OracleReading {
  question: string
  category: string
  response: string
  guidingNumber: string
  guidingMeaning: string
  guidingColor: string
  numerologyNote: string
  timestamp: string
  isAI?: boolean
}

// Fallback static responses if AI is unavailable
const FALLBACK_RESPONSES = [
  'The numbers you have been seeing carry a unified message: you are exactly where you need to be.',
  'Your question holds the answer within it. The universe responds to the energy behind the words.',
  'Trust the timing. Your angel number history shows a soul that is awake and listening.',
  'The cosmos has heard your question. Your recent number patterns suggest the answer is already in motion.',
]

function detectCategory(question: string): string {
  const lower = question.toLowerCase()
  const keywords: Record<string, string> = {
    job: 'career', work: 'career', career: 'career', business: 'career', money: 'career',
    love: 'love', relationship: 'love', partner: 'love', soulmate: 'love', dating: 'love',
    should: 'decision', choose: 'decision', decision: 'decision', move: 'decision',
    health: 'health', body: 'health', heal: 'health', sick: 'health', energy: 'health',
  }
  for (const [keyword, category] of Object.entries(keywords)) {
    if (lower.includes(keyword)) return category
  }
  return 'default'
}

function getStoredNumerology() {
  if (typeof window === 'undefined') return null
  try {
    const stored = localStorage.getItem('synchrosoul_numerology')
    return stored ? JSON.parse(stored) : null
  } catch {
    return null
  }
}

export async function askOracle(question: string): Promise<OracleReading> {
  const logs = await getLogs()
  const recent = logs.slice(0, 15)
  const category = detectCategory(question)

  // Get numerology profile from localStorage
  const numerologyProfile = getStoredNumerology()

  // Determine guiding number from most frequent
  const freq: Record<string, number> = {}
  recent.forEach(l => { freq[l.number] = (freq[l.number] || 0) + 1 })
  const guidingNumber = Object.entries(freq).sort((a, b) => b[1] - a[1])[0]?.[0]
    || recent[0]?.number
    || '111'

  const meaning = ANGEL_MEANINGS[guidingNumber] || ANGEL_MEANINGS['111']

  let response = FALLBACK_RESPONSES[Math.floor(Math.random() * FALLBACK_RESPONSES.length)]
  let isAI = false

  // Try to get real AI response
  try {
    const res = await fetch('/api/oracle', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        question,
        logs: recent,
        numerologyProfile,
      }),
    })

    if (res.ok) {
      const data = await res.json()
      if (data.response) {
        response = data.response
        isAI = data.isAI || false
      }
    }
  } catch (err) {
    console.warn('AI oracle unavailable, using fallback:', err)
  }

  const numerologyNotes = [
    `Your most frequent number ${guidingNumber} amplifies this reading with its energy of ${meaning?.keywords?.[0] || 'transformation'}.`,
    `The universe speaks through ${guidingNumber} — your guiding light for this question.`,
    `With ${recent.length} recent sightings, your connection to the angelic realm is strong right now.`,
  ]

  return {
    question,
    category,
    response,
    guidingNumber,
    guidingMeaning: meaning?.message || 'A powerful cosmic signal',
    guidingColor: meaning?.color || '#c9a84c',
    numerologyNote: numerologyNotes[Math.floor(Math.random() * numerologyNotes.length)],
    timestamp: new Date().toISOString(),
    isAI,
  }
}

const ORACLE_HISTORY_KEY = 'synchrosoul_oracle_history'

export function getOracleHistory(): OracleReading[] {
  if (typeof window === 'undefined') return []
  try { return JSON.parse(localStorage.getItem(ORACLE_HISTORY_KEY) || '[]') } catch { return [] }
}

export function saveOracleReading(reading: OracleReading) {
  const history = getOracleHistory()
  history.unshift(reading)
  localStorage.setItem(ORACLE_HISTORY_KEY, JSON.stringify(history.slice(0, 20)))
}
