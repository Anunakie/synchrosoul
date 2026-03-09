'use client'
import { useState, useEffect } from 'react'
import { calcLifePath } from '@/lib/numerology'

const LOGS_KEY = 'synchrosoul_logs'
const DREAMS_KEY = 'synchrosoul_dreams'
const GRATITUDE_KEY = 'synchrosoul_gratitude'
const MANIFEST_KEY = 'synchrosoul_manifestations_v2'

const NUMBER_THEMES: Record<string, { theme: string; message: string; color: string }> = {
  '111': { theme: 'New Beginnings', message: 'The universe is opening a portal of manifestation. Your thoughts are seeds.', color: '#60a5fa' },
  '222': { theme: 'Divine Balance', message: 'Trust the process. Partnerships and harmony are being woven into your path.', color: '#a78bfa' },
  '333': { theme: 'Ascended Masters', message: 'You are surrounded by divine guidance. Creative energy flows through you.', color: '#e879f9' },
  '444': { theme: 'Angelic Protection', message: 'Your angels are near. Foundations are being built for your highest good.', color: '#34d399' },
  '555': { theme: 'Sacred Change', message: 'Transformation is imminent. Release what no longer serves your soul.', color: '#f59e0b' },
  '666': { theme: 'Heart Alignment', message: 'Rebalance your focus between material and spiritual. Love is the answer.', color: '#f472b6' },
  '777': { theme: 'Spiritual Luck', message: 'You are in perfect alignment. Miracles and synchronicities multiply now.', color: '#c9a84c' },
  '888': { theme: 'Infinite Abundance', message: 'The cycle of abundance is completing. Receive with open hands and heart.', color: '#fb923c' },
  '999': { theme: 'Divine Completion', message: 'A chapter closes beautifully. Prepare for a profound new beginning.', color: '#60a5fa' },
  '1111': { theme: 'Awakening Portal', message: 'You are awake. The veil is thin. Your soul is remembering its mission.', color: '#e879f9' },
}

