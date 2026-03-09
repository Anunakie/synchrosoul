'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import AngelLogger from '@/components/AngelLogger'
import { generateDailyGuidance } from '@/lib/daily-guidance'

const KEY_LOGS = 'synchrosoul_logs'
const KEY_PROFILE = 'synchrosoul_numerology_profile'

const QUICK_TOOLS = [
  { href: '/dashboard/oracle', emoji: '◈', label: 'Oracle', color: '#e0e7ff' },
  { href: '/dashboard/meditations', emoji: '🧘', label: 'Meditate', color: '#a78bfa' },
  { href: '/dashboard/tarot', emoji: '🃏', label: 'Tarot', color: '#f472b6' },
  { href: '/dashboard/moon', emoji: '🌙', label: 'Moon', color: '#94a3b8' },
  { href: '/dashboard/chakras', emoji: '🌀', label: 'Chakras', color: '#f97316' },
  { href: '/dashboard/breathwork', emoji: '💨', label: 'Breathe', color: '#67e8f9' },
  { href: '/dashboard/affirmations', emoji: '💫', label: 'Affirm', color: '#60a5fa' },
  { href: '/dashboard/rituals', emoji: '✦', label: 'Rituals', color: '#c9a84c' },
]

const FEATURE_CARDS = [
  { href: '/dashboard/synthesis', emoji: '✶', title: 'Cosmic Synthesis', desc: 'Your weekly pattern report', color: '#c9a84c', bg: 'rgba(201,168,76,0.08)' },
  { href: '/dashboard/soul-twin', emoji: '🧬', title: 'Soul Twin Radar', desc: 'Find your number matches', color: '#f472b6', bg: 'rgba(244,114,182,0.08)' },
  { href: '/dashboard/compatibility', emoji: '💞', title: 'Compatibility', desc: 'Numerology match score', color: '#60a5fa', bg: 'rgba(96,165,250,0.08)' },
  { href: '/dashboard/numerology-deep', emoji: '🧮', title: 'Deep Numerology', desc: 'Your full soul blueprint', color: '#a78bfa', bg: 'rgba(167,139,250,0.08)' },
  { href: '/dashboard/vision-board', emoji: '🌌', title: 'Vision Board', desc: 'Your cosmic dream board', color: '#818cf8', bg: 'rgba(129,140,248,0.08)' },
  { href: '/dashboard/manifestations', emoji: '🌱', title: 'Manifestations', desc: 'Track what you are calling in', color: '#4ade80', bg: 'rgba(74,222,128,0.08)' },
]

