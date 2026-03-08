'use client'

import { useState, useRef } from 'react'
import { saveLog, AngelLog } from '@/lib/storage'
import { getAngelMeaning, QUICK_NUMBERS } from '@/lib/angel-meanings'
import VoiceRecorder from './VoiceRecorder'

interface Props {
  onLogged: (log: AngelLog) => void
}

export default function AngelLogger({ onLogged }: Props) {
  const [selected, setSelected] = useState<string>('')
  const [custom, setCustom] = useState<string>('')
  const [thought, setThought] = useState<string>('')
  const [screenshot, setScreenshot] = useState<string | null>(null)
  const [screenshotName, setScreenshotName] = useState<string>('')
  const [voiceNoteUrl, setVoiceNoteUrl] = useState<string | null>(null)
  const [step, setStep] = useState<'pick' | 'thought' | 'done'>('pick')
  const [lastLog, setLastLog] = useState<AngelLog | null>(null)
  const [saving, setSaving] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const activeNumber = custom || selected
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
    await new Promise(r => setTimeout(r, 600))
    const log = saveLog({ number: activeNumber, thought, screenshotUrl: screenshot })
    setLastLog(log)
    setStep('done')
    setSaving(false)
    onLogged(log)
  }

  function handleReset() {
    setSelected(''); setCustom(''); setThought('')
    setScreenshot(null); setScreenshotName('')
    setVoiceNoteUrl(null)
    setStep('pick'); setLastLog(null)
  }

  // ── DONE ──────────────────────────────────────────────────────────────────
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
        <h3 style={{ color: lastLog.readingColor, fontSize: '1.5rem', marginBottom: '0.5rem', fontFamily: 'Cormorant Garamond, serif' }}>
          {lastLog.readingTitle}
        </h3>
        <p style={{ color: 'rgba(220,200,255,0.6)', fontSize: '0.875rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
          {lastLog.miniReading}
        </p>
        {lastLog.truthScore && (
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: '0.5rem',
            padding: '0.5rem 1.25rem', borderRadius: '9999px', marginBottom: '1.5rem',
            background: 'rgba(68,255,170,0.1)', border: '1px solid rgba(68,255,170,0.3)',
            color: '#44ffaa', fontSize: '0.8rem', fontWeight: 500,
          }}>✦ Angel Approved · Truth Score Verified</div>
        )}
        <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
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
      </div>
    )
  }

  // ── THOUGHT ───────────────────────────────────────────────────────────────
  if (step === 'thought') {
    return (
      <div style={{
        background: 'rgba(10,8,30,0.85)', border: '1px solid rgba(200,180,255,0.2)',
        borderRadius: '1.5rem', padding: '2rem', backdropFilter: 'blur(20px)',
        position: 'relative', zIndex: 10,
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
            Screenshot Proof <span style={{ color: 'rgba(68,255,170,0.7)' }}>→ Angel Approved Badge</span>
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
                <p style={{ color: '#44ffaa', fontSize: '0.8rem', fontWeight: 600 }}>✦ Angel Approved · Truth Score Active</p>
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
            }}>📸 Upload screenshot for Angel Approved badge (optional)</button>
          )}
        </div>

        <button onClick={handleSave} disabled={saving} style={{
          width: '100%', padding: '0.875rem', borderRadius: '9999px',
          background: 'linear-gradient(135deg, rgba(180,120,255,0.3), rgba(100,80,200,0.3))',
          border: '1px solid rgba(200,150,255,0.4)', color: 'rgba(230,210,255,0.95)',
          cursor: saving ? 'not-allowed' : 'pointer', fontSize: '0.95rem',
          fontWeight: 500, letterSpacing: '0.05em', opacity: saving ? 0.7 : 1,
        }}>
          {saving ? '✦ Logging to the cosmos...' : 'Log This Number ✦'}
        </button>
      </div>
    )
  }

  // ── PICK ──────────────────────────────────────────────────────────────────
  return (
    <div style={{
      background: 'rgba(10,8,30,0.85)', border: '1px solid rgba(200,180,255,0.15)',
      borderRadius: '1.5rem', padding: '2rem', backdropFilter: 'blur(20px)',
      position: 'relative', zIndex: 10,
    }}>
      <h2 style={{ color: 'rgba(220,200,255,0.9)', fontSize: '1.5rem', textAlign: 'center', marginBottom: '0.25rem', fontFamily: 'Cormorant Garamond, serif', fontWeight: 300 }}>
        What did you see?
      </h2>
      <p style={{ textAlign: 'center', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'rgba(200,180,255,0.35)', marginBottom: '2rem' }}>
        Tap a number or enter your own
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem', marginBottom: '1.5rem' }}>
        {QUICK_NUMBERS.map(num => {
          const m = getAngelMeaning(num)
          const isSelected = selected === num
          return (
            <button key={num} onClick={() => handleQuickPick(num)} style={{
              borderRadius: '0.75rem', padding: '0.875rem 0.5rem', textAlign: 'center',
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
          type="text" value={custom}
          onChange={e => setCustom(e.target.value.replace(/\D/g, '').slice(0, 6))}
          onKeyDown={e => e.key === 'Enter' && handleCustomSubmit()}
          placeholder="Other number..."
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
