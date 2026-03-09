'use client'
import { useState, useEffect } from 'react'
import { getCards, saveCard, updateCard, deleteCard, CATEGORIES, VisionCard } from '@/lib/vision-board'

const STATUS_COLORS = {
  dreaming: { bg: 'rgba(100,120,255,0.15)', border: 'rgba(100,120,255,0.4)', label: '🌙 Dreaming' },
  believing: { bg: 'rgba(201,168,76,0.15)', border: 'rgba(201,168,76,0.4)', label: '✨ Believing' },
  receiving: { bg: 'rgba(80,200,120,0.15)', border: 'rgba(80,200,120,0.4)', label: '🌿 Receiving' },
}

export default function VisionBoardPage() {
  const [cards, setCards] = useState<VisionCard[]>([])
  const [showForm, setShowForm] = useState(false)
  const [filter, setFilter] = useState<string>('all')
  const [form, setForm] = useState({
    title: '', intention: '', angelNumber: '',
    category: 'spiritual' as VisionCard['category'],
    affirmation: '', status: 'dreaming' as VisionCard['status'],
  })

  useEffect(() => { setCards(getCards()) }, [])

  function handleAdd() {
    if (!form.title.trim()) return
    const cat = CATEGORIES.find(c => c.id === form.category)!
    saveCard({ ...form, color: cat.color, emoji: cat.emoji })
    setCards(getCards())
    setForm({ title: '', intention: '', angelNumber: '', category: 'spiritual', affirmation: '', status: 'dreaming' })
    setShowForm(false)
  }

  function cycleStatus(id: string, current: VisionCard['status']) {
    const next = current === 'dreaming' ? 'believing' : current === 'believing' ? 'receiving' : 'dreaming'
    updateCard(id, { status: next })
    setCards(getCards())
  }

  function handleDelete(id: string) {
    deleteCard(id)
    setCards(getCards())
  }

  const filtered = filter === 'all' ? cards : cards.filter(c => c.category === filter)

  const card = {
    background: 'rgba(8,6,28,0.88)', border: '1px solid rgba(200,180,255,0.12)',
    borderRadius: '1rem', backdropFilter: 'blur(12px)',
  } as React.CSSProperties

  const inp = {
    background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(200,180,255,0.15)',
    borderRadius: '0.5rem', color: 'rgba(220,200,255,0.9)', padding: '0.5rem 0.75rem',
    fontSize: '0.85rem', width: '100%', outline: 'none', boxSizing: 'border-box' as const,
    fontFamily: 'inherit',
  } as React.CSSProperties

  return (
    <div style={{ maxWidth: '700px', margin: '0 auto', padding: '1.5rem 1rem 2rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.8rem', color: 'rgba(220,200,255,0.95)', margin: 0, fontWeight: 400 }}>Vision Board</h1>
          <p style={{ color: 'rgba(180,160,255,0.5)', fontSize: '0.8rem', margin: '0.25rem 0 0' }}>Manifest your intentions with angel number energy</p>
        </div>
        <button onClick={() => setShowForm(s => !s)} style={{
          padding: '0.6rem 1.1rem', borderRadius: '2rem', cursor: 'pointer',
          background: showForm ? 'rgba(255,100,100,0.15)' : 'rgba(167,139,250,0.15)',
          border: showForm ? '1px solid rgba(255,100,100,0.4)' : '1px solid rgba(167,139,250,0.4)',
          color: showForm ? 'rgba(255,150,150,0.9)' : 'rgba(200,180,255,0.9)',
          fontSize: '0.8rem', fontFamily: 'inherit',
        }}>{showForm ? '✕ Cancel' : '+ New Vision'}</button>
      </div>

      {/* Add Form */}
      {showForm && (
        <div style={{ ...card, padding: '1.5rem', marginBottom: '1.5rem' }}>
          <h3 style={{ color: '#c9a84c', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '1rem' }}>✦ New Vision Card</h3>
          <div style={{ display: 'grid', gap: '0.75rem' }}>
            <input style={inp} placeholder="Vision title (e.g. Dream Career)" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
            <textarea style={{ ...inp, minHeight: '70px', resize: 'vertical' }} placeholder="Your intention... what are you calling in?" value={form.intention} onChange={e => setForm(f => ({ ...f, intention: e.target.value }))} />
            <input style={inp} placeholder="Angel number guiding this (e.g. 888)" value={form.angelNumber} onChange={e => setForm(f => ({ ...f, angelNumber: e.target.value }))} />
            <input style={inp} placeholder="Affirmation (e.g. I am abundant and free)" value={form.affirmation} onChange={e => setForm(f => ({ ...f, affirmation: e.target.value }))} />
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {CATEGORIES.map(c => (
                <button key={c.id} onClick={() => setForm(f => ({ ...f, category: c.id as VisionCard['category'] }))} style={{
                  padding: '0.35rem 0.7rem', borderRadius: '2rem', cursor: 'pointer', fontSize: '0.75rem', fontFamily: 'inherit',
                  background: form.category === c.id ? c.color : 'rgba(255,255,255,0.05)',
                  border: form.category === c.id ? `1px solid ${c.color}` : '1px solid rgba(255,255,255,0.1)',
                  color: 'rgba(220,200,255,0.9)',
                }}>{c.emoji} {c.label}</button>
              ))}
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {(['dreaming','believing','receiving'] as const).map(s => (
                <button key={s} onClick={() => setForm(f => ({ ...f, status: s }))} style={{
                  flex: 1, padding: '0.4rem', borderRadius: '0.5rem', cursor: 'pointer', fontSize: '0.72rem', fontFamily: 'inherit',
                  background: form.status === s ? STATUS_COLORS[s].bg : 'rgba(255,255,255,0.03)',
                  border: form.status === s ? STATUS_COLORS[s].border : '1px solid rgba(255,255,255,0.08)',
                  color: 'rgba(220,200,255,0.8)',
                }}>{STATUS_COLORS[s].label}</button>
              ))}
            </div>
            <button onClick={handleAdd} style={{
              padding: '0.75rem', borderRadius: '0.75rem', cursor: 'pointer',
              background: 'rgba(167,139,250,0.2)', border: '1px solid rgba(167,139,250,0.5)',
              color: 'rgba(220,200,255,0.95)', fontSize: '0.9rem', fontFamily: 'inherit',
            }}>✦ Add to Vision Board</button>
          </div>
        </div>
      )}

      {/* Category Filter */}
      <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
        <button onClick={() => setFilter('all')} style={{
          padding: '0.3rem 0.7rem', borderRadius: '2rem', cursor: 'pointer', fontSize: '0.72rem', fontFamily: 'inherit',
          background: filter === 'all' ? 'rgba(167,139,250,0.2)' : 'rgba(255,255,255,0.04)',
          border: filter === 'all' ? '1px solid rgba(167,139,250,0.5)' : '1px solid rgba(255,255,255,0.08)',
          color: 'rgba(200,180,255,0.8)',
        }}>All ({cards.length})</button>
        {CATEGORIES.map(c => {
          const count = cards.filter(card => card.category === c.id).length
          if (count === 0) return null
          return (
            <button key={c.id} onClick={() => setFilter(c.id)} style={{
              padding: '0.3rem 0.7rem', borderRadius: '2rem', cursor: 'pointer', fontSize: '0.72rem', fontFamily: 'inherit',
              background: filter === c.id ? c.color : 'rgba(255,255,255,0.04)',
              border: filter === c.id ? `1px solid ${c.color}` : '1px solid rgba(255,255,255,0.08)',
              color: 'rgba(220,200,255,0.85)',
            }}>{c.emoji} {c.label} ({count})</button>
          )
        })}
      </div>

      {/* Empty state */}
      {filtered.length === 0 && (
        <div style={{ ...card, padding: '3rem', textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔮</div>
          <div style={{ color: 'rgba(200,180,255,0.6)', fontSize: '0.9rem' }}>Your vision board awaits</div>
          <div style={{ color: 'rgba(180,160,255,0.4)', fontSize: '0.75rem', marginTop: '0.5rem' }}>Add your first vision to begin manifesting</div>
        </div>
      )}

      {/* Vision Cards Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
        {filtered.map(v => {
          const cat = CATEGORIES.find(c => c.id === v.category)!
          const st = STATUS_COLORS[v.status]
          return (
            <div key={v.id} style={{
              ...card, padding: '1.25rem',
              borderLeft: `3px solid ${cat.color}`,
              position: 'relative',
            }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                <div>
                  <span style={{ fontSize: '1.4rem' }}>{cat.emoji}</span>
                  <div style={{ color: 'rgba(220,200,255,0.95)', fontWeight: 600, fontSize: '0.95rem', marginTop: '0.25rem' }}>{v.title}</div>
                  {v.angelNumber && (
                    <div style={{ color: '#c9a84c', fontSize: '0.75rem', marginTop: '0.15rem' }}>✦ {v.angelNumber}</div>
                  )}
                </div>
                <button onClick={() => handleDelete(v.id)} style={{
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: 'rgba(255,100,100,0.4)', fontSize: '0.9rem', padding: '0.2rem',
                }}>✕</button>
              </div>
              {v.intention && (
                <p style={{ color: 'rgba(200,180,255,0.7)', fontSize: '0.8rem', margin: '0 0 0.75rem', lineHeight: 1.5 }}>{v.intention}</p>
              )}
              {v.affirmation && (
                <p style={{ color: 'rgba(180,160,255,0.55)', fontSize: '0.75rem', fontStyle: 'italic', margin: '0 0 0.75rem' }}>“{v.affirmation}”</p>
              )}
              <button onClick={() => cycleStatus(v.id, v.status)} style={{
                padding: '0.3rem 0.7rem', borderRadius: '2rem', cursor: 'pointer', fontSize: '0.7rem', fontFamily: 'inherit',
                background: st.bg, border: st.border, color: 'rgba(220,200,255,0.85)',
              }}>{st.label}</button>
              <div style={{ color: 'rgba(180,160,255,0.3)', fontSize: '0.65rem', marginTop: '0.5rem' }}>
                {new Date(v.createdAt).toLocaleDateString()}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
