'use client'
import { useState, useEffect } from 'react'
import { ANGEL_MEANINGS } from '@/lib/angel-meanings'
import { calcLifePath } from '@/lib/numerology'

const KEY_LOGS = 'synchrosoul_logs'
const KEY_DREAMS = 'synchrosoul_dreams'
const KEY_GRATITUDE = 'synchrosoul_gratitude'
const KEY_PROFILE = 'synchrosoul_numerology_profile'
const KEY_MANIFEST = 'synchrosoul_manifestations'

interface Log { number: string; createdAt: string; thought?: string }
interface Dream { title?: string; content?: string; createdAt: string; numbers?: string[] }
interface Gratitude { text: string; createdAt: string }
interface Manifestation { intention: string; status: string; number: string }

function getWeekRange() {
  const now = new Date()
  const day = now.getDay()
  const start = new Date(now)
  start.setDate(now.getDate() - day)
  start.setHours(0,0,0,0)
  const end = new Date(start)
  end.setDate(start.getDate() + 6)
  end.setHours(23,59,59,999)
  return { start, end }
}

function getPersonalDay(date: Date, lifePath: number): number {
  const d = date.getDate() + date.getMonth() + 1 + lifePath
  let n = d
  while (n > 9 && n !== 11 && n !== 22 && n !== 33) {
    n = String(n).split('').reduce((s,c) => s + parseInt(c), 0)
  }
  return n
}

