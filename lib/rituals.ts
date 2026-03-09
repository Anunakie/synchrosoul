export interface Ritual {
  id: string
  number: string
  title: string
  duration: string
  moonPhase: string
  color: string
  emoji: string
  intention: string
  steps: string[]
  affirmation: string
  bestTime: string
}

export const RITUALS: Ritual[] = [
  {
    id: 'new-beginnings-111',
    number: '111',
    title: 'New Beginnings Ritual',
    duration: '10 min',
    moonPhase: 'New Moon',
    color: '#a78bfa',
    emoji: '🌑',
    intention: 'Plant seeds of your deepest desires',
    bestTime: 'New moon, sunrise, or when you see 111',
    steps: [
      'Light a white or purple candle',
      'Write 3 intentions on paper — present tense, as if already true',
      'Hold the paper to your heart and breathe deeply 11 times',
      'Read each intention aloud with full feeling and conviction',
      'Fold the paper toward you (drawing things in) and place under your pillow',
      'Blow out the candle and say: It is done. It is so.',
    ],
    affirmation: 'I am a powerful creator. My intentions manifest with divine speed.',
  },
  {
    id: 'trust-222',
    number: '222',
    title: 'Divine Trust Ritual',
    duration: '7 min',
    moonPhase: 'Waxing Crescent',
    color: '#34d399',
    emoji: '🌿',
    intention: 'Release control and surrender to divine timing',
    bestTime: 'When feeling impatient or anxious about outcomes',
    steps: [
      'Sit comfortably and place both hands on your heart',
      'Write down one thing you have been trying to force or control',
      'Read it aloud, then write beneath it: I release this to divine timing',
      'Take 7 slow breaths, each exhale longer than the inhale',
      'Tear the paper slowly and deliberately — this is your release',
      'Scatter the pieces outside or flush them away',
    ],
    affirmation: 'I trust the process. Everything is unfolding in perfect divine order.',
  },
  {
    id: 'creativity-333',
    number: '333',
    title: 'Creative Channel Ritual',
    duration: '15 min',
    moonPhase: 'First Quarter',
    color: '#fbbf24',
    emoji: '✨',
    intention: 'Open your creative channel to divine inspiration',
    bestTime: 'Morning, before creative work, or when blocked',
    steps: [
      'Light a yellow or gold candle',
      'Place your hands on a blank page or canvas',
      'Close your eyes and ask: What wants to be created through me today?',
      'Without thinking, write or draw for 5 minutes — do not stop or edit',
      'Read or look at what emerged with curiosity, not judgment',
      'Circle one word, image, or idea that surprises you — that is your message',
    ],
    affirmation: 'I am a clear channel for divine creativity. My gifts are needed in this world.',
  },
  {
    id: 'protection-444',
    number: '444',
    title: 'Angelic Protection Ritual',
    duration: '5 min',
    moonPhase: 'Any phase',
    color: '#60a5fa',
    emoji: '🛡️',
    intention: 'Call in your guardian angels and create a field of protection',
    bestTime: 'Morning, before travel, or when feeling unsafe',
    steps: [
      'Stand with feet shoulder-width apart, grounded',
      'Visualize a pillar of white light entering through your crown',
      'Call aloud or silently: Guardian angels, surround me on all four sides',
      'Imagine four wings of light wrapping around you — front, back, left, right',
      'Place your right hand on your heart and say: I am protected. I am safe.',
      'Take 4 deep breaths, feeling the protection solidify with each one',
    ],
    affirmation: 'I am divinely protected. My angels walk beside me always.',
  },
  {
    id: 'change-555',
    number: '555',
    title: 'Sacred Change Ritual',
    duration: '12 min',
    moonPhase: 'Full Moon',
    color: '#f97316',
    emoji: '🔥',
    intention: 'Release the old and welcome transformation',
    bestTime: 'Full moon, or when a major change is approaching',
    steps: [
      'Light a candle — orange or red for transformation',
      'Write everything you are releasing: habits, fears, relationships, identities',
      'Read each item aloud and say: I release you with love and gratitude',
      'Safely burn the paper (or tear it into tiny pieces)',
      'Write on a fresh page: I welcome the new. I am ready.',
      'Dance, shake your body, or move freely for 2 minutes — physically embody the change',
    ],
    affirmation: 'I embrace change as divine redirection. I am becoming who I was always meant to be.',
  },
  {
    id: 'abundance-888',
    number: '888',
    title: 'Infinite Abundance Ritual',
    duration: '10 min',
    moonPhase: 'Waxing Gibbous',
    color: '#fcd34d',
    emoji: '💛',
    intention: 'Open your receiving channel and align with abundance',
    bestTime: 'Thursday (Jupiter day), or when you see 888',
    steps: [
      'Hold a coin or green crystal in your dominant hand',
      'Write 8 things you are grateful for — be specific and feel each one',
      'Say aloud: I am worthy of receiving. I am open to abundance in all forms.',
      'Visualize money, love, health, and joy flowing toward you like a river',
      'Place the coin or crystal on your written list',
      'Leave it there for 8 hours as an abundance anchor',
    ],
    affirmation: 'Abundance flows to me easily and effortlessly. I receive with an open heart.',
  },
  {
    id: 'completion-999',
    number: '999',
    title: 'Sacred Completion Ritual',
    duration: '20 min',
    moonPhase: 'Waning Moon',
    color: '#f43f5e',
    emoji: '🌕',
    intention: 'Honor what is ending and prepare for the new cycle',
    bestTime: 'Waning moon, end of month, or major life transitions',
    steps: [
      'Create a quiet, sacred space with candles and anything meaningful to you',
      'Write a letter to the chapter that is closing — thank it for everything it taught you',
      'Write a letter to your future self — who are you becoming?',
      'Read both letters aloud with full presence',
      'Safely burn or bury the first letter — it is complete',
      'Keep the second letter sealed. Open it in 90 days.',
    ],
    affirmation: 'I honor every ending as a sacred graduation. I step forward with wisdom and grace.',
  },
  {
    id: 'awakening-1111',
    number: '1111',
    title: 'Master Awakening Ritual',
    duration: '11 min',
    moonPhase: 'New Moon or 11th of any month',
    color: '#e879f9',
    emoji: '👁️',
    intention: 'Activate your highest potential and soul mission',
    bestTime: '11:11 AM or PM, new moon, or when you see 1111',
    steps: [
      'Sit in meditation at exactly 11:11 if possible',
      'Write your soul mission statement: I am here to...',
      'List 11 things that make you feel most alive and aligned',
      'Circle the one that scares you most — that is your calling',
      'Write one action you will take this week toward that calling',
      'Seal your commitment by signing your name and the date',
      'Place your hand on the paper and say: I activate my highest path. I am ready.',
    ],
    affirmation: 'I am awake. I am aligned. I am fulfilling my soul mission with courage and joy.',
  },
]

export function getRitualForNumber(number: string): Ritual | undefined {
  return RITUALS.find(r => r.number === number)
}

export function getAllRituals(): Ritual[] {
  return RITUALS
}

const RITUAL_LOG_KEY = 'synchrosoul_ritual_log'

export interface RitualLog {
  ritualId: string
  completedAt: string
  intention: string
  reflection: string
}

export function getRitualLogs(): RitualLog[] {
  if (typeof window === 'undefined') return []
  try { return JSON.parse(localStorage.getItem(RITUAL_LOG_KEY) || '[]') } catch { return [] }
}

export function saveRitualLog(log: RitualLog) {
  const logs = getRitualLogs()
  logs.unshift(log)
  localStorage.setItem(RITUAL_LOG_KEY, JSON.stringify(logs.slice(0, 50)))
}
