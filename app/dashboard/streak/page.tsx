'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

const KEY_LOGS = 'synchrosoul_logs'

interface Milestone {
  days: number
  title: string
  emoji: string
  color: string
  message: string
}

const MILESTONES: Milestone[] = [
  { days: 1,   title: 'First Sighting',    emoji: '✦',  color: '#a78bfa', message: 'Your cosmic journey begins. The universe has noticed.' },
  { days: 3,   title: 'Awakening',         emoji: '🌱', color: '#34d399', message: 'Three days of awareness. The veil is thinning.' },
  { days: 7,   title: 'Week of Signs',     emoji: '🌙', color: '#60a5fa', message: 'A full week of synchronicities. You are tuning in.' },
  { days: 11,  title: 'Master Seeker',     emoji: '⚡', color: '#c9a84c', message: 'Eleven days — a master number milestone. Intuition sharpens.' },
  { days: 14,  title: 'Two Weeks Aligned', emoji: '✨', color: '#f472b6', message: 'Two weeks of daily awareness. Your vibration is rising.' },
  { days: 21,  title: 'Habit of Light',    emoji: '🔮', color: '#818cf8', message: 'Twenty-one days forms a habit. This is now part of who you are.' },
  { days: 30,  title: 'Moon Cycle',        emoji: '🌕', color: '#fbbf24', message: 'A full lunar cycle of logging. The moon has witnessed your journey.' },
  { days: 33,  title: 'Master Teacher',    emoji: '🕊️', color: '#c9a84c', message: 'Thirty-three days — the master teacher number. You are becoming a beacon.' },
  { days: 44,  title: 'Angel Guardian',    emoji: '👼', color: '#c9a84c', message: 'Forty-four days of devotion. The angels walk beside you.' },
  { days: 55,  title: 'Freedom Seeker',    emoji: '🌊', color: '#34d399', message: 'Fifty-five days of change and flow. You have embraced transformation.' },
  { days: 66,  title: 'Heart Healer',      emoji: '💗', color: '#f472b6', message: 'Sixty-six days of love and awareness. Your heart is open.' },
  { days: 77,  title: 'Mystic',            emoji: '🔮', color: '#a78bfa', message: 'Seventy-seven days of spiritual practice. The mysteries reveal themselves.' },
  { days: 88,  title: 'Abundance Portal', emoji: '👑', color: '#c9a84c', message: 'Eighty-eight days of manifestation. Abundance flows to you.' },
  { days: 99,  title: 'Completion',        emoji: '🌙', color: '#e879f9', message: 'Ninety-nine days — a cycle complete. You have transformed.' },
  { days: 111, title: 'Illuminated One',   emoji: '⭐', color: '#c9a84c', message: 'One hundred and eleven days. You are a living angel number.' },
  { days: 222, title: 'Twin Flame',        emoji: '🔥', color: '#f97316', message: 'Two hundred and twenty-two days. You have become the sign.' },
  { days: 333, title: 'Ascended',          emoji: '🌟', color: '#c9a84c', message: 'Three hundred and thirty-three days. The masters bow to your dedication.' },
  { days: 365, title: 'Year of Light',     emoji: '☀️', color: '#fbbf24', message: 'A full year of daily awareness. You are the light.' },
]

