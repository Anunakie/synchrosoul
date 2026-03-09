// lib/sync-matching.ts
export interface SyncProfile {
  id: string
  displayName: string
  avatar: string
  avatarColor: string
  numbers: string[]
  lifePathNumber: number
  soulUrgeNumber: number
  lastSeen: string
  syncScore: number
  sharedNumbers: string[]
  numerologyMatch: number
  timingScore: number
  bio?: string
}

const AVATAR_COLORS = [
  '#9b59b6','#3498db','#e74c3c','#2ecc71','#f39c12',
  '#1abc9c','#e91e63','#673ab7','#ff5722','#607d8b'
]

const MOCK_NAMES = [
  'Luna S.','Orion K.','Sage M.','River A.','Nova T.',
  'Zephyr L.','Iris W.','Phoenix R.','Celeste B.','Indigo P.',
  'Aurora V.','Cosmo J.','Lyra H.','Atlas D.','Soleil N.',
  'Ember C.','Caspian F.','Wren O.','Vesper G.','Onyx E.'
]

const MOCK_BIOS = [
  'Seeing 1111 everywhere lately',
  'On a spiritual awakening journey',
  'Numbers guide my path',
  'Manifesting my highest timeline',
  'Angel numbers changed my life',
  'Deep in my numerology era',
  'The universe keeps sending signs',
  'Trusting the cosmic flow',
]

const NUMEROLOGY_HARMONY: Record<number, number[]> = {
  1:[1,5,7], 2:[2,4,8], 3:[3,6,9], 4:[2,4,8],
  5:[1,5,7], 6:[3,6,9], 7:[1,5,7], 8:[2,4,8],
  9:[3,6,9], 11:[2,11,22], 22:[4,11,22], 33:[6,33],
}

export function calcNumerologyMatch(a: number, b: number): number {
  if (a === b) return 100
  const harmonics = NUMEROLOGY_HARMONY[a] || []
  if (harmonics.includes(b)) return 75
  const rootA = a > 9 ? a % 9 || 9 : a
  const rootB = b > 9 ? b % 9 || 9 : b
  if (rootA === rootB) return 60
  return 30
}

export function calcTimingScore(lastSeen: string): number {
  const hoursAgo = (Date.now() - new Date(lastSeen).getTime()) / 3600000
  if (hoursAgo < 1) return 100
  if (hoursAgo < 6) return 85
  if (hoursAgo < 12) return 70
  if (hoursAgo < 24) return 50
  if (hoursAgo < 48) return 30
  return 10
}

export function calcSyncScore(sharedNumbers: string[], numerologyMatch: number, timingScore: number): number {
  const numberScore = Math.min(sharedNumbers.length * 25, 60)
  return Math.round(Math.min(numberScore * 0.5 + numerologyMatch * 0.3 + timingScore * 0.2, 99))
}

export function getTimeAgo(iso: string): string {
  const mins = Math.floor((Date.now() - new Date(iso).getTime()) / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return mins + 'm ago'
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return hrs + 'h ago'
  return Math.floor(hrs / 24) + 'd ago'
}

export function getMockMatches(userNumbers: string[], userLifePath: number): SyncProfile[] {
  const now = Date.now()
  const pool = [
    { numbers: ['1111','555','333'], lp: 1, su: 3 },
    { numbers: ['1111','222'], lp: 7, su: 2 },
    { numbers: ['555','777','1111'], lp: 5, su: 9 },
    { numbers: ['333','444'], lp: 3, su: 6 },
    { numbers: ['888','1111'], lp: 8, su: 1 },
    { numbers: ['222','1212'], lp: 2, su: 4 },
    { numbers: ['777','999'], lp: 7, su: 5 },
    { numbers: ['555','333','1234'], lp: 5, su: 3 },
    { numbers: ['1111','444','888'], lp: 4, su: 8 },
    { numbers: ['999','333'], lp: 9, su: 6 },
    { numbers: ['1010','1111'], lp: 1, su: 1 },
    { numbers: ['222','555'], lp: 2, su: 7 },
  ]
  const profiles: SyncProfile[] = []
  pool.forEach((p, i) => {
    const shared = p.numbers.filter((n: string) => userNumbers.includes(n))
    const hoursBack = (i * 3.7) % 47
    const lastSeen = new Date(now - hoursBack * 3600000).toISOString()
    const numMatch = calcNumerologyMatch(userLifePath, p.lp)
    const timingScore = calcTimingScore(lastSeen)
    const effectiveShared = shared.length > 0 ? shared : [p.numbers[0]]
    const syncScore = calcSyncScore(effectiveShared, numMatch, timingScore)
    if (syncScore < 20 && shared.length === 0) return
    profiles.push({
      id: 'mock-' + i,
      displayName: MOCK_NAMES[i % MOCK_NAMES.length],
      avatar: MOCK_NAMES[i % MOCK_NAMES.length].split(' ').map((w: string) => w[0]).join(''),
      avatarColor: AVATAR_COLORS[i % AVATAR_COLORS.length],
      numbers: p.numbers,
      lifePathNumber: p.lp,
      soulUrgeNumber: p.su,
      lastSeen,
      syncScore,
      sharedNumbers: effectiveShared,
      numerologyMatch: numMatch,
      timingScore,
      bio: MOCK_BIOS[i % MOCK_BIOS.length],
    })
  })
  return profiles.sort((a, b) => b.syncScore - a.syncScore)
}
