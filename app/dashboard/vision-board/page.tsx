'use client'
import { useState, useEffect } from 'react'

const KEY = 'synchrosoul_vision_board'

interface VisionItem {
  id: string
  text: string
  category: string
  emoji: string
  createdAt: string
  achieved: boolean
  targetDate?: string
}

const CATEGORIES = [
  { id: 'love', label: 'Love & Soul', emoji: '💗' },
  { id: 'abundance', label: 'Abundance', emoji: '✨' },
  { id: 'health', label: 'Health', emoji: '🌿' },
  { id: 'purpose', label: 'Purpose', emoji: '🔥' },
  { id: 'spiritual', label: 'Spiritual', emoji: '🌙' },
  { id: 'freedom', label: 'Freedom', emoji: '🕊️' },
]

const PROMPTS = [
  'I am attracting my perfect soul connection...',
  'My ideal life looks like...',
  'I am abundant in...',
  'My body feels...',
  'My purpose is...',
  'I am free to...',
  'The universe is guiding me toward...',
  'I am becoming someone who...',
]

export default function VisionBoardPage() {
  const [items, setItems] = useState<VisionItem[]>([])
  const [text, setText] = useState('')
  const [category, setCategory] = useState('love')
  const [targetDate, setTargetDate] = useState('')
  const [filter, setFilter] = useState('all')
  const [showForm, setShowForm] = useState(false)
  const [promptIdx, setPromptIdx] = useState(0)

  useEffect(() => {
    try { setItems(JSON.parse(localStorage.getItem(KEY) || '[]')) } catch {}
    setPromptIdx(Math.floor(Math.random() * PROMPTS.length))
  }, [])

  function save(updated: VisionItem[]) {
    setItems(updated)
    localStorage.setItem(KEY, JSON.stringify(updated))
  }

  function addItem() {
    if (!text.trim()) return
    const item: VisionItem = {
      id: Date.now().toString(),
      text: text.trim(),
      category,
      emoji: CATEGORIES.find(c => c.id === category)?.emoji || '✨',
      createdAt: new Date().toISOString(),
      achieved: false,
      targetDate: targetDate || undefined,
    }
    save([item, ...items])
    setText('')
    setTargetDate('')
    setShowForm(false)
  }

  function toggleAchieved(id: string) {
    save(items.map(i => i.id === id ? { ...i, achieved: !i.achieved } : i))
  }

  function deleteItem(id: string) {
    save(items.filter(i => i.id !== id))
  }

  const filtered = filter === 'all' ? items : filter === 'achieved' ? items.filter(i => i.achieved) : items.filter(i => i.category === filter && !i.achieved)
  const achievedCount = items.filter(i => i.achieved).length

  const card: React.CSSProperties = { background: 'rgba(8,6,28,0.88)', border: '1px solid rgba(200,180,255,0.12)', borderRadius: '1.25rem', backdropFilter: 'blur(12px)', padding: '1.25rem', marginBottom: '0.875rem' }

  return (
    <div style={{ maxWidth: '560px', margin: '0 auto', padding: '1.5rem 1rem 2rem' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
        <div>
          <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.8rem', color: 'rgba(220,200,255,0.95)', margin: '0 0 0.25rem', fontWeight: 400 }}>Vision Board</h1>
          <p style={{ color: 'rgba(180,160,255,0.5)', fontSize: '0.8rem', margin: 0 }}>Manifest your highest timeline</p>
        </div>
        {items.length > 0 && (
          <div style={{ textAlign: 'right' }}>
            <div style={{ color: '#4ade80', fontSize: '1.1rem', fontWeight: 700 }}>{achievedCount}/{items.length}</div>
            <div style={{ color: 'rgba(180,160,255,0.35)', fontSize: '0.62rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Manifested</div>
          </div>
        )}
      </div>

      {/* Add button */}
      {!showForm && (
        <button onClick={() => setShowForm(true)} style={{ width: '100%', padding: '0.875rem', borderRadius: '1rem', border: '1px dashed rgba(167,139,250,0.3)', background: 'rgba(167,139,250,0.05)', color: 'rgba(167,139,250,0.6)', fontSize: '0.88rem', cursor: 'pointer', marginBottom: '1rem', transition: 'all 0.2s' }}>
          + Add Vision
        </button>
      )}

      {/* Add form */}
      {showForm && (
        <div style={card}>
          <div style={{ color: 'rgba(180,160,255,0.4)', fontSize: '0.62rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.75rem' }}>New Vision</div>
          <textarea
            value={text} onChange={e => setText(e.target.value)}
            placeholder={PROMPTS[promptIdx]}
            rows={3}
            style={{ width: '100%', padding: '0.75rem', background: 'rgba(8,6,28,0.8)', border: '1px solid rgba(200,180,255,0.15)', borderRadius: '0.75rem', color: 'rgba(220,200,255,0.9)', fontSize: '0.88rem', outline: 'none', resize: 'none', boxSizing: 'border-box', marginBottom: '0.75rem', fontFamily: 'inherit', lineHeight: 1.6 }}
          />
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
            {CATEGORIES.map(c => (
              <button key={c.id} onClick={() => setCategory(c.id)} style={{ padding: '0.3rem 0.75rem', borderRadius: '9999px', border: category === c.id ? '1px solid rgba(167,139,250,0.5)' : '1px solid rgba(200,180,255,0.1)', background: category === c.id ? 'rgba(167,139,250,0.15)' : 'transparent', color: category === c.id ? '#a78bfa' : 'rgba(180,160,255,0.45)', fontSize: '0.75rem', cursor: 'pointer' }}>{c.emoji} {c.label}</button>
            ))}
          </div>
          <input type='date' value={targetDate} onChange={e => setTargetDate(e.target.value)} style={{ width: '100%', padding: '0.625rem 0.75rem', background: 'rgba(8,6,28,0.8)', border: '1px solid rgba(200,180,255,0.12)', borderRadius: '0.75rem', color: 'rgba(180,160,255,0.6)', fontSize: '0.82rem', outline: 'none', boxSizing: 'border-box', marginBottom: '0.75rem' }} />
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button onClick={addItem} style={{ flex: 1, padding: '0.75rem', borderRadius: '0.875rem', border: '1px solid rgba(167,139,250,0.3)', background: 'rgba(167,139,250,0.12)', color: '#a78bfa', fontSize: '0.85rem', cursor: 'pointer' }}>✦ Manifest</button>
            <button onClick={() => setShowForm(false)} style={{ padding: '0.75rem 1rem', borderRadius: '0.875rem', border: '1px solid rgba(200,180,255,0.1)', background: 'transparent', color: 'rgba(180,160,255,0.4)', fontSize: '0.85rem', cursor: 'pointer' }}>Cancel</button>
          </div>
        </div>
      )}

      {/* Filter */}
      {items.length > 0 && (
        <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '1rem', overflowX: 'auto', paddingBottom: '0.25rem' }}>
          <button onClick={() => setFilter('all')} style={{ padding: '0.3rem 0.75rem', borderRadius: '9999px', border: filter === 'all' ? '1px solid rgba(167,139,250,0.5)' : '1px solid rgba(200,180,255,0.1)', background: filter === 'all' ? 'rgba(167,139,250,0.15)' : 'transparent', color: filter === 'all' ? '#a78bfa' : 'rgba(180,160,255,0.4)', fontSize: '0.72rem', cursor: 'pointer', whiteSpace: 'nowrap' }}>All</button>
          {CATEGORIES.map(c => (
            <button key={c.id} onClick={() => setFilter(c.id)} style={{ padding: '0.3rem 0.75rem', borderRadius: '9999px', border: filter === c.id ? '1px solid rgba(167,139,250,0.5)' : '1px solid rgba(200,180,255,0.1)', background: filter === c.id ? 'rgba(167,139,250,0.15)' : 'transparent', color: filter === c.id ? '#a78bfa' : 'rgba(180,160,255,0.4)', fontSize: '0.72rem', cursor: 'pointer', whiteSpace: 'nowrap' }}>{c.emoji}</button>
          ))}
          <button onClick={() => setFilter('achieved')} style={{ padding: '0.3rem 0.75rem', borderRadius: '9999px', border: filter === 'achieved' ? '1px solid rgba(74,222,128,0.5)' : '1px solid rgba(200,180,255,0.1)', background: filter === 'achieved' ? 'rgba(74,222,128,0.1)' : 'transparent', color: filter === 'achieved' ? '#4ade80' : 'rgba(180,160,255,0.4)', fontSize: '0.72rem', cursor: 'pointer', whiteSpace: 'nowrap' }}>✓ Done</button>
        </div>
      )}

      {/* Items */}
      {filtered.length === 0 && items.length === 0 && (
        <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🌠</div>
          <p style={{ color: 'rgba(180,160,255,0.4)', fontSize: '0.85rem' }}>Your vision board is empty. Add your first manifestation above.</p>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
        {filtered.map(item => {
          const cat = CATEGORIES.find(c => c.id === item.category)
          return (
            <div key={item.id} style={{ background: item.achieved ? 'rgba(74,222,128,0.05)' : 'rgba(8,6,28,0.88)', border: item.achieved ? '1px solid rgba(74,222,128,0.2)' : '1px solid rgba(200,180,255,0.1)', borderRadius: '1rem', padding: '1rem', backdropFilter: 'blur(12px)', opacity: item.achieved ? 0.75 : 1 }}>
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                <button onClick={() => toggleAchieved(item.id)} style={{ width: '28px', height: '28px', borderRadius: '50%', border: item.achieved ? '1px solid rgba(74,222,128,0.5)' : '1px solid rgba(200,180,255,0.2)', background: item.achieved ? 'rgba(74,222,128,0.15)' : 'transparent', cursor: 'pointer', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', color: item.achieved ? '#4ade80' : 'transparent' }}>✓</button>
                <div style={{ flex: 1 }}>
                  <p style={{ color: item.achieved ? 'rgba(180,160,255,0.5)' : 'rgba(220,200,255,0.85)', fontSize: '0.88rem', lineHeight: 1.6, margin: '0 0 0.4rem', textDecoration: item.achieved ? 'line-through' : 'none' }}>{item.text}</p>
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
                    <span style={{ background: 'rgba(167,139,250,0.08)', border: '1px solid rgba(167,139,250,0.15)', borderRadius: '9999px', padding: '0.15rem 0.5rem', color: 'rgba(167,139,250,0.6)', fontSize: '0.65rem' }}>{cat?.emoji} {cat?.label}</span>
                    {item.targetDate && <span style={{ color: 'rgba(180,160,255,0.3)', fontSize: '0.65rem' }}>🗓 {item.targetDate}</span>}
                    {item.achieved && <span style={{ color: '#4ade80', fontSize: '0.65rem' }}>✓ Manifested</span>}
                  </div>
                </div>
                <button onClick={() => deleteItem(item.id)} style={{ background: 'none', border: 'none', color: 'rgba(248,113,113,0.3)', cursor: 'pointer', fontSize: '0.8rem', padding: '0.25rem', flexShrink: 0 }}>✕</button>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
