'use client'
import { useState, useEffect } from 'react'

const KEY_LOGS = 'synchrosoul_logs'
const KEY_DREAMS = 'synchrosoul_dreams'
const KEY_GRATITUDE = 'synchrosoul_gratitude'
const KEY_MANIFEST = 'synchrosoul_manifestations'
const KEY_PROFILE = 'synchrosoul_numerology_profile'
const KEY_VISION = 'synchrosoul_vision_board'

interface Badge {
  id: string
  emoji: string
  name: string
  description: string
  category: string
  color: string
  check: (data: AppData) => boolean
  progress?: (data: AppData) => { current: number; total: number }
}

interface AppData {
  logs: any[]
  dreams: any[]
  gratitude: any[]
  manifests: any[]
  profile: any
  visionItems: any[]
  streak: number
}

function calcStreak(logs: any[]): number {
  if (!logs.length) return 0
  const days = new Set(logs.map(l => new Date(l.createdAt).toDateString()))
  let streak = 0
  const today = new Date()
  for (let i = 0; i < 365; i++) {
    const d = new Date(today)
    d.setDate(today.getDate() - i)
    if (days.has(d.toDateString())) streak++
    else if (i > 0) break
  }
  return streak
}

const ALL_BADGES: Badge[] = [
  // Logging badges
  { id: 'first_sign', emoji: '✦', name: 'First Sign', description: 'Log your first angel number', category: 'Logger', color: '#a78bfa', check: d => d.logs.length >= 1 },
  { id: 'signs_10', emoji: '🌟', name: 'Awakening', description: 'Log 10 angel numbers', category: 'Logger', color: '#a78bfa', check: d => d.logs.length >= 10, progress: d => ({ current: Math.min(d.logs.length, 10), total: 10 }) },
  { id: 'signs_50', emoji: '💫', name: 'Attuned', description: 'Log 50 angel numbers', category: 'Logger', color: '#a78bfa', check: d => d.logs.length >= 50, progress: d => ({ current: Math.min(d.logs.length, 50), total: 50 }) },
  { id: 'signs_100', emoji: '🌠', name: 'Cosmic Receiver', description: 'Log 100 angel numbers', category: 'Logger', color: '#a78bfa', check: d => d.logs.length >= 100, progress: d => ({ current: Math.min(d.logs.length, 100), total: 100 }) },
  { id: 'signs_333', emoji: '🔮', name: 'Ascended Logger', description: 'Log 333 angel numbers', category: 'Logger', color: '#a78bfa', check: d => d.logs.length >= 333, progress: d => ({ current: Math.min(d.logs.length, 333), total: 333 }) },
  { id: 'truth_score', emoji: '📸', name: 'Truth Seeker', description: 'Upload a screenshot for Truth Score', category: 'Logger', color: '#60a5fa', check: d => d.logs.some(l => l.truthScore) },
  { id: 'thought_anchor', emoji: '💭', name: 'Thought Anchor', description: 'Add a thought to 5 logs', category: 'Logger', color: '#60a5fa', check: d => d.logs.filter(l => l.thought).length >= 5, progress: d => ({ current: Math.min(d.logs.filter((l: any) => l.thought).length, 5), total: 5 }) },
  // Streak badges
  { id: 'streak_3', emoji: '🔥', name: 'Spark', description: '3-day logging streak', category: 'Streak', color: '#fb923c', check: d => d.streak >= 3, progress: d => ({ current: Math.min(d.streak, 3), total: 3 }) },
  { id: 'streak_7', emoji: '🌞', name: 'Solar Week', description: '7-day logging streak', category: 'Streak', color: '#fb923c', check: d => d.streak >= 7, progress: d => ({ current: Math.min(d.streak, 7), total: 7 }) },
  { id: 'streak_21', emoji: '🌙', name: 'Lunar Cycle', description: '21-day logging streak', category: 'Streak', color: '#fb923c', check: d => d.streak >= 21, progress: d => ({ current: Math.min(d.streak, 21), total: 21 }) },
  { id: 'streak_33', emoji: '⚡', name: 'Master Number', description: '33-day logging streak', category: 'Streak', color: '#fb923c', check: d => d.streak >= 33, progress: d => ({ current: Math.min(d.streak, 33), total: 33 }) },
  // Dream badges
  { id: 'first_dream', emoji: '🌙', name: 'Dream Walker', description: 'Record your first dream', category: 'Dreams', color: '#818cf8', check: d => d.dreams.length >= 1 },
  { id: 'dreams_7', emoji: '🌌', name: 'Dream Weaver', description: 'Record 7 dreams', category: 'Dreams', color: '#818cf8', check: d => d.dreams.length >= 7, progress: d => ({ current: Math.min(d.dreams.length, 7), total: 7 }) },
  { id: 'dreams_30', emoji: '🔭', name: 'Astral Traveler', description: 'Record 30 dreams', category: 'Dreams', color: '#818cf8', check: d => d.dreams.length >= 30, progress: d => ({ current: Math.min(d.dreams.length, 30), total: 30 }) },
  // Gratitude badges
  { id: 'first_gratitude', emoji: '💛', name: 'Grateful Heart', description: 'Write your first gratitude entry', category: 'Gratitude', color: '#c9a84c', check: d => d.gratitude.length >= 1 },
  { id: 'gratitude_7', emoji: '🌻', name: 'Golden Week', description: '7 gratitude entries', category: 'Gratitude', color: '#c9a84c', check: d => d.gratitude.length >= 7, progress: d => ({ current: Math.min(d.gratitude.length, 7), total: 7 }) },
  { id: 'gratitude_30', emoji: '☀️', name: 'Abundance Mindset', description: '30 gratitude entries', category: 'Gratitude', color: '#c9a84c', check: d => d.gratitude.length >= 30, progress: d => ({ current: Math.min(d.gratitude.length, 30), total: 30 }) },
  // Manifestation badges
  { id: 'first_manifest', emoji: '🌱', name: 'Seed Planter', description: 'Create your first manifestation', category: 'Manifestation', color: '#4ade80', check: d => d.manifests.length >= 1 },
  { id: 'manifest_achieved', emoji: '✨', name: 'Manifestor', description: 'Mark a manifestation as achieved', category: 'Manifestation', color: '#4ade80', check: d => d.manifests.some((m: any) => m.status === 'manifested') },
  { id: 'manifest_5', emoji: '🌳', name: 'Abundant Creator', description: '5 active manifestations', category: 'Manifestation', color: '#4ade80', check: d => d.manifests.length >= 5, progress: d => ({ current: Math.min(d.manifests.length, 5), total: 5 }) },
  // Profile badges
  { id: 'numerology_profile', emoji: '🔢', name: 'Soul Blueprint', description: 'Complete your numerology profile', category: 'Profile', color: '#f472b6', check: d => !!(d.profile?.lifePathNumber) },
  { id: 'vision_board', emoji: '🎯', name: 'Visionary', description: 'Add 3 items to your vision board', category: 'Profile', color: '#f472b6', check: d => d.visionItems.length >= 3, progress: d => ({ current: Math.min(d.visionItems.length, 3), total: 3 }) },
  // Special
  { id: 'all_numbers', emoji: '🌈', name: 'Number Collector', description: 'Log 10 different angel numbers', category: 'Special', color: '#c9a84c', check: d => new Set(d.logs.map((l: any) => l.number)).size >= 10, progress: d => ({ current: Math.min(new Set(d.logs.map((l: any) => l.number)).size, 10), total: 10 }) },
  { id: 'triple_crown', emoji: '👑', name: 'Triple Crown', description: 'Log 111, 222, and 333 in the same day', category: 'Special', color: '#c9a84c', check: d => {
    const byDay: Record<string, Set<string>> = {}
    d.logs.forEach((l: any) => {
      const day = new Date(l.createdAt).toDateString()
      if (!byDay[day]) byDay[day] = new Set()
      byDay[day].add(l.number)
    })
    return Object.values(byDay).some(s => s.has('111') && s.has('222') && s.has('333'))
  }},
  { id: 'master_number', emoji: '⚡', name: 'Master Vibration', description: 'Log 1111 five times', category: 'Special', color: '#c9a84c', check: d => d.logs.filter((l: any) => l.number === '1111').length >= 5, progress: d => ({ current: Math.min(d.logs.filter((l: any) => l.number === '1111').length, 5), total: 5 }) },
]

