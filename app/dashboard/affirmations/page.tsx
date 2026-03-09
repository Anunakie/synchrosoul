'use client'
import { useState, useEffect } from 'react'

const AFFIRMATIONS = [
  { id: 'a1', number: '111', text: 'I am a powerful creator. Every thought I think is a seed that blossoms into reality.', color: '#fbbf24' },
  { id: 'a2', number: '111', text: 'New beginnings flow to me effortlessly. I am always in the right place at the right time.', color: '#fbbf24' },
  { id: 'a3', number: '222', text: 'I trust divine timing completely. Everything is unfolding perfectly for my highest good.', color: '#60a5fa' },
  { id: 'a4', number: '222', text: 'I am in perfect harmony with the universe. Balance and peace are my natural state.', color: '#60a5fa' },
  { id: 'a5', number: '333', text: 'I am a clear channel for divine creativity. My gifts are needed and celebrated in this world.', color: '#a78bfa' },
  { id: 'a6', number: '333', text: 'The ascended masters walk beside me. I am never alone on this sacred journey.', color: '#a78bfa' },
  { id: 'a7', number: '444', text: 'I am completely surrounded by angelic protection. I am safe, held, and deeply loved.', color: '#34d399' },
  { id: 'a8', number: '444', text: 'My foundation is unshakeable. I build my life on the solid ground of divine truth.', color: '#34d399' },
  { id: 'a9', number: '555', text: 'I embrace change with grace and excitement. Every transformation brings me closer to my true self.', color: '#fb923c' },
  { id: 'a10', number: '555', text: 'I release the old with gratitude. I welcome the miraculous new with open arms.', color: '#fb923c' },
  { id: 'a11', number: '666', text: 'I return to my center with ease. My soul knows the way home.', color: '#86efac' },
  { id: 'a12', number: '777', text: 'I am in divine flow. Magic, synchronicity, and miracles are my everyday experience.', color: '#818cf8' },
  { id: 'a13', number: '777', text: 'I am on the right path. Every step I take is guided by infinite wisdom.', color: '#818cf8' },
  { id: 'a14', number: '888', text: 'Abundance is my birthright. Money, love, and joy flow to me from all directions.', color: '#c9a84c' },
  { id: 'a15', number: '888', text: 'I am a magnet for prosperity. The universe conspires to bring me everything I need and desire.', color: '#c9a84c' },
  { id: 'a16', number: '999', text: 'I complete every cycle with grace and wisdom. I am reborn stronger, wiser, and more radiant.', color: '#f472b6' },
  { id: 'a17', number: '1111', text: 'I am a master manifestor. My desires align with divine will and materialize with perfect timing.', color: '#fde68a' },
  { id: 'a18', number: '1111', text: 'The universe is always conspiring in my favor. I am exactly where I am meant to be.', color: '#fde68a' },
  { id: 'a19', number: '1212', text: 'My heart is open to profound soul connection. Love in its highest form flows to me now.', color: '#f9a8d4' },
  { id: 'a20', number: 'daily', text: 'Today I choose joy, gratitude, and presence. I am exactly enough, exactly as I am.', color: '#e0e7ff' },
  { id: 'a21', number: 'daily', text: 'I am worthy of all the beauty life has to offer. I receive with grace and give with love.', color: '#e0e7ff' },
  { id: 'a22', number: 'daily', text: 'My soul is ancient and wise. I trust the knowing that lives within me.', color: '#e0e7ff' },
  { id: 'a23', number: 'daily', text: 'I am the author of my story. Today I write a chapter filled with courage and wonder.', color: '#e0e7ff' },
  { id: 'a24', number: 'daily', text: 'Every breath I take fills me with divine light. I am alive, awake, and aligned.', color: '#e0e7ff' },
]

const FAV_KEY = 'synchrosoul_affirmation_favs'
const DAILY_KEY = 'synchrosoul_affirmation_daily'

function getDailyAffirmation(): typeof AFFIRMATIONS[0] {
  const today = new Date().toDateString()
  const saved = localStorage.getItem(DAILY_KEY)
  if (saved) {
    const { date, id } = JSON.parse(saved)
    if (date === today) {
      const found = AFFIRMATIONS.find(a => a.id === id)
      if (found) return found
    }
  }
  const idx = Math.floor(Math.random() * AFFIRMATIONS.length)
  localStorage.setItem(DAILY_KEY, JSON.stringify({ date: today, id: AFFIRMATIONS[idx].id }))
  return AFFIRMATIONS[idx]
}

