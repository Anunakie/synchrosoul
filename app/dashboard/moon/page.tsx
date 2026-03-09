'use client'
import { useState, useEffect } from 'react'

function getMoonPhase(date: Date): { phase: string; emoji: string; illumination: number; energy: string; ritual: string; color: string } {
  const known = new Date('2000-01-06T18:14:00Z')
  const synodic = 29.53058867
  const diff = (date.getTime() - known.getTime()) / (1000 * 60 * 60 * 24)
  const cycle = ((diff % synodic) + synodic) % synodic
  const illumination = Math.round(50 * (1 - Math.cos((cycle / synodic) * 2 * Math.PI)))
  if (cycle < 1.85) return { phase: 'New Moon', emoji: '🌑', illumination, energy: 'New beginnings, intention setting, planting seeds', ritual: 'Write your intentions for the lunar cycle. Light a black or white candle. Meditate on what you wish to call in.', color: '#6366f1' }
  if (cycle < 7.38) return { phase: 'Waxing Crescent', emoji: '🌒', illumination, energy: 'Growth, momentum, taking action on intentions', ritual: 'Review your intentions. Take one concrete action toward each goal. Carry a citrine crystal for momentum.', color: '#8b5cf6' }
  if (cycle < 9.22) return { phase: 'First Quarter', emoji: '🌓', illumination, energy: 'Decision making, overcoming obstacles, courage', ritual: 'Identify what is blocking your intentions. Write it down and burn the paper safely. Ask: what decision must I make?', color: '#a78bfa' }
  if (cycle < 14.77) return { phase: 'Waxing Gibbous', emoji: '🌔', illumination, energy: 'Refinement, patience, trust in the process', ritual: 'Refine your approach. Practice gratitude for what is already manifesting. Charge your crystals in moonlight.', color: '#c4b5fd' }
  if (cycle < 16.61) return { phase: 'Full Moon', emoji: '🌕', illumination, energy: 'Peak power, manifestation, release, celebration', ritual: 'Charge your crystals and water under the full moon. Write what you are releasing. Celebrate your wins. Perform your most powerful rituals tonight.', color: '#fde68a' }
  if (cycle < 22.15) return { phase: 'Waning Gibbous', emoji: '🌖', illumination, energy: 'Gratitude, sharing wisdom, integration', ritual: 'Journal about what the full moon revealed. Share your gifts with others. Practice deep gratitude for all you have received.', color: '#fbbf24' }
  if (cycle < 23.99) return { phase: 'Last Quarter', emoji: '🌗', illumination, energy: 'Release, forgiveness, letting go', ritual: 'Write a forgiveness letter — to yourself or others. Release what no longer serves. Cleanse your space with smoke or sound.', color: '#f97316' }
  if (cycle < 29.53) return { phase: 'Waning Crescent', emoji: '🌘', illumination, energy: 'Rest, reflection, surrender, preparation', ritual: 'Rest deeply. Reflect on the full lunar cycle. Prepare your intentions for the new moon. Practice stillness and surrender.', color: '#ef4444' }
  return { phase: 'New Moon', emoji: '🌑', illumination, energy: 'New beginnings, intention setting', ritual: 'Set intentions for the new cycle.', color: '#6366f1' }
}

function getMonthCalendar(year: number, month: number) {
  const days = []
  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  for (let i = 0; i < firstDay; i++) days.push(null)
  for (let d = 1; d <= daysInMonth; d++) days.push(new Date(year, month, d))
  return days
}

const ANGEL_BY_PHASE: Record<string, string> = {
  'New Moon': '1111 — New portals open tonight',
  'Waxing Crescent': '333 — Your guides are amplifying your growth',
  'First Quarter': '444 — Angels support your courageous decisions',
  'Waxing Gibbous': '222 — Trust divine timing, it is coming',
  'Full Moon': '888 — Abundance and manifestation peak tonight',
  'Waning Gibbous': '777 — Wisdom flows through you now',
  'Last Quarter': '999 — Release cycles complete with grace',
  'Waning Crescent': '555 — Transformation prepares you for rebirth',
}

