'use client'
import { useState, useEffect } from 'react'
import { getMockFeedPosts, getPosts, toggleResonate, deletePost, updatePost, SocialPost } from '@/lib/social-storage'
import { getLogs } from '@/lib/storage'
import { getMockMatches, SyncProfile } from '@/lib/sync-matching'
import { getNumerologyProfile } from '@/lib/storage'

function getTimeAgo(iso: string): string {
  const mins = Math.floor((Date.now() - new Date(iso).getTime()) / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return mins + 'm ago'
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return hrs + 'h ago'
  return Math.floor(hrs / 24) + 'd ago'
}

function ScoreRing({ score, size = 56 }: { score: number; size?: number }) {
  const r = (size - 8) / 2
  const circ = 2 * Math.PI * r
  const dash = (score / 100) * circ
  const color = score >= 80 ? '#c9a84c' : score >= 60 ? '#9b59b6' : score >= 40 ? '#3498db' : '#607d8b'
  return (
    <svg width={size} height={size} style={{ flexShrink: 0 }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth={4} />
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={4}
        strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
        transform={`rotate(-90 ${size/2} ${size/2})`} style={{ transition: 'stroke-dasharray 0.8s ease' }} />
      <text x={size/2} y={size/2 + 5} textAnchor="middle" fill={color} fontSize={size < 50 ? 10 : 13} fontWeight={700}>{score}%</text>
    </svg>
  )
}

function SyncCard({ match }: { match: SyncProfile }) {
  const [expanded, setExpanded] = useState(false)
  return (
    <div style={{ background: 'rgba(8,6,28,0.88)', border: '1px solid rgba(200,180,255,0.18)', backdropFilter: 'blur(12px)', boxShadow: '0 4px 24px rgba(0,0,0,0.45)', borderRadius: '1rem', padding: '1rem', marginBottom: '0.75rem', transition: 'border-color 0.2s', cursor: 'pointer' }} onClick={() => setExpanded(e => !e)}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <div style={{ width: 44, height: 44, borderRadius: '50%', background: match.avatarColor + '33', border: '2px solid ' + match.avatarColor, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem', flexShrink: 0 }}>{match.avatar}</div>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
            <span style={{ fontWeight: 600, fontSize: '0.9rem', color: '#f0e6ff' }}>{match.displayName}</span>
            <span style={{ fontSize: '0.65rem', padding: '0.1rem 0.4rem', borderRadius: '999px', background: 'rgba(155,89,182,0.15)', border: '1px solid rgba(155,89,182,0.3)', color: '#9b59b6' }}>LP {match.lifePathNumber}</span>
          </div>
          {match.bio && <p style={{ margin: '0.15rem 0 0', fontSize: '0.75rem', color: 'rgba(220,200,255,0.55)' }}>{match.bio}</p>}
          <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap', marginTop: '0.35rem' }}>
            {match.sharedNumbers.slice(0, 4).map(n => (
              <span key={n} style={{ fontSize: '0.65rem', padding: '0.1rem 0.4rem', borderRadius: '999px', background: 'rgba(201,168,76,0.12)', border: '1px solid rgba(201,168,76,0.3)', color: '#c9a84c', fontWeight: 600 }}>{n}</span>
            ))}
          </div>
        </div>
        <ScoreRing score={match.syncScore} size={52} />
      </div>
      {expanded && (
        <div style={{ marginTop: '0.875rem', paddingTop: '0.875rem', borderTop: '1px solid rgba(200,180,255,0.1)' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.5rem', marginBottom: '0.75rem' }}>
            {[
              { label: 'Numbers', value: match.numerologyMatch + '%' },
              { label: 'Timing', value: match.timingScore + '%' },
              { label: 'Shared', value: match.sharedNumbers.length },
            ].map(s => (
              <div key={s.label} style={{ textAlign: 'center', padding: '0.5rem', background: 'rgba(255,255,255,0.03)', borderRadius: '0.5rem' }}>
                <div style={{ fontSize: '1rem', fontWeight: 700, color: '#c9a84c' }}>{s.value}</div>
                <div style={{ fontSize: '0.6rem', color: 'rgba(220,200,255,0.45)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{s.label}</div>
              </div>
            ))}
          </div>
          <p style={{ fontSize: '0.7rem', color: 'rgba(220,200,255,0.4)', textAlign: 'center', margin: 0 }}>Last active {getTimeAgo(match.lastSeen)}</p>
        </div>
      )}
    </div>
  )
}

function PostCard({
  post, onResonate, onDelete, onUpdate,
}: {
  post: SocialPost
  onResonate: (id: string) => void
  onDelete: (id: string) => void
  onUpdate: (id: string, content: string, angelNumber?: string) => void
}) {
  const resonated = post.resonatedBy.includes('local_user')
  const [editing, setEditing] = useState(false)
  const [editContent, setEditContent] = useState(post.content)
  const [editNumber, setEditNumber] = useState(post.angelNumber || '')

  const handleSave = () => {
    if (!editContent.trim()) return
    onUpdate(post.id, editContent.trim(), editNumber.trim() || undefined)
    setEditing(false)
  }
  const handleCancel = () => { setEditContent(post.content); setEditNumber(post.angelNumber || ''); setEditing(false) }

  return (
    <div style={{ background: 'rgba(8,6,28,0.88)', border: editing ? '1px solid rgba(201,168,76,0.5)' : '1px solid rgba(200,180,255,0.18)', backdropFilter: 'blur(12px)', boxShadow: '0 4px 24px rgba(0,0,0,0.45)', borderRadius: '1rem', padding: '1rem', marginBottom: '0.75rem', transition: 'border-color 0.2s' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.75rem' }}>
        <div style={{ width: 40, height: 40, borderRadius: '50%', background: post.authorColor + '44', border: '2px solid ' + post.authorColor, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 700, color: post.authorColor, flexShrink: 0, overflow: 'hidden' }}>
          {(post as any).authorImage ? <img src={(post as any).authorImage} alt={post.authorName} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} /> : post.authorAvatar}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
            <span style={{ fontWeight: 600, fontSize: '0.88rem', color: '#f0e6ff' }}>{post.authorName}</span>
            {post.lifePathNumber && <span style={{ fontSize: '0.65rem', padding: '0.1rem 0.4rem', borderRadius: '999px', background: 'rgba(155,89,182,0.15)', border: '1px solid rgba(155,89,182,0.3)', color: '#9b59b6' }}>LP {post.lifePathNumber}</span>}
            {post.isOwn && <span style={{ fontSize: '0.65rem', padding: '0.1rem 0.4rem', borderRadius: '999px', background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.2)', color: '#c9a84c' }}>you</span>}
          </div>
          <span style={{ fontSize: '0.7rem', color: 'rgba(220,200,255,0.55)' }}>{getTimeAgo(post.createdAt)}</span>
        </div>
        {!editing && post.angelNumber && (
          <div style={{ padding: '0.25rem 0.6rem', borderRadius: '999px', background: 'rgba(201,168,76,0.12)', border: '1px solid rgba(201,168,76,0.35)', color: '#c9a84c', fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.05em' }}>{post.angelNumber}</div>
        )}
      </div>
      {editing ? (
        <div style={{ marginBottom: '0.75rem' }}>
          <textarea value={editContent} onChange={e => setEditContent(e.target.value)} rows={3} style={{ width: '100%', boxSizing: 'border-box', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(201,168,76,0.3)', borderRadius: '0.6rem', padding: '0.6rem 0.75rem', color: '#f0e6ff', fontSize: '0.9rem', lineHeight: '1.6', resize: 'vertical', outline: 'none', fontFamily: 'inherit' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
            <input type="text" value={editNumber} onChange={e => setEditNumber(e.target.value)} placeholder="Angel number (e.g. 1111)" style={{ flex: 1, minWidth: 120, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '0.5rem', padding: '0.4rem 0.6rem', color: '#c9a84c', fontSize: '0.8rem', outline: 'none', fontFamily: 'inherit' }} />
            <button onClick={handleSave} style={{ padding: '0.4rem 1rem', borderRadius: '999px', background: 'rgba(201,168,76,0.2)', border: '1px solid rgba(201,168,76,0.5)', color: '#c9a84c', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer' }}>Save</button>
            <button onClick={handleCancel} style={{ padding: '0.4rem 0.75rem', borderRadius: '999px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(220,200,255,0.72)', fontSize: '0.78rem', cursor: 'pointer' }}>Cancel</button>
          </div>
        </div>
      ) : (
        <p style={{ margin: '0 0 0.75rem', fontSize: '0.9rem', color: 'rgba(240,230,255,0.93)', lineHeight: '1.65' }}>{post.content}</p>
      )}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
        <button onClick={() => onResonate(post.id)} style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', padding: '0.3rem 0.75rem', borderRadius: '999px', background: resonated ? 'rgba(201,168,76,0.15)' : 'rgba(255,255,255,0.04)', border: resonated ? '1px solid rgba(201,168,76,0.4)' : '1px solid rgba(255,255,255,0.08)', color: resonated ? '#c9a84c' : 'rgba(220,200,255,0.68)', fontSize: '0.78rem', fontWeight: resonated ? 600 : 400, cursor: 'pointer', transition: 'all 0.2s' }}>
          <span>✦</span><span>Resonate</span>{post.resonates > 0 && <span style={{ opacity: 0.7 }}>{post.resonates}</span>}
        </button>
        {post.isOwn && !editing && (
          <>
            <button onClick={() => setEditing(true)} style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', padding: '0.3rem 0.75rem', borderRadius: '999px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: 'rgba(220,200,255,0.72)', fontSize: '0.78rem', cursor: 'pointer', transition: 'all 0.2s' }}><span>✎</span><span>Edit</span></button>
            <button onClick={() => onDelete(post.id)} style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', padding: '0.3rem 0.75rem', borderRadius: '999px', background: 'rgba(231,76,60,0.06)', border: '1px solid rgba(231,76,60,0.2)', color: 'rgba(231,76,60,0.6)', fontSize: '0.78rem', cursor: 'pointer', transition: 'all 0.2s' }}><span>✕</span><span>Delete</span></button>
          </>
        )}
      </div>
    </div>
  )
}

export default function FeedPage() {
  const [activeTab, setActiveTab] = useState<'feed' | 'sync'>('feed')
  const [posts, setPosts] = useState<SocialPost[]>([])
  const [syncMatches, setSyncMatches] = useState<SyncProfile[]>([])
  const [userNumbers, setUserNumbers] = useState<string[]>([])
  const [filter, setFilter] = useState('All')
  const [syncFilter, setSyncFilter] = useState('All')
  const [loading, setLoading] = useState(true)
  const [numberFilters, setNumberFilters] = useState<string[]>([])

  useEffect(() => {
    ;(async () => {
    const logs = await getLogs()
    const nums = [...new Set(logs.map((l: any) => l.number))] as string[]
    setUserNumbers(nums)
    const ownPosts = await getPosts()
    const mockPosts = getMockFeedPosts(nums)
    const all = [...ownPosts, ...mockPosts]
    const seen = new Set<string>()
    const merged = all.filter(p => { if (seen.has(p.id)) return false; seen.add(p.id); return true })
    merged.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    setPosts(merged)
    const nums2 = [...new Set(merged.map(p => p.angelNumber).filter(Boolean))] as string[]
    setNumberFilters(nums2.slice(0, 8))
    const numerology = await getNumerologyProfile()
    const lp = numerology?.lifePath ?? 1
    const matches = getMockMatches(nums, lp)
    setSyncMatches(matches)
    setTimeout(() => setLoading(false), 600)  })()
  }, [])

  const handleResonate = async (postId: string) => {
    await toggleResonate(postId)
    setPosts(prev => prev.map(p => {
      if (p.id !== postId) return p
      const resonated = p.resonatedBy.includes('local_user')
      return { ...p, resonates: resonated ? p.resonates - 1 : p.resonates + 1, resonatedBy: resonated ? p.resonatedBy.filter(id => id !== 'local_user') : [...p.resonatedBy, 'local_user'] }
    }))
  }
  const handleDelete = async (postId: string) => { await deletePost(postId); setPosts(prev => prev.filter(p => p.id !== postId)) }
  const handleUpdate = (postId: string, content: string, angelNumber?: string) => {
    updatePost(postId, content, angelNumber)
    setPosts(prev => prev.map(p => p.id === postId ? { ...p, content, angelNumber } : p))
  }

  const filteredPosts = posts.filter(p => {
    if (filter === 'All') return true
    if (filter === 'Synced') return userNumbers.includes(p.angelNumber || '')
    return p.angelNumber === filter
  })

  const filteredSync = syncMatches.filter(m => {
    if (syncFilter === 'All') return true
    if (syncFilter === 'High') return m.syncScore >= 75
    if (syncFilter === 'Medium') return m.syncScore >= 50 && m.syncScore < 75
    return m.syncScore < 50
  })

  return (
    <div style={{ minHeight: '100vh', background: 'transparent', color: '#f0e6ff', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ maxWidth: 640, margin: '0 auto', padding: '2rem 1rem 6rem' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div style={{ fontSize: '2rem', marginBottom: '0.4rem' }}>✦</div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 700, background: 'linear-gradient(135deg, #c9a84c, #9b59b6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', margin: 0 }}>
            {activeTab === 'feed' ? 'Cosmic Feed' : 'Live Sync'}
          </h1>
          <p style={{ color: 'rgba(220,200,255,0.7)', fontSize: '0.85rem', marginTop: '0.4rem' }}>
            {activeTab === 'feed' ? 'Souls seeing your numbers' : 'Souls in harmonic alignment with you'}
          </p>
        </div>

        {/* Tab toggle */}
        <div style={{ display: 'flex', gap: '0', marginBottom: '1.5rem', background: 'rgba(255,255,255,0.04)', borderRadius: '0.875rem', padding: '0.25rem', border: '1px solid rgba(200,180,255,0.1)' }}>
          {(['feed', 'sync'] as const).map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} style={{ flex: 1, padding: '0.6rem 1rem', borderRadius: '0.65rem', border: 'none', background: activeTab === tab ? 'rgba(160,100,255,0.2)' : 'transparent', color: activeTab === tab ? 'rgba(220,190,255,0.95)' : 'rgba(200,180,255,0.45)', fontSize: '0.85rem', fontWeight: activeTab === tab ? 600 : 400, cursor: 'pointer', transition: 'all 0.2s', letterSpacing: '0.03em' }}>
              {tab === 'feed' ? '✦ Cosmic Feed' : '◎ Live Sync'}
            </button>
          ))}
        </div>

        {/* FEED TAB */}
        {activeTab === 'feed' && (
          <>
            <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '1.5rem', overflowX: 'auto', paddingBottom: '0.25rem' }}>
              {['All', 'Synced', ...numberFilters].map(f => (
                <button key={f} onClick={() => setFilter(f)} style={{ padding: '0.35rem 0.85rem', borderRadius: '999px', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s', whiteSpace: 'nowrap', flexShrink: 0, background: filter === f ? 'rgba(201,168,76,0.2)' : 'rgba(255,255,255,0.05)', border: filter === f ? '1px solid rgba(201,168,76,0.5)' : '1px solid rgba(255,255,255,0.1)', color: filter === f ? '#e0c060' : 'rgba(220,200,255,0.7)' }}>{f}</button>
              ))}
            </div>
            {loading && (
              <div style={{ textAlign: 'center', padding: '3rem', color: 'rgba(220,200,255,0.5)' }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>✦</div>
                <p style={{ fontSize: '0.85rem' }}>Tuning into the cosmic frequency...</p>
              </div>
            )}
            {!loading && filteredPosts.map(post => (
              <PostCard key={post.id} post={post} onResonate={handleResonate} onDelete={handleDelete} onUpdate={handleUpdate} />
            ))}
            {!loading && filteredPosts.length === 0 && (
              <div style={{ textAlign: 'center', padding: '3rem', color: 'rgba(220,200,255,0.5)' }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>✦</div>
                <p style={{ fontSize: '0.85rem' }}>No posts for this filter yet</p>
                <p style={{ fontSize: '0.75rem', marginTop: '0.4rem' }}>Log more numbers to see synced posts</p>
              </div>
            )}
            {!loading && (
              <div style={{ marginTop: '1.5rem', padding: '0.75rem 1rem', background: 'rgba(155,89,182,0.06)', border: '1px solid rgba(155,89,182,0.15)', borderRadius: '0.75rem', textAlign: 'center' }}>
                <p style={{ fontSize: '0.7rem', color: 'rgba(220,200,255,0.5)', margin: 0 }}>Demo feed — connect Supabase for real-time posts from matched souls</p>
              </div>
            )}
          </>
        )}

        {/* SYNC TAB */}
        {activeTab === 'sync' && (
          <>
            {/* Sync score legend */}
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
              {[
                { label: 'All', color: 'rgba(200,180,255,0.5)' },
                { label: 'High', color: '#c9a84c' },
                { label: 'Medium', color: '#9b59b6' },
                { label: 'Low', color: '#607d8b' },
              ].map(f => (
                <button key={f.label} onClick={() => setSyncFilter(f.label)} style={{ padding: '0.35rem 0.85rem', borderRadius: '999px', fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s', whiteSpace: 'nowrap', background: syncFilter === f.label ? 'rgba(160,100,255,0.2)' : 'rgba(255,255,255,0.05)', border: syncFilter === f.label ? '1px solid rgba(160,100,255,0.5)' : '1px solid rgba(255,255,255,0.1)', color: syncFilter === f.label ? 'rgba(220,190,255,0.95)' : 'rgba(220,200,255,0.7)' }}>{f.label}</button>
              ))}
              <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#c9a84c' }} />
                <span style={{ fontSize: '0.65rem', color: 'rgba(220,200,255,0.4)' }}>75%+ High</span>
              </div>
            </div>

            {loading && (
              <div style={{ textAlign: 'center', padding: '3rem', color: 'rgba(220,200,255,0.5)' }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>◎</div>
                <p style={{ fontSize: '0.85rem' }}>Scanning for harmonic souls...</p>
              </div>
            )}

            {!loading && filteredSync.length > 0 && (
              <div>
                <p style={{ fontSize: '0.7rem', color: 'rgba(220,200,255,0.4)', marginBottom: '1rem', textAlign: 'center' }}>{filteredSync.length} soul{filteredSync.length !== 1 ? 's' : ''} in alignment — tap a card to expand</p>
                {filteredSync.map(match => <SyncCard key={match.id} match={match} />)}
              </div>
            )}

            {!loading && filteredSync.length === 0 && (
              <div style={{ textAlign: 'center', padding: '3rem', color: 'rgba(220,200,255,0.5)' }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>◎</div>
                <p style={{ fontSize: '0.85rem' }}>No matches for this filter</p>
                <p style={{ fontSize: '0.75rem', marginTop: '0.4rem' }}>Log more angel numbers to find your soul matches</p>
              </div>
            )}

            {!loading && (
              <div style={{ marginTop: '1.5rem', padding: '0.75rem 1rem', background: 'rgba(155,89,182,0.06)', border: '1px solid rgba(155,89,182,0.15)', borderRadius: '0.75rem', textAlign: 'center' }}>
                <p style={{ fontSize: '0.7rem', color: 'rgba(220,200,255,0.5)', margin: 0 }}>Demo matches — connect Supabase for real-time soul sync</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
