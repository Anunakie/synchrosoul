'use client'
import { useState, useEffect } from 'react'

const KEY = 'synchrosoul_manifestations_v2'

const CATEGORIES = ['love', 'abundance', 'health', 'purpose', 'freedom', 'spiritual', 'other']
const CAT_COLORS: Record<string, string> = {
  love: '#f472b6', abundance: '#c9a84c', health: '#34d399',
  purpose: '#a78bfa', freedom: '#60a5fa', spiritual: '#818cf8', other: '#94a3b8'
}
const CAT_EMOJIS: Record<string, string> = {
  love: '💗', abundance: '✨', health: '💚', purpose: '🌟', freedom: '🕊️', spiritual: '🌌', other: '◈'
}

interface Manifestation {
  id: number
  text: string
  category: string
  status: 'calling-in' | 'signs-appearing' | 'manifested'
  angelNumber?: string
  notes: string
  createdAt: string
  manifestedAt?: string
}

const STATUS_CONFIG = {
  'calling-in': { label: 'Calling In', color: '#a78bfa', emoji: '🌱' },
  'signs-appearing': { label: 'Signs Appearing', color: '#f59e0b', emoji: '✨' },
  'manifested': { label: 'Manifested', color: '#34d399', emoji: '🌟' },
}

export default function ManifestationsPage() {
  const [items, setItems] = useState<Manifestation[]>([])
  const [view, setView] = useState<'board' | 'add'>('board')
  const [filter, setFilter] = useState<string>('all')
  const [text, setText] = useState('')
  const [category, setCategory] = useState('abundance')
  const [angelNumber, setAngelNumber] = useState('')
  const [notes, setNotes] = useState('')
  const [expanded, setExpanded] = useState<number | null>(null)

  useEffect(() => {
    const s = localStorage.getItem(KEY)
    if (s) setItems(JSON.parse(s))
  }, [])

  function save(next: Manifestation[]) {
    setItems(next)
    localStorage.setItem(KEY, JSON.stringify(next))
  }

  function addManifestation() {
    if (!text.trim()) return
    const m: Manifestation = {
      id: Date.now(), text: text.trim(), category, status: 'calling-in',
      angelNumber: angelNumber.trim() || undefined, notes: notes.trim(), createdAt: new Date().toISOString()
    }
    save([m, ...items])
    setText(''); setAngelNumber(''); setNotes(''); setView('board')
  }

  function updateStatus(id: number, status: Manifestation['status']) {
    save(items.map(m => m.id === id ? { ...m, status, manifestedAt: status === 'manifested' ? new Date().toISOString() : m.manifestedAt } : m))
  }

  function deleteItem(id: number) {
    save(items.filter(m => m.id !== id))
  }

  const filtered = filter === 'all' ? items : items.filter(m => m.status === filter || m.category === filter)
  const manifested = items.filter(m => m.status === 'manifested').length
  const card = { background: 'rgba(8,6,28,0.88)', border: '1px solid rgba(200,180,255,0.12)', borderRadius: '1.25rem', backdropFilter: 'blur(12px)' } as React.CSSProperties

  return (
    <div style={{ maxWidth: '680px', margin: '0 auto', padding: '1.5rem 1rem 2rem' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
        <div>
          <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.8rem', color: 'rgba(220,200,255,0.95)', margin: '0 0 0.25rem', fontWeight: 400 }}>Manifestations</h1>
          <p style={{ color: 'rgba(180,160,255,0.5)', fontSize: '0.8rem', margin: 0 }}>{manifested} manifested · {items.length} total desires</p>
        </div>
        <button onClick={() => setView(view === 'add' ? 'board' : 'add')} style={{ padding: '0.5rem 1rem', borderRadius: '2rem', background: view === 'add' ? 'rgba(167,139,250,0.15)' : 'linear-gradient(135deg, rgba(167,139,250,0.3), rgba(201,168,76,0.3))', border: '1px solid rgba(167,139,250,0.3)', color: '#a78bfa', fontSize: '0.8rem', cursor: 'pointer', fontWeight: 600 }}>{view === 'add' ? '← Board' : '+ Add'}</button>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem', marginBottom: '1.25rem' }}>
        {Object.entries(STATUS_CONFIG).map(([k, v]) => (
          <div key={k} style={{ ...card, padding: '0.875rem', textAlign: 'center', cursor: 'pointer', borderColor: filter === k ? `${v.color}44` : 'rgba(200,180,255,0.12)' }} onClick={() => setFilter(filter === k ? 'all' : k)}>
            <div style={{ fontSize: '1.1rem', marginBottom: '0.2rem' }}>{v.emoji}</div>
            <div style={{ color: v.color, fontSize: '1.2rem', fontWeight: 700 }}>{items.filter(m => m.status === k).length}</div>
            <div style={{ color: 'rgba(180,160,255,0.4)', fontSize: '0.58rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{v.label}</div>
          </div>
        ))}
      </div>

      {view === 'add' && (
        <div style={{ ...card, padding: '1.5rem', marginBottom: '1.25rem' }}>
          <h3 style={{ color: 'rgba(220,200,255,0.9)', fontSize: '1rem', margin: '0 0 1rem', fontFamily: 'Cormorant Garamond, serif', fontWeight: 400 }}>Plant a New Seed ✦</h3>
          <textarea value={text} onChange={e => setText(e.target.value)} placeholder="I am so happy and grateful now that..." rows={3} style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(200,180,255,0.15)', borderRadius: '0.75rem', padding: '0.75rem', color: 'rgba(220,200,255,0.9)', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box', resize: 'none', marginBottom: '0.75rem', fontStyle: 'italic' }} />
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <select value={category} onChange={e => setCategory(e.target.value)} style={{ background: 'rgba(8,6,28,0.9)', border: '1px solid rgba(200,180,255,0.15)', borderRadius: '0.75rem', padding: '0.65rem 0.75rem', color: 'rgba(220,200,255,0.8)', fontSize: '0.85rem', outline: 'none' }}>
              {CATEGORIES.map(c => <option key={c} value={c}>{CAT_EMOJIS[c]} {c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
            </select>
            <input value={angelNumber} onChange={e => setAngelNumber(e.target.value)} placeholder="Angel number (e.g. 1111)" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(200,180,255,0.15)', borderRadius: '0.75rem', padding: '0.65rem 0.75rem', color: 'rgba(220,200,255,0.8)', fontSize: '0.85rem', outline: 'none' }} />
          </div>
          <textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Why do you want this? How will it feel?" rows={2} style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(200,180,255,0.15)', borderRadius: '0.75rem', padding: '0.65rem 0.75rem', color: 'rgba(220,200,255,0.8)', fontSize: '0.85rem', outline: 'none', boxSizing: 'border-box', resize: 'none', marginBottom: '0.75rem' }} />
          <button onClick={addManifestation} disabled={!text.trim()} style={{ width: '100%', padding: '0.75rem', borderRadius: '0.875rem', background: 'linear-gradient(135deg, rgba(167,139,250,0.6), rgba(201,168,76,0.6))', border: 'none', color: 'white', fontSize: '0.9rem', cursor: 'pointer', fontWeight: 600, opacity: text.trim() ? 1 : 0.5 }}>Plant This Seed 🌱</button>
        </div>
      )}

      {/* Manifestation list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
        {filtered.length === 0 && (
          <div style={{ ...card, padding: '2rem', textAlign: 'center' }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>🌱</div>
            <p style={{ color: 'rgba(180,160,255,0.5)', fontSize: '0.85rem', margin: 0 }}>No manifestations yet. Plant your first seed above.</p>
          </div>
        )}
        {filtered.map(m => {
          const sc = STATUS_CONFIG[m.status]
          const cc = CAT_COLORS[m.category]
          const isExp = expanded === m.id
          return (
            <div key={m.id} style={{ ...card, borderColor: `${sc.color}22` }}>
              <div onClick={() => setExpanded(isExp ? null : m.id)} style={{ padding: '1rem 1.25rem', cursor: 'pointer', display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                <span style={{ fontSize: '1.2rem', flexShrink: 0, marginTop: '0.1rem' }}>{CAT_EMOJIS[m.category]}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ color: 'rgba(220,200,255,0.88)', fontSize: '0.88rem', margin: '0 0 0.35rem', lineHeight: 1.5, fontStyle: 'italic' }}>&ldquo;{m.text}&rdquo;</p>
                  <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center', flexWrap: 'wrap' }}>
                    <span style={{ padding: '0.15rem 0.5rem', borderRadius: '2rem', background: `${sc.color}15`, border: `1px solid ${sc.color}30`, color: sc.color, fontSize: '0.65rem' }}>{sc.emoji} {sc.label}</span>
                    <span style={{ padding: '0.15rem 0.5rem', borderRadius: '2rem', background: `${cc}10`, border: `1px solid ${cc}25`, color: cc, fontSize: '0.65rem' }}>{m.category}</span>
                    {m.angelNumber && <span style={{ color: '#c9a84c', fontSize: '0.65rem' }}>✦ {m.angelNumber}</span>}
                  </div>
                </div>
                <span style={{ color: 'rgba(180,160,255,0.3)', fontSize: '0.8rem', transform: isExp ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s', flexShrink: 0 }}>⌄</span>
              </div>
              {isExp && (
                <div style={{ padding: '0 1.25rem 1.25rem', borderTop: '1px solid rgba(200,180,255,0.06)' }}>
                  {m.notes && <p style={{ color: 'rgba(180,160,255,0.6)', fontSize: '0.82rem', margin: '0.75rem 0', lineHeight: 1.5 }}>{m.notes}</p>}
                  <div style={{ color: 'rgba(180,160,255,0.35)', fontSize: '0.7rem', marginBottom: '0.875rem' }}>Planted {new Date(m.createdAt).toLocaleDateString()}{m.manifestedAt && ` · Manifested ${new Date(m.manifestedAt).toLocaleDateString()}`}</div>
                  <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
                    {(Object.entries(STATUS_CONFIG) as [Manifestation['status'], typeof STATUS_CONFIG[keyof typeof STATUS_CONFIG]][]).map(([k, v]) => (
                      <button key={k} onClick={() => updateStatus(m.id, k)} style={{ padding: '0.3rem 0.65rem', borderRadius: '2rem', border: m.status === k ? `1px solid ${v.color}` : '1px solid rgba(200,180,255,0.12)', background: m.status === k ? `${v.color}20` : 'rgba(8,6,28,0.7)', color: m.status === k ? v.color : 'rgba(180,160,255,0.45)', fontSize: '0.7rem', cursor: 'pointer' }}>{v.emoji} {v.label}</button>
                    ))}
                  </div>
                  <button onClick={() => deleteItem(m.id)} style={{ background: 'none', border: 'none', color: 'rgba(180,160,255,0.25)', cursor: 'pointer', fontSize: '0.75rem', padding: 0 }}>✕ Remove</button>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