const CATEGORIES = ['All', 'Logger', 'Streak', 'Dreams', 'Gratitude', 'Manifestation', 'Profile', 'Special']

export default function BadgesPage() {
  const [data, setData] = useState<AppData | null>(null)
  const [filter, setFilter] = useState('All')
  const [showLocked, setShowLocked] = useState(true)

  useEffect(() => {
    try {
      const logs = JSON.parse(localStorage.getItem(KEY_LOGS) || '[]')
      const dreams = JSON.parse(localStorage.getItem(KEY_DREAMS) || '[]')
      const gratitude = JSON.parse(localStorage.getItem(KEY_GRATITUDE) || '[]')
      const manifests = JSON.parse(localStorage.getItem(KEY_MANIFEST) || '[]')
      const profile = JSON.parse(localStorage.getItem(KEY_PROFILE) || 'null')
      const visionItems = JSON.parse(localStorage.getItem(KEY_VISION) || '[]')
      const streak = calcStreak(logs)
      setData({ logs, dreams, gratitude, manifests, profile, visionItems, streak })
    } catch {}
  }, [])

  if (!data) return <div style={{ padding: '3rem', textAlign: 'center', color: 'rgba(180,160,255,0.4)' }}>Loading...</div>

  const earned = ALL_BADGES.filter(b => b.check(data))
  const filtered = ALL_BADGES.filter(b => filter === 'All' || b.category === filter).filter(b => showLocked || b.check(data))

  return (
    <div style={{ maxWidth: '560px', margin: '0 auto', padding: '1.5rem 1rem 2rem' }}>
      <div style={{ marginBottom: '1.25rem' }}>
        <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.8rem', color: 'rgba(220,200,255,0.95)', margin: '0 0 0.25rem', fontWeight: 400 }}>Achievements</h1>
        <p style={{ color: 'rgba(180,160,255,0.5)', fontSize: '0.8rem', margin: 0 }}>{earned.length} of {ALL_BADGES.length} badges earned</p>
      </div>

      {/* Progress bar */}
      <div style={{ background: 'rgba(8,6,28,0.88)', border: '1px solid rgba(200,180,255,0.1)', borderRadius: '1rem', padding: '1rem', marginBottom: '1rem', backdropFilter: 'blur(12px)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
          <span style={{ color: 'rgba(200,180,255,0.6)', fontSize: '0.8rem' }}>Overall Progress</span>
          <span style={{ color: '#a78bfa', fontSize: '0.8rem', fontWeight: 600 }}>{Math.round(earned.length/ALL_BADGES.length*100)}%</span>
        </div>
        <div style={{ height: '6px', background: 'rgba(200,180,255,0.08)', borderRadius: '9999px', overflow: 'hidden' }}>
          <div style={{ height: '100%', width: (earned.length/ALL_BADGES.length*100)+'%', background: 'linear-gradient(90deg, #a78bfa, #c9a84c)', borderRadius: '9999px', transition: 'width 0.5s ease' }} />
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem', flexWrap: 'wrap' }}>
          {earned.slice(-5).map(b => <span key={b.id} style={{ fontSize: '1.2rem' }} title={b.name}>{b.emoji}</span>)}
          {earned.length > 5 && <span style={{ color: 'rgba(180,160,255,0.4)', fontSize: '0.75rem', alignSelf: 'center' }}>+{earned.length-5} more</span>}
        </div>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '0.35rem', marginBottom: '0.875rem', overflowX: 'auto', paddingBottom: '0.25rem' }}>
        {CATEGORIES.map(c => (
          <button key={c} onClick={() => setFilter(c)} style={{ padding: '0.3rem 0.75rem', borderRadius: '9999px', border: filter === c ? '1px solid rgba(167,139,250,0.5)' : '1px solid rgba(200,180,255,0.1)', background: filter === c ? 'rgba(167,139,250,0.15)' : 'transparent', color: filter === c ? '#a78bfa' : 'rgba(180,160,255,0.4)', fontSize: '0.72rem', cursor: 'pointer', whiteSpace: 'nowrap' }}>{c}</button>
        ))}
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '0.875rem' }}>
        <button onClick={() => setShowLocked(s => !s)} style={{ background: 'none', border: 'none', color: 'rgba(180,160,255,0.4)', fontSize: '0.75rem', cursor: 'pointer' }}>{showLocked ? '🔒 Hide locked' : '🔓 Show locked'}</button>
      </div>

      {/* Badge grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: '0.625rem' }}>
        {filtered.map(badge => {
          const unlocked = badge.check(data)
          const prog = badge.progress?.(data)
          return (
            <div key={badge.id} style={{ background: unlocked ? 'rgba(8,6,28,0.92)' : 'rgba(8,6,28,0.6)', border: unlocked ? '1px solid ' + badge.color + '30' : '1px solid rgba(200,180,255,0.06)', borderRadius: '1rem', padding: '1rem', backdropFilter: 'blur(12px)', opacity: unlocked ? 1 : 0.55, transition: 'all 0.2s' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem', filter: unlocked ? 'none' : 'grayscale(1)' }}>{badge.emoji}</div>
              <div style={{ color: unlocked ? 'rgba(220,200,255,0.9)' : 'rgba(180,160,255,0.4)', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.2rem' }}>{badge.name}</div>
              <div style={{ color: 'rgba(180,160,255,0.4)', fontSize: '0.72rem', lineHeight: 1.4, marginBottom: prog && !unlocked ? '0.5rem' : 0 }}>{badge.description}</div>
              {prog && !unlocked && (
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.2rem' }}>
                    <span style={{ color: badge.color, fontSize: '0.65rem' }}>{prog.current}/{prog.total}</span>
                  </div>
                  <div style={{ height: '3px', background: 'rgba(200,180,255,0.08)', borderRadius: '9999px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: (prog.current/prog.total*100)+'%', background: badge.color, opacity: 0.6, borderRadius: '9999px' }} />
                  </div>
                </div>
              )}
              {unlocked && <div style={{ color: badge.color, fontSize: '0.65rem', marginTop: '0.3rem' }}>✓ Earned</div>}
            </div>
          )
        })}
      </div>
    </div>
  )
}
