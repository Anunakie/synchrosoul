'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

const KEY_LOGS = 'synchrosoul_logs'

function getWeekLabel(date: Date): string {
  const d = new Date(date)
  d.setHours(0,0,0,0)
  d.setDate(d.getDate() - d.getDay())
  return d.toISOString().slice(0,10)
}

function getHourLabel(date: Date): string {
  return String(date.getHours()).padStart(2,'0') + ':00'
}

export default function StatsPage() {
  const [logs, setLogs] = useState<any[]>([])
  const [tab, setTab] = useState<'numbers'|'time'|'heatmap'>('numbers')

  useEffect(() => {
    const l = localStorage.getItem(KEY_LOGS)
    if (l) setLogs(JSON.parse(l))
  }, [])

  // Number frequency
  const numFreq: Record<string,number> = {}
  logs.forEach((l:any) => { numFreq[l.number] = (numFreq[l.number]||0)+1 })
  const sortedNums = Object.entries(numFreq).sort((a,b)=>b[1]-a[1]).slice(0,10)
  const maxFreq = sortedNums[0]?.[1] || 1

  // Hour distribution
  const hourFreq: Record<string,number> = {}
  for (let h=0;h<24;h++) hourFreq[String(h).padStart(2,'0')+':00']=0
  logs.forEach((l:any) => { const h = getHourLabel(new Date(l.timestamp)); hourFreq[h]=(hourFreq[h]||0)+1 })
  const maxHour = Math.max(...Object.values(hourFreq), 1)

  // Day of week
  const DAYS = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']
  const dayFreq: Record<string,number> = {}
  DAYS.forEach(d => dayFreq[d]=0)
  logs.forEach((l:any) => { const d = DAYS[new Date(l.timestamp).getDay()]; dayFreq[d]=(dayFreq[d]||0)+1 })
  const maxDay = Math.max(...Object.values(dayFreq), 1)

  // Streak calculation
  const today = new Date(); today.setHours(0,0,0,0)
  const logDays = new Set(logs.map((l:any) => { const d=new Date(l.timestamp); d.setHours(0,0,0,0); return d.getTime() }))
  let streak = 0
  for (let i=0;i<365;i++) {
    const d = new Date(today); d.setDate(d.getDate()-i)
    if (logDays.has(d.getTime())) streak++; else break
  }

  // Total this week
  const weekStart = new Date(today); weekStart.setDate(weekStart.getDate()-weekStart.getDay())
  const thisWeek = logs.filter((l:any) => new Date(l.timestamp) >= weekStart).length

  const card: React.CSSProperties = { background: 'rgba(8,6,28,0.88)', border: '1px solid rgba(200,180,255,0.12)', borderRadius: '1.25rem', backdropFilter: 'blur(12px)' }

  return (
    <div style={{ maxWidth: '680px', margin: '0 auto', padding: '1.5rem 1rem 2rem' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.8rem', color: 'rgba(220,200,255,0.95)', margin: '0 0 0.25rem', fontWeight: 400 }}>Your Cosmic Stats</h1>
        <p style={{ color: 'rgba(180,160,255,0.5)', fontSize: '0.8rem', margin: 0 }}>Patterns in your angel number journey</p>
      </div>

      {/* Summary cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '0.625rem', marginBottom: '1.5rem' }}>
        {[
          { label: 'Total Sightings', value: logs.length, emoji: '✦', color: '#c9a84c' },
          { label: 'Day Streak', value: streak, emoji: '🔥', color: '#f97316' },
          { label: 'This Week', value: thisWeek, emoji: '✨', color: '#a78bfa' },
        ].map(s => (
          <div key={s.label} style={{ ...card, padding: '1rem', textAlign: 'center' }}>
            <div style={{ fontSize: '1.2rem', marginBottom: '0.25rem' }}>{s.emoji}</div>
            <div style={{ color: s.color, fontSize: '1.5rem', fontWeight: 700, lineHeight: 1 }}>{s.value}</div>
            <div style={{ color: 'rgba(180,160,255,0.4)', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.08em', marginTop: '0.25rem' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem' }}>
        {(['numbers','time','heatmap'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)} style={{ padding: '0.4rem 1rem', borderRadius: '2rem', border: tab===t ? '1px solid rgba(167,139,250,0.5)' : '1px solid rgba(200,180,255,0.1)', background: tab===t ? 'rgba(167,139,250,0.2)' : 'transparent', color: tab===t ? '#a78bfa' : 'rgba(180,160,255,0.4)', fontSize: '0.78rem', cursor: 'pointer', textTransform: 'capitalize' }}>{t}</button>
        ))}
      </div>

      {logs.length === 0 && (
        <div style={{ ...card, padding: '2rem', textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>✨</div>
          <p style={{ color: 'rgba(180,160,255,0.5)', fontSize: '0.9rem', margin: '0 0 0.875rem', fontFamily: 'Cormorant Garamond, serif', fontStyle: 'italic' }}>Your stats will appear here as you log angel numbers</p>
          <Link href='/dashboard' style={{ display: 'inline-block', padding: '0.5rem 1.25rem', borderRadius: '2rem', background: 'rgba(167,139,250,0.2)', border: '1px solid rgba(167,139,250,0.3)', color: '#a78bfa', fontSize: '0.8rem', textDecoration: 'none' }}>Start Logging →</Link>
        </div>
      )}

      {/* Numbers tab */}
      {tab === 'numbers' && logs.length > 0 && (
        <div style={{ ...card, padding: '1.25rem' }}>
          <div style={{ color: 'rgba(180,160,255,0.4)', fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '1rem' }}>Top Angel Numbers</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {sortedNums.map(([num, count], i) => (
              <div key={num} style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
                <div style={{ width: '1.5rem', color: 'rgba(180,160,255,0.3)', fontSize: '0.72rem', textAlign: 'right', flexShrink: 0 }}>#{i+1}</div>
                <div style={{ width: '3rem', color: '#c9a84c', fontSize: '0.85rem', fontWeight: 700, flexShrink: 0 }}>{num}</div>
                <div style={{ flex: 1, height: '0.5rem', borderRadius: '2rem', background: 'rgba(255,255,255,0.05)', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: (count/maxFreq*100)+'%', borderRadius: '2rem', background: 'linear-gradient(90deg, #a78bfa, #c9a84c)', transition: 'width 0.5s ease' }} />
                </div>
                <div style={{ color: 'rgba(180,160,255,0.5)', fontSize: '0.75rem', flexShrink: 0, minWidth: '2rem', textAlign: 'right' }}>{count}x</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Time tab */}
      {tab === 'time' && logs.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ ...card, padding: '1.25rem' }}>
            <div style={{ color: 'rgba(180,160,255,0.4)', fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '1rem' }}>By Hour of Day</div>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '2px', height: '80px' }}>
              {Object.entries(hourFreq).map(([h, count]) => (
                <div key={h} title={h+': '+count} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
                  <div style={{ width: '100%', height: (count/maxHour*70+2)+'px', borderRadius: '2px 2px 0 0', background: count > 0 ? 'linear-gradient(180deg, #a78bfa, rgba(167,139,250,0.3))' : 'rgba(255,255,255,0.04)', transition: 'height 0.3s' }} />
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.4rem' }}>
              {['12am','6am','12pm','6pm','12am'].map(t => <span key={t} style={{ color: 'rgba(180,160,255,0.25)', fontSize: '0.6rem' }}>{t}</span>)}
            </div>
          </div>
          <div style={{ ...card, padding: '1.25rem' }}>
            <div style={{ color: 'rgba(180,160,255,0.4)', fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '1rem' }}>By Day of Week</div>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-end', height: '80px' }}>
              {DAYS.map(d => (
                <div key={d} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                  <div style={{ width: '100%', height: (dayFreq[d]/maxDay*60+4)+'px', borderRadius: '4px 4px 0 0', background: dayFreq[d] > 0 ? 'linear-gradient(180deg, #c9a84c, rgba(201,168,76,0.3))' : 'rgba(255,255,255,0.04)', transition: 'height 0.3s' }} />
                  <span style={{ color: 'rgba(180,160,255,0.35)', fontSize: '0.6rem' }}>{d}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Heatmap tab - last 90 days */}
      {tab === 'heatmap' && logs.length > 0 && (
        <div style={{ ...card, padding: '1.25rem' }}>
          <div style={{ color: 'rgba(180,160,255,0.4)', fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '1rem' }}>Activity — Last 90 Days</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '3px' }}>
            {Array.from({length: 90}, (_,i) => {
              const d = new Date(); d.setDate(d.getDate()-89+i); d.setHours(0,0,0,0)
              const key = d.toISOString().slice(0,10)
              const count = logs.filter((l:any) => l.timestamp?.slice(0,10) === key).length
              const intensity = count === 0 ? 0 : count === 1 ? 0.3 : count <= 3 ? 0.6 : 1
              return (
                <div key={key} title={key+': '+count+' sightings'} style={{ width: '10px', height: '10px', borderRadius: '2px', background: count > 0 ? `rgba(167,139,250,${intensity})` : 'rgba(255,255,255,0.04)', border: '1px solid rgba(200,180,255,0.05)' }} />
              )
            })}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.875rem' }}>
            <span style={{ color: 'rgba(180,160,255,0.3)', fontSize: '0.65rem' }}>Less</span>
            {[0.04, 0.3, 0.6, 1].map(o => <div key={o} style={{ width: '10px', height: '10px', borderRadius: '2px', background: o < 0.1 ? 'rgba(255,255,255,0.04)' : `rgba(167,139,250,${o})` }} />)}
            <span style={{ color: 'rgba(180,160,255,0.3)', fontSize: '0.65rem' }}>More</span>
          </div>
        </div>
      )}
    </div>
  )
}