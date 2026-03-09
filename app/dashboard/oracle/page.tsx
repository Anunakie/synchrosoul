'use client'
import { useState, useEffect } from 'react'

const READINGS_KEY = 'synchrosoul_oracle_readings'

const CARDS = [
  { id: 1, name: 'The Awakening', emoji: '🌟', element: 'Spirit', message: 'A profound shift in consciousness is underway. You are remembering who you truly are beyond the physical.', guidance: 'Meditate on your higher self. Journal what arises in the quiet moments.', number: 1 },
  { id: 2, name: 'The Mirror', emoji: '🌊', element: 'Water', message: 'What you see in others reflects something within yourself. The universe is showing you your own depths.', guidance: 'Look inward before judging outward. Your reflection holds wisdom.', number: 2 },
  { id: 3, name: 'The Bloom', emoji: '🌸', element: 'Earth', message: 'Creative energy is bursting through you. This is a time of joyful expression and abundant growth.', guidance: 'Create something today. Let your inner child lead the way.', number: 3 },
  { id: 4, name: 'The Foundation', emoji: '🗻', element: 'Earth', message: 'Stability and security are being built beneath your feet. Trust the slow and steady process.', guidance: 'Focus on one thing at a time. Build with intention and patience.', number: 4 },
  { id: 5, name: 'The Wind', emoji: '🌬️', element: 'Air', message: 'Change is the only constant. A liberating shift is coming — embrace it rather than resist.', guidance: 'Release your grip on how things should be. Freedom awaits.', number: 5 },
  { id: 6, name: 'The Heart', emoji: '💞', element: 'Water', message: 'Love in all its forms is your greatest teacher right now. Open your heart wider than feels comfortable.', guidance: 'Practice unconditional love — starting with yourself.', number: 6 },
  { id: 7, name: 'The Veil', emoji: '🌙', element: 'Spirit', message: 'The mystical realms are close. Your intuition is your most powerful tool — trust what you cannot explain.', guidance: 'Spend time in silence. The answers you seek live within.', number: 7 },
  { id: 8, name: 'The Infinity', emoji: '♾️', element: 'Fire', message: 'Infinite abundance is your birthright. The universe is conspiring to bring you everything you need.', guidance: 'Act as if you already have what you desire. Embody abundance now.', number: 8 },
  { id: 9, name: 'The Release', emoji: '🍂', element: 'Air', message: 'A beautiful completion is at hand. Honor what has been and release it with gratitude and grace.', guidance: 'Write a letter of release. Burn it or bury it ceremonially.', number: 9 },
  { id: 10, name: 'The Portal', emoji: '🚪', element: 'Spirit', message: 'You stand at a threshold between who you were and who you are becoming. Step through with courage.', guidance: 'Take one bold step toward your highest vision today.', number: 10 },
  { id: 11, name: 'The Messenger', emoji: '🪁', element: 'Air', message: 'Divine messages are flowing to you through signs, synchronicities, and angel numbers. Pay attention.', guidance: 'Keep a synchronicity journal. Note every meaningful coincidence.', number: 11 },
  { id: 12, name: 'The Surrender', emoji: '🕊️', element: 'Spirit', message: 'True power comes from letting go. Surrender your need to control and watch miracles unfold.', guidance: 'Say: I release this to the universe and trust the divine plan.', number: 12 },
  { id: 13, name: 'The Phoenix', emoji: '🔥', element: 'Fire', message: 'From the ashes of what no longer serves you, something magnificent is rising. Transformation is complete.', guidance: 'Celebrate how far you have come. You are reborn.', number: 13 },
  { id: 14, name: 'The Alchemist', emoji: '⚗️', element: 'Fire', message: 'You have the power to transform any situation. Your perspective is the philosopher stone.', guidance: 'Find the gift in your current challenge. Transmute it into gold.', number: 14 },
  { id: 15, name: 'The Anchor', emoji: '⚓', element: 'Earth', message: 'Ground yourself in the present moment. Your roots give you the stability to reach great heights.', guidance: 'Walk barefoot on earth. Breathe deeply. You are safe.', number: 15 },
  { id: 16, name: 'The Lightning', emoji: '⚡', element: 'Fire', message: 'A sudden revelation or breakthrough is imminent. What seemed solid may shift — this is liberation.', guidance: 'Welcome the unexpected. Lightning clears the air for new growth.', number: 16 },
  { id: 17, name: 'The Star', emoji: '🌟', element: 'Air', message: 'Hope, healing, and divine inspiration flow to you now. You are guided and deeply loved by the cosmos.', guidance: 'Wish upon a star tonight. Your dreams are valid and possible.', number: 17 },
  { id: 18, name: 'The Deep', emoji: '🌌', element: 'Water', message: 'Dive into your subconscious. Dreams, emotions, and hidden truths are surfacing for healing.', guidance: 'Honor your emotions without judgment. Feel to heal.', number: 18 },
  { id: 19, name: 'The Sun', emoji: '☀️', element: 'Fire', message: 'Joy, vitality, and radiant success are yours. Step into the light and let your authentic self shine.', guidance: 'Do something that brings you pure joy today. Shine unapologetically.', number: 19 },
  { id: 20, name: 'The Calling', emoji: '📣', element: 'Spirit', message: 'Your soul is being called to a higher purpose. Listen to the whispers of your deepest knowing.', guidance: 'Ask: What would I do if I knew I could not fail? Then do that.', number: 20 },
  { id: 21, name: 'The Completion', emoji: '🌍', element: 'Spirit', message: 'You have arrived. A cycle of mastery is complete. Celebrate your wholeness and prepare for new horizons.', guidance: 'Acknowledge your journey. You are exactly where you are meant to be.', number: 21 },
  { id: 22, name: 'The Builder', emoji: '🏛️', element: 'Earth', message: 'Master builder energy surrounds you. Your dreams are not too big — they are your blueprint.', guidance: 'Take one concrete step toward your grandest vision today.', number: 22 },
]

