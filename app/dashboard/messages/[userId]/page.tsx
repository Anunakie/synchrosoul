'use client'
import { useState, useEffect, useRef, useCallback } from 'react'
import { useParams, useSearchParams, useRouter } from 'next/navigation'
import {
  getOrCreateConversation, getMessages, sendMessage,
  markMessagesRead, subscribeToMessages
} from '@/lib/messages'
import { getCurrentUserId } from '@/lib/supabase-db'
import { getNumerologyProfile } from '@/lib/storage'
import type { Message } from '@/lib/messages'

const ANGEL_NUMBERS = ['111','222','333','444','555','666','777','888','999','1111','1212','1234']

function Avatar({ name, image, size = 36 }: { name: string; image?: string; size?: number }) {
  const initials = name.split(' ').map((w:string) => w[0]).join('').slice(0,2).toUpperCase() || 'S'
  const colors = ['#7c3aed','#9333ea','#c026d3','#db2777','#0891b2','#0d9488']
  const color = colors[name.charCodeAt(0) % colors.length]
  if (image) return <img src={image} alt={name} style={{ width: size, height: size, borderRadius: '50%', objectFit: 'cover', border: '2px solid rgba(200,180,255,0.2)' }} />
  return (
    <div style={{ width: size, height: size, borderRadius: '50%', background: color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: size * 0.35, color: '#fff', fontWeight: 700, border: '2px solid rgba(200,180,255,0.2)', flexShrink: 0 }}>
      {initials}
    </div>
  )
}

