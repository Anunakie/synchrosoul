'use client'
import { useState, useEffect } from 'react'
import { getLogs } from '@/lib/storage'
import { createClient } from '@/lib/supabase/client'

interface AngelLog {
  number: string
  createdAt: string
  thought?: string
}

interface Insight {
  id: string
  category: string
  emoji: string
  color: string
  title: string
  body: string
  number: string
  action: string
}

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

const ANGEL_MEANINGS: Record<string, string> = {
  '111': 'manifestation and new beginnings',
  '1111': 'alignment and awakening',
  '222': 'balance and partnership',
  '2222': 'divine timing and trust',
  '333': 'creativity and ascended masters',
  '3333': 'expansion and growth',
  '444': 'foundation and angelic protection',
  '4444': 'strong angelic presence',
  '555': 'change and transformation',
  '5555': 'major life shift incoming',
  '666': 'balance material and spiritual',
  '777': 'spiritual awakening and luck',
  '7777': 'divine alignment',
  '888': 'abundance and infinity',
  '8888': 'financial and spiritual abundance',
  '999': 'completion and release',
  '9999': 'end of a major cycle',
  '1010': 'divine support and encouragement',
  '1212': 'stay positive, manifestation is near',
  '1234': 'you are on the right path',
  '0000': 'infinite potential and God force',
}

function formatHour(h: number): string {
  if (h === 0) return 'midnight'
  if (h < 12) return `${h}am`
  if (h === 12) return 'noon'
  return `${h - 12}pm`
}

