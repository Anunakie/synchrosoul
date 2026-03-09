'use client'
import { useState, useEffect } from 'react'

const KEY = 'synchrosoul_gratitude'

interface GratitudeEntry {
  id: string
  text: string
  category: string
  mood: string
  createdAt: string
}

const CATEGORIES = ['General', 'Relationships', 'Health', 'Abundance', 'Growth', 'Nature', 'Synchronicity']
const MOODS = [
  { emoji: '🌟', label: 'Radiant' },
  { emoji: '😊', label: 'Grateful' },
  { emoji: '🌸', label: 'Peaceful' },
  { emoji: '💫', label: 'Inspired' },
  { emoji: '🌙', label: 'Reflective' },
  { emoji: '🔥', label: 'Energized' },
]

const PROMPTS = [
  'What angel number showed up for you today and what did it confirm?',
  'Name three people whose presence elevates your vibration.',
  'What unexpected blessing arrived this week?',
  'What part of your body are you grateful for today?',
  'What challenge taught you the most this month?',
  'What simple pleasure brought you joy today?',
  'What synchronicity made you feel guided and supported?',
  'What quality in yourself are you most proud of right now?',
  'What abundance (not just money) are you swimming in?',
  'What door closed that you are now grateful for?',
]

export default function GratitudePage() {
  const [entries, setEntries] = useState<GratitudeEntry[]>([])
  const [text, setText] = useState('')
  const [category, setCategory] = useState('General')
  const [mood, setMood] = useState('😊')
  const [showForm, setShowForm] = useState(false)
  const [prompt, setPrompt] = useState('')
  const [filter, setFilter] = useState('All')
  const [search, setSearch] = useState('')

  useEffect(() => {
    try { setEntries(JSON.parse(localStorage.getItem(KEY) || '[]')) } catch {}
    setPrompt(PROMPTS[Math.floor(Math.random() * PROMPTS.length)])
  }, [])

  function save() {
    if (!text.trim()) return
    const entry: GratitudeEntry = {
      id: Date.now().toString(),
      text: text.trim(),
      category,
      mood,
      createdAt: new Date().toISOString(),
    }
    const updated = [entry, ...entries]
    setEntries(updated)
    localStorage.setItem(KEY, JSON.stringify(updated))
    setText('')
    setShowForm(false)
  }

  function remove(id: string) {
    const updated = entries.filter(e => e.id !== id)
    setEntries(updated)
    localStorage.setItem(KEY, JSON.stringify(updated))
  }

  // Streak
  const days = new Set(entries.map(e => new Date(e.createdAt).toDateString()))
  let streak = 0
  const today = new Date()
  for (let i = 0; i < 365; i++) {
    const d = new Date(today); d.setDate(today.getDate() - i)
    if (days.has(d.toDateString())) streak++
    else if (i > 0) break
  }

  const filtered = entries
    .filter(e => filter === 'All' || e.category === filter)
    .filter(e => !search || e.text.toLowerCase().includes(search.toLowerCase()))

  const grouped: Record<string, GratitudeEntry[]> = {}
  filtered.forEach(e => {
    const day = new Date(e.createdAt).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
    if (!grouped[day]) grouped[day] = []
    grouped[day].push(e)
  })

  const card: React.CSSProperties = { background: 'rgba(8,6,28,0.88)', border: '1px solid rgba(200,180,255,0.1)', borderRadius: '1.25rem', backdropFilter: 'blur(12px)', padding: '1.25rem', marginBottom: '0.875rem' }

  return (
    <div style={{ maxWidth: '560px', margin: '0 auto', padding: '1.5rem 1rem 2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
        <div>
          <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.8rem', color: 'rgba(220,200,255,0.95)', margin: '0 0 0.25rem', fontWeight: 400 }}>Gratitude</h1>
          <p style={{ color: 'rgba(180,160,255,0.5)', fontSize: '0.8rem', margin: 0 }}>{entries.length} entries · {streak} day streak 🔥</p>
        </div>
        <button onClick={() => setShowForm(s => !s)} style={{ background: showForm ? 'rgba(201,168,76,0.2)' : 'rgba(167,139,250,0.15)', border: showForm ? '1px solid rgba(201,168,76,0.4)' : '1px solid rgba(167,139,250,0.3)', borderRadius: '9999px', padding: '0.5rem 1.1rem', color: showForm ? '#c9a84c' : '#a78bfa', fontSize: '0.8rem', cursor: 'pointer' }}>
          {showForm ? '✕ Cancel' : '+ Add'}
        </button>
      </div>

      {/* Add form */}
      {showForm && (
        <div style={{ ...card, borderColor: 'rgba(201,168,76,0.2)', marginBottom: '1.25rem' }}>
          <div style={{ color: 'rgba(201,168,76,0.6)', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.75rem' }}>Today I am grateful for...</div>
          {/* Prompt */}
          <div style={{ background: 'rgba(201,168,76,0.05)', border: '1px solid rgba(201,168,76,0.1)', borderRadius: '0.75rem', padding: '0.75rem', marginBottom: '0.875rem', cursor: 'pointer' }} onClick={() => setText(prompt)}>
            <div style={{ color: 'rgba(201,168,76,0.4)', fontSize: '0.65rem', marginBottom: '0.25rem' }}>✦ Tap to use prompt</div>
            <div style={{ color: 'rgba(200,180,255,0.55)', fontSize: '0.8rem', fontStyle: 'italic' }}>{prompt}</div>
          </div>
          <textarea
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder='Write what you are grateful for...'
            style={{ width: '100%', minHeight: '100px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(200,180,255,0.12)', borderRadius: '0.75rem', padding: '0.75rem', color: 'rgba(220,200,255,0.85)', fontSize: '0.9rem', resize: 'vertical', fontFamily: 'inherit', boxSizing: 'border-box', outline: 'none' }}
          />
          {/* Mood */}
          <div style={{ display: 'flex', gap: '0.4rem', margin: '0.75rem 0', flexWrap: 'wrap' }}>
            {MOODS.map(m => (
              <button key={m.emoji} onClick={() => setMood(m.emoji)} style={{ padding: '0.3rem 0.6rem', borderRadius: '9999px', border: mood === m.emoji ? '1px solid rgba(201,168,76,0.5)' : '1px solid rgba(200,180,255,0.1)', background: mood === m.emoji ? 'rgba(201,168,76,0.12)' : 'transparent', cursor: 'pointer', fontSize: '0.85rem' }}>
                {m.emoji}
              </button>
            ))}
          </div>
          {/* Category */}
          <div style={{ display: 'flex', gap: '0.35rem', marginBottom: '0.875rem', flexWrap: 'wrap' }}>
            {CATEGORIES.map(c => (
              <button key={c} onClick={() => setCategory(c)} style={{ padding: '0.25rem 0.65rem', borderRadius: '9999px', border: category === c ? '1px solid rgba(167,139,250,0.5)' : '1px solid rgba(200,180,255,0.1)', background: category === c ? 'rgba(167,139,250,0.15)' : 'transparent', color: category === c ? '#a78bfa' : 'rgba(180,160,255,0.4)', fontSize: '0.72rem', cursor: 'pointer' }}>{c}</button>
            ))}
          </div>
          <button onClick={save} style={{ width: '100%', padding: '0.75rem', background: 'linear-gradient(135deg, rgba(201,168,76,0.2), rgba(167,139,250,0.2))', border: '1px solid rgba(201,168,76,0.3)', borderRadius: '0.875rem', color: '#c9a84c', fontSize: '0.9rem', cursor: 'pointer', fontFamily: 'inherit' }}>Save Gratitude ✦</button>
        </div>
      )}

      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '0.5rem', marginBottom: '1rem' }}>
        {[
          { label: 'Total', value: entries.length, color: '#a78bfa' },
          { label: 'Streak', value: streak + '🔥', color: '#fb923c' },
          { label: 'This Week', value: entries.filter(e => new Date(e.createdAt) >= (() => { const d = new Date(); d.setDate(d.getDate()-7); return d })()).length, color: '#c9a84c' },
        ].map(s => (
          <div key={s.label} style={{ background: 'rgba(8,6,28,0.88)', border: '1px solid rgba(200,180,255,0.08)', borderRadius: '0.875rem', padding: '0.75rem', textAlign: 'center' }}>
            <div style={{ color: s.color, fontSize: '1.3rem', fontWeight: 700 }}>{s.value}</div>
            <div style={{ color: 'rgba(180,160,255,0.35)', fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Search + filter */}
      <input value={search} onChange={e => setSearch(e.target.value)} placeholder='Search entries...' style={{ width: '100%', background: 'rgba(8,6,28,0.7)', border: '1px solid rgba(200,180,255,0.1)', borderRadius: '0.75rem', padding: '0.6rem 0.875rem', color: 'rgba(220,200,255,0.8)', fontSize: '0.85rem', marginBottom: '0.625rem', boxSizing: 'border-box', outline: 'none', fontFamily: 'inherit' }} />
      <div style={{ display: 'flex', gap: '0.35rem', marginBottom: '1rem', overflowX: 'auto', paddingBottom: '0.25rem' }}>
        {['All', ...CATEGORIES].map(c => (
          <button key={c} onClick={() => setFilter(c)} style={{ padding: '0.25rem 0.65rem', borderRadius: '9999px', border: filter === c ? '1px solid rgba(167,139,250,0.5)' : '1px solid rgba(200,180,255,0.1)', background: filter === c ? 'rgba(167,139,250,0.15)' : 'transparent', color: filter === c ? '#a78bfa' : 'rgba(180,160,255,0.4)', fontSize: '0.72rem', cursor: 'pointer', whiteSpace: 'nowrap' }}>{c}</button>
        ))}
      </div>

      {/* Entries */}
      {Object.entries(grouped).map(([day, dayEntries]) => (
        <div key={day}>
          <div style={{ color: 'rgba(180,160,255,0.3)', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem', paddingLeft: '0.25rem' }}>{day}</div>
          {dayEntries.map(entry => (
            <div key={entry.id} style={{ ...card, padding: '1rem', marginBottom: '0.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center', marginBottom: '0.4rem' }}>
                    <span style={{ fontSize: '1rem' }}>{entry.mood}</span>
                    <span style={{ background: 'rgba(167,139,250,0.1)', border: '1px solid rgba(167,139,250,0.15)', borderRadius: '9999px', padding: '0.1rem 0.5rem', color: 'rgba(167,139,250,0.6)', fontSize: '0.65rem' }}>{entry.category}</span>
                  </div>
                  <p style={{ color: 'rgba(200,180,255,0.75)', fontSize: '0.88rem', lineHeight: 1.6, margin: 0 }}>{entry.text}</p>
                </div>
                <button onClick={() => remove(entry.id)} style={{ background: 'none', border: 'none', color: 'rgba(200,180,255,0.2)', cursor: 'pointer', fontSize: '0.8rem', flexShrink: 0, padding: '0.2rem' }}>✕</button>
              </div>
            </div>
          ))}
        </div>
      ))}

      {entries.length === 0 && (
        <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.875rem' }}>💛</div>
          <p style={{ color: 'rgba(180,160,255,0.4)', fontSize: '0.85rem' }}>Begin your gratitude practice. Even one entry shifts your vibration.</p>
        </div>
      )}
    </div>
  )
}
