'use client'
import { useState, useEffect } from 'react'

function calcKarmicDebt(birthdate: string, name: string): { numbers: number[]; details: KarmicDetail[] } {
  const KARMIC = [13, 14, 16, 19]
  const found: number[] = []

  if (!birthdate) return { numbers: [], details: [] }

  // Check birthdate components
  const [yyyy, mm, dd] = birthdate.split('-').map(Number)
  const dayStr = String(dd)
  const monthStr = String(mm)
  const yearStr = String(yyyy)

  // Life path before reduction
  const rawSum = [dayStr, monthStr, yearStr].join('').split('').reduce((a,c) => a+parseInt(c), 0)
  if (KARMIC.includes(rawSum)) found.push(rawSum)

  // Day number before reduction
  if (dd > 9) {
    const daySum = String(dd).split('').reduce((a,c) => a+parseInt(c), 0)
    if (KARMIC.includes(dd)) found.push(dd)
  }

  // Name-based (Pythagorean)
  if (name) {
    const MAP: Record<string,number> = {a:1,b:2,c:3,d:4,e:5,f:6,g:7,h:8,i:9,j:1,k:2,l:3,m:4,n:5,o:6,p:7,q:8,r:9,s:1,t:2,u:3,v:4,w:5,x:6,y:7,z:8}
    const letters = name.toLowerCase().replace(/[^a-z]/g,'')
    const nameSum = letters.split('').reduce((a,c) => a+(MAP[c]||0), 0)
    if (KARMIC.includes(nameSum)) found.push(nameSum)
  }

  const unique = [...new Set(found)]
  return { numbers: unique, details: unique.map(n => KARMIC_MEANINGS[n]).filter(Boolean) }
}

interface KarmicDetail {
  number: number
  title: string
  lesson: string
  challenge: string
  gift: string
  affirmation: string
  color: string
  emoji: string
}

const KARMIC_MEANINGS: Record<number, KarmicDetail> = {
  13: {
    number: 13,
    title: 'The Transformer',
    lesson: 'Hard work, discipline, and transformation through effort',
    challenge: 'Laziness, shortcuts, and resistance to doing the inner work',
    gift: 'Once mastered, you become a powerful transformer — turning raw material into gold',
    affirmation: 'I embrace discipline as my path to freedom',
    color: '#f97316',
    emoji: '🔥'
  },
  14: {
    number: 14,
    title: 'The Liberator',
    lesson: 'Moderation, commitment, and freedom through responsibility',
    challenge: 'Overindulgence, addiction, and fear of commitment',
    gift: 'A deep understanding of freedom that comes from mastering your desires',
    affirmation: 'I am free because I choose wisely',
    color: '#60a5fa',
    emoji: '🌊'
  },
  16: {
    number: 16,
    title: 'The Awakener',
    lesson: 'Ego dissolution, humility, and spiritual awakening',
    challenge: 'Pride, isolation, and the painful collapse of false structures',
    gift: 'After the fall comes profound spiritual wisdom and authentic self-knowledge',
    affirmation: 'I release what is false and embrace my true self',
    color: '#a78bfa',
    emoji: '⚡'
  },
  19: {
    number: 19,
    title: 'The Independent',
    lesson: 'Self-reliance, leadership, and learning to receive help',
    challenge: 'Isolation, stubbornness, and refusing support from others',
    gift: 'True independence that comes from knowing when to stand alone and when to lean in',
    affirmation: 'I am strong enough to ask for help',
    color: '#c9a84c',
    emoji: '👑'
  }
}

