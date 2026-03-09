'use client'
import { useState, useEffect } from 'react'

interface VisionCard {
  id: string
  title: string
  description: string
  category: string
  color: string
  emoji: string
  number: string
  createdAt: string
  achieved: boolean
}

const CATEGORIES = [
  { id: 'love', label: 'Love', emoji: '💕', color: '#ff6b9d' },
  { id: 'abundance', label: 'Abundance', emoji: '✨', color: '#c9a84c' },
  { id: 'health', label: 'Health', emoji: '🌿', color: '#34d399' },
  { id: 'purpose', label: 'Purpose', emoji: '🌟', color: '#a78bfa' },
  { id: 'travel', label: 'Travel', emoji: '🌍', color: '#60a5fa' },
  { id: 'growth', label: 'Growth', emoji: '🌱', color: '#4ade80' },
  { id: 'creativity', label: 'Creativity', emoji: '🎨', color: '#fb923c' },
  { id: 'spiritual', label: 'Spiritual', emoji: '🕊️', color: '#e0e7ff' },
]

const VISION_NUMBERS = ['111','222','333','444','555','777','888','999','1111']

const STORAGE_KEY = 'synchrosoul_vision_board'

function loadCards(): VisionCard[] {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]') } catch { return [] }
}
function saveCards(cards: VisionCard[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(cards))
}

