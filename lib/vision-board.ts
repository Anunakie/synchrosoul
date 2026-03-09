
export interface VisionCard {
  id: string
  title: string
  intention: string
  angelNumber: string
  category: 'love' | 'career' | 'health' | 'abundance' | 'spiritual' | 'relationships' | 'creativity' | 'freedom'
  color: string
  emoji: string
  createdAt: string
  affirmation: string
  status: 'dreaming' | 'believing' | 'receiving'
}

const KEY = 'synchrosoul_vision_board'

export const CATEGORIES = [
  { id: 'love', label: 'Love', emoji: '💗', color: 'rgba(255,100,150,0.7)' },
  { id: 'career', label: 'Career', emoji: '✨', color: 'rgba(201,168,76,0.7)' },
  { id: 'health', label: 'Health', emoji: '🌿', color: 'rgba(80,200,120,0.7)' },
  { id: 'abundance', label: 'Abundance', emoji: '💰', color: 'rgba(255,200,50,0.7)' },
  { id: 'spiritual', label: 'Spiritual', emoji: '🔮', color: 'rgba(167,139,250,0.7)' },
  { id: 'relationships', label: 'Connections', emoji: '🤝', color: 'rgba(100,180,255,0.7)' },
  { id: 'creativity', label: 'Creativity', emoji: '🎨', color: 'rgba(255,140,80,0.7)' },
  { id: 'freedom', label: 'Freedom', emoji: '🕊️', color: 'rgba(180,220,255,0.7)' },
] as const

export function getCards(): VisionCard[] {
  if (typeof window === 'undefined') return []
  try { return JSON.parse(localStorage.getItem(KEY) || '[]') } catch { return [] }
}

export function saveCard(card: Omit<VisionCard, 'id' | 'createdAt'>): VisionCard {
  const cards = getCards()
  const newCard: VisionCard = { ...card, id: Date.now().toString(), createdAt: new Date().toISOString() }
  cards.unshift(newCard)
  localStorage.setItem(KEY, JSON.stringify(cards))
  return newCard
}

export function updateCard(id: string, updates: Partial<VisionCard>): void {
  const cards = getCards().map(c => c.id === id ? { ...c, ...updates } : c)
  localStorage.setItem(KEY, JSON.stringify(cards))
}

export function deleteCard(id: string): void {
  const cards = getCards().filter(c => c.id !== id)
  localStorage.setItem(KEY, JSON.stringify(cards))
}
