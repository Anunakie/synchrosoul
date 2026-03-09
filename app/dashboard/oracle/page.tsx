'use client'
import { useState } from 'react'
import { getAngelMeaning } from '@/lib/angel-meanings'
import { getLogs } from '@/lib/storage'

const ORACLE_SPREADS = [
  { id: 'single', name: 'Single Number', emoji: '✦', desc: 'One number, one clear message', count: 1 },
  { id: 'past-present-future', name: 'Past · Present · Future', emoji: '◈', desc: 'Your journey across time', count: 3 },
  { id: 'mind-body-spirit', name: 'Mind · Body · Spirit', emoji: '△', desc: 'Alignment across all planes', count: 3 },
  { id: 'situation-action-outcome', name: 'Situation · Action · Outcome', emoji: '⟳', desc: 'Guidance for a decision', count: 3 },
  { id: 'full', name: 'Full Cosmic Reading', emoji: '🌌', desc: 'Deep 5-number cosmic spread', count: 5 },
]

const SACRED_NUMBERS = ['111','222','333','444','555','666','777','888','999','1111','1010','1212','2222','3333','4444','5555','000']

const POSITION_LABELS: Record<string, string[]> = {
  'single': ['Your Message'],
  'past-present-future': ['Past', 'Present', 'Future'],
  'mind-body-spirit': ['Mind', 'Body', 'Spirit'],
  'situation-action-outcome': ['Situation', 'Action', 'Outcome'],
  'full': ['Foundation', 'Challenge', 'Hidden Truth', 'Guidance', 'Outcome'],
}

const ORACLE_QUESTIONS = [
  'What do I need to know right now?',
  'What is blocking my path?',
  'What energy surrounds my love life?',
  'What is my soul trying to tell me?',
  'What should I focus on this week?',
  'What is the universe preparing me for?',
  'What am I ready to release?',
  'What is my next aligned step?',
]

function drawNumbers(count: number, recentNums: string[]): string[] {
  const pool = [...SACRED_NUMBERS]
  // Weight recently seen numbers higher
  recentNums.slice(0, 5).forEach(n => { if (pool.includes(n)) pool.push(n, n) })
  const drawn: string[] = []
  const used = new Set<string>()
  while (drawn.length < count) {
    const idx = Math.floor(Math.random() * pool.length)
    const num = pool[idx]
    if (!used.has(num)) { drawn.push(num); used.add(num) }
  }
  return drawn
}

