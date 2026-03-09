'use client'
import JournalExport from '@/components/JournalExport'

import { useState, useEffect, useMemo } from 'react'
import { getLogs, saveLog, searchLogs, getStats, AngelLog } from '@/lib/storage'
import { getAngelMeaning } from '@/lib/angel-meanings'
import VoiceRecorder from '@/components/VoiceRecorder'
import JournalEntry from '@/components/JournalEntry'

export default function JournalPage() {
  const [logs, setLogs] = useState<AngelLog[]>([])
  const [query, setQuery] = useState('')
  const [filterNumber, setFilterNumber] = useState('')
  const [mounted, setMounted] = useState(false)
  const [stats, setStats] = useState({ total: 0, topNumber: null as string | null, topCount: 0, withProof: 0, streak: 0 })
  const [view, setView] = useState<'list' | 'new'>('list')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  // New entry form state
  const [entryNumber, setEntryNumber] = useState('')
  const [entryThought, setEntryThought] = useState('')
  const [entryScreenshot, setEntryScreenshot] = useState<string | null>(null)
  const [entryVoiceUrl, setEntryVoiceUrl] = useState<string | null>(null)

  useEffect(() => {
    setMounted(true)
    setLogs(getLogs())
    setStats(getStats())
  }, [])

  const filtered = useMemo(() => {
    let result = query ? searchLogs(query) : logs
    if (filterNumber) result = result.filter(l => l.number === filterNumber)
    return result
  }, [logs, query, filterNumber])

  const uniqueNumbers = useMemo(() => {
    const counts: Record<string, number> = {}
    logs.forEach(l => { counts[l.number] = (counts[l.number] || 0) + 1 })
    return Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 8)
  }, [logs])

  const grouped = useMemo(() => {
    const groups: Record<string, AngelLog[]> = {}
    filtered.forEach(log => {
      const date = new Date(log.createdAt)
      const today = new Date()
      const yesterday = new Date(today)
      yesterday.setDate(yesterday.getDate() - 1)
      let label: string
      if (date.toDateString() === today.toDateString()) label = 'Today'
      else if (date.toDateString() === yesterday.toDateString()) label = 'Yesterday'
      else label = date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
      if (!groups[label]) groups[label] = []
      groups[label].push(log)
    })
    return groups
  }, [filtered])

  function handleDelete(id: string) { setLogs(getLogs()); setStats(getStats()) }
  function handleToggleShare(id: string) { setLogs(getLogs()) }

  function handleFileUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => setEntryScreenshot(ev.target?.result as string)
    reader.readAsDataURL(file)
  }

  async function handleSave() {
    if (!entryThought.trim() && !entryNumber.trim()) return
    setSaving(true)
    await new Promise(r => setTimeout(r, 700))
    const num = entryNumber.replace(/\D/g, '') || '111'
    saveLog({ number: num, thought: entryThought, screenshotUrl: entryScreenshot })
    setLogs(getLogs())
    setStats(getStats())
    setSaving(false)
    setSaved(true)
    setTimeout(() => {
      setSaved(false)
      setView('list')
      setEntryNumber('')
      setEntryThought('')
      setEntryScreenshot(null)
      setEntryVoiceUrl(null)
    }, 1600)
  }

  const meaning = entryNumber ? getAngelMeaning(entryNumber.replace(/\D/g, '')) : null

  // ── SAVED CONFIRMATION ────────────────────────────────────────────────────
  if (saved) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '1rem', textAlign: 'center' }}>
        <div style={{ fontSize: '3rem' }}>✦</div>
        <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.75rem', color: 'rgba(200,180,255,0.9)', fontWeight: 300 }}>Entry Recorded</h2>
        <p style={{ color: 'rgba(200,180,255,0.5)', fontSize: '0.875rem' }}>Your thought has been anchored to the cosmos</p>
      </div>
    )
  }

  // ── NEW ENTRY FORM ────────────────────────────────────────────────────────
  if (view === 'new') {
    return (
      <div style={{ maxWidth: '640px', margin: '0 auto', padding: '1.5rem 1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
          <button onClick={() => setView('list')} style={{ color: 'rgba(200,180,255,0.4)', fontSize: '1.2rem', background: 'none', border: 'none', cursor: 'pointer' }}>←</button>
          <div>
            <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.75rem', color: 'rgba(220,200,255,0.9)', fontWeight: 300 }}>New Journal Entry</h1>
            <p style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'rgba(200,180,255,0.35)' }}>Anchor your thought to the cosmos</p>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>

          {/* Angel number */}
          <div>
            <label style={{ display: 'block', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'rgba(200,180,255,0.5)', marginBottom: '0.5rem' }}>Angel Number Seen</label>
            <input
              value={entryNumber}
              onChange={e => setEntryNumber(e.target.value)}
              placeholder="111, 444, 1111, 333.."
              style={{ width: '100%', borderRadius: '0.75rem', padding: '0.875rem 1rem', fontSize: '1.25rem', outline: 'none', boxSizing: 'border-box', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(200,180,255,0.2)', color: 'rgba(255,255,255,0.9)', fontFamily: 'Cormorant Garamond, serif', textAlign: 'center', letterSpacing: '0.1em' }}
            />
            {meaning && (
              <div style={{ marginTop: '0.5rem', padding: '0.75rem 1rem', borderRadius: '0.75rem', background: meaning.color + '10', border: `1px solid ${meaning.color}30`, textAlign: 'center' }}>
                <span style={{ fontSize: '0.8rem', color: meaning.color, fontStyle: 'italic' }}>{meaning.title} — {meaning.keywords[0]}</span>
              </div>
            )}
          </div>

          {/* Thought with voice */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <label style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'rgba(200,180,255,0.5)' }}>What Were You Thinking?</label>
              <VoiceRecorder
                compact
                onTranscript={(t) => setEntryThought(prev => prev ? prev + ' ' + t : t)}
                onVoiceNote={(url) => setEntryVoiceUrl(url)}
              />
            </div>
            <textarea
              value={entryThought}
              onChange={e => setEntryThought(e.target.value)}
              placeholder="What was on your mind when you saw this number? Tap 🎙️ to speak..."
              rows={5}
              style={{ width: '100%', borderRadius: '0.75rem', padding: '1rem', fontSize: '0.875rem', resize: 'none', outline: 'none', boxSizing: 'border-box', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(200,180,255,0.2)', color: 'rgba(255,255,255,0.8)', fontFamily: 'inherit', lineHeight: 1.6 }}
            />
            {entryVoiceUrl && (
              <div style={{ marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '0.7rem', color: 'rgba(255,160,50,0.7)' }}>🔊 Voice note saved</span>
                <audio src={entryVoiceUrl} controls style={{ height: '1.5rem', flex: 1 }} />
              </div>
            )}
          </div>

          {/* Screenshot upload */}
          <div>
            <label style={{ display: 'block', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'rgba(200,180,255,0.5)', marginBottom: '0.5rem' }}>
              Screenshot <span style={{ color: 'rgba(100,220,100,0.6)', marginLeft: '0.5rem' }}>+Angel Approved Badge</span>
            </label>
            <label style={{ display: 'block', cursor: 'pointer' }}>
              <input type="file" accept="image/*" onChange={handleFileUpload} style={{ display: 'none' }} />
              {entryScreenshot ? (
                <div style={{ position: 'relative', borderRadius: '0.75rem', overflow: 'hidden', border: '1px solid rgba(100,220,100,0.3)' }}>
                  <img src={entryScreenshot} alt="screenshot" style={{ width: '100%', maxHeight: '200px', objectFit: 'cover', display: 'block' }} />
                  <div style={{ position: 'absolute', top: '0.5rem', right: '0.5rem', padding: '0.25rem 0.75rem', borderRadius: '9999px', background: 'rgba(0,180,80,0.85)', fontSize: '0.7rem', color: 'white', fontWeight: 600 }}>✓ Angel Approved</div>
                </div>
              ) : (
                <div style={{ borderRadius: '0.75rem', padding: '1.5rem', textAlign: 'center', background: 'rgba(255,255,255,0.02)', border: '1px dashed rgba(200,180,255,0.2)', color: 'rgba(200,180,255,0.4)', fontSize: '0.875rem' }}>
                  <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>📸</div>
                  Tap to upload screenshot proof
                </div>
              )}
            </label>
          </div>

          {/* Save button */}
          <button onClick={handleSave} disabled={saving || (!entryThought.trim() && !entryNumber.trim())} style={{ width: '100%', padding: '1rem', borderRadius: '9999px', background: 'linear-gradient(135deg, rgba(100,60,180,0.4), rgba(60,30,120,0.4))', border: '1px solid rgba(160,100,255,0.4)', color: 'rgba(220,200,255,0.95)', cursor: saving ? 'not-allowed' : 'pointer', fontSize: '1rem', fontWeight: 500, letterSpacing: '0.05em', opacity: saving ? 0.7 : 1 }}>
            {saving ? '✦ Anchoring to the cosmos...' : 'Save Journal Entry ✦'}
          </button>
        </div>
      </div>
    )
  }

  // ── JOURNAL LIST ──────────────────────────────────────────────────────────
  return (
    <div style={{ maxWidth: '640px', margin: '0 auto', padding: '1.5rem 1rem' }}>

      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2rem', color: 'rgba(220,200,255,0.9)', fontWeight: 300, marginBottom: '0.25rem' }}>Thought Anchor</h1>
          <p style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'rgba(200,180,255,0.35)' }}>
            {mounted ? `${stats.total} sighting${stats.total !== 1 ? 's' : ''} recorded` : ''}
          </p>
        </div>
        <button onClick={() => setView('new')} style={{ padding: '0.6rem 1.25rem', borderRadius: '9999px', background: 'linear-gradient(135deg, rgba(100,60,180,0.3), rgba(60,30,120,0.3))', border: '1px solid rgba(160,100,255,0.35)', color: 'rgba(200,170,255,0.9)', cursor: 'pointer', fontSize: '0.875rem', whiteSpace: 'nowrap' }}>
          + New Entry
        </button>
      </div>

      {/* Stats strip */}
      {mounted && stats.total > 0 && (
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
          {[
            { label: 'Total', value: stats.total },
            { label: 'Streak', value: `${stats.streak}d` },
            { label: 'Verified', value: stats.withProof },
            ...(stats.topNumber ? [{ label: 'Top', value: stats.topNumber }] : []),
          ].map(s => (
            <div key={s.label} style={{ padding: '0.35rem 0.875rem', borderRadius: '9999px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(200,180,255,0.1)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <span style={{ fontSize: '0.875rem', fontWeight: 600, color: 'rgba(220,200,255,0.8)' }}>{s.value}</span>
              <span style={{ fontSize: '0.7rem', color: 'rgba(200,180,255,0.35)' }}>{s.label}</span>
            </div>
          ))}
        </div>
      )}

      {/* Search */}
      <div style={{ position: 'relative', marginBottom: '1rem' }}>
        <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'rgba(200,180,255,0.3)', fontSize: '0.875rem' }}>🔍</span>
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search by number, thought, or keyword..."
          style={{ width: '100%', borderRadius: '0.75rem', padding: '0.75rem 1rem 0.75rem 2.5rem', fontSize: '0.875rem', outline: 'none', boxSizing: 'border-box', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(200,180,255,0.15)', color: 'rgba(255,255,255,0.8)', fontFamily: 'inherit' }}
        />
        {query && (
          <button onClick={() => setQuery('')} style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'rgba(200,180,255,0.4)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1rem' }}>×</button>
        )}
      </div>

      {/* Number filter chips */}
      {mounted && uniqueNumbers.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '1.5rem' }}>
          <button onClick={() => setFilterNumber('')} style={{ padding: '0.3rem 0.875rem', borderRadius: '9999px', fontSize: '0.75rem', cursor: 'pointer', background: !filterNumber ? 'rgba(200,150,255,0.2)' : 'rgba(255,255,255,0.04)', border: `1px solid ${!filterNumber ? 'rgba(200,150,255,0.5)' : 'rgba(200,180,255,0.12)'}`, color: !filterNumber ? 'rgba(220,180,255,0.9)' : 'rgba(200,180,255,0.4)' }}>All</button>
          {uniqueNumbers.map(([num, count]) => (
            <button key={num} onClick={() => setFilterNumber(filterNumber === num ? '' : num)} style={{ padding: '0.3rem 0.875rem', borderRadius: '9999px', fontSize: '0.75rem', cursor: 'pointer', background: filterNumber === num ? 'rgba(200,150,255,0.2)' : 'rgba(255,255,255,0.04)', border: `1px solid ${filterNumber === num ? 'rgba(200,150,255,0.5)' : 'rgba(200,180,255,0.12)'}`, color: filterNumber === num ? 'rgba(220,180,255,0.9)' : 'rgba(200,180,255,0.4)' }}>
              {num} <span style={{ opacity: 0.5 }}>×{count}</span>
            </button>
          ))}
        </div>
      )}

      {/* Timeline */}
      {mounted && Object.keys(grouped).length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {Object.entries(grouped).map(([date, dateLogs]) => (
            <div key={date}>
              <p style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'rgba(200,180,255,0.3)', marginBottom: '0.75rem', paddingLeft: '0.25rem' }}>{date}</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {dateLogs.map(log => (
                  <JournalEntry key={log.id} log={log} onDelete={handleDelete} onToggleShare={handleToggleShare} />
                ))}
              </div>
            </div>
          ))}
        </div>
      ) : mounted ? (
        <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.2 }}>✦</div>
          {query || filterNumber ? (
            <>
              <p style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.5rem', color: 'rgba(200,180,255,0.5)', fontWeight: 300, marginBottom: '0.5rem' }}>No results found</p>
              <button onClick={() => { setQuery(''); setFilterNumber('') }} style={{ marginTop: '1rem', padding: '0.6rem 1.5rem', borderRadius: '9999px', background: 'rgba(100,60,180,0.2)', border: '1px solid rgba(160,100,255,0.3)', color: 'rgba(200,170,255,0.8)', cursor: 'pointer', fontSize: '0.875rem' }}>Clear Search</button>
            </>
          ) : (
            <>
              <p style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.5rem', color: 'rgba(200,180,255,0.5)', fontWeight: 300, marginBottom: '0.5rem' }}>Your journal is empty</p>
              <p style={{ color: 'rgba(200,180,255,0.3)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>Start recording the numbers and thoughts the universe sends you</p>
              <button onClick={() => setView('new')} style={{ padding: '0.75rem 2rem', borderRadius: '9999px', background: 'rgba(100,60,180,0.2)', border: '1px solid rgba(160,100,255,0.3)', color: 'rgba(200,170,255,0.8)', cursor: 'pointer', fontSize: '0.875rem' }}>+ New Entry</button>
            </>
          )}
        </div>
      ) : null}
    </div>
  )
}
