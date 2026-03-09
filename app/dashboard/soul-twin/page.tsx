'use client'
import { useState, useEffect } from 'react'

const KEY_PROFILE = 'synchrosoul_numerology_profile'
const KEY_LOGS = 'synchrosoul_logs'

const MOCK_SOULS = [
  { id: 1, name: 'Luna M.', avatar: '🌙', location: 'Portland, OR', numbers: ['1111', '444', '777'], lifePathNumber: 7, syncScore: 94, sharedNumbers: ['1111', '777'], lastSeen: '2h ago', bio: 'Seeing 1111 every morning this week. Something big is shifting.', online: true },
  { id: 2, name: 'Orion K.', avatar: '⭐', location: 'Sedona, AZ', numbers: ['333', '555', '1111'], lifePathNumber: 11, syncScore: 88, sharedNumbers: ['1111', '333'], lastSeen: '5h ago', bio: 'Twin flame journey. 333 keeps appearing during meditation.', online: true },
  { id: 3, name: 'Sage R.', avatar: '🌿', location: 'Asheville, NC', numbers: ['222', '444', '888'], lifePathNumber: 2, syncScore: 82, sharedNumbers: ['444'], lastSeen: '1d ago', bio: 'Angel numbers led me to leave my corporate job. Best decision ever.', online: false },
  { id: 4, name: 'Nova T.', avatar: '✨', location: 'Santa Fe, NM', numbers: ['777', '999', '1111'], lifePathNumber: 9, syncScore: 79, sharedNumbers: ['777', '1111'], lastSeen: '3h ago', bio: 'On a spiritual awakening journey. 777 is my constant companion.', online: true },
  { id: 5, name: 'River A.', avatar: '💫', location: 'Boulder, CO', numbers: ['555', '111', '333'], lifePathNumber: 5, syncScore: 71, sharedNumbers: ['333'], lastSeen: '2d ago', bio: 'Major life changes happening. 555 everywhere I look.', online: false },
  { id: 6, name: 'Celeste B.', avatar: '🌸', location: 'Taos, NM', numbers: ['1212', '444', '888'], lifePathNumber: 8, syncScore: 68, sharedNumbers: ['444'], lastSeen: '6h ago', bio: 'Abundance manifestor. 888 brought me my dream home.', online: false },
]

const COMPATIBILITY_MATRIX: Record<number, number[]> = {
  1: [1,3,5,9], 2: [2,4,6,8], 3: [1,3,6,9], 4: [2,4,8],
  5: [1,5,7,9], 6: [2,3,6,9], 7: [5,7,11], 8: [2,4,8,22],
  9: [1,3,6,9], 11: [2,7,11,22], 22: [4,8,11,22], 33: [6,9,33]
}