function getWeekDates() {
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

function getPersonalDay(date: Date, lifePathNum: number): number {
  const sum = date.getDate() + (date.getMonth() + 1) + lifePathNum
  let n = sum
  while (n > 9 && n !== 11 && n !== 22 && n !== 33) {
    n = String(n).split('').reduce((a, d) => a + parseInt(d), 0)
  }
  return n
}

export default function SynthesisPage() {
  const [logs, setLogs] = useState<any[]>([])
  const [dreams, setDreams] = useState<any[]>([])
  const [gratitude, setGratitude] = useState<any[]>([])
  const [manifestations, setManifestations] = useState<any[]>([])
  const [profile, setProfile] = useState<any>(null)
  const [activeTab, setActiveTab] = useState<'week' | 'month' | 'all'>('week')

  useEffect(() => {
    setLogs(JSON.parse(localStorage.getItem(LOGS_KEY) || '[]'))
    setDreams(JSON.parse(localStorage.getItem(DREAMS_KEY) || '[]'))
    setGratitude(JSON.parse(localStorage.getItem(GRATITUDE_KEY) || '[]'))
    setManifestations(JSON.parse(localStorage.getItem(MANIFEST_KEY) || '[]'))
    setProfile(JSON.parse(localStorage.getItem('synchrosoul_profile') || 'null'))
  }, [])

  const { start, end } = getWeekDates()

  function filterByPeriod(items: any[]) {
    const now = new Date()
    return items.filter(i => {
      const d = new Date(i.createdAt || i.timestamp || i.date)
      if (activeTab === 'week') return d >= start && d <= end
      if (activeTab === 'month') return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
      return true
    })
  }

  const periodLogs = filterByPeriod(logs)
  const periodDreams = filterByPeriod(dreams)
  const periodGratitude = filterByPeriod(gratitude)

  // Top numbers this period
  const numberCounts: Record<string, number> = {}
  periodLogs.forEach((l: any) => { numberCounts[l.number] = (numberCounts[l.number] || 0) + 1 })
  const topNumbers = Object.entries(numberCounts).sort((a, b) => b[1] - a[1]).slice(0, 3)

  // Personal day number
  const lifePathNum = profile?.lifePathNumber || (profile?.birthdate ? calcLifePath(profile.birthdate) : 0)
  const personalDay = lifePathNum ? getPersonalDay(new Date(), lifePathNum) : null

  // Dominant theme
  const dominantNumber = topNumbers[0]?.[0]
  const dominantTheme = dominantNumber ? NUMBER_THEMES[dominantNumber] || NUMBER_THEMES['444'] : null

  // Gratitude words
  const allGratitudeText = periodGratitude.flatMap((g: any) => g.items || []).join(' ')
  const wordFreq: Record<string, number> = {}
  allGratitudeText.toLowerCase().split(/\s+/).filter(w => w.length > 4).forEach(w => { wordFreq[w] = (wordFreq[w] || 0) + 1 })
  const topWords = Object.entries(wordFreq).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([w]) => w)

  const card = { background: 'rgba(8,6,28,0.88)', border: '1px solid rgba(200,180,255,0.12)', borderRadius: '1.25rem', backdropFilter: 'blur(12px)' } as React.CSSProperties
  const periodLabel = activeTab === 'week' ? 'This Week' : activeTab === 'month' ? 'This Month' : 'All Time'

  return (
    <div style={{ maxWidth: '680px', margin: '0 auto', padding: '1.5rem 1rem 2rem' }}>
      <div style={{ marginBottom: '1.25rem' }}>
        <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.8rem', color: 'rgba(220,200,255,0.95)', margin: '0 0 0.25rem', fontWeight: 400 }}>Cosmic Synthesis</h1>
        <p style={{ color: 'rgba(180,160,255,0.5)', fontSize: '0.8rem', margin: 0 }}>Your spiritual journey at a glance</p>
      </div>

      {/* Period tabs */}
      <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '1.25rem' }}>
        {(['week','month','all'] as const).map(t => (
          <button key={t} onClick={() => setActiveTab(t)} style={{ padding: '0.4rem 0.875rem', borderRadius: '2rem', border: activeTab === t ? '1px solid rgba(167,139,250,0.5)' : '1px solid rgba(200,180,255,0.1)', background: activeTab === t ? 'rgba(167,139,250,0.15)' : 'rgba(8,6,28,0.7)', color: activeTab === t ? '#a78bfa' : 'rgba(180,160,255,0.45)', fontSize: '0.75rem', cursor: 'pointer', textTransform: 'capitalize' }}>{t === 'all' ? 'All Time' : `This ${t.charAt(0).toUpperCase() + t.slice(1)}`}</button>
        ))}
      </div>

      {/* Stats grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem', marginBottom: '1.25rem' }}>
        {[
          { label: 'Sightings', value: periodLogs.length, emoji: '👀', color: '#a78bfa' },
          { label: 'Dreams', value: periodDreams.length, emoji: '🌙', color: '#e879f9' },
          { label: 'Gratitudes', value: periodGratitude.length, emoji: '💛', color: '#f59e0b' },
          { label: 'Manifesting', value: manifestations.filter((m: any) => m.status !== 'manifested').length, emoji: '🌱', color: '#34d399' },
        ].map(s => (
          <div key={s.label} style={{ ...card, padding: '0.875rem 0.5rem', textAlign: 'center' }}>
            <div style={{ fontSize: '1.1rem', marginBottom: '0.2rem' }}>{s.emoji}</div>
            <div style={{ color: s.color, fontSize: '1.2rem', fontWeight: 700 }}>{s.value}</div>
            <div style={{ color: 'rgba(180,160,255,0.4)', fontSize: '0.58rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Dominant theme */}
      {dominantTheme && (
        <div style={{ ...card, padding: '1.25rem', marginBottom: '1rem', borderColor: `${dominantTheme.color}33`, background: `${dominantTheme.color}08` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
            <div style={{ width: '2.5rem', height: '2.5rem', borderRadius: '50%', background: `${dominantTheme.color}20`, border: `1px solid ${dominantTheme.color}44`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem', flexShrink: 0 }}>✦</div>
            <div>
              <div style={{ color: 'rgba(180,160,255,0.4)', fontSize: '0.62rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.2rem' }}>Dominant Frequency {periodLabel}</div>
              <div style={{ color: dominantTheme.color, fontSize: '1rem', fontWeight: 600 }}>{dominantNumber} — {dominantTheme.theme}</div>
            </div>
          </div>
          <p style={{ color: 'rgba(200,180,255,0.7)', fontSize: '0.85rem', margin: 0, lineHeight: 1.6, fontStyle: 'italic' }}>&ldquo;{dominantTheme.message}&rdquo;</p>
        </div>
      )}

      {/* Top numbers */}
      {topNumbers.length > 0 && (
        <div style={{ ...card, padding: '1.25rem', marginBottom: '1rem' }}>
          <div style={{ color: 'rgba(180,160,255,0.4)', fontSize: '0.62rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.875rem' }}>Number Frequency {periodLabel}</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            {topNumbers.map(([num, count], i) => {
              const theme = NUMBER_THEMES[num]
              const maxCount = topNumbers[0][1]
              return (
                <div key={num}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                    <span style={{ color: theme?.color || '#a78bfa', fontSize: '0.85rem', fontWeight: 600 }}>{num} {theme ? `— ${theme.theme}` : ''}</span>
                    <span style={{ color: 'rgba(180,160,255,0.5)', fontSize: '0.78rem' }}>{count}x</span>
                  </div>
                  <div style={{ height: '4px', borderRadius: '2px', background: 'rgba(255,255,255,0.05)' }}>
                    <div style={{ height: '100%', width: `${(count / maxCount) * 100}%`, background: theme?.color || '#a78bfa', borderRadius: '2px', opacity: 0.7 }} />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Personal day */}
      {personalDay && (
        <div style={{ ...card, padding: '1.25rem', marginBottom: '1rem', borderColor: 'rgba(201,168,76,0.2)' }}>
          <div style={{ color: 'rgba(180,160,255,0.4)', fontSize: '0.62rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>Today's Personal Day Number</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ width: '3rem', height: '3rem', borderRadius: '50%', background: 'rgba(201,168,76,0.15)', border: '1px solid rgba(201,168,76,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#c9a84c', fontSize: '1.4rem', fontWeight: 700, flexShrink: 0 }}>{personalDay}</div>
            <p style={{ color: 'rgba(200,180,255,0.7)', fontSize: '0.85rem', margin: 0, lineHeight: 1.5 }}>
              {personalDay === 1 && 'A day for bold new starts. Take initiative and trust your instincts.'}
              {personalDay === 2 && 'A day for patience and cooperation. Listen deeply to others.'}
              {personalDay === 3 && 'A day for creative expression. Share your gifts with the world.'}
              {personalDay === 4 && 'A day for grounding and building. Focus on practical foundations.'}
              {personalDay === 5 && 'A day for freedom and change. Embrace the unexpected.'}
              {personalDay === 6 && 'A day for love and service. Nurture your relationships.'}
              {personalDay === 7 && 'A day for reflection and inner wisdom. Seek solitude and truth.'}
              {personalDay === 8 && 'A day for power and abundance. Step into your authority.'}
              {personalDay === 9 && 'A day for completion and release. Let go with grace.'}
              {personalDay === 11 && 'A master day of spiritual insight. Your intuition is heightened.'}
              {personalDay === 22 && 'A master day for building your dreams into reality.'}
              {personalDay === 33 && 'A master day of compassion and cosmic service.'}
            </p>
          </div>
        </div>
      )}

      {/* Gratitude themes */}
      {topWords.length > 0 && (
        <div style={{ ...card, padding: '1.25rem', marginBottom: '1rem' }}>
          <div style={{ color: 'rgba(180,160,255,0.4)', fontSize: '0.62rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.75rem' }}>Gratitude Themes {periodLabel}</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
            {topWords.map(word => (
              <span key={word} style={{ padding: '0.3rem 0.75rem', borderRadius: '2rem', background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.2)', color: '#f59e0b', fontSize: '0.78rem' }}>{word}</span>
            ))}
          </div>
        </div>
      )}

      {/* Manifestation progress */}
      {manifestations.length > 0 && (
        <div style={{ ...card, padding: '1.25rem' }}>
          <div style={{ color: 'rgba(180,160,255,0.4)', fontSize: '0.62rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.875rem' }}>Manifestation Journey</div>
          {['planting','growing','blooming','manifested'].map(status => {
            const count = manifestations.filter((m: any) => m.status === status).length
            const emojis: Record<string, string> = { planting: '🌱', growing: '🌿', blooming: '🌸', manifested: '✨' }
            const colors: Record<string, string> = { planting: '#60a5fa', growing: '#34d399', blooming: '#f472b6', manifested: '#c9a84c' }
            return (
              <div key={status} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '1rem', width: '1.5rem', textAlign: 'center' }}>{emojis[status]}</span>
                <span style={{ color: 'rgba(180,160,255,0.5)', fontSize: '0.78rem', width: '5rem', textTransform: 'capitalize' }}>{status}</span>
                <div style={{ flex: 1, height: '4px', borderRadius: '2px', background: 'rgba(255,255,255,0.05)' }}>
                  <div style={{ height: '100%', width: `${manifestations.length > 0 ? (count / manifestations.length) * 100 : 0}%`, background: colors[status], borderRadius: '2px', opacity: 0.7 }} />
                </div>
                <span style={{ color: colors[status], fontSize: '0.78rem', width: '1.5rem', textAlign: 'right' }}>{count}</span>
              </div>
            )
          })}
        </div>
      )}

      {periodLogs.length === 0 && periodDreams.length === 0 && periodGratitude.length === 0 && (
        <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🌌</div>
          <p style={{ color: 'rgba(180,160,255,0.4)', fontSize: '0.88rem' }}>Start logging angel numbers, dreams, and gratitude to see your cosmic synthesis.</p>
        </div>
      )}
    </div>
  )
}
