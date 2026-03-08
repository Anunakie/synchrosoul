'use client'

import { useState, useRef } from 'react'
import { saveLog, AngelLog } from '@/lib/storage'
import { getAngelMeaning, QUICK_NUMBERS } from '@/lib/angel-meanings'

interface Props {
  onLogged: (log: AngelLog) => void
}

export default function AngelLogger({ onLogged }: Props) {
  const [selected, setSelected] = useState<string>('')
  const [custom, setCustom] = useState<string>('')
  const [thought, setThought] = useState<string>('')
  const [screenshot, setScreenshot] = useState<string | null>(null)
  const [screenshotName, setScreenshotName] = useState<string>('')
  const [step, setStep] = useState<'pick' | 'thought' | 'done'>('pick')
  const [lastLog, setLastLog] = useState<AngelLog | null>(null)
  const [saving, setSaving] = useState(false)
  const fileRef = useRef<HTMLInputElement>(null)

  const activeNumber = custom || selected
  const meaning = activeNumber ? getAngelMeaning(activeNumber) : null

  function handleQuickPick(num: string) {
    setSelected(num)
    setCustom('')
    setStep('thought')
  }

  function handleCustomSubmit() {
    const n = custom.replace(/\D/g, '')
    if (!n) return
    setCustom(n)
    setSelected('')
    setStep('thought')
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
    setStep('pick'); setLastLog(null)
  }

  if (step === 'done' && lastLog) {
    return (
      <div className="glass-card p-8 text-center animate-fade-in-up" style={{ borderColor: lastLog.readingColor + '44' }}>
        {/* Success burst */}
        <div className="mb-6 relative inline-flex items-center justify-center">
          <div className="w-24 h-24 rounded-full flex items-center justify-center animate-float" style={{
            background: `radial-gradient(circle, ${lastLog.readingColor}22 0%, transparent 70%)`,
            border: `1px solid ${lastLog.readingColor}44`,
            boxShadow: `0 0 40px ${lastLog.readingColor}33`,
          }}>
            <span style={{ fontSize: '2.5rem' }}>✦</span>
          </div>
        </div>

        <div className="inline-block px-4 py-1 rounded-full mb-3 text-xs font-medium tracking-widest uppercase"
          style={{ background: lastLog.readingColor + '22', color: lastLog.readingColor, border: `1px solid ${lastLog.readingColor}44` }}>
          {lastLog.number}
        </div>

        <h3 className="serif text-2xl mb-2" style={{ color: lastLog.readingColor }}>{lastLog.readingTitle}</h3>

        <p className="text-sm leading-relaxed mb-6" style={{ color: 'rgba(220,200,255,0.6)' }}>
          {lastLog.miniReading}
        </p>

        {lastLog.truthScore && (
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full mb-6 text-xs font-medium"
            style={{ background: 'rgba(68,255,170,0.1)', border: '1px solid rgba(68,255,170,0.3)', color: '#44ffaa' }}>
            <span>✓</span> Angel Approved
          </div>
        )}

        <div className="flex gap-3 justify-center">
          <button onClick={handleReset} className="btn-primary" style={{ fontSize: '0.85rem', padding: '0.6rem 1.5rem' }}>
            Log Another
          </button>
          <a href="/dashboard/journal" className="btn-ghost" style={{ fontSize: '0.85rem', padding: '0.6rem 1.5rem' }}>
            View Journal
          </a>
        </div>
      </div>
    )
  }

  if (step === 'thought') {
    return (
      <div className="glass-card p-8 animate-fade-in-up">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <button onClick={() => setStep('pick')} style={{ color: 'rgba(200,180,255,0.4)', fontSize: '1.2rem' }}>←</button>
          <div className="flex-1">
            <div className="inline-block px-3 py-1 rounded-full text-sm font-bold tracking-widest"
              style={{ background: (meaning?.color || '#fff') + '22', color: meaning?.color || '#fff', border: `1px solid ${meaning?.color || '#fff'}44` }}>
              {activeNumber}
            </div>
            {meaning && <p className="text-xs mt-1" style={{ color: 'rgba(200,180,255,0.5)' }}>{meaning.title}</p>}
          </div>
        </div>

        {/* Thought input */}
        <div className="mb-5">
          <label className="block text-xs uppercase tracking-widest mb-2" style={{ color: 'rgba(200,180,255,0.5)' }}>
            What were you thinking just before you saw this?
          </label>
          <textarea
            value={thought}
            onChange={e => setThought(e.target.value)}
            placeholder="A thought, a feeling, a question you were holding..."
            rows={3}
            className="w-full rounded-xl p-4 text-sm resize-none outline-none transition-all"
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(200,180,255,0.15)',
              color: 'rgba(255,255,255,0.8)',
              fontFamily: 'inherit',
            }}
            onFocus={e => e.target.style.borderColor = 'rgba(200,180,255,0.35)'}
            onBlur={e => e.target.style.borderColor = 'rgba(200,180,255,0.15)'}
          />
          <p className="text-xs mt-1" style={{ color: 'rgba(200,180,255,0.25)' }}>Optional · 100% private</p>
        </div>

        {/* Screenshot upload */}
        <div className="mb-6">
          <label className="block text-xs uppercase tracking-widest mb-2" style={{ color: 'rgba(200,180,255,0.5)' }}>
            Screenshot Proof <span style={{ color: 'rgba(68,255,170,0.6)' }}>→ Angel Approved Badge</span>
          </label>
          <input ref={fileRef} type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
          {screenshot ? (
            <div className="flex items-center gap-3 p-3 rounded-xl" style={{ background: 'rgba(68,255,170,0.08)', border: '1px solid rgba(68,255,170,0.25)' }}>
              <img src={screenshot} alt="proof" className="w-12 h-12 rounded-lg object-cover" />
              <div className="flex-1">
                <p className="text-xs font-medium" style={{ color: '#44ffaa' }}>✓ Angel Approved</p>
                <p className="text-xs" style={{ color: 'rgba(200,180,255,0.4)' }}>{screenshotName}</p>
              </div>
              <button onClick={() => { setScreenshot(null); setScreenshotName('') }}
                style={{ color: 'rgba(200,180,255,0.3)', fontSize: '1.1rem' }}>×</button>
            </div>
          ) : (
            <button onClick={() => fileRef.current?.click()}
              className="w-full p-4 rounded-xl text-sm transition-all"
              style={{
                background: 'rgba(255,255,255,0.03)',
                border: '1px dashed rgba(200,180,255,0.2)',
                color: 'rgba(200,180,255,0.4)',
              }}
              onMouseEnter={e => (e.currentTarget.style.borderColor = 'rgba(200,180,255,0.4)')}
              onMouseLeave={e => (e.currentTarget.style.borderColor = 'rgba(200,180,255,0.2)')}
            >
              + Upload screenshot (optional)
            </button>
          )}
        </div>

        <button onClick={handleSave} disabled={saving} className="btn-primary w-full">
          {saving ? (
            <span className="flex items-center justify-center gap-2">
              <span className="animate-spin">✦</span> Logging to the cosmos...
            </span>
          ) : 'Log This Number ✦'}
        </button>
      </div>
    )
  }

  // Step: pick
  return (
    <div className="glass-card p-8 animate-fade-in-up">
      <h2 className="serif text-2xl mb-1 text-center" style={{ color: 'rgba(220,200,255,0.9)' }}>What did you see?</h2>
      <p className="text-center text-xs mb-8 uppercase tracking-widest" style={{ color: 'rgba(200,180,255,0.35)' }}>Tap a number or enter your own</p>

      {/* Quick tap grid */}
      <div className="grid grid-cols-4 gap-2 mb-6">
        {QUICK_NUMBERS.map(num => {
          const m = getAngelMeaning(num)
          return (
            <button
              key={num}
              onClick={() => handleQuickPick(num)}
              className="rounded-xl py-3 px-2 text-center transition-all"
              style={{
                background: selected === num ? m.color + '22' : 'rgba(255,255,255,0.04)',
                border: `1px solid ${selected === num ? m.color + '66' : 'rgba(200,180,255,0.12)'}`,
                color: selected === num ? m.color : 'rgba(220,200,255,0.7)',
                boxShadow: selected === num ? `0 0 20px ${m.color}22` : 'none',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = m.color + '44'; e.currentTarget.style.color = m.color }}
              onMouseLeave={e => {
                if (selected !== num) {
                  e.currentTarget.style.borderColor = 'rgba(200,180,255,0.12)'
                  e.currentTarget.style.color = 'rgba(220,200,255,0.7)'
                }
              }}
            >
              <div className="font-bold text-sm tracking-wider">{num}</div>
            </button>
          )
        })}
      </div>

      {/* Custom input */}
      <div className="flex gap-2">
        <input
          type="text"
          value={custom}
          onChange={e => setCustom(e.target.value.replace(/\D/g, '').slice(0, 6))}
          onKeyDown={e => e.key === 'Enter' && handleCustomSubmit()}
          placeholder="Other number..."
          className="flex-1 rounded-xl px-4 py-3 text-sm outline-none"
          style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(200,180,255,0.15)',
            color: 'rgba(255,255,255,0.8)',
          }}
        />
        <button
          onClick={handleCustomSubmit}
          disabled={!custom}
          className="px-5 py-3 rounded-xl text-sm font-medium transition-all"
          style={{
            background: custom ? 'rgba(200,150,255,0.15)' : 'rgba(255,255,255,0.04)',
            border: `1px solid ${custom ? 'rgba(200,150,255,0.4)' : 'rgba(200,180,255,0.1)'}`,
            color: custom ? 'rgba(220,180,255,0.9)' : 'rgba(200,180,255,0.3)',
          }}
        >
          Next →
        </button>
      </div>
    </div>
  )
}
