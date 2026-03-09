'use client'
import { useState, useEffect } from 'react'

const KEY = 'synchrosoul_gratitude'

const PROMPTS = [
  'What made you smile today?',
  'Who showed up for you recently?',
  'What beauty did you notice today?',
  'What challenge taught you something?',
  'What part of your body are you grateful for?',
  'What simple pleasure did you enjoy?',
  'What opportunity are you grateful for?',
  'What angel number appeared and what did it mean?',
  'What feeling are you grateful to have felt?',
  'What is working in your life right now?',
  'What memory fills you with warmth?',
  'What are you grateful to be releasing?',
]

const MOODS = [
  { id: 'blissful', label: 'Blissful', emoji: '🌟' },
  { id: 'peaceful', label: 'Peaceful', emoji: '🕊️' },
  { id: 'hopeful', label: 'Hopeful', emoji: '🌸' },
  { id: 'grateful', label: 'Grateful', emoji: '💛' },
  { id: 'reflective', label: 'Reflective', emoji: '🌙' },
  { id: 'healing', label: 'Healing', emoji: '💚' },
]

interface GratitudeEntry {
  id: number
  items: string[]
  mood: string
  angelNumber: string
  affirmation: string
  createdAt: string
}

export default function GratitudePage() {
  const [entries, setEntries] = useState<GratitudeEntry[]>([])
  const [showAdd, setShowAdd] = useState(false)
  const [items, setItems] = useState(['', '', ''])
  const [mood, setMood] = useState('grateful')
  const [angelNumber, setAngelNumber] = useState('')
  const [affirmation, setAffirmation] = useState('')
  const [prompt, setPrompt] = useState(PROMPTS[0])
  const [expandedId, setExpandedId] = useState<number | null>(null)

  useEffect(() => {
    const s = localStorage.getItem(KEY)
    if (s) setEntries(JSON.parse(s))
    setPrompt(PROMPTS[Math.floor(Math.random() * PROMPTS.length)])
  }, [])

  function save(next: GratitudeEntry[]) {
    setEntries(next)
    localStorage.setItem(KEY, JSON.stringify(next))
  }

  function addEntry() {
    const filled = items.filter(i => i.trim())
    if (filled.length === 0) return
    const entry: GratitudeEntry = {
      id: Date.now(), items: filled, mood, angelNumber,
      affirmation: affirmation || `I am grateful and I attract more to be grateful for.`,
      createdAt: new Date().toISOString(),
    }
    save([entry, ...entries])
    setItems(['', '', '']); setAngelNumber(''); setAffirmation(''); setShowAdd(false)
  }

  function deleteEntry(id: number) {
    save(entries.filter(e => e.id !== id))
  }

  function refreshPrompt() {
    setPrompt(PROMPTS[Math.floor(Math.random() * PROMPTS.length)])
  }

  const streak = (() => {
    if (entries.length === 0) return 0
    let s = 0; const today = new Date(); today.setHours(0,0,0,0)
    const dates = entries.map(e => { const d = new Date(e.createdAt); d.setHours(0,0,0,0); return d.getTime() })
    const unique = [...new Set(dates)].sort((a,b) => b-a)
    for (let i = 0; i < unique.length; i++) {
      const expected = today.getTime() - i * 86400000
      if (unique[i] === expected) s++; else break
    }
    return s
  })()

  const card = { background: 'rgba(8,6,28,0.88)', border: '1px solid rgba(200,180,255,0.12)', borderRadius: '1.25rem', backdropFilter: 'blur(12px)' } as React.CSSProperties
  const input = { width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(200,180,255,0.15)', borderRadius: '0.75rem', padding: '0.65rem 0.875rem', color: 'rgba(220,200,255,0.9)', fontSize: '0.88rem', outline: 'none', boxSizing: 'border-box' as const, marginBottom: '0.5rem' }

  return (
    <div style={{ maxWidth: '680px', margin: '0 auto', padding: '1.5rem 1rem 2rem' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
        <div>
          <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.8rem', color: 'rgba(220,200,255,0.95)', margin: '0 0 0.25rem', fontWeight: 400 }}>Gratitude Journal</h1>
          <p style={{ color: 'rgba(180,160,255,0.5)', fontSize: '0.8rem', margin: 0 }}>{streak > 0 ? `🔥 ${streak}-day streak` : `${entries.length} entries`}</p>
        </div>
        <button onClick={() => setShowAdd(s => !s)} style={{ padding: '0.5rem 1rem', borderRadius: '0.75rem', background: 'linear-gradient(135deg, #f59e0b, #f472b6)', border: 'none', color: 'white', fontSize: '0.8rem', cursor: 'pointer', fontWeight: 600 }}>+ Today</button>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem', marginBottom: '1.25rem' }}>
        {[{ label: 'Entries', value: entries.length, emoji: '📝' }, { label: 'Streak', value: `${streak}d`, emoji: '🔥' }, { label: 'Gratitudes', value: entries.reduce((a,e) => a + e.items.length, 0), emoji: '💛' }].map(s => (
          <div key={s.label} style={{ ...card, padding: '0.875rem', textAlign: 'center' }}>
            <div style={{ fontSize: '1.2rem', marginBottom: '0.2rem' }}>{s.emoji}</div>
            <div style={{ color: 'rgba(220,200,255,0.9)', fontSize: '1.1rem', fontWeight: 700 }}>{s.value}</div>
            <div style={{ color: 'rgba(180,160,255,0.4)', fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Daily prompt */}
      <div style={{ ...card, padding: '1rem 1.25rem', marginBottom: '1.25rem', borderColor: 'rgba(245,158,11,0.2)', background: 'rgba(245,158,11,0.05)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <div style={{ color: 'rgba(245,158,11,0.6)', fontSize: '0.62rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.4rem' }}>Today's Prompt</div>
            <p style={{ color: 'rgba(220,200,255,0.8)', fontSize: '0.88rem', margin: 0, lineHeight: 1.5, fontStyle: 'italic' }}>&ldquo;{prompt}&rdquo;</p>
          </div>
          <button onClick={refreshPrompt} style={{ flexShrink: 0, marginLeft: '0.75rem', padding: '0.3rem 0.5rem', borderRadius: '0.5rem', background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)', color: 'rgba(245,158,11,0.6)', fontSize: '0.75rem', cursor: 'pointer' }}>↻</button>
        </div>
      </div>

      {/* Add form */}
      {showAdd && (
        <div style={{ ...card, padding: '1.25rem', marginBottom: '1.25rem' }}>
          <div style={{ color: 'rgba(180,160,255,0.4)', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.875rem' }}>Today I am grateful for...</div>
          {items.map((item, i) => (
            <input key={i} value={item} onChange={e => { const n = [...items]; n[i] = e.target.value; setItems(n) }} placeholder={`Gratitude ${i + 1}...`} style={input} />
          ))}
          <button onClick={() => setItems(i => [...i, ''])} style={{ padding: '0.35rem 0.75rem', borderRadius: '0.5rem', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(200,180,255,0.12)', color: 'rgba(180,160,255,0.5)', fontSize: '0.75rem', cursor: 'pointer', marginBottom: '0.875rem' }}>+ Add more</button>

          <div style={{ color: 'rgba(180,160,255,0.4)', fontSize: '0.62rem', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.5rem' }}>How are you feeling?</div>
          <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '0.875rem' }}>
            {MOODS.map(m => (
              <button key={m.id} onClick={() => setMood(m.id)} style={{ padding: '0.3rem 0.65rem', borderRadius: '2rem', border: mood === m.id ? '1px solid rgba(245,158,11,0.5)' : '1px solid rgba(200,180,255,0.1)', background: mood === m.id ? 'rgba(245,158,11,0.12)' : 'rgba(255,255,255,0.03)', color: mood === m.id ? '#f59e0b' : 'rgba(180,160,255,0.45)', fontSize: '0.72rem', cursor: 'pointer' }}>{m.emoji} {m.label}</button>
            ))}
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <input value={angelNumber} onChange={e => setAngelNumber(e.target.value)} placeholder="Angel # seen today" style={{ ...input, margin: 0 }} />
            <input value={affirmation} onChange={e => setAffirmation(e.target.value)} placeholder="Today's affirmation" style={{ ...input, margin: 0 }} />
          </div>

          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.75rem' }}>
            <button onClick={addEntry} style={{ flex: 1, padding: '0.65rem', borderRadius: '0.75rem', background: 'linear-gradient(135deg, #f59e0b, #f472b6)', border: 'none', color: 'white', fontSize: '0.85rem', cursor: 'pointer', fontWeight: 600 }}>Save Entry 💛</button>
            <button onClick={() => setShowAdd(false)} style={{ padding: '0.65rem 1rem', borderRadius: '0.75rem', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(200,180,255,0.12)', color: 'rgba(180,160,255,0.5)', fontSize: '0.85rem', cursor: 'pointer' }}>Cancel</button>
          </div>
        </div>
      )}

      {/* Entries */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {entries.length === 0 && (
          <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>💛</div>
            <p style={{ color: 'rgba(180,160,255,0.4)', fontSize: '0.88rem' }}>Begin your gratitude practice above.</p>
          </div>
        )}
        {entries.map(entry => {
          const moodObj = MOODS.find(m => m.id === entry.mood)
          const isOpen = expandedId === entry.id
          const date = new Date(entry.createdAt)
          return (
            <div key={entry.id} style={{ ...card }}>
              <div onClick={() => setExpandedId(isOpen ? null : entry.id)} style={{ padding: '1rem 1.25rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{ fontSize: '1.4rem' }}>{moodObj?.emoji || '💛'}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ color: 'rgba(220,200,255,0.85)', fontSize: '0.85rem', marginBottom: '0.2rem' }}>{entry.items[0]}{entry.items.length > 1 ? ` +${entry.items.length - 1} more` : ''}</div>
                  <div style={{ color: 'rgba(180,160,255,0.4)', fontSize: '0.7rem' }}>{date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })} {entry.angelNumber && `· ${entry.angelNumber}`}</div>
                </div>
                <span style={{ color: 'rgba(180,160,255,0.3)', fontSize: '0.8rem', transform: isOpen ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>⌄</span>
              </div>
              {isOpen && (
                <div style={{ padding: '0 1.25rem 1.25rem', borderTop: '1px solid rgba(200,180,255,0.06)' }}>
                  <div style={{ paddingTop: '0.875rem' }}>
                    {entry.items.map((item, i) => (
                      <div key={i} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.4rem', alignItems: 'flex-start' }}>
                        <span style={{ color: '#f59e0b', fontSize: '0.75rem', marginTop: '0.1rem' }}>✦</span>
                        <span style={{ color: 'rgba(200,180,255,0.75)', fontSize: '0.85rem', lineHeight: 1.5 }}>{item}</span>
                      </div>
                    ))}
                    {entry.affirmation && <p style={{ color: 'rgba(180,160,255,0.5)', fontSize: '0.8rem', fontStyle: 'italic', margin: '0.75rem 0 0' }}>&ldquo;{entry.affirmation}&rdquo;</p>}
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.875rem' }}>
                      <button onClick={() => deleteEntry(entry.id)} style={{ padding: '0.3rem 0.75rem', borderRadius: '0.5rem', background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.15)', color: 'rgba(239,68,68,0.5)', fontSize: '0.72rem', cursor: 'pointer' }}>Delete</button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
