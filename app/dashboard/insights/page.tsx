'use client'
import { useState, useEffect, useRef } from 'react'
import { getLogs } from '@/lib/storage'
import { ANGEL_MEANINGS } from '@/lib/angel-meanings'

function getColor(num: string): string {
  const m = ANGEL_MEANINGS[num]
  return m?.color || '#a78bfa'
}

function buildHeatmap(logs: Array<{ createdAt: string; number: string }>) {
  // Last 12 weeks = 84 days
  const today = new Date()
  const days: Array<{ date: string; count: number; numbers: string[] }> = []
  for (let i = 83; i >= 0; i--) {
    const d = new Date(today)
    d.setDate(d.getDate() - i)
    const key = d.toDateString()
    const dayLogs = logs.filter(l => new Date(l.createdAt).toDateString() === key)
    days.push({ date: key, count: dayLogs.length, numbers: dayLogs.map(l => l.number) })
  }
  return days
}

function buildHourChart(logs: Array<{ createdAt: string }>) {
  const hours = Array(24).fill(0)
  logs.forEach(l => { hours[new Date(l.createdAt).getHours()]++ })
  return hours
}

function buildWeekdayChart(logs: Array<{ createdAt: string }>) {
  const days = Array(7).fill(0)
  logs.forEach(l => { days[new Date(l.createdAt).getDay()]++ })
  return days
}