const SPREADS = [
  { id: 'single', name: 'Single Card', description: 'Daily guidance', count: 1 },
  { id: 'three', name: 'Past · Present · Future', description: 'Timeline reading', count: 3 },
  { id: 'five', name: 'Soul Cross', description: 'Deep spiritual insight', count: 5 },
]

const ELEMENT_COLORS: Record<string, string> = {
  Fire: '#fb923c', Water: '#60a5fa', Earth: '#34d399', Air: '#e879f9', Spirit: '#c9a84c'
}

function drawCards(count: number): typeof CARDS {
  const shuffled = [...CARDS].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, count)
}

interface Reading {
  id: number
  spread: string
  cards: typeof CARDS
  question: string
  createdAt: string
}

export default function OraclePage() {
  const [readings, setReadings] = useState<Reading[]>([])
  const [activeSpread, setActiveSpread] = useState('single')
  const [question, setQuestion] = useState('')
  const [currentReading, setCurrentReading] = useState<Reading | null>(null)
  const [isRevealing, setIsRevealing] = useState(false)
  const [revealedCards, setRevealedCards] = useState<number[]>([])
  const [showHistory, setShowHistory] = useState(false)

  useEffect(() => {
    const s = localStorage.getItem(READINGS_KEY)
    if (s) setReadings(JSON.parse(s))
  }, [])

  function saveReading(r: Reading) {
    const next = [r, ...readings].slice(0, 20)
    setReadings(next)
    localStorage.setItem(READINGS_KEY, JSON.stringify(next))
  }

  async function drawReading() {
    const spread = SPREADS.find(s => s.id === activeSpread)!
    const cards = drawCards(spread.count)
    const reading: Reading = { id: Date.now(), spread: activeSpread, cards, question, createdAt: new Date().toISOString() }
    setCurrentReading(reading)
    setRevealedCards([])
    setIsRevealing(true)
    saveReading(reading)
    // Reveal cards one by one
    for (let i = 0; i < cards.length; i++) {
      await new Promise(r => setTimeout(r, 600))
      setRevealedCards(prev => [...prev, i])
    }
    setIsRevealing(false)
  }

  const SPREAD_LABELS: Record<string, string[]> = {
    single: ['Your Guidance'],
    three: ['Past', 'Present', 'Future'],
    five: ['Foundation', 'Challenge', 'Higher Self', 'Advice', 'Outcome'],
  }

  const card = { background: 'rgba(8,6,28,0.88)', border: '1px solid rgba(200,180,255,0.12)', borderRadius: '1.25rem', backdropFilter: 'blur(12px)' } as React.CSSProperties

  return (
    <div style={{ maxWidth: '680px', margin: '0 auto', padding: '1.5rem 1rem 2rem' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
        <div>
          <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.8rem', color: 'rgba(220,200,255,0.95)', margin: '0 0 0.25rem', fontWeight: 400 }}>Angel Oracle</h1>
          <p style={{ color: 'rgba(180,160,255,0.5)', fontSize: '0.8rem', margin: 0 }}>{readings.length} readings in your history</p>
        </div>
        <button onClick={() => setShowHistory(h => !h)} style={{ padding: '0.4rem 0.875rem', borderRadius: '0.75rem', background: showHistory ? 'rgba(167,139,250,0.15)' : 'rgba(255,255,255,0.04)', border: showHistory ? '1px solid rgba(167,139,250,0.3)' : '1px solid rgba(200,180,255,0.12)', color: showHistory ? '#a78bfa' : 'rgba(180,160,255,0.5)', fontSize: '0.75rem', cursor: 'pointer' }}>History</button>
      </div>

      {!showHistory ? (
        <>
          {/* Spread selector */}
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem' }}>
            {SPREADS.map(s => (
              <button key={s.id} onClick={() => { setActiveSpread(s.id); setCurrentReading(null) }} style={{ flex: 1, padding: '0.75rem 0.5rem', borderRadius: '0.875rem', border: activeSpread === s.id ? '1px solid rgba(167,139,250,0.4)' : '1px solid rgba(200,180,255,0.1)', background: activeSpread === s.id ? 'rgba(167,139,250,0.12)' : 'rgba(8,6,28,0.7)', cursor: 'pointer', textAlign: 'center' }}>
                <div style={{ color: activeSpread === s.id ? '#a78bfa' : 'rgba(180,160,255,0.5)', fontSize: '0.78rem', fontWeight: 600, marginBottom: '0.2rem' }}>{s.name}</div>
                <div style={{ color: 'rgba(180,160,255,0.35)', fontSize: '0.65rem' }}>{s.description}</div>
              </button>
            ))}
          </div>

          {/* Question input */}
          <div style={{ ...card, padding: '1.25rem', marginBottom: '1.25rem' }}>
            <div style={{ color: 'rgba(180,160,255,0.4)', fontSize: '0.62rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>Hold a question in your heart (optional)</div>
            <input value={question} onChange={e => setQuestion(e.target.value)} placeholder="What guidance do I need right now?" style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(200,180,255,0.15)', borderRadius: '0.75rem', padding: '0.65rem 0.875rem', color: 'rgba(220,200,255,0.9)', fontSize: '0.88rem', outline: 'none', boxSizing: 'border-box', marginBottom: '0.875rem' }} />
            <button onClick={drawReading} disabled={isRevealing} style={{ width: '100%', padding: '0.875rem', borderRadius: '0.875rem', background: isRevealing ? 'rgba(167,139,250,0.2)' : 'linear-gradient(135deg, #4c1d95, #7c3aed, #a78bfa)', border: 'none', color: 'white', fontSize: '0.9rem', cursor: isRevealing ? 'default' : 'pointer', fontWeight: 600, letterSpacing: '0.05em', fontFamily: 'Cormorant Garamond, serif' }}>
              {isRevealing ? '✨ Revealing...' : '✦ Draw Cards'}
            </button>
          </div>

          {/* Current reading */}
          {currentReading && (
            <div>
              {currentReading.question && (
                <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
                  <p style={{ color: 'rgba(180,160,255,0.5)', fontSize: '0.82rem', fontStyle: 'italic' }}>&ldquo;{currentReading.question}&rdquo;</p>
                </div>
              )}
              <div style={{ display: 'grid', gridTemplateColumns: currentReading.cards.length === 1 ? '1fr' : currentReading.cards.length === 3 ? 'repeat(3, 1fr)' : 'repeat(3, 1fr)', gap: '0.75rem', marginBottom: '1.25rem' }}>
                {currentReading.cards.map((c, i) => {
                  const revealed = revealedCards.includes(i)
                  const label = SPREAD_LABELS[currentReading.spread]?.[i] || ''
                  const elColor = ELEMENT_COLORS[c.element]
                  return (
                    <div key={c.id} style={{ ...card, padding: '1.25rem 1rem', textAlign: 'center', borderColor: revealed ? `${elColor}33` : 'rgba(200,180,255,0.08)', transition: 'all 0.5s ease', opacity: revealed ? 1 : 0.3, transform: revealed ? 'translateY(0)' : 'translateY(8px)', gridColumn: currentReading.cards.length === 5 && i >= 3 ? 'span 1' : 'span 1' }}>
                      {label && <div style={{ color: 'rgba(180,160,255,0.4)', fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>{label}</div>}
                      <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{revealed ? c.emoji : '✦'}</div>
                      <div style={{ color: revealed ? 'rgba(220,200,255,0.9)' : 'rgba(180,160,255,0.3)', fontSize: '0.78rem', fontWeight: 600, marginBottom: '0.25rem', fontFamily: 'Cormorant Garamond, serif' }}>{revealed ? c.name : '???'}</div>
                      {revealed && <div style={{ background: `${elColor}18`, border: `1px solid ${elColor}33`, borderRadius: '2rem', padding: '0.1rem 0.4rem', fontSize: '0.6rem', color: elColor, display: 'inline-block', marginBottom: '0.5rem' }}>{c.element}</div>}
                    </div>
                  )
                })}
              </div>

              {/* Full card messages */}
              {revealedCards.length === currentReading.cards.length && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {currentReading.cards.map((c, i) => {
                    const label = SPREAD_LABELS[currentReading.spread]?.[i] || ''
                    const elColor = ELEMENT_COLORS[c.element]
                    return (
                      <div key={c.id} style={{ ...card, padding: '1.25rem', borderColor: `${elColor}22` }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                          <span style={{ fontSize: '1.5rem' }}>{c.emoji}</span>
                          <div>
                            {label && <div style={{ color: 'rgba(180,160,255,0.4)', fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.15rem' }}>{label}</div>}
                            <div style={{ color: 'rgba(220,200,255,0.9)', fontSize: '0.95rem', fontWeight: 600, fontFamily: 'Cormorant Garamond, serif' }}>{c.name}</div>
                          </div>
                        </div>
                        <p style={{ color: 'rgba(200,180,255,0.75)', fontSize: '0.85rem', margin: '0 0 0.625rem', lineHeight: 1.6 }}>{c.message}</p>
                        <div style={{ background: `${elColor}0d`, border: `1px solid ${elColor}22`, borderRadius: '0.75rem', padding: '0.625rem 0.875rem' }}>
                          <span style={{ color: elColor, fontSize: '0.72rem', fontWeight: 600 }}>Guidance: </span>
                          <span style={{ color: 'rgba(200,180,255,0.65)', fontSize: '0.78rem' }}>{c.guidance}</span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )}
        </>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {readings.length === 0 && (
            <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🃏</div>
              <p style={{ color: 'rgba(180,160,255,0.4)', fontSize: '0.88rem' }}>No readings yet. Draw your first cards above.</p>
            </div>
          )}
          {readings.map(r => {
            const spread = SPREADS.find(s => s.id === r.spread)
            return (
              <div key={r.id} style={{ ...card, padding: '1rem 1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                  <div style={{ color: 'rgba(220,200,255,0.85)', fontSize: '0.85rem', fontWeight: 600 }}>{spread?.name}</div>
                  <div style={{ color: 'rgba(180,160,255,0.35)', fontSize: '0.7rem' }}>{new Date(r.createdAt).toLocaleDateString()}</div>
                </div>
                {r.question && <p style={{ color: 'rgba(180,160,255,0.5)', fontSize: '0.78rem', margin: '0 0 0.5rem', fontStyle: 'italic' }}>&ldquo;{r.question}&rdquo;</p>}
                <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                  {r.cards.map(c => (
                    <span key={c.id} style={{ padding: '0.2rem 0.5rem', borderRadius: '2rem', background: `${ELEMENT_COLORS[c.element]}12`, border: `1px solid ${ELEMENT_COLORS[c.element]}25`, color: ELEMENT_COLORS[c.element], fontSize: '0.7rem' }}>{c.emoji} {c.name}</span>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
