'use client'
import { useState, useEffect } from 'react'
import { getManifestations, saveManifest, updateManifest, deleteManifest, STATUS_INFO, Manifestation } from '@/lib/manifestations'

const CATEGORIES = ['love','career','health','abundance','spiritual','relationships','creativity','freedom']
const CAT_EMOJIS: Record<string,string> = { love:'💗', career:'✨', health:'🌿', abundance:'💰', spiritual:'🔮', relationships:'🤝', creativity:'🎨', freedom:'🕊️' }

export default function ManifestationsPage() {
  const [items, setItems] = useState<Manifestation[]>([])
  const [showForm, setShowForm] = useState(false)
  const [filter, setFilter] = useState<string>('all')
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [form, setForm] = useState({ title:'', description:'', angelNumber:'', category:'spiritual', affirmation:'', evidence:'', notes:'', status:'seed' as Manifestation['status'] })

  useEffect(() => { setItems(getManifestations()) }, [])

  function handleAdd() {
    if (!form.title.trim()) return
    saveManifest(form)
    setItems(getManifestations())
    setForm({ title:'', description:'', angelNumber:'', category:'spiritual', affirmation:'', evidence:'', notes:'', status:'seed' })
    setShowForm(false)
  }

  function cycleStatus(id: string, current: Manifestation['status']) {
    const order: Manifestation['status'][] = ['seed','growing','blooming','manifested']
    const idx = order.indexOf(current)
    const next = order[(idx + 1) % order.length]
    const updates: Partial<Manifestation> = { status: next }
    if (next === 'manifested') updates.manifestedAt = new Date().toISOString()
    updateManifest(id, updates)
    setItems(getManifestations())
  }

  const filtered = filter === 'all' ? items : filter === 'manifested' ? items.filter(i => i.status === 'manifested') : items.filter(i => i.category === filter)

  const stats = {
    total: items.length,
    manifested: items.filter(i => i.status === 'manifested').length,
    blooming: items.filter(i => i.status === 'blooming').length,
    growing: items.filter(i => i.status === 'growing').length,
  }

  const card = { background: 'rgba(8,6,28,0.88)', border: '1px solid rgba(200,180,255,0.12)', borderRadius: '1rem', backdropFilter: 'blur(12px)' } as React.CSSProperties
  const inp = { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(200,180,255,0.15)', borderRadius: '0.5rem', color: 'rgba(220,200,255,0.9)', padding: '0.5rem 0.75rem', fontSize: '0.85rem', width: '100%', outline: 'none', boxSizing: 'border-box' as const, fontFamily: 'inherit' } as React.CSSProperties

  return (
    <div style={{ maxWidth: '700px', margin: '0 auto', padding: '1.5rem 1rem 2rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
        <div>
          <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.8rem', color: 'rgba(220,200,255,0.95)', margin: 0, fontWeight: 400 }}>Manifestations</h1>
          <p style={{ color: 'rgba(180,160,255,0.5)', fontSize: '0.8rem', margin: '0.25rem 0 0' }}>Track what you are calling into existence</p>
        </div>
        <button onClick={() => setShowForm(s => !s)} style={{ padding: '0.6rem 1.1rem', borderRadius: '2rem', cursor: 'pointer', background: showForm ? 'rgba(255,100,100,0.15)' : 'rgba(167,139,250,0.15)', border: showForm ? '1px solid rgba(255,100,100,0.4)' : '1px solid rgba(167,139,250,0.4)', color: showForm ? 'rgba(255,150,150,0.9)' : 'rgba(200,180,255,0.9)', fontSize: '0.8rem', fontFamily: 'inherit' }}>{showForm ? '✕ Cancel' : '+ New'}</button>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '0.6rem', marginBottom: '1.25rem' }}>
        {[
          { label: 'Total', value: stats.total, color: 'rgba(167,139,250,0.7)' },
          { label: 'Growing', value: stats.growing, color: 'rgba(80,180,255,0.7)' },
          { label: 'Blooming', value: stats.blooming, color: 'rgba(240,100,200,0.7)' },
          { label: 'Manifested', value: stats.manifested, color: 'rgba(201,168,76,0.8)' },
        ].map(s => (
          <div key={s.label} style={{ ...card, padding: '0.75rem', textAlign: 'center' }}>
            <div style={{ color: s.color, fontSize: '1.4rem', fontWeight: 700 }}>{s.value}</div>
            <div style={{ color: 'rgba(180,160,255,0.5)', fontSize: '0.62rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Add Form */}
      {showForm && (
        <div style={{ ...card, padding: '1.5rem', marginBottom: '1.5rem' }}>
          <h3 style={{ color: '#c9a84c', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '1rem' }}>✦ New Manifestation</h3>
          <div style={{ display: 'grid', gap: '0.75rem' }}>
            <input style={inp} placeholder="What are you manifesting?" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} />
            <textarea style={{ ...inp, minHeight: '65px', resize: 'vertical' }} placeholder="Describe it in detail — feel it as already real..." value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
            <input style={inp} placeholder="Angel number guiding this (e.g. 888)" value={form.angelNumber} onChange={e => setForm(f => ({ ...f, angelNumber: e.target.value }))} />
            <input style={inp} placeholder="Your affirmation" value={form.affirmation} onChange={e => setForm(f => ({ ...f, affirmation: e.target.value }))} />
            <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
              {CATEGORIES.map(c => (
                <button key={c} onClick={() => setForm(f => ({ ...f, category: c }))} style={{ padding: '0.3rem 0.65rem', borderRadius: '2rem', cursor: 'pointer', fontSize: '0.72rem', fontFamily: 'inherit', background: form.category === c ? 'rgba(167,139,250,0.25)' : 'rgba(255,255,255,0.04)', border: form.category === c ? '1px solid rgba(167,139,250,0.6)' : '1px solid rgba(255,255,255,0.08)', color: 'rgba(220,200,255,0.85)' }}>{CAT_EMOJIS[c]} {c}</button>
              ))}
            </div>
            <button onClick={handleAdd} style={{ padding: '0.75rem', borderRadius: '0.75rem', cursor: 'pointer', background: 'rgba(167,139,250,0.2)', border: '1px solid rgba(167,139,250,0.5)', color: 'rgba(220,200,255,0.95)', fontSize: '0.9rem', fontFamily: 'inherit' }}>🌱 Plant this Seed</button>
          </div>
        </div>
      )}

      {/* Filter */}
      <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
        {['all','manifested'].concat(CATEGORIES).map(f => {
          const count = f === 'all' ? items.length : f === 'manifested' ? stats.manifested : items.filter(i => i.category === f).length
          if (f !== 'all' && f !== 'manifested' && count === 0) return null
          return (
            <button key={f} onClick={() => setFilter(f)} style={{ padding: '0.3rem 0.65rem', borderRadius: '2rem', cursor: 'pointer', fontSize: '0.72rem', fontFamily: 'inherit', background: filter === f ? 'rgba(167,139,250,0.2)' : 'rgba(255,255,255,0.04)', border: filter === f ? '1px solid rgba(167,139,250,0.5)' : '1px solid rgba(255,255,255,0.08)', color: 'rgba(200,180,255,0.8)' }}>
              {f === 'all' ? `All (${count})` : f === 'manifested' ? `✨ Manifested (${count})` : `${CAT_EMOJIS[f]} ${f} (${count})`}
            </button>
          )
        })}
      </div>

      {/* Empty */}
      {filtered.length === 0 && (
        <div style={{ ...card, padding: '3rem', textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🌱</div>
          <div style={{ color: 'rgba(200,180,255,0.6)', fontSize: '0.9rem' }}>No manifestations yet</div>
          <div style={{ color: 'rgba(180,160,255,0.4)', fontSize: '0.75rem', marginTop: '0.5rem' }}>Plant your first seed of intention</div>
        </div>
      )}

      {/* List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {filtered.map(item => {
          const st = STATUS_INFO[item.status]
          const isExpanded = expandedId === item.id
          return (
            <div key={item.id} style={{ ...card, padding: '1.25rem', borderLeft: `3px solid ${st.color}` }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                <div style={{ flex: 1, cursor: 'pointer' }} onClick={() => setExpandedId(isExpanded ? null : item.id)}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                    <span style={{ fontSize: '1.1rem' }}>{CAT_EMOJIS[item.category]}</span>
                    <span style={{ color: 'rgba(220,200,255,0.95)', fontWeight: 600, fontSize: '0.95rem' }}>{item.title}</span>
                    {item.angelNumber && <span style={{ color: '#c9a84c', fontSize: '0.72rem' }}>✦ {item.angelNumber}</span>}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontSize: '0.75rem', color: st.color }}>{st.emoji} {st.label}</span>
                    <span style={{ color: 'rgba(180,160,255,0.35)', fontSize: '0.65rem' }}>{new Date(item.createdAt).toLocaleDateString()}</span>
                    {item.manifestedAt && <span style={{ color: 'rgba(201,168,76,0.7)', fontSize: '0.65rem' }}>✓ {new Date(item.manifestedAt).toLocaleDateString()}</span>}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                  <button onClick={() => cycleStatus(item.id, item.status)} style={{ padding: '0.3rem 0.6rem', borderRadius: '2rem', cursor: 'pointer', fontSize: '0.68rem', fontFamily: 'inherit', background: st.color, border: 'none', color: 'rgba(10,5,30,0.9)' }}>→</button>
                  <button onClick={() => { deleteManifest(item.id); setItems(getManifestations()) }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,100,100,0.4)', fontSize: '0.85rem' }}>✕</button>
                </div>
              </div>
              {isExpanded && (
                <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid rgba(200,180,255,0.08)' }}>
                  {item.description && <p style={{ color: 'rgba(200,180,255,0.7)', fontSize: '0.82rem', margin: '0 0 0.75rem', lineHeight: 1.6 }}>{item.description}</p>}
                  {item.affirmation && <p style={{ color: 'rgba(180,160,255,0.55)', fontSize: '0.78rem', fontStyle: 'italic', margin: '0 0 0.75rem' }}>“{item.affirmation}”</p>}
                  <textarea
                    placeholder="Add notes, signs, evidence..."
                    defaultValue={item.notes}
                    onBlur={e => { updateManifest(item.id, { notes: e.target.value }); setItems(getManifestations()) }}
                    style={{ ...inp, minHeight: '60px', resize: 'vertical', marginTop: '0.5rem' }}
                  />
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
