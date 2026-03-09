'use client'
import { useState, useEffect } from 'react'
import { getLogs, AngelLog } from '@/lib/storage'
import { ANGEL_MEANINGS } from '@/lib/angel-meanings'

interface TimelineGroup {
  date: string
  label: string
  logs: AngelLog[]
  dominantNumber: string
  dominantColor: string
}

function groupByDate(logs: AngelLog[]): TimelineGroup[] {
  const groups: Record<string, AngelLog[]> = {}
  logs.forEach(l => {
    const d = new Date(l.createdAt).toDateString()
    if (!groups[d]) groups[d] = []
    groups[d].push(l)
  })
  return Object.entries(groups).map(([date, dayLogs]) => {
    const freq: Record<string, number> = {}
    dayLogs.forEach(l => { freq[l.number] = (freq[l.number] || 0) + 1 })
    const dominant = Object.entries(freq).sort((a,b) => b[1]-a[1])[0]?.[0] || '111'
    const meaning = ANGEL_MEANINGS[dominant] || ANGEL_MEANINGS['default']
    const d = new Date(date)
    const label = d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
    return { date, label, logs: dayLogs, dominantNumber: dominant, dominantColor: meaning?.color || '#c9a84c' }
  }).sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export default function TimelinePage() {
  const [groups, setGroups] = useState<TimelineGroup[]>([])
  const [expanded, setExpanded] = useState<string | null>(null)
  const [filter, setFilter] = useState('')

  useEffect(() => {
    const logs = getLogs()
    setGroups(groupByDate(logs))
  }, [])

  const filtered = filter
    ? groups.filter(g => g.logs.some(l => l.number.includes(filter) || l.thought?.toLowerCase().includes(filter.toLowerCase())))
    : groups

  const totalLogs = groups.reduce((sum, g) => sum + g.logs.length, 0)
  const uniqueNumbers = [...new Set(groups.flatMap(g => g.logs.map(l => l.number)))]
  const verifiedCount = groups.flatMap(g => g.logs).filter(l => l.screenshotUrl).length

  return (
    <div style={{ maxWidth: '680px', margin: '0 auto', padding: '2rem 1rem 6rem' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🌠</div>
        <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2rem', fontWeight: 300, color: 'rgba(220,200,255,0.95)', letterSpacing: '0.05em', margin: 0 }}>Vision Timeline</h1>
        <p style={{ color: 'rgba(200,180,255,0.5)', fontSize: '0.8rem', letterSpacing: '0.1em', marginTop: '0.5rem' }}>Your complete cosmic journey</p>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem', marginBottom: '1.5rem' }}>
        {[
          { label: 'Total Sightings', value: totalLogs, emoji: '👁️' },
          { label: 'Unique Numbers', value: uniqueNumbers.length, emoji: '✦' },
          { label: 'Verified', value: verifiedCount, emoji: '✅' },
        ].map(s => (
          <div key={s.label} style={{ background: 'rgba(8,6,28,0.85)', border: '1px solid rgba(200,180,255,0.12)', borderRadius: '1rem', padding: '1rem', textAlign: 'center', backdropFilter: 'blur(12px)' }}>
            <div style={{ fontSize: '1.2rem', marginBottom: '0.25rem' }}>{s.emoji}</div>
            <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.6rem', color: '#c9a84c', fontWeight: 300 }}>{s.value}</div>
            <div style={{ fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'rgba(200,180,255,0.35)', marginTop: '0.2rem' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Number constellation */}
      {uniqueNumbers.length > 0 && (
        <div style={{ background: 'rgba(8,6,28,0.85)', border: '1px solid rgba(200,180,255,0.12)', borderRadius: '1.25rem', padding: '1.25rem', marginBottom: '1.5rem', backdropFilter: 'blur(12px)' }}>
          <p style={{ color: 'rgba(200,180,255,0.35)', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.15em', margin: '0 0 0.75rem' }}>Your number constellation</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {uniqueNumbers.map(num => {
              const m = ANGEL_MEANINGS[num] || ANGEL_MEANINGS['default']
              const count = groups.flatMap(g => g.logs).filter(l => l.number === num).length
              return (
                <button key={num} onClick={() => setFilter(filter === num ? '' : num)} style={{ padding: '0.35rem 0.85rem', background: filter === num ? `${m?.color || '#c9a84c'}22` : 'rgba(8,6,28,0.6)', border: `1px solid ${filter === num ? (m?.color || '#c9a84c') + '55' : 'rgba(200,180,255,0.12)'}`, borderRadius: '9999px', color: filter === num ? (m?.color || '#c9a84c') : 'rgba(200,180,255,0.6)', cursor: 'pointer', fontSize: '0.78rem', transition: 'all 0.2s' }}>
                  {num} <span style={{ opacity: 0.5, fontSize: '0.7rem' }}>×{count}</span>
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* Search */}
      <input
        value={filter}
        onChange={e => setFilter(e.target.value)}
        placeholder="Search by number or thought..."
        style={{ width: '100%', background: 'rgba(8,6,28,0.75)', border: '1px solid rgba(200,180,255,0.12)', borderRadius: '0.75rem', padding: '0.75rem 1rem', color: 'rgba(220,200,255,0.85)', fontSize: '0.85rem', outline: 'none', marginBottom: '1.5rem', boxSizing: 'border-box', fontFamily: 'inherit' }}
      />

      {/* Empty state */}
      {filtered.length === 0 && (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'rgba(200,180,255,0.4)' }}>
          <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>🌌</div>
          <p style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.1rem' }}>{totalLogs === 0 ? 'Your timeline is waiting to be written.' : 'No entries match your search.'}</p>
        </div>
      )}

      {/* Timeline */}
      <div style={{ position: 'relative' }}>
        {/* Vertical line */}
        {filtered.length > 0 && <div style={{ position: 'absolute', left: '1.25rem', top: '1.5rem', bottom: '1.5rem', width: '1px', background: 'linear-gradient(to bottom, rgba(200,180,255,0.2), rgba(200,180,255,0.05))' }} />}

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {filtered.map(group => (
            <div key={group.date} style={{ paddingLeft: '3rem', position: 'relative' }}>
              {/* Dot */}
              <div style={{ position: 'absolute', left: '0.75rem', top: '1.1rem', width: '1rem', height: '1rem', borderRadius: '50%', background: `${group.dominantColor}33`, border: `2px solid ${group.dominantColor}77`, transform: 'translateX(-50%)' }} />

              <button onClick={() => setExpanded(expanded === group.date ? null : group.date)} style={{ width: '100%', background: 'rgba(8,6,28,0.82)', border: `1px solid ${expanded === group.date ? group.dominantColor + '44' : 'rgba(200,180,255,0.1)'}`, borderRadius: '1rem', padding: '1rem 1.25rem', cursor: 'pointer', textAlign: 'left', backdropFilter: 'blur(12px)', transition: 'all 0.2s' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ color: 'rgba(220,200,255,0.85)', fontSize: '0.9rem', marginBottom: '0.25rem' }}>{group.label}</div>
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                      {[...new Set(group.logs.map(l => l.number))].slice(0, 4).map(num => {
                        const m = ANGEL_MEANINGS[num] || ANGEL_MEANINGS['default']
                        return <span key={num} style={{ fontSize: '0.7rem', color: m?.color || '#c9a84c', background: `${m?.color || '#c9a84c'}15`, padding: '0.15rem 0.5rem', borderRadius: '9999px' }}>{num}</span>
                      })}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <div style={{ color: 'rgba(200,180,255,0.4)', fontSize: '0.75rem' }}>{group.logs.length} sighting{group.logs.length > 1 ? 's' : ''}</div>
                    <div style={{ color: 'rgba(200,180,255,0.25)', fontSize: '0.7rem', marginTop: '0.2rem' }}>{expanded === group.date ? '▲' : '▼'}</div>
                  </div>
                </div>
              </button>

              {expanded === group.date && (
                <div style={{ marginTop: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  {group.logs.map((log, i) => {
                    const m = ANGEL_MEANINGS[log.number] || ANGEL_MEANINGS['default']
                    return (
                      <div key={i} style={{ background: 'rgba(8,6,28,0.7)', border: `1px solid ${m?.color || '#c9a84c'}22`, borderRadius: '0.75rem', padding: '0.875rem 1rem', backdropFilter: 'blur(8px)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: log.thought ? '0.5rem' : 0 }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <span style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.1rem', color: m?.color || '#c9a84c' }}>{log.number}</span>
                            {log.screenshotUrl && <span style={{ fontSize: '0.65rem', background: 'rgba(34,197,94,0.15)', border: '1px solid rgba(34,197,94,0.3)', color: '#4ade80', padding: '0.1rem 0.4rem', borderRadius: '9999px' }}>✓ Verified</span>}
                          </div>
                          <span style={{ color: 'rgba(200,180,255,0.3)', fontSize: '0.7rem' }}>{new Date(log.createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}</span>
                        </div>
                        {log.thought && <p style={{ color: 'rgba(200,180,255,0.65)', fontSize: '0.82rem', margin: 0, fontStyle: 'italic', lineHeight: 1.5 }}>"{ log.thought}"</p>}
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
