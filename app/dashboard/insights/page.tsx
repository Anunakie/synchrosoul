'use client'
import { useState, useEffect } from 'react'
import { ANGEL_MEANINGS } from '@/lib/angel-meanings'

const KEY_LOGS = 'synchrosoul_logs'
const KEY_PROFILE = 'synchrosoul_numerology_profile'

interface Log { number: string; createdAt: string; thought?: string; truthScore?: boolean }

function getWeekday(date: Date) {
  return ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'][date.getDay()]
}

function getTimeOfDay(hour: number) {
  if (hour < 6) return 'Night Owl'
  if (hour < 12) return 'Morning'
  if (hour < 17) return 'Afternoon'
  if (hour < 21) return 'Evening'
  return 'Night'
}

export default function InsightsPage() {
  const [logs, setLogs] = useState<Log[]>([])
  const [profile, setProfile] = useState<any>(null)

  useEffect(() => {
    try {
      setLogs(JSON.parse(localStorage.getItem(KEY_LOGS) || '[]'))
      setProfile(JSON.parse(localStorage.getItem(KEY_PROFILE) || 'null'))
    } catch {}
  }, [])

  if (logs.length === 0) {
    return (
      <div style={{ maxWidth: '520px', margin: '0 auto', padding: '3rem 1rem', textAlign: 'center' }}>
        <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
        <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.5rem', color: 'rgba(220,200,255,0.8)', fontWeight: 400, marginBottom: '0.5rem' }}>No Patterns Yet</h2>
        <p style={{ color: 'rgba(180,160,255,0.4)', fontSize: '0.85rem' }}>Start logging angel numbers to reveal your cosmic patterns.</p>
      </div>
    )
  }

  // Frequency map
  const freq: Record<string,number> = {}
  logs.forEach(l => { freq[l.number] = (freq[l.number]||0)+1 })
  const sorted = Object.entries(freq).sort((a,b) => b[1]-a[1])
  const topNum = sorted[0]?.[0] || ''
  const topMeaning = ANGEL_MEANINGS[topNum]

  // Day of week pattern
  const dayFreq: Record<string,number> = {}
  logs.forEach(l => { const d = getWeekday(new Date(l.createdAt)); dayFreq[d] = (dayFreq[d]||0)+1 })
  const topDay = Object.entries(dayFreq).sort((a,b) => b[1]-a[1])[0]?.[0] || ''

  // Time of day pattern
  const timeFreq: Record<string,number> = {}
  logs.forEach(l => { const t = getTimeOfDay(new Date(l.createdAt).getHours()); timeFreq[t] = (timeFreq[t]||0)+1 })
  const topTime = Object.entries(timeFreq).sort((a,b) => b[1]-a[1])[0]?.[0] || ''

  // Thought themes (simple keyword extraction)
  const thoughts = logs.filter(l => l.thought).map(l => l.thought!.toLowerCase())
  const wordFreq: Record<string,number> = {}
  const stopWords = new Set(['i','a','the','and','or','to','in','of','my','me','was','is','it','at','on','for','with','that','this','be','are','have','had','but','not','so','do','did','an','as','by','from','up','about','into','then','than','when','what','how','if','its','we','he','she','they','you','your','their','our','his','her','been','has','will','would','could','should','just','like','get','got','feel','felt','see','saw','know','think','thought','want','need','going','come','came','back','out','all','more','some','no','yes','very','really','also','still','even','much','many','most','other','after','before','because','there','here','where','which','who','him','them','us','these','those','such','each','any','both','few','own','same','too','only','over','under','again','further','once','now','then','so','yet','both','either','neither','nor','not','only','own','same','so','than','too','very','s','t','can','will','just','don','should','now'])
  thoughts.forEach(t => {
    t.split(/\s+/).forEach(w => {
      const clean = w.replace(/[^a-z]/g, '')
      if (clean.length > 3 && !stopWords.has(clean)) wordFreq[clean] = (wordFreq[clean]||0)+1
    })
  })
  const topWords = Object.entries(wordFreq).sort((a,b) => b[1]-a[1]).slice(0,8)

  // Monthly trend
  const monthFreq: Record<string,number> = {}
  logs.forEach(l => { const m = new Date(l.createdAt).toISOString().slice(0,7); monthFreq[m] = (monthFreq[m]||0)+1 })
  const months = Object.entries(monthFreq).sort((a,b) => a[0].localeCompare(b[0])).slice(-6)
  const maxMonth = Math.max(...months.map(m => m[1]), 1)

  // Numerology resonance
  const lifePathNum = profile?.lifePathNumber
  const resonantNumbers = sorted.filter(([n]) => {
    if (!lifePathNum) return false
    const reduced = n.split('').reduce((s,c) => s + (parseInt(c)||0), 0)
    return reduced === lifePathNum || reduced % lifePathNum === 0
  }).slice(0,3)

  const card: React.CSSProperties = { background: 'rgba(8,6,28,0.88)', border: '1px solid rgba(200,180,255,0.12)', borderRadius: '1.25rem', backdropFilter: 'blur(12px)', padding: '1.25rem', marginBottom: '0.875rem' }
  const sectionLabel: React.CSSProperties = { color: 'rgba(180,160,255,0.4)', fontSize: '0.62rem', textTransform: 'uppercase' as const, letterSpacing: '0.1em', marginBottom: '0.875rem', display: 'block' }

  return (
    <div style={{ maxWidth: '560px', margin: '0 auto', padding: '1.5rem 1rem 2rem' }}>
      <div style={{ marginBottom: '1.25rem' }}>
        <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.8rem', color: 'rgba(220,200,255,0.95)', margin: '0 0 0.25rem', fontWeight: 400 }}>Cosmic Insights</h1>
        <p style={{ color: 'rgba(180,160,255,0.5)', fontSize: '0.8rem', margin: 0 }}>Patterns hidden in your angel number journey</p>
      </div>

      {/* Primary number */}
      {topMeaning && (
        <div style={{ ...card, borderColor: topMeaning.color + '30', background: 'rgba(8,6,28,0.92)' }}>
          <span style={sectionLabel}>Your Dominant Number</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '1rem', background: topMeaning.color + '15', border: '1px solid ' + topMeaning.color + '30', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <span style={{ color: topMeaning.color, fontSize: '1.3rem', fontWeight: 700 }}>{topNum}</span>
            </div>
            <div>
              <div style={{ color: topMeaning.color, fontSize: '1rem', fontWeight: 600, marginBottom: '0.2rem' }}>{topMeaning.title}</div>
              <div style={{ color: 'rgba(200,180,255,0.6)', fontSize: '0.8rem', lineHeight: 1.5 }}>{topMeaning.message.slice(0,120)}...</div>
              <div style={{ color: 'rgba(180,160,255,0.35)', fontSize: '0.7rem', marginTop: '0.3rem' }}>Seen {freq[topNum]}x · {Math.round(freq[topNum]/logs.length*100)}% of all sightings</div>
            </div>
          </div>
        </div>
      )}

      {/* Timing patterns */}
      <div style={card}>
        <span style={sectionLabel}>When You Receive Signs</span>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: '0.625rem' }}>
          <div style={{ background: 'rgba(201,168,76,0.08)', border: '1px solid rgba(201,168,76,0.15)', borderRadius: '0.875rem', padding: '0.875rem', textAlign: 'center' }}>
            <div style={{ fontSize: '1.5rem', marginBottom: '0.3rem' }}>📅</div>
            <div style={{ color: '#c9a84c', fontSize: '0.95rem', fontWeight: 600 }}>{topDay}</div>
            <div style={{ color: 'rgba(180,160,255,0.4)', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: '0.15rem' }}>Peak Day</div>
          </div>
          <div style={{ background: 'rgba(167,139,250,0.08)', border: '1px solid rgba(167,139,250,0.15)', borderRadius: '0.875rem', padding: '0.875rem', textAlign: 'center' }}>
            <div style={{ fontSize: '1.5rem', marginBottom: '0.3rem' }}>⏰</div>
            <div style={{ color: '#a78bfa', fontSize: '0.95rem', fontWeight: 600 }}>{topTime}</div>
            <div style={{ color: 'rgba(180,160,255,0.4)', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: '0.15rem' }}>Peak Time</div>
          </div>
        </div>
      </div>

      {/* Monthly trend */}
      {months.length > 1 && (
        <div style={card}>
          <span style={sectionLabel}>Monthly Activity</span>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '0.4rem', height: '80px', marginBottom: '0.4rem' }}>
            {months.map(([month, count]) => (
              <div key={month} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem', height: '100%', justifyContent: 'flex-end' }}>
                <div style={{ width: '100%', height: Math.max(count/maxMonth*100, 8) + '%', background: 'rgba(167,139,250,0.5)', borderRadius: '4px 4px 0 0', minHeight: '4px' }} />
                <span style={{ color: 'rgba(180,160,255,0.3)', fontSize: '0.55rem' }}>{month.slice(5)}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Thought themes */}
      {topWords.length > 0 && (
        <div style={card}>
          <span style={sectionLabel}>Themes in Your Thoughts</span>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
            {topWords.map(([word, count]) => (
              <span key={word} style={{ background: 'rgba(96,165,250,0.1)', border: '1px solid rgba(96,165,250,0.2)', borderRadius: '9999px', padding: '0.25rem 0.75rem', color: '#60a5fa', fontSize: '0.78rem' }}>
                {word} <span style={{ opacity: 0.5, fontSize: '0.65rem' }}>×{count}</span>
              </span>
            ))}
          </div>
          <p style={{ color: 'rgba(180,160,255,0.35)', fontSize: '0.72rem', marginTop: '0.75rem', lineHeight: 1.5 }}>These themes appear most in your thought anchors when you see angel numbers.</p>
        </div>
      )}

      {/* Numerology resonance */}
      {lifePathNum && resonantNumbers.length > 0 && (
        <div style={card}>
          <span style={sectionLabel}>Life Path {lifePathNum} Resonance</span>
          <p style={{ color: 'rgba(180,160,255,0.5)', fontSize: '0.8rem', lineHeight: 1.6, marginBottom: '0.875rem' }}>These numbers harmonically align with your Life Path number:</p>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {resonantNumbers.map(([n, count]) => (
              <div key={n} style={{ background: 'rgba(244,114,182,0.08)', border: '1px solid rgba(244,114,182,0.2)', borderRadius: '0.75rem', padding: '0.625rem 1rem', textAlign: 'center' }}>
                <div style={{ color: '#f472b6', fontSize: '1.1rem', fontWeight: 700 }}>{n}</div>
                <div style={{ color: 'rgba(180,160,255,0.35)', fontSize: '0.62rem' }}>{count}x</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* All numbers breakdown */}
      <div style={card}>
        <span style={sectionLabel}>All Numbers ({sorted.length} unique)</span>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {sorted.slice(0,8).map(([n, count]) => {
            const m = ANGEL_MEANINGS[n]
            return (
              <div key={n} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{ color: m?.color || '#a78bfa', fontSize: '0.88rem', fontWeight: 600, minWidth: '3rem' }}>{n}</span>
                <div style={{ flex: 1, height: '4px', background: 'rgba(200,180,255,0.06)', borderRadius: '9999px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: (count/sorted[0][1]*100)+'%', background: m?.color || '#a78bfa', opacity: 0.6, borderRadius: '9999px' }} />
                </div>
                <span style={{ color: 'rgba(180,160,255,0.4)', fontSize: '0.72rem', minWidth: '2rem', textAlign: 'right' }}>{count}x</span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
