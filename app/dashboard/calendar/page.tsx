'use client'
import { useState, useEffect } from 'react'
import { getLogs } from '@/lib/storage'

const MOON_PHASES = [
  { name: 'New Moon', emoji: '🌑', energy: 'New beginnings, set intentions, plant seeds', numbers: ['111','1111','222'] },
  { name: 'Waxing Crescent', emoji: '🌒', energy: 'Growth, momentum, take action', numbers: ['333','444','555'] },
  { name: 'First Quarter', emoji: '🌓', energy: 'Decisions, challenges, push forward', numbers: ['444','777','888'] },
  { name: 'Waxing Gibbous', emoji: '🌔', energy: 'Refinement, patience, trust the process', numbers: ['222','666','999'] },
  { name: 'Full Moon', emoji: '🌕', energy: 'Manifestation, release, peak energy', numbers: ['999','1111','777'] },
  { name: 'Waning Gibbous', emoji: '🌖', energy: 'Gratitude, sharing, reflection', numbers: ['999','333','666'] },
  { name: 'Last Quarter', emoji: '🌗', energy: 'Release, forgiveness, let go', numbers: ['999','555','888'] },
  { name: 'Waning Crescent', emoji: '🌘', energy: 'Rest, surrender, prepare for rebirth', numbers: ['222','111','444'] },
]

const ANGEL_ENERGY: Record<string, { color: string; energy: string; affirmation: string }> = {
  '1': { color: '#ff6b6b', energy: 'Leadership & New Starts', affirmation: 'I boldly begin.' },
  '2': { color: '#60a5fa', energy: 'Balance & Partnership', affirmation: 'I trust divine timing.' },
  '3': { color: '#fbbf24', energy: 'Creativity & Expression', affirmation: 'I create freely.' },
  '4': { color: '#34d399', energy: 'Foundation & Stability', affirmation: 'I build with love.' },
  '5': { color: '#a78bfa', energy: 'Change & Freedom', affirmation: 'I embrace transformation.' },
  '6': { color: '#f472b6', energy: 'Love & Harmony', affirmation: 'I radiate love.' },
  '7': { color: '#818cf8', energy: 'Wisdom & Spirituality', affirmation: 'I trust my knowing.' },
  '8': { color: '#c9a84c', energy: 'Abundance & Power', affirmation: 'I attract prosperity.' },
  '9': { color: '#fb923c', energy: 'Completion & Service', affirmation: 'I serve with grace.' },
}

function getMoonPhase(date: Date): typeof MOON_PHASES[0] {
  const known = new Date('2000-01-06')
  const diff = (date.getTime() - known.getTime()) / (1000 * 60 * 60 * 24)
  const cycle = 29.53058867
  const phase = ((diff % cycle) + cycle) % cycle
  const idx = Math.floor(phase / (cycle / 8)) % 8
  return MOON_PHASES[idx]
}

function getDayEnergy(date: Date): typeof ANGEL_ENERGY['1'] {
  const sum = date.getFullYear() + (date.getMonth() + 1) + date.getDate()
  let n = sum
  while (n > 9) { n = String(n).split('').reduce((a, b) => a + parseInt(b), 0) }
  return ANGEL_ENERGY[String(n)] || ANGEL_ENERGY['1']
}

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate()
}

