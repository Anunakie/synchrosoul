'use client'
import { useState, useEffect } from 'react'
import { getMockFeedPosts, getPosts, toggleResonate, deletePost, updatePost, SocialPost } from '@/lib/social-storage'
import { getLogs } from '@/lib/storage'

function getTimeAgo(iso: string): string {
  const mins = Math.floor((Date.now() - new Date(iso).getTime()) / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return mins + 'm ago'
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return hrs + 'h ago'
  return Math.floor(hrs / 24) + 'd ago'
}

function PostCard({
  post,
  onResonate,
  onDelete,
  onUpdate,
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

  const handleCancel = () => {
    setEditContent(post.content)
    setEditNumber(post.angelNumber || '')
    setEditing(false)
  }

  return (
    <div style={{
      background: 'rgba(255,255,255,0.03)',
      border: editing ? '1px solid rgba(201,168,76,0.35)' : '1px solid rgba(255,255,255,0.08)',
      borderRadius: '1rem',
      padding: '1rem',
      marginBottom: '0.75rem',
      transition: 'border-color 0.2s',
    }}>
      {/* Author row */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.75rem' }}>
        <div style={{
          width: 40, height: 40, borderRadius: '50%',
          background: post.authorColor + '33',
          border: '2px solid ' + post.authorColor,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '0.8rem', fontWeight: 700, color: post.authorColor, flexShrink: 0
        }}>
          {post.authorAvatar}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
            <span style={{ fontWeight: 600, fontSize: '0.88rem', color: '#f0e6ff' }}>{post.authorName}</span>
            {post.lifePathNumber && (
              <span style={{ fontSize: '0.65rem', padding: '0.1rem 0.4rem', borderRadius: '999px', background: 'rgba(155,89,182,0.15)', border: '1px solid rgba(155,89,182,0.3)', color: '#9b59b6' }}>LP {post.lifePathNumber}</span>
            )}
            {post.isOwn && (
              <span style={{ fontSize: '0.65rem', padding: '0.1rem 0.4rem', borderRadius: '999px', background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.2)', color: '#c9a84c' }}>you</span>
            )}
          </div>
          <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.3)' }}>{getTimeAgo(post.createdAt)}</span>
        </div>
        {!editing && post.angelNumber && (
          <div style={{
            padding: '0.25rem 0.6rem', borderRadius: '999px',
            background: 'rgba(201,168,76,0.12)',
            border: '1px solid rgba(201,168,76,0.35)',
            color: '#c9a84c', fontSize: '0.78rem', fontWeight: 700,
            letterSpacing: '0.05em'
          }}>{post.angelNumber}</div>
        )}
      </div>

      {/* Edit mode */}
      {editing ? (
        <div style={{ marginBottom: '0.75rem' }}>
          <textarea
            value={editContent}
            onChange={e => setEditContent(e.target.value)}
            rows={3}
            style={{
              width: '100%', boxSizing: 'border-box',
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(201,168,76,0.3)',
              borderRadius: '0.6rem',
              padding: '0.6rem 0.75rem',
              color: '#f0e6ff', fontSize: '0.9rem', lineHeight: '1.6',
              resize: 'vertical', outline: 'none',
              fontFamily: 'inherit'
            }}
          />
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
            <input
              type="text"
              value={editNumber}
              onChange={e => setEditNumber(e.target.value)}
              placeholder="Angel number (e.g. 1111)"
              style={{
                flex: 1, minWidth: 120,
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: '0.5rem',
                padding: '0.4rem 0.6rem',
                color: '#c9a84c', fontSize: '0.8rem',
                outline: 'none', fontFamily: 'inherit'
              }}
            />
            <button
              onClick={handleSave}
              style={{
                padding: '0.4rem 1rem', borderRadius: '999px',
                background: 'rgba(201,168,76,0.2)',
                border: '1px solid rgba(201,168,76,0.5)',
                color: '#c9a84c', fontSize: '0.78rem', fontWeight: 600,
                cursor: 'pointer'
              }}
            >Save</button>
            <button
              onClick={handleCancel}
              style={{
                padding: '0.4rem 0.75rem', borderRadius: '999px',
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: 'rgba(255,255,255,0.45)', fontSize: '0.78rem',
                cursor: 'pointer'
              }}
            >Cancel</button>
          </div>
        </div>
      ) : (
        <p style={{ margin: '0 0 0.75rem', fontSize: '0.9rem', color: 'rgba(255,255,255,0.82)', lineHeight: '1.6' }}>
          {post.content}
        </p>
      )}

      {/* Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
        <button
          onClick={() => onResonate(post.id)}
          style={{
            display: 'flex', alignItems: 'center', gap: '0.35rem',
            padding: '0.3rem 0.75rem', borderRadius: '999px',
            background: resonated ? 'rgba(201,168,76,0.15)' : 'rgba(255,255,255,0.04)',
            border: resonated ? '1px solid rgba(201,168,76,0.4)' : '1px solid rgba(255,255,255,0.08)',
            color: resonated ? '#c9a84c' : 'rgba(255,255,255,0.4)',
            fontSize: '0.78rem', fontWeight: resonated ? 600 : 400,
            cursor: 'pointer', transition: 'all 0.2s'
          }}
        >
          <span>✦</span>
          <span>Resonate</span>
          {post.resonates > 0 && <span style={{ opacity: 0.7 }}>{post.resonates}</span>}
        </button>

        {post.isOwn && !editing && (
          <>
            <button
              onClick={() => setEditing(true)}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.3rem',
                padding: '0.3rem 0.75rem', borderRadius: '999px',
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                color: 'rgba(255,255,255,0.45)',
                fontSize: '0.78rem', cursor: 'pointer', transition: 'all 0.2s'
              }}
            >
              <span>✎</span><span>Edit</span>
            </button>
            <button
              onClick={() => onDelete(post.id)}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.3rem',
                padding: '0.3rem 0.75rem', borderRadius: '999px',
                background: 'rgba(231,76,60,0.06)',
                border: '1px solid rgba(231,76,60,0.2)',
                color: 'rgba(231,76,60,0.6)',
                fontSize: '0.78rem', cursor: 'pointer', transition: 'all 0.2s'
              }}
            >
              <span>✕</span><span>Delete</span>
            </button>
          </>
        )}
      </div>
    </div>
  )
}

export default function FeedPage() {
  const [posts, setPosts] = useState<SocialPost[]>([])
  const [userNumbers, setUserNumbers] = useState<string[]>([])
  const [filter, setFilter] = useState('All')
  const [loading, setLoading] = useState(true)
  const [numberFilters, setNumberFilters] = useState<string[]>([])

  useEffect(() => {
    const logs = getLogs()
    const nums = [...new Set(logs.map((l: any) => l.number))] as string[]
    setUserNumbers(nums)
    const ownPosts = getPosts()
    const mockPosts = getMockFeedPosts(nums)
    const all = [...ownPosts, ...mockPosts]
    const seen = new Set<string>()
    const merged = all.filter(p => { if (seen.has(p.id)) return false; seen.add(p.id); return true })
    merged.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    setPosts(merged)
    const nums2 = [...new Set(merged.map(p => p.angelNumber).filter(Boolean))] as string[]
    setNumberFilters(nums2.slice(0, 8))
    setTimeout(() => setLoading(false), 600)
  }, [])

  const handleResonate = (postId: string) => {
    toggleResonate(postId)
    setPosts(prev => prev.map(p => {
      if (p.id !== postId) return p
      const resonated = p.resonatedBy.includes('local_user')
      return {
        ...p,
        resonates: resonated ? p.resonates - 1 : p.resonates + 1,
        resonatedBy: resonated ? p.resonatedBy.filter(id => id !== 'local_user') : [...p.resonatedBy, 'local_user']
      }
    }))
  }

  const handleDelete = (postId: string) => {
    deletePost(postId)
    setPosts(prev => prev.filter(p => p.id !== postId))
  }

  const handleUpdate = (postId: string, content: string, angelNumber?: string) => {
    updatePost(postId, content, angelNumber)
    setPosts(prev => prev.map(p =>
      p.id === postId ? { ...p, content, angelNumber } : p
    ))
  }

  const filtered = posts.filter(p => {
    if (filter === 'All') return true
    if (filter === 'Synced') return userNumbers.includes(p.angelNumber || '')
    return p.angelNumber === filter
  })

  return (
    <div style={{ minHeight: '100vh', background: '#050510', color: '#f0e6ff', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ maxWidth: 640, margin: '0 auto', padding: '2rem 1rem 6rem' }}>

        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>✦</div>
          <h1 style={{ fontSize: '1.6rem', fontWeight: 700, background: 'linear-gradient(135deg, #c9a84c, #9b59b6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', margin: 0 }}>
            Cosmic Feed
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem', marginTop: '0.4rem' }}>
            Souls seeing your numbers
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '1.5rem', overflowX: 'auto', paddingBottom: '0.25rem' }}>
          {['All', 'Synced', ...numberFilters].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                padding: '0.35rem 0.85rem', borderRadius: '999px',
                fontSize: '0.78rem', fontWeight: 600,
                cursor: 'pointer', transition: 'all 0.2s', whiteSpace: 'nowrap', flexShrink: 0,
                background: filter === f ? 'rgba(201,168,76,0.2)' : 'rgba(255,255,255,0.05)',
                border: filter === f ? '1px solid rgba(201,168,76,0.5)' : '1px solid rgba(255,255,255,0.1)',
                color: filter === f ? '#c9a84c' : 'rgba(255,255,255,0.45)',
              }}
            >{f}</button>
          ))}
        </div>

        {loading && (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'rgba(255,255,255,0.3)' }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>✦</div>
            <p style={{ fontSize: '0.85rem' }}>Tuning into the cosmic frequency...</p>
          </div>
        )}

        {!loading && filtered.map(post => (
          <PostCard
            key={post.id}
            post={post}
            onResonate={handleResonate}
            onDelete={handleDelete}
            onUpdate={handleUpdate}
          />
        ))}

        {!loading && filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'rgba(255,255,255,0.25)' }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>✦</div>
            <p style={{ fontSize: '0.85rem' }}>No posts for this filter yet</p>
            <p style={{ fontSize: '0.75rem', marginTop: '0.4rem' }}>Log more numbers to see synced posts</p>
          </div>
        )}

        {!loading && (
          <div style={{ marginTop: '1.5rem', padding: '0.75rem 1rem', background: 'rgba(155,89,182,0.06)', border: '1px solid rgba(155,89,182,0.15)', borderRadius: '0.75rem', textAlign: 'center' }}>
            <p style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.3)', margin: 0 }}>
              Demo feed — connect Supabase for real-time posts from matched souls
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
