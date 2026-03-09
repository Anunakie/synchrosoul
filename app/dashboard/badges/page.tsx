'use client'
import { useState, useEffect } from 'react'

const LOGS_KEY = 'synchrosoul_logs'
const DREAMS_KEY = 'synchrosoul_dreams'
const GRATITUDE_KEY = 'synchrosoul_gratitude'
const MANIFEST_KEY = 'synchrosoul_manifestations_v2'
const VISION_KEY = 'synchrosoul_vision_board_v2'

interface Badge {
  id: string
  name: string
  description: string
  emoji: string
  color: string
  rarity: 'common' | 'rare' | 'epic' | 'legendary'
  check: (data: AppData) => boolean
  hint: string
}

interface AppData {
  logs: any[]
  dreams: any[]
  gratitude: any[]
  manifestations: any[]
  visions: any[]
  profile: any
}

const RARITY_COLORS = {
  common: { bg: 'rgba(148,163,184,0.12)', border: 'rgba(148,163,184,0.3)', text: '#94a3b8', label: 'Common' },
  rare: { bg: 'rgba(96,165,250,0.12)', border: 'rgba(96,165,250,0.3)', text: '#60a5fa', label: 'Rare' },
  epic: { bg: 'rgba(167,139,250,0.15)', border: 'rgba(167,139,250,0.4)', text: '#a78bfa', label: 'Epic' },
  legendary: { bg: 'rgba(201,168,76,0.15)', border: 'rgba(201,168,76,0.4)', text: '#c9a84c', label: 'Legendary' },
}