export default function OraclePage() {
  const [spread, setSpread] = useState<typeof ORACLE_SPREADS[0] | null>(null)
  const [question, setQuestion] = useState('')
  const [customQ, setCustomQ] = useState('')
  const [drawn, setDrawn] = useState<string[]>([])
  const [revealed, setRevealed] = useState<boolean[]>([])
  const [reading, setReading] = useState(false)

  function startReading() {
    if (!spread) return
    const logs = getLogs()
    const recentNums = logs.slice(0, 20).map((l: any) => l.number)
    const numbers = drawNumbers(spread.count, recentNums)
    setDrawn(numbers)
    setRevealed(new Array(spread.count).fill(false))
    setReading(true)
  }

  function revealCard(i: number) {
    setRevealed(prev => { const next = [...prev]; next[i] = true; return next })
  }

  function reset() {
    setSpread(null); setDrawn([]); setRevealed([]); setReading(false); setQuestion(''); setCustomQ('')
  }

  const card = { background: 'rgba(8,6,28,0.88)', border: '1px solid rgba(200,180,255,0.12)', borderRadius: '1.25rem', backdropFilter: 'blur(12px)' } as React.CSSProperties
  const activeQ = customQ || question

  if (reading && drawn.length > 0) {
    const labels = POSITION_LABELS[spread!.id] || []
    return (
      <div style={{ maxWidth: '640px', margin: '0 auto', padding: '1.5rem 1rem 2rem' }}>
        <button onClick={reset} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(180,160,255,0.5)', fontSize: '0.8rem', marginBottom: '1rem', fontFamily: 'inherit' }}>← New Reading</button>
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.5rem', color: 'rgba(220,200,255,0.9)', marginBottom: '0.25rem' }}>{spread!.name}</div>
          {activeQ && <div style={{ color: 'rgba(180,160,255,0.6)', fontSize: '0.82rem', fontStyle: 'italic' }}>“{activeQ}”</div>}
          <div style={{ color: 'rgba(180,160,255,0.4)', fontSize: '0.72rem', marginTop: '0.5rem' }}>Tap each card to reveal your message</div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
          {drawn.map((num, i) => {
            const meaning = getAngelMeaning(num)
            const isRevealed = revealed[i]
            return (
              <div key={i} onClick={() => !isRevealed && revealCard(i)} style={{ ...card, padding: '1.5rem', cursor: isRevealed ? 'default' : 'pointer', border: isRevealed ? `1px solid ${meaning.color}44` : '1px solid rgba(200,180,255,0.15)', background: isRevealed ? `rgba(20,10,50,0.95)` : 'rgba(8,6,28,0.95)', transition: 'all 0.4s', position: 'relative', overflow: 'hidden' }}>
                {isRevealed && <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '120px', height: '120px', borderRadius: '50%', background: `radial-gradient(circle, ${meaning.color}18 0%, transparent 70%)`, pointerEvents: 'none' }} />}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: isRevealed ? `${meaning.color}18` : 'rgba(255,255,255,0.04)', border: `1px solid ${isRevealed ? meaning.color + '44' : 'rgba(200,180,255,0.1)'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 0.4s' }}>
                    {isRevealed ? (
                      <span style={{ color: meaning.color, fontSize: '1.1rem', fontWeight: 700, fontFamily: 'Cormorant Garamond, serif' }}>{num}</span>
                    ) : (
                      <span style={{ color: 'rgba(180,160,255,0.3)', fontSize: '1.2rem' }}>✦</span>
                    )}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ color: 'rgba(180,160,255,0.4)', fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '0.2rem' }}>{labels[i] || `Card ${i+1}`}</div>
                    {isRevealed ? (
                      <>
                        <div style={{ color: 'rgba(220,200,255,0.95)', fontSize: '0.95rem', fontWeight: 600, marginBottom: '0.3rem' }}>{meaning.title}</div>
                        <p style={{ color: 'rgba(180,160,255,0.7)', fontSize: '0.8rem', lineHeight: 1.6, margin: '0 0 0.5rem' }}>{meaning.message}</p>
                        <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                          {meaning.keywords.slice(0,3).map((k: string) => <span key={k} style={{ padding: '0.15rem 0.5rem', borderRadius: '2rem', background: `${meaning.color}12`, border: `1px solid ${meaning.color}25`, color: meaning.color, fontSize: '0.65rem' }}>{k}</span>)}
                        </div>
                      </>
                    ) : (
                      <div style={{ color: 'rgba(180,160,255,0.4)', fontSize: '0.82rem' }}>Tap to reveal</div>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {revealed.every(Boolean) && (
          <div style={{ ...card, padding: '1.25rem', marginTop: '1rem', textAlign: 'center', border: '1px solid rgba(201,168,76,0.3)', background: 'rgba(20,10,50,0.95)' }}>
            <div style={{ fontSize: '1.5rem', marginBottom: '0.4rem' }}>✦</div>
            <div style={{ color: '#c9a84c', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.25rem' }}>Reading Complete</div>
            <div style={{ color: 'rgba(180,160,255,0.6)', fontSize: '0.78rem', lineHeight: 1.6 }}>Sit with these messages. Journal what resonates. The numbers chose you for a reason.</div>
            <button onClick={reset} style={{ marginTop: '0.875rem', padding: '0.5rem 1.5rem', borderRadius: '2rem', cursor: 'pointer', background: 'rgba(201,168,76,0.15)', border: '1px solid rgba(201,168,76,0.4)', color: '#c9a84c', fontSize: '0.8rem', fontFamily: 'inherit' }}>New Reading</button>
          </div>
        )}
      </div>
    )
  }

  return (
    <div style={{ maxWidth: '640px', margin: '0 auto', padding: '1.5rem 1rem 2rem' }}>
      <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.8rem', color: 'rgba(220,200,255,0.95)', margin: '0 0 0.25rem', fontWeight: 400 }}>Angel Number Oracle</h1>
      <p style={{ color: 'rgba(180,160,255,0.5)', fontSize: '0.8rem', margin: '0 0 1.5rem' }}>Draw sacred numbers for divine guidance</p>

      {/* Question */}
      <div style={{ ...card, padding: '1.25rem', marginBottom: '1.25rem' }}>
        <div style={{ color: 'rgba(180,160,255,0.4)', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.75rem' }}>Your Question (optional)</div>
        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
          {ORACLE_QUESTIONS.map(q => (
            <button key={q} onClick={() => { setQuestion(q); setCustomQ('') }} style={{ padding: '0.3rem 0.65rem', borderRadius: '2rem', cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.7rem', background: question === q && !customQ ? 'rgba(167,139,250,0.2)' : 'rgba(255,255,255,0.04)', border: question === q && !customQ ? '1px solid rgba(167,139,250,0.5)' : '1px solid rgba(200,180,255,0.1)', color: question === q && !customQ ? 'rgba(220,200,255,0.9)' : 'rgba(180,160,255,0.5)', transition: 'all 0.15s' }}>{q}</button>
          ))}
        </div>
        <input value={customQ} onChange={e => { setCustomQ(e.target.value); setQuestion('') }} placeholder="Or type your own question..." style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(200,180,255,0.12)', borderRadius: '0.6rem', color: 'rgba(220,200,255,0.9)', padding: '0.6rem 0.85rem', fontSize: '0.85rem', outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit' }} />
      </div>

      {/* Spread selection */}
      <div style={{ color: 'rgba(180,160,255,0.4)', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.75rem' }}>Choose Your Spread</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.5rem' }}>
        {ORACLE_SPREADS.map(s => (
          <button key={s.id} onClick={() => setSpread(s)} style={{ ...card, padding: '1rem 1.25rem', cursor: 'pointer', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '1rem', border: spread?.id === s.id ? '1px solid rgba(167,139,250,0.5)' : '1px solid rgba(200,180,255,0.1)', background: spread?.id === s.id ? 'rgba(167,139,250,0.1)' : 'rgba(8,6,28,0.88)', transition: 'all 0.2s' }}>
            <span style={{ fontSize: '1.4rem', width: '32px', textAlign: 'center', flexShrink: 0 }}>{s.emoji}</span>
            <div style={{ flex: 1 }}>
              <div style={{ color: 'rgba(220,200,255,0.9)', fontSize: '0.88rem', fontWeight: 600 }}>{s.name}</div>
              <div style={{ color: 'rgba(180,160,255,0.5)', fontSize: '0.72rem' }}>{s.desc} · {s.count} {s.count === 1 ? 'card' : 'cards'}</div>
            </div>
            {spread?.id === s.id && <span style={{ color: '#a78bfa', fontSize: '0.7rem' }}>✓</span>}
          </button>
        ))}
      </div>

      <button onClick={startReading} disabled={!spread} style={{ width: '100%', padding: '1rem', borderRadius: '0.75rem', cursor: spread ? 'pointer' : 'default', background: spread ? 'rgba(201,168,76,0.18)' : 'rgba(255,255,255,0.04)', border: spread ? '1px solid rgba(201,168,76,0.5)' : '1px solid rgba(200,180,255,0.08)', color: spread ? '#c9a84c' : 'rgba(180,160,255,0.3)', fontSize: '1rem', fontFamily: 'inherit', fontWeight: 600, letterSpacing: '0.05em', transition: 'all 0.2s' }}>
        ✦ Draw Your Numbers
      </button>
    </div>
  )
}
