
export interface CalendarDay {
  date: Date
  dateStr: string
  dayNumber: number
  universalDay: number
  moonPhase: string
  moonEmoji: string
  moonIllumination: number
  powerLevel: number // 1-10
  powerLabel: string
  powerColor: string
  theme: string
  isPersonalPowerDay: boolean
  isMasterDay: boolean
  affirmation: string
}

export interface MonthView {
  year: number
  month: number
  monthName: string
  days: CalendarDay[]
  personalMonthNumber: number
  personalMonthTheme: string
}

const MOON_PHASES = [
  { name: 'New Moon', emoji: '🌑', illumination: 0 },
  { name: 'Waxing Crescent', emoji: '🌒', illumination: 0.25 },
  { name: 'First Quarter', emoji: '🌓', illumination: 0.5 },
  { name: 'Waxing Gibbous', emoji: '🌔', illumination: 0.75 },
  { name: 'Full Moon', emoji: '🌕', illumination: 1 },
  { name: 'Waning Gibbous', emoji: '🌖', illumination: 0.75 },
  { name: 'Last Quarter', emoji: '🌗', illumination: 0.5 },
  { name: 'Waning Crescent', emoji: '🌘', illumination: 0.25 },
]

const DAY_THEMES: Record<number, { theme: string; color: string; label: string; affirmation: string }> = {
  1: { theme: 'New Beginnings', color: '#ff6b6b', label: 'Pioneer', affirmation: 'I boldly step into new territory' },
  2: { theme: 'Partnership', color: '#c9a84c', label: 'Harmonizer', affirmation: 'I attract divine connections' },
  3: { theme: 'Creative Expression', color: '#a78bfa', label: 'Creator', affirmation: 'My creativity flows freely' },
  4: { theme: 'Foundation', color: '#34d399', label: 'Builder', affirmation: 'I build lasting structures' },
  5: { theme: 'Freedom & Change', color: '#60a5fa', label: 'Explorer', affirmation: 'I embrace transformation' },
  6: { theme: 'Love & Healing', color: '#f472b6', label: 'Nurturer', affirmation: 'Love flows through me' },
  7: { theme: 'Spiritual Insight', color: '#818cf8', label: 'Mystic', affirmation: 'I trust divine wisdom' },
  8: { theme: 'Abundance', color: '#fbbf24', label: 'Manifestor', affirmation: 'Abundance flows to me' },
  9: { theme: 'Completion', color: '#f87171', label: 'Sage', affirmation: 'I release and complete with grace' },
  11: { theme: 'Illumination', color: '#e0e7ff', label: 'Lightworker', affirmation: 'I am a beacon of light' },
  22: { theme: 'Master Building', color: '#fde68a', label: 'Architect', affirmation: 'I build heaven on earth' },
  33: { theme: 'Master Teaching', color: '#fbcfe8', label: 'Master Healer', affirmation: 'I uplift all I encounter' },
}

function reduceToSingle(n: number): number {
  if (n === 11 || n === 22 || n === 33) return n
  if (n < 10) return n
  return reduceToSingle(n.toString().split('').reduce((a, d) => a + parseInt(d), 0))
}

export function getMoonPhase(date: Date): { name: string; emoji: string; illumination: number } {
  const known = new Date(2000, 0, 6) // known new moon
  const diff = (date.getTime() - known.getTime()) / (1000 * 60 * 60 * 24)
  const cycle = 29.53058867
  const phase = ((diff % cycle) + cycle) % cycle
  const idx = Math.floor((phase / cycle) * 8) % 8
  return MOON_PHASES[idx]
}

export function getUniversalDay(date: Date): number {
  const m = date.getMonth() + 1
  const d = date.getDate()
  const y = date.getFullYear()
  return reduceToSingle(m + d + reduceToSingle(y))
}

export function getPersonalDay(date: Date, lifePath: number): number {
  const ud = getUniversalDay(date)
  return reduceToSingle(ud + lifePath)
}

export function getPowerLevel(universalDay: number, moonIllumination: number): number {
  let base = universalDay === 11 || universalDay === 22 || universalDay === 33 ? 9 : universalDay
  const moonBoost = Math.round(moonIllumination * 3)
  return Math.min(10, base + moonBoost)
}

export function buildCalendarMonth(year: number, month: number, lifePath: number = 0): MonthView {
  const monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December']
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const personalMonth = reduceToSingle((month + 1) + lifePath + reduceToSingle(year))
  const monthTheme = DAY_THEMES[personalMonth]?.theme || 'Cosmic Flow'

  const days: CalendarDay[] = []
  for (let d = 1; d <= daysInMonth; d++) {
    const date = new Date(year, month, d)
    const moon = getMoonPhase(date)
    const ud = getUniversalDay(date)
    const pd = lifePath > 0 ? getPersonalDay(date, lifePath) : ud
    const power = getPowerLevel(pd, moon.illumination)
    const themeData = DAY_THEMES[pd] || DAY_THEMES[1]
    const isMaster = pd === 11 || pd === 22 || pd === 33
    const isPersonalPowerDay = power >= 8

    days.push({
      date,
      dateStr: date.toISOString().split('T')[0],
      dayNumber: d,
      universalDay: ud,
      moonPhase: moon.name,
      moonEmoji: moon.emoji,
      moonIllumination: moon.illumination,
      powerLevel: power,
      powerLabel: themeData.label,
      powerColor: themeData.color,
      theme: themeData.theme,
      isPersonalPowerDay,
      isMasterDay: isMaster,
      affirmation: themeData.affirmation,
    })
  }

  return { year, month, monthName: monthNames[month], days, personalMonthNumber: personalMonth, personalMonthTheme: monthTheme }
}