export default function ChatPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const router = useRouter()
  const otherUserId = params.userId as string
  const otherName = decodeURIComponent(searchParams.get('name') || 'Soul')
  const presetConvId = searchParams.get('convId') || null

  const [myId, setMyId] = useState<string | null>(null)
  const [convId, setConvId] = useState<string | null>(presetConvId)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [angelTag, setAngelTag] = useState('')
  const [showAngelPicker, setShowAngelPicker] = useState(false)
  const [sending, setSending] = useState(false)
  const [loading, setLoading] = useState(true)
  const bottomRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const initConversation = useCallback(async () => {
    const uid = await getCurrentUserId()
    setMyId(uid)
    if (!uid) { setLoading(false); return }
    const profile = await getNumerologyProfile()
    const myName = (profile as any)?.name || (profile as any)?.displayName || 'Soul'
    const myAvatar = typeof window !== 'undefined' ? (localStorage.getItem('synchrosoul_avatar_image') || '') : ''
    let cid = convId
    if (!cid) {
      cid = await getOrCreateConversation(otherUserId, myName, myAvatar, otherName, '')
      if (cid) setConvId(cid)
    }
    if (cid) {
      const msgs = await getMessages(cid)
      setMessages(msgs)
      await markMessagesRead(cid)
    }
    setLoading(false)
  }, [otherUserId, otherName, convId])

  useEffect(() => {
    initConversation()
  }, [])

  useEffect(() => {
    if (!convId) return
    const unsub = subscribeToMessages(convId, (msg) => {
      setMessages(prev => {
        if (prev.find(m => m.id === msg.id)) return prev
        return [...prev, msg]
      })
      markMessagesRead(convId)
    })
    return unsub
  }, [convId])

  useEffect(() => { scrollToBottom() }, [messages])

  const handleSend = async () => {
    if (!input.trim() || !convId || sending) return
    setSending(true)
    const content = input.trim()
    setInput('')
    const msg = await sendMessage({ conversationId: convId, content, angelNumber: angelTag || undefined })
    if (msg) {
      setMessages(prev => prev.find(m => m.id === msg.id) ? prev : [...prev, msg])
      setAngelTag('')
    }
    setSending(false)
    inputRef.current?.focus()
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() }
  }

  function formatTime(iso: string) {
    return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  function formatDate(iso: string) {
    const d = new Date(iso)
    const today = new Date()
    if (d.toDateString() === today.toDateString()) return 'Today'
    const yesterday = new Date(today); yesterday.setDate(today.getDate() - 1)
    if (d.toDateString() === yesterday.toDateString()) return 'Yesterday'
    return d.toLocaleDateString([], { month: 'short', day: 'numeric' })
  }

  // Group messages by date
  const grouped: { date: string; msgs: Message[] }[] = []
  messages.forEach(msg => {
    const date = formatDate(msg.createdAt)
    const last = grouped[grouped.length - 1]
    if (last && last.date === date) last.msgs.push(msg)
    else grouped.push({ date, msgs: [msg] })
  })

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100dvh', maxWidth: '480px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem', background: 'rgba(8,6,28,0.92)', backdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(255,255,255,0.07)', flexShrink: 0, zIndex: 10 }}>
        <button onClick={() => router.push('/dashboard/messages')} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', fontSize: '1.2rem', padding: '0.25rem', display: 'flex', alignItems: 'center' }}>←</button>
        <Avatar name={otherName} size={38} />
        <div style={{ flex: 1 }}>
          <div style={{ color: '#fff', fontWeight: 600, fontSize: '0.95rem' }}>{otherName}</div>
          <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.7rem' }}>✦ Cosmic connection</div>
        </div>
        <div style={{ fontSize: '1.2rem' }}>✨</div>
      </div>

      {/* Messages */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
        {loading && (
          <div style={{ textAlign: 'center', padding: '2rem', color: 'rgba(255,255,255,0.3)', fontSize: '0.82rem' }}>Loading messages...</div>
        )}
        {!loading && messages.length === 0 && (
          <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'rgba(255,255,255,0.3)' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>✦</div>
            <p style={{ fontSize: '0.85rem', lineHeight: 1.6 }}>The universe brought you together.<br />Say hello to begin your cosmic journey.</p>
          </div>
        )}
        {grouped.map(group => (
          <div key={group.date}>
            <div style={{ textAlign: 'center', margin: '0.75rem 0', color: 'rgba(255,255,255,0.2)', fontSize: '0.68rem', letterSpacing: '0.08em' }}>{group.date}</div>
            {group.msgs.map((msg, i) => {
              const isMe = msg.senderId === myId
              const showAvatar = !isMe && (i === 0 || group.msgs[i-1]?.senderId !== msg.senderId)
              return (
                <div key={msg.id} style={{ display: 'flex', flexDirection: isMe ? 'row-reverse' : 'row', alignItems: 'flex-end', gap: '0.5rem', marginBottom: '0.25rem' }}>
                  {!isMe && <div style={{ width: 28, flexShrink: 0 }}>{showAvatar && <Avatar name={otherName} size={28} />}</div>}
                  <div style={{ maxWidth: '72%' }}>
                    {msg.angelNumber && (
                      <div style={{ textAlign: isMe ? 'right' : 'left', marginBottom: '0.2rem' }}>
                        <span style={{ background: 'rgba(201,168,76,0.15)', border: '1px solid rgba(201,168,76,0.3)', borderRadius: '0.5rem', padding: '0.1rem 0.5rem', fontSize: '0.65rem', color: '#c9a84c', letterSpacing: '0.05em' }}>✦ {msg.angelNumber}</span>
                      </div>
                    )}
                    <div style={{
                      background: isMe ? 'linear-gradient(135deg, rgba(124,58,237,0.7), rgba(147,51,234,0.5))' : 'rgba(255,255,255,0.07)',
                      borderRadius: isMe ? '1.25rem 1.25rem 0.25rem 1.25rem' : '1.25rem 1.25rem 1.25rem 0.25rem',
                      padding: '0.6rem 0.875rem',
                      border: isMe ? '1px solid rgba(147,51,234,0.3)' : '1px solid rgba(255,255,255,0.08)',
                      backdropFilter: 'blur(8px)',
                    }}>
                      <p style={{ color: '#fff', fontSize: '0.88rem', lineHeight: 1.5, margin: 0, wordBreak: 'break-word' }}>{msg.content}</p>
                    </div>
                    <div style={{ textAlign: isMe ? 'right' : 'left', marginTop: '0.15rem' }}>
                      <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.62rem' }}>{formatTime(msg.createdAt)}{isMe && msg.readAt ? ' · seen' : ''}</span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Angel number picker */}
      {showAngelPicker && (
        <div style={{ padding: '0.5rem 1rem', background: 'rgba(8,6,28,0.95)', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', flexWrap: 'wrap', gap: '0.4rem', flexShrink: 0 }}>
          {ANGEL_NUMBERS.map(n => (
            <button key={n} onClick={() => { setAngelTag(n); setShowAngelPicker(false) }}
              style={{ background: angelTag === n ? 'rgba(201,168,76,0.25)' : 'rgba(255,255,255,0.05)', border: '1px solid ' + (angelTag === n ? 'rgba(201,168,76,0.5)' : 'rgba(255,255,255,0.1)'), borderRadius: '0.5rem', color: angelTag === n ? '#c9a84c' : 'rgba(255,255,255,0.6)', padding: '0.25rem 0.6rem', fontSize: '0.75rem', cursor: 'pointer' }}>
              {n}
            </button>
          ))}
          {angelTag && <button onClick={() => setAngelTag('')} style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '0.5rem', color: '#f87171', padding: '0.25rem 0.6rem', fontSize: '0.75rem', cursor: 'pointer' }}>✕ clear</button>}
        </div>
      )}

      {/* Input bar */}
      <div style={{ padding: '0.75rem 1rem', background: 'rgba(8,6,28,0.95)', backdropFilter: 'blur(16px)', borderTop: '1px solid rgba(255,255,255,0.07)', flexShrink: 0 }}>
        {angelTag && (
          <div style={{ marginBottom: '0.4rem' }}>
            <span style={{ background: 'rgba(201,168,76,0.15)', border: '1px solid rgba(201,168,76,0.3)', borderRadius: '0.5rem', padding: '0.15rem 0.5rem', fontSize: '0.7rem', color: '#c9a84c' }}>✦ {angelTag}</span>
          </div>
        )}
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '0.5rem' }}>
          <button onClick={() => setShowAngelPicker(p => !p)}
            style={{ background: showAngelPicker ? 'rgba(201,168,76,0.2)' : 'rgba(255,255,255,0.05)', border: '1px solid ' + (showAngelPicker ? 'rgba(201,168,76,0.4)' : 'rgba(255,255,255,0.1)'), borderRadius: '0.75rem', color: showAngelPicker ? '#c9a84c' : 'rgba(255,255,255,0.4)', padding: '0.6rem 0.7rem', fontSize: '0.85rem', cursor: 'pointer', flexShrink: 0 }}>
            ✦
          </button>
          <textarea
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onInput={e => setInput((e.target as HTMLTextAreaElement).value)}
            onKeyDown={handleKeyDown}
            placeholder="Send a cosmic message..."
            rows={1}
            style={{ flex: 1, background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '1rem', color: '#fff', padding: '0.6rem 0.875rem', fontSize: '0.88rem', resize: 'none', outline: 'none', lineHeight: 1.5, maxHeight: '120px', overflowY: 'auto', fontFamily: 'inherit' }}
          />
          <button
            onClick={handleSend}
            onTouchEnd={e => { e.preventDefault(); handleSend() }}
            style={{ background: sending ? 'rgba(124,58,237,0.3)' : 'linear-gradient(135deg, #7c3aed, #9333ea)', border: 'none', borderRadius: '0.875rem', color: '#fff', padding: '0.6rem 0.875rem', fontSize: '0.9rem', cursor: 'pointer', flexShrink: 0, opacity: sending ? 0.6 : 1 }}>
            {sending ? '...' : '➤'}
          </button>
        </div>
      </div>
    </div>
  )
}
