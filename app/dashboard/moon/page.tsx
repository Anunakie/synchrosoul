'use client'
import { useState, useEffect } from 'react'

function getMoonPhase(date: Date): { phase: string; emoji: string; illumination: number; description: string; ritual: string; color: string } {
  const known = new Date('2000-01-06T18:14:00Z')
  const synodic = 29.53058867
  const diff = (date.getTime() - known.getTime()) / (1000 * 60 * 60 * 24)
  const cycles = diff / synodic
  const phase = (cycles - Math.floor(cycles)) * synodic

  if (phase < 1.85) return { phase: 'New Moon', emoji: '🌑', illumination: 0, color: '#6366f1', description: 'A time of new beginnings, setting intentions, and planting seeds of desire.', ritual: 'Write your intentions on paper. Light a white candle. Meditate on what you wish to call in.' }
  if (phase < 7.38) return { phase: 'Waxing Crescent', emoji: '🌒', illumination: Math.round((phase / 7.38) * 25), color: '#8b5cf6', description: 'Energy is building. Take inspired action toward your intentions.', ritual: 'Take one small step toward your goal. Journal about what you are building.' }
  if (phase < 9.22) return { phase: 'First Quarter', emoji: '🌓', illumination: 50, color: '#a78bfa', description: 'A time of decision and action. Push through resistance.', ritual: 'Identify one obstacle and take decisive action to overcome it.' }
  if (phase < 14.77) return { phase: 'Waxing Gibbous', emoji: '🌔', illumination: Math.round(50 + ((phase - 9.22) / 5.55) * 25), color: '#c084fc', description: 'Refine and adjust. You are close to your goal.', ritual: 'Review your progress. Express gratitude for what is already manifesting.' }
  if (phase < 16.61) return { phase: 'Full Moon', emoji: '🌕', illumination: 100, color: '#fbbf24', description: 'Peak energy. Manifestations come to fruition. Release what no longer serves.', ritual: 'Charge your crystals under moonlight. Write what you release on paper and burn it safely.' }
  if (phase < 22.15) return { phase: 'Waning Gibbous', emoji: '🌖', illumination: Math.round(75 - ((phase - 16.61) / 5.54) * 25), color: '#f472b6', description: 'Share your wisdom. Give gratitude. Begin to release.', ritual: 'Share something you have learned. Practice forgiveness meditation.' }
  if (phase < 23.99) return { phase: 'Last Quarter', emoji: '🌗', illumination: 50, color: '#e879f9', description: 'Let go of what is not working. Clear space for the new.', ritual: 'Declutter one area of your life. Release a limiting belief.' }
  if (phase < 29.53) return { phase: 'Waning Crescent', emoji: '🌘', illumination: Math.round(25 - ((phase - 23.99) / 5.54) * 25), color: '#a855f7', description: 'Rest, reflect, and surrender. Prepare for the new cycle.', ritual: 'Rest deeply. Meditate in silence. Trust the process.' }
  return { phase: 'New Moon', emoji: '🌑', illumination: 0, color: '#6366f1', description: 'A time of new beginnings.', ritual: 'Set new intentions.' }
}

function getNextFullMoon(from: Date): Date {
  const known = new Date('2000-01-06T18:14:00Z')
  const synodic = 29.53058867
  const diff = (from.getTime() - known.getTime()) / (1000 * 60 * 60 * 24)
  const cycles = diff / synodic
  const phase = (cycles - Math.floor(cycles)) * synodic
  const daysToFull = phase < 14.77 ? 14.77 - phase : synodic - phase + 14.77
  const next = new Date(from.getTime() + daysToFull * 24 * 60 * 60 * 1000)
  return next
}

function getNextNewMoon(from: Date): Date {
  const known = new Date('2000-01-06T18:14:00Z')
  const synodic = 29.53058867
  const diff = (from.getTime() - known.getTime()) / (1000 * 60 * 60 * 24)
  const cycles = diff / synodic
  const phase = (cycles - Math.floor(cycles)) * synodic
  const daysToNew = phase < 1 ? 1 - phase : synodic - phase + 1
  const next = new Date(from.getTime() + daysToNew * 24 * 60 * 60 * 1000)
  return next
}

