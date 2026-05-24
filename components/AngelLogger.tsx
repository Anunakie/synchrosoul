'use client'

import { useState, useRef, useEffect } from 'react'
import { saveLog, AngelLog, updateLogRecommendation } from '@/lib/storage'
import { getAngelMeaning, QUICK_NUMBERS } from '@/lib/angel-meanings'
import VoiceRecorder from './VoiceRecorder'
import { createClient } from '@/lib/supabase/client'
import { useTheme } from '@/lib/theme-context'
import SongRecommendationCard, { type SongRecommendationData } from './SongRecommendationCard'
import { saveSongRecommendation } from '@/lib/song-recommendations'
import ShareModal from './ShareModal'

interface Props {
  onLogged?: (log: AngelLog) => void
}

async function getSubscriptionTier(): Promise<string> {
  try {
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return 'free'
    const { data } = await supabase
      .from('profiles')
      .select('subscription_tier')
      .eq('id', user.id)
      .single()
    return data?.subscription_tier || 'free'
  } catch {
    return 'free'
  }
}

function isPremium(tier: string): boolean {
  return tier === 'mystic' || tier === 'twin-flame' || tier === 'twin_flame'
}

export default function AngelLogger({ onLogged }: Props) {
  const { theme } = useTheme()
  const isSim = theme === 'simulation'
  const [selected, setSelected] = useState<string>('')
  const [custom, setCustom] = useState<string>('')
  const [thought, setThought] = useState<string>('')
  const [screenshot, setScreenshot] = useState<string | null>(null)
  const [screenshotName, setScreenshotName] = useState<string>('')
  const [voiceNoteUrl, setVoiceNoteUrl] = useState<string | null>(null)
  const [step, setStep] = useState<'pick' | 'thought' | 'done'>('pick')
  const [lastLog, setLastLog] = useState<AngelLog | null>(null)
  const [saving, setSaving] = useState(false)
  const [upgradeTeaser, setUpgradeTeaser] = useState<string | null>(null)
  const [personalizedReading, setPersonalizedReading] = useState<boolean>(false)
  const [songRec, setSongRec] = useState<SongRecommendationData | null>(null)
  const [songRecLoading, setSongRecLoading] = useState<boolean>(false)
  const [showShareModal, setShowShareModal] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const activeNumber = custom || selected

  // Persist song recommendation to Supabase (cross-device) and localStorage (fast cache)
  useEffect(() => {
    if (lastLog && songRec) {
      saveSongRecommendation(lastLog.id, songRec)
      // Also save to Supabase for cross-device sync
      updateLogRecommendation(lastLog.id, songRec as unknown as Record<string, unknown>).catch(() => {})
    }
  }, [lastLog, songRec])
  const meaning = activeNumber ? getAngelMeaning(activeNumber) : null

  function handleQuickPick(num: string) {
    setSelected(num); setCustom(''); setStep('thought')
  }

  function handleCustomSubmit() {
    const n = custom.replace(/\D/g, '')
    if (!n) return
    setCustom(n); setSelected(''); setStep('thought')
  }

  function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    setScreenshotName(file.name)
    const reader = new FileReader()
    reader.onload = (ev) => setScreenshot(ev.target?.result as string)
    reader.readAsDataURL(file)
  }

  async function handleSave() {
    if (!activeNumber) return
    setSaving(true)
    setUpgradeTeaser(null)
    setPersonalizedReading(false)

    const hasThought = thought.trim().length > 0
    let miniReadingOverride: string | undefined
    let readingTitleOverride: string | undefined

    if (hasThought) {
      const tier = await getSubscriptionTier()
      if (isPremium(tier)) {
        // Premium: get AI-personalized reading based on thought
        try {
          const supabase = createClient()
          const { data: { user } } = await supabase.auth.getUser()
          let numerologyProfile = null
          if (user) {
            const { data } = await supabase
              .from('profiles')
              .select('life_path_number, soul_urge_number, destiny_number')
              .eq('id', user.id)
              .single()
            if (data) numerologyProfile = {
              lifePathNumber: data.life_path_number,
              soulUrgeNumber: data.soul_urge_number,
              destinyNumber: data.destiny_number,
            }
          }
          const res = await fetch('/api/oracle/instant', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              number: activeNumber,
              thoughtAnchor: thought.trim(),
              numerologyProfile,
              mode: theme === 'simulation' ? 'simulation' : 'spiritual'
            }),
          })
          if (res.ok) {
            const data = await res.json()
            if (data.reading) {
              miniReadingOverride = data.reading
              readingTitleOverride = data.title
              setPersonalizedReading(true)

              // Fire off song recommendation request (non-blocking)
              setSongRecLoading(true)
              fetch('/api/musical-healers/recommend', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  number: activeNumber,
                  thought: thought.trim(),
                  reading: data.reading,
                  readingType: 'oracle_instant',
                  mode: theme === 'simulation' ? 'simulation' : 'spiritual',
                }),
              }).then(r => r.json()).then(d => {
                if (d.recommendation) setSongRec(d.recommendation)
              }).catch(() => {}).finally(() => setSongRecLoading(false))
            }
          }
        } catch {
          // Fall back to generic reading
        }
      } else {
        // Free user with thought: save generic, show upgrade teaser
        const snippet = thought.trim().slice(0, 45)
        setUpgradeTeaser(snippet)
      }
    }

    await new Promise(r => setTimeout(r, 600))
    const log = await saveLog({
      number: activeNumber,
      thought,
      screenshotUrl: screenshot,
      miniReadingOverride,
      readingTitleOverride,
    })
    setLastLog(log)
    setStep('done')
    setSaving(false)
    onLogged?.(log)

    // Soul Twin Alert
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        fetch('/api/soul-twin-alert', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ number: activeNumber, userId: user.id }),
        }).catch(() => {})
      }
    } catch {}
  }

  function handleReset() {
    setSelected(''); setCustom(''); setThought('')
    setScreenshot(null); setScreenshotName('')
    setVoiceNoteUrl(null)
    setStep('pick'); setLastLog(null)
    setUpgradeTeaser(null); setPersonalizedReading(false); setSongRec(null); setSongRecLoading(false)
  }

  // DONE
  if (step === 'done' && lastLog) {
    return (
      <div style={{
        background: 'rgba(10,8,30,0.85)', border: `1px solid ${lastLog.readingColor}44`,
        borderRadius: '1.5rem', padding: '2rem', textAlign: 'center',
        backdropFilter: 'blur(20px)', position: 'relative', zIndex: 10,
      }}>
        <div style={{
          width: '5rem', height: '5rem', borderRadius: '50%',
          background: `radial-gradient(circle, ${lastLog.readingColor}33 0%, transparent 70%)`,
          border: `1px solid ${lastLog.readingColor}55`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 1.5rem', fontSize: '2rem',
        }}>✦</div>

        <div style={{
          display: 'inline-block', padding: '0.25rem 1rem', borderRadius: '9999px',
          marginBottom: '0.75rem', background: lastLog.readingColor + '22',
          color: lastLog.readingColor, border: `1px solid ${lastLog.readingColor}44`,
          fontSize: '0.75rem', letterSpacing: '0.15em', textTransform: 'uppercase',
        }}>{lastLog.number}</div>

        {personalizedReading && (
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
            padding: '0.2rem 0.75rem', borderRadius: '9999px', marginBottom: '0.75rem',
            marginLeft: '0.5rem',
            background: 'rgba(255,200,80,0.12)', border: '1px solid rgba(255,200,80,0.35)',
            color: '#ffc850', fontSize: '0.7rem', letterSpacing: '0.1em',
          }}>✦ AI-Personalized Reading</div>
        )}

        <h3 style={{ color: lastLog.readingColor, fontSize: '1.5rem', marginBottom: '0.5rem', fontFamily: 'Cormorant Garamond, serif' }}>
          {lastLog.readingTitle}
        </h3>
        <p style={{ color: 'rgba(220,200,255,0.6)', fontSize: '0.875rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
          {lastLog.miniReading}
        </p>

        {/* Song Recommendation Card */}
        {songRec && (
          <SongRecommendationCard recommendation={songRec} mode={isSim ? 'simulation' : 'spiritual'} />
        )}
        {songRecLoading && !songRec && (
          <div style={{ marginTop: '0.75rem', textAlign: 'center' }}>
            <span style={{ color: 'rgba(201,168,76,0.4)', fontSize: '0.7rem' }}>{isSim ? '📡 Scanning audio frequencies...' : '🎵 Finding your healing music...'}</span>
          </div>
        )}

        {lastLog.truthScore && (
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
            padding: '0.5rem 1.25rem', borderRadius: '9999px', marginBottom: '1.5rem',
            background: 'rgba(68,255,170,0.1)', border: '1px solid rgba(68,255,170,0.3)',
            color: '#44ffaa', fontSize: '0.8rem', fontWeight: 500,
          }}>{isSim ? '>> SIGNAL VERIFIED · DATA INTEGRITY CONFIRMED' : '✦ Angel Approved · Truth Score Verified'}</div>
        )}

        {/* Upgrade teaser for free users who entered a thought */}
        {upgradeTeaser && (
          <div style={{
            margin: '0 0 1.5rem', borderRadius: '1rem', overflow: 'hidden',
            border: '1px solid rgba(255,180,80,0.3)',
            background: 'rgba(255,150,50,0.06)',
          }}>
            <div style={{
              padding: '0.75rem 1rem',
              background: 'rgba(255,180,80,0.1)',
              borderBottom: '1px solid rgba(255,180,80,0.2)',
              display: 'flex', alignItems: 'center', gap: '0.5rem',
            }}>
              <span style={{ fontSize: '1rem' }}>🔮</span>
              <span style={{ color: '#ffb850', fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                Your Personalized Reading is Waiting
              </span>
            </div>
            <div style={{ padding: '1rem', position: 'relative' }}>
              <p style={{ color: 'rgba(220,200,255,0.5)', fontSize: '0.8rem', marginBottom: '0.75rem', fontStyle: 'italic' }}>
                The universe heard your thought about &ldquo;{upgradeTeaser}{upgradeTeaser.length >= 45 ? '...' : ''}&rdquo;
              </p>
              {/* Blurred fake reading preview */}
              <div style={{
                filter: 'blur(5px)', userSelect: 'none', pointerEvents: 'none',
                color: 'rgba(220,200,255,0.7)', fontSize: '0.875rem', lineHeight: 1.6,
                marginBottom: '1rem',
              }}>
                The angel number {lastLog.number} is responding directly to what you were holding in your mind. This synchronicity carries a specific message about your path forward and the energy you are currently...
              </div>
              <div style={{
                position: 'absolute', top: '2.5rem', left: 0, right: 0,
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem',
              }}>
                <span style={{ fontSize: '1.5rem' }}>🔒</span>
              </div>
              <a href="/dashboard/upgrade" style={{
                display: 'block', width: '100%', padding: '0.75rem',
                borderRadius: '9999px', textAlign: 'center', textDecoration: 'none',
                background: 'linear-gradient(135deg, rgba(255,180,80,0.25), rgba(255,120,50,0.2))',
                border: '1px solid rgba(255,180,80,0.4)',
                color: '#ffb850', fontSize: '0.875rem', fontWeight: 600,
                letterSpacing: '0.05em',
              }}>
                Unlock My Personalized Reading ✦
              </a>
              <p style={{ color: 'rgba(200,180,255,0.3)', fontSize: '0.7rem', marginTop: '0.5rem' }}>
                Mystic tier · $6.99/mo · Cancel anytime
              </p>
            </div>
          </div>
        )}

        {/* Blurred song recommendation teaser for free users */}
        {upgradeTeaser && !songRec && (
          <div style={{
            margin: '0 0 1.5rem', borderRadius: '1rem', overflow: 'hidden',
            border: `1px solid ${isSim ? 'rgba(0,255,140,0.2)' : 'rgba(201,168,76,0.2)'}`,
            background: isSim ? 'rgba(0,255,140,0.04)' : 'rgba(201,168,76,0.04)',
          }}>
            <div style={{
              padding: '0.75rem 1rem',
              background: isSim ? 'rgba(0,255,140,0.08)' : 'rgba(201,168,76,0.08)',
              borderBottom: `1px solid ${isSim ? 'rgba(0,255,140,0.15)' : 'rgba(201,168,76,0.15)'}`,
              display: 'flex', alignItems: 'center', gap: '0.5rem',
            }}>
              <span style={{ fontSize: '1rem' }}>{isSim ? '📡' : '🎵'}</span>
              <span style={{
                color: isSim ? 'rgba(0,255,140,0.8)' : 'rgba(201,168,76,0.8)',
                fontSize: '0.7rem', fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase',
              }}>
                {isSim ? 'Audio Frequency Match Detected' : 'A Healing Song Was Chosen For This Moment'}
              </span>
            </div>
            <div style={{ padding: '1.25rem', position: 'relative' }}>
              {/* Blurred fake song preview */}
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '0.75rem' }}>
                <div style={{
                  width: '50px', height: '50px', borderRadius: '0.75rem',
                  background: isSim ? 'rgba(0,255,140,0.1)' : 'rgba(201,168,76,0.1)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  filter: 'blur(3px)',
                }}>
                  <span style={{ fontSize: '1.5rem' }}>{isSim ? '📡' : '🎵'}</span>
                </div>
                <div style={{ filter: 'blur(5px)', userSelect: 'none', pointerEvents: 'none' }}>
                  <div style={{
                    color: 'rgba(220,200,255,0.8)', fontSize: '1rem', fontWeight: 600, marginBottom: '0.25rem',
                  }}>Sands of Tranquility</div>
                  <div style={{
                    color: 'rgba(200,180,255,0.5)', fontSize: '0.8rem',
                  }}>by Celestial Artist</div>
                </div>
              </div>
              <div style={{
                filter: 'blur(5px)', userSelect: 'none', pointerEvents: 'none',
                color: 'rgba(200,180,255,0.5)', fontSize: '0.8rem', lineHeight: 1.6, fontStyle: 'italic',
                marginBottom: '1rem',
              }}>
                This contemplative piece resonates deeply with the energy of your reading, weaving together themes of transformation and inner peace...
              </div>
              {/* Lock overlay */}
              <div style={{
                position: 'absolute', top: '0.75rem', left: 0, right: 0, bottom: '3.5rem',
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                gap: '0.25rem',
              }}>
                <span style={{ fontSize: '1.5rem' }}>🔒</span>
              </div>
              <a href="/dashboard/upgrade" style={{
                display: 'block', width: '100%', padding: '0.75rem',
                borderRadius: '9999px', textAlign: 'center', textDecoration: 'none',
                background: isSim
                  ? 'linear-gradient(135deg, rgba(0,255,140,0.2), rgba(0,200,120,0.15))'
                  : 'linear-gradient(135deg, rgba(201,168,76,0.2), rgba(180,140,50,0.15))',
                border: `1px solid ${isSim ? 'rgba(0,255,140,0.35)' : 'rgba(201,168,76,0.35)'}`,
                color: isSim ? 'rgba(0,255,140,0.9)' : 'rgba(201,168,76,0.9)',
                fontSize: '0.85rem', fontWeight: 600, letterSpacing: '0.05em',
              }}>
                {isSim ? 'Unlock Audio Frequency Match ✦' : 'Unlock Your Healing Song ✦'}
              </a>
              <p style={{ color: 'rgba(200,180,255,0.3)', fontSize: '0.7rem', marginTop: '0.5rem', textAlign: 'center' }}>
                Mystic tier · $6.99/mo · Cancel anytime
              </p>
            </div>
          </div>
        )}

        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button onClick={() => setShowShareModal(true)} style={{
            padding: '0.6rem 1.5rem', borderRadius: '9999px',
            background: 'linear-gradient(135deg, rgba(201,168,76,0.15), rgba(167,139,250,0.15))',
            border: '1px solid rgba(201,168,76,0.3)',
            color: '#c9a84c', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 600,
          }}>📤 Share</button>
          <button onClick={handleReset} style={{
            padding: '0.6rem 1.5rem', borderRadius: '9999px',
            background: 'rgba(200,150,255,0.15)', border: '1px solid rgba(200,150,255,0.4)',
            color: 'rgba(220,180,255,0.9)', cursor: 'pointer', fontSize: '0.875rem',
          }}>Log Another</button>
          <a href="/dashboard/journal" style={{
            padding: '0.6rem 1.5rem', borderRadius: '9999px', background: 'transparent',
            border: '1px solid rgba(200,180,255,0.2)', color: 'rgba(200,180,255,0.6)',
            cursor: 'pointer', fontSize: '0.875rem', textDecoration: 'none', display: 'inline-block',
          }}>View Journal</a>
        </div>

        {showShareModal && lastLog && (
          <ShareModal
            type="angel-number"
            headline={isSim ? `Signal ${lastLog.number} Intercepted` : `Angel Number ${lastLog.number}`}
            body={lastLog.miniReading || meaning?.message || 'A divine message for your journey'}
            accent={isSim ? `Frequency logged at ${new Date(lastLog.createdAt).toLocaleTimeString()}` : (meaning?.title || '')}
            footer={new Date(lastLog.createdAt).toLocaleDateString()}
            simulation={isSim}
            fileName={`synchrosoul-angel-${lastLog.number}`}
            onClose={() => setShowShareModal(false)}
          />
        )}
      </div>
    )
  }

  // THOUGHT
  if (step === 'thought') {
    return (
      <div style={{
        background: 'rgba(10,8,30,0.85)', border: '1px solid rgba(200,180,255,0.2)',
        borderRadius: '1.5rem', padding: '1.5rem 1rem', backdropFilter: 'blur(20px)',
        position: 'relative', zIndex: 10, overflowX: 'hidden' as const,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
          <button onClick={() => setStep('pick')} style={{
            color: 'rgba(200,180,255,0.4)', fontSize: '1.2rem',
            background: 'none', border: 'none', cursor: 'pointer', padding: '0.25rem',
          }}>←</button>
          <div>
            <div style={{
              display: 'inline-block', padding: '0.2rem 0.75rem', borderRadius: '9999px',
              fontSize: '0.875rem', fontWeight: 700, letterSpacing: '0.1em',
              background: (meaning?.color || '#fff') + '22', color: meaning?.color || '#fff',
              border: `1px solid ${meaning?.color || '#fff'}44`,
            }}>{activeNumber}</div>
            {meaning && <p style={{ color: 'rgba(200,180,255,0.5)', fontSize: '0.75rem', marginTop: '0.25rem' }}>{meaning.title}</p>}
          </div>
        </div>

        {/* Premium hint */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '0.5rem',
          padding: '0.5rem 0.75rem', borderRadius: '0.75rem', marginBottom: '1rem',
          background: 'rgba(255,200,80,0.06)', border: '1px solid rgba(255,200,80,0.15)',
        }}>
          <span style={{ fontSize: '0.85rem' }}>✨</span>
          <p style={{ color: 'rgba(255,200,80,0.7)', fontSize: '0.7rem', margin: 0 }}>
            <strong style={{ color: 'rgba(255,200,80,0.9)' }}>Mystic members</strong> get an AI reading tailored to exactly what you were thinking
          </p>
        </div>

        {/* Thought input with voice */}
        <div style={{ marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <label style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'rgba(200,180,255,0.5)' }}>
              What were you thinking just before you saw this?
            </label>
            <VoiceRecorder
              compact
              onTranscript={(t) => setThought(t)}
            />
          </div>
          <textarea
            value={thought}
            onChange={e => setThought(e.target.value)}
            placeholder="A thought, a feeling, a question you were holding... or tap 🎙️ to speak"
            rows={3}
            style={{
              width: '100%', borderRadius: '0.75rem', padding: '1rem',
              fontSize: '0.875rem', resize: 'none', outline: 'none',
              background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(200,180,255,0.2)',
              color: 'rgba(255,255,255,0.8)', fontFamily: 'inherit', boxSizing: 'border-box',
            }}
          />
          <p style={{ fontSize: '0.7rem', color: 'rgba(200,180,255,0.25)', marginTop: '0.25rem' }}>Optional · 100% private · tap 🎙️ to speak</p>
        </div>

        {/* Screenshot / Truth Score */}
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'rgba(200,180,255,0.5)', marginBottom: '0.5rem' }}>
            {isSim ? 'UPLOAD PROOF FILE' : 'Screenshot Proof'} <span style={{ color: 'rgba(68,255,170,0.7)' }}>{isSim ? '→ SIGNAL VERIFIED STATUS' : '→ Angel Approved Badge'}</span>
          </label>
          <input ref={fileRef} type="file" accept="image/*" onChange={handleFileUpload} style={{ display: 'none' }} />
          {screenshot ? (
            <div style={{
              display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem',
              borderRadius: '0.75rem', background: 'rgba(68,255,170,0.08)',
              border: '1px solid rgba(68,255,170,0.25)',
            }}>
              <img src={screenshot} alt="proof" style={{ width: '3rem', height: '3rem', borderRadius: '0.5rem', objectFit: 'cover' }} />
              <div style={{ flex: 1 }}>
                <p style={{ color: '#44ffaa', fontSize: '0.8rem', fontWeight: 600 }}>{isSim ? '>> ANOMALY CONFIRMED · SIGNAL LOCKED' : '❖ Angel Approved · Truth Score Active'}</p>
                <p style={{ color: 'rgba(200,180,255,0.4)', fontSize: '0.7rem' }}>{screenshotName}</p>
              </div>
              <button onClick={() => { setScreenshot(null); setScreenshotName('') }}
                style={{ color: 'rgba(200,180,255,0.3)', fontSize: '1.1rem', background: 'none', border: 'none', cursor: 'pointer' }}>×</button>
            </div>
          ) : (
            <button onClick={() => fileRef.current?.click()} style={{
              width: '100%', padding: '1rem', borderRadius: '0.75rem',
              background: 'rgba(255,255,255,0.03)', border: '1px dashed rgba(200,180,255,0.2)',
              color: 'rgba(200,180,255,0.4)', cursor: 'pointer', fontSize: '0.875rem',
            }}>{isSim ? '>> UPLOAD PROOF FILE — SIGNAL VERIFIED STATUS (optional)' : '📸 Upload screenshot for Angel Approved badge (optional)'}</button>
          )}
        </div>

        <button onClick={handleSave} disabled={saving} style={{
          width: '100%', padding: '0.875rem', borderRadius: '9999px',
          background: 'linear-gradient(135deg, rgba(180,120,255,0.3), rgba(100,80,200,0.3))',
          border: '1px solid rgba(200,150,255,0.4)', color: 'rgba(230,210,255,0.95)',
          cursor: saving ? 'not-allowed' : 'pointer', fontSize: '0.95rem',
          fontWeight: 500, letterSpacing: '0.05em', opacity: saving ? 0.7 : 1,
        }}>
          {saving ? isSim ? '>> PROCESSING ANOMALY...' : '❖ Channeling your reading...' : isSim ? '>> SUBMIT ANOMALY CODE' : 'Log This Number ❖'}
        </button>
      </div>
    )
  }

  // PICK
  return (
    <div style={{
      background: 'rgba(10,8,30,0.85)', border: '1px solid rgba(200,180,255,0.15)',
      borderRadius: '1.5rem', padding: '1.5rem 1rem', backdropFilter: 'blur(20px)',
      position: 'relative', zIndex: 10, overflowX: 'hidden' as const,
    }}>
      <h2 style={{ color: 'rgba(220,200,255,0.9)', fontSize: '1.5rem', textAlign: 'center', marginBottom: '0.25rem', fontFamily: 'Cormorant Garamond, serif', fontWeight: 300 }}>
        {isSim ? 'ANOMALY DETECTED' : 'What did you see?'}
      </h2>
      <p style={{ textAlign: 'center', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'rgba(200,180,255,0.35)', marginBottom: '2rem' }}>
        {isSim ? 'SELECT OR ENTER ANOMALY CODE' : 'Tap a number or enter your own'}
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.375rem', marginBottom: '1.5rem' }}>
        {QUICK_NUMBERS.map(num => {
          const m = getAngelMeaning(num)
          const isSelected = selected === num
          return (
            <button key={num} onClick={() => handleQuickPick(num)} style={{
              borderRadius: '0.75rem', padding: '0.75rem 0.25rem', textAlign: 'center',
              cursor: 'pointer',
              background: isSelected ? m.color + '25' : 'rgba(255,255,255,0.05)',
              border: `1px solid ${isSelected ? m.color + '77' : 'rgba(200,180,255,0.15)'}`,
              color: isSelected ? m.color : 'rgba(220,200,255,0.75)',
              boxShadow: isSelected ? `0 0 20px ${m.color}22` : 'none',
              fontWeight: 700, fontSize: '0.875rem', letterSpacing: '0.05em',
              transition: 'all 0.15s ease', WebkitTapHighlightColor: 'transparent',
            }}>{num}</button>
          )
        })}
      </div>
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <input
          type="text" inputMode="numeric" value={custom}
          onChange={e => { setCustom(e.target.value.replace(/\D/g, '').slice(0, 8)); setSelected(''); }}
          onKeyDown={e => e.key === 'Enter' && handleCustomSubmit()}
          placeholder="Type any number (e.g. 55555)"
          style={{
            flex: 1, borderRadius: '0.75rem', padding: '0.75rem 1rem',
            fontSize: '0.875rem', outline: 'none', background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(200,180,255,0.15)', color: 'rgba(255,255,255,0.8)', fontFamily: 'inherit',
          }}
        />
        <button onClick={handleCustomSubmit} disabled={!custom} style={{
          padding: '0.75rem 1.25rem', borderRadius: '0.75rem',
          background: custom ? 'rgba(200,150,255,0.15)' : 'rgba(255,255,255,0.04)',
          border: `1px solid ${custom ? 'rgba(200,150,255,0.4)' : 'rgba(200,180,255,0.1)'}`,
          color: custom ? 'rgba(220,180,255,0.9)' : 'rgba(200,180,255,0.3)',
          cursor: custom ? 'pointer' : 'not-allowed', fontSize: '0.875rem',
        }}>Next →</button>
      </div>
    </div>
  )
}