const BADGES: Badge[] = [
  { id: 'first_log', name: 'First Sighting', description: 'Log your first angel number', emoji: '👀', color: '#60a5fa', rarity: 'common', hint: 'Log any angel number', check: d => d.logs.length >= 1 },
  { id: 'log_5', name: 'Number Seeker', description: 'Log 5 angel numbers', emoji: '🔍', color: '#60a5fa', rarity: 'common', hint: 'Log 5 angel numbers', check: d => d.logs.length >= 5 },
  { id: 'log_11', name: 'Awakening', description: 'Log 11 angel numbers', emoji: '✨', color: '#a78bfa', rarity: 'rare', hint: 'Log 11 angel numbers', check: d => d.logs.length >= 11 },
  { id: 'log_33', name: 'Master Number', description: 'Log 33 angel numbers', emoji: '🌟', color: '#c9a84c', rarity: 'epic', hint: 'Log 33 angel numbers', check: d => d.logs.length >= 33 },
  { id: 'log_111', name: 'Cosmic Witness', description: 'Log 111 angel numbers', emoji: '🌌', color: '#c9a84c', rarity: 'legendary', hint: 'Log 111 angel numbers', check: d => d.logs.length >= 111 },
  { id: 'triple_1111', name: '1111 Portal', description: 'Log 1111 three times', emoji: '🚪', color: '#e879f9', rarity: 'rare', hint: 'Log 1111 at least 3 times', check: d => d.logs.filter((l: any) => l.number === '1111').length >= 3 },
  { id: 'triple_777', name: 'Lucky Streak', description: 'Log 777 three times', emoji: '🍀', color: '#34d399', rarity: 'rare', hint: 'Log 777 at least 3 times', check: d => d.logs.filter((l: any) => l.number === '777').length >= 3 },
  { id: 'five_unique', name: 'Frequency Tuner', description: 'Log 5 different angel numbers', emoji: '🎵', color: '#60a5fa', rarity: 'common', hint: 'Log 5 unique numbers', check: d => new Set(d.logs.map((l: any) => l.number)).size >= 5 },
  { id: 'ten_unique', name: 'Number Mystic', description: 'Log 10 different angel numbers', emoji: '🔮', color: '#a78bfa', rarity: 'rare', hint: 'Log 10 unique numbers', check: d => new Set(d.logs.map((l: any) => l.number)).size >= 10 },
  { id: 'with_thought', name: 'Thought Anchor', description: 'Log a number with a thought', emoji: '💭', color: '#a78bfa', rarity: 'common', hint: 'Add a thought to any log', check: d => d.logs.some((l: any) => l.thought && l.thought.trim()) },
  { id: 'truth_score', name: 'Angel Approved', description: 'Upload a screenshot proof', emoji: '📸', color: '#34d399', rarity: 'rare', hint: 'Upload a screenshot with any log', check: d => d.logs.some((l: any) => l.screenshot) },
  { id: 'first_dream', name: 'Dream Walker', description: 'Record your first dream', emoji: '🌙', color: '#a78bfa', rarity: 'common', hint: 'Add a dream in the Dreams section', check: d => d.dreams.length >= 1 },
  { id: 'dreams_7', name: 'Lucid Dreamer', description: 'Record 7 dreams', emoji: '🛸', color: '#e879f9', rarity: 'rare', hint: 'Record 7 dreams', check: d => d.dreams.length >= 7 },
  { id: 'first_gratitude', name: 'Grateful Heart', description: 'Write your first gratitude entry', emoji: '💛', color: '#f59e0b', rarity: 'common', hint: 'Add a gratitude entry', check: d => d.gratitude.length >= 1 },
  { id: 'gratitude_7', name: 'Gratitude Streak', description: 'Write 7 gratitude entries', emoji: '🌸', color: '#f472b6', rarity: 'rare', hint: 'Write 7 gratitude entries', check: d => d.gratitude.length >= 7 },
  { id: 'first_manifest', name: 'Seed Planter', description: 'Create your first manifestation', emoji: '🌱', color: '#34d399', rarity: 'common', hint: 'Add a manifestation', check: d => d.manifestations.length >= 1 },
  { id: 'manifest_done', name: 'Reality Bender', description: 'Mark a manifestation as achieved', emoji: '💫', color: '#c9a84c', rarity: 'epic', hint: 'Mark any manifestation as Manifested', check: d => d.manifestations.some((m: any) => m.status === 'manifested') },
  { id: 'vision_5', name: 'Vision Holder', description: 'Add 5 items to your vision board', emoji: '🎨', color: '#f472b6', rarity: 'rare', hint: 'Add 5 vision board items', check: d => d.visions.length >= 5 },
  { id: 'numerology', name: 'Soul Blueprint', description: 'Complete your numerology profile', emoji: '🧠', color: '#a78bfa', rarity: 'epic', hint: 'Enter birthdate on signup or profile', check: d => !!d.profile?.lifePathNumber },
  { id: 'all_common', name: 'Awakened One', description: 'Unlock all common badges', emoji: '🌞', color: '#c9a84c', rarity: 'legendary', hint: 'Unlock every common badge first', check: d => BADGES.filter(b => b.rarity === 'common' && b.id !== 'all_common').every(b => b.check(d)) },
]

