'use client'
import { useState, useEffect } from 'react'
import { getLogs } from '@/lib/storage'


interface SoulTwin {
  id: string
  name: string
  avatar: string
  lifePathNumber: number
  sharedNumbers: string[]
  syncScore: number
  lastSeen: string
  bio: string
  dominantNumber: string
  connectionType: 'mirror' | 'complement' | 'twin' | 'guide'
  distance: string
  recentNumbers: string[]
}

const CONNECTION_INFO = {
  twin: { label: 'Twin Flame', color: '#ff6b9d', emoji: '🔥', desc: 'Rare mirror soul — you reflect each other perfectly' },
  mirror: { label: 'Mirror Soul', color: '#c9a84c', emoji: '✦', desc: 'Seeing the same signs at the same moments' },
  complement: { label: 'Complement', color: '#60a5fa', emoji: '☯', desc: 'Your energies balance and complete each other' },
  guide: { label: 'Soul Guide', color: '#a78bfa', emoji: '🌟', desc: 'One of you is guiding the other forward' },
}

const MOCK_TWINS: SoulTwin[] = [
  { id: '1', name: 'Luna M.', avatar: '🌙', lifePathNumber: 11, sharedNumbers: ['1111','333','777'], syncScore: 94, lastSeen: '2 min ago', bio: 'Seeing 1111 everywhere lately. Something big is shifting.', dominantNumber: '1111', connectionType: 'twin', distance: '0.3 miles', recentNumbers: ['1111','333','1212'] },
  { id: '2', name: 'Orion K.', avatar: '⭐', lifePathNumber: 7, sharedNumbers: ['777','999'], syncScore: 87, lastSeen: '15 min ago', bio: 'Deep in a spiritual awakening. 777 keeps finding me.', dominantNumber: '777', connectionType: 'mirror', distance: '1.2 miles', recentNumbers: ['777','999','444'] },
  { id: '3', name: 'Sage R.', avatar: '🌿', lifePathNumber: 3, sharedNumbers: ['333','555'], syncScore: 79, lastSeen: '1 hr ago', bio: 'Artist and dreamer. 333 is my creative muse.', dominantNumber: '333', connectionType: 'complement', distance: '3.7 miles', recentNumbers: ['333','555','111'] },
  { id: '4', name: 'Zara A.', avatar: '✨', lifePathNumber: 22, sharedNumbers: ['222','888'], syncScore: 72, lastSeen: '3 hrs ago', bio: 'Building something beautiful. 888 is my abundance code.', dominantNumber: '888', connectionType: 'guide', distance: '8.1 miles', recentNumbers: ['888','222','1111'] },
  { id: '5', name: 'River T.', avatar: '💧', lifePathNumber: 2, sharedNumbers: ['222','444'], syncScore: 68, lastSeen: '5 hrs ago', bio: 'Finding balance in everything. 222 is my anchor.', dominantNumber: '222', connectionType: 'complement', distance: '12 miles', recentNumbers: ['222','444','666'] },
]

