
'use client'
import { useState, useEffect } from 'react'
import { getLogs } from '@/lib/storage'
import { ANGEL_MEANINGS } from '@/lib/angel-meanings'

interface NumberStat {
  number: string
  count: number
  color: string
  message: string
  lastSeen: string
}

interface HourStat { hour: number; count: number }

export default function InsightsPage() {
  const [stats, setStats] = useState<{
    total: number
    streak: number
    topNumbers: NumberStat[]
    hourly: HourStat[]
    weekday: { day: string; count: number }[]
    truthCount: number
    uniqueCount: number
    firstLog: string | null
    mostActive: string
  } | null>(null)

  useEffect(() => {
    const logs = getLogs()
    if (!logs.length) { setStats(null); return }

    const numMap: Record<string, { count: number; last: string }> = {}
    const hourMap: Record<number, number> = {}
    const dayMap: Record<string, number> = {}
    const days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']
    let truthCount = 0

    for (const log of logs) {
      numMap[log.number] = numMap[log.number] || { count: 0, last: log.createdAt }
      numMap[log.number].count++
      if (log.createdAt > numMap[log.number].last) numMap[log.number].last = log.createdAt
      const d = new Date(log.createdAt)
      hourMap[d.getHours()] = (hourMap[d.getHours()] || 0) + 1
      const wd = days[d.getDay()]
      dayMap[wd] = (dayMap[wd] || 0) + 1
      if (log.screenshotUrl) truthCount++
    }

    const topNumbers: NumberStat[] = Object.entries(numMap)
      .sort((a, b) => b[1].count - a[1].count)
      .slice(0, 8)
      .map(([num, data]) => {
        const m = ANGEL_MEANINGS[num] || ANGEL_MEANINGS['default']
        return { number: num, count: data.count, color: m?.color || '#c9a84c', message: m?.message || '', lastSeen: data.last }
      })

    const hourly: HourStat[] = Array.from({ length: 24 }, (_, h) => ({ hour: h, count: hourMap[h] || 0 }))
    const maxHour = hourly.reduce((a, b) => a.count > b.count ? a : b)
    const hourLabel = (h: number) => h === 0 ? '12am' : h < 12 ? h + 'am' : h === 12 ? '12pm' : (h - 12) + 'pm'

    const weekday = days.map(d => ({ day: d, count: dayMap[d] || 0 }))
    const maxDay = weekday.reduce((a, b) => a.count > b.count ? a : b)

    const sorted = [...logs].sort((a, b) => a.createdAt.localeCompare(b.createdAt))
    const firstLog = sorted[0]?.createdAt || null

    // streak calc
    const logDates = new Set(logs.map(l => l.createdAt.split('T')[0]))
    let streak = 0
    const today = new Date()
    for (let i = 0; i < 365; i++) {
      const d = new Date(today); d.setDate(d.getDate() - i)
      if (logDates.has(d.toISOString().split('T')[0])) streak++
      else if (i > 0) break
    }

    setStats({
      total: logs.length, streak, topNumbers, hourly, weekday, truthCount,
      uniqueCount: Object.keys(numMap).length,
      firstLog,
      mostActive: maxHour.count > 0 ? hourLabel(maxHour.hour) + ' on ' + maxDay.day : 'N/A'
    })
  }, [])

  if (!stats) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ fontSize: '3rem' }}>📊</div>
      <p style={{ color: 'rgba(200,180,255,0.5)', fontFamily: 'Cormorant Garamond, serif', fontSize: '1.1rem' }}>No data yet — start logging angel numbers!</p>
    </div>
  )

  const maxHourCount = Math.max(...stats.hourly.map(h => h.count), 1)
  const maxDayCount = Math.max(...stats.weekday.map(d => d.count), 1)

  return (
    <div style={{ minHeight: '100vh', padding: '1.5rem 1rem 2rem', maxWidth: '480px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
        <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.8rem', color: 'rgba(220,200,255,0.95)', margin: 0 }}>Your Insights</h1>
        <p style={{ color: 'rgba(200,180,255,0.5)', fontSize: '0.8rem', marginTop: '0.25rem' }}>Patterns in your cosmic journey</p>
      </div>

      {/* Summary cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem', marginBottom: '1.5rem' }}>
        {[
          { label: 'Total Logs', value: stats.total, emoji: '📿', color: '#a78bfa' },
          { label: 'Day Streak', value: stats.streak, emoji: '🔥', color: '#f87171' },
          { label: 'Unique Numbers', value: stats.uniqueCount, emoji: '🔢', color: '#60a5fa' },
          { label: 'Angel Approved', value: stats.truthCount, emoji: '✅', color: '#34d399' },
        ].map(s => (
          <div key={s.label} style={{ padding: '1rem', borderRadius: '0.875rem', background: 'rgba(8,6,28,0.88)', border: '1px solid rgba(255,255,255,0.07)', backdropFilter: 'blur(12px)', textAlign: 'center' }}>
            <div style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>{s.emoji}</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 700, color: s.color, lineHeight: 1 }}>{s.value}</div>
            <div style={{ fontSize: '0.65rem', color: 'rgba(200,180,255,0.45)', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: '0.25rem' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Most active */}
      <div style={{ padding: '0.875rem 1rem', borderRadius: '0.875rem', background: 'rgba(8,6,28,0.88)', border: '1px solid rgba(201,168,76,0.2)', backdropFilter: 'blur(12px)', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <span style={{ fontSize: '1.5rem' }}>⚡</span>
        <div>
          <div style={{ fontSize: '0.65rem', color: 'rgba(200,180,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Most Active Time</div>
          <div style={{ fontSize: '1rem', color: '#c9a84c', fontFamily: 'Cormorant Garamond, serif' }}>{stats.mostActive}</div>
        </div>
        {stats.firstLog && (
          <div style={{ marginLeft: 'auto', textAlign: 'right' }}>
            <div style={{ fontSize: '0.65rem', color: 'rgba(200,180,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Journey Started</div>
            <div style={{ fontSize: '0.8rem', color: 'rgba(220,200,255,0.7)' }}>{new Date(stats.firstLog).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
          </div>
        )}
      </div>

      {/* Top numbers */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.1rem', color: 'rgba(220,200,255,0.8)', marginBottom: '0.75rem' }}>Most Seen Numbers</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {stats.topNumbers.map((n, i) => (
            <div key={n.number} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.625rem 0.875rem', borderRadius: '0.75rem', background: 'rgba(8,6,28,0.88)', border: '1px solid rgba(255,255,255,0.06)', backdropFilter: 'blur(8px)' }}>
              <span style={{ fontSize: '0.75rem', color: 'rgba(200,180,255,0.3)', width: '1rem', textAlign: 'center' }}>#{i+1}</span>
              <div style={{ width: '2.5rem', height: '2.5rem', borderRadius: '0.5rem', background: n.color + '22', border: '1px solid ' + n.color + '44', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: n.color }}>{n.number}</span>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ height: '4px', borderRadius: '2px', background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: (n.count / stats.topNumbers[0].count * 100) + '%', background: n.color, borderRadius: '2px', transition: 'width 0.5s ease' }} />
                </div>
              </div>
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'rgba(220,200,255,0.8)', minWidth: '2rem', textAlign: 'right' }}>{n.count}x</span>
            </div>
          ))}
        </div>
      </div>

      {/* Hourly chart */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.1rem', color: 'rgba(220,200,255,0.8)', marginBottom: '0.75rem' }}>Time of Day</h2>
        <div style={{ padding: '1rem', borderRadius: '0.875rem', background: 'rgba(8,6,28,0.88)', border: '1px solid rgba(255,255,255,0.06)', backdropFilter: 'blur(8px)' }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '2px', height: '60px' }}>
            {stats.hourly.map(h => (
              <div key={h.hour} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
                <div style={{ width: '100%', background: h.count > 0 ? 'rgba(167,139,250,0.7)' : 'rgba(255,255,255,0.05)', borderRadius: '2px 2px 0 0', height: Math.max(2, (h.count / maxHourCount) * 52) + 'px', transition: 'height 0.4s ease' }} />
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '4px' }}>
            {['12am','6am','12pm','6pm','11pm'].map(l => (
              <span key={l} style={{ fontSize: '0.55rem', color: 'rgba(200,180,255,0.3)' }}>{l}</span>
            ))}
          </div>
        </div>
      </div>

      {/* Weekday chart */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.1rem', color: 'rgba(220,200,255,0.8)', marginBottom: '0.75rem' }}>Day of Week</h2>
        <div style={{ padding: '1rem', borderRadius: '0.875rem', background: 'rgba(8,6,28,0.88)', border: '1px solid rgba(255,255,255,0.06)', backdropFilter: 'blur(8px)' }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '4px', height: '60px' }}>
            {stats.weekday.map(d => (
              <div key={d.day} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                <div style={{ width: '100%', background: d.count > 0 ? 'rgba(201,168,76,0.7)' : 'rgba(255,255,255,0.05)', borderRadius: '3px 3px 0 0', height: Math.max(2, (d.count / maxDayCount) * 52) + 'px', transition: 'height 0.4s ease' }} />
                <span style={{ fontSize: '0.6rem', color: 'rgba(200,180,255,0.4)' }}>{d.day[0]}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
