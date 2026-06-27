'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { saveDream, getDreams, deleteDream, searchDreams, DreamEntry } from '@/lib/dream-storage'
import { DREAM_SYMBOLS, MOOD_TAGS } from '@/lib/dream-meanings'
import { speakText, stopSpeaking } from '@/components/VoiceRecorder'
import FeatureGate from '@/components/FeatureGate'
import SleepSounds from '@/components/SleepSounds'
import SongRecommendationCard, { type SongRecommendationData } from '@/components/SongRecommendationCard'
import { createClient } from '@/lib/supabase/client'
import { getSubscriptionStatus } from '@/lib/subscription'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type SpeechRecognitionInstance = any
declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognitionInstance
    webkitSpeechRecognition: new () => SpeechRecognitionInstance
  }
}

// Unified tier source (matches FeatureGate & AngelLogger): honors DB profiles +
// localStorage cache + admin whitelist, so premium users are recognized
// consistently and never shown an "upgrade to Mystic" prompt while already paid.
async function getSubscriptionTier(): Promise<string> {
  try {
    const status = await getSubscriptionStatus()
    return status.tier
  } catch {
    return 'free'
  }
}

function isPremiumTier(tier: string): boolean {
  return tier === 'mystic' || tier === 'twin-flame' || tier === 'twin_flame'
}