export default function SoulTwinPage() {
  const [twins, setTwins] = useState<SoulTwin[]>([])
  const [selected, setSelected] = useState<SoulTwin | null>(null)
  const [filter, setFilter] = useState<string>('all')
  const [myNumbers, setMyNumbers] = useState<string[]>([])
  const [myLP, setMyLP] = useState<number | null>(null)

  useEffect(() => {
    const logs = getLogs().slice(0, 20)
    const nums = [...new Set(logs.map(l => l.number))].slice(0, 5)
    setMyNumbers(nums)
    const raw = localStorage.getItem('synchrosoul_numerology'); const profile = raw ? JSON.parse(raw) : null
    if (profile?.lifePathNumber) setMyLP(profile.lifePathNumber)
    // Sort by sync score
    setTwins(MOCK_TWINS.sort((a, b) => b.syncScore - a.syncScore))
  }, [])

  const filtered = filter === 'all' ? twins : twins.filter(t => t.connectionType === filter)

  const card = { background: 'rgba(8,6,28,0.88)', border: '1px solid rgba(200,180,255,0.12)', borderRadius: '1rem', backdropFilter: 'blur(12px)' } as React.CSSProperties

  function ScoreRing({ score }: { score: number }) {
    const color = score >= 90 ? '#ff6b9d' : score >= 80 ? '#c9a84c' : score >= 70 ? '#a78bfa' : '#60a5fa'
    return (
      <div style={{ position: 'relative', width: '52px', height: '52px', flexShrink: 0 }}>
        <svg width="52" height="52" style={{ transform: 'rotate(-90deg)' }}>
          <circle cx="26" cy="26" r="22" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="3" />
          <circle cx="26" cy="26" r="22" fill="none" stroke={color} strokeWidth="3"
            strokeDasharray={`${2 * Math.PI * 22 * score / 100} ${2 * Math.PI * 22}`}
            strokeLinecap="round" />
        </svg>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color, fontSize: '0.72rem', fontWeight: 700 }}>{score}%</div>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: '700px', margin: '0 auto', padding: '1.5rem 1rem 2rem' }}>
      <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.8rem', color: 'rgba(220,200,255,0.95)', margin: '0 0 0.25rem', fontWeight: 400 }}>Soul Twin Radar</h1>
      <p style={{ color: 'rgba(180,160,255,0.5)', fontSize: '0.8rem', margin: '0 0 1.25rem' }}>Souls seeing the same signs as you right now</p>

      {/* My signal */}
      {myNumbers.length > 0 && (
        <div style={{ ...card, padding: '1rem 1.25rem', marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem', background: 'rgba(20,10,50,0.92)', border: '1px solid rgba(167,139,250,0.2)' }}>
          <div style={{ fontSize: '1.5rem' }}>📡</div>
          <div style={{ flex: 1 }}>
            <div style={{ color: 'rgba(220,200,255,0.9)', fontSize: '0.82rem', fontWeight: 600, marginBottom: '0.3rem' }}>Your Signal {myLP ? `· Life Path ${myLP}` : ''}</div>
            <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
              {myNumbers.map(n => <span key={n} style={{ padding: '0.15rem 0.5rem', borderRadius: '2rem', background: 'rgba(167,139,250,0.15)', border: '1px solid rgba(167,139,250,0.3)', color: '#c9a84c', fontSize: '0.72rem' }}>{n}</span>)}
              {myNumbers.length === 0 && <span style={{ color: 'rgba(180,160,255,0.4)', fontSize: '0.75rem' }}>Log some numbers to activate matching</span>}
            </div>
          </div>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#4ade80', boxShadow: '0 0 8px #4ade80', animation: 'pulse 2s infinite' }} />
        </div>
      )}

      {/* Filter */}
      <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '1.25rem' }}>
        {['all','twin','mirror','complement','guide'].map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{ padding: '0.3rem 0.7rem', borderRadius: '2rem', cursor: 'pointer', fontSize: '0.72rem', fontFamily: 'inherit', background: filter === f ? 'rgba(167,139,250,0.2)' : 'rgba(255,255,255,0.04)', border: filter === f ? '1px solid rgba(167,139,250,0.5)' : '1px solid rgba(255,255,255,0.08)', color: 'rgba(200,180,255,0.8)', textTransform: 'capitalize' }}>
            {f === 'all' ? `All (${twins.length})` : `${CONNECTION_INFO[f as keyof typeof CONNECTION_INFO]?.emoji} ${CONNECTION_INFO[f as keyof typeof CONNECTION_INFO]?.label}`}
          </button>
        ))}
      </div>

      {/* Twin cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {filtered.map(twin => {
          const conn = CONNECTION_INFO[twin.connectionType]
          return (
            <div key={twin.id} onClick={() => setSelected(twin)} style={{ ...card, padding: '1.25rem', cursor: 'pointer', transition: 'all 0.2s', border: `1px solid ${conn.color}22` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: `${conn.color}22`, border: `2px solid ${conn.color}44`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', flexShrink: 0 }}>{twin.avatar}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                    <span style={{ color: 'rgba(220,200,255,0.95)', fontWeight: 600, fontSize: '0.95rem' }}>{twin.name}</span>
                    <span style={{ padding: '0.1rem 0.5rem', borderRadius: '2rem', background: `${conn.color}22`, border: `1px solid ${conn.color}44`, color: conn.color, fontSize: '0.62rem' }}>{conn.emoji} {conn.label}</span>
                  </div>
                  <p style={{ color: 'rgba(180,160,255,0.6)', fontSize: '0.75rem', margin: '0 0 0.4rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{twin.bio}</p>
                  <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                    {twin.sharedNumbers.map(n => <span key={n} style={{ padding: '0.1rem 0.4rem', borderRadius: '2rem', background: 'rgba(201,168,76,0.12)', border: '1px solid rgba(201,168,76,0.25)', color: '#c9a84c', fontSize: '0.65rem' }}>✦ {n}</span>)}
                  </div>
                </div>
                <ScoreRing score={twin.syncScore} />
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid rgba(200,180,255,0.06)' }}>
                <span style={{ color: 'rgba(180,160,255,0.4)', fontSize: '0.65rem' }}>LP {twin.lifePathNumber} · {twin.distance}</span>
                <span style={{ color: 'rgba(180,160,255,0.4)', fontSize: '0.65rem' }}>Active {twin.lastSeen}</span>
              </div>
            </div>
          )
        })}
      </div>

      {/* Detail modal */}
      {selected && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 200, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }} onClick={() => setSelected(null)}>
          <div style={{ background: 'rgba(8,6,28,0.98)', border: '1px solid rgba(200,180,255,0.15)', borderRadius: '1.5rem 1.5rem 0 0', padding: '2rem 1.5rem', width: '100%', maxWidth: '600px', maxHeight: '80vh', overflowY: 'auto' }} onClick={e => e.stopPropagation()}>
            <div style={{ width: '2.5rem', height: '3px', background: 'rgba(200,180,255,0.2)', borderRadius: '9999px', margin: '0 auto 1.5rem' }} />
            {(() => {
              const conn = CONNECTION_INFO[selected.connectionType]
              return (
                <>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem' }}>
                    <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: `${conn.color}22`, border: `2px solid ${conn.color}66`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem' }}>{selected.avatar}</div>
                    <div>
                      <div style={{ color: 'rgba(220,200,255,0.95)', fontSize: '1.2rem', fontWeight: 600 }}>{selected.name}</div>
                      <div style={{ color: conn.color, fontSize: '0.78rem', marginTop: '0.2rem' }}>{conn.emoji} {conn.label} · Life Path {selected.lifePathNumber}</div>
                    </div>
                    <ScoreRing score={selected.syncScore} />
                  </div>
                  <div style={{ background: `${conn.color}11`, border: `1px solid ${conn.color}33`, borderRadius: '0.75rem', padding: '0.75rem 1rem', marginBottom: '1rem' }}>
                    <div style={{ color: conn.color, fontSize: '0.72rem', fontWeight: 600, marginBottom: '0.25rem' }}>{conn.emoji} {conn.label}</div>
                    <div style={{ color: 'rgba(200,180,255,0.7)', fontSize: '0.8rem' }}>{conn.desc}</div>
                  </div>
                  <p style={{ color: 'rgba(200,180,255,0.75)', fontSize: '0.85rem', lineHeight: 1.6, marginBottom: '1rem' }}>{selected.bio}</p>
                  <div style={{ marginBottom: '1rem' }}>
                    <div style={{ color: 'rgba(180,160,255,0.4)', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>Shared Numbers</div>
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                      {selected.sharedNumbers.map(n => <span key={n} style={{ padding: '0.3rem 0.75rem', borderRadius: '2rem', background: 'rgba(201,168,76,0.15)', border: '1px solid rgba(201,168,76,0.35)', color: '#c9a84c', fontSize: '0.8rem' }}>✦ {n}</span>)}
                    </div>
                  </div>
                  <div style={{ marginBottom: '1.5rem' }}>
                    <div style={{ color: 'rgba(180,160,255,0.4)', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>Recent Sightings</div>
                    <div style={{ display: 'flex', gap: '0.4rem' }}>
                      {selected.recentNumbers.map(n => <span key={n} style={{ padding: '0.2rem 0.6rem', borderRadius: '2rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(200,180,255,0.12)', color: 'rgba(200,180,255,0.7)', fontSize: '0.75rem' }}>{n}</span>)}
                    </div>
                  </div>
                  <button style={{ width: '100%', padding: '0.9rem', borderRadius: '0.75rem', cursor: 'pointer', background: `${conn.color}22`, border: `1px solid ${conn.color}55`, color: conn.color, fontSize: '0.9rem', fontFamily: 'inherit' }}>✉ Send a Cosmic Message</button>
                </>
              )
            })()}
          </div>
        </div>
      )}
    </div>
  )
}