export default function SynthesisPage() {
  const [logs, setLogs] = useState<Log[]>([])
  const [dreams, setDreams] = useState<Dream[]>([])
  const [gratitude, setGratitude] = useState<Gratitude[]>([])
  const [profile, setProfile] = useState<any>(null)
  const [manifests, setManifests] = useState<Manifestation[]>([])
  const [tab, setTab] = useState<'week'|'month'>('week')

  useEffect(() => {
    try {
      setLogs(JSON.parse(localStorage.getItem(KEY_LOGS) || '[]'))
      setDreams(JSON.parse(localStorage.getItem(KEY_DREAMS) || '[]'))
      setGratitude(JSON.parse(localStorage.getItem(KEY_GRATITUDE) || '[]'))
      setProfile(JSON.parse(localStorage.getItem(KEY_PROFILE) || 'null'))
      setManifests(JSON.parse(localStorage.getItem(KEY_MANIFEST) || '[]'))
    } catch {}
  }, [])

  const { start, end } = getWeekRange()
  const monthStart = new Date(); monthStart.setDate(1); monthStart.setHours(0,0,0,0)

  const rangeStart = tab === 'week' ? start : monthStart
  const rangeLabel = tab === 'week' ? 'This Week' : 'This Month'

  const rangeLogs = logs.filter(l => new Date(l.createdAt) >= rangeStart)
  const rangeDreams = dreams.filter(d => new Date(d.createdAt) >= rangeStart)
  const rangeGratitude = gratitude.filter(g => new Date(g.createdAt) >= rangeStart)

  // Top numbers in range
  const freq: Record<string,number> = {}
  rangeLogs.forEach(l => { freq[l.number] = (freq[l.number]||0)+1 })
  const topNums = Object.entries(freq).sort((a,b) => b[1]-a[1]).slice(0,3)

  // Thought themes
  const thoughts = rangeLogs.filter(l => l.thought).map(l => l.thought!)
  const wordFreq: Record<string,number> = {}
  const stop = new Set(['i','a','the','and','or','to','in','of','my','me','was','is','it','at','on','for','with','that','this','be','are','have','had','but','not','so','do','did','an','as','by','from','up','about','into','then','than','when','what','how','if','its','we','he','she','they','you','your','their','our','his','her','been','has','will','would','could','should','just','like','get','got','feel','felt','see','saw','know','think','thought','want','need'])
  thoughts.forEach(t => t.toLowerCase().split(/\s+/).forEach(w => {
    const c = w.replace(/[^a-z]/g,'')
    if (c.length > 3 && !stop.has(c)) wordFreq[c] = (wordFreq[c]||0)+1
  }))
  const topWords = Object.entries(wordFreq).sort((a,b) => b[1]-a[1]).slice(0,6)

  // Personal day
  const lifePath = profile?.lifePathNumber || 0
  const personalDay = lifePath ? getPersonalDay(new Date(), lifePath) : null

  // Active manifestations
  const activeManifests = manifests.filter(m => m.status !== 'manifested').slice(0,3)

  // Synthesis message
  const topNum = topNums[0]?.[0]
  const topMeaning = topNum ? ANGEL_MEANINGS[topNum] : null

  const SYNTHESIS_THEMES = [
    'Your energy this period carries a strong current of transformation.',
    'The universe has been sending you clear signals of alignment.',
    'This has been a period of deep inner knowing and spiritual attunement.',
    'Your vibration has been elevated — the signs confirm your path.',
    'A powerful convergence of energies has been building around you.',
  ]
  const synthTheme = SYNTHESIS_THEMES[(new Date().getDate() + (lifePath||0)) % SYNTHESIS_THEMES.length]

  const card: React.CSSProperties = { background: 'rgba(8,6,28,0.88)', border: '1px solid rgba(200,180,255,0.12)', borderRadius: '1.25rem', backdropFilter: 'blur(12px)', padding: '1.25rem', marginBottom: '0.875rem' }
  const label: React.CSSProperties = { color: 'rgba(180,160,255,0.4)', fontSize: '0.62rem', textTransform: 'uppercase' as const, letterSpacing: '0.1em', marginBottom: '0.875rem', display: 'block' }

  return (
    <div style={{ maxWidth: '560px', margin: '0 auto', padding: '1.5rem 1rem 2rem' }}>
      <div style={{ marginBottom: '1.25rem' }}>
        <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.8rem', color: 'rgba(220,200,255,0.95)', margin: '0 0 0.25rem', fontWeight: 400 }}>Cosmic Synthesis</h1>
        <p style={{ color: 'rgba(180,160,255,0.5)', fontSize: '0.8rem', margin: 0 }}>Your spiritual journey, woven together</p>
      </div>

      {/* Tab */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem' }}>
        {(['week','month'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)} style={{ padding: '0.4rem 1.25rem', borderRadius: '9999px', border: tab === t ? '1px solid rgba(167,139,250,0.5)' : '1px solid rgba(200,180,255,0.1)', background: tab === t ? 'rgba(167,139,250,0.15)' : 'transparent', color: tab === t ? '#a78bfa' : 'rgba(180,160,255,0.4)', fontSize: '0.78rem', cursor: 'pointer', textTransform: 'capitalize' }}>{t}</button>
        ))}
      </div>

      {/* Summary stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '0.5rem', marginBottom: '1rem' }}>
        {[
          { label: 'Signs', value: rangeLogs.length, emoji: '✦', color: '#a78bfa' },
          { label: 'Dreams', value: rangeDreams.length, emoji: '🌙', color: '#818cf8' },
          { label: 'Gratitude', value: rangeGratitude.length, emoji: '💛', color: '#c9a84c' },
          { label: 'Intentions', value: activeManifests.length, emoji: '🌱', color: '#4ade80' },
        ].map(s => (
          <div key={s.label} style={{ background: 'rgba(8,6,28,0.88)', border: '1px solid rgba(200,180,255,0.08)', borderRadius: '0.875rem', padding: '0.75rem', textAlign: 'center' }}>
            <div style={{ fontSize: '1.1rem' }}>{s.emoji}</div>
            <div style={{ color: s.color, fontSize: '1.2rem', fontWeight: 700 }}>{s.value}</div>
            <div style={{ color: 'rgba(180,160,255,0.35)', fontSize: '0.55rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Synthesis message */}
      <div style={{ ...card, borderColor: 'rgba(201,168,76,0.2)', background: 'rgba(8,6,28,0.95)' }}>
        <span style={label}>✦ {rangeLabel} Reading</span>
        <p style={{ color: 'rgba(220,200,255,0.8)', lineHeight: 1.8, margin: '0 0 0.875rem', fontFamily: 'Cormorant Garamond, serif', fontStyle: 'italic', fontSize: '1.05rem' }}>
          {synthTheme}
          {topMeaning && <> The dominant energy of <span style={{ color: topMeaning.color }}>{topNum} ({topMeaning.title})</span> has been guiding your awareness.</>}
          {personalDay && <> Today is a Personal Day {personalDay} — a time for {personalDay <= 3 ? 'new beginnings and action' : personalDay <= 6 ? 'reflection and nurturing' : 'completion and wisdom'}.</>}
        </p>
        {topMeaning && (
          <div style={{ background: topMeaning.color + '08', border: '1px solid ' + topMeaning.color + '20', borderRadius: '0.875rem', padding: '0.875rem' }}>
            <div style={{ color: topMeaning.color, fontSize: '0.78rem', fontWeight: 600, marginBottom: '0.3rem' }}>{topNum} · {topMeaning.title}</div>
            <div style={{ color: 'rgba(200,180,255,0.6)', fontSize: '0.8rem', lineHeight: 1.6 }}>{topMeaning.message.slice(0,150)}...</div>
          </div>
        )}
      </div>

      {/* Top numbers */}
      {topNums.length > 0 && (
        <div style={card}>
          <span style={label}>Dominant Numbers {rangeLabel}</span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.625rem' }}>
            {topNums.map(([num, count], i) => {
              const m = ANGEL_MEANINGS[num]
              return (
                <div key={num} style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
                  <div style={{ width: '2.5rem', height: '2.5rem', borderRadius: '0.625rem', background: (m?.color || '#a78bfa') + '15', border: '1px solid ' + (m?.color || '#a78bfa') + '25', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <span style={{ color: m?.color || '#a78bfa', fontSize: '0.82rem', fontWeight: 700 }}>{num}</span>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ color: 'rgba(220,200,255,0.8)', fontSize: '0.85rem' }}>{m?.title || num}</div>
                    <div style={{ height: '3px', background: 'rgba(200,180,255,0.06)', borderRadius: '9999px', marginTop: '0.3rem', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: (count/topNums[0][1]*100)+'%', background: m?.color || '#a78bfa', opacity: 0.5, borderRadius: '9999px' }} />
                    </div>
                  </div>
                  <span style={{ color: 'rgba(180,160,255,0.4)', fontSize: '0.75rem', minWidth: '2rem', textAlign: 'right' }}>{count}×</span>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Thought themes */}
      {topWords.length > 0 && (
        <div style={card}>
          <span style={label}>Recurring Themes in Your Thoughts</span>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
            {topWords.map(([word, count]) => (
              <span key={word} style={{ background: 'rgba(96,165,250,0.08)', border: '1px solid rgba(96,165,250,0.18)', borderRadius: '9999px', padding: '0.25rem 0.75rem', color: '#60a5fa', fontSize: '0.78rem' }}>
                {word} <span style={{ opacity: 0.45, fontSize: '0.65rem' }}>×{count}</span>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Active manifestations */}
      {activeManifests.length > 0 && (
        <div style={card}>
          <span style={label}>Active Intentions</span>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {activeManifests.map((m, i) => (
              <div key={i} style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-start', padding: '0.625rem', background: 'rgba(8,6,28,0.5)', borderRadius: '0.75rem', border: '1px solid rgba(200,180,255,0.06)' }}>
                <span style={{ fontSize: '1rem', flexShrink: 0 }}>{m.status === 'planting' ? '🌱' : m.status === 'growing' ? '🌿' : '🌸'}</span>
                <div>
                  <div style={{ color: 'rgba(200,180,255,0.75)', fontSize: '0.82rem', lineHeight: 1.5 }}>{m.intention.slice(0,80)}{m.intention.length > 80 ? '...' : ''}</div>
                  <div style={{ color: 'rgba(201,168,76,0.4)', fontSize: '0.65rem', marginTop: '0.2rem' }}>✦ {m.number}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Personal day */}
      {personalDay && (
        <div style={{ ...card, borderColor: 'rgba(167,139,250,0.2)' }}>
          <span style={label}>Personal Day Energy</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(167,139,250,0.1)', border: '1px solid rgba(167,139,250,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <span style={{ color: '#a78bfa', fontSize: '1.5rem', fontWeight: 700 }}>{personalDay}</span>
            </div>
            <div>
              <div style={{ color: 'rgba(220,200,255,0.85)', fontSize: '0.9rem', marginBottom: '0.25rem' }}>Personal Day {personalDay}</div>
              <div style={{ color: 'rgba(180,160,255,0.5)', fontSize: '0.8rem', lineHeight: 1.5 }}>
                {personalDay === 1 && 'New beginnings, take initiative, plant seeds'}
                {personalDay === 2 && 'Cooperation, patience, nurture relationships'}
                {personalDay === 3 && 'Creativity, expression, joy and socializing'}
                {personalDay === 4 && 'Work, discipline, build solid foundations'}
                {personalDay === 5 && 'Change, freedom, embrace the unexpected'}
                {personalDay === 6 && 'Love, family, service and responsibility'}
                {personalDay === 7 && 'Reflection, solitude, spiritual insight'}
                {personalDay === 8 && 'Power, ambition, material manifestation'}
                {personalDay === 9 && 'Completion, release, compassion for all'}
                {personalDay === 11 && 'Illumination, inspiration, spiritual mastery'}
                {personalDay === 22 && 'Master building, grand visions made real'}
                {personalDay === 33 && 'Master teaching, unconditional love flows'}
              </div>
            </div>
          </div>
        </div>
      )}

      {rangeLogs.length === 0 && (
        <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.875rem' }}>🌌</div>
          <p style={{ color: 'rgba(180,160,255,0.4)', fontSize: '0.85rem' }}>Log angel numbers this {tab} to generate your cosmic synthesis.</p>
        </div>
      )}
    </div>
  )
}
