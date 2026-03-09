'use client'
import { useState, useEffect } from 'react'

const KEY = 'synchrosoul_affirmations'

const AFFIRMATION_SETS = [
  { id: 'abundance', label: 'Abundance', emoji: '✨', color: '#c9a84c', affirmations: [
    'I am a magnet for miracles and abundance flows to me effortlessly.',
    'Money comes to me in expected and unexpected ways.',
    'I am worthy of all the wealth and prosperity the universe has to offer.',
    'My income is constantly increasing and I always have more than enough.',
    'I attract opportunities that create unlimited abundance.',
    'The universe is conspiring in my favor right now.',
    'I release all resistance to receiving and allow abundance to flow.',
    'Every day I am becoming more financially free and secure.',
  ]},
  { id: 'love', label: 'Love', emoji: '💗', color: '#f472b6', affirmations: [
    'I am deeply loved and I radiate love to everyone around me.',
    'My heart is open and I attract loving, supportive relationships.',
    'I deserve a love that is deep, passionate, and spiritually aligned.',
    'I release past wounds and welcome new love with an open heart.',
    'My twin flame is being guided to me by divine timing.',
    'I am whole and complete within myself, and love finds me easily.',
    'Every relationship in my life reflects the love I have for myself.',
    'I am safe to love and be loved fully and completely.',
  ]},
  { id: 'purpose', label: 'Purpose', emoji: '🌟', color: '#a78bfa', affirmations: [
    'I am exactly where I am meant to be on my soul journey.',
    'My unique gifts and talents are needed in this world.',
    'I trust the divine plan unfolding in my life.',
    'Every experience I have had has prepared me for my highest purpose.',
    'I am guided by my intuition toward my soul mission.',
    'The universe supports me fully as I step into my purpose.',
    'I am a channel for divine creativity and inspiration.',
    'My work in the world creates ripples of positive change.',
  ]},
  { id: 'healing', label: 'Healing', emoji: '💚', color: '#34d399', affirmations: [
    'My body is a sacred vessel and I treat it with love and care.',
    'I release all that no longer serves my highest good.',
    'Every cell in my body vibrates with health and vitality.',
    'I am healing on all levels — physical, emotional, and spiritual.',
    'I forgive myself and others and choose peace.',
    'My nervous system is calm, safe, and regulated.',
    'I am worthy of rest, nourishment, and deep healing.',
    'The universe is healing me in ways I cannot yet see.',
  ]},
  { id: 'confidence', label: 'Confidence', emoji: '🔥', color: '#f59e0b', affirmations: [
    'I am powerful beyond measure and I own my greatness.',
    'I speak my truth with clarity, confidence, and grace.',
    'I trust myself completely and my decisions are always guided.',
    'I am enough exactly as I am, right now, in this moment.',
    'I walk into every room knowing I belong there.',
    'My presence is a gift and I share it freely.',
    'I release the need for approval and stand fully in my power.',
    'I am becoming more confident and magnetic every single day.',
  ]},
  { id: 'spiritual', label: 'Spiritual', emoji: '🌌', color: '#818cf8', affirmations: [
    'I am a divine being having a human experience.',
    'I am deeply connected to the infinite wisdom of the universe.',
    'The angel numbers I see are real messages guiding my path.',
    'I trust the signs, synchronicities, and divine timing in my life.',
    'I am protected, guided, and supported by higher forces.',
    'My intuition is my superpower and I trust it completely.',
    'I am in perfect alignment with my highest self.',
    'The universe speaks to me and I am always listening.',
  ]},
]

interface AffirmationLog {
  text: string
  category: string
  savedAt: string
}