export default function StreakPage() {
  const [streak, setStreak] = useState(0)
  const [totalLogs, setTotalLogs] = useState(0)
  const [longestStreak, setLongestStreak] = useState(0)
  const [lastLogged, setLastLogged] = useState<string|null>(null)

  useEffect(() => {
    const raw = localStorage.getItem(KEY_LOGS)
    const logs: any[] = raw ? JSON.parse(raw) : []
    setTotalLogs(logs.length)

    if (logs.length === 0) return

    // Get unique days
    const days = [...new Set(logs.map((l:any) => l.timestamp?.slice(0,10)))].sort().reverse() as string[]
    setLastLogged(days[0])

    // Current streak
    const today = new Date(); today.setHours(0,0,0,0)
    let cur = 0
    for (let i = 0; i < 365; i++) {
      const d = new Date(today); d.setDate(d.getDate() - i)
      if (days.includes(d.toISOString().slice(0,10))) cur++
      else break
    }
    setStreak(cur)

    // Longest streak
    let longest = 0, current = 1
    const sortedDays = [...days].sort()
    for (let i = 1; i < sortedDays.length; i++) {
      const prev = new Date(sortedDays[i-1])
      const curr = new Date(sortedDays[i])
      const diff = (curr.getTime() - prev.getTime()) / 86400000
      if (diff === 1) { current++; longest = Math.max(longest, current) }
      else current = 1
    }
    setLongestStreak(Math.max(longest, cur))
  }, [])

  const card: React.CSSProperties = { background: 'rgba(8,6,28,0.88)', border: '1px solid rgba(200,180,255,0.12)', borderRadius: '1.25rem', backdropFilter: 'blur(12px)' }

  const nextMilestone = MILESTONES.find(m => m.days > streak)
  const earnedMilestones = MILESTONES.filter(m => m.days <= streak)
  const latestEarned = earnedMilestones[earnedMilestones.length - 1]

  return (
    <div style={{ maxWidth: '520px', margin: '0 auto', padding: '1.5rem 1rem 2rem' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.8rem', color: 'rgba(220,200,255,0.95)', margin: '0 0 0.25rem', fontWeight: 400 }}>Cosmic Streak</h1>
        <p style={{ color: 'rgba(180,160,255,0.5)', fontSize: '0.8rem', margin: 0 }}>Your daily devotion to the signs</p>
      </div>

      {/* Current streak hero */}
      <div style={{ ...card, padding: '2rem', marginBottom: '1.25rem', textAlign: 'center', position: 'relative', overflow: 'hidden', borderColor: streak > 0 ? 'rgba(201,168,76,0.25)' : 'rgba(200,180,255,0.12)' }}>
        <div style={{ position: 'absolute', top: '-30px', left: '50%', transform: 'translateX(-50%)', width: '150px', height: '150px', borderRadius: '50%', background: 'rgba(201,168,76,0.08)', filter: 'blur(40px)', pointerEvents: 'none' }} />
        <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>{latestEarned?.emoji || '✦'}</div>
        <div style={{ fontSize: '4rem', fontWeight: 800, color: streak > 0 ? '#c9a84c' : 'rgba(180,160,255,0.3)', lineHeight: 1, fontFamily: 'Cormorant Garamond, serif' }}>{streak}</div>
        <div style={{ color: 'rgba(220,200,255,0.7)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.15em', marginTop: '0.25rem' }}>Day Streak</div>
        {latestEarned && (
          <div style={{ marginTop: '0.875rem', padding: '0.5rem 1rem', borderRadius: '2rem', background: latestEarned.color + '18', border: '1px solid ' + latestEarned.color + '33', display: 'inline-block' }}>
            <span style={{ color: latestEarned.color, fontSize: '0.8rem', fontWeight: 600 }}>{latestEarned.title}</span>
          </div>
        )}
        {latestEarned && (
          <p style={{ color: 'rgba(180,160,255,0.5)', fontSize: '0.78rem', fontStyle: 'italic', margin: '0.75rem 0 0', fontFamily: 'Cormorant Garamond, serif' }}>{latestEarned.message}</p>
        )}
      </div>

      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '0.625rem', marginBottom: '1.25rem' }}>
        {[
          { label: 'Total Logs', value: totalLogs, emoji: '📝' },
          { label: 'Best Streak', value: longestStreak, emoji: '🏆' },
          { label: 'Milestones', value: earnedMilestones.length, emoji: '⭐' },
        ].map(s => (
          <div key={s.label} style={{ ...card, padding: '0.875rem', textAlign: 'center' }}>
            <div style={{ fontSize: '1rem', marginBottom: '0.2rem' }}>{s.emoji}</div>
            <div style={{ color: '#a78bfa', fontSize: '1.3rem', fontWeight: 700, lineHeight: 1 }}>{s.value}</div>
            <div style={{ color: 'rgba(180,160,255,0.35)', fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: '0.2rem' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Next milestone */}
      {nextMilestone && streak > 0 && (
        <div style={{ ...card, padding: '1.1rem 1.25rem', marginBottom: '1.25rem', background: 'rgba(201,168,76,0.06)', borderColor: 'rgba(201,168,76,0.2)' }}>
          <div style={{ color: 'rgba(180,160,255,0.4)', fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '0.5rem' }}>Next Milestone</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
            <span style={{ fontSize: '1.5rem' }}>{nextMilestone.emoji}</span>
            <div style={{ flex: 1 }}>
              <div style={{ color: '#c9a84c', fontSize: '0.9rem', fontWeight: 600 }}>{nextMilestone.title} — Day {nextMilestone.days}</div>
              <div style={{ color: 'rgba(180,160,255,0.4)', fontSize: '0.75rem', marginTop: '0.15rem' }}>{nextMilestone.days - streak} more day{nextMilestone.days - streak !== 1 ? 's' : ''} to go</div>
            </div>
          </div>
          <div style={{ marginTop: '0.75rem', height: '4px', borderRadius: '2px', background: 'rgba(255,255,255,0.05)', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: Math.min(100, (streak / nextMilestone.days) * 100) + '%', background: 'linear-gradient(90deg, #a78bfa, #c9a84c)', borderRadius: '2px', transition: 'width 0.5s ease' }} />
          </div>
        </div>
      )}

      {/* All milestones */}
      <div style={{ ...card, overflow: 'hidden' }}>
        <div style={{ padding: '0.875rem 1.25rem', borderBottom: '1px solid rgba(200,180,255,0.06)' }}>
          <div style={{ color: 'rgba(180,160,255,0.4)', fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '0.12em' }}>All Milestones</div>
        </div>
        {MILESTONES.map((m, i) => {
          const earned = streak >= m.days
          return (
            <div key={m.days} style={{ padding: '0.875rem 1.25rem', borderBottom: i < MILESTONES.length-1 ? '1px solid rgba(200,180,255,0.04)' : 'none', display: 'flex', alignItems: 'center', gap: '0.875rem', opacity: earned ? 1 : 0.4 }}>
              <div style={{ width: '2.25rem', height: '2.25rem', borderRadius: '50%', background: earned ? m.color + '20' : 'rgba(255,255,255,0.04)', border: '1px solid ' + (earned ? m.color + '40' : 'rgba(200,180,255,0.08)'), display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem', flexShrink: 0 }}>
                {earned ? m.emoji : '○'}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ color: earned ? 'rgba(220,200,255,0.85)' : 'rgba(180,160,255,0.4)', fontSize: '0.85rem', fontWeight: 600 }}>{m.title}</div>
                <div style={{ color: 'rgba(180,160,255,0.3)', fontSize: '0.7rem' }}>Day {m.days}</div>
              </div>
              {earned && <span style={{ color: '#34d399', fontSize: '0.75rem' }}>✓</span>}
            </div>
          )
        })}
      </div>

      {streak === 0 && (
        <div style={{ marginTop: '1.25rem', textAlign: 'center' }}>
          <Link href="/dashboard" style={{ display: 'inline-block', padding: '0.625rem 1.5rem', borderRadius: '2rem', background: 'rgba(167,139,250,0.2)', border: '1px solid rgba(167,139,250,0.3)', color: '#a78bfa', fontSize: '0.85rem', textDecoration: 'none' }}>Log Your First Number →</Link>
        </div>
      )}
    </div>
  )
}
