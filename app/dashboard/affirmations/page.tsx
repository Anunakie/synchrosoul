'use client'
import { useState, useEffect } from 'react'

const CATEGORIES = [
  { id: 'all', label: 'All', emoji: '✦' },
  { id: 'love', label: 'Love', emoji: '💞' },
  { id: 'abundance', label: 'Abundance', emoji: '🌟' },
  { id: 'healing', label: 'Healing', emoji: '🌿' },
  { id: 'purpose', label: 'Purpose', emoji: '◈' },
  { id: 'protection', label: 'Protection', emoji: '🛡' },
  { id: 'intuition', label: 'Intuition', emoji: '🔮' },
]

const AFFIRMATIONS = [
  { id: 1, text: 'I am divinely guided and protected on my path.', category: 'protection', number: '111' },
  { id: 2, text: 'Abundance flows to me naturally and effortlessly.', category: 'abundance', number: '888' },
  { id: 3, text: 'I am worthy of deep, soulful love.', category: 'love', number: '222' },
  { id: 4, text: 'My intuition is my greatest superpower.', category: 'intuition', number: '777' },
  { id: 5, text: 'I release what no longer serves my highest good.', category: 'healing', number: '999' },
  { id: 6, text: 'I am aligned with my soul purpose.', category: 'purpose', number: '444' },
  { id: 7, text: 'The universe conspires in my favor always.', category: 'abundance', number: '555' },
  { id: 8, text: 'I attract relationships that mirror my highest self.', category: 'love', number: '1111' },
  { id: 9, text: 'My body is a sacred vessel. I honor it with love.', category: 'healing', number: '333' },
  { id: 10, text: 'I trust the timing of my life completely.', category: 'purpose', number: '1212' },
  { id: 11, text: 'I am a magnet for miracles and synchronicities.', category: 'abundance', number: '1111' },
  { id: 12, text: 'My heart is open and ready to give and receive love.', category: 'love', number: '222' },
  { id: 13, text: 'I am protected by light on all sides.', category: 'protection', number: '444' },
  { id: 14, text: 'Every ending is a sacred new beginning.', category: 'healing', number: '999' },
  { id: 15, text: 'I hear the whispers of my angels clearly.', category: 'intuition', number: '777' },
  { id: 16, text: 'I am exactly where I need to be right now.', category: 'purpose', number: '555' },
  { id: 17, text: 'Wealth and prosperity are my divine birthright.', category: 'abundance', number: '888' },
  { id: 18, text: 'I radiate love and it returns to me multiplied.', category: 'love', number: '333' },
  { id: 19, text: 'My angels walk beside me in every moment.', category: 'protection', number: '1111' },
  { id: 20, text: 'I am in perfect harmony with the universe.', category: 'intuition', number: '1212' },
  { id: 21, text: 'Change is my ally. I embrace transformation.', category: 'healing', number: '555' },
  { id: 22, text: 'I am a powerful co-creator of my reality.', category: 'purpose', number: '111' },
  { id: 23, text: 'My soul knows the way. I follow its guidance.', category: 'intuition', number: '444' },
  { id: 24, text: 'I deserve all the beautiful things life has to offer.', category: 'abundance', number: '333' },
]

const FAV_KEY = 'synchrosoul_affirmation_favs'
const CUSTOM_KEY = 'synchrosoul_custom_affirmations'