export default function BadgesPage() {
  const [data, setData] = useState<AppData>({ logs: [], dreams: [], gratitude: [], manifestations: [], visions: [], profile: null })
  const [filter, setFilter] = useState<'all' | 'unlocked' | 'locked'>('all')

  useEffect(() => {
    const logs = JSON.parse(localStorage.getItem(LOGS_KEY) || '[]')
    const dreams = JSON.parse(localStorage.getItem(DREAMS_KEY) || '[]')
    const gratitude = JSON.parse(localStorage.getItem(GRATITUDE_KEY) || '[]')
    const manifestations = JSON.parse(localStorage.getItem(MANIFEST_KEY) || '[]')
    const visions = JSON.parse(localStorage.getItem(VISION_KEY) || '[]')
    const profile = JSON.parse(localStorage.getItem('synchrosoul_profile') || 'null')
    setData({ logs, dreams, gratitude, manifestations, visions, profile })
  }, [])

  const results = BADGES.map(b => ({ ...b, unlocked: b.check(data) }))
  const unlocked = results.filter(b => b.unlocked).length
  const filtered = filter === 'all' ? results : filter === 'unlocked' ? results.filter(b => b.unlocked) : results.filter(b => !b.unlocked)

  const card = { background: 'rgba(8,6,28,0.88)', border: '1px solid rgba(200,180,255,0.12)', borderRadius: '1.25rem', backdropFilter: 'blur(12px)' } as React.CSSProperties

  return (
    <div style={{ maxWidth: '680px', margin: '0 auto', padding: '1.5rem 1rem 2rem' }}>
      <div style={{ marginBottom: '1.25rem' }}>
        <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.8rem', color: 'rgba(220,200,255,0.95)', margin: '0 0 0.25rem', fontWeight: 400 }}>Cosmic Badges</h1>
        <p style={{ color: 'rgba(180,160,255,0.5)', fontSize: '0.8rem', margin: 0 }}>{unlocked} of {BADGES.length} badges unlocked</p>
      </div>

      {/* Progress */}
      <div style={{ ...card, padding: '1rem 1.25rem', marginBottom: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
          <span style={{ color: 'rgba(180,160,255,0.5)', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Overall Progress</span>
          <span style={{ color: '#c9a84c', fontSize: '0.78rem', fontWeight: 600 }}>{Math.round((unlocked / BADGES.length) * 100)}%</span>
        </div>
        <div style={{ height: '6px', borderRadius: '3px', background: 'rgba(255,255,255,0.05)' }}>
          <div style={{ height: '100%', width: `${(unlocked / BADGES.length) * 100}%`, background: 'linear-gradient(90deg, #7c3aed, #c9a84c)', borderRadius: '3px', transition: 'width 0.5s' }} />
        </div>
        <div style={{ display: 'flex', gap: '1rem', marginTop: '0.75rem' }}>
          {(['common','rare','epic','legendary'] as const).map(r => {
            const total = results.filter(b => b.rarity === r).length
            const got = results.filter(b => b.rarity === r && b.unlocked).length
            const rc = RARITY_COLORS[r]
            return (
              <div key={r} style={{ flex: 1, textAlign: 'center' }}>
                <div style={{ color: rc.text, fontSize: '0.85rem', fontWeight: 700 }}>{got}/{total}</div>
                <div style={{ color: 'rgba(180,160,255,0.35)', fontSize: '0.58rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{rc.label}</div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Filter */}
      <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '1rem' }}>
        {(['all','unlocked','locked'] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{ padding: '0.35rem 0.875rem', borderRadius: '2rem', border: filter === f ? '1px solid rgba(167,139,250,0.5)' : '1px solid rgba(200,180,255,0.1)', background: filter === f ? 'rgba(167,139,250,0.15)' : 'rgba(8,6,28,0.7)', color: filter === f ? '#a78bfa' : 'rgba(180,160,255,0.45)', fontSize: '0.72rem', cursor: 'pointer', textTransform: 'capitalize' }}>{f}</button>
        ))}
      </div>

      {/* Badges grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem' }}>
        {filtered.map(badge => {
          const rc = RARITY_COLORS[badge.rarity]
          return (
            <div key={badge.id} style={{ ...card, padding: '1.1rem', borderColor: badge.unlocked ? rc.border : 'rgba(200,180,255,0.08)', background: badge.unlocked ? rc.bg : 'rgba(5,4,18,0.7)', opacity: badge.unlocked ? 1 : 0.55, position: 'relative', overflow: 'hidden' }}>
              {badge.unlocked && (
                <div style={{ position: 'absolute', top: '0.5rem', right: '0.5rem', background: rc.bg, border: `1px solid ${rc.border}`, borderRadius: '2rem', padding: '0.1rem 0.4rem', fontSize: '0.58rem', color: rc.text, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{rc.label}</div>
              )}
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem', filter: badge.unlocked ? 'none' : 'grayscale(1) opacity(0.4)' }}>{badge.emoji}</div>
              <div style={{ color: badge.unlocked ? 'rgba(220,200,255,0.9)' : 'rgba(180,160,255,0.4)', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.25rem' }}>{badge.name}</div>
              <div style={{ color: 'rgba(180,160,255,0.45)', fontSize: '0.72rem', lineHeight: 1.4 }}>{badge.unlocked ? badge.description : `🔒 ${badge.hint}`}</div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
