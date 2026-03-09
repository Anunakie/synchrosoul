'use client'
import { useState, useEffect } from 'react'

const GKEY = 'synchrosoul_gratitude'
const STREAK_KEY = 'synchrosoul_gratitude_streak'

interface GEntry {
  id: string
  date: string
  items: string[]
  number: string
  mood: string
  note: string
}

const MOODS = [
  { emoji: '🌟', label: 'Radiant' },
  { emoji: '😊', label: 'Grateful' },
  { emoji: '😌', label: 'Peaceful' },
  { emoji: '🌱', label: 'Growing' },
  { emoji: '💫', label: 'Aligned' },
  { emoji: '🌊', label: 'Flowing' },
]

const PROMPTS = [
  'Something that made you smile today...',
  'A person who showed up for you...',
  'A challenge that taught you something...',
  'A small miracle you witnessed...',
  'Something your body did for you today...',
  'A moment of unexpected beauty...',
  'Something you usually take for granted...',
  'A quality in yourself you appreciate...',
  'An angel number you saw and what it meant...',
  'Something that is getting better in your life...',
]

function load(): GEntry[] {
  if (typeof window === 'undefined') return []
  try { return JSON.parse(localStorage.getItem(GKEY) || '[]') } catch { return [] }
}
function save(items: GEntry[]) { localStorage.setItem(GKEY, JSON.stringify(items)) }
function uid() { return Date.now().toString(36) + Math.random().toString(36).slice(2) }
function todayStr() { return new Date().toDateString() }

function getStreak(entries: GEntry[]): number {
  if (entries.length === 0) return 0
  const dates = [...new Set(entries.map(e => e.date))].sort().reverse()
  let streak = 0
  let check = new Date()
  for (const d of dates) {
    if (new Date(d).toDateString() === check.toDateString()) {
      streak++
      check.setDate(check.getDate() - 1)
    } else break
  }
  return streak
}

