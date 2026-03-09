'use client'
import { useState, useEffect } from 'react'

interface GratitudeEntry {
  id: string
  items: string[]
  intention: string
  mood: string
  createdAt: string
}

const MOODS = [
  { emoji: '🌟', label: 'Radiant', color: '#fbbf24' },
  { emoji: '💫', label: 'Peaceful', color: '#a78bfa' },
  { emoji: '🌸', label: 'Hopeful', color: '#f472b6' },
  { emoji: '🌿', label: 'Grounded', color: '#34d399' },
  { emoji: '🔥', label: 'Energized', color: '#fb923c' },
  { emoji: '🌊', label: 'Flowing', color: '#60a5fa' },
]

const PROMPTS = [
  'What made you smile today?',
  'Who in your life are you grateful for right now?',
  'What angel number appeared today and what did it mean to you?',
  'What is your body doing well that you take for granted?',
  'What challenge are you secretly grateful for?',
  'What beauty did you notice in the world today?',
  'What opportunity is available to you right now?',
  'What have you learned recently that you are grateful for?',
]

const STORAGE_KEY = 'synchrosoul_gratitude'

function load(): GratitudeEntry[] {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]') } catch { return [] }
}
function save(items: GratitudeEntry[]) { localStorage.setItem(STORAGE_KEY, JSON.stringify(items)) }

