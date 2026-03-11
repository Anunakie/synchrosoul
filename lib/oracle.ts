import { getLogs } from './storage'
import { ANGEL_MEANINGS } from './angel-meanings'

const ORACLE_RESPONSES: Record<string, string[]> = {
  career: [
    'The numbers you have been seeing point to a period of aligned action. Trust the path that feels expansive, not just safe.',
    'Your angel numbers suggest a transition is divinely timed. The fear you feel is the old self resisting the new.',
    '444 energy surrounds career questions — your guides are building a foundation beneath you even when you cannot see it.',
  ],
  love: [
    'The universe mirrors your inner state. The love you seek is already within you, and your numbers confirm it is also approaching.',
    'Your recent logs show a pattern of awakening. In love, this means you are becoming ready for a connection that matches your true frequency.',
    'Twin flame energy is present in your number sequence. Stay open — the universe is orchestrating a meeting.',
  ],
  decision: [
    'When the same number appears before a decision, it is your higher self voting. Count the signs — they are your answer.',
    'Your logs reveal you already know the answer. The numbers are simply confirming what your soul whispered first.',
    'The pattern in your recent sightings suggests forward movement. Hesitation is human; your numbers are divine.',
  ],
  health: [
    'Your body and soul are in conversation. The numbers you see during moments of physical awareness are healing codes.',
    'Rest is sacred. Your angel numbers this week carry the frequency of restoration and renewal.',
    'Listen to the wisdom your body holds. Your numbers are guiding you toward balance.',
  ],
  default: [
    'The numbers you have been seeing this week carry a unified message: you are exactly where you need to be.',
    'Your question holds the answer within it. The universe responds to the energy behind the words, not just the words themselves.',
    'Trust the timing. Your angel number history shows a soul that is awake and listening — the answer will arrive in perfect sequence.',
    'The cosmos has heard your question. Your recent number patterns suggest the answer is already in motion.',
  ],
}

const QUESTION_KEYWORDS: Record<string, string> = {
  job: 'career', work: 'career', career: 'career', business: 'career', money: 'career',
  love: 'love', relationship: 'love', partner: 'love', soulmate: 'love', dating: 'love',
  should: 'decision', choose: 'decision', decision: 'decision', move: 'decision',
  health: 'health', body: 'health', heal: 'health', sick: 'health', energy: 'health',
}

function detectCategory(question: string): string {
  const lower = question.toLowerCase()
  for (const [keyword, category] of Object.entries(QUESTION_KEYWORDS)) {
    if (lower.includes(keyword)) return category
  }
  return 'default'
}

export interface OracleReading {
  question: string
  category: string
  response: string
  guidingNumber: string
  guidingMeaning: string
  guidingColor: string
  numerologyNote: string
  timestamp: string
}

export async function askOracle(question: string): Promise<OracleReading> {
  const logs = await getLogs()
  const recent = logs.slice(0, 10)
  const category = detectCategory(question)
  const responses = ORACLE_RESPONSES[category] || ORACLE_RESPONSES.default
  const response = responses[Math.floor(Math.random() * responses.length)]

  const guidingNumber = recent[0]?.number || '111'
  const meaning = ANGEL_MEANINGS[guidingNumber] || ANGEL_MEANINGS['default']

  const freq: Record<string, number> = {}
  recent.forEach(l => { freq[l.number] = (freq[l.number] || 0) + 1 })
  const topNumber = Object.entries(freq).sort((a,b) => b[1]-a[1])[0]?.[0] || guidingNumber

  const notes = [
    `Your most frequent number ${topNumber} amplifies this reading with its energy of ${ANGEL_MEANINGS[topNumber]?.keywords?.[0] || 'transformation'}.`,
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
    numerologyNote: notes[Math.floor(Math.random() * notes.length)],
    timestamp: new Date().toISOString(),
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
