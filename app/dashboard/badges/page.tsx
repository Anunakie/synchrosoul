'use client'
import { useState, useEffect } from 'react'
import { getLogs, getStats } from '@/lib/storage'

const ALL_BADGES = [
  // Logging badges
  { id: 'first_sighting', emoji: '👁️', name: 'First Sighting', desc: 'Log your first angel number', color: '#60a5fa', category: 'Journey', check: (s: any) => s.total >= 1 },
  { id: 'seeker', emoji: '🔍', name: 'Seeker', desc: 'Log 10 angel numbers', color: '#60a5fa', category: 'Journey', check: (s: any) => s.total >= 10 },
  { id: 'devoted', emoji: '✦', name: 'Devoted', desc: 'Log 50 angel numbers', color: '#a78bfa', category: 'Journey', check: (s: any) => s.total >= 50 },
  { id: 'oracle_student', emoji: '🌟', name: 'Oracle Student', desc: 'Log 100 angel numbers', color: '#c9a84c', category: 'Journey', check: (s: any) => s.total >= 100 },
  { id: 'cosmic_master', emoji: '🌌', name: 'Cosmic Master', desc: 'Log 500 angel numbers', color: '#ff6b9d', category: 'Journey', check: (s: any) => s.total >= 500 },
  // Streak badges
  { id: 'streak_3', emoji: '🔥', name: 'Ignited', desc: '3-day logging streak', color: '#fb923c', category: 'Streaks', check: (s: any) => s.streak >= 3 },
  { id: 'streak_7', emoji: '⚡', name: 'Electric', desc: '7-day logging streak', color: '#fbbf24', category: 'Streaks', check: (s: any) => s.streak >= 7 },
  { id: 'streak_14', emoji: '🌙', name: 'Lunar', desc: '14-day logging streak', color: '#a78bfa', category: 'Streaks', check: (s: any) => s.streak >= 14 },
  { id: 'streak_30', emoji: '☀️', name: 'Solar', desc: '30-day logging streak', color: '#c9a84c', category: 'Streaks', check: (s: any) => s.streak >= 30 },
  { id: 'streak_100', emoji: '💎', name: 'Diamond Soul', desc: '100-day logging streak', color: '#e0e7ff', category: 'Streaks', check: (s: any) => s.streak >= 100 },
  // Number-specific badges
  { id: 'sees_111', emoji: '1️⃣', name: 'New Beginnings', desc: 'Log 111 five times', color: '#ff6b6b', category: 'Numbers', check: (_: any, logs: any[]) => logs.filter(l => l.number === '111').length >= 5 },
  { id: 'sees_222', emoji: '2️⃣', name: 'Divine Timing', desc: 'Log 222 five times', color: '#60a5fa', category: 'Numbers', check: (_: any, logs: any[]) => logs.filter(l => l.number === '222').length >= 5 },
  { id: 'sees_333', emoji: '3️⃣', name: 'Trinity', desc: 'Log 333 five times', color: '#fbbf24', category: 'Numbers', check: (_: any, logs: any[]) => logs.filter(l => l.number === '333').length >= 5 },
  { id: 'sees_444', emoji: '4️⃣', name: 'Angelic Shield', desc: 'Log 444 five times', color: '#34d399', category: 'Numbers', check: (_: any, logs: any[]) => logs.filter(l => l.number === '444').length >= 5 },
  { id: 'sees_555', emoji: '5️⃣', name: 'Change Agent', desc: 'Log 555 five times', color: '#a78bfa', category: 'Numbers', check: (_: any, logs: any[]) => logs.filter(l => l.number === '555').length >= 5 },
  { id: 'sees_777', emoji: '7️⃣', name: 'Lucky Mystic', desc: 'Log 777 five times', color: '#818cf8', category: 'Numbers', check: (_: any, logs: any[]) => logs.filter(l => l.number === '777').length >= 5 },
  { id: 'sees_888', emoji: '8️⃣', name: 'Abundance Flow', desc: 'Log 888 five times', color: '#c9a84c', category: 'Numbers', check: (_: any, logs: any[]) => logs.filter(l => l.number === '888').length >= 5 },
  { id: 'sees_999', emoji: '9️⃣', name: 'Completion', desc: 'Log 999 five times', color: '#fb923c', category: 'Numbers', check: (_: any, logs: any[]) => logs.filter(l => l.number === '999').length >= 5 },
  { id: 'sees_1111', emoji: '✨', name: 'Portal Keeper', desc: 'Log 1111 five times', color: '#ff6b9d', category: 'Numbers', check: (_: any, logs: any[]) => logs.filter(l => l.number === '1111').length >= 5 },
  // Depth badges
  { id: 'thought_anchor', emoji: '💭', name: 'Thought Anchor', desc: 'Add a thought to 10 entries', color: '#a78bfa', category: 'Depth', check: (_: any, logs: any[]) => logs.filter(l => l.thought && l.thought.length > 0).length >= 10 },
  { id: 'truth_seeker', emoji: '📸', name: 'Truth Seeker', desc: 'Upload 5 screenshots', color: '#34d399', category: 'Depth', check: (_: any, logs: any[]) => logs.filter(l => l.screenshotUrl).length >= 5 },
  { id: 'angel_approved', emoji: '✅', name: 'Angel Approved', desc: 'Earn 10 Angel Approved badges', color: '#4ade80', category: 'Depth', check: (_: any, logs: any[]) => logs.filter(l => l.truthScore && l.truthScore >= 70).length >= 10 },
  { id: 'diverse_seer', emoji: '🌈', name: 'Diverse Seer', desc: 'Log 9 different numbers', color: '#f472b6', category: 'Depth', check: (_: any, logs: any[]) => new Set(logs.map(l => l.number)).size >= 9 },
  { id: 'night_owl', emoji: '🦉', name: 'Night Owl', desc: 'Log a number after midnight', color: '#818cf8', category: 'Depth', check: (_: any, logs: any[]) => logs.some(l => { const h = new Date(l.createdAt).getHours(); return h >= 0 && h < 5 }) },
  { id: 'early_bird', emoji: '🌅', name: 'Early Bird', desc: 'Log a number before 6am', color: '#fbbf24', category: 'Depth', check: (_: any, logs: any[]) => logs.some(l => new Date(l.createdAt).getHours() < 6) },
]

