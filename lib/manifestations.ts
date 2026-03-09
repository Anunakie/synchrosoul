
export interface Manifestation {
  id: string
  title: string
  description: string
  angelNumber: string
  category: string
  status: 'seed' | 'growing' | 'blooming' | 'manifested'
  createdAt: string
  manifestedAt?: string
  notes: string
  affirmation: string
  evidence: string
}

const KEY = 'synchrosoul_manifestations'

export const STATUS_INFO = {
  seed: { label: 'Seed Planted', emoji: '🌱', color: 'rgba(100,200,120,0.6)', desc: 'Setting the intention' },
  growing: { label: 'Growing', emoji: '🌿', color: 'rgba(80,180,255,0.6)', desc: 'Signs are appearing' },
  blooming: { label: 'Blooming', emoji: '🌸', color: 'rgba(240,100,200,0.6)', desc: 'Almost here' },
  manifested: { label: 'Manifested!', emoji: '✨', color: 'rgba(201,168,76,0.8)', desc: 'It arrived!' },
}

export function getManifestations(): Manifestation[] {
  if (typeof window === 'undefined') return []
  try { return JSON.parse(localStorage.getItem(KEY) || '[]') } catch { return [] }
}

export function saveManifest(m: Omit<Manifestation, 'id' | 'createdAt'>): Manifestation {
  const all = getManifestations()
  const item: Manifestation = { ...m, id: Date.now().toString(), createdAt: new Date().toISOString() }
  all.unshift(item)
  localStorage.setItem(KEY, JSON.stringify(all))
  return item
}

export function updateManifest(id: string, updates: Partial<Manifestation>): void {
  const all = getManifestations().map(m => m.id === id ? { ...m, ...updates } : m)
  localStorage.setItem(KEY, JSON.stringify(all))
}

export function deleteManifest(id: string): void {
  localStorage.setItem(KEY, JSON.stringify(getManifestations().filter(m => m.id !== id)))
}