export default function DashboardPage() {
  const [logs, setLogs] = useState<any[]>([])
  const [profile, setProfile] = useState<any>(null)
  const [guidance, setGuidance] = useState<any>(null)
  const [greeting, setGreeting] = useState('Good evening')

  useEffect(() => {
    const l = localStorage.getItem(KEY_LOGS)
    if (l) setLogs(JSON.parse(l))
    const p = localStorage.getItem(KEY_PROFILE)
    if (p) {
      const parsed = JSON.parse(p)
      setProfile(parsed)
      const recentNums = (() => { try { const l = localStorage.getItem(KEY_LOGS); return l ? JSON.parse(l).slice(0,10).map((x:any)=>x.number) : [] } catch { return [] } })()
      setGuidance(generateDailyGuidance(recentNums, parsed.lifePathNumber || null, Math.min(logs.length, 30)))
    }
    const h = new Date().getHours()
    setGreeting(h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening')
  }, [])

  const recentLogs = logs.slice(0, 5)
  const todayLogs = logs.filter((l:any) => new Date(l.timestamp).toDateString() === new Date().toDateString())
  const streak = Math.min(logs.length, 7)
  const card: React.CSSProperties = { background: 'rgba(8,6,28,0.88)', border: '1px solid rgba(200,180,255,0.12)', borderRadius: '1.25rem', backdropFilter: 'blur(12px)' }

  return (
    <div style={{ maxWidth: '680px', margin: '0 auto', padding: '1.25rem 1rem 2rem' }}>

      {/* Greeting */}
      <div style={{ marginBottom: '1.25rem' }}>
        <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.6rem', color: 'rgba(220,200,255,0.9)', margin: '0 0 0.2rem', fontWeight: 400 }}>{greeting} ✨</h1>
        <p style={{ color: 'rgba(180,160,255,0.45)', fontSize: '0.8rem', margin: 0 }}>
          {todayLogs.length > 0 ? `${todayLogs.length} angel number${todayLogs.length > 1 ? 's' : ''} logged today · ${streak} day streak` : 'Log your first angel number today'}
        </p>
      </div>

      {/* Daily Guidance */}
      {guidance && (
        <div style={{ ...card, padding: '1.25rem', marginBottom: '1.25rem', background: 'linear-gradient(135deg, rgba(201,168,76,0.1), rgba(167,139,250,0.08))' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.625rem' }}>
            <span style={{ fontSize: '1rem' }}>✶</span>
            <span style={{ color: 'rgba(201,168,76,0.7)', fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '0.12em' }}>Today's Cosmic Guidance</span>
          </div>
          <p style={{ color: 'rgba(200,180,255,0.85)', fontSize: '0.9rem', margin: '0 0 0.625rem', lineHeight: 1.6, fontStyle: 'italic', fontFamily: 'Cormorant Garamond, serif' }}>&ldquo;{guidance.message}&rdquo;</p>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {guidance.focusNumber && <span style={{ padding: '0.2rem 0.5rem', borderRadius: '2rem', background: 'rgba(201,168,76,0.12)', border: '1px solid rgba(201,168,76,0.25)', color: '#c9a84c', fontSize: '0.7rem' }}>Focus: {guidance.focusNumber}</span>}
            {guidance.moonPhase && <span style={{ padding: '0.2rem 0.5rem', borderRadius: '2rem', background: 'rgba(148,163,184,0.1)', border: '1px solid rgba(148,163,184,0.2)', color: 'rgba(180,160,255,0.6)', fontSize: '0.7rem' }}>{guidance.moonPhase}</span>}
          </div>
        </div>
      )}

      {/* Angel Logger */}
      <div style={{ marginBottom: '1.5rem' }}>
        <AngelLogger onLogged={() => { const l = localStorage.getItem(KEY_LOGS); if (l) setLogs(JSON.parse(l)) }} />
      </div>

      {/* Quick Tools */}
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ color: 'rgba(180,160,255,0.4)', fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '0.75rem' }}>Quick Access</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem' }}>
          {QUICK_TOOLS.map(t => (
            <Link key={t.href} href={t.href} style={{ textDecoration: 'none' }}>
              <div style={{ ...card, padding: '0.75rem 0.5rem', textAlign: 'center', cursor: 'pointer', transition: 'all 0.2s' }}>
                <div style={{ fontSize: '1.3rem', marginBottom: '0.25rem' }}>{t.emoji}</div>
                <div style={{ color: t.color, fontSize: '0.62rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{t.label}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Feature Cards */}
      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
          <div style={{ color: 'rgba(180,160,255,0.4)', fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '0.12em' }}>Explore</div>
          <Link href='/dashboard/tools' style={{ color: 'rgba(167,139,250,0.5)', fontSize: '0.72rem', textDecoration: 'none' }}>All Tools →</Link>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.625rem' }}>
          {FEATURE_CARDS.map(f => (
            <Link key={f.href} href={f.href} style={{ textDecoration: 'none' }}>
              <div style={{ ...card, padding: '1rem', background: f.bg, cursor: 'pointer', transition: 'all 0.2s', height: '100%' }}>
                <div style={{ fontSize: '1.3rem', marginBottom: '0.4rem' }}>{f.emoji}</div>
                <div style={{ color: f.color, fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.2rem' }}>{f.title}</div>
                <div style={{ color: 'rgba(180,160,255,0.4)', fontSize: '0.7rem', lineHeight: 1.4 }}>{f.desc}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Sightings */}
      {recentLogs.length > 0 && (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <div style={{ color: 'rgba(180,160,255,0.4)', fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '0.12em' }}>Recent Sightings</div>
            <Link href='/dashboard/journal' style={{ color: 'rgba(167,139,250,0.5)', fontSize: '0.72rem', textDecoration: 'none' }}>View All →</Link>
          </div>
          <div style={{ ...card, overflow: 'hidden' }}>
            {recentLogs.map((log: any, i: number) => (
              <div key={log.id || i} style={{ padding: '0.75rem 1.1rem', borderBottom: i < recentLogs.length - 1 ? '1px solid rgba(200,180,255,0.06)' : 'none', display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
                <div style={{ width: '2.25rem', height: '2.25rem', borderRadius: '0.625rem', background: 'rgba(201,168,76,0.12)', border: '1px solid rgba(201,168,76,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#c9a84c', fontSize: '0.75rem', fontWeight: 700, flexShrink: 0 }}>{log.number}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ color: 'rgba(200,180,255,0.8)', fontSize: '0.82rem', fontWeight: 600 }}>{log.number}</div>
                  {log.thought && <div style={{ color: 'rgba(180,160,255,0.4)', fontSize: '0.72rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{log.thought}</div>}
                </div>
                <div style={{ color: 'rgba(180,160,255,0.25)', fontSize: '0.65rem', flexShrink: 0 }}>{new Date(log.timestamp).toLocaleDateString()}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* No logs yet */}
      {recentLogs.length === 0 && (
        <div style={{ ...card, padding: '2rem', textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>✨</div>
          <p style={{ color: 'rgba(180,160,255,0.55)', fontSize: '0.9rem', margin: '0 0 0.5rem', fontFamily: 'Cormorant Garamond, serif', fontStyle: 'italic' }}>The universe is sending you signs</p>
          <p style={{ color: 'rgba(180,160,255,0.35)', fontSize: '0.78rem', margin: 0 }}>Log your first angel number above to begin your journey</p>
        </div>
      )}
    </div>
  )
}