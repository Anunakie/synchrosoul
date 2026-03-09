'use client'
import { useState, useEffect } from 'react'
import { getLogs } from '@/lib/storage'


const BASE_AFFIRMATIONS: Record<string, string[]> = {
  '111': ['I am a powerful creator. My thoughts shape my reality.', 'Every thought I think is a seed I plant in the universe.', 'I am aligned with the frequency of manifestation.', 'My intentions are clear, focused, and powerful.'],
  '222': ['I trust divine timing completely.', 'Everything is unfolding perfectly for my highest good.', 'I am in perfect balance with the universe.', 'Patience is my superpower. I trust the process.'],
  '333': ['My creativity is a divine gift to the world.', 'I express my truth boldly and authentically.', 'The ascended masters guide my every step.', 'I am a channel for divine creative energy.'],
  '444': ['I am safe, protected, and deeply loved.', 'My angels walk beside me always.', 'I build my life on solid, unshakeable foundations.', 'I am exactly where I am meant to be.'],
  '555': ['I embrace change as my greatest teacher.', 'Every transformation leads me to my highest self.', 'I release the old with gratitude and welcome the new.', 'Change is not happening to me — it is happening for me.'],
  '666': ['I release fear and return to love.', 'I balance the material and spiritual with grace.', 'My inner world creates my outer world.', 'I choose love over fear in every moment.'],
  '777': ['I am in perfect alignment with the universe.', 'Miracles are my natural state of being.', 'I am on the right path. Everything is working out.', 'I am divinely guided, protected, and blessed.'],
  '888': ['Abundance flows to me from all directions.', 'I am a magnet for prosperity and wealth.', 'I give and receive freely. The cycle is complete.', 'Financial freedom is my birthright.'],
  '999': ['I release what no longer serves me with love.', 'I am ready for my next highest chapter.', 'My past has made me wise. My future is bright.', 'I complete cycles with grace and gratitude.'],
  '1111': ['I am a portal for miracles.', 'My deepest desires are manifesting now.', 'I am the universe experiencing itself.', 'Magic is real and I am living proof.'],
  '1212': ['I am cosmically aligned and divinely supported.', 'My positive energy creates a beautiful reality.', 'I am exactly where I need to be.', 'The universe conspires in my favor always.'],
}

const LIFE_PATH_AFFIRMATIONS: Record<number, string[]> = {
  1: ['I am a natural leader. I blaze trails with courage.', 'My independence is my strength.', 'I initiate with confidence and complete with pride.'],
  2: ['My sensitivity is my superpower.', 'I create harmony wherever I go.', 'My partnerships are blessed and beautiful.'],
  3: ['My joy is contagious and healing.', 'I express myself with confidence and creativity.', 'My words uplift and inspire everyone around me.'],
  4: ['I build lasting foundations with love.', 'My discipline creates extraordinary results.', 'I am reliable, strong, and deeply trustworthy.'],
  5: ['I embrace freedom as my natural state.', 'Adventure and change are my greatest teachers.', 'I adapt with grace and thrive in all conditions.'],
  6: ['My love heals and nurtures all it touches.', 'I create beauty and harmony in my world.', 'My compassion is a gift to humanity.'],
  7: ['My wisdom runs deep as the ocean.', 'I trust my inner knowing above all else.', 'Solitude is sacred and I honor my need for it.'],
  8: ['I am a master of the material world.', 'Power and abundance flow through me naturally.', 'I lead with integrity and create lasting impact.'],
  9: ['I am here to serve and uplift humanity.', 'My compassion knows no bounds.', 'I complete my mission with love and wisdom.'],
  11: ['I am a spiritual messenger of the highest order.', 'My intuition is my divine compass.', 'I illuminate the path for others.'],
  22: ['I build dreams into reality.', 'My vision is vast and my power is limitless.', 'I create lasting change in the world.'],
  33: ['I am a master healer and teacher.', 'My love transforms everything it touches.', 'I uplift humanity through compassion.'],
}

