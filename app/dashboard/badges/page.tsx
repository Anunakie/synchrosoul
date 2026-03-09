'use client'
import { useState, useEffect } from 'react'
import { getAllBadges, Badge } from '@/lib/badges'

const HOW_TO_EARN: Record<string, string> = {
  first_log: 'Log your first angel number',
  logs_7: 'Log 7 angel numbers total',
  logs_33: 'Log 33 angel numbers total',
  logs_111: 'Log 111 angel numbers total',
  streak_3: 'Log numbers 3 days in a row',
  streak_7: 'Log numbers 7 days in a row',
  streak_30: 'Log numbers 30 days in a row',
  streak_111: 'Log numbers 111 days in a row',
  truth_1: 'Upload a screenshot proof on any entry',
  truth_11: 'Upload screenshot proof on 11 entries',
  numbers_3: 'Log 3 different angel numbers',
  numbers_7: 'Log 7 different angel numbers',
  numbers_12: 'Log 12 different angel numbers',
  dream_1: 'Record your first dream',
  dream_7: 'Record 7 dreams',
}

export default function BadgesPage() {
  const [badges, setBadges] = useState<Badge[]>([])
  const [filter, setFilter] = useState<'all'|'earned'|'locked'>('all')
  const [selected, setSelected] = useState<Badge|null>(null)

  useEffect(() => {
    const logs = JSON.parse(localStorage.getItem('synchrosoul_logs') || '[]')
    const dreams = JSON.parse(localStorage.getItem('synchrosoul_dreams') || '[]')
    const days = [...new Set(logs.map((l:any) => l.timestamp?.slice(0,10)))].sort().reverse() as string[]
    let streak = 0
    const today = new Date(); today.setHours(0,0,0,0)
    for (let i = 0; i < 365; i++) {
      const d = new Date(today); d.setDate(d.getDate() - i)
      if (days.includes(d.toISOString().slice(0,10))) streak++
      else break
    }
    const stats = {
      totalLogs: logs.length,
      streak,
      truthCount: logs.filter((l:any) => l.screenshotUrl).length,
      uniqueNumbers: new Set(logs.map((l:any) => l.number)).size,
      dreamCount: dreams.length,
    }
    setBadges(getAllBadges(stats))
  }, [])

  const visible = badges.filter(b => {
    if (filter === 'earned') return b.unlocked
    if (filter === 'locked') return !b.unlocked
    return true
  })
  const earned = badges.filter(b => b.unlocked)
  const card: React.CSSProperties = { background: 'rgba(8,6,28,0.88)', border: '1px solid rgba(200,180,255,0.12)', borderRadius: '1.25rem', backdropFilter: 'blur(12px)' }

  return (
    <div style={{ maxWidth: '520px', margin: '0 auto', padding: '1.5rem 1rem 2rem' }}>
      <div style={{ marginBottom: '1.25rem' }}>
        <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.8rem', color: 'rgba(220,200,255,0.95)', margin: '0 0 0.25rem', fontWeight: 400 }}>Sacred Badges</h1>
        <p style={{ color: 'rgba(180,160,255,0.5)', fontSize: '0.8rem', margin: 0 }}>Milestones earned on your cosmic journey</p>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '0.625rem', marginBottom: '1.25rem' }}>
        {[{ label: 'Earned', value: earned.length, color: '#c9a84c' }, { label: 'Total', value: badges.length, color: '#a78bfa' }, { label: 'Progress', value: badges.length ? Math.round((earned.length/badges.length)*100)+'%' : '0%', color: '#34d399' }].map(s => (
          <div key={s.label} style={{ ...card, padding: '0.875rem', textAlign: 'center' }}>
            <div style={{ color: s.color, fontSize: '1.4rem', fontWeight: 700, lineHeight: 1 }}>{s.value}</div>
            <div style={{ color: 'rgba(180,160,255,0.35)', fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: '0.2rem' }}>{s.label}</div>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem' }}>
        {(['all','earned','locked'] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{ flex: 1, padding: '0.45rem', borderRadius: '2rem', border: filter===f ? '1px solid rgba(201,168,76,0.6)' : '1px solid rgba(200,180,255,0.12)', background: filter===f ? 'rgba(201,168,76,0.15)' : 'rgba(8,6,28,0.6)', color: filter===f ? '#c9a84c' : 'rgba(180,160,255,0.4)', fontSize: '0.75rem', cursor: 'pointer', textTransform: 'capitalize', letterSpacing: '0.05em' }}>{f}</button>
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '0.75rem', marginBottom: selected ? '1.25rem' : 0 }}>
        {visible.map(b => {
          const isSel = selected?.id === b.id
          return (
            <button key={b.id} onClick={() => setSelected(isSel ? null : b)} style={{ ...card, padding: '1rem 0.5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem', cursor: 'pointer', opacity: b.unlocked ? 1 : 0.38, border: isSel ? '1px solid rgba(201,168,76,0.6)' : b.unlocked ? '1px solid ' + b.color + '30' : '1px solid rgba(200,180,255,0.08)', background: isSel ? 'rgba(201,168,76,0.1)' : b.unlocked ? b.color + '10' : 'rgba(8,6,28,0.7)', transition: 'all 0.2s', transform: isSel ? 'scale(1.04)' : 'scale(1)' }}>
              <div style={{ fontSize: '1.8rem', filter: b.unlocked ? 'none' : 'grayscale(1)' }}>{b.emoji}</div>
              <div style={{ color: b.unlocked ? 'rgba(220,200,255,0.85)' : 'rgba(180,160,255,0.35)', fontSize: '0.65rem', textAlign: 'center', lineHeight: 1.3, fontWeight: 600 }}>{b.name}</div>
              {b.unlocked && <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: b.color }} />}
            </button>
          )
        })}
      </div>
      {selected && (
        <div style={{ ...card, padding: '1.25rem', marginTop: '0.75rem', borderColor: selected.color + '30', background: selected.color + '08' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '2.5rem' }}>{selected.emoji}</span>
            <div>
              <div style={{ color: 'rgba(220,200,255,0.9)', fontWeight: 700, fontSize: '1rem' }}>{selected.name}</div>
              <div style={{ color: selected.color, fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: '0.15rem' }}>{selected.unlocked ? '✓ Earned' + (selected.unlockedAt ? ' · ' + new Date(selected.unlockedAt).toLocaleDateString() : '') : 'Locked'}</div>
            </div>
          </div>
          <p style={{ color: 'rgba(180,160,255,0.65)', fontSize: '0.82rem', lineHeight: 1.6, margin: '0 0 0.625rem', fontFamily: 'Cormorant Garamond, serif', fontStyle: 'italic' }}>{selected.description}</p>
          <div style={{ color: 'rgba(180,160,255,0.35)', fontSize: '0.72rem' }}>How to earn: <span style={{ color: 'rgba(180,160,255,0.6)' }}>{HOW_TO_EARN[selected.id] || selected.description}</span></div>
        </div>
      )}
      {visible.length === 0 && (
        <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'rgba(180,160,255,0.3)', fontSize: '0.85rem' }}>
          {filter === 'earned' ? 'No badges earned yet. Start logging angel numbers!' : 'All badges unlocked! 🌟'}
        </div>
      )}
    </div>
  )
}
