'use client'
import { useState, useEffect } from 'react'
import { getMockMatches, getTimeAgo, SyncProfile } from '@/lib/sync-matching'
import { getLogs } from '@/lib/storage'
import { getNumerologyProfile } from '@/lib/storage'

const FILTERS = ['All', '24h', '48h', 'High Sync']

function SyncScoreRing({ score }: { score: number }) {
  const color = score >= 70 ? '#c9a84c' : score >= 45 ? '#9b59b6' : '#3498db'
  return (
    <div style={{ position: 'relative', width: 64, height: 64, flexShrink: 0 }}>
      <svg width="64" height="64" style={{ transform: 'rotate(-90deg)' }}>
        <circle cx="32" cy="32" r="26" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="5" />
        <circle
          cx="32" cy="32" r="26" fill="none"
          stroke={color} strokeWidth="5"
          strokeDasharray={`${2 * Math.PI * 26}`}
          strokeDashoffset={`${2 * Math.PI * 26 * (1 - score / 100)}`}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 1s ease' }}
        />
      </svg>
      <div style={{
        position: 'absolute', inset: 0, display: 'flex',
        alignItems: 'center', justifyContent: 'center',
        flexDirection: 'column'
      }}>
        <span style={{ fontSize: '0.85rem', fontWeight: 700, color }}>{score}%</span>
      </div>
    </div>
  )
}

function MatchCard({ profile, onConnect }: { profile: SyncProfile, onConnect: (p: SyncProfile) => void }) {
  const [expanded, setExpanded] = useState(false)
  return (
    <div
      onClick={() => setExpanded(!expanded)}
      style={{
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.1)',
        borderRadius: '1rem',
        padding: '1rem',
        cursor: 'pointer',
        transition: 'all 0.2s',
        marginBottom: '0.75rem',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <div style={{
          width: 44, height: 44, borderRadius: '50%',
          background: profile.avatarColor + '33',
          border: '2px solid ' + profile.avatarColor,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '0.85rem', fontWeight: 700, color: profile.avatarColor,
          flexShrink: 0
        }}>
          {profile.avatar}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
            <span style={{ fontWeight: 600, color: '#f0e6ff', fontSize: '0.95rem' }}>{profile.displayName}</span>
            <span style={{ fontSize: '0.7rem', color: 'rgba(220,200,255,0.68)' }}>{getTimeAgo(profile.lastSeen)}</span>
          </div>
          {profile.bio && (
            <p style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.5)', margin: '0.15rem 0 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {profile.bio}
            </p>
          )}
          <div style={{ display: 'flex', gap: '0.35rem', marginTop: '0.4rem', flexWrap: 'wrap' }}>
            {profile.sharedNumbers.map(n => (
              <span key={n} style={{
                fontSize: '0.7rem', padding: '0.15rem 0.5rem',
                borderRadius: '999px', background: 'rgba(201,168,76,0.15)',
                border: '1px solid rgba(201,168,76,0.4)', color: '#c9a84c', fontWeight: 600
              }}>{n}</span>
            ))}
          </div>
        </div>
        <SyncScoreRing score={profile.syncScore} />
      </div>

      {expanded && (
        <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <div style={{ textAlign: 'center', padding: '0.5rem', background: 'rgba(255,255,255,0.04)', borderRadius: '0.5rem' }}>
              <div style={{ fontSize: '0.65rem', color: 'rgba(220,200,255,0.68)', marginBottom: '0.2rem' }}>NUMBERS</div>
              <div style={{ fontSize: '0.8rem', color: '#f0e6ff' }}>{profile.numbers.join(', ')}</div>
            </div>
            <div style={{ textAlign: 'center', padding: '0.5rem', background: 'rgba(255,255,255,0.04)', borderRadius: '0.5rem' }}>
              <div style={{ fontSize: '0.65rem', color: 'rgba(220,200,255,0.68)', marginBottom: '0.2rem' }}>LIFE PATH</div>
              <div style={{ fontSize: '1rem', fontWeight: 700, color: '#c9a84c' }}>{profile.lifePathNumber}</div>
            </div>
            <div style={{ textAlign: 'center', padding: '0.5rem', background: 'rgba(255,255,255,0.04)', borderRadius: '0.5rem' }}>
              <div style={{ fontSize: '0.65rem', color: 'rgba(220,200,255,0.68)', marginBottom: '0.2rem' }}>NUMEROLOGY</div>
              <div style={{ fontSize: '0.8rem', color: '#9b59b6' }}>{profile.numerologyMatch}% match</div>
            </div>
          </div>
          <button
            onClick={(e) => { e.stopPropagation(); onConnect(profile) }}
            style={{
              width: '100%', padding: '0.6rem',
              background: 'linear-gradient(135deg, rgba(201,168,76,0.2), rgba(155,89,182,0.2))',
              border: '1px solid rgba(201,168,76,0.4)',
              borderRadius: '0.6rem', color: '#c9a84c',
              fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer',
              letterSpacing: '0.05em'
            }}
          >
            Connect
          </button>
        </div>
      )}
    </div>
  )
}

