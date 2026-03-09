'use client'
import { useState, useEffect } from 'react'

interface Circle {
  id: string
  name: string
  emoji: string
  description: string
  number: string
  members: number
  posts: CirclePost[]
  joined: boolean
  createdAt: string
}

interface CirclePost {
  id: string
  author: string
  content: string
  number: string
  timestamp: string
  resonates: number
}

const CIRCLES_KEY = 'synchrosoul_circles'
const DEFAULT_CIRCLES: Circle[] = [
  { id: 'c1111', name: '1111 Portal Keepers', emoji: '🌟', description: 'For those who see 1111 constantly. New beginnings, manifestation, and awakening.', number: '1111', members: 2847, posts: [], joined: false, createdAt: new Date().toISOString() },
  { id: 'c333', name: '333 Trinity Circle', emoji: '🔺', description: 'Ascended masters are near. Creative expression and divine guidance.', number: '333', members: 1923, posts: [], joined: false, createdAt: new Date().toISOString() },
  { id: 'c444', name: '444 Foundation Builders', emoji: '🏛️', description: 'Angels surround you. Protection, stability, and divine support.', number: '444', members: 3102, posts: [], joined: false, createdAt: new Date().toISOString() },
  { id: 'c555', name: '555 Change Agents', emoji: '🌀', description: 'Major transformation incoming. Embrace the shift with fellow travelers.', number: '555', members: 2156, posts: [], joined: false, createdAt: new Date().toISOString() },
  { id: 'c777', name: '777 Mystic Path', emoji: '🔮', description: 'Spiritual awakening and divine luck. Deep seekers of cosmic truth.', number: '777', members: 1678, posts: [], joined: false, createdAt: new Date().toISOString() },
  { id: 'c888', name: '888 Abundance Flow', emoji: '♾️', description: 'Infinite abundance and financial alignment. Manifestors of material reality.', number: '888', members: 2341, posts: [], joined: false, createdAt: new Date().toISOString() },
  { id: 'c999', name: '999 Completion Council', emoji: '🌙', description: 'Endings and new cycles. Old souls completing karmic lessons.', number: '999', members: 1445, posts: [], joined: false, createdAt: new Date().toISOString() },
  { id: 'c222', name: '222 Balance Seekers', emoji: '⚖️', description: 'Divine timing and partnership. Trust the process together.', number: '222', members: 1889, posts: [], joined: false, createdAt: new Date().toISOString() },
]

const DEMO_POSTS: Record<string, CirclePost[]> = {
  c1111: [
    { id: 'p1', author: 'StarSeed_Maya', content: 'Saw 1111 three times today — on my phone, a receipt, and a license plate. Something big is coming 🌟', number: '1111', timestamp: new Date(Date.now() - 3600000).toISOString(), resonates: 47 },
    { id: 'p2', author: 'CosmicWanderer', content: 'Every time I see 1111 I make a wish. Today I wished for clarity on my life purpose. What do you wish for?', number: '1111', timestamp: new Date(Date.now() - 7200000).toISOString(), resonates: 83 },
    { id: 'p3', author: 'LightWorker_J', content: 'The 1111 portal is especially strong this week. I can feel the energy shift. Anyone else?', number: '1111', timestamp: new Date(Date.now() - 14400000).toISOString(), resonates: 124 },
  ],
  c333: [
    { id: 'p4', author: 'AscendedSoul', content: '333 showed up during my meditation today. The masters are definitely speaking 🔺', number: '333', timestamp: new Date(Date.now() - 5400000).toISOString(), resonates: 62 },
    { id: 'p5', author: 'DivineChannel', content: 'I see 333 whenever I am about to make a creative decision. It is like cosmic confirmation!', number: '333', timestamp: new Date(Date.now() - 10800000).toISOString(), resonates: 91 },
  ],
  c444: [
    { id: 'p6', author: 'AngelGuided', content: 'Woke up at 4:44 AM feeling completely at peace. The angels were definitely watching over me 🏛️', number: '444', timestamp: new Date(Date.now() - 2700000).toISOString(), resonates: 156 },
  ],
  c555: [
    { id: 'p7', author: 'TransformSoul', content: 'Quit my job today after seeing 555 for 30 days straight. Trusting the universe completely 🌀', number: '555', timestamp: new Date(Date.now() - 1800000).toISOString(), resonates: 203 },
  ],
  c777: [
    { id: 'p8', author: 'MysticPath7', content: 'Won a small lottery AND got a job offer on the same day I saw 777. Coincidence? I think not 🔮', number: '777', timestamp: new Date(Date.now() - 9000000).toISOString(), resonates: 178 },
  ],
}

function timeAgo(ts: string) {
  const diff = Date.now() - new Date(ts).getTime()
  const h = Math.floor(diff / 3600000)
  const m = Math.floor(diff / 60000)
  if (h > 23) return Math.floor(h/24) + 'd ago'
  if (h > 0) return h + 'h ago'
  return m + 'm ago'
}

