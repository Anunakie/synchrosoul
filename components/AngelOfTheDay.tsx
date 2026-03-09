'use client'
import { useState, useEffect } from 'react'
import { ANGEL_MEANINGS } from '@/lib/angel-meanings'

const DAILY_NUMBERS = ['111','222','333','444','555','666','777','888','999','1111','1212','1234']

function getDailyNumber(): string {
  const today = new Date()
  const seed = today.getFullYear() * 10000 + (today.getMonth()+1) * 100 + today.getDate()
  return DAILY_NUMBERS[seed % DAILY_NUMBERS.length]
}

export default function AngelOfTheDay() {
  const [number, setNumber] = useState('')
  const [meaning, setMeaning] = useState<any>(null)
  const [logged, setLogged] = useState(false)

  useEffect(() => {
    const n = getDailyNumber()
    setNumber(n)
    const m = ANGEL_MEANINGS[n]
    if (m) setMeaning(m)
    // Check if already logged today
    const logs = JSON.parse(localStorage.getItem('synchrosoul_logs') || '[]')
    const today = new Date().toISOString().slice(0,10)
    setLogged(logs.some((l: any) => l.number === n && l.timestamp?.slice(0,10) === today))
  }, [])

  function logNow() {
    const logs = JSON.parse(localStorage.getItem('synchrosoul_logs') || '[]')
    const entry = { id: Date.now().toString(), number, timestamp: new Date().toISOString(), thought: 'Angel Number of the Day', hasScreenshot: false, truthScore: 0 }
    logs.unshift(entry)
    localStorage.setItem('synchrosoul_logs', JSON.stringify(logs))
    setLogged(true)
  }

  if (!number || !meaning) return null

  return (
    <div style={{ background: 'rgba(8,6,28,0.88)', border: '1px solid rgba(200,180,255,0.12)', borderRadius: '1.25rem', backdropFilter: 'blur(12px)', padding: '1.25rem', marginBottom: '1.25rem', position: 'relative', overflow: 'hidden' }}>
      {/* Glow */}
      <div style={{ position: 'absolute', top: '-20px', right: '-20px', width: '100px', height: '100px', borderRadius: '50%', background: (meaning.color || '#a78bfa') + '18', filter: 'blur(30px)', pointerEvents: 'none' }} />
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '1rem' }}>
        <div style={{ flexShrink: 0 }}>
          <div style={{ width: '3.25rem', height: '3.25rem', borderRadius: '50%', background: (meaning.color || '#a78bfa') + '18', border: '1px solid ' + (meaning.color || '#a78bfa') + '40', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem' }}>
            {meaning.emoji || '✦'}
          </div>
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
            <span style={{ color: 'rgba(180,160,255,0.4)', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.12em' }}>Angel Number of the Day</span>
          </div>
          <div style={{ color: meaning.color || '#a78bfa', fontSize: '1.5rem', fontWeight: 800, lineHeight: 1, marginBottom: '0.2rem', fontFamily: 'Cormorant Garamond, serif' }}>{number}</div>
          <div style={{ color: 'rgba(220,200,255,0.8)', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.3rem' }}>{meaning.title}</div>
          <div style={{ color: 'rgba(180,160,255,0.55)', fontSize: '0.78rem', lineHeight: 1.5, marginBottom: '0.875rem' }}>{meaning.message?.slice(0, 100)}...</div>
          {logged ? (
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', padding: '0.3rem 0.75rem', borderRadius: '2rem', background: 'rgba(52,211,153,0.1)', border: '1px solid rgba(52,211,153,0.25)', color: '#34d399', fontSize: '0.72rem' }}>
              <span>✓</span> Logged today
            </div>
          ) : (
            <button onClick={logNow} style={{ padding: '0.35rem 0.875rem', borderRadius: '2rem', background: (meaning.color || '#a78bfa') + '20', border: '1px solid ' + (meaning.color || '#a78bfa') + '40', color: meaning.color || '#a78bfa', fontSize: '0.75rem', cursor: 'pointer', fontWeight: 600 }}>+ Log This Number</button>
          )}
        </div>
      </div>
    </div>
  )
}