export default function CosmicCalendarPage() {
  const [today] = useState(new Date())
  const [viewDate, setViewDate] = useState(new Date())
  const [logs, setLogs] = useState<any[]>([])
  const [selectedDay, setSelectedDay] = useState<number | null>(today.getDate())

  useEffect(() => { setLogs(getLogs()) }, [])

  const year = viewDate.getFullYear()
  const month = viewDate.getMonth()
  const daysInMonth = getDaysInMonth(year, month)
  const firstDayOfWeek = new Date(year, month, 1).getDay()
  const monthName = viewDate.toLocaleString('default', { month: 'long' })

  const logsByDay: Record<number, string[]> = {}
  logs.forEach(log => {
    const d = new Date(log.createdAt)
    if (d.getFullYear() === year && d.getMonth() === month) {
      const day = d.getDate()
      if (!logsByDay[day]) logsByDay[day] = []
      if (!logsByDay[day].includes(log.number)) logsByDay[day].push(log.number)
    }
  })

  const selectedDate = selectedDay ? new Date(year, month, selectedDay) : today
  const moonPhase = getMoonPhase(selectedDate)
  const dayEnergy = getDayEnergy(selectedDate)
  const isToday = (d: number) => d === today.getDate() && month === today.getMonth() && year === today.getFullYear()

  const card = { background: 'rgba(8,6,28,0.88)', border: '1px solid rgba(200,180,255,0.12)', borderRadius: '1.25rem', backdropFilter: 'blur(12px)' } as React.CSSProperties

  return (
    <div style={{ maxWidth: '640px', margin: '0 auto', padding: '1.5rem 1rem 2rem' }}>
      <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.8rem', color: 'rgba(220,200,255,0.95)', margin: '0 0 0.25rem', fontWeight: 400 }}>Cosmic Calendar</h1>
      <p style={{ color: 'rgba(180,160,255,0.5)', fontSize: '0.8rem', margin: '0 0 1.5rem' }}>Moon phases, angel energy, and your number sightings</p>

      {/* Month nav */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <button onClick={() => setViewDate(new Date(year, month - 1, 1))} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(200,180,255,0.12)', borderRadius: '0.5rem', padding: '0.4rem 0.75rem', cursor: 'pointer', color: 'rgba(200,180,255,0.7)', fontFamily: 'inherit' }}>←</button>
        <span style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.3rem', color: 'rgba(220,200,255,0.9)' }}>{monthName} {year}</span>
        <button onClick={() => setViewDate(new Date(year, month + 1, 1))} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(200,180,255,0.12)', borderRadius: '0.5rem', padding: '0.4rem 0.75rem', cursor: 'pointer', color: 'rgba(200,180,255,0.7)', fontFamily: 'inherit' }}>→</button>
      </div>

      {/* Calendar grid */}
      <div style={{ ...card, padding: '1.25rem', marginBottom: '1.25rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: '0.25rem', marginBottom: '0.5rem' }}>
          {['Su','Mo','Tu','We','Th','Fr','Sa'].map(d => (
            <div key={d} style={{ textAlign: 'center', color: 'rgba(180,160,255,0.35)', fontSize: '0.65rem', padding: '0.25rem 0' }}>{d}</div>
          ))}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: '0.25rem' }}>
          {Array.from({ length: firstDayOfWeek }).map((_, i) => <div key={'e'+i} />)}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1
            const date = new Date(year, month, day)
            const moon = getMoonPhase(date)
            const energy = getDayEnergy(date)
            const hasLogs = logsByDay[day]?.length > 0
            const selected = selectedDay === day
            const todayDay = isToday(day)
            return (
              <button key={day} onClick={() => setSelectedDay(day)} style={{ aspectRatio: '1', borderRadius: '0.5rem', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1px', background: selected ? `${energy.color}22` : todayDay ? 'rgba(167,139,250,0.12)' : 'rgba(255,255,255,0.03)', border: selected ? `1px solid ${energy.color}66` : todayDay ? '1px solid rgba(167,139,250,0.4)' : '1px solid transparent', transition: 'all 0.15s', padding: '0.2rem' }}>
                <span style={{ fontSize: '0.55rem', lineHeight: 1 }}>{moon.emoji}</span>
                <span style={{ color: selected ? energy.color : todayDay ? 'rgba(200,180,255,0.95)' : 'rgba(200,180,255,0.65)', fontSize: '0.75rem', fontWeight: todayDay ? 700 : 400 }}>{day}</span>
                {hasLogs && <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#c9a84c' }} />}
              </button>
            )
          })}
        </div>
      </div>

      {/* Selected day detail */}
      {selectedDay && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div style={{ ...card, padding: '1.25rem', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '0.75rem', border: '1px solid rgba(200,180,255,0.08)' }}>
              <div style={{ fontSize: '1.8rem', marginBottom: '0.3rem' }}>{moonPhase.emoji}</div>
              <div style={{ color: 'rgba(220,200,255,0.85)', fontSize: '0.82rem', fontWeight: 600 }}>{moonPhase.name}</div>
              <div style={{ color: 'rgba(180,160,255,0.55)', fontSize: '0.72rem', marginTop: '0.25rem', lineHeight: 1.4 }}>{moonPhase.energy}</div>
            </div>
            <div style={{ padding: '1rem', background: `${dayEnergy.color}0d`, borderRadius: '0.75rem', border: `1px solid ${dayEnergy.color}22` }}>
              <div style={{ color: dayEnergy.color, fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.3rem' }}>✦</div>
              <div style={{ color: 'rgba(220,200,255,0.85)', fontSize: '0.82rem', fontWeight: 600 }}>{dayEnergy.energy}</div>
              <div style={{ color: 'rgba(180,160,255,0.55)', fontSize: '0.72rem', marginTop: '0.25rem', fontStyle: 'italic' }}>{dayEnergy.affirmation}</div>
            </div>
          </div>

          {/* Moon numbers */}
          <div style={{ ...card, padding: '1rem 1.25rem' }}>
            <div style={{ color: 'rgba(180,160,255,0.4)', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>Aligned Numbers Today</div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {moonPhase.numbers.map(n => <span key={n} style={{ padding: '0.25rem 0.65rem', borderRadius: '2rem', background: 'rgba(201,168,76,0.12)', border: '1px solid rgba(201,168,76,0.3)', color: '#c9a84c', fontSize: '0.8rem' }}>{n}</span>)}
            </div>
          </div>

          {/* Logged numbers for this day */}
          {logsByDay[selectedDay] && (
            <div style={{ ...card, padding: '1rem 1.25rem' }}>
              <div style={{ color: 'rgba(180,160,255,0.4)', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>Your Sightings This Day</div>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {logsByDay[selectedDay].map(n => <span key={n} style={{ padding: '0.25rem 0.65rem', borderRadius: '2rem', background: 'rgba(167,139,250,0.12)', border: '1px solid rgba(167,139,250,0.3)', color: '#a78bfa', fontSize: '0.8rem' }}>{n}</span>)}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
