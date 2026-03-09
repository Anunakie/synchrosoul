'use client'
import { useState, useEffect } from 'react'

const KEY = 'synchrosoul_manifestations'

interface Manifestation {
  id: string
  intention: string
  affirmation: string
  number: string
  status: 'planting' | 'growing' | 'blooming' | 'manifested'
  createdAt: string
  updatedAt: string
  notes: string[]
}

const STATUSES = [
  { id: 'planting', label: 'Planting', emoji: '🌱', color: '#86efac' },
  { id: 'growing', label: 'Growing', emoji: '🌿', color: '#4ade80' },
  { id: 'blooming', label: 'Blooming', emoji: '🌸', color: '#f9a8d4' },
  { id: 'manifested', label: 'Manifested', emoji: '✨', color: '#c9a84c' },
]

const ANGEL_NUMBERS = ['111','222','333','444','555','666','777','888','999','1111','1212','1234']

export default function ManifestationsPage() {
  const [items, setItems] = useState<Manifestation[]>([])
  const [showForm, setShowForm] = useState(false)
  const [intention, setIntention] = useState('')
  const [affirmation, setAffirmation] = useState('')
  const [number, setNumber] = useState('111')
  const [expanded, setExpanded] = useState<string|null>(null)
  const [newNote, setNewNote] = useState('')

  useEffect(() => {
    try { setItems(JSON.parse(localStorage.getItem(KEY) || '[]')) } catch {}
  }, [])

  function save(updated: Manifestation[]) {
    setItems(updated)
    localStorage.setItem(KEY, JSON.stringify(updated))
  }

  function addItem() {
    if (!intention.trim()) return
    const item: Manifestation = {
      id: Date.now().toString(),
      intention: intention.trim(),
      affirmation: affirmation.trim() || 'I am open to receiving this or something better.',
      number,
      status: 'planting',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      notes: [],
    }
    save([item, ...items])
    setIntention(''); setAffirmation(''); setNumber('111'); setShowForm(false)
  }

  function advanceStatus(id: string) {
    const order = ['planting','growing','blooming','manifested']
    save(items.map(i => {
      if (i.id !== id) return i
      const idx = order.indexOf(i.status)
      const next = order[Math.min(idx+1, order.length-1)] as Manifestation['status']
      return { ...i, status: next, updatedAt: new Date().toISOString() }
    }))
  }

  function addNote(id: string) {
    if (!newNote.trim()) return
    save(items.map(i => i.id === id ? { ...i, notes: [...i.notes, newNote.trim()], updatedAt: new Date().toISOString() } : i))
    setNewNote('')
  }

  function deleteItem(id: string) {
    if (confirm('Remove this manifestation?')) save(items.filter(i => i.id !== id))
  }

  const card: React.CSSProperties = { background: 'rgba(8,6,28,0.88)', border: '1px solid rgba(200,180,255,0.12)', borderRadius: '1.25rem', backdropFilter: 'blur(12px)', padding: '1.25rem', marginBottom: '0.875rem' }

  return (
    <div style={{ maxWidth: '560px', margin: '0 auto', padding: '1.5rem 1rem 2rem' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
        <div>
          <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.8rem', color: 'rgba(220,200,255,0.95)', margin: '0 0 0.25rem', fontWeight: 400 }}>Manifestations</h1>
          <p style={{ color: 'rgba(180,160,255,0.5)', fontSize: '0.8rem', margin: 0 }}>Plant intentions, watch them bloom</p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          {STATUSES.map(s => <span key={s.id} title={s.label} style={{ fontSize: '1.1rem' }}>{s.emoji}</span>)}
        </div>
      </div>

      {/* Stats */}
      {items.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '0.5rem', marginBottom: '1rem' }}>
          {STATUSES.map(s => (
            <div key={s.id} style={{ background: 'rgba(8,6,28,0.88)', border: '1px solid rgba(200,180,255,0.08)', borderRadius: '0.875rem', padding: '0.625rem', textAlign: 'center' }}>
              <div style={{ fontSize: '1.2rem' }}>{s.emoji}</div>
              <div style={{ color: s.color, fontSize: '1.1rem', fontWeight: 700 }}>{items.filter(i => i.status === s.id).length}</div>
              <div style={{ color: 'rgba(180,160,255,0.35)', fontSize: '0.55rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{s.label}</div>
            </div>
          ))}
        </div>
      )}

      {/* Add button */}
      {!showForm && (
        <button onClick={() => setShowForm(true)} style={{ width: '100%', padding: '0.875rem', borderRadius: '1rem', border: '1px dashed rgba(201,168,76,0.3)', background: 'rgba(201,168,76,0.04)', color: 'rgba(201,168,76,0.6)', fontSize: '0.88rem', cursor: 'pointer', marginBottom: '1rem' }}>+ Plant New Intention</button>
      )}

      {/* Form */}
      {showForm && (
        <div style={card}>
          <div style={{ color: 'rgba(180,160,255,0.4)', fontSize: '0.62rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.875rem' }}>New Manifestation</div>
          <textarea value={intention} onChange={e => setIntention(e.target.value)} placeholder='What do you wish to manifest? Be specific and present-tense...' rows={3} style={{ width: '100%', padding: '0.75rem', background: 'rgba(8,6,28,0.8)', border: '1px solid rgba(200,180,255,0.15)', borderRadius: '0.75rem', color: 'rgba(220,200,255,0.9)', fontSize: '0.88rem', outline: 'none', resize: 'none', boxSizing: 'border-box', marginBottom: '0.625rem', fontFamily: 'inherit', lineHeight: 1.6 }} />
          <textarea value={affirmation} onChange={e => setAffirmation(e.target.value)} placeholder='Your personal affirmation (optional)...' rows={2} style={{ width: '100%', padding: '0.75rem', background: 'rgba(8,6,28,0.8)', border: '1px solid rgba(200,180,255,0.15)', borderRadius: '0.75rem', color: 'rgba(220,200,255,0.9)', fontSize: '0.85rem', outline: 'none', resize: 'none', boxSizing: 'border-box', marginBottom: '0.625rem', fontFamily: 'inherit', lineHeight: 1.6 }} />
          <div style={{ marginBottom: '0.875rem' }}>
            <div style={{ color: 'rgba(180,160,255,0.4)', fontSize: '0.65rem', marginBottom: '0.4rem' }}>Anchor Number</div>
            <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
              {ANGEL_NUMBERS.map(n => (
                <button key={n} onClick={() => setNumber(n)} style={{ padding: '0.25rem 0.625rem', borderRadius: '9999px', border: number === n ? '1px solid rgba(201,168,76,0.5)' : '1px solid rgba(200,180,255,0.1)', background: number === n ? 'rgba(201,168,76,0.12)' : 'transparent', color: number === n ? '#c9a84c' : 'rgba(180,160,255,0.4)', fontSize: '0.72rem', cursor: 'pointer' }}>{n}</button>
              ))}
            </div>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button onClick={addItem} style={{ flex: 1, padding: '0.75rem', borderRadius: '0.875rem', border: '1px solid rgba(201,168,76,0.3)', background: 'rgba(201,168,76,0.1)', color: '#c9a84c', fontSize: '0.85rem', cursor: 'pointer' }}>🌱 Plant Intention</button>
            <button onClick={() => setShowForm(false)} style={{ padding: '0.75rem 1rem', borderRadius: '0.875rem', border: '1px solid rgba(200,180,255,0.1)', background: 'transparent', color: 'rgba(180,160,255,0.4)', fontSize: '0.85rem', cursor: 'pointer' }}>Cancel</button>
          </div>
        </div>
      )}

      {/* Empty state */}
      {items.length === 0 && !showForm && (
        <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🌱</div>
          <p style={{ color: 'rgba(180,160,255,0.4)', fontSize: '0.85rem' }}>Plant your first intention above and watch it grow.</p>
        </div>
      )}

      {/* Items */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
        {items.map(item => {
          const status = STATUSES.find(s => s.id === item.status)!
          const isExpanded = expanded === item.id
          return (
            <div key={item.id} style={{ background: 'rgba(8,6,28,0.88)', border: '1px solid rgba(200,180,255,0.1)', borderRadius: '1.1rem', overflow: 'hidden', backdropFilter: 'blur(12px)' }}>
              <div style={{ padding: '1rem', display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: status.color + '15', border: '1px solid ' + status.color + '30', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '1rem' }}>{status.emoji}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ color: 'rgba(220,200,255,0.88)', fontSize: '0.88rem', lineHeight: 1.5, margin: '0 0 0.35rem' }}>{item.intention}</p>
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
                    <span style={{ background: status.color + '12', border: '1px solid ' + status.color + '25', borderRadius: '9999px', padding: '0.1rem 0.5rem', color: status.color, fontSize: '0.65rem' }}>{status.label}</span>
                    <span style={{ color: 'rgba(201,168,76,0.5)', fontSize: '0.65rem' }}>✦ {item.number}</span>
                    {item.notes.length > 0 && <span style={{ color: 'rgba(180,160,255,0.3)', fontSize: '0.65rem' }}>{item.notes.length} notes</span>}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '0.35rem', flexShrink: 0 }}>
                  <button onClick={() => setExpanded(isExpanded ? null : item.id)} style={{ background: 'none', border: 'none', color: 'rgba(180,160,255,0.4)', cursor: 'pointer', fontSize: '0.75rem', padding: '0.25rem' }}>{isExpanded ? '▲' : '▾'}</button>
                  <button onClick={() => deleteItem(item.id)} style={{ background: 'none', border: 'none', color: 'rgba(248,113,113,0.3)', cursor: 'pointer', fontSize: '0.75rem', padding: '0.25rem' }}>✕</button>
                </div>
              </div>
              {isExpanded && (
                <div style={{ padding: '0 1rem 1rem', borderTop: '1px solid rgba(200,180,255,0.06)' }}>
                  <div style={{ background: 'rgba(201,168,76,0.06)', border: '1px solid rgba(201,168,76,0.12)', borderRadius: '0.75rem', padding: '0.75rem', marginBottom: '0.875rem', marginTop: '0.875rem' }}>
                    <div style={{ color: 'rgba(180,160,255,0.4)', fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.3rem' }}>Affirmation</div>
                    <div style={{ color: 'rgba(201,168,76,0.8)', fontSize: '0.82rem', fontStyle: 'italic', lineHeight: 1.6 }}>{item.affirmation}</div>
                  </div>
                  {item.status !== 'manifested' && (
                    <button onClick={() => advanceStatus(item.id)} style={{ width: '100%', padding: '0.625rem', borderRadius: '0.75rem', border: '1px solid ' + status.color + '30', background: status.color + '08', color: status.color, fontSize: '0.8rem', cursor: 'pointer', marginBottom: '0.75rem' }}>Advance to next stage →</button>
                  )}
                  {item.notes.length > 0 && (
                    <div style={{ marginBottom: '0.625rem' }}>
                      {item.notes.map((note, i) => (
                        <div key={i} style={{ color: 'rgba(180,160,255,0.55)', fontSize: '0.78rem', padding: '0.35rem 0', borderBottom: '1px solid rgba(200,180,255,0.05)', lineHeight: 1.5 }}>· {note}</div>
                      ))}
                    </div>
                  )}
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <input value={newNote} onChange={e => setNewNote(e.target.value)} onKeyDown={e => e.key === 'Enter' && addNote(item.id)} placeholder='Add a note or sign...' style={{ flex: 1, padding: '0.5rem 0.75rem', background: 'rgba(8,6,28,0.8)', border: '1px solid rgba(200,180,255,0.12)', borderRadius: '0.625rem', color: 'rgba(220,200,255,0.8)', fontSize: '0.8rem', outline: 'none' }} />
                    <button onClick={() => addNote(item.id)} style={{ padding: '0.5rem 0.875rem', borderRadius: '0.625rem', border: '1px solid rgba(167,139,250,0.2)', background: 'rgba(167,139,250,0.08)', color: '#a78bfa', fontSize: '0.78rem', cursor: 'pointer' }}>Add</button>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
