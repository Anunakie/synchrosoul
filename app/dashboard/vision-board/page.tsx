'use client'
import { useState, useEffect } from 'react'

const BOARD_KEY = 'synchrosoul_vision_board_v2'

const CATEGORIES = [
  { id: 'love', label: 'Love & Relationships', emoji: '💞', color: '#f472b6' },
  { id: 'abundance', label: 'Abundance & Career', emoji: '🌟', color: '#c9a84c' },
  { id: 'health', label: 'Health & Vitality', emoji: '🌿', color: '#34d399' },
  { id: 'purpose', label: 'Purpose & Growth', emoji: '◈', color: '#a78bfa' },
  { id: 'travel', label: 'Travel & Adventure', emoji: '🌍', color: '#60a5fa' },
  { id: 'home', label: 'Home & Sanctuary', emoji: '🏡', color: '#fb923c' },
  { id: 'spiritual', label: 'Spiritual Evolution', emoji: '✨', color: '#e879f9' },
  { id: 'creativity', label: 'Creativity & Art', emoji: '🎨', color: '#f59e0b' },
]

const EMOJIS = ['🌟','💞','🔥','🌍','🏡','💫','🌹','💎','🛸','🏆','💰','🌊','✨','🌙','🦋','🌴','🎨','📝','🎵','🧠']

interface VisionItem {
  id: number
  text: string
  category: string
  emoji: string
  affirmation: string
  createdAt: string
  achieved: boolean
}