export default function VisionBoardPage() {
  const [cards, setCards] = useState<VisionCard[]>([])
  const [showForm, setShowForm] = useState(false)
  const [filter, setFilter] = useState('all')
  const [form, setForm] = useState({ title: '', description: '', category: 'love', number: '111' })

  useEffect(() => { setCards(loadCards()) }, [])

  function addCard() {
    if (!form.title.trim()) return
    const cat = CATEGORIES.find(c => c.id === form.category)!
    const card: VisionCard = {
      id: Date.now().toString(),
      title: form.title,
      description: form.description,
      category: form.category,
      color: cat.color,
      emoji: cat.emoji,
      number: form.number,
      createdAt: new Date().toISOString(),
      achieved: false,
    }
    const updated = [card, ...cards]
    setCards(updated)
    saveCards(updated)
    setForm({ title: '', description: '', category: 'love', number: '111' })
    setShowForm(false)
  }

  function toggleAchieved(id: string) {
    const updated = cards.map(c => c.id === id ? { ...c, achieved: !c.achieved } : c)
    setCards(updated)
    saveCards(updated)
  }

  function deleteCard(id: string) {
    const updated = cards.filter(c => c.id !== id)
    setCards(updated)
    saveCards(updated)
  }

  const filtered = filter === 'all' ? cards : filter === 'achieved' ? cards.filter(c => c.achieved) : cards.filter(c => c.category === filter)
  const achievedCount = cards.filter(c => c.achieved).length

  const card = { background: 'rgba(8,6,28,0.88)', border: '1px solid rgba(200,180,255,0.12)', borderRadius: '1.25rem', backdropFilter: 'blur(12px)' } as React.CSSProperties
  const inp = { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(200,180,255,0.15)', borderRadius: '0.6rem', color: 'rgba(220,200,255,0.9)', padding: '0.65rem 0.85rem', fontSize: '0.85rem', width: '100%', outline: 'none', boxSizing: 'border-box' as const, fontFamily: 'inherit' }

  return (
    <div style={{ maxWidth: '640px', margin: '0 auto', padding: '1.5rem 1rem 2rem' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.8rem', color: 'rgba(220,200,255,0.95)', margin: '0 0 0.25rem', fontWeight: 400 }}>Vision Board</h1>
          <p style={{ color: 'rgba(180,160,255,0.5)', fontSize: '0.8rem', margin: 0 }}>{achievedCount} of {cards.length} visions manifested</p>
        </div>
        <button onClick={() => setShowForm(s => !s)} style={{ padding: '0.6rem 1.25rem', borderRadius: '2rem', cursor: 'pointer', background: 'rgba(201,168,76,0.18)', border: '1px solid rgba(201,168,76,0.4)', color: '#c9a84c', fontSize: '0.82rem', fontFamily: 'inherit', fontWeight: 600, flexShrink: 0 }}>+ Add Vision</button>
      </div>

      {/* Add form */}
      {showForm && (
        <div style={{ ...card, padding: '1.5rem', marginBottom: '1.25rem', border: '1px solid rgba(201,168,76,0.25)' }}>
          <div style={{ color: 'rgba(180,160,255,0.4)', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1rem' }}>New Vision</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <input style={inp} placeholder="Your vision (e.g. My dream home by the ocean)" value={form.title} onChange={e => setForm({...form, title: e.target.value})} />
            <textarea style={{ ...inp, minHeight: '80px', resize: 'vertical' as const }} placeholder="Describe it in vivid detail..." value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div>
                <div style={{ color: 'rgba(180,160,255,0.4)', fontSize: '0.65rem', marginBottom: '0.4rem' }}>Category</div>
                <select style={{ ...inp, cursor: 'pointer' }} value={form.category} onChange={e => setForm({...form, category: e.target.value})}>
                  {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.emoji} {c.label}</option>)}
                </select>
              </div>
              <div>
                <div style={{ color: 'rgba(180,160,255,0.4)', fontSize: '0.65rem', marginBottom: '0.4rem' }}>Angel Number</div>
                <select style={{ ...inp, cursor: 'pointer' }} value={form.number} onChange={e => setForm({...form, number: e.target.value})}>
                  {VISION_NUMBERS.map(n => <option key={n} value={n}>{n}</option>)}
                </select>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button onClick={addCard} style={{ flex: 1, padding: '0.75rem', borderRadius: '0.6rem', cursor: 'pointer', background: 'rgba(201,168,76,0.18)', border: '1px solid rgba(201,168,76,0.4)', color: '#c9a84c', fontSize: '0.88rem', fontFamily: 'inherit', fontWeight: 600 }}>✦ Add to Board</button>
              <button onClick={() => setShowForm(false)} style={{ padding: '0.75rem 1rem', borderRadius: '0.6rem', cursor: 'pointer', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(200,180,255,0.1)', color: 'rgba(180,160,255,0.5)', fontSize: '0.88rem', fontFamily: 'inherit' }}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Filter chips */}
      <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '1.25rem', overflowX: 'auto', paddingBottom: '0.25rem' }}>
        {[{ id: 'all', label: 'All', emoji: '✦' }, { id: 'achieved', label: 'Manifested', emoji: '✅' }, ...CATEGORIES].map(f => (
          <button key={f.id} onClick={() => setFilter(f.id)} style={{ padding: '0.35rem 0.75rem', borderRadius: '2rem', cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.72rem', whiteSpace: 'nowrap', background: filter === f.id ? 'rgba(167,139,250,0.2)' : 'rgba(255,255,255,0.04)', border: filter === f.id ? '1px solid rgba(167,139,250,0.5)' : '1px solid rgba(200,180,255,0.1)', color: filter === f.id ? 'rgba(220,200,255,0.95)' : 'rgba(180,160,255,0.5)', transition: 'all 0.2s' }}>
            {f.emoji} {f.label}
          </button>
        ))}
      </div>

      {/* Cards grid */}
      {filtered.length === 0 ? (
        <div style={{ ...card, padding: '3rem', textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>🌌</div>
          <div style={{ color: 'rgba(180,160,255,0.5)', fontSize: '0.88rem' }}>Your vision board is empty.</div>
          <div style={{ color: 'rgba(180,160,255,0.35)', fontSize: '0.78rem', marginTop: '0.25rem' }}>Add your first vision to begin manifesting.</div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem' }}>
          {filtered.map(c => (
            <div key={c.id} style={{ ...card, padding: '1.25rem', border: c.achieved ? `1px solid ${c.color}55` : `1px solid ${c.color}22`, background: c.achieved ? `${c.color}0d` : 'rgba(8,6,28,0.88)', position: 'relative', overflow: 'hidden' }}>
              {c.achieved && <div style={{ position: 'absolute', top: '-30px', right: '-30px', width: '80px', height: '80px', borderRadius: '50%', background: `radial-gradient(circle, ${c.color}20 0%, transparent 70%)`, pointerEvents: 'none' }} />}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '1.5rem' }}>{c.emoji}</span>
                <div style={{ display: 'flex', gap: '0.3rem' }}>
                  <button onClick={() => toggleAchieved(c.id)} title={c.achieved ? 'Mark as pending' : 'Mark as manifested'} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.9rem', opacity: c.achieved ? 1 : 0.4 }}>✅</button>
                  <button onClick={() => deleteCard(c.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.75rem', color: 'rgba(180,160,255,0.3)' }}>✕</button>
                </div>
              </div>
              <div style={{ color: c.achieved ? c.color : 'rgba(220,200,255,0.9)', fontSize: '0.88rem', fontWeight: 600, marginBottom: '0.3rem', lineHeight: 1.3 }}>{c.title}</div>
              {c.description && <div style={{ color: 'rgba(180,160,255,0.55)', fontSize: '0.72rem', lineHeight: 1.5, marginBottom: '0.5rem' }}>{c.description}</div>}
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <span style={{ padding: '0.15rem 0.5rem', borderRadius: '2rem', background: `${c.color}12`, border: `1px solid ${c.color}25`, color: c.color, fontSize: '0.65rem' }}>{c.number}</span>
                {c.achieved && <span style={{ color: c.color, fontSize: '0.65rem', fontWeight: 600 }}>Manifested ✦</span>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