const MOON_SIGNS = [
  { sign: 'Aries', emoji: '♈', element: 'Fire', energy: 'Bold, impulsive, pioneering', numbers: ['1', '9'] },
  { sign: 'Taurus', emoji: '♉', element: 'Earth', energy: 'Grounded, sensual, patient', numbers: ['4', '6'] },
  { sign: 'Gemini', emoji: '♊', element: 'Air', energy: 'Curious, communicative, dual', numbers: ['3', '5'] },
  { sign: 'Cancer', emoji: '♋', element: 'Water', energy: 'Nurturing, intuitive, emotional', numbers: ['2', '7'] },
  { sign: 'Leo', emoji: '♌', element: 'Fire', energy: 'Creative, generous, radiant', numbers: ['1', '3'] },
  { sign: 'Virgo', emoji: '♍', element: 'Earth', energy: 'Analytical, healing, precise', numbers: ['4', '6'] },
  { sign: 'Libra', emoji: '♎', element: 'Air', energy: 'Balanced, harmonious, just', numbers: ['2', '6'] },
  { sign: 'Scorpio', emoji: '♏', element: 'Water', energy: 'Transformative, intense, deep', numbers: ['8', '9'] },
  { sign: 'Sagittarius', emoji: '♐', element: 'Fire', energy: 'Expansive, adventurous, wise', numbers: ['3', '9'] },
  { sign: 'Capricorn', emoji: '♑', element: 'Earth', energy: 'Ambitious, disciplined, enduring', numbers: ['4', '8'] },
  { sign: 'Aquarius', emoji: '♒', element: 'Air', energy: 'Innovative, humanitarian, free', numbers: ['1', '7'] },
  { sign: 'Pisces', emoji: '♓', element: 'Water', energy: 'Dreamy, spiritual, compassionate', numbers: ['2', '7', '9'] },
]

function getMoonSign(date: Date) {
  const dayOfYear = Math.floor((date.getTime() - new Date(date.getFullYear(), 0, 0).getTime()) / 86400000)
  return MOON_SIGNS[Math.floor((dayOfYear * 12.37 / 365) % 12)]
}