function generateInsights(logs: AngelLog[], lifePathNumber?: number): Insight[] {
  if (logs.length === 0) return []

  const insights: Insight[] = []

  // Frequency analysis
  const freq: Record<string, number> = {}
  logs.forEach(l => { freq[l.number] = (freq[l.number] || 0) + 1 })
  const sorted = Object.entries(freq).sort((a, b) => b[1] - a[1])
  const topNumber = sorted[0]?.[0]
  const topCount = sorted[0]?.[1]

  // Day of week analysis
  const dayCounts: Record<number, number> = {}
  logs.forEach(l => {
    const d = new Date(l.createdAt).getDay()
    dayCounts[d] = (dayCounts[d] || 0) + 1
  })
  const topDayEntry = Object.entries(dayCounts).sort((a, b) => Number(b[1]) - Number(a[1]))[0]
  const topDay = topDayEntry ? DAYS[Number(topDayEntry[0])] : null

  // Hour of day analysis
  const hourCounts: Record<number, number> = {}
  logs.forEach(l => {
    const h = new Date(l.createdAt).getHours()
    hourCounts[h] = (hourCounts[h] || 0) + 1
  })
  const topHourEntry = Object.entries(hourCounts).sort((a, b) => Number(b[1]) - Number(a[1]))[0]
  const topHour = topHourEntry ? Number(topHourEntry[0]) : null

  // Streak analysis
  const logDates = [...new Set(logs.map(l => new Date(l.createdAt).toDateString()))].sort()
  let currentStreak = 1
  let maxStreak = 1
  for (let i = 1; i < logDates.length; i++) {
    const prev = new Date(logDates[i - 1])
    const curr = new Date(logDates[i])
    const diff = (curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24)
    if (diff === 1) { currentStreak++; maxStreak = Math.max(maxStreak, currentStreak) }
    else currentStreak = 1
  }

  // Thought anchor analysis
  const logsWithThoughts = logs.filter(l => l.thought && l.thought.trim().length > 0)
  const thoughtRate = Math.round((logsWithThoughts.length / logs.length) * 100)

  // Unique numbers
  const uniqueNumbers = Object.keys(freq).length

  // INSIGHT 1: Most frequent number + day
  if (topNumber && topDay) {
    const meaning = ANGEL_MEANINGS[topNumber] || 'divine guidance'
    insights.push({
      id: 'freq-day',
      category: 'Pattern',
      emoji: '🔍',
      color: '#c9a84c',
      title: `You see ${topNumber} most on ${topDay}s`,
      body: `${topNumber} has appeared ${topCount} time${topCount > 1 ? 's' : ''} in your logs — more than any other number. ${topDay} is your peak day for receiving this message of ${meaning}. Your angels are especially active with you on this day.`,
      number: topNumber,
      action: `On ${topDay}s, pay extra attention to your surroundings. ${topNumber} is trying to tell you something important.`
    })
  }

  // INSIGHT 2: Peak time of day
  if (topHour !== null) {
    const timeLabel = formatHour(topHour)
    const period = topHour < 12 ? 'morning' : topHour < 17 ? 'afternoon' : 'evening'
    insights.push({
      id: 'peak-time',
      category: 'Timing',
      emoji: '⏰',
      color: '#22d3ee',
      title: `Most sightings around ${timeLabel}`,
      body: `Your angel number awareness peaks in the ${period} around ${timeLabel}. This is when your conscious and subconscious minds are most aligned, making you more receptive to divine messages.`,
      number: 'All',
      action: `Keep your phone accessible around ${timeLabel} for quick logging. This is your golden window.`
    })
  }

  // INSIGHT 3: Life Path alignment
  if (lifePathNumber) {
    const lpAngel = lifePathNumber.toString().repeat(3)
    const lpMeaning = ANGEL_MEANINGS[lpAngel] || 'spiritual alignment'
    insights.push({
      id: 'life-path',
      category: 'Numerology',
      emoji: '🔢',
      color: '#a78bfa',
      title: `Your Life Path ${lifePathNumber} shapes your signals`,
      body: `As a Life Path ${lifePathNumber}, the number ${lpAngel} carries special resonance for you. When you see it, your angels are confirming you are aligned with your soul's purpose. Watch for it in your logs.`,
      number: lpAngel,
      action: `When you see ${lpAngel}, pause and acknowledge the path you are walking. You are exactly where you need to be.`
    })
  }

  // INSIGHT 4: Streak / consistency
  if (maxStreak >= 2) {
    insights.push({
      id: 'streak',
      category: 'Growth',
      emoji: '🌱',
      color: '#22c55e',
      title: `Your longest streak is ${maxStreak} days`,
      body: `You logged angel numbers for ${maxStreak} consecutive days — a sign of deepening spiritual awareness. Consistency is the bridge between noticing signs and truly receiving their messages.`,
      number: 'All',
      action: 'Keep your daily logging practice alive. Even one log a day maintains your connection to the divine.'
    })
  } else {
    insights.push({
      id: 'awareness',
      category: 'Growth',
      emoji: '🌱',
      color: '#22c55e',
      title: 'Your awareness is growing',
      body: `You have logged ${logs.length} angel number sighting${logs.length > 1 ? 's' : ''} so far. As you pay more attention, they will appear more frequently. You are raising your vibration with every log.`,
      number: 'All',
      action: 'Try to log at least one sighting per day. Consistency deepens your connection to divine guidance.'
    })
  }

  // INSIGHT 5: Thought anchors
  if (logs.length >= 3) {
    if (thoughtRate >= 50) {
      insights.push({
        id: 'thoughts',
        category: 'Spiritual',
        emoji: '✨',
        color: '#f472b6',
        title: `${thoughtRate}% of your logs include thought anchors`,
        body: 'You are doing something powerful — capturing what you were thinking when you saw each number. This is the key to decoding your personal angel number language. Patterns in your thoughts reveal what your angels are responding to.',
        number: 'All',
        action: 'Review your thought anchors for recurring themes. The universe is responding to your dominant thoughts.'
      })
    } else {
      insights.push({
        id: 'thoughts-encourage',
        category: 'Spiritual',
        emoji: '✨',
        color: '#f472b6',
        title: 'Add thought anchors to unlock deeper meaning',
        body: `Only ${thoughtRate}% of your logs include what you were thinking. Thought anchors are the secret decoder ring for angel numbers — they reveal what your angels are responding to in your life.`,
        number: 'All',
        action: 'Next time you log a number, add a quick note about what was on your mind. Even one word helps.'
      })
    }
  }

  // INSIGHT 6: Variety of numbers
  if (uniqueNumbers >= 3) {
    insights.push({
      id: 'variety',
      category: 'Pattern',
      emoji: '🌌',
      color: '#8b5cf6',
      title: `You receive ${uniqueNumbers} different angel numbers`,
      body: `Seeing ${uniqueNumbers} distinct numbers suggests your angels are communicating across multiple frequencies. Each number carries a different message — together they form a complete spiritual conversation.`,
      number: 'All',
      action: 'Look up each of your numbers in the Angel Dictionary to understand the full message being sent to you.'
    })
  }

  return insights
}