export default function CirclesPage() {
  const [circles, setCircles] = useState<Circle[]>([])
  const [active, setActive] = useState<Circle|null>(null)
  const [newPost, setNewPost] = useState('')
  const [posting, setPosting] = useState(false)
  const [tab, setTab] = useState<'discover'|'joined'>('discover')

  useEffect(() => {
    const saved = localStorage.getItem(CIRCLES_KEY)
    const base = saved ? JSON.parse(saved) : DEFAULT_CIRCLES
    // Merge demo posts
    const merged = base.map((c: Circle) => ({
      ...c,
      posts: c.posts.length ? c.posts : (DEMO_POSTS[c.id] || [])
    }))
    setCircles(merged)
  }, [])

  function save(updated: Circle[]) {
    setCircles(updated)
    localStorage.setItem(CIRCLES_KEY, JSON.stringify(updated))
  }

  function toggleJoin(id: string) {
    const updated = circles.map(c => c.id === id ? { ...c, joined: !c.joined, members: c.joined ? c.members - 1 : c.members + 1 } : c)
    save(updated)
    if (active?.id === id) setActive(updated.find(c => c.id === id) || null)
  }

  function handlePost() {
    if (!newPost.trim() || !active) return
    setPosting(true)
    const post: CirclePost = { id: Date.now().toString(), author: 'You', content: newPost.trim(), number: active.number, timestamp: new Date().toISOString(), resonates: 0 }
    const updated = circles.map(c => c.id === active.id ? { ...c, posts: [post, ...c.posts] } : c)
    save(updated)
    setActive(updated.find(c => c.id === active.id) || null)
    setNewPost('')
    setPosting(false)
  }

  function resonate(circleId: string, postId: string) {
    const updated = circles.map(c => c.id === circleId ? { ...c, posts: c.posts.map(p => p.id === postId ? { ...p, resonates: p.resonates + 1 } : p) } : c)
    save(updated)
    if (active?.id === circleId) setActive(updated.find(c => c.id === circleId) || null)
  }

  const card: React.CSSProperties = { background: 'rgba(8,6,28,0.88)', border: '1px solid rgba(200,180,255,0.12)', borderRadius: '1.25rem', backdropFilter: 'blur(12px)' }
  const visible = tab === 'joined' ? circles.filter(c => c.joined) : circles

  if (active) return (
    <div style={{ maxWidth: '520px', margin: '0 auto', padding: '1.5rem 1rem 2rem' }}>
      <button onClick={() => setActive(null)} style={{ background: 'none', border: 'none', color: 'rgba(180,160,255,0.5)', cursor: 'pointer', fontSize: '0.8rem', marginBottom: '1rem', padding: 0, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>← Back to Circles</button>
      <div style={{ ...card, padding: '1.25rem', marginBottom: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div style={{ display: 'flex', gap: '0.875rem', alignItems: 'center' }}>
            <span style={{ fontSize: '2rem' }}>{active.emoji}</span>
            <div>
              <div style={{ color: 'rgba(220,200,255,0.9)', fontWeight: 700, fontSize: '1rem' }}>{active.name}</div>
              <div style={{ color: 'rgba(180,160,255,0.4)', fontSize: '0.72rem', marginTop: '0.15rem' }}>{active.members.toLocaleString()} members</div>
            </div>
          </div>
          <button onClick={() => toggleJoin(active.id)} style={{ padding: '0.4rem 0.875rem', borderRadius: '2rem', border: active.joined ? '1px solid rgba(244,114,182,0.4)' : '1px solid rgba(201,168,76,0.4)', background: active.joined ? 'rgba(244,114,182,0.1)' : 'rgba(201,168,76,0.15)', color: active.joined ? '#f472b6' : '#c9a84c', fontSize: '0.75rem', cursor: 'pointer' }}>{active.joined ? 'Leave' : 'Join'}</button>
        </div>
        <p style={{ color: 'rgba(180,160,255,0.55)', fontSize: '0.8rem', lineHeight: 1.6, margin: '0.75rem 0 0', fontFamily: 'Cormorant Garamond, serif', fontStyle: 'italic' }}>{active.description}</p>
      </div>

      {/* Post composer */}
      {active.joined && (
        <div style={{ ...card, padding: '1rem', marginBottom: '1rem' }}>
          <textarea value={newPost} onChange={e => setNewPost(e.target.value)} placeholder={`Share your ${active.number} experience...`} rows={3} style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(200,180,255,0.12)', borderRadius: '0.75rem', padding: '0.75rem', color: 'rgba(220,200,255,0.9)', fontSize: '0.85rem', resize: 'none', outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit' }} />
          <button onClick={handlePost} disabled={!newPost.trim() || posting} style={{ marginTop: '0.625rem', padding: '0.5rem 1.25rem', borderRadius: '2rem', border: '1px solid rgba(201,168,76,0.4)', background: 'rgba(201,168,76,0.15)', color: '#c9a84c', fontSize: '0.8rem', cursor: 'pointer', opacity: newPost.trim() ? 1 : 0.4 }}>✦ Share</button>
        </div>
      )}

      {/* Posts */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {active.posts.length === 0 && (
          <div style={{ textAlign: 'center', padding: '2rem', color: 'rgba(180,160,255,0.3)', fontSize: '0.85rem' }}>No posts yet. {active.joined ? 'Be the first to share!' : 'Join to post.'}</div>
        )}
        {active.posts.map(post => (
          <div key={post.id} style={{ ...card, padding: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: 'linear-gradient(135deg, rgba(167,139,250,0.4), rgba(201,168,76,0.4))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.65rem', color: 'rgba(220,200,255,0.7)', fontWeight: 700 }}>{post.author[0]}</div>
                <span style={{ color: 'rgba(220,200,255,0.7)', fontSize: '0.78rem', fontWeight: 600 }}>{post.author}</span>
              </div>
              <span style={{ color: 'rgba(180,160,255,0.3)', fontSize: '0.68rem' }}>{timeAgo(post.timestamp)}</span>
            </div>
            <p style={{ color: 'rgba(200,180,255,0.75)', fontSize: '0.85rem', lineHeight: 1.6, margin: '0 0 0.625rem' }}>{post.content}</p>
            <button onClick={() => resonate(active.id, post.id)} style={{ background: 'none', border: '1px solid rgba(200,180,255,0.12)', borderRadius: '2rem', padding: '0.25rem 0.625rem', color: 'rgba(180,160,255,0.5)', fontSize: '0.72rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>✦ {post.resonates} resonate</button>
          </div>
        ))}
      </div>
    </div>
  )

  return (
    <div style={{ maxWidth: '520px', margin: '0 auto', padding: '1.5rem 1rem 2rem' }}>
      <div style={{ marginBottom: '1.25rem' }}>
        <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.8rem', color: 'rgba(220,200,255,0.95)', margin: '0 0 0.25rem', fontWeight: 400 }}>Angel Circles</h1>
        <p style={{ color: 'rgba(180,160,255,0.5)', fontSize: '0.8rem', margin: 0 }}>Private communities for each sacred number</p>
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem' }}>
        {(['discover','joined'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)} style={{ flex: 1, padding: '0.45rem', borderRadius: '2rem', border: tab===t ? '1px solid rgba(201,168,76,0.6)' : '1px solid rgba(200,180,255,0.12)', background: tab===t ? 'rgba(201,168,76,0.15)' : 'rgba(8,6,28,0.6)', color: tab===t ? '#c9a84c' : 'rgba(180,160,255,0.4)', fontSize: '0.75rem', cursor: 'pointer', textTransform: 'capitalize', letterSpacing: '0.05em' }}>{t === 'joined' ? `Joined (${circles.filter(c=>c.joined).length})` : 'Discover'}</button>
        ))}
      </div>

      {visible.length === 0 && tab === 'joined' && (
        <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'rgba(180,160,255,0.3)', fontSize: '0.85rem' }}>You haven't joined any circles yet.<br/>Discover circles below and join your number tribe!</div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {visible.map(c => (
          <div key={c.id} style={{ ...card, padding: '1.1rem', cursor: 'pointer', transition: 'all 0.2s', borderColor: c.joined ? 'rgba(201,168,76,0.25)' : 'rgba(200,180,255,0.12)' }} onClick={() => setActive(c)}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', gap: '0.875rem', alignItems: 'center' }}>
                <span style={{ fontSize: '1.75rem' }}>{c.emoji}</span>
                <div>
                  <div style={{ color: 'rgba(220,200,255,0.9)', fontWeight: 600, fontSize: '0.9rem' }}>{c.name}</div>
                  <div style={{ color: 'rgba(180,160,255,0.4)', fontSize: '0.7rem', marginTop: '0.15rem' }}>{c.members.toLocaleString()} members · {(DEMO_POSTS[c.id]||[]).length + c.posts.filter(p=>p.author==='You').length} posts</div>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.35rem' }}>
                {c.joined && <span style={{ fontSize: '0.6rem', color: '#c9a84c', background: 'rgba(201,168,76,0.12)', border: '1px solid rgba(201,168,76,0.25)', borderRadius: '2rem', padding: '0.15rem 0.5rem', letterSpacing: '0.08em' }}>JOINED</span>}
                <span style={{ color: 'rgba(180,160,255,0.25)', fontSize: '0.75rem' }}>→</span>
              </div>
            </div>
            <p style={{ color: 'rgba(180,160,255,0.5)', fontSize: '0.78rem', lineHeight: 1.5, margin: '0.625rem 0 0', fontFamily: 'Cormorant Garamond, serif', fontStyle: 'italic' }}>{c.description}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