const CATEGORIES = ['Journey', 'Streaks', 'Numbers', 'Depth']

export default function BadgesPage() {
  const [earned, setEarned] = useState<Set<string>>(new Set())
  const [stats, setStats] = useState<any>({})
  const [activeCategory, setActiveCategory] = useState('Journey')
  const [newBadge, setNewBadge] = useState<string | null>(null)

  useEffect(() => {
    const logs = getLogs()
    const s = getStats()
    setStats(s)
    const earnedIds = new Set<string>()
    ALL_BADGES.forEach(b => {
      if (b.check(s, logs)) earnedIds.add(b.id)
    })
    // Check for newly earned badges
    try {
      const prev = JSON.parse(localStorage.getItem('synchrosoul_earned_badges') || '[]')
      const prevSet = new Set(prev)
      const newlyEarned = [...earnedIds].filter(id => !prevSet.has(id))
      if (newlyEarned.length > 0) setNewBadge(newlyEarned[0])
      localStorage.setItem('synchrosoul_earned_badges', JSON.stringify([...earnedIds]))
    } catch {}
    setEarned(earnedIds)
  }, [])

  const filtered = ALL_BADGES.filter(b => b.category === activeCategory)
  const earnedCount = earned.size
  const totalCount = ALL_BADGES.length
  const newBadgeData = newBadge ? ALL_BADGES.find(b => b.id === newBadge) : null

  const card = { background: 'rgba(8,6,28,0.88)', border: '1px solid rgba(200,180,255,0.12)', borderRadius: '1.25rem', backdropFilter: 'blur(12px)' } as React.CSSProperties

  return (
    <div style={{ maxWidth: '640px', margin: '0 auto', padding: '1.5rem 1rem 2rem' }}>
      {/* New badge toast */}
      {newBadgeData && (
        <div onClick={() => setNewBadge(null)} style={{ position: 'fixed', top: '4.5rem', left: '50%', transform: 'translateX(-50%)', zIndex: 999, background: `${newBadgeData.color}22`, border: `1px solid ${newBadgeData.color}66`, borderRadius: '2rem', padding: '0.75rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem', cursor: 'pointer', backdropFilter: 'blur(12px)', boxShadow: `0 0 24px ${newBadgeData.color}33`, whiteSpace: 'nowrap' }}>
          <span style={{ fontSize: '1.5rem' }}>{newBadgeData.emoji}</span>
          <div>
            <div style={{ color: newBadgeData.color, fontSize: '0.75rem', fontWeight: 700 }}>New Badge Unlocked!</div>
            <div style={{ color: 'rgba(220,200,255,0.85)', fontSize: '0.82rem' }}>{newBadgeData.name}</div>
          </div>
        </div>
      )}

      <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.8rem', color: 'rgba(220,200,255,0.95)', margin: '0 0 0.25rem', fontWeight: 400 }}>Cosmic Badges</h1>
      <p style={{ color: 'rgba(180,160,255,0.5)', fontSize: '0.8rem', margin: '0 0 1.25rem' }}>Your spiritual journey milestones</p>

      {/* Progress bar */}
      <div style={{ ...card, padding: '1.25rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div style={{ fontSize: '2rem' }}>🏆</div>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
            <span style={{ color: 'rgba(220,200,255,0.85)', fontSize: '0.85rem', fontWeight: 600 }}>{earnedCount} of {totalCount} badges earned</span>
            <span style={{ color: '#c9a84c', fontSize: '0.85rem', fontWeight: 700 }}>{Math.round((earnedCount/totalCount)*100)}%</span>
          </div>
          <div style={{ height: '6px', borderRadius: '9999px', background: 'rgba(255,255,255,0.06)' }}>
            <div style={{ height: '100%', width: `${(earnedCount/totalCount)*100}%`, background: 'linear-gradient(90deg, #a78bfa, #c9a84c)', borderRadius: '9999px', transition: 'width 0.5s ease' }} />
          </div>
        </div>
      </div>

      {/* Category tabs */}
      <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '1.25rem', overflowX: 'auto', paddingBottom: '0.25rem' }}>
        {CATEGORIES.map(cat => {
          const catBadges = ALL_BADGES.filter(b => b.category === cat)
          const catEarned = catBadges.filter(b => earned.has(b.id)).length
          return (
            <button key={cat} onClick={() => setActiveCategory(cat)} style={{ padding: '0.4rem 0.875rem', borderRadius: '2rem', cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.78rem', whiteSpace: 'nowrap', background: activeCategory === cat ? 'rgba(167,139,250,0.2)' : 'rgba(255,255,255,0.04)', border: activeCategory === cat ? '1px solid rgba(167,139,250,0.5)' : '1px solid rgba(200,180,255,0.1)', color: activeCategory === cat ? 'rgba(220,200,255,0.95)' : 'rgba(180,160,255,0.5)', transition: 'all 0.2s' }}>
              {cat} <span style={{ opacity: 0.6 }}>{catEarned}/{catBadges.length}</span>
            </button>
          )
        })}
      </div>

      {/* Badge grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem' }}>
        {filtered.map(badge => {
          const isEarned = earned.has(badge.id)
          return (
            <div key={badge.id} style={{ ...card, padding: '1.25rem', border: isEarned ? `1px solid ${badge.color}44` : '1px solid rgba(200,180,255,0.08)', background: isEarned ? `${badge.color}0d` : 'rgba(8,6,28,0.6)', opacity: isEarned ? 1 : 0.55, position: 'relative', overflow: 'hidden', transition: 'all 0.3s' }}>
              {isEarned && <div style={{ position: 'absolute', top: '-30px', right: '-30px', width: '80px', height: '80px', borderRadius: '50%', background: `radial-gradient(circle, ${badge.color}20 0%, transparent 70%)`, pointerEvents: 'none' }} />}
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem', filter: isEarned ? 'none' : 'grayscale(1)' }}>{badge.emoji}</div>
              <div style={{ color: isEarned ? 'rgba(220,200,255,0.95)' : 'rgba(180,160,255,0.5)', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.2rem' }}>{badge.name}</div>
              <div style={{ color: 'rgba(180,160,255,0.5)', fontSize: '0.72rem', lineHeight: 1.4 }}>{badge.desc}</div>
              {isEarned && <div style={{ marginTop: '0.5rem', display: 'inline-flex', alignItems: 'center', gap: '0.25rem', padding: '0.15rem 0.5rem', borderRadius: '2rem', background: `${badge.color}18`, border: `1px solid ${badge.color}33` }}><span style={{ color: badge.color, fontSize: '0.6rem' }}>✓ Earned</span></div>}
            </div>
          )
        })}
      </div>
    </div>
  )
}
