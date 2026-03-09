'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import AngelLogger from '@/components/AngelLogger'
import { getLogs, getStats, getNumerologyProfile, AngelLog } from '@/lib/storage'
import { getLifePathData } from '@/lib/numerology'
import { generateDailyGuidance, getStreak, DailyGuidance } from '@/lib/daily-guidance'
import type { NumerologyProfile } from '@/lib/numerology'

function NumerologyBadges({ profile }: { profile: NumerologyProfile }) {
  const lpData = getLifePathData(profile.lifePath)
  const suData = profile.soulUrge ? getLifePathData(profile.soulUrge) : null
  const dData = profile.destiny ? getLifePathData(profile.destiny) : null
  const badges = [
    { label: 'Life Path', number: profile.lifePath, keyword: lpData.keyword, color: lpData.color },
    ...(suData && profile.soulUrge ? [{ label: 'Soul Urge', number: profile.soulUrge, keyword: suData.keyword, color: '#a78bfa' }] : []),
    ...(dData && profile.destiny ? [{ label: 'Destiny', number: profile.destiny, keyword: dData.keyword, color: '#34d399' }] : []),
  ]
  return (
    <div style={{ marginBottom: '2rem' }}>
      <p style={{ fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(201,168,76,0.4)', marginBottom: '0.875rem', textAlign: 'center' }}>
        Your Cosmic Blueprint
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${badges.length}, 1fr)`, gap: '0.75rem' }}>
        {badges.map((b) => (
          <div key={b.label} style={{ background: 'rgba(5,5,16,0.6)', border: `1px solid ${b.color}30`, borderRadius: '1rem', padding: '1rem 0.75rem', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(circle at 50% 0%, ${b.color}08 0%, transparent 70%)`, pointerEvents: 'none' }} />
            <div style={{ fontSize: '0.55rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: `${b.color}70`, marginBottom: '0.3rem' }}>{b.label}</div>
            <div style={{ fontSize: '2rem', fontWeight: 300, color: b.color, lineHeight: 1, textShadow: `0 0 16px ${b.color}50` }}>{b.number}</div>
            <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.35)', marginTop: '0.3rem', fontStyle: 'italic' }}>{b.keyword}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

function DailyGuidanceCard({ guidance, streak }: { guidance: DailyGuidance; streak: number }) {
  const [expanded, setExpanded] = useState(false)
  return (
    <div style={{ marginBottom: '2rem', background: `linear-gradient(135deg, ${guidance.themeColor}10, rgba(155,89,182,0.08))`, border: `1px solid ${guidance.themeColor}30`, borderRadius: '1.25rem', overflow: 'hidden' }}>
      {/* Header */}
      <div style={{ padding: '1.25rem 1.25rem 0' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
          <div>
            <div style={{ fontSize: '0.6rem', letterSpacing: '0.15em', color: `${guidance.themeColor}80`, textTransform: 'uppercase', marginBottom: '0.2rem' }}>Daily Guidance</div>
            <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)' }}>{guidance.date}</div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.3rem' }}>
            <div style={{ padding: '0.2rem 0.6rem', borderRadius: '999px', background: `${guidance.themeColor}20`, border: `1px solid ${guidance.themeColor}40`, fontSize: '0.7rem', color: guidance.themeColor, fontWeight: 600 }}>
              {guidance.theme}
            </div>
            <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.3)' }}>{guidance.moonPhase}</div>
          </div>
        </div>

        {/* Angel number of the day */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.875rem', background: 'rgba(0,0,0,0.2)', borderRadius: '0.875rem', marginBottom: '1rem' }}>
          <div style={{ textAlign: 'center', flexShrink: 0 }}>
            <div style={{ fontSize: '1.6rem', fontWeight: 700, color: guidance.themeColor, letterSpacing: '0.05em', lineHeight: 1 }}>{guidance.angelNumberOfDay}</div>
            <div style={{ fontSize: '0.55rem', color: 'rgba(255,255,255,0.3)', marginTop: '0.2rem', letterSpacing: '0.1em' }}>TODAY</div>
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.65)', lineHeight: 1.5, fontStyle: 'italic' }}>{guidance.angelNumberMeaning}</div>
          </div>
        </div>

        {/* Personal message */}
        <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.75)', lineHeight: 1.7, margin: '0 0 1rem' }}>
          {guidance.personalMessage}
        </p>
      </div>

      {/* Expandable section */}
      <button
        onClick={() => setExpanded(!expanded)}
        style={{ width: '100%', padding: '0.6rem 1.25rem', background: 'rgba(0,0,0,0.15)', border: 'none', borderTop: `1px solid ${guidance.themeColor}15`, color: 'rgba(255,255,255,0.35)', fontSize: '0.72rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}
      >
        {expanded ? 'Less' : 'Full reading'} {expanded ? '▲' : '▼'}
      </button>

      {expanded && (
        <div style={{ padding: '1rem 1.25rem 1.25rem', display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
          {/* Numerology forecast */}
          <div style={{ padding: '0.875rem', background: 'rgba(0,0,0,0.2)', borderRadius: '0.75rem' }}>
            <div style={{ fontSize: '0.6rem', letterSpacing: '0.12em', color: `${guidance.themeColor}70`, textTransform: 'uppercase', marginBottom: '0.4rem' }}>Numerology Forecast — Day {guidance.dateNumber}</div>
            <p style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.65)', lineHeight: 1.6, margin: 0 }}>{guidance.numerologyForecast}</p>
          </div>

          {/* Affirmation */}
          <div style={{ padding: '0.875rem', background: `${guidance.themeColor}08`, border: `1px solid ${guidance.themeColor}20`, borderRadius: '0.75rem', textAlign: 'center' }}>
            <div style={{ fontSize: '0.6rem', letterSpacing: '0.12em', color: `${guidance.themeColor}70`, textTransform: 'uppercase', marginBottom: '0.5rem' }}>Today's Affirmation</div>
            <p style={{ fontSize: '0.9rem', color: guidance.themeColor, lineHeight: 1.6, margin: 0, fontStyle: 'italic', fontWeight: 500 }}>“{guidance.affirmation}”</p>
          </div>

          {/* Streak */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', padding: '0.6rem', background: 'rgba(201,168,76,0.06)', border: '1px solid rgba(201,168,76,0.15)', borderRadius: '0.75rem' }}>
            <span style={{ fontSize: '1rem' }}>*</span>
            <span style={{ fontSize: '0.78rem', color: 'rgba(201,168,76,0.8)', fontWeight: 500 }}>{guidance.streakMessage}</span>
          </div>
        </div>
      )}
    </div>
  )
}

export default function DashboardPage() {
  const [logs, setLogs] = useState<AngelLog[]>([])
  const [stats, setStats] = useState({ total: 0, topNumber: null as string | null, topCount: 0, withProof: 0, streak: 0 })
  const [numerology, setNumerology] = useState<NumerologyProfile | null>(null)
  const [guidance, setGuidance] = useState<DailyGuidance | null>(null)
  const [streak, setStreak] = useState(0)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const allLogs = getLogs()
    setLogs(allLogs)
    setStats(getStats())
    const num = getNumerologyProfile()
    setNumerology(num)
    const s = getStreak(allLogs)
    setStreak(s)
    const recentNumbers = allLogs.slice(0, 10).map((l: AngelLog) => l.number)
    setGuidance(generateDailyGuidance(recentNumbers, num?.lifePath ?? null, s))
  }, [])

  function handleLogged() { 
    const allLogs = getLogs()
    setLogs(allLogs)
    setStats(getStats())
    const s = getStreak(allLogs)
    setStreak(s)
    const num = getNumerologyProfile()
    const recentNumbers = allLogs.slice(0, 10).map((l: AngelLog) => l.number)
    setGuidance(generateDailyGuidance(recentNumbers, num?.lifePath ?? null, s))
  }

  const recentLogs = logs.slice(0, 3)

  if (!mounted) return null

  return (
    <div style={{ minHeight: '100vh', background: '#050510', color: '#f0e6ff', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ maxWidth: 640, margin: '0 auto', padding: '2rem 1rem 6rem' }}>

        {/* Daily Guidance */}
        {guidance && <DailyGuidanceCard guidance={guidance} streak={streak} />}

        {/* Numerology Blueprint */}
        {numerology && <NumerologyBadges profile={numerology} />}

        {/* Logger */}
        <div style={{ marginBottom: '2rem' }}>
          <AngelLogger onLogged={handleLogged} />
        </div>

        {/* Quick stats */}
        {stats.total > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem', marginBottom: '2rem' }}>
            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '1rem', padding: '1rem', textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#c9a84c' }}>{stats.total}</div>
              <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.3)', marginTop: '0.2rem' }}>LOGGED</div>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '1rem', padding: '1rem', textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#9b59b6' }}>{streak}</div>
              <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.3)', marginTop: '0.2rem' }}>DAY STREAK</div>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '1rem', padding: '1rem', textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#3498db' }}>{stats.withProof}</div>
              <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.3)', marginTop: '0.2rem' }}>VERIFIED</div>
            </div>
          </div>
        )}

        {/* Recent sightings */}
        {recentLogs.length > 0 && (
          <div style={{ marginBottom: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.875rem' }}>
              <span style={{ fontSize: '0.65rem', letterSpacing: '0.15em', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase' }}>Recent Sightings</span>
              <Link href="/dashboard/journal" style={{ fontSize: '0.72rem', color: 'rgba(201,168,76,0.6)', textDecoration: 'none' }}>View all</Link>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {recentLogs.map((log: AngelLog) => (
                <div key={log.id} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '0.875rem' }}>
                  <span style={{ fontSize: '1.1rem', fontWeight: 700, color: '#c9a84c', minWidth: 48 }}>{log.number}</span>
                  <span style={{ flex: 1, fontSize: '0.78rem', color: 'rgba(255,255,255,0.45)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {log.thought || 'No thought recorded'}
                  </span>
                  {log.screenshotUrl && <span style={{ fontSize: '0.65rem', color: '#2ecc71' }}>Verified</span>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Quick nav cards */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
          {[
            { href: '/dashboard/journal', label: 'Journal', desc: 'Your thought anchors', color: '#9b59b6' },
            { href: '/dashboard/sync', label: 'Sync', desc: 'Find your matches', color: '#3498db' },
            { href: '/dashboard/feed', label: 'Feed', desc: 'Cosmic community', color: '#e91e63' },
            { href: '/dashboard/dreams', label: 'Dreams', desc: 'Dream journal', color: '#1abc9c' },
          ].map(item => (
            <Link key={item.href} href={item.href} style={{ textDecoration: 'none' }}>
              <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.03)', border: `1px solid ${item.color}20`, borderRadius: '1rem', cursor: 'pointer', transition: 'border-color 0.2s' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 600, color: item.color, marginBottom: '0.2rem' }}>{item.label}</div>
                <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.35)' }}>{item.desc}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
