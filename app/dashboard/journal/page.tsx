'use client'
import { useTheme } from '@/lib/theme-context'
import JournalExport from '@/components/JournalExport'

import { useState, useEffect, useMemo } from 'react'
import { getLogs, saveLog, searchLogs, getStats, getNumerologyProfile, AngelLog } from '@/lib/storage'
import { getConversations, sendMessage, Conversation } from '@/lib/messages'
import { savePost } from '@/lib/social-storage'
import { getAngelMeaning } from '@/lib/angel-meanings'
import VoiceRecorder from '@/components/VoiceRecorder'
import JournalEntry from '@/components/JournalEntry'
import { getDreams, saveDream, deleteDream, updateDreamReading, DreamEntry } from '@/lib/dream-storage'

const DREAM_SYMBOLS = ['🌊','🔥','🌙','⭐','🦋','🐍','🌹','🏔️','🌊','💎','🦅','🌸','🌀','⚡','🌿','🕊️','🐉','🌺']
const DREAM_MOODS = ['Peaceful','Anxious','Joyful','Mysterious','Fearful','Transcendent','Confused','Blissful','Melancholic','Energized']

export default function JournalPage() {
  const { theme } = useTheme()
  const isSim = theme === 'simulation'
  const [activeTab, setActiveTab] = useState<'anchor' | 'dreams' | 'reflect' | 'vision'>('anchor')

  // ── THOUGHT ANCHOR STATE ─────────────────────────────────────────────────
  const [logs, setLogs] = useState<AngelLog[]>([])
  const [query, setQuery] = useState('')
  const [filterNumber, setFilterNumber] = useState('')
  const [mounted, setMounted] = useState(false)
  const [stats, setStats] = useState({ total: 0, topNumber: null as string | null, topCount: 0, withProof: 0, streak: 0 })
  const [view, setView] = useState<'list' | 'new'>('list')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [entryNumber, setEntryNumber] = useState('')
  const [entryThought, setEntryThought] = useState('')
  const [entryScreenshot, setEntryScreenshot] = useState<string | null>(null)
  const [entryVoiceUrl, setEntryVoiceUrl] = useState<string | null>(null)
  const [filtered, setFiltered] = useState<AngelLog[]>([])

  // ── DREAM STATE ──────────────────────────────────────────────────────────
  const [dreams, setDreams] = useState<DreamEntry[]>([])
  const [dreamView, setDreamView] = useState<'list' | 'new'>('list')
  const [dreamTitle, setDreamTitle] = useState('')
  const [dreamDesc, setDreamDesc] = useState('')
  const [dreamSymbols, setDreamSymbols] = useState<string[]>([])
  const [dreamMoods, setDreamMoods] = useState<string[]>([])
  const [dreamNumbers, setDreamNumbers] = useState('')
  const [dreamVoice, setDreamVoice] = useState<string | null>(null)
  const [dreamSaving, setDreamSaving] = useState(false)
  const [dreamSaved, setDreamSaved] = useState(false)
  const [expandedDream, setExpandedDream] = useState<string | null>(null)
  const [interpretations, setInterpretations] = useState<Record<string, string>>({})
  const [interpretingId, setInterpretingId] = useState<string | null>(null)
  const [sharedDreams, setSharedDreams] = useState<Record<string, boolean>>({})
  const [sharingDreamId, setSharingDreamId] = useState<string | null>(null)
  const [shareMenuDreamId, setShareMenuDreamId] = useState<string | null>(null)
  const [shareStep, setShareStep] = useState<'menu' | 'conversations' | 'success'>('menu')
  const [shareSuccessMsg, setShareSuccessMsg] = useState('')
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [loadingConvos, setLoadingConvos] = useState(false)
  const [shareProcessing, setShareProcessing] = useState(false)

  useEffect(() => {
    setMounted(true)
    getLogs().then(setLogs)
    getStats().then(setStats)
    getDreams().then(d => { setDreams(d); const existing: Record<string, string> = {}; d.forEach(dream => { if (dream.reading) existing[dream.id] = dream.reading; }); setInterpretations(existing); })
  }, [])

  useEffect(() => {
    if (query) {
      searchLogs(query).then(results => {
        setFiltered(filterNumber ? results.filter((l: AngelLog) => l.number === filterNumber) : results)
      })
    } else {
      setFiltered(filterNumber ? logs.filter(l => l.number === filterNumber) : logs)
    }
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

  function handleDelete(id: string) { getLogs().then(setLogs); getStats().then(setStats) }
  function handleToggleShare(id: string) { getLogs().then(setLogs) }

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
    getLogs().then(setLogs)
    getStats().then(setStats)
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

  async function handleDreamSave() {
    if (!dreamDesc.trim() && !dreamTitle.trim()) return
    setDreamSaving(true)
    await new Promise(r => setTimeout(r, 600))
    const nums = dreamNumbers.split(/[,\s]+/).map(n => n.replace(/\D/g, '')).filter(Boolean)
    saveDream({ title: dreamTitle || 'Untitled Dream', description: dreamDesc, symbols: dreamSymbols, moods: dreamMoods, angelNumbers: nums, voiceNoteUrl: dreamVoice })
    getDreams().then(d => { setDreams(d); const existing: Record<string, string> = {}; d.forEach(dream => { if (dream.reading) existing[dream.id] = dream.reading; }); setInterpretations(existing); })
    setDreamSaving(false)
    setDreamSaved(true)
    setTimeout(() => {
      setDreamSaved(false)
      setDreamView('list')
      setDreamTitle('')
      setDreamDesc('')
      setDreamSymbols([])
      setDreamMoods([])
      setDreamNumbers('')
      setDreamVoice(null)
    }, 1400)
  }

  function toggleSymbol(s: string) {
    setDreamSymbols(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s])
  }
  function toggleMood(m: string) {
    setDreamMoods(prev => prev.includes(m) ? prev.filter(x => x !== m) : [...prev, m])
  }

  const meaning = entryNumber ? getAngelMeaning(entryNumber.replace(/\D/g, '')) : null

  // ── TAB BAR ───────────────────────────────────────────────────────────────
  const tabBar = (
    <div style={{ display: 'flex', gap: '0', marginBottom: '1.75rem', background: 'rgba(255,255,255,0.04)', borderRadius: '0.875rem', padding: '0.25rem', border: '1px solid rgba(200,180,255,0.1)', overflowX: 'auto' }}>
      {([['anchor', '✦ Anchor'], ['dreams', '🌙 Dreams'], ['reflect', '🙏 Reflect'], ['vision', '🖼️ Vision']] as const).map(([tab, label]) => (
        <button
          key={tab}
          onClick={() => { setActiveTab(tab as any); setView('list'); setDreamView('list') }}
          style={{
            flex: 1, padding: '0.6rem 0.5rem', borderRadius: '0.65rem', border: 'none',
            background: activeTab === tab ? 'rgba(160,100,255,0.2)' : 'transparent',
            color: activeTab === tab ? 'rgba(220,190,255,0.95)' : 'rgba(200,180,255,0.45)',
            fontSize: '0.78rem', fontWeight: activeTab === tab ? 600 : 400,
            cursor: 'pointer', transition: 'all 0.2s',
            letterSpacing: '0.02em', whiteSpace: 'nowrap'
          }}
        >
          {label}
        </button>
      ))}
    </div>
  )

  // ── SAVED CONFIRMATION ────────────────────────────────────────────────────
  if (saved || dreamSaved) {
    return (
      <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '1rem', textAlign: 'center' }}>
        <div style={{ fontSize: '3rem' }}>{dreamSaved ? '🌙' : '✦'}</div>
        <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.75rem', color: 'rgba(200,180,255,0.9)', fontWeight: 300 }}>{dreamSaved ? 'Dream Recorded' : 'Entry Recorded'}</h2>
        <p style={{ color: 'rgba(200,180,255,0.5)', fontSize: '0.875rem' }}>{dreamSaved ? 'Your dream has been woven into the cosmos' : 'Your thought has been anchored to the cosmos'}</p>
      </div>
    )
  }

  // ── NEW ANCHOR ENTRY ──────────────────────────────────────────────────────
  if (activeTab === 'anchor' && view === 'new') {
    return (
      <div style={{ maxWidth: '640px', margin: '0 auto', padding: '1.5rem 1rem' }}>
        {tabBar}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
          <button onClick={() => setView('list')} style={{ color: 'rgba(200,180,255,0.4)', fontSize: '1.2rem', background: 'none', border: 'none', cursor: 'pointer' }}>←</button>
          <div>
            <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.75rem', color: 'rgba(220,200,255,0.9)', fontWeight: 300 }}>New Journal Entry</h1>
            <p style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'rgba(200,180,255,0.35)' }}>Anchor your thought to the cosmos</p>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'rgba(200,180,255,0.5)', marginBottom: '0.5rem' }}>Angel Number Seen</label>
            <input value={entryNumber} onChange={e => setEntryNumber(e.target.value)} placeholder="111, 444, 1111, 333.." style={{ width: '100%', borderRadius: '0.75rem', padding: '0.875rem 1rem', fontSize: '1.25rem', outline: 'none', boxSizing: 'border-box', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(200,180,255,0.2)', color: 'rgba(255,255,255,0.9)', fontFamily: 'Cormorant Garamond, serif', textAlign: 'center', letterSpacing: '0.1em' }} />
            {meaning && (
              <div style={{ marginTop: '0.5rem', padding: '0.75rem 1rem', borderRadius: '0.75rem', background: meaning.color + '10', border: `1px solid ${meaning.color}30`, textAlign: 'center' }}>
                <span style={{ fontSize: '0.8rem', color: meaning.color, fontStyle: 'italic' }}>{meaning.title} — {meaning.keywords[0]}</span>
              </div>
            )}
          </div>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <label style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'rgba(200,180,255,0.5)' }}>What Were You Thinking?</label>
              <VoiceRecorder compact onTranscript={(t) => setEntryThought(prev => prev ? prev + ' ' + t : t)} onVoiceNote={(url) => setEntryVoiceUrl(url)} />
            </div>
            <textarea value={entryThought} onChange={e => setEntryThought(e.target.value)} onInput={e => setEntryThought((e.target as HTMLTextAreaElement).value)} placeholder="What was on your mind when you saw this number?" rows={5} style={{ width: '100%', borderRadius: '0.75rem', padding: '1rem', fontSize: '0.875rem', resize: 'none', outline: 'none', boxSizing: 'border-box', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(200,180,255,0.2)', color: 'rgba(255,255,255,0.8)', fontFamily: 'inherit', lineHeight: 1.6 }} />
            {entryVoiceUrl && (
              <div style={{ marginTop: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '0.7rem', color: 'rgba(255,160,50,0.7)' }}>🔊 Voice note saved</span>
                <audio src={entryVoiceUrl} controls style={{ height: '1.5rem', flex: 1 }} />
              </div>
            )}
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'rgba(200,180,255,0.5)', marginBottom: '0.5rem' }}>Screenshot <span style={{ color: 'rgba(100,220,100,0.6)', marginLeft: '0.5rem' }}>{isSim ? '+Signal Verified' : '+Angel Approved Badge'}</span></label>
            <label style={{ display: 'block', cursor: 'pointer' }}>
              <input type="file" accept="image/*" onChange={handleFileUpload} style={{ display: 'none' }} />
              {entryScreenshot ? (
                <div style={{ position: 'relative', borderRadius: '0.75rem', overflow: 'hidden', border: '1px solid rgba(100,220,100,0.3)' }}>
                  <img src={entryScreenshot} alt="screenshot" style={{ width: '100%', maxHeight: '200px', objectFit: 'cover', display: 'block' }} />
                  <div style={{ position: 'absolute', top: '0.5rem', right: '0.5rem', padding: '0.25rem 0.75rem', borderRadius: '9999px', background: 'rgba(0,180,80,0.85)', fontSize: '0.7rem', color: 'white', fontWeight: 600 }}>{isSim ? '✓ SIGNAL VERIFIED' : '✓ Angel Approved'}</div>
                </div>
              ) : (
                <div style={{ borderRadius: '0.75rem', padding: '1.5rem', textAlign: 'center', background: 'rgba(255,255,255,0.02)', border: '1px dashed rgba(200,180,255,0.2)', color: 'rgba(200,180,255,0.4)', fontSize: '0.875rem' }}>
                  <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>📸</div>
                  Tap to upload screenshot proof
                </div>
              )}
            </label>
          </div>
          <button
            onClick={handleSave}
            onTouchEnd={e => { e.preventDefault(); handleSave() }}
            style={{ width: '100%', padding: '1rem', borderRadius: '9999px', background: 'linear-gradient(135deg, rgba(100,60,180,0.4), rgba(60,30,120,0.4))', border: '1px solid rgba(160,100,255,0.4)', color: 'rgba(220,200,255,0.95)', cursor: 'pointer', fontSize: '1rem', fontWeight: 500, letterSpacing: '0.05em', WebkitAppearance: 'none' } as React.CSSProperties}
          >
            {saving ? '✦ Anchoring to the cosmos...' : 'Save Journal Entry ✦'}
          </button>
        </div>
      </div>
    )
  }

  // ── NEW DREAM ENTRY ───────────────────────────────────────────────────────
  if (activeTab === 'dreams' && dreamView === 'new') {
    return (
      <div style={{ maxWidth: '640px', margin: '0 auto', padding: '1.5rem 1rem' }}>
        {tabBar}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
          <button onClick={() => setDreamView('list')} style={{ color: 'rgba(200,180,255,0.4)', fontSize: '1.2rem', background: 'none', border: 'none', cursor: 'pointer' }}>←</button>
          <div>
            <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.75rem', color: 'rgba(220,200,255,0.9)', fontWeight: 300 }}>Record a Dream</h1>
            <p style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'rgba(200,180,255,0.35)' }}>Weave your visions into the cosmos</p>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'rgba(200,180,255,0.5)', marginBottom: '0.5rem' }}>Dream Title</label>
            <input value={dreamTitle} onChange={e => setDreamTitle(e.target.value)} placeholder="Give your dream a name..." style={{ width: '100%', borderRadius: '0.75rem', padding: '0.75rem 1rem', fontSize: '1rem', outline: 'none', boxSizing: 'border-box', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(200,180,255,0.2)', color: 'rgba(255,255,255,0.9)', fontFamily: 'inherit' }} />
          </div>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <label style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'rgba(200,180,255,0.5)' }}>Describe Your Dream</label>
              <VoiceRecorder compact onTranscript={(t) => setDreamDesc(prev => prev ? prev + ' ' + t : t)} onVoiceNote={(url) => setDreamVoice(url)} />
            </div>
            <textarea value={dreamDesc} onChange={e => setDreamDesc(e.target.value)} onInput={e => setDreamDesc((e.target as HTMLTextAreaElement).value)} placeholder="What happened in your dream? Tap 🎙️ to speak..." rows={5} style={{ width: '100%', borderRadius: '0.75rem', padding: '1rem', fontSize: '0.875rem', resize: 'none', outline: 'none', boxSizing: 'border-box', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(200,180,255,0.2)', color: 'rgba(255,255,255,0.8)', fontFamily: 'inherit', lineHeight: 1.6 }} />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'rgba(200,180,255,0.5)', marginBottom: '0.75rem' }}>Dream Symbols</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {DREAM_SYMBOLS.map(s => (
                <button key={s} onClick={() => toggleSymbol(s)} style={{ padding: '0.4rem 0.75rem', borderRadius: '9999px', fontSize: '1rem', cursor: 'pointer', background: dreamSymbols.includes(s) ? 'rgba(160,100,255,0.25)' : 'rgba(255,255,255,0.04)', border: `1px solid ${dreamSymbols.includes(s) ? 'rgba(160,100,255,0.5)' : 'rgba(200,180,255,0.12)'}`, transition: 'all 0.15s' }}>{s}</button>
              ))}
            </div>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'rgba(200,180,255,0.5)', marginBottom: '0.75rem' }}>Dream Mood</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
              {DREAM_MOODS.map(m => (
                <button key={m} onClick={() => toggleMood(m)} style={{ padding: '0.35rem 0.875rem', borderRadius: '9999px', fontSize: '0.75rem', cursor: 'pointer', background: dreamMoods.includes(m) ? 'rgba(100,180,255,0.2)' : 'rgba(255,255,255,0.04)', border: `1px solid ${dreamMoods.includes(m) ? 'rgba(100,180,255,0.5)' : 'rgba(200,180,255,0.12)'}`, color: dreamMoods.includes(m) ? 'rgba(180,220,255,0.9)' : 'rgba(200,180,255,0.5)', transition: 'all 0.15s' }}>{m}</button>
              ))}
            </div>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'rgba(200,180,255,0.5)', marginBottom: '0.5rem' }}>Angel Numbers in Dream</label>
            <input value={dreamNumbers} onChange={e => setDreamNumbers(e.target.value)} placeholder="111, 444, 777 (comma separated)" style={{ width: '100%', borderRadius: '0.75rem', padding: '0.75rem 1rem', fontSize: '1rem', outline: 'none', boxSizing: 'border-box', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(200,180,255,0.2)', color: 'rgba(255,255,255,0.9)', fontFamily: 'inherit', textAlign: 'center', letterSpacing: '0.1em' }} />
          </div>
          <button
            onClick={handleDreamSave}
            onTouchEnd={e => { e.preventDefault(); handleDreamSave() }}
            style={{ width: '100%', padding: '1rem', borderRadius: '9999px', background: 'linear-gradient(135deg, rgba(60,30,120,0.5), rgba(100,60,180,0.4))', border: '1px solid rgba(120,80,220,0.4)', color: 'rgba(220,200,255,0.95)', cursor: 'pointer', fontSize: '1rem', fontWeight: 500, letterSpacing: '0.05em', WebkitAppearance: 'none' } as React.CSSProperties}
          >
            {dreamSaving ? '🌙 Weaving into the cosmos...' : 'Save Dream ✦'}
          </button>
        </div>
      </div>
    )
  }

  // ── DREAM LIST ────────────────────────────────────────────────────────────
  if (activeTab === 'dreams') {
    return (
      <div style={{ maxWidth: '640px', margin: '0 auto', padding: '1.5rem 1rem' }}>
        {tabBar}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
          <div>
            <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2rem', color: 'rgba(220,200,255,0.9)', fontWeight: 300, marginBottom: '0.25rem' }}>Dream Journal</h1>
            <p style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'rgba(200,180,255,0.35)' }}>{mounted ? `${dreams.length} dream${dreams.length !== 1 ? 's' : ''} recorded` : ''}</p>
          </div>
          <button onClick={() => setDreamView('new')} style={{ padding: '0.6rem 1.25rem', borderRadius: '9999px', background: 'linear-gradient(135deg, rgba(60,30,120,0.4), rgba(100,60,180,0.3))', border: '1px solid rgba(120,80,220,0.35)', color: 'rgba(200,170,255,0.9)', cursor: 'pointer', fontSize: '0.875rem', whiteSpace: 'nowrap' }}>+ New Dream</button>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
          <a href="/dashboard/dreams" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.5rem 1rem', borderRadius: '9999px', background: 'rgba(60,20,40,0.4)', border: '1px solid rgba(200,80,80,0.3)', color: 'rgba(255,160,160,0.9)', textDecoration: 'none', fontSize: '0.8rem', fontWeight: 500 }}>🌑 Night Mode</a>
          <a href="/dashboard/dream-resonances" style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.5rem 1rem', borderRadius: '9999px', background: 'rgba(120,80,220,0.1)', border: '1px solid rgba(120,80,220,0.25)', color: 'rgba(200,170,255,0.8)', textDecoration: 'none', fontSize: '0.8rem', fontWeight: 500 }}>🔮 Dream Resonances</a>
        </div>
        {mounted && dreams.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {dreams.map(dream => (
              <div key={dream.id} style={{ background: 'rgba(8,6,28,0.85)', border: '1px solid rgba(120,80,220,0.25)', borderRadius: '1rem', overflow: 'hidden', backdropFilter: 'blur(12px)' }}>
                <div style={{ padding: '1rem', cursor: 'pointer' }} onClick={() => setExpandedDream(expandedDream === dream.id ? null : dream.id)}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                    <div style={{ flex: 1 }}>
                      <h3 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.1rem', color: 'rgba(220,200,255,0.9)', fontWeight: 400, margin: 0 }}>{dream.title}</h3>
                      <p style={{ fontSize: '0.7rem', color: 'rgba(200,180,255,0.35)', margin: '0.2rem 0 0' }}>{new Date(dream.createdAt).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</p>
                    </div>
                    <span style={{ color: 'rgba(200,180,255,0.3)', fontSize: '0.8rem', marginLeft: '0.5rem' }}>{expandedDream === dream.id ? '▲' : '▼'}</span>
                  </div>
                  {dream.symbols.length > 0 && (
                    <div style={{ display: 'flex', gap: '0.25rem', flexWrap: 'wrap', marginBottom: '0.5rem' }}>
                      {dream.symbols.map(s => <span key={s} style={{ fontSize: '1rem' }}>{s}</span>)}
                    </div>
                  )}
                  {dream.moods.length > 0 && (
                    <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap' }}>
                      {dream.moods.map(m => <span key={m} style={{ fontSize: '0.65rem', padding: '0.15rem 0.5rem', borderRadius: '9999px', background: 'rgba(100,180,255,0.1)', border: '1px solid rgba(100,180,255,0.2)', color: 'rgba(180,220,255,0.7)' }}>{m}</span>)}
                    </div>
                  )}
                </div>
                {expandedDream === dream.id && (
                  <div style={{ padding: '0 1rem 1rem', borderTop: '1px solid rgba(120,80,220,0.15)' }}>
                    {dream.description && <p style={{ fontSize: '0.875rem', color: 'rgba(220,200,255,0.75)', lineHeight: 1.65, margin: '0.75rem 0' }}>{dream.description}</p>}
                    {dream.angelNumbers.length > 0 && (
                      <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
                        {dream.angelNumbers.map(n => <span key={n} style={{ fontSize: '0.75rem', padding: '0.2rem 0.6rem', borderRadius: '9999px', background: 'rgba(201,168,76,0.15)', border: '1px solid rgba(201,168,76,0.3)', color: '#c9a84c', fontWeight: 600 }}>{n}</span>)}
                      </div>
                    )}
                    {dream.reading && !interpretations[dream.id] && (
                      <div style={{ padding: '0.75rem', borderRadius: '0.75rem', background: isSim ? 'rgba(0,30,0,0.3)' : 'rgba(120,80,220,0.1)', border: isSim ? '1px solid rgba(0,255,65,0.15)' : '1px solid rgba(120,80,220,0.2)', marginBottom: '0.75rem' }}>
                        <p style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: isSim ? 'rgba(0,255,65,0.4)' : 'rgba(200,180,255,0.4)', marginBottom: '0.4rem', fontFamily: isSim ? 'monospace' : 'inherit' }}>{isSim ? '>> RESIDUAL MEMORY DATA' : 'Cosmic Reading'}</p>
                        <p style={{ fontSize: '0.8rem', color: isSim ? 'rgba(100,255,120,0.7)' : 'rgba(220,200,255,0.7)', lineHeight: 1.6, fontStyle: isSim ? 'normal' : 'italic', margin: 0, fontFamily: isSim ? 'monospace' : 'inherit' }}>{dream.reading}</p>
                      </div>
                    )}
                    {/* AI Interpretation */}
                    {interpretations[dream.id] && (
                      <div style={{ padding: '0.875rem', borderRadius: '0.75rem', background: isSim ? 'rgba(0,40,0,0.4)' : 'rgba(80,40,160,0.12)', border: isSim ? '1px solid rgba(0,255,65,0.2)' : '1px solid rgba(160,100,255,0.25)', marginBottom: '0.75rem' }}>
                        <p style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.1em', color: isSim ? 'rgba(0,255,65,0.5)' : 'rgba(200,180,255,0.4)', marginBottom: '0.5rem', fontFamily: isSim ? 'monospace' : 'inherit' }}>{isSim ? '>> MEMORY FRAGMENT ANALYSIS' : '✦ AI Dream Interpretation'}</p>
                        <p style={{ fontSize: '0.82rem', color: isSim ? 'rgba(100,255,120,0.85)' : 'rgba(220,200,255,0.8)', lineHeight: 1.65, margin: 0, fontFamily: isSim ? 'monospace' : 'inherit' }}>{interpretations[dream.id]}</p>
                      </div>
                    )}
                    <button
                      onClick={() => interpretDream(dream)}
                      disabled={interpretingId === dream.id}
                      style={{ display: 'block', width: '100%', padding: '0.65rem', marginBottom: '0.75rem', borderRadius: '0.75rem', background: isSim ? 'rgba(0,255,65,0.08)' : 'rgba(120,80,220,0.15)', border: isSim ? '1px solid rgba(0,255,65,0.25)' : '1px solid rgba(160,100,255,0.3)', color: isSim ? 'rgba(0,255,65,0.8)' : 'rgba(200,170,255,0.9)', cursor: interpretingId === dream.id ? 'not-allowed' : 'pointer', fontSize: '0.82rem', fontWeight: 600, fontFamily: isSim ? 'monospace' : 'inherit', opacity: interpretingId === dream.id ? 0.6 : 1, letterSpacing: isSim ? '0.05em' : 'normal' }}>
                      {interpretingId === dream.id
                        ? (isSim ? '>> PROCESSING MEMORY FRAGMENT...' : '✦ Interpreting your dream...')
                        : interpretations[dream.id]
                          ? (isSim ? '>> RE-ANALYZE FRAGMENT' : '✦ Re-interpret Dream')
                          : (isSim ? '>> ANALYZE MEMORY FRAGMENT' : '✦ Interpret This Dream with AI')}
                    </button>
                    {/* Share Dream Button */}
                    <button
                      onClick={() => openShareMenu(dream.id)}
                      style={{ display: 'block', width: '100%', padding: '0.65rem', marginBottom: '0.5rem', borderRadius: '0.75rem', background: 'transparent', border: isSim ? '1px solid rgba(0,255,65,0.3)' : '1px solid rgba(240,192,64,0.3)', color: isSim ? 'rgba(0,255,65,0.9)' : 'rgba(240,192,64,0.9)', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600, fontFamily: isSim ? 'monospace' : 'inherit', letterSpacing: isSim ? '0.05em' : 'normal' }}>
                      {isSim ? '>> BROADCAST DREAM' : '🌐 Share This Dream'}
                    </button>
                    {sharedDreams[dream.id] && (
                      <button
                        onClick={async () => {
                          setSharingDreamId(dream.id)
                          try {
                            const res = await fetch('/api/dreams/share', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ dreamId: dream.id, isShared: false, title: dream.title, description: dream.description, symbols: dream.symbols }) })
                            if (res.ok) setSharedDreams(prev => ({ ...prev, [dream.id]: false }))
                          } finally { setSharingDreamId(null) }
                        }}
                        disabled={sharingDreamId === dream.id}
                        style={{ display: 'block', width: '100%', padding: '0.5rem', marginBottom: '0.5rem', borderRadius: '0.75rem', background: isSim ? 'rgba(0,255,65,0.1)' : 'rgba(240,192,64,0.08)', border: isSim ? '1px solid rgba(0,255,65,0.2)' : '1px solid rgba(240,192,64,0.2)', color: isSim ? 'rgba(0,255,65,0.7)' : 'rgba(240,192,64,0.7)', cursor: 'pointer', fontSize: '0.72rem', fontFamily: isSim ? 'monospace' : 'inherit', opacity: sharingDreamId === dream.id ? 0.5 : 1 }}>
                        {sharingDreamId === dream.id ? (isSim ? '>> ...' : '...') : (isSim ? '>> REMOVE FROM RESONANCE NETWORK' : '🔮 Unshare from Resonances')}
                      </button>
                    )}
                    {/* ── SHARE MENU MODAL ──────────────────────────────── */}
                    {shareMenuDreamId === dream.id && (
                      <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }} onClick={closeShareMenu}>
                        <div style={{ width: '100%', maxWidth: '380px', background: isSim ? 'rgba(0,8,0,0.97)' : 'rgba(12,8,32,0.97)', border: isSim ? '1px solid rgba(0,255,65,0.3)' : '1px solid rgba(160,100,255,0.35)', borderRadius: '1.25rem', padding: '1.5rem', backdropFilter: 'blur(20px)' }} onClick={e => e.stopPropagation()}>
                          {shareStep === 'menu' && (<>
                            <h3 style={{ fontFamily: isSim ? 'monospace' : 'Cormorant Garamond, serif', fontSize: isSim ? '0.9rem' : '1.3rem', color: isSim ? 'rgba(0,255,65,0.9)' : 'rgba(220,200,255,0.95)', fontWeight: isSim ? 600 : 300, margin: '0 0 1.25rem', textAlign: 'center' }}>{isSim ? '>> SELECT BROADCAST CHANNEL' : '🌙 Share This Dream'}</h3>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                              <button onClick={() => openConversationPicker()} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', width: '100%', padding: '0.85rem 1rem', borderRadius: '0.875rem', background: isSim ? 'rgba(0,255,65,0.06)' : 'rgba(100,160,255,0.08)', border: isSim ? '1px solid rgba(0,255,65,0.2)' : '1px solid rgba(100,160,255,0.25)', color: isSim ? 'rgba(0,255,65,0.9)' : 'rgba(180,210,255,0.95)', cursor: 'pointer', fontSize: '0.85rem', fontFamily: isSim ? 'monospace' : 'inherit', textAlign: 'left' }}>
                                <span style={{ fontSize: '1.2rem' }}>💬</span>
                                <div><div style={{ fontWeight: 600 }}>{isSim ? 'Transmit to Channel' : 'Send to Conversation'}</div><div style={{ fontSize: '0.7rem', opacity: 0.6, marginTop: '0.15rem' }}>{isSim ? 'Direct channel transmission' : 'Send as a message to a soul'}</div></div>
                              </button>
                              <button onClick={() => handlePostToFeed(dream)} disabled={shareProcessing} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', width: '100%', padding: '0.85rem 1rem', borderRadius: '0.875rem', background: isSim ? 'rgba(0,255,65,0.06)' : 'rgba(160,100,255,0.08)', border: isSim ? '1px solid rgba(0,255,65,0.2)' : '1px solid rgba(160,100,255,0.25)', color: isSim ? 'rgba(0,255,65,0.9)' : 'rgba(200,170,255,0.95)', cursor: shareProcessing ? 'not-allowed' : 'pointer', fontSize: '0.85rem', fontFamily: isSim ? 'monospace' : 'inherit', textAlign: 'left', opacity: shareProcessing ? 0.5 : 1 }}>
                                <span style={{ fontSize: '1.2rem' }}>📡</span>
                                <div><div style={{ fontWeight: 600 }}>{isSim ? 'Post to Network Feed' : 'Post to Cosmic Feed'}</div><div style={{ fontSize: '0.7rem', opacity: 0.6, marginTop: '0.15rem' }}>{isSim ? 'Broadcast to all nodes' : 'Share with the cosmic community'}</div></div>
                              </button>
                              <button onClick={() => handleCopyToClipboard(dream)} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', width: '100%', padding: '0.85rem 1rem', borderRadius: '0.875rem', background: isSim ? 'rgba(0,255,65,0.06)' : 'rgba(100,220,160,0.08)', border: isSim ? '1px solid rgba(0,255,65,0.2)' : '1px solid rgba(100,220,160,0.25)', color: isSim ? 'rgba(0,255,65,0.9)' : 'rgba(160,240,200,0.95)', cursor: 'pointer', fontSize: '0.85rem', fontFamily: isSim ? 'monospace' : 'inherit', textAlign: 'left' }}>
                                <span style={{ fontSize: '1.2rem' }}>📋</span>
                                <div><div style={{ fontWeight: 600 }}>{isSim ? 'Copy to Buffer' : 'Copy to Clipboard'}</div><div style={{ fontSize: '0.7rem', opacity: 0.6, marginTop: '0.15rem' }}>{isSim ? 'Store in local buffer' : 'Copy formatted dream text'}</div></div>
                              </button>
                              <button onClick={() => handleShareToResonances(dream)} disabled={shareProcessing} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', width: '100%', padding: '0.85rem 1rem', borderRadius: '0.875rem', background: isSim ? 'rgba(0,255,65,0.06)' : 'rgba(200,100,255,0.08)', border: isSim ? '1px solid rgba(0,255,65,0.2)' : '1px solid rgba(200,100,255,0.25)', color: isSim ? 'rgba(0,255,65,0.9)' : 'rgba(220,180,255,0.95)', cursor: shareProcessing ? 'not-allowed' : 'pointer', fontSize: '0.85rem', fontFamily: isSim ? 'monospace' : 'inherit', textAlign: 'left', opacity: shareProcessing ? 0.5 : 1 }}>
                                <span style={{ fontSize: '1.2rem' }}>🔮</span>
                                <div><div style={{ fontWeight: 600 }}>{isSim ? 'Resonance Network' : 'Dream Resonances (AI match)'}</div><div style={{ fontSize: '0.7rem', opacity: 0.6, marginTop: '0.15rem' }}>{isSim ? 'AI theme extraction + matching' : 'AI extracts themes & finds matching souls'}</div></div>
                              </button>
                            </div>
                            <button onClick={closeShareMenu} style={{ display: 'block', width: '100%', padding: '0.7rem', marginTop: '0.85rem', borderRadius: '0.75rem', background: 'transparent', border: isSim ? '1px solid rgba(0,255,65,0.15)' : '1px solid rgba(200,180,255,0.15)', color: isSim ? 'rgba(0,255,65,0.5)' : 'rgba(200,180,255,0.5)', cursor: 'pointer', fontSize: '0.8rem', fontFamily: isSim ? 'monospace' : 'inherit' }}>{isSim ? '>> CANCEL' : '✕ Cancel'}</button>
                          </>)}
                          {shareStep === 'conversations' && (<>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
                              <button onClick={() => setShareStep('menu')} style={{ background: 'none', border: 'none', color: isSim ? 'rgba(0,255,65,0.6)' : 'rgba(200,180,255,0.5)', cursor: 'pointer', fontSize: '1.1rem', padding: 0 }}>←</button>
                              <h3 style={{ fontFamily: isSim ? 'monospace' : 'Cormorant Garamond, serif', fontSize: isSim ? '0.85rem' : '1.15rem', color: isSim ? 'rgba(0,255,65,0.9)' : 'rgba(220,200,255,0.95)', fontWeight: isSim ? 600 : 300, margin: 0 }}>{isSim ? '>> SELECT CHANNEL' : '💬 Pick a Conversation'}</h3>
                            </div>
                            {loadingConvos ? (
                              <p style={{ textAlign: 'center', color: isSim ? 'rgba(0,255,65,0.5)' : 'rgba(200,180,255,0.5)', fontSize: '0.8rem', padding: '2rem 0', fontFamily: isSim ? 'monospace' : 'inherit' }}>{isSim ? '>> LOADING CHANNELS...' : 'Loading conversations...'}</p>
                            ) : conversations.length === 0 ? (
                              <p style={{ textAlign: 'center', color: isSim ? 'rgba(0,255,65,0.4)' : 'rgba(200,180,255,0.4)', fontSize: '0.8rem', padding: '2rem 0', fontFamily: isSim ? 'monospace' : 'inherit' }}>{isSim ? '>> NO ACTIVE CHANNELS' : 'No active conversations yet'}</p>
                            ) : (
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', maxHeight: '280px', overflowY: 'auto' }}>
                                {conversations.map(c => (
                                  <button key={c.id} onClick={() => handleSendToConversation(dream, c.id)} disabled={shareProcessing} style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', width: '100%', padding: '0.7rem 0.85rem', borderRadius: '0.75rem', background: isSim ? 'rgba(0,255,65,0.05)' : 'rgba(255,255,255,0.04)', border: isSim ? '1px solid rgba(0,255,65,0.15)' : '1px solid rgba(200,180,255,0.12)', color: isSim ? 'rgba(0,255,65,0.9)' : 'rgba(220,200,255,0.9)', cursor: shareProcessing ? 'not-allowed' : 'pointer', fontSize: '0.82rem', fontFamily: isSim ? 'monospace' : 'inherit', textAlign: 'left', opacity: shareProcessing ? 0.5 : 1 }}>
                                    <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: isSim ? 'rgba(0,255,65,0.15)' : 'rgba(160,100,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.75rem', fontWeight: 700, flexShrink: 0 }}>{c.otherUserAvatar || c.otherUserName.charAt(0).toUpperCase()}</div>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                      <div style={{ fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.otherUserName}</div>
                                      {c.lastMessagePreview && <div style={{ fontSize: '0.7rem', opacity: 0.5, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginTop: '0.1rem' }}>{c.lastMessagePreview}</div>}
                                    </div>
                                  </button>
                                ))}
                              </div>
                            )}
                            <button onClick={closeShareMenu} style={{ display: 'block', width: '100%', padding: '0.6rem', marginTop: '0.75rem', borderRadius: '0.75rem', background: 'transparent', border: isSim ? '1px solid rgba(0,255,65,0.15)' : '1px solid rgba(200,180,255,0.15)', color: isSim ? 'rgba(0,255,65,0.5)' : 'rgba(200,180,255,0.5)', cursor: 'pointer', fontSize: '0.78rem', fontFamily: isSim ? 'monospace' : 'inherit' }}>{isSim ? '>> CANCEL' : '✕ Cancel'}</button>
                          </>)}
                          {shareStep === 'success' && (
                            <div style={{ textAlign: 'center', padding: '1.5rem 0' }}>
                              <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>{shareSuccessMsg.includes('❌') || shareSuccessMsg.includes('FAILED') ? '😔' : '✨'}</div>
                              <p style={{ fontFamily: isSim ? 'monospace' : 'Cormorant Garamond, serif', fontSize: isSim ? '0.85rem' : '1.15rem', color: isSim ? 'rgba(0,255,65,0.9)' : 'rgba(220,200,255,0.9)', fontWeight: isSim ? 600 : 400, marginBottom: '0.5rem' }}>{shareSuccessMsg}</p>
                              {shareSuccessMsg.includes('Resonances') && !shareSuccessMsg.includes('Removed') && (
                                <a href="/dashboard/dream-resonances" style={{ display: 'inline-block', marginBottom: '0.75rem', fontSize: '0.78rem', color: isSim ? 'rgba(0,255,65,0.7)' : 'rgba(200,170,255,0.8)', textDecoration: 'underline' }}>{isSim ? '>> VIEW RESONANCES' : 'View Dream Resonances →'}</a>
                              )}
                              <button onClick={closeShareMenu} style={{ display: 'block', width: '100%', padding: '0.7rem', marginTop: '0.5rem', borderRadius: '0.75rem', background: isSim ? 'rgba(0,255,65,0.1)' : 'rgba(160,100,255,0.15)', border: isSim ? '1px solid rgba(0,255,65,0.25)' : '1px solid rgba(160,100,255,0.3)', color: isSim ? 'rgba(0,255,65,0.9)' : 'rgba(200,170,255,0.9)', cursor: 'pointer', fontSize: '0.82rem', fontWeight: 600, fontFamily: isSim ? 'monospace' : 'inherit' }}>{isSim ? '>> CLOSE' : 'Done'}</button>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : mounted ? (
          <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.2 }}>🌙</div>
            <p style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.5rem', color: 'rgba(200,180,255,0.5)', fontWeight: 300, marginBottom: '0.5rem' }}>No dreams recorded yet</p>
            <p style={{ color: 'rgba(200,180,255,0.3)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>Record your dreams to discover their cosmic messages</p>
            <button onClick={() => setDreamView('new')} style={{ padding: '0.75rem 2rem', borderRadius: '9999px', background: 'rgba(60,30,120,0.3)', border: '1px solid rgba(120,80,220,0.3)', color: 'rgba(200,170,255,0.8)', cursor: 'pointer', fontSize: '0.875rem' }}>+ Record a Dream</button>
          </div>
        ) : null}
      </div>
    )
  }


  // ── SHARE MENU HELPERS ──────────────────────────────────────────────────
  function openShareMenu(dreamId: string) {
    setShareMenuDreamId(dreamId)
    setShareStep('menu')
    setShareSuccessMsg('')
  }
  function closeShareMenu() {
    setShareMenuDreamId(null)
    setShareStep('menu')
    setShareSuccessMsg('')
  }
  async function openConversationPicker() {
    setLoadingConvos(true)
    setShareStep('conversations')
    try {
      const convos = await getConversations()
      setConversations(convos)
    } catch { setConversations([]) }
    finally { setLoadingConvos(false) }
  }
  async function handleSendToConversation(dream: DreamEntry, convoId: string) {
    setShareProcessing(true)
    try {
      const msg = `🌙 Shared Dream: ${dream.description || dream.title}`
      await sendMessage({ conversationId: convoId, content: msg })
      setShareStep('success')
      setShareSuccessMsg(isSim ? '>> DREAM TRANSMITTED TO CHANNEL' : '✨ Dream sent to conversation!')
    } catch {
      setShareSuccessMsg(isSim ? '>> TRANSMISSION FAILED' : '❌ Failed to send. Try again.')
      setShareStep('success')
    } finally { setShareProcessing(false) }
  }
  async function handlePostToFeed(dream: DreamEntry) {
    setShareProcessing(true)
    try {
      await savePost({ content: `🌙 ${dream.title}\n\n${dream.description}` })
      setShareStep('success')
      setShareSuccessMsg(isSim ? '>> DREAM POSTED TO NETWORK FEED' : '✨ Dream posted to Cosmic Feed!')
    } catch {
      setShareSuccessMsg(isSim ? '>> FEED POST FAILED' : '❌ Failed to post. Try again.')
      setShareStep('success')
    } finally { setShareProcessing(false) }
  }
  function handleCopyToClipboard(dream: DreamEntry) {
    const dateStr = new Date(dream.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    const text = `🌙 Dream from ${dateStr}: ${dream.description || dream.title}`
    navigator.clipboard.writeText(text).then(() => {
      setShareStep('success')
      setShareSuccessMsg(isSim ? '>> COPIED TO BUFFER' : '📋 Copied to clipboard!')
    }).catch(() => {
      setShareStep('success')
      setShareSuccessMsg(isSim ? '>> BUFFER COPY FAILED' : '❌ Copy failed. Try again.')
    })
  }
  async function handleShareToResonances(dream: DreamEntry) {
    setShareProcessing(true)
    try {
      const newState = !sharedDreams[dream.id]
      const res = await fetch('/api/dreams/share', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ dreamId: dream.id, isShared: newState, title: dream.title, description: dream.description, symbols: dream.symbols }) })
      if (res.ok) {
        setSharedDreams(prev => ({ ...prev, [dream.id]: newState }))
        setShareStep('success')
        setShareSuccessMsg(newState
          ? (isSim ? '>> DREAM SHARED TO RESONANCE NETWORK' : '🔮 Shared to Dream Resonances!')
          : (isSim ? '>> REMOVED FROM RESONANCE NETWORK' : '🔮 Removed from Dream Resonances'))
      }
    } catch {
      setShareSuccessMsg(isSim ? '>> RESONANCE SHARE FAILED' : '❌ Failed. Try again.')
      setShareStep('success')
    } finally { setShareProcessing(false) }
  }


  async function interpretDream(dream: DreamEntry) {
    if (interpretingId) return
    setInterpretingId(dream.id)
    try {
      const numProfile = getNumerologyProfile()
      const recentLogs = logs.slice(0, 5)
      const res = await fetch('/api/dreams/interpret', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: dream.title,
          description: dream.description,
          symbols: dream.symbols,
          moods: dream.moods,
          angelNumbers: dream.angelNumbers,
          recentLogs,
          numerologyProfile: numProfile,
          mode: isSim ? 'simulation' : 'spiritual',
        })
      })
      const data = await res.json()
      if (data.interpretation) {
        setInterpretations(prev => ({ ...prev, [dream.id]: data.interpretation }))
        // Persist the interpretation to the dream entry
        await updateDreamReading(dream.id, data.interpretation)
      }
    } catch {
      setInterpretations(prev => ({ ...prev, [dream.id]: 'Interpretation unavailable. Please try again.' }))
    } finally {
      setInterpretingId(null)
    }
  }

  // ── REFLECT TAB ──────────────────────────────────────────────────────────
  if (activeTab === 'reflect') {
    return (
      <div style={{ maxWidth: '640px', margin: '0 auto', padding: '1.5rem 1rem' }}>
        {tabBar}
        <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2rem', color: 'rgba(220,200,255,0.9)', fontWeight: 300, marginBottom: '0.25rem' }}>Reflect</h1>
        <p style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'rgba(200,180,255,0.35)', marginBottom: '1.5rem' }}>Gratitude & manifestation practices</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <a href="/dashboard/gratitude" style={{ textDecoration: 'none' }}>
            <div style={{ background: 'rgba(8,6,28,0.88)', border: '1px solid rgba(74,222,128,0.2)', borderRadius: '1.25rem', padding: '1.5rem', backdropFilter: 'blur(12px)', cursor: 'pointer', transition: 'all 0.2s' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '0.75rem', background: 'rgba(74,222,128,0.12)', border: '1px solid rgba(74,222,128,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem' }}>🙏</div>
                <div>
                  <div style={{ color: 'rgba(220,200,255,0.9)', fontSize: '1.1rem', fontWeight: 600, fontFamily: 'Cormorant Garamond, serif' }}>Gratitude Journal</div>
                  <div style={{ color: 'rgba(180,160,255,0.4)', fontSize: '0.75rem' }}>Daily gratitude practice</div>
                </div>
              </div>
              <p style={{ color: 'rgba(200,180,255,0.5)', fontSize: '0.85rem', lineHeight: 1.5, margin: 0 }}>Cultivate abundance by acknowledging the blessings in your life. Record what you are grateful for each day.</p>
            </div>
          </a>
          <a href="/dashboard/manifestations" style={{ textDecoration: 'none' }}>
            <div style={{ background: 'rgba(8,6,28,0.88)', border: '1px solid rgba(167,139,250,0.2)', borderRadius: '1.25rem', padding: '1.5rem', backdropFilter: 'blur(12px)', cursor: 'pointer', transition: 'all 0.2s' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                <div style={{ width: '44px', height: '44px', borderRadius: '0.75rem', background: 'rgba(167,139,250,0.12)', border: '1px solid rgba(167,139,250,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem' }}>🌱</div>
                <div>
                  <div style={{ color: 'rgba(220,200,255,0.9)', fontSize: '1.1rem', fontWeight: 600, fontFamily: 'Cormorant Garamond, serif' }}>Manifestations</div>
                  <div style={{ color: 'rgba(180,160,255,0.4)', fontSize: '0.75rem' }}>Track your manifestation journey</div>
                </div>
              </div>
              <p style={{ color: 'rgba(200,180,255,0.5)', fontSize: '0.85rem', lineHeight: 1.5, margin: 0 }}>Set intentions, track progress, and watch your dreams become reality through focused cosmic alignment.</p>
            </div>
          </a>
        </div>
      </div>
    )
  }

  // ── VISION TAB ──────────────────────────────────────────────────────────
  if (activeTab === 'vision') {
    return (
      <div style={{ maxWidth: '640px', margin: '0 auto', padding: '1.5rem 1rem' }}>
        {tabBar}
        <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2rem', color: 'rgba(220,200,255,0.9)', fontWeight: 300, marginBottom: '0.25rem' }}>Vision Board</h1>
        <p style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'rgba(200,180,255,0.35)', marginBottom: '1.5rem' }}>Visualize your cosmic destiny</p>
        <a href="/dashboard/vision-board" style={{ textDecoration: 'none' }}>
          <div style={{ background: 'rgba(8,6,28,0.88)', border: '1px solid rgba(129,140,248,0.2)', borderRadius: '1.25rem', padding: '2rem', backdropFilter: 'blur(12px)', cursor: 'pointer', transition: 'all 0.2s', textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🖼️</div>
            <div style={{ color: 'rgba(220,200,255,0.9)', fontSize: '1.25rem', fontWeight: 600, fontFamily: 'Cormorant Garamond, serif', marginBottom: '0.5rem' }}>Open Vision Board</div>
            <p style={{ color: 'rgba(200,180,255,0.5)', fontSize: '0.85rem', lineHeight: 1.5, margin: 0 }}>Create a visual manifestation board with images, affirmations, and cosmic goals. Pin your dreams and watch them materialize.</p>
          </div>
        </a>
      </div>
    )
  }

  // ── THOUGHT ANCHOR LIST ───────────────────────────────────────────────────
  return (
    <div style={{ maxWidth: '640px', margin: '0 auto', padding: '1.5rem 1rem' }}>
      {tabBar}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2rem', color: 'rgba(220,200,255,0.9)', fontWeight: 300, marginBottom: '0.25rem' }}>Thought Anchor</h1>
          <p style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'rgba(200,180,255,0.35)' }}>{mounted ? `${stats.total} sighting${stats.total !== 1 ? 's' : ''} recorded` : ''}</p>
        </div>
        <button onClick={() => setView('new')} style={{ padding: '0.6rem 1.25rem', borderRadius: '9999px', background: 'linear-gradient(135deg, rgba(100,60,180,0.3), rgba(60,30,120,0.3))', border: '1px solid rgba(160,100,255,0.35)', color: 'rgba(200,170,255,0.9)', cursor: 'pointer', fontSize: '0.875rem', whiteSpace: 'nowrap' }}>+ New Entry</button>
      </div>
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
      <div style={{ position: 'relative', marginBottom: '1rem' }}>
        <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'rgba(200,180,255,0.3)', fontSize: '0.875rem' }}>🔍</span>
        <input type="text" value={query} onChange={e => setQuery(e.target.value)} placeholder="Search by number, thought, or keyword..." style={{ width: '100%', borderRadius: '0.75rem', padding: '0.75rem 1rem 0.75rem 2.5rem', fontSize: '0.875rem', outline: 'none', boxSizing: 'border-box', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(200,180,255,0.15)', color: 'rgba(255,255,255,0.8)', fontFamily: 'inherit' }} />
        {query && <button onClick={() => setQuery('')} style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'rgba(200,180,255,0.4)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1rem' }}>×</button>}
      </div>
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
      {mounted && Object.keys(grouped).length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {Object.entries(grouped).map(([date, dateLogs]) => (
            <div key={date}>
              <p style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'rgba(200,180,255,0.3)', marginBottom: '0.75rem', paddingLeft: '0.25rem' }}>{date}</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {dateLogs.map(log => <JournalEntry key={log.id} log={log} onDelete={handleDelete} onToggleShare={handleToggleShare} />)}
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