export default function MoonPage() {
  const [now] = useState(new Date())
  const moon = getMoonPhase(now)
  const moonSign = getMoonSign(now)
  const nextFull = getNextFullMoon(now)
  const nextNew = getNextNewMoon(now)
  const daysToFull = Math.ceil((nextFull.getTime() - now.getTime()) / 86400000)
  const daysToNew = Math.ceil((nextNew.getTime() - now.getTime()) / 86400000)
  const [journalEntry, setJournalEntry] = useState('')
  const [saved, setSaved] = useState(false)

  function saveMoonJournal() {
    if (!journalEntry.trim()) return
    const entries = JSON.parse(localStorage.getItem('synchrosoul_moon_journal') || '[]')
    entries.unshift({ text: journalEntry, phase: moon.phase, date: now.toISOString() })
    localStorage.setItem('synchrosoul_moon_journal', JSON.stringify(entries.slice(0, 50)))
    setJournalEntry('')
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const card = { background: 'rgba(8,6,28,0.88)', border: '1px solid rgba(200,180,255,0.12)', borderRadius: '1.25rem', backdropFilter: 'blur(12px)' } as React.CSSProperties

  return (
    <div style={{ maxWidth: '640px', margin: '0 auto', padding: '1.5rem 1rem 2rem' }}>
      <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.8rem', color: 'rgba(220,200,255,0.95)', margin: '0 0 0.25rem', fontWeight: 400 }}>Moon Phase</h1>
      <p style={{ color: 'rgba(180,160,255,0.5)', fontSize: '0.8rem', margin: '0 0 1.5rem' }}>{now.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</p>

      {/* Main moon card */}
      <div style={{ ...card, padding: '2rem', marginBottom: '1rem', textAlign: 'center', border: `1px solid ${moon.color}33`, background: `radial-gradient(ellipse at 50% 0%, ${moon.color}12 0%, rgba(8,6,28,0.95) 70%)` }}>
        <div style={{ fontSize: '5rem', marginBottom: '0.75rem', filter: `drop-shadow(0 0 20px ${moon.color}66)` }}>{moon.emoji}</div>
        <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.6rem', color: moon.color, margin: '0 0 0.5rem', fontWeight: 400 }}>{moon.phase}</h2>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
          <div style={{ flex: 1, height: '4px', borderRadius: '2px', background: 'rgba(255,255,255,0.08)', maxWidth: '200px', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${moon.illumination}%`, background: `linear-gradient(90deg, ${moon.color}88, ${moon.color})`, borderRadius: '2px', transition: 'width 0.5s' }} />
          </div>
          <span style={{ color: moon.color, fontSize: '0.78rem', fontWeight: 600 }}>{moon.illumination}% illuminated</span>
        </div>
        <p style={{ color: 'rgba(200,180,255,0.75)', fontSize: '0.88rem', lineHeight: 1.7, margin: 0 }}>{moon.description}</p>
      </div>

      {/* Moon sign + upcoming */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
        <div style={{ ...card, padding: '1.1rem' }}>
          <div style={{ color: 'rgba(180,160,255,0.4)', fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>Moon in</div>
          <div style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>{moonSign.emoji}</div>
          <div style={{ color: 'rgba(220,200,255,0.9)', fontSize: '0.9rem', fontWeight: 600 }}>{moonSign.sign}</div>
          <div style={{ color: 'rgba(180,160,255,0.5)', fontSize: '0.72rem' }}>{moonSign.element} • {moonSign.energy.split(',')[0]}</div>
        </div>
        <div style={{ ...card, padding: '1.1rem' }}>
          <div style={{ color: 'rgba(180,160,255,0.4)', fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>Upcoming</div>
          <div style={{ marginBottom: '0.5rem' }}>
            <div style={{ color: '#fbbf24', fontSize: '0.78rem', fontWeight: 600 }}>🌕 Full Moon</div>
            <div style={{ color: 'rgba(180,160,255,0.5)', fontSize: '0.7rem' }}>in {daysToFull} day{daysToFull !== 1 ? 's' : ''} • {nextFull.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</div>
          </div>
          <div>
            <div style={{ color: '#6366f1', fontSize: '0.78rem', fontWeight: 600 }}>🌑 New Moon</div>
            <div style={{ color: 'rgba(180,160,255,0.5)', fontSize: '0.7rem' }}>in {daysToNew} day{daysToNew !== 1 ? 's' : ''} • {nextNew.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</div>
          </div>
        </div>
      </div>

      {/* Ritual */}
      <div style={{ ...card, padding: '1.25rem', marginBottom: '1rem', border: `1px solid ${moon.color}22` }}>
        <div style={{ color: 'rgba(180,160,255,0.4)', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.6rem' }}>✨ {moon.phase} Ritual</div>
        <p style={{ color: 'rgba(200,180,255,0.75)', fontSize: '0.85rem', lineHeight: 1.7, margin: 0 }}>{moon.ritual}</p>
      </div>

      {/* Moon journal */}
      <div style={{ ...card, padding: '1.25rem', marginBottom: '1rem' }}>
        <div style={{ color: 'rgba(180,160,255,0.4)', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.75rem' }}>Moon Journal</div>
        <textarea
          value={journalEntry}
          onChange={e => setJournalEntry(e.target.value)}
          placeholder={`What are you feeling under the ${moon.phase}?`}
          rows={3}
          style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(200,180,255,0.12)', borderRadius: '0.6rem', color: 'rgba(220,200,255,0.9)', padding: '0.75rem', fontSize: '0.85rem', resize: 'none', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }}
        />
        <button
          onClick={saveMoonJournal}
          style={{ marginTop: '0.6rem', width: '100%', padding: '0.65rem', borderRadius: '0.6rem', cursor: 'pointer', background: saved ? 'rgba(74,222,128,0.15)' : `${moon.color}18`, border: saved ? '1px solid rgba(74,222,128,0.4)' : `1px solid ${moon.color}44`, color: saved ? '#4ade80' : moon.color, fontSize: '0.85rem', fontFamily: 'inherit', fontWeight: 600, transition: 'all 0.3s' }}
        >
          {saved ? '✓ Saved' : `Save Moon Journal Entry`}
        </button>
      </div>

      {/* Angel numbers for this phase */}
      <div style={{ ...card, padding: '1.25rem' }}>
        <div style={{ color: 'rgba(180,160,255,0.4)', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.6rem' }}>Angel Numbers for {moon.phase}</div>
        <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
          {moon.phase === 'New Moon' && ['111', '1111', '000', '1010'].map(n => <span key={n} style={{ padding: '0.3rem 0.7rem', borderRadius: '2rem', background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)', color: '#818cf8', fontSize: '0.78rem', fontWeight: 600 }}>{n}</span>)}
          {moon.phase === 'Full Moon' && ['555', '777', '999', '1212'].map(n => <span key={n} style={{ padding: '0.3rem 0.7rem', borderRadius: '2rem', background: 'rgba(251,191,36,0.15)', border: '1px solid rgba(251,191,36,0.3)', color: '#fbbf24', fontSize: '0.78rem', fontWeight: 600 }}>{n}</span>)}
          {moon.phase.includes('Waxing') && ['222', '333', '444', '888'].map(n => <span key={n} style={{ padding: '0.3rem 0.7rem', borderRadius: '2rem', background: 'rgba(167,139,250,0.15)', border: '1px solid rgba(167,139,250,0.3)', color: '#a78bfa', fontSize: '0.78rem', fontWeight: 600 }}>{n}</span>)}
          {moon.phase.includes('Waning') && ['666', '999', '000', '1111'].map(n => <span key={n} style={{ padding: '0.3rem 0.7rem', borderRadius: '2rem', background: 'rgba(232,121,249,0.15)', border: '1px solid rgba(232,121,249,0.3)', color: '#e879f9', fontSize: '0.78rem', fontWeight: 600 }}>{n}</span>)}
          {(moon.phase === 'First Quarter' || moon.phase === 'Last Quarter') && ['444', '555', '777', '1234'].map(n => <span key={n} style={{ padding: '0.3rem 0.7rem', borderRadius: '2rem', background: 'rgba(192,132,252,0.15)', border: '1px solid rgba(192,132,252,0.3)', color: '#c084fc', fontSize: '0.78rem', fontWeight: 600 }}>{n}</span>)}
        </div>
      </div>
    </div>
  )
}