export default function SoulTwinPage() {
  const [profile, setProfile] = useState<any>(null)
  const [logs, setLogs] = useState<any[]>([])
  const [selected, setSelected] = useState<number | null>(null)
  const [filter, setFilter] = useState<'all' | 'online' | 'high'>('all')
  const [connecting, setConnecting] = useState<number | null>(null)
  const [connected, setConnected] = useState<number[]>([])

  useEffect(() => {
    const p = localStorage.getItem(KEY_PROFILE)
    if (p) setProfile(JSON.parse(p))
    const l = localStorage.getItem(KEY_LOGS)
    if (l) setLogs(JSON.parse(l))
    const c = localStorage.getItem('synchrosoul_connections')
    if (c) setConnected(JSON.parse(c))
  }, [])

  function connect(id: number) {
    setConnecting(id)
    setTimeout(() => {
      const next = [...connected, id]
      setConnected(next)
      localStorage.setItem('synchrosoul_connections', JSON.stringify(next))
      setConnecting(null)
    }, 1500)
  }

  const myNumbers = logs.slice(0, 20).map((l: any) => l.number)
  const filtered = MOCK_SOULS.filter(s => {
    if (filter === 'online') return s.online
    if (filter === 'high') return s.syncScore >= 80
    return true
  }).sort((a, b) => b.syncScore - a.syncScore)

  const selectedSoul = MOCK_SOULS.find(s => s.id === selected)
  const card = { background: 'rgba(8,6,28,0.88)', border: '1px solid rgba(200,180,255,0.12)', borderRadius: '1.25rem', backdropFilter: 'blur(12px)' } as React.CSSProperties

  return (
    <div style={{ maxWidth: '680px', margin: '0 auto', padding: '1.5rem 1rem 2rem' }}>
      <div style={{ marginBottom: '1.25rem' }}>
        <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.8rem', color: 'rgba(220,200,255,0.95)', margin: '0 0 0.25rem', fontWeight: 400 }}>Soul Twin Radar</h1>
        <p style={{ color: 'rgba(180,160,255,0.5)', fontSize: '0.8rem', margin: 0 }}>Souls seeing the same numbers as you · Sorted by sync score</p>
      </div>

      {/* My signal */}
      <div style={{ ...card, padding: '1.25rem', marginBottom: '1.25rem', background: 'linear-gradient(135deg, rgba(167,139,250,0.12), rgba(201,168,76,0.08))' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
          <div style={{ width: '3rem', height: '3rem', borderRadius: '50%', background: 'linear-gradient(135deg, rgba(167,139,250,0.3), rgba(201,168,76,0.3))', border: '1px solid rgba(167,139,250,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>✦</div>
          <div style={{ flex: 1 }}>
            <div style={{ color: 'rgba(220,200,255,0.9)', fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.25rem' }}>Your Signal is Broadcasting</div>
            <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
              {myNumbers.slice(0, 5).length > 0
                ? [...new Set(myNumbers.slice(0, 5))].map((n: any) => <span key={n} style={{ padding: '0.15rem 0.45rem', borderRadius: '2rem', background: 'rgba(201,168,76,0.15)', border: '1px solid rgba(201,168,76,0.3)', color: '#c9a84c', fontSize: '0.68rem' }}>{n}</span>)
                : <span style={{ color: 'rgba(180,160,255,0.4)', fontSize: '0.75rem' }}>Log angel numbers to activate your signal</span>
              }
            </div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#34d399', boxShadow: '0 0 8px #34d399', margin: '0 auto 0.25rem' }} />
            <div style={{ color: '#34d399', fontSize: '0.6rem' }}>LIVE</div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '1.25rem' }}>
        {([['all','All Souls','✦'], ['online','Online Now','🟢'], ['high','High Sync','⚡']] as const).map(([v, l, e]) => (
          <button key={v} onClick={() => setFilter(v)} style={{ flex: 1, padding: '0.4rem', borderRadius: '0.75rem', border: filter === v ? '1px solid rgba(167,139,250,0.5)' : '1px solid rgba(200,180,255,0.1)', background: filter === v ? 'rgba(167,139,250,0.15)' : 'rgba(8,6,28,0.7)', color: filter === v ? '#a78bfa' : 'rgba(180,160,255,0.45)', fontSize: '0.72rem', cursor: 'pointer' }}>{e} {l}</button>
        ))}
      </div>

      {/* Soul cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {filtered.map(soul => {
          const isSelected = selected === soul.id
          const isConnected = connected.includes(soul.id)
          const isConnecting = connecting === soul.id
          const scoreColor = soul.syncScore >= 90 ? '#c9a84c' : soul.syncScore >= 80 ? '#a78bfa' : soul.syncScore >= 70 ? '#60a5fa' : '#94a3b8'
          return (
            <div key={soul.id} style={{ ...card, borderColor: isSelected ? 'rgba(167,139,250,0.3)' : 'rgba(200,180,255,0.12)' }}>
              <div onClick={() => setSelected(isSelected ? null : soul.id)} style={{ padding: '1rem 1.25rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
                {/* Avatar */}
                <div style={{ position: 'relative', flexShrink: 0 }}>
                  <div style={{ width: '2.75rem', height: '2.75rem', borderRadius: '50%', background: 'rgba(167,139,250,0.15)', border: '1px solid rgba(167,139,250,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem' }}>{soul.avatar}</div>
                  {soul.online && <div style={{ position: 'absolute', bottom: 0, right: 0, width: '10px', height: '10px', borderRadius: '50%', background: '#34d399', border: '2px solid #050510' }} />}
                </div>
                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                    <span style={{ color: 'rgba(220,200,255,0.9)', fontSize: '0.9rem', fontWeight: 600 }}>{soul.name}</span>
                    <span style={{ color: 'rgba(180,160,255,0.35)', fontSize: '0.7rem' }}>{soul.location}</span>
                  </div>
                  <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                    {soul.sharedNumbers.map(n => <span key={n} style={{ padding: '0.1rem 0.4rem', borderRadius: '2rem', background: 'rgba(201,168,76,0.12)', border: '1px solid rgba(201,168,76,0.25)', color: '#c9a84c', fontSize: '0.65rem' }}>✦ {n}</span>)}
                    <span style={{ color: 'rgba(180,160,255,0.35)', fontSize: '0.65rem' }}>LP {soul.lifePathNumber}</span>
                  </div>
                </div>
                {/* Sync score */}
                <div style={{ textAlign: 'center', flexShrink: 0 }}>
                  <div style={{ color: scoreColor, fontSize: '1.2rem', fontWeight: 700 }}>{soul.syncScore}%</div>
                  <div style={{ color: 'rgba(180,160,255,0.35)', fontSize: '0.58rem', textTransform: 'uppercase' }}>sync</div>
                </div>
              </div>

              {isSelected && (
                <div style={{ padding: '0 1.25rem 1.25rem', borderTop: '1px solid rgba(200,180,255,0.06)' }}>
                  <p style={{ color: 'rgba(180,160,255,0.65)', fontSize: '0.82rem', margin: '0.75rem 0', lineHeight: 1.5, fontStyle: 'italic' }}>&ldquo;{soul.bio}&rdquo;</p>
                  <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap', marginBottom: '0.875rem' }}>
                    {soul.numbers.map(n => <span key={n} style={{ padding: '0.2rem 0.5rem', borderRadius: '2rem', background: 'rgba(167,139,250,0.1)', border: '1px solid rgba(167,139,250,0.2)', color: '#a78bfa', fontSize: '0.7rem' }}>{n}</span>)}
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    {isConnected ? (
                      <div style={{ flex: 1, padding: '0.65rem', borderRadius: '0.875rem', background: 'rgba(52,211,153,0.1)', border: '1px solid rgba(52,211,153,0.3)', color: '#34d399', fontSize: '0.85rem', textAlign: 'center' }}>✓ Connected · Coming Soon: Message</div>
                    ) : (
                      <button onClick={() => connect(soul.id)} disabled={isConnecting} style={{ flex: 1, padding: '0.65rem', borderRadius: '0.875rem', background: 'linear-gradient(135deg, rgba(167,139,250,0.4), rgba(201,168,76,0.4))', border: '1px solid rgba(167,139,250,0.3)', color: 'rgba(220,200,255,0.9)', fontSize: '0.85rem', cursor: 'pointer', fontWeight: 600 }}>{isConnecting ? 'Connecting...' : '✦ Connect Souls'}</button>
                    )}
                  </div>
                  <div style={{ color: 'rgba(180,160,255,0.3)', fontSize: '0.68rem', textAlign: 'center', marginTop: '0.5rem' }}>Last seen {soul.lastSeen}</div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      <p style={{ textAlign: 'center', color: 'rgba(180,160,255,0.25)', fontSize: '0.72rem', marginTop: '1.5rem' }}>Real-time matching activates with Supabase · Currently showing demo souls</p>
    </div>
  )
}