export default function AffirmationsPage() {
  const [category, setCategory] = useState('all')
  const [favs, setFavs] = useState<number[]>([])
  const [custom, setCustom] = useState<Array<{ id: number; text: string; category: string }>>( [])
  const [showAdd, setShowAdd] = useState(false)
  const [newText, setNewText] = useState('')
  const [newCat, setNewCat] = useState('love')
  const [daily, setDaily] = useState<typeof AFFIRMATIONS[0] | null>(null)
  const [showFavsOnly, setShowFavsOnly] = useState(false)

  useEffect(() => {
    const f = localStorage.getItem(FAV_KEY)
    if (f) setFavs(JSON.parse(f))
    const c = localStorage.getItem(CUSTOM_KEY)
    if (c) setCustom(JSON.parse(c))
    const idx = new Date().getDate() % AFFIRMATIONS.length
    setDaily(AFFIRMATIONS[idx])
  }, [])

  function toggleFav(id: number) {
    const next = favs.includes(id) ? favs.filter(f => f !== id) : [...favs, id]
    setFavs(next)
    localStorage.setItem(FAV_KEY, JSON.stringify(next))
  }

  function addCustom() {
    if (!newText.trim()) return
    const item = { id: Date.now(), text: newText.trim(), category: newCat }
    const next = [...custom, item]
    setCustom(next)
    localStorage.setItem(CUSTOM_KEY, JSON.stringify(next))
    setNewText('')
    setShowAdd(false)
  }

  function deleteCustom(id: number) {
    const next = custom.filter(c => c.id !== id)
    setCustom(next)
    localStorage.setItem(CUSTOM_KEY, JSON.stringify(next))
  }

  const allItems = [...AFFIRMATIONS, ...custom.map(c => ({ ...c, number: '✦' }))]
  const filtered = allItems.filter(a => {
    if (showFavsOnly && !favs.includes(a.id)) return false
    if (category !== 'all' && a.category !== category) return false
    return true
  })

  const card = { background: 'rgba(8,6,28,0.88)', border: '1px solid rgba(200,180,255,0.12)', borderRadius: '1.25rem', backdropFilter: 'blur(12px)' } as React.CSSProperties

  return (
    <div style={{ maxWidth: '640px', margin: '0 auto', padding: '1.5rem 1rem 2rem' }}>
      <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.8rem', color: 'rgba(220,200,255,0.95)', margin: '0 0 0.25rem', fontWeight: 400 }}>Affirmations</h1>
      <p style={{ color: 'rgba(180,160,255,0.5)', fontSize: '0.8rem', margin: '0 0 1.25rem' }}>Words that align your energy with the cosmos</p>

      {daily && (
        <div style={{ ...card, padding: '1.5rem', marginBottom: '1.25rem', background: 'rgba(167,139,250,0.08)', border: '1px solid rgba(167,139,250,0.25)', textAlign: 'center' }}>
          <div style={{ color: 'rgba(180,160,255,0.4)', fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '0.75rem' }}>✦ Today&apos;s Affirmation ✦</div>
          <p style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.3rem', color: 'rgba(220,200,255,0.95)', margin: '0 0 0.75rem', lineHeight: 1.5, fontStyle: 'italic' }}>&ldquo;{daily.text}&rdquo;</p>
          <span style={{ color: '#a78bfa', fontSize: '0.75rem' }}>{daily.number}</span>
        </div>
      )}

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem', alignItems: 'center' }}>
        <button onClick={() => setShowFavsOnly(f => !f)} style={{ padding: '0.4rem 0.75rem', borderRadius: '2rem', border: showFavsOnly ? '1px solid rgba(201,168,76,0.6)' : '1px solid rgba(200,180,255,0.15)', background: showFavsOnly ? 'rgba(201,168,76,0.15)' : 'rgba(8,6,28,0.7)', color: showFavsOnly ? '#c9a84c' : 'rgba(180,160,255,0.6)', fontSize: '0.75rem', cursor: 'pointer' }}>
          ♥ Saved ({favs.length})
        </button>
        <button onClick={() => setShowAdd(s => !s)} style={{ marginLeft: 'auto', padding: '0.4rem 0.75rem', borderRadius: '2rem', border: '1px solid rgba(200,180,255,0.15)', background: 'rgba(8,6,28,0.7)', color: 'rgba(180,160,255,0.6)', fontSize: '0.75rem', cursor: 'pointer' }}>+ Add Custom</button>
      </div>

      {showAdd && (
        <div style={{ ...card, padding: '1rem', marginBottom: '1rem' }}>
          <textarea value={newText} onChange={e => setNewText(e.target.value)} placeholder="Write your personal affirmation..." rows={3}
            style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(200,180,255,0.15)', borderRadius: '0.75rem', padding: '0.75rem', color: 'rgba(220,200,255,0.9)', fontSize: '0.88rem', resize: 'none', outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit' }} />
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem' }}>
            <select value={newCat} onChange={e => setNewCat(e.target.value)}
              style={{ flex: 1, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(200,180,255,0.15)', borderRadius: '0.75rem', padding: '0.5rem', color: 'rgba(180,160,255,0.8)', fontSize: '0.8rem', outline: 'none' }}>
              {CATEGORIES.filter(c => c.id !== 'all').map(c => <option key={c.id} value={c.id}>{c.emoji} {c.label}</option>)}
            </select>
            <button onClick={addCustom} style={{ padding: '0.5rem 1.25rem', borderRadius: '0.75rem', background: 'linear-gradient(135deg, #7c3aed, #a78bfa)', border: 'none', color: 'white', fontSize: '0.82rem', cursor: 'pointer', fontWeight: 600 }}>Save</button>
          </div>
        </div>
      )}

      <div style={{ display: 'flex', gap: '0.4rem', overflowX: 'auto', paddingBottom: '0.5rem', marginBottom: '1rem' }}>
        {CATEGORIES.map(c => (
          <button key={c.id} onClick={() => setCategory(c.id)}
            style={{ flexShrink: 0, padding: '0.35rem 0.75rem', borderRadius: '2rem', border: category === c.id ? '1px solid rgba(167,139,250,0.6)' : '1px solid rgba(200,180,255,0.12)', background: category === c.id ? 'rgba(167,139,250,0.15)' : 'rgba(8,6,28,0.7)', color: category === c.id ? '#a78bfa' : 'rgba(180,160,255,0.5)', fontSize: '0.72rem', cursor: 'pointer', whiteSpace: 'nowrap' }}>
            {c.emoji} {c.label}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
        {filtered.map(a => (
          <div key={a.id} style={{ ...card, padding: '1rem 1.25rem', display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
            <div style={{ flex: 1 }}>
              <p style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1rem', color: 'rgba(220,200,255,0.88)', margin: '0 0 0.4rem', lineHeight: 1.55, fontStyle: 'italic' }}>{a.text}</p>
              <span style={{ color: 'rgba(167,139,250,0.5)', fontSize: '0.7rem' }}>{a.number}</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', flexShrink: 0 }}>
              <button onClick={() => toggleFav(a.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.1rem', color: favs.includes(a.id) ? '#c9a84c' : 'rgba(180,160,255,0.25)', padding: '0.2rem' }}>
                {favs.includes(a.id) ? '♥' : '♡'}
              </button>
              {custom.find(c => c.id === a.id) && (
                <button onClick={() => deleteCustom(a.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '0.8rem', color: 'rgba(255,100,100,0.4)', padding: '0.2rem' }}>✕</button>
              )}
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'rgba(180,160,255,0.35)', fontSize: '0.85rem' }}>No affirmations found. Try a different filter.</div>
        )}
      </div>
    </div>
  )
}