const MORNING = ['I wake with gratitude and intention.', 'Today I am open to miracles.', 'I begin this day aligned with my highest self.', 'This day is filled with divine possibilities.']
const EVENING = ['I release this day with gratitude.', 'I have done enough. I am enough.', 'I rest in the arms of the universe.', 'Tomorrow holds infinite possibilities.']
const UNIVERSAL = ['I am worthy of all good things.', 'Love is my natural state.', 'I am exactly who I am meant to be.', 'The universe supports me completely.']

export default function AffirmationsPage() {
  const [affirmations, setAffirmations] = useState<string[]>([])
  const [current, setCurrent] = useState(0)
  const [saved, setSaved] = useState<string[]>([])
  const [tab, setTab] = useState<'daily'|'saved'|'all'>('daily')
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const logs = getLogs().slice(0, 10)
    const raw = localStorage.getItem('synchrosoul_numerology'); const profile = raw ? JSON.parse(raw) : null
    const hour = new Date().getHours()
    const isMorning = hour >= 5 && hour < 12
    const isEvening = hour >= 18

    const pool: string[] = []
    // Time-based
    if (isMorning) pool.push(...MORNING)
    if (isEvening) pool.push(...EVENING)
    pool.push(...UNIVERSAL)
    // From recent logs
    const recentNums = [...new Set(logs.map(l => l.number))].slice(0, 3)
    recentNums.forEach(num => {
      const key = Object.keys(BASE_AFFIRMATIONS).find(k => num.includes(k) || k.includes(num))
      if (key) pool.push(...BASE_AFFIRMATIONS[key])
    })
    // From life path
    if (profile?.lifePathNumber) {
      const lp = LIFE_PATH_AFFIRMATIONS[profile.lifePathNumber]
      if (lp) pool.push(...lp)
    }
    // Deduplicate and shuffle
    const unique = [...new Set(pool)]
    const shuffled = unique.sort(() => Math.random() - 0.5)
    setAffirmations(shuffled)

    const savedRaw = localStorage.getItem('synchrosoul_saved_affirmations')
    if (savedRaw) setSaved(JSON.parse(savedRaw))
  }, [])

  function toggleSave(a: string) {
    const next = saved.includes(a) ? saved.filter(s => s !== a) : [...saved, a]
    setSaved(next)
    localStorage.setItem('synchrosoul_saved_affirmations', JSON.stringify(next))
  }

  function copyAffirmation(a: string) {
    navigator.clipboard?.writeText(a).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  const displayed = tab === 'daily' ? affirmations : tab === 'saved' ? saved : Object.values(BASE_AFFIRMATIONS).flat()
  const current_aff = displayed[current % Math.max(displayed.length, 1)]

  const card = { background: 'rgba(8,6,28,0.88)', border: '1px solid rgba(200,180,255,0.12)', borderRadius: '1rem', backdropFilter: 'blur(12px)' } as React.CSSProperties

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '1.5rem 1rem 2rem' }}>
      <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.8rem', color: 'rgba(220,200,255,0.95)', margin: '0 0 0.25rem', fontWeight: 400 }}>Affirmations</h1>
      <p style={{ color: 'rgba(180,160,255,0.5)', fontSize: '0.8rem', margin: '0 0 1.5rem' }}>Personalized to your angel numbers and numerology</p>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
        {(['daily','saved','all'] as const).map(t => (
          <button key={t} onClick={() => { setTab(t); setCurrent(0) }} style={{ padding: '0.4rem 1rem', borderRadius: '2rem', cursor: 'pointer', fontSize: '0.75rem', fontFamily: 'inherit', background: tab === t ? 'rgba(167,139,250,0.2)' : 'rgba(255,255,255,0.04)', border: tab === t ? '1px solid rgba(167,139,250,0.5)' : '1px solid rgba(255,255,255,0.08)', color: tab === t ? 'rgba(200,180,255,0.95)' : 'rgba(180,160,255,0.5)', textTransform: 'capitalize' }}>{t === 'daily' ? '✦ Daily' : t === 'saved' ? `♡ Saved (${saved.length})` : '∞ All'}</button>
        ))}
      </div>

      {/* Hero affirmation card */}
      {current_aff && (
        <div style={{ ...card, padding: '2.5rem 2rem', textAlign: 'center', marginBottom: '1.5rem', background: 'rgba(20,10,50,0.92)', border: '1px solid rgba(167,139,250,0.2)', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: '1rem', left: '1.5rem', fontSize: '2rem', opacity: 0.08, fontFamily: 'Cormorant Garamond, serif' }}>“</div>
          <div style={{ position: 'absolute', bottom: '1rem', right: '1.5rem', fontSize: '2rem', opacity: 0.08, fontFamily: 'Cormorant Garamond, serif' }}>”</div>
          <p style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.35rem', color: 'rgba(220,200,255,0.95)', lineHeight: 1.6, margin: '0 0 1.5rem', fontStyle: 'italic', position: 'relative', zIndex: 1 }}>{current_aff}</p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem' }}>
            <button onClick={() => setCurrent(c => (c - 1 + displayed.length) % displayed.length)} style={{ width: '2.2rem', height: '2.2rem', borderRadius: '50%', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(200,180,255,0.15)', cursor: 'pointer', color: 'rgba(200,180,255,0.7)', fontSize: '0.9rem' }}>←</button>
            <button onClick={() => toggleSave(current_aff)} style={{ padding: '0.4rem 1rem', borderRadius: '2rem', background: saved.includes(current_aff) ? 'rgba(255,100,150,0.2)' : 'rgba(255,255,255,0.06)', border: saved.includes(current_aff) ? '1px solid rgba(255,100,150,0.5)' : '1px solid rgba(200,180,255,0.15)', cursor: 'pointer', color: saved.includes(current_aff) ? 'rgba(255,150,180,0.9)' : 'rgba(200,180,255,0.7)', fontSize: '0.8rem', fontFamily: 'inherit' }}>{saved.includes(current_aff) ? '♥ Saved' : '♡ Save'}</button>
            <button onClick={() => copyAffirmation(current_aff)} style={{ padding: '0.4rem 1rem', borderRadius: '2rem', background: copied ? 'rgba(80,200,120,0.15)' : 'rgba(255,255,255,0.06)', border: copied ? '1px solid rgba(80,200,120,0.4)' : '1px solid rgba(200,180,255,0.15)', cursor: 'pointer', color: copied ? 'rgba(100,220,140,0.9)' : 'rgba(200,180,255,0.7)', fontSize: '0.8rem', fontFamily: 'inherit' }}>{copied ? '✓ Copied' : '⎘ Copy'}</button>
            <button onClick={() => setCurrent(c => (c + 1) % displayed.length)} style={{ width: '2.2rem', height: '2.2rem', borderRadius: '50%', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(200,180,255,0.15)', cursor: 'pointer', color: 'rgba(200,180,255,0.7)', fontSize: '0.9rem' }}>→</button>
          </div>
          <div style={{ color: 'rgba(180,160,255,0.3)', fontSize: '0.65rem', marginTop: '1rem' }}>{current + 1} of {displayed.length}</div>
        </div>
      )}

      {/* All affirmations list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
        {displayed.map((a, i) => (
          <div key={i} onClick={() => setCurrent(i)} style={{ ...card, padding: '1rem 1.25rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem', border: i === current % displayed.length ? '1px solid rgba(167,139,250,0.4)' : '1px solid rgba(200,180,255,0.08)', background: i === current % displayed.length ? 'rgba(20,10,50,0.95)' : 'rgba(8,6,28,0.88)' }}>
            <p style={{ color: 'rgba(200,180,255,0.8)', fontSize: '0.82rem', margin: 0, lineHeight: 1.5, flex: 1 }}>{a}</p>
            <button onClick={e => { e.stopPropagation(); toggleSave(a) }} style={{ background: 'none', border: 'none', cursor: 'pointer', color: saved.includes(a) ? 'rgba(255,100,150,0.8)' : 'rgba(200,180,255,0.25)', fontSize: '1rem', flexShrink: 0 }}>{saved.includes(a) ? '♥' : '♡'}</button>
          </div>
        ))}
        {displayed.length === 0 && (
          <div style={{ ...card, padding: '2rem', textAlign: 'center', color: 'rgba(180,160,255,0.5)', fontSize: '0.85rem' }}>No affirmations here yet</div>
        )}
      </div>
    </div>
  )
}
