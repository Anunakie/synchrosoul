'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import AngelLogger from '@/components/AngelLogger'
import JournalEntry from '@/components/JournalEntry'
import { getLogs, getStats, getNumerologyProfile, AngelLog } from '@/lib/storage'
import { getLifePathData } from '@/lib/numerology'
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
        ✦ Your Cosmic Blueprint ✦
      </p>
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${badges.length}, 1fr)`, gap: '0.75rem' }}>
        {badges.map((b) => (
          <div key={b.label} style={{ background: 'rgba(5,5,16,0.6)', border: `1px solid ${b.color}30`, borderRadius: '1rem', padding: '1rem 0.75rem', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(circle at 50% 0%, ${b.color}08 0%, transparent 70%)`, pointerEvents: 'none' }} />
            <div style={{ fontSize: '0.55rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: `${b.color}70`, marginBottom: '0.3rem' }}>{b.label}</div>
            <div style={{ fontSize: '2rem', fontWeight: 300, color: b.color, fontFamily: 'Cormorant Garamond, serif', lineHeight: 1, textShadow: `0 0 16px ${b.color}50` }}>{b.number}</div>
            <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.35)', marginTop: '0.3rem', fontStyle: 'italic' }}>{b.keyword}</div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: '0.75rem', padding: '0.75rem 1rem', background: 'rgba(201,168,76,0.03)', border: '1px solid rgba(201,168,76,0.08)', borderRadius: '0.75rem', fontSize: '0.72rem', color: 'rgba(255,255,255,0.25)', lineHeight: 1.6, fontStyle: 'italic', textAlign: 'center' }}>
        {lpData.description}
      </div>
    </div>
  )
}

export default function DashboardPage() {
  const [logs, setLogs] = useState<AngelLog[]>([])
  const [stats, setStats] = useState({ total: 0, topNumber: null as string | null, topCount: 0, withProof: 0, streak: 0 })
  const [numerology, setNumerology] = useState<NumerologyProfile | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    setLogs(getLogs())
    setStats(getStats())
    setNumerology(getNumerologyProfile())
  }, [])

  function handleLogged(log: AngelLog) { setLogs(getLogs()); setStats(getStats()) }
  function handleDelete(id: string) { setLogs(getLogs()); setStats(getStats()) }
  function handleToggleShare(id: string) { setLogs(getLogs()) }

  const recentLogs = logs.slice(0, 3)

  return (
    <div style={{ maxWidth: '640px', margin: '0 auto', padding: '1.5rem 1rem' }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2rem', color: 'rgba(220,200,255,0.9)', fontWeight: 300, marginBottom: '0.25rem' }}>Cosmic Log</h1>
        <p style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'rgba(200,180,255,0.35)' }}>The universe is always speaking</p>
      </div>

      {mounted && numerology && <NumerologyBadges profile={numerology} />}

      {mounted && !numerology && (
        <div style={{ marginBottom: '1.5rem', padding: '1rem 1.25rem', background: 'rgba(201,168,76,0.04)', border: '1px solid rgba(201,168,76,0.12)', borderRadius: '1rem', textAlign: 'center' }}>
          <div style={{ fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(201,168,76,0.5)', marginBottom: '0.4rem' }}>Unlock Your Blueprint</div>
          <p style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.3)', marginBottom: '0.75rem' }}>Create an account with your birthdate to reveal your Life Path, Soul Urge & Destiny numbers</p>
          <Link href="/auth/signup" style={{ display: 'inline-block', fontSize: '0.7rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(201,168,76,0.7)', border: '1px solid rgba(201,168,76,0.2)', borderRadius: '2rem', padding: '0.4rem 1rem', textDecoration: 'none' }}>Reveal My Numbers ✦</Link>
        </div>
      )}

      {mounted && stats.total > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem', marginBottom: '1.5rem' }}>
          {[
            { label: 'Total Logs', value: stats.total, icon: '◈' },
            { label: 'Day Streak', value: stats.streak, icon: '◉' },
            { label: 'Angel Approved', value: stats.withProof, icon: '✓' },
          ].map(s => (
            <div key={s.label} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(200,180,255,0.1)', borderRadius: '1rem', padding: '1rem 0.75rem', textAlign: 'center' }}>
              <div style={{ fontSize: '1.25rem', color: 'rgba(201,168,76,0.6)', marginBottom: '0.25rem' }}>{s.icon}</div>
              <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.75rem', color: 'rgba(220,200,255,0.8)', fontWeight: 300 }}>{s.value}</div>
              <div style={{ fontSize: '0.6rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(200,180,255,0.3)', marginTop: '0.25rem' }}>{s.label}</div>
            </div>
          ))}
        </div>
      )}

      {mounted && stats.topNumber && (
        <div style={{ marginBottom: '1.5rem', padding: '1.25rem', background: 'rgba(201,168,76,0.04)', border: '1px solid rgba(201,168,76,0.15)', borderRadius: '1rem', textAlign: 'center' }}>
          <div style={{ fontSize: '0.65rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(201,168,76,0.5)', marginBottom: '0.5rem' }}>Your Most Seen Number</div>
          <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '3rem', fontWeight: 300, color: 'rgba(201,168,76,0.9)', lineHeight: 1 }}>{stats.topNumber}</div>
          <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.3)', marginTop: '0.4rem' }}>seen {stats.topCount} {stats.topCount === 1 ? 'time' : 'times'}</div>
        </div>
      )}

      <div style={{ marginBottom: '2rem' }}>
        <AngelLogger onLogged={handleLogged} />
      </div>

      {mounted && recentLogs.length > 0 && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.25rem', color: 'rgba(220,200,255,0.7)', fontWeight: 300 }}>Recent Sightings</h2>
            <Link href="/dashboard/journal" style={{ fontSize: '0.7rem', letterSpacing: '0.15em', textTransform: 'uppercase', color: 'rgba(201,168,76,0.5)', textDecoration: 'none' }}>View All →</Link>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {recentLogs.map(log => (
              <JournalEntry key={log.id} log={log} onDelete={handleDelete} onToggleShare={handleToggleShare} />
            ))}
          </div>
        </div>
      )}

      {mounted && logs.length === 0 && (
        <div style={{ textAlign: 'center', padding: '3rem 2rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem', opacity: 0.3 }}>✨</div>
          <p style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.25rem', color: 'rgba(220,200,255,0.4)', fontWeight: 300, marginBottom: '0.5rem' }}>No sightings yet</p>
          <p style={{ fontSize: '0.8rem', color: 'rgba(200,180,255,0.25)' }}>Log your first angel number above</p>
        </div>
      )}
    </div>
  )
}
