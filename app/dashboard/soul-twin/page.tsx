'use client'
import { useState, useEffect } from 'react'
import { getLogs } from '@/lib/storage'
import { getNumerologyProfile } from '@/lib/storage'

const MOCK_SOULS = [
  { id: 1, name: 'Luna M.', avatar: '✨', numbers: ['1111', '444', '777'], lp: 7, streak: 14, lastSeen: '2 hours ago', bio: 'Chasing synchronicities and morning light.', syncScore: 94 },
  { id: 2, name: 'Orion K.', avatar: '✦', numbers: ['555', '1111', '333'], lp: 5, streak: 8, lastSeen: '5 hours ago', bio: 'In transition. Trusting the process.', syncScore: 87 },
  { id: 3, name: 'Sage R.', avatar: '○', numbers: ['222', '444', '888'], lp: 4, streak: 21, lastSeen: '1 day ago', bio: 'Building something sacred, one day at a time.', syncScore: 79 },
  { id: 4, name: 'Nova T.', avatar: '♥', numbers: ['333', '777', '999'], lp: 9, streak: 5, lastSeen: '3 hours ago', bio: 'Releasing the old. Welcoming the new.', syncScore: 73 },
  { id: 5, name: 'Zephyr A.', avatar: '◆', numbers: ['1212', '444', '111'], lp: 3, streak: 30, lastSeen: '6 hours ago', bio: 'Creative soul on a spiritual awakening journey.', syncScore: 68 },
  { id: 6, name: 'Iris V.', avatar: '❤', numbers: ['888', '222', '1111'], lp: 8, streak: 12, lastSeen: '2 days ago', bio: 'Abundance mindset. Gratitude daily.', syncScore: 61 },
]

function ScoreRing({ score, color }: { score: number; color: string }) {
  const r = 22
  const circ = 2 * Math.PI * r
  const dash = (score / 100) * circ
  return (
    <svg width="56" height="56" style={{ flexShrink: 0 }}>
      <circle cx="28" cy="28" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="4" />
      <circle cx="28" cy="28" r={r} fill="none" stroke={color} strokeWidth="4"
        strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
        transform="rotate(-90 28 28)" style={{ transition: 'stroke-dasharray 0.6s ease' }} />
      <text x="28" y="33" textAnchor="middle" fill={color} fontSize="11" fontWeight="700">{score}%</text>
    </svg>
  )
}

