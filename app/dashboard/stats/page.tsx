'use client'
import { useState, useEffect } from 'react'
import { getStats } from '@/lib/storage'
import { ANGEL_MEANINGS } from '@/lib/angel-meanings'

const KEY_LOGS = 'synchrosoul_logs'
const KEY_DREAMS = 'synchrosoul_dreams'
const KEY_GRATITUDE = 'synchrosoul_gratitude'
const KEY_MANIFEST = 'synchrosoul_manifestations'

interface Log { number: string; createdAt: string; truthScore?: boolean }

function getHeatmap(logs: Log[]) {
  const map: Record<string, number> = {}
  logs.forEach(l => {
    const d = new Date(l.createdAt).toISOString().split('T')[0]
    map[d] = (map[d] || 0) + 1
  })
  return map
}

function getLast7Days() {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (6 - i))
    return d.toISOString().split('T')[0]
  })
}

function getLast12Weeks() {
  return Array.from({ length: 12 }, (_, i) => {
    const d = new Date()
    d.setDate(d.getDate() - (11 - i) * 7)
    return d.toISOString().split('T')[0].slice(0, 7)
  })
}

export default function StatsPage() {
  const [logs, setLogs] = useState<Log[]>([])
  const [dreamCount, setDreamCount] = useState(0)
  const [gratCount, setGratCount] = useState(0)
  const [manifestCount, setManifestCount] = useState(0)
  const [tab, setTab] = useState<'overview'|'numbers'|'activity'>('overview')
  const card: React.CSSProperties = { background: 'rgba(8,6,28,0.88)', border: '1px solid rgba(200,180,255,0.12)', borderRadius: '1.25rem', backdropFilter: 'blur(12px)', padding: '1.25rem' }

  useEffect(() => {
    try {
      const l = JSON.parse(localStorage.getItem(KEY_LOGS) || '[]')
      setLogs(l)
      setDreamCount(JSON.parse(localStorage.getItem(KEY_DREAMS) || '[]').length)
      setGratCount(JSON.parse(localStorage.getItem(KEY_GRATITUDE) || '[]').length)
      setManifestCount(JSON.parse(localStorage.getItem(KEY_MANIFEST) || '[]').length)
    } catch {}
  }, [])

  // Number frequency
  const freq: Record<string, number> = {}
  logs.forEach(l => { freq[l.number] = (freq[l.number] || 0) + 1 })
  const topNumbers = Object.entries(freq).sort((a, b) => b[1] - a[1]).slice(0, 10)
  const maxFreq = topNumbers[0]?.[1] || 1

  // Streak
  const dates = [...new Set(logs.map(l => new Date(l.createdAt).toDateString()))].sort().reverse()
  let streak = 0
  let check = new Date()
  for (const d of dates) {
    if (new Date(d).toDateString() === check.toDateString()) { streak++; check.setDate(check.getDate() - 1) } else break
  }

  // Heatmap
  const heatmap = getHeatmap(logs)
  const last7 = getLast7Days()
  const dayNames = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']

  // Hour distribution
  const hours: number[] = Array(24).fill(0)
  logs.forEach(l => { const h = new Date(l.createdAt).getHours(); hours[h]++ })
  const maxHour = Math.max(...hours, 1)
  const peakHour = hours.indexOf(Math.max(...hours))
  const peakLabel = peakHour === 0 ? '12am' : peakHour < 12 ? peakHour + 'am' : peakHour === 12 ? '12pm' : (peakHour - 12) + 'pm'

  // Truth score
  const truthCount = logs.filter(l => l.truthScore).length
  const truthPct = logs.length > 0 ? Math.round((truthCount / logs.length) * 100) : 0

  const TABS = ['overview', 'numbers', 'activity'] as const

  return (
    <div style={{ maxWidth: '560px', margin: '0 auto', padding: '1.5rem 1rem 2rem' }}>
      <div style={{ marginBottom: '1.25rem' }}>
        <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.8rem', color: 'rgba(220,200,255,0.95)', margin: '0 0 0.25rem', fontWeight: 400 }}>Your Statistics</h1>
        <p style={{ color: 'rgba(180,160,255,0.5)', fontSize: '0.8rem', margin: 0 }}>Patterns in your spiritual journey</p>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '1.25rem', background: 'rgba(8,6,28,0.7)', borderRadius: '0.875rem', padding: '0.25rem', border: '1px solid rgba(200,180,255,0.08)' }}>
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)} style={{ flex: 1, padding: '0.5rem', borderRadius: '0.625rem', border: 'none', background: tab === t ? 'rgba(167,139,250,0.18)' : 'transparent', color: tab === t ? '#a78bfa' : 'rgba(180,160,255,0.4)', fontSize: '0.75rem', cursor: 'pointer', textTransform: 'capitalize', letterSpacing: '0.04em', transition: 'all 0.2s' }}>{t}</button>
        ))}
      </div>

      {tab === 'overview' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
          {/* Key metrics */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: '0.625rem' }}>
            {[
              { label: 'Total Logs', value: logs.length, emoji: '📖', color: '#a78bfa' },
              { label: 'Day Streak', value: streak, emoji: '🔥', color: '#f97316' },
              { label: 'Unique Numbers', value: Object.keys(freq).length, emoji: '✨', color: '#60a5fa' },
              { label: 'Angel Approved', value: truthCount, emoji: '📸', color: '#34d399' },
              { label: 'Dreams Logged', value: dreamCount, emoji: '🌙', color: '#818cf8' },
              { label: 'Gratitude Days', value: gratCount, emoji: '🙏', color: '#c9a84c' },
            ].map(s => (
              <div key={s.label} style={{ ...card, padding: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ width: '2.5rem', height: '2.5rem', borderRadius: '0.75rem', background: s.color + '15', border: '1px solid ' + s.color + '25', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem', flexShrink: 0 }}>{s.emoji}</div>
                <div>
                  <div style={{ color: 'rgba(220,200,255,0.9)', fontSize: '1.3rem', fontWeight: 700, lineHeight: 1 }}>{s.value}</div>
                  <div style={{ color: 'rgba(180,160,255,0.4)', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: '0.15rem' }}>{s.label}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Truth score */}
          <div style={card}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <span style={{ color: 'rgba(220,200,255,0.8)', fontSize: '0.85rem' }}>Truth Score Rate</span>
              <span style={{ color: '#34d399', fontSize: '0.85rem', fontWeight: 600 }}>{truthPct}%</span>
            </div>
            <div style={{ height: '6px', background: 'rgba(200,180,255,0.08)', borderRadius: '9999px', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: truthPct + '%', background: 'linear-gradient(90deg, #34d399, #4ade80)', borderRadius: '9999px', transition: 'width 0.8s ease' }} />
            </div>
            <div style={{ color: 'rgba(180,160,255,0.35)', fontSize: '0.7rem', marginTop: '0.5rem' }}>{truthCount} of {logs.length} entries have screenshot proof</div>
          </div>

          {/* Peak time */}
          {logs.length > 0 && (
            <div style={{ ...card, display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ fontSize: '2rem' }}>⏰</div>
              <div>
                <div style={{ color: 'rgba(220,200,255,0.85)', fontSize: '0.88rem', marginBottom: '0.15rem' }}>Peak Sighting Time</div>
                <div style={{ color: '#c9a84c', fontSize: '1.1rem', fontWeight: 600 }}>{peakLabel}</div>
                <div style={{ color: 'rgba(180,160,255,0.4)', fontSize: '0.72rem' }}>You see the most angel numbers at this hour</div>
              </div>
            </div>
          )}
        </div>
      )}

      {tab === 'numbers' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
          <div style={card}>
            <div style={{ color: 'rgba(180,160,255,0.4)', fontSize: '0.62rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1rem' }}>Top Angel Numbers</div>
            {topNumbers.length === 0 && <div style={{ color: 'rgba(180,160,255,0.35)', fontSize: '0.85rem', textAlign: 'center', padding: '1rem 0' }}>No numbers logged yet</div>}
            {topNumbers.map(([num, count]) => {
              const meaning = ANGEL_MEANINGS[num]
              return (
                <div key={num} style={{ marginBottom: '0.875rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.3rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ color: meaning?.color || '#a78bfa', fontSize: '0.88rem', fontWeight: 600 }}>{num}</span>
                      {meaning && <span style={{ color: 'rgba(180,160,255,0.4)', fontSize: '0.72rem' }}>{meaning.title}</span>}
                    </div>
                    <span style={{ color: 'rgba(180,160,255,0.5)', fontSize: '0.78rem' }}>{count}x</span>
                  </div>
                  <div style={{ height: '4px', background: 'rgba(200,180,255,0.06)', borderRadius: '9999px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: (count / maxFreq * 100) + '%', background: meaning?.color || '#a78bfa', borderRadius: '9999px', opacity: 0.7 }} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {tab === 'activity' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
          {/* Last 7 days */}
          <div style={card}>
            <div style={{ color: 'rgba(180,160,255,0.4)', fontSize: '0.62rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.875rem' }}>Last 7 Days</div>
            <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'space-between' }}>
              {last7.map(d => {
                const count = heatmap[d] || 0
                const day = new Date(d + 'T12:00:00').getDay()
                return (
                  <div key={d} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.3rem' }}>
                    <div style={{ width: '100%', aspectRatio: '1', borderRadius: '0.4rem', background: count > 0 ? 'rgba(167,139,250,' + Math.min(0.2 + count * 0.15, 0.9) + ')' : 'rgba(200,180,255,0.05)', border: '1px solid rgba(200,180,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      {count > 0 && <span style={{ color: '#a78bfa', fontSize: '0.7rem', fontWeight: 600 }}>{count}</span>}
                    </div>
                    <span style={{ color: 'rgba(180,160,255,0.35)', fontSize: '0.58rem' }}>{dayNames[day]}</span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Hour distribution */}
          <div style={card}>
            <div style={{ color: 'rgba(180,160,255,0.4)', fontSize: '0.62rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.875rem' }}>Sightings by Hour</div>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '2px', height: '60px' }}>
              {hours.map((h, i) => (
                <div key={i} style={{ flex: 1, height: Math.max(h / maxHour * 100, 2) + '%', background: i === peakHour ? '#c9a84c' : 'rgba(167,139,250,0.35)', borderRadius: '2px 2px 0 0', minHeight: '2px' }} title={i + ':00 — ' + h + ' sightings'} />
              ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.3rem' }}>
              {['12am','6am','12pm','6pm','11pm'].map(l => <span key={l} style={{ color: 'rgba(180,160,255,0.25)', fontSize: '0.55rem' }}>{l}</span>)}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