export default function KarmicDebtPage() {
  const [birthdate, setBirthdate] = useState('')
  const [name, setName] = useState('')
  const [result, setResult] = useState<{ numbers: number[]; details: KarmicDetail[] }>({ numbers: [], details: [] })
  const [calculated, setCalculated] = useState(false)

  useEffect(() => {
    const profile = localStorage.getItem('synchrosoul_profile')
    if (profile) {
      const p = JSON.parse(profile)
      if (p.birthdate) setBirthdate(p.birthdate)
      if (p.name) setName(p.name)
    }
  }, [])

  function calculate() {
    setResult(calcKarmicDebt(birthdate, name))
    setCalculated(true)
  }

  const card: React.CSSProperties = { background: 'rgba(8,6,28,0.88)', border: '1px solid rgba(200,180,255,0.12)', borderRadius: '1.25rem', backdropFilter: 'blur(12px)' }

  return (
    <div style={{ maxWidth: '520px', margin: '0 auto', padding: '1.5rem 1rem 2rem' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.8rem', color: 'rgba(220,200,255,0.95)', margin: '0 0 0.25rem', fontWeight: 400 }}>Karmic Debt</h1>
        <p style={{ color: 'rgba(180,160,255,0.5)', fontSize: '0.8rem', margin: 0 }}>Discover the soul lessons carried from past lives</p>
      </div>

      {/* Explainer */}
      <div style={{ ...card, padding: '1.1rem 1.25rem', marginBottom: '1.25rem', background: 'rgba(167,139,250,0.06)', borderColor: 'rgba(167,139,250,0.2)' }}>
        <p style={{ color: 'rgba(200,180,255,0.65)', fontSize: '0.8rem', lineHeight: 1.6, margin: 0, fontStyle: 'italic', fontFamily: 'Cormorant Garamond, serif' }}>Karmic debt numbers (13, 14, 16, 19) appear when the soul carries unresolved lessons from previous incarnations. They are not punishments — they are invitations to master what was left incomplete.</p>
      </div>

      {/* Input */}
      <div style={{ ...card, padding: '1.25rem', marginBottom: '1.25rem' }}>
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', color: 'rgba(180,160,255,0.5)', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>Full Birth Name</label>
          <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="As it appears on your birth certificate" style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(200,180,255,0.2)', borderRadius: '0.625rem', color: 'rgba(220,200,255,0.9)', padding: '0.625rem 0.875rem', fontSize: '0.9rem', boxSizing: 'border-box' }} />
        </div>
        <div style={{ marginBottom: '1rem' }}>
          <label style={{ display: 'block', color: 'rgba(180,160,255,0.5)', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>Birthdate</label>
          <input type="date" value={birthdate} onChange={e => setBirthdate(e.target.value)} style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(200,180,255,0.2)', borderRadius: '0.625rem', color: 'rgba(220,200,255,0.9)', padding: '0.625rem 0.875rem', fontSize: '0.9rem', boxSizing: 'border-box' }} />
        </div>
        <button onClick={calculate} disabled={!birthdate} style={{ width: '100%', padding: '0.75rem', borderRadius: '0.875rem', background: 'linear-gradient(135deg, rgba(167,139,250,0.3), rgba(201,168,76,0.2))', border: '1px solid rgba(167,139,250,0.3)', color: 'rgba(220,200,255,0.9)', fontSize: '0.9rem', cursor: 'pointer', fontWeight: 600 }}>Reveal My Karmic Debt</button>
      </div>

      {calculated && (
        <>
          {result.numbers.length === 0 ? (
            <div style={{ ...card, padding: '2rem', textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>✨</div>
              <div style={{ color: 'rgba(220,200,255,0.9)', fontSize: '1.1rem', fontFamily: 'Cormorant Garamond, serif', marginBottom: '0.5rem' }}>No Karmic Debt Found</div>
              <p style={{ color: 'rgba(180,160,255,0.5)', fontSize: '0.85rem', margin: 0, fontStyle: 'italic' }}>Your chart shows no karmic debt numbers. Your soul enters this life with a clean slate — free to create new patterns.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {result.details.map(d => (
                <div key={d.number} style={{ ...card, padding: '1.5rem', borderColor: d.color + '33' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem' }}>
                    <div style={{ width: '3.5rem', height: '3.5rem', borderRadius: '50%', background: d.color + '18', border: '2px solid ' + d.color + '40', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', flexShrink: 0 }}>{d.emoji}</div>
                    <div>
                      <div style={{ color: d.color, fontSize: '1.5rem', fontWeight: 800, lineHeight: 1 }}>{d.number}</div>
                      <div style={{ color: 'rgba(220,200,255,0.85)', fontSize: '0.95rem', fontFamily: 'Cormorant Garamond, serif' }}>{d.title}</div>
                    </div>
                  </div>
                  {[
                    { label: '📚 Soul Lesson', text: d.lesson },
                    { label: '⚔️ Challenge', text: d.challenge },
                    { label: '🎁 Gift When Mastered', text: d.gift },
                  ].map(item => (
                    <div key={item.label} style={{ marginBottom: '0.875rem' }}>
                      <div style={{ color: 'rgba(180,160,255,0.4)', fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.3rem' }}>{item.label}</div>
                      <div style={{ color: 'rgba(200,180,255,0.75)', fontSize: '0.85rem', lineHeight: 1.6 }}>{item.text}</div>
                    </div>
                  ))}
                  <div style={{ padding: '0.875rem', borderRadius: '0.75rem', background: d.color + '0d', border: '1px solid ' + d.color + '25', marginTop: '0.5rem' }}>
                    <div style={{ color: 'rgba(180,160,255,0.4)', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.3rem' }}>✦ Affirmation</div>
                    <div style={{ color: d.color, fontSize: '0.9rem', fontStyle: 'italic', fontFamily: 'Cormorant Garamond, serif' }}>“{d.affirmation}”</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}
