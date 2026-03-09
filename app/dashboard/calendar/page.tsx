
'use client'
import { useState, useEffect } from 'react'
import { buildCalendarMonth, CalendarDay } from '@/lib/cosmic-calendar'
import { getNumerologyProfile } from '@/lib/storage'

export default function CosmicCalendarPage() {
  const today = new Date()
  const [year, setYear] = useState(today.getFullYear())
  const [month, setMonth] = useState(today.getMonth())
  const [lifePath, setLifePath] = useState(0)
  const [selected, setSelected] = useState<CalendarDay | null>(null)
  const [calData, setCalData] = useState(() => buildCalendarMonth(today.getFullYear(), today.getMonth(), 0))

  useEffect(() => {
    const profile = getNumerologyProfile()
    const lp = profile?.lifePath || 0
    setLifePath(lp)
    setCalData(buildCalendarMonth(year, month, lp))
  }, [year, month])

  const monthNames = ['January','February','March','April','May','June','July','August','September','October','November','December']
  const dayNames = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']
  const firstDayOfWeek = new Date(year, month, 1).getDay()
  const todayStr = today.toISOString().split('T')[0]

  const powerColors = [
    'rgba(30,20,60,0.7)','rgba(40,25,80,0.7)','rgba(50,30,90,0.7)',
    'rgba(60,35,100,0.7)','rgba(80,40,110,0.7)','rgba(100,50,120,0.7)',
    'rgba(130,60,130,0.7)','rgba(160,80,80,0.7)','rgba(190,130,40,0.7)','rgba(201,168,76,0.85)'
  ]

  function prevMonth() {
    if (month === 0) { setMonth(11); setYear(y => y - 1) }
    else setMonth(m => m - 1)
  }
  function nextMonth() {
    if (month === 11) { setMonth(0); setYear(y => y + 1) }
    else setMonth(m => m + 1)
  }

  return (
    <div style={{ minHeight: '100vh', padding: '1.5rem 1rem 2rem', maxWidth: '480px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
        <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.8rem', color: 'rgba(220,200,255,0.95)', margin: 0 }}>Cosmic Calendar</h1>
        <p style={{ color: 'rgba(200,180,255,0.5)', fontSize: '0.8rem', marginTop: '0.25rem' }}>Your personal power days and moon phases</p>
        {lifePath > 0 && (
          <div style={{ display: 'inline-block', marginTop: '0.5rem', padding: '0.2rem 0.75rem', borderRadius: '9999px', background: 'rgba(201,168,76,0.15)', border: '1px solid rgba(201,168,76,0.3)', color: '#c9a84c', fontSize: '0.75rem' }}>
            Life Path {lifePath} · Personal Month {calData.personalMonthNumber} · {calData.personalMonthTheme}
          </div>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <button onClick={prevMonth} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.5rem', color: 'rgba(220,200,255,0.8)', padding: '0.4rem 0.9rem', cursor: 'pointer', fontSize: '1.1rem' }}>&#8249;</button>
        <span style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.3rem', color: 'rgba(220,200,255,0.9)' }}>{monthNames[month]} {year}</span>
        <button onClick={nextMonth} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.5rem', color: 'rgba(220,200,255,0.8)', padding: '0.4rem 0.9rem', cursor: 'pointer', fontSize: '1.1rem' }}>&#8250;</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '2px', marginBottom: '4px' }}>
        {dayNames.map(d => (
          <div key={d} style={{ textAlign: 'center', fontSize: '0.6rem', color: 'rgba(200,180,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.05em', padding: '0.25rem 0' }}>{d}</div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '3px' }}>
        {Array.from({ length: firstDayOfWeek }).map((_, i) => <div key={i} />)}
        {calData.days.map((day) => {
          const isToday = day.dateStr === todayStr
          const isSelected = selected?.dateStr === day.dateStr
          const bg = powerColors[Math.min(day.powerLevel - 1, 9)]
          return (
            <button key={day.dateStr} onClick={() => setSelected(isSelected ? null : day)}
              style={{
                aspectRatio: '1', borderRadius: '0.5rem', background: isSelected ? 'rgba(201,168,76,0.35)' : bg,
                border: isToday ? '2px solid #c9a84c' : isSelected ? '1px solid rgba(201,168,76,0.6)' : '1px solid rgba(255,255,255,0.05)',
                cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                gap: '1px', padding: '2px', transition: 'all 0.15s ease',
              }}
            >
              <span style={{ fontSize: '0.5rem', lineHeight: 1 }}>{day.moonEmoji}</span>
              <span style={{ fontSize: '0.72rem', fontWeight: isToday ? 700 : 400, color: isToday ? '#c9a84c' : 'rgba(255,255,255,0.85)', lineHeight: 1 }}>{day.dayNumber}</span>
              {day.isMasterDay && <span style={{ fontSize: '0.38rem', color: '#ffd700', lineHeight: 1 }}>&#10022;</span>}
            </button>
          )
        })}
      </div>

      <div style={{ textAlign: 'center', marginTop: '0.6rem' }}>
        <span style={{ fontSize: '0.62rem', color: 'rgba(200,180,255,0.35)' }}>Brighter = higher power day &nbsp;&#10022; Master number &nbsp; Tap any day for details</span>
      </div>

      {selected && (
        <div style={{ marginTop: '1.25rem', padding: '1.25rem', borderRadius: '1rem', background: 'rgba(8,6,28,0.9)', border: '1px solid rgba(201,168,76,0.25)', backdropFilter: 'blur(12px)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
            <div>
              <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.15rem', color: 'rgba(220,200,255,0.95)' }}>
                {selected.date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
              </div>
              <div style={{ fontSize: '0.75rem', color: 'rgba(200,180,255,0.5)', marginTop: '0.2rem' }}>{selected.moonEmoji} {selected.moonPhase}</div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '1.6rem', fontWeight: 700, color: selected.powerColor }}>{selected.powerLevel}</div>
              <div style={{ fontSize: '0.58rem', color: 'rgba(200,180,255,0.4)', textTransform: 'uppercase' }}>Power</div>
            </div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <div style={{ padding: '0.5rem', borderRadius: '0.5rem', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div style={{ fontSize: '0.58rem', color: 'rgba(200,180,255,0.4)', textTransform: 'uppercase', marginBottom: '0.2rem' }}>Universal Day</div>
              <div style={{ fontSize: '1.1rem', color: selected.powerColor, fontWeight: 600 }}>{selected.universalDay}</div>
            </div>
            <div style={{ padding: '0.5rem', borderRadius: '0.5rem', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <div style={{ fontSize: '0.58rem', color: 'rgba(200,180,255,0.4)', textTransform: 'uppercase', marginBottom: '0.2rem' }}>Theme</div>
              <div style={{ fontSize: '0.8rem', color: 'rgba(220,200,255,0.85)' }}>{selected.theme}</div>
            </div>
          </div>
          {selected.isMasterDay && (
            <div style={{ padding: '0.5rem 0.75rem', borderRadius: '0.5rem', background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.25)', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '0.75rem', color: '#c9a84c' }}>&#10022; Master Number Day - heightened spiritual energy</span>
            </div>
          )}
          <div style={{ padding: '0.75rem', borderRadius: '0.5rem', background: 'rgba(255,255,255,0.03)', borderLeft: '3px solid ' + selected.powerColor }}>
            <div style={{ fontSize: '0.62rem', color: 'rgba(200,180,255,0.4)', textTransform: 'uppercase', marginBottom: '0.3rem' }}>Daily Affirmation</div>
            <div style={{ fontSize: '0.88rem', color: 'rgba(220,200,255,0.88)', fontStyle: 'italic', fontFamily: 'Cormorant Garamond, serif' }}>"{selected.affirmation}"</div>
          </div>
        </div>
      )}
    </div>
  )
}