export default function GratitudePage() {
  const [entries, setEntries] = useState<GEntry[]>([])
  const [view, setView] = useState<'home'|'write'|'history'>('home')
  const [items, setItems] = useState(['', '', ''])
  const [mood, setMood] = useState('😊')
  const [note, setNote] = useState('')
  const [number, setNumber] = useState('')
  const [saved, setSaved] = useState(false)
  const [promptIdx] = useState(() => Math.floor(Math.random() * PROMPTS.length))
  const card: React.CSSProperties = { background: 'rgba(8,6,28,0.88)', border: '1px solid rgba(200,180,255,0.12)', borderRadius: '1.25rem', backdropFilter: 'blur(12px)' }

  useEffect(() => { setEntries(load()) }, [])

  const todayEntry = entries.find(e => e.date === todayStr())
  const streak = getStreak(entries)

  function submit() {
    const filled = items.filter(i => i.trim())
    if (filled.length === 0) return
    const entry: GEntry = { id: uid(), date: todayStr(), items: filled, number, mood, note }
    const updated = [entry, ...entries.filter(e => e.date !== todayStr())]
    setEntries(updated); save(updated); setSaved(true)
    setTimeout(() => { setSaved(false); setView('home') }, 1800)
  }

  const grouped = entries.reduce((acc, e) => {
    const month = new Date(e.date).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    if (!acc[month]) acc[month] = []
    acc[month].push(e)
    return acc
  }, {} as Record<string, GEntry[]>)

  if (view === 'write') return (
    <div style={{ maxWidth: '520px', margin: '0 auto', padding: '1.5rem 1rem 2rem' }}>
      <button onClick={() => setView('home')} style={{ background: 'none', border: 'none', color: 'rgba(180,160,255,0.5)', cursor: 'pointer', fontSize: '0.8rem', marginBottom: '1rem', padding: 0 }}>← Back</button>
      {saved ? (
        <div style={{ ...card, padding: '3rem', textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: '0.75rem' }}>✨</div>
          <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.5rem', color: 'rgba(220,200,255,0.95)', margin: '0 0 0.5rem', fontWeight: 400 }}>Gratitude Received</h2>
          <p style={{ color: 'rgba(180,160,255,0.5)', fontSize: '0.85rem', margin: 0 }}>The universe heard you. 🙏</p>
        </div>
      ) : (
        <div>
          <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.5rem', color: 'rgba(220,200,255,0.95)', margin: '0 0 0.25rem', fontWeight: 400 }}>Today's Gratitude</h2>
          <p style={{ color: 'rgba(180,160,255,0.4)', fontSize: '0.78rem', margin: '0 0 1.25rem', fontStyle: 'italic' }}>{PROMPTS[promptIdx]}</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem', marginBottom: '1.25rem' }}>
            {items.map((item, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.625rem' }}>
                <span style={{ color: '#c9a84c', fontSize: '0.85rem', fontWeight: 700, minWidth: '1.25rem' }}>{i + 1}.</span>
                <input value={item} onChange={e => setItems(it => it.map((v,j) => j===i ? e.target.value : v))} placeholder={'I am grateful for...'} style={{ flex: 1, background: 'rgba(8,6,28,0.8)', border: '1px solid rgba(200,180,255,0.15)', borderRadius: '0.75rem', padding: '0.75rem', color: 'rgba(220,200,255,0.85)', fontSize: '0.85rem', outline: 'none' }} />
              </div>
            ))}
            <button onClick={() => setItems(i => [...i, ''])} style={{ alignSelf: 'flex-start', background: 'none', border: '1px dashed rgba(200,180,255,0.15)', borderRadius: '0.75rem', padding: '0.4rem 0.875rem', color: 'rgba(180,160,255,0.35)', fontSize: '0.75rem', cursor: 'pointer' }}>+ Add more</button>
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ color: 'rgba(180,160,255,0.5)', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: '0.5rem' }}>How are you feeling?</label>
            <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
              {MOODS.map(m => (
                <button key={m.emoji} onClick={() => setMood(m.emoji)} style={{ padding: '0.4rem 0.75rem', borderRadius: '2rem', border: mood===m.emoji ? '1px solid rgba(201,168,76,0.5)' : '1px solid rgba(200,180,255,0.1)', background: mood===m.emoji ? 'rgba(201,168,76,0.12)' : 'rgba(8,6,28,0.6)', color: mood===m.emoji ? '#c9a84c' : 'rgba(180,160,255,0.5)', fontSize: '0.75rem', cursor: 'pointer' }}>{m.emoji} {m.label}</button>
              ))}
            </div>
          </div>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ color: 'rgba(180,160,255,0.5)', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: '0.4rem' }}>Angel number seen today (optional)</label>
            <input value={number} onChange={e => setNumber(e.target.value)} placeholder='e.g. 1111' style={{ width: '100%', background: 'rgba(8,6,28,0.8)', border: '1px solid rgba(200,180,255,0.15)', borderRadius: '0.75rem', padding: '0.75rem', color: 'rgba(220,200,255,0.85)', fontSize: '0.85rem', outline: 'none', boxSizing: 'border-box' }} />
          </div>
          <div style={{ marginBottom: '1.25rem' }}>
            <label style={{ color: 'rgba(180,160,255,0.5)', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: '0.4rem' }}>Reflection (optional)</label>
            <textarea value={note} onChange={e => setNote(e.target.value)} placeholder='Any thoughts, insights, or intentions for tomorrow...' rows={3} style={{ width: '100%', background: 'rgba(8,6,28,0.8)', border: '1px solid rgba(200,180,255,0.15)', borderRadius: '0.75rem', padding: '0.75rem', color: 'rgba(220,200,255,0.85)', fontSize: '0.85rem', resize: 'none', outline: 'none', boxSizing: 'border-box' }} />
          </div>
          <button onClick={submit} style={{ width: '100%', padding: '0.875rem', borderRadius: '0.875rem', border: '1px solid rgba(201,168,76,0.4)', background: 'rgba(201,168,76,0.15)', color: '#c9a84c', fontSize: '0.9rem', cursor: 'pointer' }}>🙏 Submit Gratitude</button>
        </div>
      )}
    </div>
  )

  if (view === 'history') return (
    <div style={{ maxWidth: '520px', margin: '0 auto', padding: '1.5rem 1rem 2rem' }}>
      <button onClick={() => setView('home')} style={{ background: 'none', border: 'none', color: 'rgba(180,160,255,0.5)', cursor: 'pointer', fontSize: '0.8rem', marginBottom: '1rem', padding: 0 }}>← Back</button>
      <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.5rem', color: 'rgba(220,200,255,0.95)', margin: '0 0 1.25rem', fontWeight: 400 }}>Gratitude History</h2>
      {Object.entries(grouped).map(([month, monthEntries]) => (
        <div key={month} style={{ marginBottom: '1.5rem' }}>
          <div style={{ color: 'rgba(180,160,255,0.35)', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '0.625rem' }}>{month}</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
            {monthEntries.map(e => (
              <div key={e.id} style={{ ...card, padding: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.625rem' }}>
                  <span style={{ color: 'rgba(180,160,255,0.4)', fontSize: '0.72rem' }}>{new Date(e.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
                  <div style={{ display: 'flex', gap: '0.4rem', alignItems: 'center' }}>
                    {e.number && <span style={{ color: '#c9a84c', fontSize: '0.68rem', padding: '0.15rem 0.5rem', borderRadius: '2rem', border: '1px solid rgba(201,168,76,0.25)', background: 'rgba(201,168,76,0.08)' }}>{e.number}</span>}
                    <span style={{ fontSize: '1rem' }}>{e.mood}</span>
                  </div>
                </div>
                <ul style={{ margin: 0, padding: '0 0 0 1rem' }}>
                  {e.items.map((item, i) => <li key={i} style={{ color: 'rgba(200,180,255,0.7)', fontSize: '0.82rem', lineHeight: 1.6, marginBottom: '0.15rem' }}>{item}</li>)}
                </ul>
                {e.note && <p style={{ color: 'rgba(180,160,255,0.45)', fontSize: '0.75rem', lineHeight: 1.5, margin: '0.5rem 0 0', fontStyle: 'italic' }}>{e.note}</p>}
              </div>
            ))}
          </div>
        </div>
      ))}
      {entries.length === 0 && <div style={{ ...card, padding: '2rem', textAlign: 'center', color: 'rgba(180,160,255,0.4)', fontSize: '0.85rem' }}>No entries yet. Start your gratitude practice today.</div>}
    </div>
  )

  return (
    <div style={{ maxWidth: '520px', margin: '0 auto', padding: '1.5rem 1rem 2rem' }}>
      <div style={{ marginBottom: '1.25rem' }}>
        <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.8rem', color: 'rgba(220,200,255,0.95)', margin: '0 0 0.25rem', fontWeight: 400 }}>Gratitude</h1>
        <p style={{ color: 'rgba(180,160,255,0.5)', fontSize: '0.8rem', margin: 0 }}>What you appreciate, appreciates</p>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '0.625rem', marginBottom: '1.25rem' }}>
        {[{ label: 'Streak', value: streak + ' days', emoji: '🔥' }, { label: 'Total', value: entries.length + ' entries', emoji: '📖' }, { label: 'Today', value: todayEntry ? '✓ Done' : 'Pending', emoji: todayEntry ? '✨' : '🌱' }].map(s => (
          <div key={s.label} style={{ ...card, padding: '0.875rem', textAlign: 'center' }}>
            <div style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>{s.emoji}</div>
            <div style={{ color: 'rgba(220,200,255,0.85)', fontSize: '0.85rem', fontWeight: 600 }}>{s.value}</div>
            <div style={{ color: 'rgba(180,160,255,0.35)', fontSize: '0.62rem', textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: '0.1rem' }}>{s.label}</div>
          </div>
        ))}
      </div>
      {todayEntry ? (
        <div style={{ ...card, padding: '1.25rem', borderColor: 'rgba(201,168,76,0.2)', marginBottom: '1rem' }}>
          <div style={{ color: '#c9a84c', fontSize: '0.62rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.625rem' }}>✦ Today's Gratitude</div>
          <ul style={{ margin: 0, padding: '0 0 0 1rem' }}>
            {todayEntry.items.map((item, i) => <li key={i} style={{ color: 'rgba(200,180,255,0.75)', fontSize: '0.85rem', lineHeight: 1.65, marginBottom: '0.2rem' }}>{item}</li>)}
          </ul>
        </div>
      ) : (
        <div style={{ ...card, padding: '1.75rem', textAlign: 'center', marginBottom: '1rem', borderColor: 'rgba(201,168,76,0.15)' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>🙏</div>
          <p style={{ color: 'rgba(180,160,255,0.55)', fontSize: '0.85rem', lineHeight: 1.6, margin: '0 0 1.25rem' }}>You haven't written your gratitude today.<br/>Take 2 minutes to shift your energy.</p>
          <button onClick={() => setView('write')} style={{ padding: '0.75rem 2rem', borderRadius: '2rem', border: '1px solid rgba(201,168,76,0.4)', background: 'rgba(201,168,76,0.15)', color: '#c9a84c', fontSize: '0.85rem', cursor: 'pointer' }}>Begin Today's Practice</button>
        </div>
      )}
      <div style={{ display: 'flex', gap: '0.625rem' }}>
        {todayEntry && <button onClick={() => setView('write')} style={{ flex: 1, padding: '0.75rem', borderRadius: '0.875rem', border: '1px solid rgba(200,180,255,0.15)', background: 'rgba(200,180,255,0.05)', color: 'rgba(180,160,255,0.6)', fontSize: '0.82rem', cursor: 'pointer' }}>Edit Today</button>}
        <button onClick={() => setView('history')} style={{ flex: 1, padding: '0.75rem', borderRadius: '0.875rem', border: '1px solid rgba(200,180,255,0.15)', background: 'rgba(200,180,255,0.05)', color: 'rgba(180,160,255,0.6)', fontSize: '0.82rem', cursor: 'pointer' }}>View History</button>
      </div>
    </div>
  )
}