export default function InsightsPage() {
  const [insights, setInsights] = useState<Insight[]>([])
  const [loading, setLoading] = useState(true)
  const [logCount, setLogCount] = useState(0)
  const [filter, setFilter] = useState('All')

  useEffect(() => {
    const load = async () => {
      try {
        const logs = await getLogs()
        setLogCount(logs.length)

        let lifePathNumber: number | undefined
        try {
          const supabase = createClient()
          const { data: { user } } = await supabase.auth.getUser()
          if (user) {
            const { data: profile } = await supabase
              .from('profiles')
              .select('life_path_number')
              .eq('id', user.id)
              .single()
            if (profile?.life_path_number) lifePathNumber = profile.life_path_number
          }
        } catch {}

        const generated = generateInsights(logs as AngelLog[], lifePathNumber)
        setInsights(generated)
      } catch (err) {
        console.error('Insights load error:', err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const categories = ['All', ...Array.from(new Set(insights.map(i => i.category)))]
  const filtered = filter === 'All' ? insights : insights.filter(i => i.category === filter)

  return (
    <div style={{ minHeight: '100vh', padding: '2rem 1rem', maxWidth: '700px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 700, color: '#22d3ee', fontFamily: 'Cormorant Garamond, serif' }}>Your Insights</h1>
        <p style={{ color: 'rgba(255,255,255,0.4)', marginTop: '0.25rem' }}>
          {loading ? 'Analyzing your angel number patterns...' : logCount === 0 ? 'Log some angel numbers to unlock your personal insights' : `Patterns discovered from your ${logCount} log${logCount > 1 ? 's' : ''}`}
        </p>
      </div>

      {loading && (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'rgba(255,255,255,0.3)' }}>
          <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>✨</div>
          <p>Reading your cosmic patterns...</p>
        </div>
      )}

      {!loading && logCount === 0 && (
        <div style={{ textAlign: 'center', padding: '3rem', background: 'rgba(8,6,28,0.88)', borderRadius: '1.5rem', border: '1px solid rgba(255,255,255,0.07)' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔮</div>
          <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '0.5rem' }}>No insights yet</p>
          <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.85rem' }}>Start logging angel numbers to see personalized patterns and insights based on your actual sightings.</p>
        </div>
      )}

      {!loading && insights.length > 0 && (
        <>
          <div style={{ display: 'flex', gap: '0.4rem', overflowX: 'auto', paddingBottom: '0.5rem', marginBottom: '1.25rem' }}>
            {categories.map(c => (
              <button key={c} onClick={() => setFilter(c)} style={{ flexShrink: 0, padding: '0.35rem 0.875rem', borderRadius: '999px', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 600, background: filter === c ? 'rgba(34,211,238,0.2)' : 'rgba(255,255,255,0.04)', border: filter === c ? '1px solid rgba(34,211,238,0.4)' : '1px solid rgba(255,255,255,0.08)', color: filter === c ? '#22d3ee' : 'rgba(255,255,255,0.4)' }}>{c}</button>
            ))}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {filtered.map(ins => (
              <div key={ins.id} style={{ background: 'rgba(8,6,28,0.88)', borderRadius: '1.5rem', border: `1px solid ${ins.color}20`, padding: '1.25rem', backdropFilter: 'blur(12px)' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.875rem', marginBottom: '0.875rem' }}>
                  <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: `${ins.color}15`, border: `1px solid ${ins.color}25`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem', flexShrink: 0 }}>{ins.emoji}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '0.3rem', flexWrap: 'wrap' }}>
                      <span style={{ background: `${ins.color}10`, border: `1px solid ${ins.color}20`, borderRadius: '999px', padding: '0.1rem 0.5rem', fontSize: '0.6rem', color: ins.color, fontWeight: 700 }}>{ins.category}</span>
                      <span style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '999px', padding: '0.1rem 0.5rem', fontSize: '0.6rem', color: 'rgba(255,255,255,0.3)' }}>{ins.number}</span>
                    </div>
                    <p style={{ color: '#fff', fontWeight: 700, fontSize: '0.92rem', fontFamily: 'Cormorant Garamond, serif' }}>{ins.title}</p>
                  </div>
                </div>
                <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.83rem', lineHeight: 1.7, marginBottom: '0.75rem' }}>{ins.body}</p>
                <div style={{ background: `${ins.color}08`, borderRadius: '0.875rem', padding: '0.75rem', border: `1px solid ${ins.color}15` }}>
                  <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.2rem' }}>Action</p>
                  <p style={{ color: ins.color, fontSize: '0.82rem', lineHeight: 1.5 }}>{ins.action}</p>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
