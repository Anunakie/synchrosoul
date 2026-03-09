// lib/daily-guidance.ts
// Step 7: Daily Guidance - personalized messages based on logs, numerology, and date

export interface DailyGuidance {
  date: string
  angelNumberOfDay: string
  angelNumberMeaning: string
  personalMessage: string
  numerologyForecast: string
  affirmation: string
  theme: string
  themeColor: string
  dateNumber: number
  streakMessage: string
  moonPhase: string
}

const THEMES: Record<number, { theme: string; color: string; forecast: string }> = {
  1: { theme: 'New Beginnings', color: '#e74c3c', forecast: 'A powerful day for initiating. Your energy is magnetic — start that thing you have been putting off.' },
  2: { theme: 'Harmony & Balance', color: '#3498db', forecast: 'Relationships and partnerships are highlighted. Listen as much as you speak today.' },
  3: { theme: 'Creative Expression', color: '#f39c12', forecast: 'Your creativity is amplified. Express yourself freely — art, words, music, movement.' },
  4: { theme: 'Foundation & Structure', color: '#27ae60', forecast: 'Build something lasting today. Focus on systems, routines, and grounding your visions.' },
  5: { theme: 'Change & Freedom', color: '#9b59b6', forecast: 'Expect the unexpected. Embrace shifts — they are redirections, not setbacks.' },
  6: { theme: 'Love & Nurturing', color: '#e91e63', forecast: 'Home, family, and heart matters are in focus. Give and receive care without guilt.' },
  7: { theme: 'Spiritual Insight', color: '#1abc9c', forecast: 'A deeply intuitive day. Meditate, journal, and trust the quiet knowing within you.' },
  8: { theme: 'Abundance & Power', color: '#c9a84c', forecast: 'Manifestation energy is high. Align your actions with your highest intentions.' },
  9: { theme: 'Completion & Release', color: '#607d8b', forecast: 'Something is completing. Release what no longer serves — make space for the new.' },
  11: { theme: 'Illumination', color: '#f0e6ff', forecast: 'Master number day. Your intuition is a direct channel. Pay attention to every sign.' },
  22: { theme: 'Master Builder', color: '#c9a84c', forecast: 'Extraordinary manifestation potential. Dream big and take one concrete step today.' },
  33: { theme: 'Divine Love', color: '#e91e63', forecast: 'A day of compassion and healing. Your presence alone uplifts those around you.' },
}

const ANGEL_OF_DAY: Record<number, { number: string; meaning: string }> = {
  1: { number: '111', meaning: 'Manifestation portal open. Your thoughts are seeds — plant wisely.' },
  2: { number: '222', meaning: 'Trust the process. Everything is aligning in divine timing.' },
  3: { number: '333', meaning: 'Your guides are near. You are protected and supported.' },
  4: { number: '444', meaning: 'Stability and foundation. The universe has your back.' },
  5: { number: '555', meaning: 'Major transformation incoming. Embrace the shift.' },
  6: { number: '666', meaning: 'Rebalance your thoughts. Return to love and gratitude.' },
  7: { number: '777', meaning: 'You are on the right path. Keep going.' },
  8: { number: '888', meaning: 'Abundance flows to you. Receive without resistance.' },
  9: { number: '999', meaning: 'A chapter closes. Trust the ending — it is a beginning.' },
  0: { number: '1010', meaning: 'Infinite potential. You are exactly where you need to be.' },
}

const AFFIRMATIONS: Record<number, string[]> = {
  1: ['I am a powerful creator of my reality.', 'I boldly begin what my soul calls me toward.', 'My energy opens doors that were made for me.'],
  2: ['I attract harmonious connections.', 'I trust the divine timing of my life.', 'My sensitivity is my superpower.'],
  3: ['I express my truth with joy and freedom.', 'Creativity flows through me effortlessly.', 'I am a channel for beauty and inspiration.'],
  4: ['I build my dreams one grounded step at a time.', 'I am safe, stable, and supported.', 'My discipline creates my destiny.'],
  5: ['I embrace change as divine redirection.', 'I am free to evolve and expand.', 'Adventure and growth are my natural state.'],
  6: ['I give and receive love freely.', 'My heart is a sanctuary of peace.', 'I nurture myself as I nurture others.'],
  7: ['I trust my inner knowing completely.', 'I am connected to infinite wisdom.', 'Stillness reveals all the answers I seek.'],
  8: ['I am a magnet for abundance and opportunity.', 'I step into my power with grace.', 'Prosperity flows to me from all directions.'],
  9: ['I release with love what no longer serves me.', 'I am complete and whole right now.', 'My compassion transforms the world around me.'],
}

const MOON_PHASES = ['New Moon', 'Waxing Crescent', 'First Quarter', 'Waxing Gibbous', 'Full Moon', 'Waning Gibbous', 'Last Quarter', 'Waning Crescent']

function reduceToSingleDigit(n: number): number {
  if (n === 11 || n === 22 || n === 33) return n
  while (n > 9) {
    n = String(n).split('').reduce((s, d) => s + parseInt(d), 0)
    if (n === 11 || n === 22 || n === 33) return n
  }
  return n
}

function getDateNumber(date: Date): number {
  const d = date.getDate() + (date.getMonth() + 1) + date.getFullYear()
  return reduceToSingleDigit(d)
}