export default function SyncPage() {
  const [matches, setMatches] = useState<SyncProfile[]>([])
  const [filter, setFilter] = useState('All')
  const [loading, setLoading] = useState(true)
  const [connected, setConnected] = useState<string | null>(null)
  const [userNumbers, setUserNumbers] = useState<string[]>([])
  const [userLifePath, setUserLifePath] = useState(7)

  useEffect(() => {
    const logs = getLogs()
    const nums = [...new Set(logs.map((l: any) => l.number))]
    setUserNumbers(nums as string[])
    const profile = getNumerologyProfile()
    if (profile?.lifePath) setUserLifePath(profile.lifePath)
    setTimeout(() => {
      setMatches(getMockMatches(nums as string[], profile?.lifePath || 7))
      setLoading(false)
    }, 800)
  }, [])

  const filtered = matches.filter(m => {
    if (filter === '24h') {
      return (Date.now() - new Date(m.lastSeen).getTime()) < 86400000
    }
    if (filter === '48h') {
      return (Date.now() - new Date(m.lastSeen).getTime()) < 172800000
    }
    if (filter === 'High Sync') return m.syncScore >= 60
    return true
  })

  const handleConnect = (profile: SyncProfile) => {
    setConnected(profile.displayName)
    setTimeout(() => setConnected(null), 3000)
  }

  return (
    <div style={{ minHeight: '100vh', background: 'transparent', color: '#f0e6ff', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ maxWidth: 640, margin: '0 auto', padding: '2rem 1rem 6rem' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>*</div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 700, background: 'linear-gradient(135deg, #c9a84c, #9b59b6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', margin: 0 }}>
            Live Sync
          </h1>
          <p style={{ color: 'rgba(220,200,255,0.72)', fontSize: '0.85rem', marginTop: '0.4rem' }}>
            People seeing your numbers right now
          </p>
        </div>

        {/* Your numbers */}
        {userNumbers.length > 0 && (
          <div style={{ background: 'rgba(201,168,76,0.06)', border: '1px solid rgba(201,168,76,0.2)', borderRadius: '1rem', padding: '0.75rem 1rem', marginBottom: '1.5rem', textAlign: 'center' }}>
            <span style={{ fontSize: '0.72rem', color: 'rgba(220,200,255,0.68)', letterSpacing: '0.1em' }}>YOUR NUMBERS</span>
            <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'center', flexWrap: 'wrap', marginTop: '0.4rem' }}>
              {userNumbers.slice(0, 8).map(n => (
                <span key={n} style={{ fontSize: '0.8rem', padding: '0.2rem 0.6rem', borderRadius: '999px', background: 'rgba(201,168,76,0.15)', border: '1px solid rgba(201,168,76,0.3)', color: '#c9a84c', fontWeight: 600 }}>{n}</span>
              ))}
            </div>
          </div>
        )}

        {/* Filters */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
          {FILTERS.map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                padding: '0.4rem 1rem', borderRadius: '999px', fontSize: '0.8rem',
                fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s',
                background: filter === f ? 'rgba(201,168,76,0.2)' : 'rgba(255,255,255,0.05)',
                border: filter === f ? '1px solid rgba(201,168,76,0.5)' : '1px solid rgba(255,255,255,0.1)',
                color: filter === f ? '#c9a84c' : 'rgba(255,255,255,0.5)',
              }}
            >{f}</button>
          ))}
          <span style={{ marginLeft: 'auto', fontSize: '0.78rem', color: 'rgba(220,200,255,0.58)', alignSelf: 'center' }}>
            {filtered.length} soul{filtered.length !== 1 ? 's' : ''}
          </span>
        </div>

        {/* Loading */}
        {loading && (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'rgba(220,200,255,0.58)' }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem', animation: 'pulse 1.5s infinite' }}>*</div>
            <p style={{ fontSize: '0.85rem' }}>Scanning the cosmic field...</p>
          </div>
        )}

        {/* No matches */}
        {!loading && filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'rgba(220,200,255,0.58)' }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>*</div>
            <p style={{ fontSize: '0.9rem' }}>No syncs found for this filter</p>
            <p style={{ fontSize: '0.78rem', marginTop: '0.5rem' }}>Log more angel numbers to attract matches</p>
          </div>
        )}

        {/* Match cards */}
        {!loading && filtered.map(profile => (
          <MatchCard key={profile.id} profile={profile} onConnect={handleConnect} />
        ))}

        {/* Connect toast */}
        {connected && (
          <div style={{
            position: 'fixed', bottom: '5rem', left: '50%', transform: 'translateX(-50%)',
            background: 'rgba(201,168,76,0.15)', border: '1px solid rgba(201,168,76,0.4)',
            borderRadius: '999px', padding: '0.6rem 1.5rem',
            color: '#c9a84c', fontSize: '0.85rem', fontWeight: 600,
            backdropFilter: 'blur(10px)', zIndex: 100,
            animation: 'fadeIn 0.3s ease'
          }}>
            Connection request sent to {connected}!
          </div>
        )}

        {/* Demo notice */}
        <div style={{ marginTop: '2rem', padding: '0.75rem 1rem', background: 'rgba(155,89,182,0.08)', border: '1px solid rgba(155,89,182,0.2)', borderRadius: '0.75rem', textAlign: 'center' }}>
          <p style={{ fontSize: '0.72rem', color: 'rgba(220,200,255,0.62)', margin: 0 }}>
            Demo mode — connect Supabase to see real-time matches
          </p>
        </div>
      </div>
    </div>
  )
}