export default function MoonPage() {
  const [today] = useState(new Date())
  const [viewDate, setViewDate] = useState(new Date())
  const [selectedDay, setSelectedDay] = useState<Date | null>(null)
  const moonToday = getMoonPhase(today)
  const moonSelected = selectedDay ? getMoonPhase(selectedDay) : null
  const days = getMonthCalendar(viewDate.getFullYear(), viewDate.getMonth())
  const monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December']
  const card: React.CSSProperties = { background: 'rgba(8,6,28,0.88)', border: '1px solid rgba(200,180,255,0.12)', borderRadius: '1.25rem', backdropFilter: 'blur(12px)' }

  function prevMonth() { setViewDate(d => new Date(d.getFullYear(), d.getMonth() - 1, 1)) }
  function nextMonth() { setViewDate(d => new Date(d.getFullYear(), d.getMonth() + 1, 1)) }

  const displayMoon = moonSelected || moonToday
  const displayDate = selectedDay || today

  return (
    <div style={{ maxWidth: '520px', margin: '0 auto', padding: '1.5rem 1rem 2rem' }}>
      <div style={{ marginBottom: '1.25rem' }}>
        <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.8rem', color: 'rgba(220,200,255,0.95)', margin: '0 0 0.25rem', fontWeight: 400 }}>Moon Calendar</h1>
        <p style={{ color: 'rgba(180,160,255,0.5)', fontSize: '0.8rem', margin: 0 }}>Align your intentions with lunar energy</p>
      </div>

      {/* Today's moon card */}
      <div style={{ ...card, padding: '1.5rem', marginBottom: '1.25rem', borderColor: displayMoon.color + '30', background: displayMoon.color + '06' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem', marginBottom: '1rem' }}>
          <div style={{ fontSize: '3.5rem', lineHeight: 1, filter: 'drop-shadow(0 0 12px ' + displayMoon.color + '60)' }}>{displayMoon.emoji}</div>
          <div>
            <div style={{ color: 'rgba(180,160,255,0.4)', fontSize: '0.62rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.2rem' }}>
              {selectedDay ? displayDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric' }) : 'Tonight'}
            </div>
            <div style={{ color: 'rgba(220,200,255,0.95)', fontFamily: 'Cormorant Garamond, serif', fontSize: '1.4rem', fontWeight: 400 }}>{displayMoon.phase}</div>
            <div style={{ color: displayMoon.color, fontSize: '0.72rem', marginTop: '0.15rem' }}>{displayMoon.illumination}% illuminated</div>
          </div>
        </div>
        <div style={{ background: 'rgba(255,255,255,0.02)', borderRadius: '0.75rem', padding: '0.875rem', marginBottom: '0.875rem' }}>
          <div style={{ color: displayMoon.color, fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.3rem' }}>Energy</div>
          <p style={{ color: 'rgba(200,180,255,0.7)', fontSize: '0.82rem', lineHeight: 1.5, margin: 0 }}>{displayMoon.energy}</p>
        </div>
        <div style={{ background: 'rgba(201,168,76,0.06)', border: '1px solid rgba(201,168,76,0.15)', borderRadius: '0.75rem', padding: '0.875rem', marginBottom: '0.875rem' }}>
          <div style={{ color: '#c9a84c', fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.3rem' }}>✦ Angel Message</div>
          <p style={{ color: 'rgba(220,200,255,0.75)', fontSize: '0.82rem', lineHeight: 1.5, margin: 0 }}>{ANGEL_BY_PHASE[displayMoon.phase]}</p>
        </div>
        <div style={{ background: 'rgba(255,255,255,0.02)', borderRadius: '0.75rem', padding: '0.875rem' }}>
          <div style={{ color: 'rgba(180,160,255,0.35)', fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.3rem' }}>Tonight's Ritual</div>
          <p style={{ color: 'rgba(180,160,255,0.65)', fontSize: '0.8rem', lineHeight: 1.6, margin: 0 }}>{displayMoon.ritual}</p>
        </div>
      </div>

      {/* Calendar */}
      <div style={{ ...card, padding: '1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <button onClick={prevMonth} style={{ background: 'none', border: 'none', color: 'rgba(180,160,255,0.4)', cursor: 'pointer', fontSize: '1.1rem', padding: '0.25rem 0.5rem' }}>‹</button>
          <span style={{ color: 'rgba(220,200,255,0.8)', fontFamily: 'Cormorant Garamond, serif', fontSize: '1.1rem' }}>{monthNames[viewDate.getMonth()]} {viewDate.getFullYear()}</span>
          <button onClick={nextMonth} style={{ background: 'none', border: 'none', color: 'rgba(180,160,255,0.4)', cursor: 'pointer', fontSize: '1.1rem', padding: '0.25rem 0.5rem' }}>›</button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: '0.2rem', marginBottom: '0.5rem' }}>
          {['Su','Mo','Tu','We','Th','Fr','Sa'].map(d => (
            <div key={d} style={{ textAlign: 'center', color: 'rgba(180,160,255,0.3)', fontSize: '0.62rem', textTransform: 'uppercase', letterSpacing: '0.05em', padding: '0.25rem 0' }}>{d}</div>
          ))}
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: '0.2rem' }}>
          {days.map((day, i) => {
            if (!day) return <div key={'e'+i} />
            const mp = getMoonPhase(day)
            const isToday = day.toDateString() === today.toDateString()
            const isSelected = selectedDay?.toDateString() === day.toDateString()
            return (
              <button key={day.getTime()} onClick={() => setSelectedDay(isSelected ? null : day)} style={{ aspectRatio: '1', borderRadius: '50%', border: isSelected ? '1px solid ' + mp.color + '80' : isToday ? '1px solid rgba(201,168,76,0.5)' : '1px solid transparent', background: isSelected ? mp.color + '20' : isToday ? 'rgba(201,168,76,0.1)' : 'transparent', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '0.05rem', padding: '0.1rem' }}>
                <span style={{ fontSize: '0.75rem', lineHeight: 1 }}>{mp.emoji}</span>
                <span style={{ color: isToday ? '#c9a84c' : isSelected ? mp.color : 'rgba(180,160,255,0.5)', fontSize: '0.58rem', lineHeight: 1 }}>{day.getDate()}</span>
              </button>
            )
          })}
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginTop: '1rem', paddingTop: '0.875rem', borderTop: '1px solid rgba(200,180,255,0.06)' }}>
          {['🌑 New','🌒 Crescent','🌓 Quarter','🌔 Gibbous','🌕 Full','🌖 Waning','🌗 Last','🌘 Dark'].map(l => (
            <span key={l} style={{ color: 'rgba(180,160,255,0.3)', fontSize: '0.62rem' }}>{l}</span>
          ))}
        </div>
      </div>
    </div>
  )
}