export default function AffirmationsPage() {
  const [daily, setDaily] = useState<typeof AFFIRMATIONS[0] | null>(null)
  const [favs, setFavs] = useState<string[]>([])
  const [current, setCurrent] = useState(0)
  const [filter, setFilter] = useState('all')
  const [tab, setTab] = useState<'browse'|'favorites'>('browse')
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    setDaily(getDailyAffirmation())
    const saved = localStorage.getItem(FAV_KEY)
    if (saved) setFavs(JSON.parse(saved))
  }, [])

  function toggleFav(id: string) {
    const updated = favs.includes(id) ? favs.filter(f => f !== id) : [...favs, id]
    setFavs(updated)
    localStorage.setItem(FAV_KEY, JSON.stringify(updated))
  }

  function copyText(text: string) {
    navigator.clipboard.writeText(text).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000) })
  }

  const numbers = ['all', '111', '222', '333', '444', '555', '777', '888', '999', '1111', '1212', 'daily']
  const filtered = AFFIRMATIONS.filter(a => filter === 'all' || a.number === filter)
  const displayed = tab === 'favorites' ? AFFIRMATIONS.filter(a => favs.includes(a.id)) : filtered
  const card: React.CSSProperties = { background: 'rgba(8,6,28,0.88)', border: '1px solid rgba(200,180,255,0.12)', borderRadius: '1.25rem', backdropFilter: 'blur(12px)' }

  return (
    <div style={{ maxWidth: '520px', margin: '0 auto', padding: '1.5rem 1rem 2rem' }}>
      <div style={{ marginBottom: '1.25rem' }}>
        <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.8rem', color: 'rgba(220,200,255,0.95)', margin: '0 0 0.25rem', fontWeight: 400 }}>Affirmations</h1>
        <p style={{ color: 'rgba(180,160,255,0.5)', fontSize: '0.8rem', margin: 0 }}>Sacred words to reprogram your reality</p>
      </div>

      {/* Daily affirmation */}
      {daily && (
        <div style={{ ...card, padding: '1.5rem', marginBottom: '1.25rem', borderColor: daily.color + '30', background: daily.color + '06', position: 'relative' }}>
          <div style={{ color: daily.color, fontSize: '0.62rem', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '0.75rem' }}>✦ Today's Affirmation</div>
          <p style={{ color: 'rgba(220,200,255,0.9)', fontSize: '1.05rem', lineHeight: 1.7, margin: '0 0 1rem', fontFamily: 'Cormorant Garamond, serif', fontStyle: 'italic' }}>&ldquo;{daily.text}&rdquo;</p>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button onClick={() => toggleFav(daily.id)} style={{ padding: '0.4rem 0.875rem', borderRadius: '2rem', border: favs.includes(daily.id) ? '1px solid rgba(244,114,182,0.5)' : '1px solid rgba(200,180,255,0.15)', background: favs.includes(daily.id) ? 'rgba(244,114,182,0.12)' : 'transparent', color: favs.includes(daily.id) ? '#f472b6' : 'rgba(180,160,255,0.4)', fontSize: '0.75rem', cursor: 'pointer' }}>{favs.includes(daily.id) ? '♥ Saved' : '♡ Save'}</button>
            <button onClick={() => copyText(daily.text)} style={{ padding: '0.4rem 0.875rem', borderRadius: '2rem', border: '1px solid rgba(200,180,255,0.15)', background: 'transparent', color: copied ? '#34d399' : 'rgba(180,160,255,0.4)', fontSize: '0.75rem', cursor: 'pointer' }}>{copied ? '✓ Copied' : '⎘ Copy'}</button>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
        {(['browse', 'favorites'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)} style={{ flex: 1, padding: '0.5rem', borderRadius: '0.75rem', border: tab===t ? '1px solid rgba(201,168,76,0.4)' : '1px solid rgba(200,180,255,0.1)', background: tab===t ? 'rgba(201,168,76,0.12)' : 'rgba(8,6,28,0.6)', color: tab===t ? '#c9a84c' : 'rgba(180,160,255,0.4)', fontSize: '0.78rem', cursor: 'pointer', textTransform: 'capitalize' }}>{t} {t === 'favorites' ? '(' + favs.length + ')' : ''}</button>
        ))}
      </div>

      {/* Number filter */}
      {tab === 'browse' && (
        <div style={{ display: 'flex', gap: '0.35rem', overflowX: 'auto', paddingBottom: '0.5rem', marginBottom: '1rem' }}>
          {numbers.map(n => (
            <button key={n} onClick={() => setFilter(n)} style={{ flexShrink: 0, padding: '0.3rem 0.625rem', borderRadius: '2rem', border: filter===n ? '1px solid rgba(201,168,76,0.5)' : '1px solid rgba(200,180,255,0.1)', background: filter===n ? 'rgba(201,168,76,0.12)' : 'rgba(8,6,28,0.6)', color: filter===n ? '#c9a84c' : 'rgba(180,160,255,0.35)', fontSize: '0.68rem', cursor: 'pointer', whiteSpace: 'nowrap' }}>{n === 'all' ? 'All' : n}</button>
          ))}
        </div>
      )}

      {/* Affirmation list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {displayed.length === 0 ? (
          <div style={{ ...card, padding: '2rem', textAlign: 'center', color: 'rgba(180,160,255,0.4)', fontSize: '0.85rem' }}>No affirmations here yet</div>
        ) : displayed.map(a => (
          <div key={a.id} style={{ ...card, padding: '1.25rem', borderColor: a.color + '20', background: a.color + '05' }}>
            <div style={{ color: a.color, fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>{a.number === 'daily' ? 'Universal' : a.number}</div>
            <p style={{ color: 'rgba(220,200,255,0.85)', fontSize: '0.9rem', lineHeight: 1.65, margin: '0 0 0.875rem', fontFamily: 'Cormorant Garamond, serif', fontStyle: 'italic' }}>&ldquo;{a.text}&rdquo;</p>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button onClick={() => toggleFav(a.id)} style={{ padding: '0.3rem 0.75rem', borderRadius: '2rem', border: favs.includes(a.id) ? '1px solid rgba(244,114,182,0.4)' : '1px solid rgba(200,180,255,0.12)', background: favs.includes(a.id) ? 'rgba(244,114,182,0.1)' : 'transparent', color: favs.includes(a.id) ? '#f472b6' : 'rgba(180,160,255,0.35)', fontSize: '0.7rem', cursor: 'pointer' }}>{favs.includes(a.id) ? '♥' : '♡'}</button>
              <button onClick={() => copyText(a.text)} style={{ padding: '0.3rem 0.75rem', borderRadius: '2rem', border: '1px solid rgba(200,180,255,0.12)', background: 'transparent', color: 'rgba(180,160,255,0.35)', fontSize: '0.7rem', cursor: 'pointer' }}>⎘</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