export default function VisionBoardPage() {
  const [items, setItems] = useState<VisionItem[]>([])
  const [activeCategory, setActiveCategory] = useState('all')
  const [showAdd, setShowAdd] = useState(false)
  const [newText, setNewText] = useState('')
  const [newCat, setNewCat] = useState('love')
  const [newEmoji, setNewEmoji] = useState('🌟')
  const [newAffirmation, setNewAffirmation] = useState('')
  const [view, setView] = useState<'grid' | 'list'>('grid')

  useEffect(() => {
    const saved = localStorage.getItem(BOARD_KEY)
    if (saved) setItems(JSON.parse(saved))
  }, [])

  function save(next: VisionItem[]) {
    setItems(next)
    localStorage.setItem(BOARD_KEY, JSON.stringify(next))
  }

  function addItem() {
    if (!newText.trim()) return
    const item: VisionItem = {
      id: Date.now(), text: newText.trim(), category: newCat,
      emoji: newEmoji, affirmation: newAffirmation.trim() || `I am manifesting ${newText.trim().toLowerCase()}.`,
      createdAt: new Date().toISOString(), achieved: false,
    }
    save([...items, item])
    setNewText(''); setNewAffirmation(''); setShowAdd(false)
  }

  function toggleAchieved(id: number) {
    save(items.map(i => i.id === id ? { ...i, achieved: !i.achieved } : i))
  }

  function deleteItem(id: number) {
    save(items.filter(i => i.id !== id))
  }

  const filtered = activeCategory === 'all' ? items : items.filter(i => i.category === activeCategory)
  const achieved = items.filter(i => i.achieved).length
  const card = { background: 'rgba(8,6,28,0.88)', border: '1px solid rgba(200,180,255,0.12)', borderRadius: '1.25rem', backdropFilter: 'blur(12px)' } as React.CSSProperties

  return (
    <div style={{ maxWidth: '680px', margin: '0 auto', padding: '1.5rem 1rem 2rem' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
        <div>
          <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.8rem', color: 'rgba(220,200,255,0.95)', margin: '0 0 0.25rem', fontWeight: 400 }}>Vision Board</h1>
          <p style={{ color: 'rgba(180,160,255,0.5)', fontSize: '0.8rem', margin: 0 }}>{achieved}/{items.length} visions manifested</p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button onClick={() => setView(v => v === 'grid' ? 'list' : 'grid')} style={{ padding: '0.4rem 0.75rem', borderRadius: '0.625rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(200,180,255,0.12)', color: 'rgba(180,160,255,0.6)', fontSize: '0.75rem', cursor: 'pointer' }}>{view === 'grid' ? '☰ List' : '⊡ Grid'}</button>
          <button onClick={() => setShowAdd(s => !s)} style={{ padding: '0.4rem 0.875rem', borderRadius: '0.625rem', background: 'linear-gradient(135deg, #7c3aed, #a78bfa)', border: 'none', color: 'white', fontSize: '0.75rem', cursor: 'pointer', fontWeight: 600 }}>+ Add Vision</button>
        </div>
      </div>

      {/* Progress bar */}
      {items.length > 0 && (
        <div style={{ ...card, padding: '1rem 1.25rem', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <span style={{ color: 'rgba(180,160,255,0.5)', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Manifestation Progress</span>
            <span style={{ color: '#c9a84c', fontSize: '0.78rem', fontWeight: 600 }}>{items.length > 0 ? Math.round((achieved / items.length) * 100) : 0}%</span>
          </div>
          <div style={{ height: '6px', borderRadius: '3px', background: 'rgba(255,255,255,0.05)' }}>
            <div style={{ height: '100%', width: `${items.length > 0 ? (achieved / items.length) * 100 : 0}%`, background: 'linear-gradient(90deg, #7c3aed, #c9a84c)', borderRadius: '3px', transition: 'width 0.5s' }} />
          </div>
        </div>
      )}

      {/* Add form */}
      {showAdd && (
        <div style={{ ...card, padding: '1.25rem', marginBottom: '1rem' }}>
          <div style={{ marginBottom: '0.75rem' }}>
            <div style={{ color: 'rgba(180,160,255,0.4)', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>Choose Emoji</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
              {EMOJIS.map(e => (
                <button key={e} onClick={() => setNewEmoji(e)} style={{ width: '2rem', height: '2rem', borderRadius: '0.5rem', background: newEmoji === e ? 'rgba(167,139,250,0.2)' : 'rgba(255,255,255,0.04)', border: newEmoji === e ? '1px solid rgba(167,139,250,0.5)' : '1px solid rgba(200,180,255,0.08)', cursor: 'pointer', fontSize: '1rem' }}>{e}</button>
              ))}
            </div>
          </div>
          <input value={newText} onChange={e => setNewText(e.target.value)} placeholder="What do you want to manifest?" style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(200,180,255,0.15)', borderRadius: '0.75rem', padding: '0.65rem 0.875rem', color: 'rgba(220,200,255,0.9)', fontSize: '0.88rem', outline: 'none', boxSizing: 'border-box', marginBottom: '0.5rem' }} />
          <input value={newAffirmation} onChange={e => setNewAffirmation(e.target.value)} placeholder="Affirmation (optional)" style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(200,180,255,0.15)', borderRadius: '0.75rem', padding: '0.65rem 0.875rem', color: 'rgba(220,200,255,0.9)', fontSize: '0.88rem', outline: 'none', boxSizing: 'border-box', marginBottom: '0.5rem' }} />
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <select value={newCat} onChange={e => setNewCat(e.target.value)} style={{ flex: 1, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(200,180,255,0.15)', borderRadius: '0.75rem', padding: '0.5rem', color: 'rgba(180,160,255,0.8)', fontSize: '0.8rem', outline: 'none' }}>
              {CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.emoji} {c.label}</option>)}
            </select>
            <button onClick={addItem} style={{ padding: '0.5rem 1.25rem', borderRadius: '0.75rem', background: 'linear-gradient(135deg, #7c3aed, #a78bfa)', border: 'none', color: 'white', fontSize: '0.82rem', cursor: 'pointer', fontWeight: 600 }}>Add</button>
          </div>
        </div>
      )}

      {/* Category filter */}
      <div style={{ display: 'flex', gap: '0.4rem', overflowX: 'auto', paddingBottom: '0.5rem', marginBottom: '1rem' }}>
        <button onClick={() => setActiveCategory('all')} style={{ flexShrink: 0, padding: '0.35rem 0.75rem', borderRadius: '2rem', border: activeCategory === 'all' ? '1px solid rgba(167,139,250,0.5)' : '1px solid rgba(200,180,255,0.1)', background: activeCategory === 'all' ? 'rgba(167,139,250,0.15)' : 'rgba(8,6,28,0.7)', color: activeCategory === 'all' ? '#a78bfa' : 'rgba(180,160,255,0.5)', fontSize: '0.72rem', cursor: 'pointer', whiteSpace: 'nowrap' }}>✦ All ({items.length})</button>
        {CATEGORIES.map(c => {
          const count = items.filter(i => i.category === c.id).length
          if (count === 0) return null
          return (
            <button key={c.id} onClick={() => setActiveCategory(c.id)} style={{ flexShrink: 0, padding: '0.35rem 0.75rem', borderRadius: '2rem', border: activeCategory === c.id ? `1px solid ${c.color}66` : '1px solid rgba(200,180,255,0.1)', background: activeCategory === c.id ? `${c.color}18` : 'rgba(8,6,28,0.7)', color: activeCategory === c.id ? c.color : 'rgba(180,160,255,0.5)', fontSize: '0.72rem', cursor: 'pointer', whiteSpace: 'nowrap' }}>{c.emoji} {c.label.split(' ')[0]} ({count})</button>
          )
        })}
      </div>

      {/* Items */}
      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>💫</div>
          <p style={{ color: 'rgba(180,160,255,0.4)', fontSize: '0.88rem', marginBottom: '1rem' }}>Your vision board is empty. Add your first vision above.</p>
        </div>
      ) : view === 'grid' ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem' }}>
          {filtered.map(item => {
            const cat = CATEGORIES.find(c => c.id === item.category)
            return (
              <div key={item.id} style={{ ...card, padding: '1.25rem', borderColor: item.achieved ? `${cat?.color || '#a78bfa'}44` : 'rgba(200,180,255,0.12)', opacity: item.achieved ? 0.7 : 1, position: 'relative', overflow: 'hidden' }}>
                {item.achieved && <div style={{ position: 'absolute', top: '0.5rem', right: '0.5rem', background: 'rgba(52,211,153,0.15)', border: '1px solid rgba(52,211,153,0.3)', borderRadius: '2rem', padding: '0.1rem 0.4rem', fontSize: '0.6rem', color: '#34d399' }}>✓ Done</div>}
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{item.emoji}</div>
                <p style={{ color: item.achieved ? 'rgba(180,160,255,0.5)' : 'rgba(220,200,255,0.88)', fontSize: '0.85rem', margin: '0 0 0.5rem', lineHeight: 1.4, textDecoration: item.achieved ? 'line-through' : 'none' }}>{item.text}</p>
                <p style={{ color: 'rgba(180,160,255,0.4)', fontSize: '0.72rem', margin: '0 0 0.75rem', lineHeight: 1.4, fontStyle: 'italic' }}>{item.affirmation}</p>
                <div style={{ display: 'flex', gap: '0.4rem' }}>
                  <button onClick={() => toggleAchieved(item.id)} style={{ flex: 1, padding: '0.35rem', borderRadius: '0.5rem', background: item.achieved ? 'rgba(52,211,153,0.1)' : 'rgba(167,139,250,0.1)', border: item.achieved ? '1px solid rgba(52,211,153,0.25)' : '1px solid rgba(167,139,250,0.2)', color: item.achieved ? '#34d399' : '#a78bfa', fontSize: '0.7rem', cursor: 'pointer' }}>{item.achieved ? 'Unmark' : '✓ Done'}</button>
                  <button onClick={() => deleteItem(item.id)} style={{ padding: '0.35rem 0.5rem', borderRadius: '0.5rem', background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.15)', color: 'rgba(239,68,68,0.5)', fontSize: '0.7rem', cursor: 'pointer' }}>✕</button>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          {filtered.map(item => {
            const cat = CATEGORIES.find(c => c.id === item.category)
            return (
              <div key={item.id} style={{ ...card, padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', gap: '0.875rem', opacity: item.achieved ? 0.7 : 1 }}>
                <span style={{ fontSize: '1.5rem', flexShrink: 0 }}>{item.emoji}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ color: 'rgba(220,200,255,0.88)', fontSize: '0.88rem', margin: '0 0 0.2rem', textDecoration: item.achieved ? 'line-through' : 'none' }}>{item.text}</p>
                  <p style={{ color: 'rgba(180,160,255,0.4)', fontSize: '0.72rem', margin: 0, fontStyle: 'italic' }}>{item.affirmation}</p>
                </div>
                <div style={{ display: 'flex', gap: '0.4rem', flexShrink: 0 }}>
                  <button onClick={() => toggleAchieved(item.id)} style={{ padding: '0.35rem 0.6rem', borderRadius: '0.5rem', background: item.achieved ? 'rgba(52,211,153,0.1)' : 'rgba(167,139,250,0.1)', border: item.achieved ? '1px solid rgba(52,211,153,0.25)' : '1px solid rgba(167,139,250,0.2)', color: item.achieved ? '#34d399' : '#a78bfa', fontSize: '0.7rem', cursor: 'pointer' }}>{item.achieved ? '✓' : 'Done'}</button>
                  <button onClick={() => deleteItem(item.id)} style={{ padding: '0.35rem 0.5rem', borderRadius: '0.5rem', background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.15)', color: 'rgba(239,68,68,0.5)', fontSize: '0.7rem', cursor: 'pointer' }}>✕</button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