function getMoonPhase(date: Date): string {
  const known = new Date('2000-01-06')
  const diff = (date.getTime() - known.getTime()) / (1000 * 60 * 60 * 24)
  const cycle = diff % 29.53
  const idx = Math.floor((cycle / 29.53) * 8)
  return MOON_PHASES[Math.max(0, Math.min(7, idx))]
}

function getPersonalMessage(recentNumbers: string[], lifePath: number | null, dateNum: number, streak: number): string {
  const msgs: string[] = []

  if (streak >= 7) msgs.push(`Your ${streak}-day streak radiates powerful intention. The universe is listening.`)
  else if (streak >= 3) msgs.push(`${streak} days of conscious logging — your awareness is sharpening.`)

  if (recentNumbers.length > 0) {
    const top = recentNumbers[0]
    if (top === '1111') msgs.push('The 1111 portal you have been seeing is a direct invitation to manifest. Write down your deepest desire today.')
    else if (top === '555') msgs.push('The 555 energy you are experiencing signals a life upgrade in progress. Trust the turbulence.')
    else if (top === '333') msgs.push('Your guides are amplifying their presence through 333. You are never alone on this path.')
    else if (top === '444') msgs.push('The 444 you keep seeing is celestial confirmation — your foundation is solid. Build on it.')
    else if (top === '777') msgs.push('777 is the universe applauding your spiritual growth. You are exactly on track.')
    else if (top === '888') msgs.push('888 is activating your abundance frequency. Open your hands and your heart to receive.')
    else if (top === '999') msgs.push('999 is asking you to complete something. What have you been avoiding finishing?')
    else if (top === '222') msgs.push('222 is a reminder that your patience is not passive — it is powerful co-creation.')
    else msgs.push(`The ${top} sequence appearing in your life carries a message meant specifically for you right now.`)
  }

  if (lifePath) {
    const lpMessages: Record<number, string> = {
      1: 'As a Life Path 1, today amplifies your natural leadership. Step forward.',
      2: 'As a Life Path 2, your gift of harmony is needed in your relationships today.',
      3: 'As a Life Path 3, your creative voice wants to be heard. Let it out.',
      4: 'As a Life Path 4, your steady energy builds something beautiful today.',
      5: 'As a Life Path 5, your freedom-seeking spirit finds a new door today.',
      6: 'As a Life Path 6, your nurturing heart is your greatest gift today.',
      7: 'As a Life Path 7, your intuition is your compass. Follow it without question.',
      8: 'As a Life Path 8, your manifestation power is at peak today.',
      9: 'As a Life Path 9, your wisdom and compassion light the way for others.',
      11: 'As a Master 11, you are a spiritual lighthouse. Your sensitivity is sacred.',
      22: 'As a Master 22, your visions can become reality. Think big, act grounded.',
      33: 'As a Master 33, your love heals. Simply being yourself is enough.',
    }
    if (lpMessages[lifePath]) msgs.push(lpMessages[lifePath])
  }

  if (msgs.length === 0) msgs.push('Every number you notice is a breadcrumb on your path. Keep logging, keep noticing.')
  return msgs.join(' ')
}

export function generateDailyGuidance(
  recentNumbers: string[],
  lifePath: number | null,
  streak: number
): DailyGuidance {
  const today = new Date()
  const dateNum = getDateNumber(today)
  const themeData = THEMES[dateNum] || THEMES[1]
  const angelData = ANGEL_OF_DAY[today.getDate() % 10] || ANGEL_OF_DAY[1]
  const affirmList = AFFIRMATIONS[dateNum] || AFFIRMATIONS[1]
  const affirmation = affirmList[today.getDate() % affirmList.length]
  const moonPhase = getMoonPhase(today)

  const streakMessages: Record<number, string> = {
    0: 'Start your streak today',
    1: 'Day 1 — the journey begins',
    2: '2 days — momentum building',
    3: '3 days — a pattern is forming',
    7: '7 days — one full week of awareness',
    14: '14 days — two weeks of cosmic attunement',
    21: '21 days — a new habit of consciousness',
    30: '30 days — a full moon cycle of logging',
  }
  const streakMsg = streakMessages[streak] ||
    (streak >= 30 ? `${streak} days — you are deeply attuned` :
     streak >= 7 ? `${streak}-day streak — keep the energy flowing` :
     `${streak} days logged`)

  return {
    date: today.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }),
    angelNumberOfDay: angelData.number,
    angelNumberMeaning: angelData.meaning,
    personalMessage: getPersonalMessage(recentNumbers, lifePath, dateNum, streak),
    numerologyForecast: themeData.forecast,
    affirmation,
    theme: themeData.theme,
    themeColor: themeData.color,
    dateNumber: dateNum,
    streakMessage: streakMsg,
    moonPhase,
  }
}

export function getStreak(logs: Array<{ createdAt: string }>): number {
  if (!logs.length) return 0
  const days = new Set(logs.map(l => new Date(l.createdAt).toDateString()))
  let streak = 0
  const today = new Date()
  for (let i = 0; i < 365; i++) {
    const d = new Date(today)
    d.setDate(d.getDate() - i)
    if (days.has(d.toDateString())) streak++
    else if (i > 0) break
  }
  return streak
}
