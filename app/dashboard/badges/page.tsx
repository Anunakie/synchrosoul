
'use client'
import { useState, useEffect } from 'react'
import { getAllBadges, Badge } from '@/lib/badges'
import { getLogs } from '@/lib/storage'
import { getDreams } from '@/lib/dream-storage'

export default function BadgesPage() {
  const [badges, setBadges] = useState<Badge[]>([])
  const [stats, setStats] = useState({ totalLogs: 0, streak: 0, truthCount: 0, uniqueNumbers: 0, dreamCount: 0 })

  useEffect(() => {
    const logs = getLogs()
    const dreams = getDreams()
    const logDates = new Set(logs.map((l: any) => l.createdAt.split('T')[0]))
    let streak = 0
    const today = new Date()
    for (let i = 0; i < 365; i++) {
      const d = new Date(today); d.setDate(d.getDate() - i)
      if (logDates.has(d.toISOString().split('T')[0])) streak++
      else if (i > 0) break
    }
    const uniqueNums = new Set(logs.map((l: any) => l.number)).size
    const truthCount = logs.filter((l: any) => l.screenshotUrl).length
    const s = { totalLogs: logs.length, streak, truthCount, uniqueNumbers: uniqueNums, dreamCount: dreams.length }
    setStats(s)
    setBadges(getAllBadges(s))
  }, [])

  const unlocked = badges.filter(b => b.unlocked)
  const locked = badges.filter(b => !b.unlocked)

  return (
    <div style={{ minHeight: '100vh', padding: '1.5rem 1rem 2rem', maxWidth: '480px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
        <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.8rem', color: 'rgba(220,200,255,0.95)', margin: 0 }}>Cosmic Badges</h1>
        <p style={{ color: 'rgba(200,180,255,0.5)', fontSize: '0.8rem', marginTop: '0.25rem' }}>Milestones on your spiritual journey</p>
        <div style={{ display: 'inline-flex', gap: '1rem', marginTop: '0.75rem', padding: '0.4rem 1rem', borderRadius: '9999px', background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.2)' }}>
          <span style={{ fontSize: '0.8rem', color: '#c9a84c' }}>{unlocked.length} / {badges.length} earned</span>
        </div>
      </div>

      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem', marginBottom: '1.5rem' }}>
        {[
          { label: 'Logs', value: stats.totalLogs, color: '#a78bfa' },
          { label: 'Streak', value: stats.streak + 'd', color: '#f87171' },
          { label: 'Unique', value: stats.uniqueNumbers, color: '#60a5fa' },
        ].map(s => (
          <div key={s.label} style={{ padding: '0.625rem', borderRadius: '0.75rem', background: 'rgba(8,6,28,0.88)', border: '1px solid rgba(255,255,255,0.06)', textAlign: 'center' }}>
            <div style={{ fontSize: '1.2rem', fontWeight: 700, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: '0.6rem', color: 'rgba(200,180,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Unlocked badges */}
      {unlocked.length > 0 && (
        <div style={{ marginBottom: '1.5rem' }}>
          <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.1rem', color: 'rgba(220,200,255,0.8)', marginBottom: '0.75rem' }}>Earned ({unlocked.length})</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.625rem' }}>
            {unlocked.map(b => (
              <div key={b.id} style={{ padding: '0.875rem', borderRadius: '0.875rem', background: 'rgba(8,6,28,0.9)', border: '1px solid ' + b.color + '44', backdropFilter: 'blur(12px)', display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                <div style={{ width: '2.5rem', height: '2.5rem', borderRadius: '50%', background: b.color + '22', border: '2px solid ' + b.color + '66', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '1.2rem' }}>{b.emoji}</div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: '0.8rem', fontWeight: 600, color: b.color, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{b.name}</div>
                  <div style={{ fontSize: '0.62rem', color: 'rgba(200,180,255,0.45)', marginTop: '0.1rem', lineHeight: 1.3 }}>{b.description}</div>
                  {b.unlockedAt && <div style={{ fontSize: '0.58rem', color: 'rgba(200,180,255,0.3)', marginTop: '0.2rem' }}>{new Date(b.unlockedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</div>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Locked badges */}
      {locked.length > 0 && (
        <div>
          <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.1rem', color: 'rgba(220,200,255,0.5)', marginBottom: '0.75rem' }}>Locked ({locked.length})</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.625rem' }}>
            {locked.map(b => (
              <div key={b.id} style={{ padding: '0.875rem', borderRadius: '0.875rem', background: 'rgba(8,6,28,0.6)', border: '1px solid rgba(255,255,255,0.05)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', gap: '0.625rem', opacity: 0.5 }}>
                <div style={{ width: '2.5rem', height: '2.5rem', borderRadius: '50%', background: 'rgba(255,255,255,0.04)', border: '2px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '1.2rem', filter: 'grayscale(1)' }}>{b.emoji}</div>
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'rgba(200,180,255,0.4)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{b.name}</div>
                  <div style={{ fontSize: '0.62rem', color: 'rgba(200,180,255,0.3)', marginTop: '0.1rem', lineHeight: 1.3 }}>{b.description}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {badges.length === 0 && (
        <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🏆</div>
          <p style={{ color: 'rgba(200,180,255,0.5)', fontFamily: 'Cormorant Garamond, serif', fontSize: '1.1rem' }}>Start logging angel numbers to earn your first badge!</p>
        </div>
      )}
    </div>
  )
}