export default function DreamsPage() {
  const [dreams, setDreams] = useState<DreamEntry[]>([])
  const [view, setView] = useState<'list' | 'new'>('list')
  const [search, setSearch] = useState('')
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [speakingId, setSpeakingId] = useState<string | null>(null)
  const [nightMode, setNightMode] = useState(false)
  const [dreamRecs, setDreamRecs] = useState<Record<string, SongRecommendationData | null>>({})
  const [dreamRecLoading, setDreamRecLoading] = useState<string | null>(null)
  const [isPremiumUser, setIsPremiumUser] = useState(false)

  // Form state
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [selectedSymbols, setSelectedSymbols] = useState<string[]>([])
  const [selectedMoods, setSelectedMoods] = useState<string[]>([])
  const [angelNumbers, setAngelNumbers] = useState('')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  // Night mode voice state
  const [isListening, setIsListening] = useState(false)
  const [voiceSupported, setVoiceSupported] = useState(false)
  const [pulse, setPulse] = useState(false)
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null)
  const transcriptRef = useRef('')
  const descRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => { getDreams().then(setDreams) }, [])

  // Detect tier once so free vs premium dream readings stay consistent with AngelLogger
  useEffect(() => { getSubscriptionTier().then(t => setIsPremiumUser(isPremiumTier(t))) }, [])

  // Fetch song recommendation when a dream is expanded and has a reading
  useEffect(() => {
    if (!expandedId) return
    const dream = dreams.find(d => d.id === expandedId)
    if (!dream?.reading || dreamRecs[expandedId] !== undefined) return
    setDreamRecLoading(expandedId)
    fetch('/api/musical-healers/recommend', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        number: dream.angelNumbers?.[0] || '',
        thought: dream.title + ': ' + (dream.description || ''),
        reading: dream.reading,
        readingType: 'dream',
        mode: 'spiritual',
      }),
    })
      .then(r => r.json())
      .then(data => {
        setDreamRecs(prev => ({ ...prev, [expandedId]: data.recommendation || null }))
      })
      .catch(() => {
        setDreamRecs(prev => ({ ...prev, [expandedId]: null }))
      })
      .finally(() => setDreamRecLoading(null))
  }, [expandedId, dreams, dreamRecs])

  useEffect(() => {
    if (search.trim()) searchDreams(search).then(setDreams)
    else getDreams().then(setDreams)
  }, [search])

  // Set up speech recognition once
  useEffect(() => {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!SR) return
    setVoiceSupported(true)
    const recognition = new SR()
    recognition.continuous = true
    recognition.interimResults = false
    recognition.lang = 'en-US'
    recognition.onresult = (e: SpeechRecognitionInstance) => {
      let final = ''
      for (let i = e.resultIndex; i < e.results.length; i++) {
        if (e.results[i].isFinal) final += e.results[i][0].transcript
      }
      if (final) {
        const combined = (transcriptRef.current + ' ' + final).trim()
        transcriptRef.current = combined
        setDescription(combined)
      }
    }
    recognition.onerror = () => { setIsListening(false); setPulse(false) }
    recognition.onend = () => { setIsListening(false); setPulse(false) }
    recognitionRef.current = recognition
  }, [])

  // Pulse animation while listening
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>
    if (isListening) {
      interval = setInterval(() => setPulse(p => !p), 500)
    } else {
      setPulse(false)
    }
    return () => clearInterval(interval)
  }, [isListening])

  const toggleVoice = useCallback(() => {
    if (!recognitionRef.current) return
    if (isListening) {
      recognitionRef.current.stop()
      setIsListening(false)
    } else {
      transcriptRef.current = description
      recognitionRef.current.start()
      setIsListening(true)
    }
  }, [isListening, description])

  // Auto-focus textarea in night mode
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
    if (isListening) { recognitionRef.current?.stop(); setIsListening(false) }
    await new Promise(r => setTimeout(r, 700))
    const numbers = angelNumbers.split(/[,\s]+/).map(n => n.replace(/\D/g, '')).filter(Boolean)
    saveDream({ title, description, symbols: selectedSymbols, moods: selectedMoods, angelNumbers: numbers, voiceNoteUrl: null })
    getDreams().then(setDreams)

    // Free users: nudge that a deeper personalized Oracle reading awaits in paid tiers
    // (in-app + best-effort web-push; throttled server-side to 1st, 3rd, then every 3rd dream)
    if (!isPremiumUser) {
      try {
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          fetch('/api/dreams/reading-alert', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: user.id, kind: 'dream' }),
          }).catch(() => {})
        }
      } catch {}
    }

    setSaving(false)
    setSaved(true)
    setTimeout(() => {
      setSaved(false)
      setView('list')
      setTitle(''); setDescription(''); setSelectedSymbols([])
      setSelectedMoods([]); setAngelNumbers('')
      transcriptRef.current = ''
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
        background: 'rgba(6,0,0,0.98)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '1.25rem 1rem 2rem',
        gap: '1.25rem',
        position: 'relative',
        overflowX: 'hidden',
      }}>
        {/* Header */}
        <div style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <div style={{ fontSize: '0.6rem', letterSpacing: '0.2em', color: 'rgba(180,40,40,0.5)', textTransform: 'uppercase' }}>Night Mode</div>
            <div style={{ fontSize: '1rem', fontWeight: 300, color: 'rgba(200,70,70,0.75)', fontFamily: 'serif' }}>Dream Capture</div>
          </div>
          <button
            onClick={() => { setNightMode(false); if (isListening) { recognitionRef.current?.stop(); setIsListening(false) } }}
            style={{ background: 'rgba(180,40,40,0.12)', border: '1px solid rgba(180,40,40,0.25)', borderRadius: '0.5rem', padding: '0.4rem 0.8rem', color: 'rgba(200,80,80,0.6)', fontSize: '0.65rem', cursor: 'pointer', letterSpacing: '0.12em' }}
          >EXIT</button>
        </div>

        {/* ── BIG CENTRAL VOICE BUTTON ── */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem', paddingTop: '0.5rem' }}>
          <FeatureGate feature="voice_journal" requiredTier="mystic">
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
              {/* Outer glow ring */}
              <div style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                {/* Animated rings when listening */}
                {isListening && (
                  <>
                    <div style={{
                      position: 'absolute',
                      width: '200px', height: '200px',
                      borderRadius: '50%',
                      border: `2px solid rgba(220,60,60,${pulse ? '0.4' : '0.15'})`,
                      animation: 'none',
                      transition: 'border-color 0.5s ease',
                    }} />
                    <div style={{
                      position: 'absolute',
                      width: '230px', height: '230px',
                      borderRadius: '50%',
                      border: `1px solid rgba(220,60,60,${pulse ? '0.2' : '0.06'})`,
                      transition: 'border-color 0.5s ease',
                    }} />
                  </>
                )}

                {/* The big button */}
                <button
                  onClick={toggleVoice}
                  style={{
                    width: '160px',
                    height: '160px',
                    borderRadius: '50%',
                    border: `2px solid ${isListening ? `rgba(220,60,60,${pulse ? '0.9' : '0.6'})` : 'rgba(180,40,40,0.4)'}`,
                    background: isListening
                      ? `radial-gradient(circle, rgba(180,20,20,${pulse ? '0.5' : '0.3'}) 0%, rgba(80,0,0,0.4) 100%)`
                      : 'radial-gradient(circle, rgba(60,0,0,0.6) 0%, rgba(20,0,0,0.4) 100%)',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '0.5rem',
                    transition: 'all 0.4s ease',
                    boxShadow: isListening
                      ? `0 0 ${pulse ? '60px' : '30px'} rgba(200,40,40,${pulse ? '0.5' : '0.25'}), inset 0 0 30px rgba(180,20,20,0.3)`
                      : '0 0 20px rgba(120,0,0,0.3), inset 0 0 20px rgba(60,0,0,0.2)',
                    WebkitTapHighlightColor: 'transparent',
                    userSelect: 'none',
                  }}
                >
                  <span style={{ fontSize: '3.5rem', lineHeight: 1, filter: isListening ? 'drop-shadow(0 0 8px rgba(255,100,100,0.8))' : 'none', transition: 'filter 0.3s' }}>
                    {isListening ? '⏹' : '🎙️'}
                  </span>
                  <span style={{
                    fontSize: '0.6rem',
                    letterSpacing: '0.15em',
                    textTransform: 'uppercase',
                    color: isListening ? `rgba(255,120,120,${pulse ? '1' : '0.7'})` : 'rgba(180,60,60,0.6)',
                    transition: 'all 0.3s',
                    fontWeight: 500,
                  }}>
                    {isListening ? 'LISTENING' : 'TAP TO SPEAK'}
                  </span>
                </button>
              </div>

              {/* Status text */}
              <div style={{ textAlign: 'center', minHeight: '1.5rem' }}>
                {isListening ? (
                  <p style={{ fontSize: '0.7rem', color: 'rgba(220,100,100,0.7)', letterSpacing: '0.1em', margin: 0 }}>
                    Speak your dream... tap again to stop
                  </p>
                ) : description ? (
                  <p style={{ fontSize: '0.65rem', color: 'rgba(180,60,60,0.5)', letterSpacing: '0.08em', margin: 0 }}>
                    Tap to add more
                  </p>
                ) : (
                  <p style={{ fontSize: '0.65rem', color: 'rgba(140,40,40,0.45)', letterSpacing: '0.08em', margin: 0 }}>
                    Speak while your dream is fresh
                  </p>
                )}
              </div>
            </div>
          </FeatureGate>
        </div>

        {/* Transcript / text area */}
        <div style={{ width: '100%', background: 'rgba(180,20,20,0.06)', border: '1px solid rgba(180,40,40,0.18)', borderRadius: '0.75rem', padding: '1rem', boxSizing: 'border-box' }}>
          <textarea
            ref={descRef}
            value={description}
            onChange={e => { setDescription(e.target.value); transcriptRef.current = e.target.value }}
            onInput={e => { const v = (e.target as HTMLTextAreaElement).value; setDescription(v); transcriptRef.current = v }}
            placeholder="Your dream will appear here as you speak... or type directly"
            rows={5}
            style={{
              width: '100%',
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: 'rgba(255,150,150,0.85)',
              fontSize: '0.95rem',
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
              borderTop: '1px solid rgba(180,40,40,0.12)',
              outline: 'none',
              color: 'rgba(220,100,100,0.55)',
              fontSize: '0.8rem',
              padding: '0.5rem 0 0',
              fontFamily: 'inherit',
              boxSizing: 'border-box',
            }}
          />
        </div>

        {/* Angel number quick tags */}
        <div style={{ width: '100%', display: 'flex', gap: '0.4rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          {['111','222','333','444','555','777','888','999','1111'].map(n => (
            <button key={n}
              onClick={() => setAngelNumbers(prev => prev ? prev + ',' + n : n)}
              style={{
                padding: '0.35rem 0.65rem',
                borderRadius: '0.4rem',
                border: `1px solid ${angelNumbers.includes(n) ? 'rgba(200,80,80,0.5)' : 'rgba(180,40,40,0.2)'}`,
                background: angelNumbers.includes(n) ? 'rgba(180,40,40,0.2)' : 'transparent',
                color: angelNumbers.includes(n) ? 'rgba(240,120,120,0.9)' : 'rgba(200,80,80,0.5)',
                fontSize: '0.7rem',
                cursor: 'pointer',
                transition: 'all 0.2s',
                WebkitTapHighlightColor: 'transparent',
              }}>
              {n}
            </button>
          ))}
        </div>

        {/* Save button */}
        <button
          onClick={handleSave}
          onTouchEnd={e => { e.preventDefault(); handleSave() }}
          disabled={saving}
          style={{
            width: '100%',
            padding: '1rem',
            borderRadius: '0.75rem',
            border: `1px solid ${saved ? 'rgba(40,160,40,0.4)' : 'rgba(180,40,40,0.35)'}`,
            background: saved ? 'rgba(40,120,40,0.25)' : 'rgba(160,30,30,0.2)',
            color: saved ? 'rgba(100,220,100,0.9)' : 'rgba(220,90,90,0.9)',
            fontSize: '0.95rem',
            cursor: 'pointer',
            letterSpacing: '0.12em',
            transition: 'all 0.3s',
            boxSizing: 'border-box',
            fontWeight: 500,
          }}
        >
          {saved ? '✓ Dream Saved' : saving ? 'Saving...' : 'Save Dream'}
        </button>

        {/* Premium: Sleep Sounds */}
        <div style={{ width: '100%' }}>
          <FeatureGate feature="sleep_sounds" requiredTier="mystic">
            <SleepSounds />
          </FeatureGate>
        </div>

        <p style={{ textAlign: 'center', fontSize: '0.55rem', color: 'rgba(140,30,30,0.2)', letterSpacing: '0.1em', margin: 0 }}>Screen dimmed to preserve night vision</p>
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
              <label style={{ display: 'block', fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', marginBottom: '0.75rem' }}>Voice to Text</label>
              <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', marginBottom: '0.75rem', lineHeight: 1.5 }}>Tap the mic and speak — your words will appear in the description above.</p>
              <button
                onClick={toggleVoice}
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.5rem',
                  padding: '0.6rem 1.25rem', borderRadius: '9999px',
                  background: isListening ? 'rgba(255,80,120,0.2)' : 'rgba(200,150,255,0.1)',
                  border: `1px solid ${isListening ? 'rgba(255,80,120,0.5)' : 'rgba(200,150,255,0.25)'}`,
                  color: isListening ? '#ff8099' : 'rgba(200,150,255,0.7)',
                  cursor: 'pointer', fontSize: '0.8rem',
                  transition: 'all 0.3s ease',
                  boxShadow: isListening ? '0 0 16px rgba(255,80,120,0.2)' : 'none',
                }}
              >
                <span style={{ fontSize: '1.1rem' }}>{isListening ? '⏹' : '🎙️'}</span>
                <span>{isListening ? 'Stop Recording' : 'Start Speaking'}</span>
                {isListening && <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#ff5078', boxShadow: `0 0 ${pulse ? '8px' : '3px'} #ff5078`, transition: 'box-shadow 0.3s' }} />}
              </button>
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
                    x
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
                  {/* Free-user upsell teaser — deeper Oracle dream reading (parity with AngelLogger) */}
                  {!isPremiumUser && dream.reading && (
                    <div style={{
                      margin: '0 0 0.75rem', borderRadius: '0.75rem', overflow: 'hidden',
                      border: '1px solid rgba(201,168,76,0.3)', background: 'rgba(201,168,76,0.05)',
                    }}>
                      <div style={{
                        padding: '0.6rem 0.85rem', background: 'rgba(201,168,76,0.1)',
                        borderBottom: '1px solid rgba(201,168,76,0.2)',
                        display: 'flex', alignItems: 'center', gap: '0.5rem',
                      }}>
                        <span style={{ fontSize: '0.95rem' }}>🔮</span>
                        <span style={{ color: 'rgba(201,168,76,0.9)', fontSize: '0.65rem', fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                          The Oracle sensed something deeper in this dream…
                        </span>
                      </div>
                      <div style={{ padding: '0.85rem', position: 'relative' }}>
                        <div style={{
                          filter: 'blur(5px)', userSelect: 'none', pointerEvents: 'none',
                          color: 'rgba(255,255,255,0.55)', fontSize: '0.8rem', lineHeight: 1.6,
                          marginBottom: '0.85rem',
                        }}>
                          The Oracle reads your dream as a layered message tuned to your numerology and the symbols you recorded — a personalized interpretation of what your subconscious is processing and the path it points toward...
                        </div>
                        <div style={{
                          position: 'absolute', top: '0.85rem', left: 0, right: 0,
                          display: 'flex', justifyContent: 'center',
                        }}>
                          <span style={{ fontSize: '1.4rem' }}>🔒</span>
                        </div>
                        <a href="/dashboard/upgrade" style={{
                          display: 'block', width: '100%', padding: '0.7rem',
                          borderRadius: '9999px', textAlign: 'center', textDecoration: 'none',
                          background: 'linear-gradient(135deg, rgba(201,168,76,0.25), rgba(180,140,50,0.2))',
                          border: '1px solid rgba(201,168,76,0.4)',
                          color: 'rgba(201,168,76,0.95)', fontSize: '0.82rem', fontWeight: 600,
                          letterSpacing: '0.05em',
                        }}>
                          Unlock My Full Dream Reading ✦
                        </a>
                        <p style={{ color: 'rgba(200,180,255,0.3)', fontSize: '0.7rem', marginTop: '0.5rem', textAlign: 'center' }}>
                          Mystic tier · $6.99/mo · Cancel anytime
                        </p>
                      </div>
                    </div>
                  )}
                  {/* Song Recommendation */}
                  {dreamRecLoading === dream.id && (
                    <p style={{ color: 'rgba(201,168,76,0.5)', fontSize: '0.75rem', textAlign: 'center', marginBottom: '0.75rem' }}>🎵 Finding your healing music...</p>
                  )}
                  {dreamRecs[dream.id] && !dreamRecLoading && (
                    <div style={{ marginBottom: '0.75rem' }}>
                      <SongRecommendationCard recommendation={dreamRecs[dream.id]!} mode="spiritual" />
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