export default function SoulTwinPage() {
  const [souls, setSouls] = useState(MOCK_SOULS)
  const [selected, setSelected] = useState<typeof MOCK_SOULS[0] | null>(null)
  const [filter, setFilter] = useState<'all' | 'high' | 'new'>('all')
  const [myNumbers, setMyNumbers] = useState<string[]>([])

  useEffect(() => {
    const logs = getLogs()
    const counts: Record<string, number> = {}
    logs.forEach(l => { counts[l.number] = (counts[l.number] || 0) + 1 })
    const top = Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 3).map(([n]) => n)
    setMyNumbers(top)
  }, [])

  const filtered = souls.filter(s => {
    if (filter === 'high') return s.syncScore >= 80
    if (filter === 'new') return s.streak <= 7
    return true
  })

  const getColor = (score: number) => score >= 90 ? '#c9a84c' : score >= 75 ? '#a78bfa' : score >= 60 ? '#60a5fa' : '#34d399'
  const getLabel = (score: number) => score >= 90 ? 'Twin Flame' : score >= 75 ? 'Soul Mate' : score >= 60 ? 'Kindred' : 'Aligned'

  const card = { background: 'rgba(8,6,28,0.88)', border: '1px solid rgba(200,180,255,0.12)', borderRadius: '1.25rem', backdropFilter: 'blur(12px)' } as React.CSSProperties

  return (
    <div style={{ maxWidth: '640px', margin: '0 auto', padding: '1.5rem 1rem 2rem' }}>
      <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.8rem', color: 'rgba(220,200,255,0.95)', margin: '0 0 0.25rem', fontWeight: 400 }}>Soul Twin Radar</h1>
      <p style={{ color: 'rgba(180,160,255,0.5)', fontSize: '0.8rem', margin: '0 0 1.25rem' }}>Souls seeing the same numbers as you right now</p>

      {myNumbers.length > 0 && (
        <div style={{ ...card, padding: '0.875rem 1.25rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <span style={{ color: 'rgba(180,160,255,0.4)', fontSize: '0.7rem' }}>Your numbers:</span>
          {myNumbers.map(n => (
            <span key={n} style={{ background: 'rgba(167,139,250,0.12)', border: '1px solid rgba(167,139,250,0.25)', borderRadius: '0.5rem', padding: '0.2rem 0.6rem', color: '#a78bfa', fontSize: '0.82rem', fontWeight: 700 }}>{n}</span>
          ))}
        </div>
      )}

      {/* Filters */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem' }}>
        {[['all', 'All Souls'], ['high', '✦ High Sync'], ['new', '✨ New Seekers']].map(([id, label]) => (
          <button key={id} onClick={() => setFilter(id as any)}
            style={{ padding: '0.4rem 0.875rem', borderRadius: '2rem', border: filter === id ? '1px solid rgba(167,139,250,0.5)' : '1px solid rgba(200,180,255,0.12)', background: filter === id ? 'rgba(167,139,250,0.15)' : 'rgba(8,6,28,0.7)', color: filter === id ? '#a78bfa' : 'rgba(180,160,255,0.5)', fontSize: '0.75rem', cursor: 'pointer' }}>
            {label}
          </button>
        ))}
      </div>

      {/* Soul cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {filtered.map(soul => (
          <div key={soul.id}>
            <div
              onClick={() => setSelected(selected?.id === soul.id ? null : soul)}
              style={{ ...card, padding: '1rem 1.25rem', cursor: 'pointer', borderColor: selected?.id === soul.id ? `${getColor(soul.syncScore)}44` : 'rgba(200,180,255,0.12)', transition: 'all 0.2s' }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
                <div style={{ width: '2.75rem', height: '2.75rem', borderRadius: '50%', background: `${getColor(soul.syncScore)}18`, border: `1px solid ${getColor(soul.syncScore)}33`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', flexShrink: 0 }}>{soul.avatar}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                    <span style={{ color: 'rgba(220,200,255,0.9)', fontSize: '0.9rem', fontWeight: 600 }}>{soul.name}</span>
                    <span style={{ background: `${getColor(soul.syncScore)}18`, border: `1px solid ${getColor(soul.syncScore)}33`, borderRadius: '2rem', padding: '0.1rem 0.45rem', fontSize: '0.6rem', color: getColor(soul.syncScore) }}>{getLabel(soul.syncScore)}</span>
                  </div>
                  <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                    {soul.numbers.map(n => <span key={n} style={{ color: 'rgba(167,139,250,0.6)', fontSize: '0.7rem' }}>{n}</span>)}
                  </div>
                </div>
                <ScoreRing score={soul.syncScore} color={getColor(soul.syncScore)} />
              </div>
            </div>

            {selected?.id === soul.id && (
              <div style={{ ...card, padding: '1.25rem', marginTop: '0.4rem', borderColor: `${getColor(soul.syncScore)}22`, background: `${getColor(soul.syncScore)}06` }}>
                <p style={{ color: 'rgba(200,180,255,0.7)', fontSize: '0.85rem', margin: '0 0 1rem', lineHeight: 1.6, fontStyle: 'italic' }}>&ldquo;{soul.bio}&rdquo;</p>
                <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
                  <div style={{ textAlign: 'center' }}><div style={{ color: '#a78bfa', fontSize: '1rem', fontWeight: 700 }}>{soul.lp}</div><div style={{ color: 'rgba(180,160,255,0.4)', fontSize: '0.6rem', textTransform: 'uppercase' }}>Life Path</div></div>
                  <div style={{ textAlign: 'center' }}><div style={{ color: '#c9a84c', fontSize: '1rem', fontWeight: 700 }}>{soul.streak}</div><div style={{ color: 'rgba(180,160,255,0.4)', fontSize: '0.6rem', textTransform: 'uppercase' }}>Day Streak</div></div>
                  <div style={{ textAlign: 'center' }}><div style={{ color: 'rgba(220,200,255,0.7)', fontSize: '0.8rem' }}>{soul.lastSeen}</div><div style={{ color: 'rgba(180,160,255,0.4)', fontSize: '0.6rem', textTransform: 'uppercase' }}>Last Active</div></div>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button style={{ flex: 1, padding: '0.65rem', borderRadius: '0.75rem', background: 'linear-gradient(135deg, #7c3aed, #a78bfa)', border: 'none', color: 'white', fontSize: '0.82rem', cursor: 'pointer', fontWeight: 600 }}>♥ Connect</button>
                  <button style={{ flex: 1, padding: '0.65rem', borderRadius: '0.75rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(200,180,255,0.15)', color: 'rgba(180,160,255,0.6)', fontSize: '0.82rem', cursor: 'pointer' }}>View Profile</button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div style={{ textAlign: 'center', marginTop: '1.5rem', padding: '1rem', background: 'rgba(201,168,76,0.06)', border: '1px solid rgba(201,168,76,0.15)', borderRadius: '1rem' }}>
        <p style={{ color: 'rgba(180,160,255,0.45)', fontSize: '0.78rem', margin: 0 }}>👑 Real-time matching with live users requires Premium. Upgrade to unlock Soul Twin chat and mutual journal sharing.</p>
      </div>
    </div>
  )
}
