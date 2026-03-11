'use client'
import { useState, useEffect, useRef, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'

type Circle = {
  id: string
  name: string
  description: string
  emoji: string
  color: string
  members: number
  angelNumber: string
  category: string
  isJoined: boolean
  isPrivate: boolean
  recentActivity: string
}

type Message = {
  id: string
  author: string
  authorId: string
  text: string
  time: string
  angelNumber?: string
  isOwn?: boolean
}

const CIRCLES: Circle[] = [
  { id:'1111', name:'1111 Portal Keepers', description:'For those who see 1111 daily and feel the portal energy. Share your experiences, synchronicities, and breakthroughs.', emoji:'🌀', color:'#a78bfa', members:847, angelNumber:'1111', category:'Number', isJoined:true, isPrivate:false, recentActivity:'2 min ago' },
  { id:'twin', name:'Twin Flame Seekers', description:'A sacred space for those on the twin flame journey. Share signs, synchronicities, and support each other.', emoji:'🔥', color:'#f472b6', members:1203, angelNumber:'1212', category:'Relationship', isJoined:true, isPrivate:false, recentActivity:'8 min ago' },
  { id:'555', name:'555 Change Agents', description:'Embracing transformation together. 555 is the number of change — share your transitions and new beginnings.', emoji:'⚡', color:'#60a5fa', members:562, angelNumber:'555', category:'Number', isJoined:false, isPrivate:false, recentActivity:'45 min ago' },
  { id:'777', name:'Sacred Geometry Circle', description:'Exploring the divine mathematics behind angel numbers, sacred geometry, and cosmic patterns.', emoji:'✶', color:'#c9a84c', members:389, angelNumber:'777', category:'Study', isJoined:false, isPrivate:false, recentActivity:'3 hr ago' },
  { id:'999', name:'Lightworkers United', description:'A private circle for dedicated lightworkers. Share your mission, tools, and support each other in the work.', emoji:'✨', color:'#4ade80', members:234, angelNumber:'999', category:'Mission', isJoined:false, isPrivate:true, recentActivity:'1 hr ago' },
  { id:'333', name:'333 Ascension Path', description:'For those experiencing rapid spiritual awakening and seeing 333 as confirmation.', emoji:'🌟', color:'#f97316', members:678, angelNumber:'333', category:'Number', isJoined:false, isPrivate:false, recentActivity:'30 min ago' },
]

const SEED_MESSAGES: Record<string, Message[]> = {
  '1111': [
    { id:'s1', author:'Luna M.', authorId:'seed1', text:'Saw 1111 three times today — once on a receipt, once on a license plate, and once when I woke up at 11:11 PM. Something big is shifting.', time:'5 min ago', angelNumber:'1111' },
    { id:'s2', author:'Orion S.', authorId:'seed2', text:'The 1111 portal feels especially strong this week. Anyone else feeling the acceleration?', time:'1 hr ago' },
    { id:'s3', author:'Celeste V.', authorId:'seed3', text:'Every time I see 1111 I make a wish. Today I wished for my highest timeline. ✨', time:'2 hr ago', angelNumber:'1111' },
  ],
  'twin': [
    { id:'t1', author:'Sage R.', authorId:'seed4', text:'My twin and I both logged 1212 within 10 minutes of each other yesterday without knowing. The synchronicities are undeniable.', time:'20 min ago', angelNumber:'1212' },
    { id:'t2', author:'River T.', authorId:'seed5', text:'Runner/chaser dynamic is so real. Sending love to everyone in separation right now. 💜', time:'3 hr ago' },
  ],
  '555': [
    { id:'f1', author:'Phoenix A.', authorId:'seed6', text:'Left my corporate job today after seeing 555 every day for 3 weeks. Terrified and exhilarated. The universe is pushing me.', time:'2 hr ago', angelNumber:'555' },
  ],
}

export default function CirclesPage() {
  const [circles, setCircles] = useState<Circle[]>(CIRCLES)
  const [selected, setSelected] = useState<Circle | null>(null)
  const [filter, setFilter] = useState<string>('all')
  const [messages, setMessages] = useState<Message[]>([])
  const [newMsg, setNewMsg] = useState('')
  const [sending, setSending] = useState(false)
  const [myName, setMyName] = useState('You')
  const [myId, setMyId] = useState('')
  const [loadingMsgs, setLoadingMsgs] = useState(false)
  const [liveCount, setLiveCount] = useState(0)
  const bottomRef = useRef<HTMLDivElement>(null)
  const channelRef = useRef<ReturnType<ReturnType<typeof createClient>['channel']> | null>(null)

  useEffect(() => {
    // Load user info
    try {
      const p = JSON.parse(localStorage.getItem('synchrosoul_social_profile') || '{}')
      if (p.displayName) setMyName(p.displayName)
    } catch {}
    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) setMyId(user.id)
    })
  }, [])

  const loadMessages = useCallback(async (circle: Circle) => {
    setLoadingMsgs(true)
    const seed = SEED_MESSAGES[circle.id] || []
    try {
      const supabase = createClient()
      const { data } = await supabase
        .from('circle_messages')
        .select('id, user_id, content, angel_number, created_at, author_name')
        .eq('circle_id', circle.id)
        .order('created_at', { ascending: true })
        .limit(50)

      if (data && data.length > 0) {
        const { data: { user } } = await supabase.auth.getUser()
        const realMsgs: Message[] = data.map(m => ({
          id: m.id,
          author: m.author_name || 'Cosmic Soul',
          authorId: m.user_id,
          text: m.content,
          time: new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          angelNumber: m.angel_number,
          isOwn: m.user_id === user?.id,
        }))
        setLiveCount(realMsgs.length)
        setMessages([...seed, ...realMsgs])
      } else {
        setLiveCount(0)
        setMessages(seed)
      }
    } catch {
      setMessages(seed)
    }
    setLoadingMsgs(false)
  }, [])

  const subscribeToCircle = useCallback((circle: Circle) => {
    const supabase = createClient()
    if (channelRef.current) supabase.removeChannel(channelRef.current)
    const channel = supabase
      .channel('circle-' + circle.id)
      .on('postgres_changes', {
        event: 'INSERT', schema: 'public', table: 'circle_messages',
        filter: 'circle_id=eq.' + circle.id,
      }, async (payload) => {
        const m = payload.new as { id: string; user_id: string; content: string; angel_number: string; created_at: string; author_name: string }
        const { data: { user } } = await supabase.auth.getUser()
        const newMessage: Message = {
          id: m.id,
          author: m.author_name || 'Cosmic Soul',
          authorId: m.user_id,
          text: m.content,
          time: new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          angelNumber: m.angel_number,
          isOwn: m.user_id === user?.id,
        }
        setMessages(prev => [...prev, newMessage])
        setLiveCount(c => c + 1)
      })
      .subscribe()
    channelRef.current = channel
  }, [])

  useEffect(() => {
    if (selected) {
      loadMessages(selected)
      subscribeToCircle(selected)
    }
    return () => {
      if (channelRef.current) {
        const supabase = createClient()
        supabase.removeChannel(channelRef.current)
      }
    }
  }, [selected, loadMessages, subscribeToCircle])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const joinCircle = (circle: Circle) => {
    setCircles(prev => prev.map(c => c.id === circle.id ? { ...c, isJoined: true, members: c.members + 1 } : c))
    setSelected({ ...circle, isJoined: true })
  }

  const sendMessage = async () => {
    if (!newMsg.trim() || sending) return
    setSending(true)
    const text = newMsg.trim()
    setNewMsg('')
    const angelMatch = text.match(/\b(111|222|333|444|555|666|777|888|999|1111|1212|1234)\b/)
    const angelNum = angelMatch ? angelMatch[0] : undefined

    // Optimistic update
    const tempMsg: Message = {
      id: 'temp-' + Date.now(),
      author: myName,
      authorId: myId || 'local',
      text,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      angelNumber: angelNum,
      isOwn: true,
    }
    setMessages(prev => [...prev, tempMsg])

    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (user && selected) {
        await supabase.from('circle_messages').insert({
          circle_id: selected.id,
          user_id: user.id,
          author_name: myName,
          content: text,
          angel_number: angelNum || null,
        })
      }
    } catch (e) {
      console.error('Send message error:', e)
    }
    setSending(false)
  }

  const filtered = filter === 'all' ? circles : filter === 'joined' ? circles.filter(c => c.isJoined) : circles.filter(c => c.category === filter)

  if (selected) {
    return (
      <div style={{ maxWidth: '480px', margin: '0 auto', display: 'flex', flexDirection: 'column', height: 'calc(100vh - 4.5rem)' }}>
        {/* Chat header */}
        <div style={{ padding: '1rem', background: 'rgba(8,6,28,0.92)', borderBottom: '1px solid rgba(200,180,255,0.08)', display: 'flex', alignItems: 'center', gap: '0.75rem', flexShrink: 0 }}>
          <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', color: 'rgba(180,160,255,0.6)', fontSize: '1.2rem', cursor: 'pointer', padding: '0.25rem' }}>←</button>
          <div style={{ width: '2.5rem', height: '2.5rem', borderRadius: '50%', background: selected.color + '20', border: '1px solid ' + selected.color + '40', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', flexShrink: 0 }}>{selected.emoji}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ color: 'rgba(220,200,255,0.9)', fontSize: '0.95rem', fontWeight: 500 }}>{selected.name}</div>
            <div style={{ color: 'rgba(180,160,255,0.45)', fontSize: '0.7rem' }}>{selected.members.toLocaleString()} members{liveCount > 0 ? ' • ' + liveCount + ' live messages' : ''}</div>
          </div>
          {liveCount > 0 && <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#4ade80', flexShrink: 0 }} />}
        </div>

        {/* Messages */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {loadingMsgs ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: 'rgba(180,160,255,0.4)', fontSize: '0.85rem' }}>Loading messages...</div>
          ) : messages.map(msg => (
            <div key={msg.id} style={{ display: 'flex', flexDirection: 'column', alignItems: msg.isOwn ? 'flex-end' : 'flex-start' }}>
              {!msg.isOwn && <div style={{ fontSize: '0.65rem', color: 'rgba(180,160,255,0.45)', marginBottom: '0.2rem', paddingLeft: '0.5rem' }}>{msg.author}</div>}
              <div style={{
                maxWidth: '80%', padding: '0.75rem 1rem', borderRadius: msg.isOwn ? '1rem 1rem 0.25rem 1rem' : '1rem 1rem 1rem 0.25rem',
                background: msg.isOwn ? 'linear-gradient(135deg, rgba(124,58,237,0.4), rgba(167,139,250,0.3))' : 'rgba(255,255,255,0.05)',
                border: msg.isOwn ? '1px solid rgba(167,139,250,0.3)' : '1px solid rgba(255,255,255,0.08)',
              }}>
                <p style={{ color: 'rgba(220,200,255,0.9)', fontSize: '0.875rem', lineHeight: 1.5, margin: 0 }}>{msg.text}</p>
                {msg.angelNumber && (
                  <span style={{ display: 'inline-block', marginTop: '0.4rem', fontSize: '0.65rem', background: 'rgba(167,139,250,0.15)', border: '1px solid rgba(167,139,250,0.25)', borderRadius: '9999px', padding: '0.1rem 0.5rem', color: 'rgba(200,180,255,0.7)' }}>{msg.angelNumber}</span>
                )}
              </div>
              <div style={{ fontSize: '0.6rem', color: 'rgba(180,160,255,0.3)', marginTop: '0.2rem', paddingLeft: msg.isOwn ? 0 : '0.5rem', paddingRight: msg.isOwn ? '0.5rem' : 0 }}>{msg.time}</div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        {/* Input */}
        {selected.isJoined ? (
          <div style={{ padding: '0.75rem 1rem', background: 'rgba(8,6,28,0.92)', borderTop: '1px solid rgba(200,180,255,0.08)', display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
            <input
              value={newMsg}
              onChange={e => setNewMsg(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && !e.shiftKey && sendMessage()}
              placeholder="Share your cosmic message..."
              style={{ flex: 1, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(200,180,255,0.15)', borderRadius: '1.5rem', color: 'rgba(220,200,255,0.9)', fontSize: '0.875rem', padding: '0.625rem 1rem', outline: 'none' }}
            />
            <button
              onClick={sendMessage}
              disabled={!newMsg.trim() || sending}
              style={{ width: '2.5rem', height: '2.5rem', borderRadius: '50%', background: newMsg.trim() ? 'linear-gradient(135deg, #7c3aed, #a78bfa)' : 'rgba(167,139,250,0.1)', border: 'none', color: 'white', fontSize: '1rem', cursor: newMsg.trim() ? 'pointer' : 'not-allowed', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
            >↑</button>
          </div>
        ) : (
          <div style={{ padding: '1rem', background: 'rgba(8,6,28,0.92)', borderTop: '1px solid rgba(200,180,255,0.08)', flexShrink: 0 }}>
            <button onClick={() => joinCircle(selected)} style={{ width: '100%', background: 'linear-gradient(135deg, #7c3aed, #a78bfa)', border: 'none', borderRadius: '0.875rem', color: 'white', fontSize: '0.9rem', fontWeight: 500, padding: '0.875rem', cursor: 'pointer' }}>Join Circle to Chat ✨</button>
          </div>
        )}
      </div>
    )
  }

  return (
    <div style={{ maxWidth: '480px', margin: '0 auto', padding: '1.5rem 1rem 2rem' }}>
      <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
        <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🧿</div>
        <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.8rem', fontWeight: 300, color: 'rgba(220,200,255,0.95)', marginBottom: '0.25rem' }}>Angel Circles</h1>
        <p style={{ color: 'rgba(180,160,255,0.5)', fontSize: '0.8rem' }}>Sacred communities for every frequency</p>
      </div>

      {/* Filter chips */}
      <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '1.25rem', overflowX: 'auto', paddingBottom: '0.25rem' }}>
        {['all', 'joined', 'Number', 'Relationship', 'Study', 'Mission'].map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{ flexShrink: 0, padding: '0.35rem 0.875rem', borderRadius: '9999px', border: 'none', cursor: 'pointer', background: filter === f ? 'rgba(167,139,250,0.2)' : 'rgba(255,255,255,0.04)', color: filter === f ? 'rgba(220,200,255,0.9)' : 'rgba(180,160,255,0.45)', fontSize: '0.75rem', fontWeight: filter === f ? 600 : 400, textTransform: 'capitalize' }}>{f}</button>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {filtered.map(circle => (
          <div key={circle.id} onClick={() => setSelected(circle)} style={{ background: 'rgba(8,6,28,0.88)', border: '1px solid rgba(200,180,255,0.1)', borderRadius: '1.25rem', padding: '1rem 1.25rem', cursor: 'pointer', transition: 'all 0.2s' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
              <div style={{ width: '3rem', height: '3rem', borderRadius: '50%', background: circle.color + '18', border: '1px solid ' + circle.color + '35', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', flexShrink: 0 }}>{circle.emoji}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                  <span style={{ color: 'rgba(220,200,255,0.9)', fontSize: '0.95rem', fontWeight: 500 }}>{circle.name}</span>
                  {circle.isJoined && <span style={{ fontSize: '0.6rem', background: 'rgba(74,222,128,0.1)', border: '1px solid rgba(74,222,128,0.25)', borderRadius: '9999px', padding: '0.1rem 0.4rem', color: 'rgba(134,239,172,0.8)' }}>Joined</span>}
                  {circle.isPrivate && <span style={{ fontSize: '0.6rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '9999px', padding: '0.1rem 0.4rem', color: 'rgba(180,160,255,0.4)' }}>Private</span>}
                </div>
                <p style={{ color: 'rgba(180,160,255,0.55)', fontSize: '0.78rem', lineHeight: 1.4, margin: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{circle.description}</p>
              </div>
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <div style={{ color: circle.color, fontSize: '0.85rem', fontFamily: 'Cormorant Garamond, serif' }}>{circle.angelNumber}</div>
                <div style={{ color: 'rgba(180,160,255,0.35)', fontSize: '0.65rem' }}>{circle.members.toLocaleString()}</div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