export default function GratitudePage() {
  const [entries, setEntries] = useState<GratitudeEntry[]>([])
  const [showForm, setShowForm] = useState(false)
  const [items, setItems] = useState(['', '', ''])
  const [intention, setIntention] = useState('')
  const [mood, setMood] = useState('Radiant')
  const [prompt] = useState(() => PROMPTS[Math.floor(Math.random() * PROMPTS.length)])
  const [streak, setStreak] = useState(0)

  useEffect(() => {
    const loaded = load()
    setEntries(loaded)
    // Calculate streak
    if (loaded.length === 0) return
    let s = 1
    const today = new Date().toDateString()
    const dates = loaded.map(e => new Date(e.createdAt).toDateString())
    if (!dates.includes(today)) { setStreak(0); return }
    for (let i = 1; i < 30; i++) {
      const d = new Date()
      d.setDate(d.getDate() - i)
      if (dates.includes(d.toDateString())) s++
      else break
    }
    setStreak(s)
  }, [])

  function addEntry() {
    const filled = items.filter(i => i.trim())
    if (filled.length === 0) return
    const entry: GratitudeEntry = {
      id: Date.now().toString(),
      items: filled,
      intention: intention.trim(),
      mood,
      createdAt: new Date().toISOString(),
    }
    const updated = [entry, ...entries]
    setEntries(updated); save(updated)
    setItems(['', '', '']); setIntention(''); setShowForm(false)
  }

  const todayEntry = entries.find(e => new Date(e.createdAt).toDateString() === new Date().toDateString())
  const card = { background: 'rgba(8,6,28,0.88)', border: '1px solid rgba(200,180,255,0.12)', borderRadius: '1.25rem', backdropFilter: 'blur(12px)' } as React.CSSProperties
  const inp = { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(200,180,255,0.15)', borderRadius: '0.6rem', color: 'rgba(220,200,255,0.9)', padding: '0.65rem 0.85rem', fontSize: '0.85rem', width: '100%', outline: 'none', boxSizing: 'border-box' as const, fontFamily: 'inherit' }

  return (
    <div style={{ maxWidth: '640px', margin: '0 auto', padding: '1.5rem 1rem 2rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.8rem', color: 'rgba(220,200,255,0.95)', margin: '0 0 0.25rem', fontWeight: 400 }}>Gratitude</h1>
          <p style={{ color: 'rgba(180,160,255,0.5)', fontSize: '0.8rem', margin: 0 }}>
            {streak > 0 ? `🔥 ${streak} day streak` : 'Begin your gratitude practice'}
          </p>
        </div>
        {!todayEntry && (
          <button onClick={() => setShowForm(s => !s)} style={{ padding: '0.6rem 1.25rem', borderRadius: '2rem', cursor: 'pointer', background: 'rgba(251,191,36,0.15)', border: '1px solid rgba(251,191,36,0.4)', color: '#fbbf24', fontSize: '0.82rem', fontFamily: 'inherit', fontWeight: 600, flexShrink: 0 }}>+ Today</button>
        )}
      </div>

      {/* Today done banner */}
      {todayEntry && !showForm && (
        <div style={{ ...card, padding: '1.25rem', marginBottom: '1.25rem', border: '1px solid rgba(251,191,36,0.25)', background: 'rgba(251,191,36,0.06)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{ fontSize: '1.5rem' }}>✨</span>
            <div>
              <div style={{ color: '#fbbf24', fontSize: '0.88rem', fontWeight: 600 }}>Today complete</div>
              <div style={{ color: 'rgba(180,160,255,0.5)', fontSize: '0.75rem' }}>You logged {todayEntry.items.length} gratitudes</div>
            </div>
          </div>
        </div>
      )}

      {/* Daily prompt */}
      {!todayEntry && !showForm && (
        <div style={{ ...card, padding: '1.25rem', marginBottom: '1.25rem', border: '1px solid rgba(251,191,36,0.15)' }}>
          <div style={{ color: 'rgba(180,160,255,0.4)', fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>Today’s Prompt</div>
          <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.05rem', color: 'rgba(220,200,255,0.85)', fontStyle: 'italic', lineHeight: 1.6 }}>{prompt}</div>
        </div>
      )}

      {/* Form */}
      {showForm && (
        <div style={{ ...card, padding: '1.5rem', marginBottom: '1.25rem', border: '1px solid rgba(251,191,36,0.2)' }}>
          <div style={{ color: 'rgba(180,160,255,0.4)', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1rem' }}>3 Things I Am Grateful For</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginBottom: '1rem' }}>
            {items.map((item, i) => (
              <input key={i} style={inp} placeholder={`Gratitude ${i + 1}...`} value={item} onChange={e => { const n = [...items]; n[i] = e.target.value; setItems(n) }} />
            ))}
          </div>
          <div style={{ color: 'rgba(180,160,255,0.4)', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>Intention for Today</div>
          <input style={{ ...inp, marginBottom: '1rem' }} placeholder="Today I intend to..." value={intention} onChange={e => setIntention(e.target.value)} />
          <div style={{ color: 'rgba(180,160,255,0.4)', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>Mood</div>
          <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
            {MOODS.map(m => (
              <button key={m.label} onClick={() => setMood(m.label)} style={{ padding: '0.3rem 0.65rem', borderRadius: '2rem', cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.75rem', background: mood === m.label ? `${m.color}20` : 'rgba(255,255,255,0.04)', border: mood === m.label ? `1px solid ${m.color}55` : '1px solid rgba(200,180,255,0.1)', color: mood === m.label ? m.color : 'rgba(180,160,255,0.5)', transition: 'all 0.15s' }}>{m.emoji} {m.label}</button>
            ))}
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button onClick={addEntry} style={{ flex: 1, padding: '0.75rem', borderRadius: '0.6rem', cursor: 'pointer', background: 'rgba(251,191,36,0.15)', border: '1px solid rgba(251,191,36,0.4)', color: '#fbbf24', fontSize: '0.88rem', fontFamily: 'inherit', fontWeight: 600 }}>✨ Save Gratitude</button>
            <button onClick={() => setShowForm(false)} style={{ padding: '0.75rem 1rem', borderRadius: '0.6rem', cursor: 'pointer', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(200,180,255,0.1)', color: 'rgba(180,160,255,0.5)', fontSize: '0.88rem', fontFamily: 'inherit' }}>Cancel</button>
          </div>
        </div>
      )}

      {/* Stats */}
      {entries.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '0.6rem', marginBottom: '1.25rem' }}>
          {[
            { label: 'Total Entries', value: entries.length, color: '#fbbf24' },
            { label: 'Day Streak', value: streak, color: '#a78bfa' },
            { label: 'This Week', value: entries.filter(e => (Date.now() - new Date(e.createdAt).getTime()) < 7 * 86400000).length, color: '#34d399' },
          ].map(s => (
            <div key={s.label} style={{ ...card, padding: '0.85rem', textAlign: 'center' }}>
              <div style={{ color: s.color, fontSize: '1.4rem', fontWeight: 700, fontFamily: 'Cormorant Garamond, serif' }}>{s.value}</div>
              <div style={{ color: 'rgba(180,160,255,0.45)', fontSize: '0.62rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{s.label}</div>
            </div>
          ))}
        </div>
      )}

      {/* Entries */}
      {entries.length === 0 ? (
        <div style={{ ...card, padding: '3rem', textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>🌟</div>
          <div style={{ color: 'rgba(180,160,255,0.5)', fontSize: '0.88rem' }}>No entries yet.</div>
          <div style={{ color: 'rgba(180,160,255,0.35)', fontSize: '0.78rem', marginTop: '0.25rem' }}>Start your gratitude practice today.</div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {entries.map(entry => {
            const moodCfg = MOODS.find(m => m.label === entry.mood) || MOODS[0]
            return (
              <div key={entry.id} style={{ ...card, padding: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontSize: '1.1rem' }}>{moodCfg.emoji}</span>
                    <span style={{ color: moodCfg.color, fontSize: '0.75rem' }}>{entry.mood}</span>
                  </div>
                  <span style={{ color: 'rgba(180,160,255,0.35)', fontSize: '0.7rem' }}>{new Date(entry.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', marginBottom: entry.intention ? '0.75rem' : 0 }}>
                  {entry.items.map((item, i) => (
                    <div key={i} style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                      <span style={{ color: '#fbbf24', fontSize: '0.65rem', marginTop: '0.25rem', flexShrink: 0 }}>✦</span>
                      <span style={{ color: 'rgba(200,180,255,0.8)', fontSize: '0.82rem', lineHeight: 1.5 }}>{item}</span>
                    </div>
                  ))}
                </div>
                {entry.intention && (
                  <div style={{ padding: '0.5rem 0.75rem', borderRadius: '0.5rem', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(200,180,255,0.07)', marginTop: '0.5rem' }}>
                    <span style={{ color: 'rgba(180,160,255,0.4)', fontSize: '0.65rem' }}>Intention: </span>
                    <span style={{ color: 'rgba(180,160,255,0.65)', fontSize: '0.78rem', fontStyle: 'italic' }}>{entry.intention}</span>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