export default function InsightsPage() {
  const [logs, setLogs] = useState<Array<{ createdAt: string; number: string; thought?: string }>>([])
  const [heatmap, setHeatmap] = useState<Array<{ date: string; count: number; numbers: string[] }>>([])
  const [hourChart, setHourChart] = useState<number[]>(Array(24).fill(0))
  const [weekdayChart, setWeekdayChart] = useState<number[]>(Array(7).fill(0))
  const [topNumbers, setTopNumbers] = useState<Array<{ number: string; count: number; color: string }>>([])
  const [tooltip, setTooltip] = useState<{ text: string; x: number; y: number } | null>(null)
  const [streak, setStreak] = useState(0)
  const [totalDays, setTotalDays] = useState(0)

  useEffect(() => {
    const l = getLogs()
    setLogs(l)
    setHeatmap(buildHeatmap(l))
    setHourChart(buildHourChart(l))
    setWeekdayChart(buildWeekdayChart(l))

    // Top numbers
    const counts: Record<string, number> = {}
    l.forEach(log => { counts[log.number] = (counts[log.number] || 0) + 1 })
    const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 8)
    setTopNumbers(sorted.map(([n, c]) => ({ number: n, count: c, color: getColor(n) })))

    // Streak
    const today = new Date().toDateString()
    const yesterday = new Date(Date.now() - 86400000).toDateString()
    const activeDays = new Set(l.map(log => new Date(log.createdAt).toDateString()))
    setTotalDays(activeDays.size)
    let s = 0
    let d = new Date()
    while (activeDays.has(d.toDateString())) {
      s++
      d.setDate(d.getDate() - 1)
    }
    setStreak(s)
  }, [])

  const card = { background: 'rgba(8,6,28,0.88)', border: '1px solid rgba(200,180,255,0.12)', borderRadius: '1.25rem', backdropFilter: 'blur(12px)' } as React.CSSProperties
  const maxHour = Math.max(...hourChart, 1)
  const maxWeekday = Math.max(...weekdayChart, 1)
  const maxHeat = Math.max(...heatmap.map(d => d.count), 1)
  const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
  const HOURS = ['12a','2a','4a','6a','8a','10a','12p','2p','4p','6p','8p','10p']

  return (
    <div style={{ maxWidth: '640px', margin: '0 auto', padding: '1.5rem 1rem 2rem' }}>
      <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.8rem', color: 'rgba(220,200,255,0.95)', margin: '0 0 0.25rem', fontWeight: 400 }}>Insights</h1>
      <p style={{ color: 'rgba(180,160,255,0.5)', fontSize: '0.8rem', margin: '0 0 1.5rem' }}>Patterns in your cosmic journey</p>

      {logs.length === 0 ? (
        <div style={{ ...card, padding: '3rem', textAlign: 'center' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>📊</div>
          <p style={{ color: 'rgba(180,160,255,0.5)', fontSize: '0.88rem' }}>Start logging angel numbers to see your patterns here.</p>
        </div>
      ) : (
        <>
          {/* Stats row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.6rem', marginBottom: '1rem' }}>
            {[
              { label: 'Total Logs', value: logs.length, emoji: '✦' },
              { label: 'Unique Numbers', value: topNumbers.length, emoji: '◈' },
              { label: 'Active Days', value: totalDays, emoji: '📅' },
              { label: 'Day Streak', value: streak, emoji: '🔥' },
            ].map(s => (
              <div key={s.label} style={{ ...card, padding: '0.85rem 0.6rem', textAlign: 'center' }}>
                <div style={{ fontSize: '1rem', marginBottom: '0.2rem' }}>{s.emoji}</div>
                <div style={{ color: '#a78bfa', fontSize: '1.3rem', fontFamily: 'Cormorant Garamond, serif', fontWeight: 700, lineHeight: 1 }}>{s.value}</div>
                <div style={{ color: 'rgba(180,160,255,0.4)', fontSize: '0.55rem', textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: '0.2rem' }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Activity Heatmap */}
          <div style={{ ...card, padding: '1.25rem', marginBottom: '1rem' }}>
            <div style={{ color: 'rgba(180,160,255,0.4)', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.75rem' }}>Activity — Last 12 Weeks</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(84, 1fr)', gap: '2px', position: 'relative' }}>
              {heatmap.map((day, i) => {
                const intensity = day.count === 0 ? 0 : Math.min(0.2 + (day.count / maxHeat) * 0.8, 1)
                return (
                  <div
                    key={i}
                    onMouseEnter={e => setTooltip({ text: `${day.date}: ${day.count} log${day.count !== 1 ? 's' : ''}${day.numbers.length ? ' (' + [...new Set(day.numbers)].slice(0,3).join(', ') + ')' : ''}`, x: (e as any).clientX, y: (e as any).clientY })}
                    onMouseLeave={() => setTooltip(null)}
                    style={{
                      aspectRatio: '1',
                      borderRadius: '2px',
                      background: day.count === 0 ? 'rgba(255,255,255,0.04)' : `rgba(167,139,250,${intensity})`,
                      cursor: day.count > 0 ? 'pointer' : 'default',
                      transition: 'background 0.2s',
                    }}
                  />
                )
              })}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.5rem' }}>
              <span style={{ color: 'rgba(180,160,255,0.3)', fontSize: '0.6rem' }}>12 weeks ago</span>
              <span style={{ color: 'rgba(180,160,255,0.3)', fontSize: '0.6rem' }}>Today</span>
            </div>
          </div>

          {/* Top Numbers */}
          {topNumbers.length > 0 && (
            <div style={{ ...card, padding: '1.25rem', marginBottom: '1rem' }}>
              <div style={{ color: 'rgba(180,160,255,0.4)', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.75rem' }}>Most Seen Numbers</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {topNumbers.map((n, i) => (
                  <div key={n.number} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span style={{ color: 'rgba(180,160,255,0.3)', fontSize: '0.7rem', width: '1rem', textAlign: 'right' }}>#{i+1}</span>
                    <span style={{ color: n.color, fontSize: '0.88rem', fontWeight: 700, width: '3rem' }}>{n.number}</span>
                    <div style={{ flex: 1, height: '6px', borderRadius: '3px', background: 'rgba(255,255,255,0.05)', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${(n.count / topNumbers[0].count) * 100}%`, background: `linear-gradient(90deg, ${n.color}66, ${n.color})`, borderRadius: '3px', transition: 'width 0.5s' }} />
                    </div>
                    <span style={{ color: 'rgba(180,160,255,0.5)', fontSize: '0.72rem', width: '2rem', textAlign: 'right' }}>{n.count}x</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Hour of day chart */}
          <div style={{ ...card, padding: '1.25rem', marginBottom: '1rem' }}>
            <div style={{ color: 'rgba(180,160,255,0.4)', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.75rem' }}>Time of Day</div>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '2px', height: '60px' }}>
              {hourChart.map((count, h) => (
                <div key={h} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
                  <div style={{ width: '100%', background: count > 0 ? `rgba(167,139,250,${0.15 + (count/maxHour)*0.85})` : 'rgba(255,255,255,0.04)', borderRadius: '2px 2px 0 0', height: `${Math.max((count/maxHour)*52, count > 0 ? 4 : 2)}px`, transition: 'height 0.3s' }} />
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.4rem' }}>
              {HOURS.map(h => <span key={h} style={{ color: 'rgba(180,160,255,0.3)', fontSize: '0.55rem' }}>{h}</span>)}
            </div>
          </div>

          {/* Day of week chart */}
          <div style={{ ...card, padding: '1.25rem' }}>
            <div style={{ color: 'rgba(180,160,255,0.4)', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.75rem' }}>Day of Week</div>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-end', height: '80px' }}>
              {weekdayChart.map((count, d) => (
                <div key={d} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem' }}>
                  <div style={{ width: '100%', background: count > 0 ? `rgba(201,168,76,${0.15 + (count/maxWeekday)*0.85})` : 'rgba(255,255,255,0.04)', borderRadius: '4px 4px 0 0', height: `${Math.max((count/maxWeekday)*60, count > 0 ? 6 : 3)}px`, transition: 'height 0.3s' }} />
                  <span style={{ color: 'rgba(180,160,255,0.4)', fontSize: '0.6rem' }}>{WEEKDAYS[d]}</span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {tooltip && (
        <div style={{ position: 'fixed', top: tooltip.y - 40, left: tooltip.x - 60, background: 'rgba(8,6,28,0.95)', border: '1px solid rgba(167,139,250,0.3)', borderRadius: '0.5rem', padding: '0.4rem 0.7rem', fontSize: '0.72rem', color: 'rgba(220,200,255,0.9)', pointerEvents: 'none', zIndex: 9999, whiteSpace: 'nowrap' }}>
          {tooltip.text}
        </div>
      )}
    </div>
  )
}
