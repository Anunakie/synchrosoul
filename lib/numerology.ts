// ── Numerology Calculator ─────────────────────────────────────────────────
// Calculates Life Path, Soul Urge, and Destiny numbers
// Master numbers 11, 22, 33 are preserved (not reduced further)

export interface NumerologyProfile {
  lifePath: number
  lifePathMeaning: string
  lifePathColor: string
  soulUrge?: number
  soulUrgeMeaning?: string
  destiny?: number
  destinyMeaning?: string
  birthdate: string // ISO string YYYY-MM-DD
}

const MASTER_NUMBERS = new Set([11, 22, 33])

// Reduce a number to single digit or master number
export function reduceNumber(n: number): number {
  while (n > 9 && !MASTER_NUMBERS.has(n)) {
    n = String(n).split('').reduce((sum, d) => sum + parseInt(d), 0)
  }
  return n
}

// Sum all digits of a string of numbers
function sumDigits(str: string): number {
  return str.replace(/\D/g, '').split('').reduce((sum, d) => sum + parseInt(d), 0)
}

// Life Path = reduce(month + day + year each reduced separately)
export function calcLifePath(birthdate: string): number {
  const [year, month, day] = birthdate.split('-').map(Number)
  if (!year || !month || !day) return 0
  const m = reduceNumber(month)
  const d = reduceNumber(day)
  const y = reduceNumber(sumDigits(String(year)))
  return reduceNumber(m + d + y)
}

// Pythagorean letter values
const LETTER_VALUES: Record<string, number> = {
  a:1,b:2,c:3,d:4,e:5,f:6,g:7,h:8,i:9,
  j:1,k:2,l:3,m:4,n:5,o:6,p:7,q:8,r:9,
  s:1,t:2,u:3,v:4,w:5,x:6,y:7,z:8
}
const VOWELS = new Set(['a','e','i','o','u'])

// Soul Urge = reduce sum of vowels in full name
export function calcSoulUrge(fullName: string): number {
  const sum = fullName.toLowerCase().split('').reduce((s, c) => {
    return VOWELS.has(c) ? s + (LETTER_VALUES[c] || 0) : s
  }, 0)
  return reduceNumber(sum)
}

// Destiny = reduce sum of all letters in full name
export function calcDestiny(fullName: string): number {
  const sum = fullName.toLowerCase().split('').reduce((s, c) => {
    return s + (LETTER_VALUES[c] || 0)
  }, 0)
  return reduceNumber(sum)
}

// ── Meanings ──────────────────────────────────────────────────────────────

export const LIFE_PATH_DATA: Record<number, { meaning: string; color: string; keyword: string; description: string }> = {
  1:  { keyword: 'The Leader',     color: '#ff6b6b', meaning: 'Independent, pioneering, original. You are here to lead and forge new paths.', description: 'You carry the energy of new beginnings. Your soul came here to create, initiate, and stand alone when necessary.' },
  2:  { keyword: 'The Peacemaker', color: '#a8d8ea', meaning: 'Sensitive, cooperative, diplomatic. You are here to unite and harmonize.', description: 'You feel everything deeply. Your gift is bringing people together and sensing what others cannot.' },
  3:  { keyword: 'The Creator',    color: '#f9ca24', meaning: 'Expressive, joyful, artistic. You are here to inspire through creativity.', description: 'Words, art, music — you channel the divine through expression. Your joy is contagious and your creativity is a gift to the world.' },
  4:  { keyword: 'The Builder',    color: '#6ab04c', meaning: 'Stable, disciplined, trustworthy. You are here to build lasting foundations.', description: 'You are the backbone of everything. Patient, methodical, and deeply reliable — you create structures that stand the test of time.' },
  5:  { keyword: 'The Adventurer', color: '#e17055', meaning: 'Free, curious, versatile. You are here to experience and evolve.', description: 'Change is your teacher. You crave freedom, variety, and the thrill of the unknown. You are here to taste everything life offers.' },
  6:  { keyword: 'The Nurturer',   color: '#fd79a8', meaning: 'Loving, responsible, healing. You are here to care and protect.', description: 'Your heart is your compass. You feel called to heal, nurture, and create beauty in the world around you.' },
  7:  { keyword: 'The Seeker',     color: '#a29bfe', meaning: 'Introspective, analytical, spiritual. You are here to seek truth.', description: 'You are drawn to the mysteries beneath the surface. Solitude is sacred to you — it is where you find your deepest wisdom.' },
  8:  { keyword: 'The Achiever',   color: '#fdcb6e', meaning: 'Powerful, ambitious, abundant. You are here to master the material world.', description: 'You understand power, money, and manifestation. Your soul came here to build empires — and to learn that true power comes from within.' },
  9:  { keyword: 'The Humanitarian', color: '#00cec9', meaning: 'Compassionate, wise, universal. You are here to serve humanity.', description: 'You carry the wisdom of all numbers. Your soul is ancient and your purpose is vast — to love unconditionally and serve the greater good.' },
  11: { keyword: 'The Illuminator', color: '#dfe6e9', meaning: 'Intuitive, visionary, inspiring. Master number — you are here to illuminate.', description: 'You are a spiritual messenger. Highly sensitive and deeply intuitive, you carry a light that others are drawn to without knowing why.' },
  22: { keyword: 'The Master Builder', color: '#b2bec3', meaning: 'Visionary, practical, powerful. Master number — you are here to build for humanity.', description: 'You have the vision of 11 and the grounding of 4. You are capable of manifesting dreams into reality on a massive scale.' },
  33: { keyword: 'The Master Teacher', color: '#fab1a0', meaning: 'Compassionate, selfless, healing. Master number — you are here to uplift all.', description: 'The rarest life path. You carry the energy of pure unconditional love and are here to teach, heal, and elevate human consciousness.' },
}

export function getLifePathData(n: number) {
  return LIFE_PATH_DATA[n] || LIFE_PATH_DATA[9]
}
