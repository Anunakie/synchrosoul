'use client'

import { useState, useEffect } from 'react'
import { saveDream, getDreams, deleteDream, searchDreams, DreamEntry } from '@/lib/dream-storage'
import { DREAM_SYMBOLS, MOOD_TAGS } from '@/lib/dream-meanings'
import VoiceRecorder from '@/components/VoiceRecorder'
import { speakText, stopSpeaking } from '@/components/VoiceRecorder'

export default function DreamsPage() {
  const [dreams, setDreams] = useState<DreamEntry[]>([])
  const [view, setView] = useState<'list' | 'new'>('list')
  const [search, setSearch] = useState('')
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [speakingId, setSpeakingId] = useState<string | null>(null)

  // Form state
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [selectedSymbols, setSelectedSymbols] = useState<string[]>([])
  const [selectedMoods, setSelectedMoods] = useState<string[]>([])
  const [angelNumbers, setAngelNumbers] = useState('')
  const [voiceNoteUrl, setVoiceNoteUrl] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    getDreams().then(setDreams)
  }, [])

  useEffect(() => {
    if (search.trim()) searchDreams(search).then(setDreams)
    else getDreams().then(setDreams)
  }, [search])

  function toggleSymbol(key: string) {
    setSelectedSymbols(prev => prev.includes(key) ? prev.filter(s => s !== key) : [...prev, key])
  }

  function toggleMood(label: string) {
    setSelectedMoods(prev => prev.includes(label) ? prev.filter(m => m !== label) : [...prev, label])
  }

  async function handleSave() {
    if (!description.trim() && !title.trim()) return
    setSaving(true)
    await new Promise(r => setTimeout(r, 700))
    const numbers = angelNumbers.split(/[,\s]+/).map(n => n.replace(/\D/g, '')).filter(Boolean)
    saveDream({ title, description, symbols: selectedSymbols, moods: selectedMoods, angelNumbers: numbers, voiceNoteUrl })
    getDreams().then(setDreams)
    setSaving(false)
    setSaved(true)
    setTimeout(() => {
      setSaved(false)
      setView('list')
      setTitle(''); setDescription(''); setSelectedSymbols([])
      setSelectedMoods([]); setAngelNumbers(''); setVoiceNoteUrl(null)
    }, 1800)
  }

  function handleDelete(id: string) {
    deleteDream(id)
    getDreams().then(setDreams)
  }

  function handleSpeak(dream: DreamEntry) {
    if (speakingId === dream.id) {
      stopSpeaking()
      setSpeakingId(null)
      return
    }
    const text = [
      dream.title ? `Dream: ${dream.title}.` : 'Dream entry.',
      dream.reading,
      dream.description ? `Description: ${dream.description}` : '',
    ].filter(Boolean).join(' ')
    speakText(text)
    setSpeakingId(dream.id)
    const wordCount = text.split(' ').length
    setTimeout(() => setSpeakingId(null), (wordCount / 2.5) * 1000 + 500)
  }

  // Group dreams by date
  const grouped: Record<string, DreamEntry[]> = {}
  dreams.forEach(d => {
    const date = new Date(d.createdAt).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
    if (!grouped[date]) grouped[date] = []
    grouped[date].push(d)
  })

  // ── SAVED CONFIRMATION ────────────────────────────────────────────────────
  if (saved) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '1rem', textAlign: 'center' }}>
        <div style={{ fontSize: '3rem' }}>🌙</div>
        <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.75rem', color: 'rgba(200,180,255,0.9)', fontWeight: 300 }}>Dream Recorded</h2>
        <p style={{ color: 'rgba(200,180,255,0.5)', fontSize: '0.875rem' }}>Your dream has been woven into the cosmic tapestry</p>
      </div>
    )
  }

  // ── NEW DREAM FORM ────────────────────────────────────────────────────────
  if (view === 'new') {
    return (
      <div style={{ maxWidth: '640px', margin: '0 auto', padding: '1.5rem 1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
          <button onClick={() => setView('list')} style={{
            color: 'rgba(200,180,255,0.4)', fontSize: '1.2rem',
            background: 'none', border: 'none', cursor: 'pointer',
          }}>←</button>
          <div>
            <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.75rem', color: 'rgba(220,200,255,0.9)', fontWeight: 300 }}>Record a Dream</h1>
            <p style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'rgba(200,180,255,0.35)' }}>While it&apos;s still fresh</p>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

          {/* Title */}
          <div>
            <label style={{ display: 'block', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'rgba(200,180,255,0.5)', marginBottom: '0.5rem' }}>Dream Title</label>
            <input
              value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="The golden staircase, The ocean of stars..."
              style={{
                width: '100%', borderRadius: '0.75rem', padding: '0.875rem 1rem',
                fontSize: '0.875rem', outline: 'none', boxSizing: 'border-box',
                background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(200,180,255,0.2)',
                color: 'rgba(255,255,255,0.8)', fontFamily: 'inherit',
              }}
            />
          </div>

          {/* Description with voice */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <label style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'rgba(200,180,255,0.5)' }}>Describe Your Dream</label>
              <VoiceRecorder
                compact
                onTranscript={(t) => setDescription(prev => prev ? prev + ' ' + t : t)}
                onVoiceNote={(url) => setVoiceNoteUrl(url)}
              />
            </div>
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="What happened? What did you see, feel, hear? Tap 🎙️ to speak your dream..."
              rows={5}
              style={{
                width: '100%', borderRadius: '0.75rem', padding: '1rem',
                fontSize: '0.875rem', resize: 'none', outline: 'none', boxSizing: 'border-box',
                background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(200,180,255,0.2)',
                color: 'rgba(255,255,255,0.8)', fontFamily: 'inherit', lineHeight: 1.6,
              }}
            />
            {voiceNoteUrl && (
              <div style={{ marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '0.7rem', color: 'rgba(255,160,50,0.7)' }}>🔊 Voice note saved</span>
                <audio src={voiceNoteUrl} controls style={{ height: '1.5rem', flex: 1 }} />
              </div>
            )}
          </div>

          {/* Mood tags */}
          <div>
            <label style={{ display: 'block', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'rgba(200,180,255,0.5)', marginBottom: '0.75rem' }}>Dream Mood</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {MOOD_TAGS.map(mood => {
                const active = selectedMoods.includes(mood.label)
                return (
                  <button key={mood.label} onClick={() => toggleMood(mood.label)} style={{
                    padding: '0.4rem 0.875rem', borderRadius: '9999px', fontSize: '0.8rem',
                    cursor: 'pointer', transition: 'all 0.15s',
                    background: active ? mood.color + '22' : 'rgba(255,255,255,0.04)',
                    border: `1px solid ${active ? mood.color + '66' : 'rgba(200,180,255,0.15)'}`,
                    color: active ? mood.color : 'rgba(200,180,255,0.5)',
                  }}>{mood.emoji} {mood.label}</button>
                )
              })}
            </div>
          </div>

          {/* Dream symbols */}
          <div>
            <label style={{ display: 'block', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'rgba(200,180,255,0.5)', marginBottom: '0.75rem' }}>Symbols in Your Dream</label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem' }}>
              {Object.entries(DREAM_SYMBOLS).map(([key, sym]) => {
                const active = selectedSymbols.includes(key)
                return (
                  <button key={key} onClick={() => toggleSymbol(key)} style={{
                    padding: '0.75rem 0.5rem', borderRadius: '0.75rem', fontSize: '0.75rem',
                    cursor: 'pointer', textAlign: 'center', transition: 'all 0.15s',
                    background: active ? sym.color + '1a' : 'rgba(255,255,255,0.03)',
                    border: `1px solid ${active ? sym.color + '55' : 'rgba(200,180,255,0.1)'}`,
                    color: active ? sym.color : 'rgba(200,180,255,0.5)',
                  }}>
                    <div style={{ fontSize: '1.25rem', marginBottom: '0.25rem' }}>{sym.emoji}</div>
                    <div>{sym.label}</div>
                  </button>
                )
              })}
            </div>
          </div>

          {/* Angel numbers in dream */}
          <div>
            <label style={{ display: 'block', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'rgba(200,180,255,0.5)', marginBottom: '0.5rem' }}>Angel Numbers Seen in Dream</label>
            <input
              value={angelNumbers}
              onChange={e => setAngelNumbers(e.target.value)}
              placeholder="111, 444, 1111 (separate with commas)"
              style={{
                width: '100%', borderRadius: '0.75rem', padding: '0.875rem 1rem',
                fontSize: '0.875rem', outline: 'none', boxSizing: 'border-box',
                background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(200,180,255,0.2)',
                color: 'rgba(255,255,255,0.8)', fontFamily: 'inherit',
              }}
            />
            <p style={{ fontSize: '0.7rem', color: 'rgba(200,180,255,0.25)', marginTop: '0.25rem' }}>Numbers seen in dreams carry triple the waking power</p>
          </div>

          {/* Save button */}
          <button onClick={handleSave} disabled={saving || (!title.trim() && !description.trim())} style={{
            width: '100%', padding: '1rem', borderRadius: '9999px',
            background: 'linear-gradient(135deg, rgba(100,60,180,0.4), rgba(60,30,120,0.4))',
            border: '1px solid rgba(160,100,255,0.4)',
            color: 'rgba(220,200,255,0.95)', cursor: saving ? 'not-allowed' : 'pointer',
            fontSize: '1rem', fontWeight: 500, letterSpacing: '0.05em',
            opacity: saving ? 0.7 : 1,
          }}>
            {saving ? '🌙 Weaving into the cosmos...' : 'Record This Dream 🌙'}
          </button>
        </div>
      </div>
    )
  }

  // ── DREAM LIST ────────────────────────────────────────────────────────────
  return (
    <div style={{ maxWidth: '640px', margin: '0 auto', padding: '1.5rem 1rem' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2rem', color: 'rgba(220,200,255,0.9)', fontWeight: 300, marginBottom: '0.25rem' }}>Dream Journal</h1>
          <p style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'rgba(200,180,255,0.35)' }}>{dreams.length} dream{dreams.length !== 1 ? 's' : ''} recorded</p>
        </div>
        <button onClick={() => setView('new')} style={{
          padding: '0.6rem 1.25rem', borderRadius: '9999px',
          background: 'linear-gradient(135deg, rgba(100,60,180,0.3), rgba(60,30,120,0.3))',
          border: '1px solid rgba(160,100,255,0.35)',
          color: 'rgba(200,170,255,0.9)', cursor: 'pointer', fontSize: '0.875rem',
          whiteSpace: 'nowrap',
        }}>+ New Dream</button>
      </div>

      {/* Search */}
      <div style={{ position: 'relative', marginBottom: '1.5rem' }}>
        <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'rgba(200,180,255,0.3)', fontSize: '0.875rem' }}>🔍</span>
        <input
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search dreams, symbols, numbers..."
          style={{
            width: '100%', borderRadius: '0.75rem', padding: '0.75rem 1rem 0.75rem 2.5rem',
            fontSize: '0.875rem', outline: 'none', boxSizing: 'border-box',
            background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(200,180,255,0.15)',
            color: 'rgba(255,255,255,0.8)', fontFamily: 'inherit',
          }}
        />
      </div>

      {/* Empty state */}
      {dreams.length === 0 && (
        <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🌙</div>
          <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.5rem', color: 'rgba(200,180,255,0.6)', fontWeight: 300, marginBottom: '0.5rem' }}>No dreams recorded yet</h3>
          <p style={{ color: 'rgba(200,180,255,0.35)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>Record your first dream while it&apos;s still vivid</p>
          <button onClick={() => setView('new')} style={{
            padding: '0.75rem 2rem', borderRadius: '9999px',
            background: 'rgba(100,60,180,0.2)', border: '1px solid rgba(160,100,255,0.3)',
            color: 'rgba(200,170,255,0.8)', cursor: 'pointer', fontSize: '0.875rem',
          }}>Record a Dream</button>
        </div>
      )}

      {/* Dream entries grouped by date */}
      {Object.entries(grouped).map(([date, entries]) => (
        <div key={date} style={{ marginBottom: '2rem' }}>
          <p style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'rgba(200,180,255,0.3)', marginBottom: '0.75rem', paddingLeft: '0.25rem' }}>{date}</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {entries.map(dream => {
              const isExpanded = expandedId === dream.id
              return (
                <div key={dream.id} style={{
                  background: isExpanded ? 'rgba(80,40,160,0.12)' : 'rgba(255,255,255,0.03)',
                  border: `1px solid ${isExpanded ? 'rgba(160,100,255,0.3)' : 'rgba(200,180,255,0.1)'}`,
                  borderRadius: '1rem', overflow: 'hidden', transition: 'all 0.3s',
                }}>
                  {/* Dream row */}
                  <button onClick={() => setExpandedId(isExpanded ? null : dream.id)} style={{
                    width: '100%', textAlign: 'left', padding: '1.25rem',
                    display: 'flex', alignItems: 'flex-start', gap: '1rem',
                    background: 'none', border: 'none', cursor: 'pointer',
                  }}>
                    <div style={{
                      flexShrink: 0, width: '3rem', height: '3rem', borderRadius: '50%',
                      background: 'rgba(80,40,160,0.25)', border: '1px solid rgba(160,100,255,0.3)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem',
                    }}>🌙</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontSize: '0.95rem', fontWeight: 500, color: 'rgba(220,200,255,0.85)', marginBottom: '0.25rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {dream.title || 'Untitled Dream'}
                      </p>
                      <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '0.25rem' }}>
                        {dream.moods.slice(0, 3).map(m => {
                          const mood = MOOD_TAGS.find(t => t.label === m)
                          return mood ? (
                            <span key={m} style={{ fontSize: '0.65rem', padding: '0.1rem 0.5rem', borderRadius: '9999px', background: mood.color + '18', color: mood.color, border: `1px solid ${mood.color}33` }}>
                              {mood.emoji} {m}
                            </span>
                          ) : null
                        })}
                        {dream.angelNumbers.length > 0 && (
                          <span style={{ fontSize: '0.65rem', padding: '0.1rem 0.5rem', borderRadius: '9999px', background: 'rgba(200,150,255,0.12)', color: 'rgba(200,150,255,0.7)', border: '1px solid rgba(200,150,255,0.25)' }}>
                            ✦ {dream.angelNumbers.join(', ')}
                          </span>
                        )}
                      </div>
                      <p style={{ fontSize: '0.7rem', color: 'rgba(200,180,255,0.25)' }}>
                        {new Date(dream.createdAt).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                    <div style={{ color: 'rgba(200,180,255,0.3)', fontSize: '0.875rem', transform: isExpanded ? 'rotate(180deg)' : 'none', transition: 'transform 0.3s' }}>▾</div>
                  </button>

                  {/* Expanded dream detail */}
                  {isExpanded && (
                    <div style={{ padding: '0 1.25rem 1.25rem' }}>
                      <div style={{ height: '1px', background: 'rgba(200,180,255,0.08)', marginBottom: '1rem' }} />

                      {/* Cosmic reading with speak */}
                      <div style={{ padding: '1rem', borderRadius: '0.75rem', background: 'rgba(80,40,160,0.15)', border: '1px solid rgba(160,100,255,0.2)', marginBottom: '1rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                          <p style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'rgba(160,100,255,0.7)' }}>🔮 Dream Reading</p>
                          <button onClick={() => handleSpeak(dream)} style={{
                            display: 'flex', alignItems: 'center', gap: '0.3rem',
                            padding: '0.3rem 0.75rem', borderRadius: '9999px',
                            background: speakingId === dream.id ? 'rgba(160,100,255,0.2)' : 'rgba(200,150,255,0.1)',
                            border: `1px solid ${speakingId === dream.id ? 'rgba(160,100,255,0.5)' : 'rgba(200,150,255,0.25)'}`,
                            color: speakingId === dream.id ? 'rgba(180,130,255,0.9)' : 'rgba(200,150,255,0.6)',
                            cursor: 'pointer', fontSize: '0.7rem',
                          }}>
                            <span>{speakingId === dream.id ? '⏹' : '🔊'}</span>
                            <span>{speakingId === dream.id ? 'Stop' : 'Listen'}</span>
                          </button>
                        </div>
                        <p style={{ fontSize: '0.875rem', lineHeight: 1.6, color: 'rgba(220,200,255,0.7)' }}>{dream.reading}</p>
                      </div>

                      {/* Description */}
                      {dream.description && (
                        <div style={{ marginBottom: '1rem' }}>
                          <p style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'rgba(200,180,255,0.4)', marginBottom: '0.5rem' }}>Dream Description</p>
                          <p style={{ fontSize: '0.875rem', lineHeight: 1.6, color: 'rgba(220,200,255,0.6)' }}>{dream.description}</p>
                        </div>
                      )}

                      {/* Voice note */}
                      {dream.voiceNoteUrl && (
                        <div style={{ marginBottom: '1rem' }}>
                          <p style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'rgba(255,160,50,0.5)', marginBottom: '0.5rem' }}>🔊 Voice Note</p>
                          <audio src={dream.voiceNoteUrl} controls style={{ width: '100%', height: '2rem' }} />
                        </div>
                      )}

                      {/* Symbols */}
                      {dream.symbols.length > 0 && (
                        <div style={{ marginBottom: '1rem' }}>
                          <p style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'rgba(200,180,255,0.4)', marginBottom: '0.5rem' }}>Symbols</p>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                            {dream.symbols.map(s => {
                              const sym = DREAM_SYMBOLS[s]
                              return sym ? (
                                <span key={s} style={{ fontSize: '0.75rem', padding: '0.25rem 0.75rem', borderRadius: '9999px', background: sym.color + '18', color: sym.color, border: `1px solid ${sym.color}33` }}>
                                  {sym.emoji} {sym.label}
                                </span>
                              ) : null
                            })}
                          </div>
                        </div>
                      )}

                      {/* Delete */}
                      <button onClick={() => handleDelete(dream.id)} style={{
                        padding: '0.5rem 1rem', borderRadius: '0.75rem', fontSize: '0.75rem',
                        background: 'rgba(255,80,80,0.06)', border: '1px solid rgba(255,80,80,0.15)',
                        color: 'rgba(255,120,120,0.5)', cursor: 'pointer',
                      }}>Delete Dream</button>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}
