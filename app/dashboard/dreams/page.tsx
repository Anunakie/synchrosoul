'use client'

import { useState, useEffect, useRef } from 'react'
import { saveDream, getDreams, deleteDream, searchDreams, DreamEntry } from '@/lib/dream-storage'
import { DREAM_SYMBOLS, MOOD_TAGS } from '@/lib/dream-meanings'
import VoiceRecorder from '@/components/VoiceRecorder'
import { speakText, stopSpeaking } from '@/components/VoiceRecorder'
import FeatureGate from '@/components/FeatureGate'
import SleepSounds from '@/components/SleepSounds'

export default function DreamsPage() {
  const [dreams, setDreams] = useState<DreamEntry[]>([])
  const [view, setView] = useState<'list' | 'new'>('list')
  const [search, setSearch] = useState('')
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [speakingId, setSpeakingId] = useState<string | null>(null)
  const [nightMode, setNightMode] = useState(false)

  // Form state
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [selectedSymbols, setSelectedSymbols] = useState<string[]>([])
  const [selectedMoods, setSelectedMoods] = useState<string[]>([])
  const [angelNumbers, setAngelNumbers] = useState('')
  const [voiceNoteUrl, setVoiceNoteUrl] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  const descRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => { getDreams().then(setDreams) }, [])

  useEffect(() => {
    if (search.trim()) searchDreams(search).then(setDreams)
    else getDreams().then(setDreams)
  }, [search])

  // Auto-focus description in night mode
  useEffect(() => {
    if (nightMode && view === 'new') {
      setTimeout(() => descRef.current?.focus(), 300)
    }
  }, [nightMode, view])

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

  // ── NIGHT MODE UI ──────────────────────────────────────────────────────────
  if (nightMode) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'rgba(8,0,0,0.97)',
        display: 'flex',
        flexDirection: 'column',
        padding: '1.5rem 1rem',
        gap: '1rem',
        position: 'relative',
      }}>
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: '0.65rem', letterSpacing: '0.2em', color: 'rgba(180,40,40,0.6)', textTransform: 'uppercase' }}>Night Mode</div>
            <h1 style={{ fontSize: '1.4rem', fontWeight: 300, color: 'rgba(220,80,80,0.85)', fontFamily: 'serif', margin: 0 }}>Dream Capture</h1>
          </div>
          <button
            onClick={() => setNightMode(false)}
            style={{ background: 'rgba(180,40,40,0.15)', border: '1px solid rgba(180,40,40,0.3)', borderRadius: '0.5rem', padding: '0.4rem 0.75rem', color: 'rgba(220,80,80,0.7)', fontSize: '0.7rem', cursor: 'pointer', letterSpacing: '0.1em' }}
          >EXIT</button>
        </div>

        {/* Quick capture */}
        <div style={{ background: 'rgba(180,20,20,0.06)', border: '1px solid rgba(180,40,40,0.2)', borderRadius: '0.75rem', padding: '1rem' }}>
          <textarea
            ref={descRef}
            value={description}
            onChange={e => setDescription(e.target.value)}
            onInput={e => setDescription((e.target as HTMLTextAreaElement).value)}
            placeholder="Capture your dream while it's fresh..."
            rows={5}
            style={{
              width: '100%',
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: 'rgba(255,160,160,0.85)',
              fontSize: '1rem',
              lineHeight: 1.7,
              resize: 'none',
              fontFamily: 'inherit',
              boxSizing: 'border-box',
            }}
          />
          <input
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Title (optional)"
            style={{
              width: '100%',
              background: 'transparent',
              border: 'none',
              borderTop: '1px solid rgba(180,40,40,0.15)',
              outline: 'none',
              color: 'rgba(255,120,120,0.6)',
              fontSize: '0.8rem',
              padding: '0.5rem 0 0',
              fontFamily: 'inherit',
              boxSizing: 'border-box',
            }}
          />
        </div>

        {/* Angel number quick tag */}
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {['111','222','333','444','555','777','888','999','1111'].map(n => (
            <button key={n} onClick={() => setAngelNumbers(prev => prev ? prev + ',' + n : n)}
              style={{ padding: '0.3rem 0.6rem', borderRadius: '0.4rem', border: '1px solid rgba(180,40,40,0.25)', background: angelNumbers.includes(n) ? 'rgba(180,40,40,0.2)' : 'transparent', color: 'rgba(220,100,100,0.7)', fontSize: '0.7rem', cursor: 'pointer' }}>
              {n}
            </button>
          ))}
        </div>

        {/* Premium: Voice in night mode */}
        <FeatureGate feature="voice_journal" requiredTier="mystic">
          <div style={{ background: 'rgba(180,20,20,0.06)', border: '1px solid rgba(180,40,40,0.15)', borderRadius: '0.75rem', padding: '0.75rem' }}>
            <div style={{ fontSize: '0.65rem', color: 'rgba(180,40,40,0.5)', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>VOICE CAPTURE</div>
            <VoiceRecorder onTranscript={t => setDescription(prev => prev ? prev + ' ' + t : t)} onVoiceNote={url => setVoiceNoteUrl(url)} />
          </div>
        </FeatureGate>

        {/* Save button */}
        <button
          onClick={handleSave}
          disabled={saving || (!description.trim() && !title.trim())}
          style={{
            padding: '0.9rem',
            borderRadius: '0.75rem',
            border: '1px solid rgba(180,40,40,0.4)',
            background: saved ? 'rgba(40,120,40,0.3)' : 'rgba(180,40,40,0.2)',
            color: saved ? 'rgba(100,220,100,0.9)' : 'rgba(220,80,80,0.9)',
            fontSize: '0.9rem',
            cursor: 'pointer',
            letterSpacing: '0.1em',
            transition: 'all 0.3s',
          }}
        >
          {saved ? '✓ Dream Saved' : saving ? 'Saving...' : 'Save Dream'}
        </button>

        {/* Premium: Sleep Sounds in night mode */}
        <FeatureGate feature="sleep_sounds" requiredTier="mystic">
          <SleepSounds />
        </FeatureGate>

        <p style={{ textAlign: 'center', fontSize: '0.6rem', color: 'rgba(180,40,40,0.25)', letterSpacing: '0.1em' }}>Screen dimmed to preserve night vision</p>
      </div>
    )
  }

  // ── NORMAL UI ──────────────────────────────────────────────────────────────
  return (
    <div style={{ maxWidth: '680px', margin: '0 auto', padding: '1.5rem 1rem', minHeight: '100vh' }}>

      {/* Header */}
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div>
            <div style={{ fontSize: '0.65rem', letterSpacing: '0.2em', color: 'rgba(201,168,76,0.6)', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Sacred Sleep</div>
            <h1 className="serif gradient-text" style={{ fontSize: '2rem', fontWeight: 300, margin: 0 }}>Dream Journal</h1>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button
              onClick={() => { setNightMode(true); setView('new') }}
              style={{ padding: '0.5rem 0.9rem', borderRadius: '0.6rem', border: '1px solid rgba(180,40,40,0.4)', background: 'rgba(180,20,20,0.15)', color: 'rgba(220,100,100,0.85)', fontSize: '0.75rem', cursor: 'pointer', letterSpacing: '0.08em', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
            >
              <span>🌙</span> Night Mode
            </button>
            <button
              onClick={() => setView(view === 'new' ? 'list' : 'new')}
              style={{ padding: '0.5rem 0.9rem', borderRadius: '0.6rem', border: '1px solid rgba(201,168,76,0.3)', background: view === 'new' ? 'rgba(201,168,76,0.15)' : 'transparent', color: 'rgba(201,168,76,0.85)', fontSize: '0.75rem', cursor: 'pointer', letterSpacing: '0.08em' }}
            >
              {view === 'new' ? '← Dreams' : '+ New Dream'}
            </button>
          </div>
        </div>
      </div>

      {/* Sleep Sounds - Premium, always visible in normal mode */}
      {view === 'list' && (
        <div style={{ marginBottom: '1.5rem' }}>
          <FeatureGate feature="sleep_sounds" requiredTier="mystic">
            <SleepSounds />
          </FeatureGate>
        </div>
      )}

      {/* New Dream Form */}
      {view === 'new' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ background: 'rgba(8,6,28,0.85)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '1rem', padding: '1.25rem', backdropFilter: 'blur(12px)' }}>
            <label style={{ display: 'block', fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', marginBottom: '0.5rem' }}>Dream Title</label>
            <input value={title} onChange={e => setTitle(e.target.value)} placeholder="Give your dream a name..." className="spiritual-input" />
          </div>

          <div style={{ background: 'rgba(8,6,28,0.85)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '1rem', padding: '1.25rem', backdropFilter: 'blur(12px)' }}>
            <label style={{ display: 'block', fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', marginBottom: '0.5rem' }}>Dream Description</label>
            <textarea
              ref={descRef}
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Describe your dream in as much detail as you remember..."
              rows={5}
              style={{ width: '100%', background: 'transparent', border: 'none', outline: 'none', color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem', lineHeight: 1.7, resize: 'vertical', fontFamily: 'inherit', boxSizing: 'border-box' }}
            />
          </div>

          {/* Voice Recorder - Premium */}
          <FeatureGate feature="voice_journal" requiredTier="mystic">
            <div style={{ background: 'rgba(8,6,28,0.85)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '1rem', padding: '1.25rem', backdropFilter: 'blur(12px)' }}>
              <label style={{ display: 'block', fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', marginBottom: '0.75rem' }}>Voice Note</label>
              <VoiceRecorder onTranscript={t => setDescription(prev => prev ? prev + ' ' + t : t)} onVoiceNote={url => setVoiceNoteUrl(url)} />
            </div>
          </FeatureGate>

          {/* Symbols */}
          <div style={{ background: 'rgba(8,6,28,0.85)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '1rem', padding: '1.25rem', backdropFilter: 'blur(12px)' }}>
            <label style={{ display: 'block', fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', marginBottom: '0.75rem' }}>Dream Symbols</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
              {Object.entries(DREAM_SYMBOLS).map(([key, sym]) => (
                <button key={key} onClick={() => toggleSymbol(key)}
                  style={{ padding: '0.3rem 0.6rem', borderRadius: '0.4rem', border: `1px solid ${selectedSymbols.includes(key) ? 'rgba(201,168,76,0.5)' : 'rgba(255,255,255,0.08)'}`, background: selectedSymbols.includes(key) ? 'rgba(201,168,76,0.12)' : 'transparent', color: selectedSymbols.includes(key) ? 'rgba(201,168,76,0.9)' : 'rgba(255,255,255,0.4)', fontSize: '0.75rem', cursor: 'pointer', transition: 'all 0.2s' }}>
                  {(sym as { emoji: string }).emoji} {key}
                </button>
              ))}
            </div>
          </div>

          {/* Moods */}
          <div style={{ background: 'rgba(8,6,28,0.85)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '1rem', padding: '1.25rem', backdropFilter: 'blur(12px)' }}>
            <label style={{ display: 'block', fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', marginBottom: '0.75rem' }}>Dream Mood</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
              {MOOD_TAGS.map(mood => (
                <button key={mood.label} onClick={() => toggleMood(mood.label)}
                  style={{ padding: '0.3rem 0.6rem', borderRadius: '0.4rem', border: `1px solid ${selectedMoods.includes(mood.label) ? mood.color + '66' : 'rgba(255,255,255,0.08)'}`, background: selectedMoods.includes(mood.label) ? mood.color + '22' : 'transparent', color: selectedMoods.includes(mood.label) ? mood.color : 'rgba(255,255,255,0.4)', fontSize: '0.75rem', cursor: 'pointer', transition: 'all 0.2s' }}>
                  {mood.emoji} {mood.label}
                </button>
              ))}
            </div>
          </div>

          {/* Angel Numbers */}
          <div style={{ background: 'rgba(8,6,28,0.85)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '1rem', padding: '1.25rem', backdropFilter: 'blur(12px)' }}>
            <label style={{ display: 'block', fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', marginBottom: '0.5rem' }}>Angel Numbers in Dream</label>
            <input value={angelNumbers} onChange={e => setAngelNumbers(e.target.value)} placeholder="e.g. 1111, 333, 777" className="spiritual-input" />
          </div>

          {/* Save */}
          <button onClick={handleSave} disabled={saving || (!description.trim() && !title.trim())}
            style={{ padding: '1rem', borderRadius: '0.75rem', border: '1px solid rgba(201,168,76,0.3)', background: saved ? 'rgba(40,120,40,0.2)' : 'rgba(201,168,76,0.12)', color: saved ? 'rgba(100,220,100,0.9)' : 'rgba(201,168,76,0.9)', fontSize: '0.9rem', cursor: 'pointer', letterSpacing: '0.1em', transition: 'all 0.3s' }}>
            {saved ? '✨ Dream Saved' : saving ? 'Saving...' : 'Save Dream'}
          </button>
        </div>
      )}

      {/* Dream List */}
      {view === 'list' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Search */}
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search dreams..." className="spiritual-input" style={{ marginBottom: '0.5rem' }} />

          {dreams.length === 0 && (
            <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'rgba(255,255,255,0.25)' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🌙</div>
              <p style={{ fontSize: '0.9rem', lineHeight: 1.6 }}>Your dream journal is empty.<br />Tap <strong style={{ color: 'rgba(201,168,76,0.6)' }}>+ New Dream</strong> or use <strong style={{ color: 'rgba(220,100,100,0.6)' }}>Night Mode</strong> to capture your first dream.</p>
            </div>
          )}

          {dreams.map(dream => (
            <div key={dream.id}
              style={{ background: 'rgba(8,6,28,0.88)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '1rem', padding: '1.25rem', backdropFilter: 'blur(12px)', cursor: 'pointer' }}
              onClick={() => setExpandedId(expandedId === dream.id ? null : dream.id)}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.75rem' }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.3)', marginBottom: '0.25rem' }}>
                    {new Date(dream.createdAt).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </div>
                  <h3 style={{ fontSize: '1rem', fontWeight: 400, color: 'rgba(255,255,255,0.85)', margin: '0 0 0.25rem', fontFamily: 'serif' }}>
                    {dream.title || 'Untitled Dream'}
                  </h3>
                  {dream.angelNumbers?.length > 0 && (
                    <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap', marginTop: '0.25rem' }}>
                      {dream.angelNumbers.map(n => (
                        <span key={n} style={{ fontSize: '0.65rem', padding: '0.15rem 0.4rem', borderRadius: '0.3rem', background: 'rgba(201,168,76,0.12)', color: 'rgba(201,168,76,0.7)', border: '1px solid rgba(201,168,76,0.2)' }}>{n}</span>
                      ))}
                    </div>
                  )}
                </div>
                <div style={{ display: 'flex', gap: '0.4rem', flexShrink: 0 }}>
                  <button onClick={e => { e.stopPropagation(); handleSpeak(dream) }}
                    style={{ padding: '0.3rem 0.5rem', borderRadius: '0.4rem', border: '1px solid rgba(255,255,255,0.08)', background: 'transparent', color: speakingId === dream.id ? 'rgba(201,168,76,0.9)' : 'rgba(255,255,255,0.3)', fontSize: '0.75rem', cursor: 'pointer' }}>
                    {speakingId === dream.id ? '⏹' : '🔊'}
                  </button>
                  <button onClick={e => { e.stopPropagation(); handleDelete(dream.id) }}
                    style={{ padding: '0.3rem 0.5rem', borderRadius: '0.4rem', border: '1px solid rgba(255,80,80,0.15)', background: 'transparent', color: 'rgba(255,100,100,0.4)', fontSize: '0.75rem', cursor: 'pointer' }}>
                    ✕
                  </button>
                </div>
              </div>

              {expandedId === dream.id && (
                <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                  {dream.description && (
                    <p style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.6)', lineHeight: 1.7, marginBottom: '0.75rem' }}>{dream.description}</p>
                  )}
                  {dream.reading && (
                    <div style={{ background: 'rgba(201,168,76,0.06)', border: '1px solid rgba(201,168,76,0.15)', borderRadius: '0.5rem', padding: '0.75rem', marginBottom: '0.75rem' }}>
                      <div style={{ fontSize: '0.6rem', letterSpacing: '0.15em', color: 'rgba(201,168,76,0.5)', marginBottom: '0.4rem' }}>COSMIC READING</div>
                      <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.55)', lineHeight: 1.6, margin: 0 }}>{dream.reading}</p>
                    </div>
                  )}
                  {dream.symbols?.length > 0 && (
                    <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap', marginBottom: '0.5rem' }}>
                      {dream.symbols.map(s => {
                        const sym = DREAM_SYMBOLS[s as keyof typeof DREAM_SYMBOLS]
                        return sym ? (
                          <span key={s} style={{ fontSize: '0.7rem', padding: '0.2rem 0.5rem', borderRadius: '0.3rem', background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.4)' }}>
                            {(sym as { emoji: string }).emoji} {s}
                          </span>
                        ) : null
                      })}
                    </div>
                  )}
                  {dream.moods?.length > 0 && (
                    <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap' }}>
                      {dream.moods.map(m => {
                        const mood = MOOD_TAGS.find(t => t.label === m)
                        return mood ? (
                          <span key={m} style={{ fontSize: '0.7rem', padding: '0.2rem 0.5rem', borderRadius: '0.3rem', background: mood.color + '15', color: mood.color, border: `1px solid ${mood.color}30` }}>
                            {mood.emoji} {m}
                          </span>
                        ) : null
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