export default function AffirmationsPage() {
  const [saved, setSaved] = useState<AffirmationLog[]>([])
  const [category, setCategory] = useState('abundance')
  const [currentIndex, setCurrentIndex] = useState(0)
  const [mode, setMode] = useState<'swipe' | 'saved'>('swipe')
  const [affirmed, setAffirmed] = useState(false)

  useEffect(() => {
    const s = localStorage.getItem(KEY)
    if (s) setSaved(JSON.parse(s))
    setCurrentIndex(Math.floor(Math.random() * 8))
  }, [])

  const currentSet = AFFIRMATION_SETS.find(s => s.id === category)!
  const currentAffirmation = currentSet.affirmations[currentIndex % currentSet.affirmations.length]

  function next() {
    setCurrentIndex(i => (i + 1) % currentSet.affirmations.length)
    setAffirmed(false)
  }

  function saveAffirmation() {
    const log: AffirmationLog = { text: currentAffirmation, category, savedAt: new Date().toISOString() }
    const next = [log, ...saved.filter(s => s.text !== currentAffirmation)]
    setSaved(next)
    localStorage.setItem(KEY, JSON.stringify(next))
    setAffirmed(true)
  }

  function removeSaved(text: string) {
    const next = saved.filter(s => s.text !== text)
    setSaved(next)
    localStorage.setItem(KEY, JSON.stringify(next))
  }

  const card = { background: 'rgba(8,6,28,0.88)', border: '1px solid rgba(200,180,255,0.12)', borderRadius: '1.25rem', backdropFilter: 'blur(12px)' } as React.CSSProperties

  return (
    <div style={{ maxWidth: '680px', margin: '0 auto', padding: '1.5rem 1rem 2rem' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
        <div>
          <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.8rem', color: 'rgba(220,200,255,0.95)', margin: '0 0 0.25rem', fontWeight: 400 }}>Affirmations</h1>
          <p style={{ color: 'rgba(180,160,255,0.5)', fontSize: '0.8rem', margin: 0 }}>{saved.length} saved · Reprogram your subconscious</p>
        </div>
        <div style={{ display: 'flex', gap: '0.4rem' }}>
          {(['swipe','saved'] as const).map(v => (
            <button key={v} onClick={() => setMode(v)} style={{ padding: '0.35rem 0.75rem', borderRadius: '2rem', border: mode === v ? '1px solid rgba(167,139,250,0.5)' : '1px solid rgba(200,180,255,0.1)', background: mode === v ? 'rgba(167,139,250,0.15)' : 'rgba(8,6,28,0.7)', color: mode === v ? '#a78bfa' : 'rgba(180,160,255,0.45)', fontSize: '0.72rem', cursor: 'pointer', textTransform: 'capitalize' }}>{v}</button>
          ))}
        </div>
      </div>

      {mode === 'swipe' && (
        <>
          {/* Category pills */}
          <div style={{ display: 'flex', gap: '0.4rem', overflowX: 'auto', paddingBottom: '0.25rem', marginBottom: '1.5rem' }}>
            {AFFIRMATION_SETS.map(s => (
              <button key={s.id} onClick={() => { setCategory(s.id); setCurrentIndex(0); setAffirmed(false) }} style={{ flexShrink: 0, padding: '0.35rem 0.75rem', borderRadius: '2rem', border: category === s.id ? `1px solid ${s.color}66` : '1px solid rgba(200,180,255,0.1)', background: category === s.id ? `${s.color}18` : 'rgba(8,6,28,0.7)', color: category === s.id ? s.color : 'rgba(180,160,255,0.45)', fontSize: '0.72rem', cursor: 'pointer', whiteSpace: 'nowrap' }}>{s.emoji} {s.label}</button>
            ))}
          </div>

          {/* Main affirmation card */}
          <div style={{ ...card, padding: '2.5rem 2rem', marginBottom: '1.25rem', textAlign: 'center', borderColor: `${currentSet.color}33`, minHeight: '200px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
            <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>{currentSet.emoji}</div>
            <p style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.3rem', color: 'rgba(220,200,255,0.92)', margin: '0 0 1.5rem', lineHeight: 1.6, fontStyle: 'italic' }}>&ldquo;{currentAffirmation}&rdquo;</p>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button onClick={saveAffirmation} style={{ padding: '0.5rem 1.25rem', borderRadius: '2rem', background: affirmed ? `${currentSet.color}33` : 'rgba(255,255,255,0.05)', border: `1px solid ${affirmed ? currentSet.color : 'rgba(200,180,255,0.15)'}`, color: affirmed ? currentSet.color : 'rgba(180,160,255,0.6)', fontSize: '0.8rem', cursor: 'pointer', transition: 'all 0.2s' }}>{affirmed ? '✓ Saved' : '♡ Save'}</button>
              <button onClick={next} style={{ padding: '0.5rem 1.25rem', borderRadius: '2rem', background: `linear-gradient(135deg, ${currentSet.color}66, ${currentSet.color}cc)`, border: 'none', color: 'white', fontSize: '0.8rem', cursor: 'pointer', fontWeight: 600 }}>Next ›</button>
            </div>
          </div>

          {/* Repeat instruction */}
          <p style={{ textAlign: 'center', color: 'rgba(180,160,255,0.35)', fontSize: '0.78rem' }}>Speak this aloud 3 times with full feeling ✦</p>
        </>
      )}

      {mode === 'saved' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
          {saved.length === 0 ? (
            <div style={{ ...card, padding: '2rem', textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>💫</div>
              <p style={{ color: 'rgba(180,160,255,0.5)', fontSize: '0.85rem', margin: 0 }}>No saved affirmations yet. Save ones that resonate with you.</p>
            </div>
          ) : saved.map((s, i) => {
            const set = AFFIRMATION_SETS.find(a => a.id === s.category) || AFFIRMATION_SETS[0]
            return (
              <div key={i} style={{ ...card, padding: '1rem 1.25rem', display: 'flex', alignItems: 'flex-start', gap: '0.75rem', borderColor: `${set.color}22` }}>
                <span style={{ fontSize: '1.1rem', flexShrink: 0, marginTop: '0.1rem' }}>{set.emoji}</span>
                <p style={{ flex: 1, color: 'rgba(200,180,255,0.8)', fontSize: '0.85rem', margin: 0, lineHeight: 1.5, fontStyle: 'italic' }}>&ldquo;{s.text}&rdquo;</p>
                <button onClick={() => removeSaved(s.text)} style={{ background: 'none', border: 'none', color: 'rgba(180,160,255,0.25)', cursor: 'pointer', fontSize: '0.9rem', flexShrink: 0, padding: '0.1rem' }}>✕</button>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
