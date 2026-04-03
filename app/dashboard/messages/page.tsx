'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { getConversations, getUnreadCount, subscribeToConversations } from '@/lib/messages'
import { getCurrentUserId } from '@/lib/supabase-db'
import type { Conversation } from '@/lib/messages'

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const m = Math.floor(diff / 60000)
  if (m < 1) return 'just now'
  if (m < 60) return m + 'm ago'
  const h = Math.floor(m / 60)
  if (h < 24) return h + 'h ago'
  return Math.floor(h / 24) + 'd ago'
}

function Avatar({ name, image, size = 44 }: { name: string; image?: string; size?: number }) {
  const initials = name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() || 'S'
  const colors = ['#7c3aed','#9333ea','#c026d3','#db2777','#e11d48','#0891b2','#0d9488']
  const color = colors[name.charCodeAt(0) % colors.length]
  if (image) return (
    <img src={image} alt={name} style={{ width: size, height: size, borderRadius: '50%', objectFit: 'cover', border: '2px solid rgba(200,180,255,0.2)' }} />
  )
  return (
    <div style={{ width: size, height: size, borderRadius: '50%', background: color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: size * 0.35, color: '#fff', fontWeight: 700, border: '2px solid rgba(200,180,255,0.2)', flexShrink: 0 }}>
      {initials}
    </div>
  )
}

async function fetchFreshProfiles(userIds: string[]): Promise<Record<string, { displayName: string; avatarUrl: string }>> {
  if (userIds.length === 0) return {}
  try {
    const res = await fetch('/api/messages/fresh-profiles', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userIds }),
    })
    if (!res.ok) return {}
    const data = await res.json()
    return data.profiles || {}
  } catch { return {} }
}

export default function MessagesPage() {
  const router = useRouter()
  const [conversations, setConversations] = useState<Conversation[]>([])
  const [myId, setMyId] = useState<string | null>(null)
  const [unread, setUnread] = useState(0)
  const [loading, setLoading] = useState(true)

  const load = async () => {
    const [convs, count, uid] = await Promise.all([
      getConversations(),
      getUnreadCount(),
      getCurrentUserId(),
    ])

    // Fetch fresh profile names to override denormalized conversation names
    const otherUserIds = [...new Set(convs.map(c => c.otherUserId))]
    const freshProfiles = await fetchFreshProfiles(otherUserIds)

    // Override stale names with fresh profile data
    const updatedConvs = convs.map(c => {
      const fresh = freshProfiles[c.otherUserId]
      if (fresh && fresh.displayName) {
        return {
          ...c,
          otherUserName: fresh.displayName,
          otherUserAvatar: fresh.avatarUrl || c.otherUserAvatar,
        }
      }
      return c
    })

    setConversations(updatedConvs)
    setUnread(count)
    setMyId(uid)
    setLoading(false)
  }

  useEffect(() => {
    load()
  }, [])

  useEffect(() => {
    if (!myId) return
    const unsub = subscribeToConversations(myId, load)
    return unsub
  }, [myId])

  return (
    <div style={{ minHeight: '100vh', padding: '1.5rem 1rem 6rem', maxWidth: '480px', margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ color: '#fff', fontSize: '1.4rem', fontWeight: 700, marginBottom: '0.15rem' }}>Messages</h1>
          <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.78rem' }}>
            {unread > 0 ? unread + ' unread' : 'Your cosmic conversations'}
          </p>
        </div>
        <div style={{ fontSize: '1.5rem' }}>💬</div>
      </div>

      {loading && (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'rgba(255,255,255,0.3)', fontSize: '0.85rem' }}>
          Loading conversations...
        </div>
      )}

      {!loading && conversations.length === 0 && (
        <div style={{
          background: 'rgba(8,6,28,0.88)', borderRadius: '1.5rem',
          border: '1px solid rgba(255,255,255,0.07)', padding: '3rem 2rem',
          backdropFilter: 'blur(12px)', textAlign: 'center',
        }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✦</div>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '1rem', fontWeight: 600, marginBottom: '0.5rem' }}>No conversations yet</p>
          <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.82rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
            Send a sync signal to someone on the Live Sync page to start a conversation.
          </p>
          <button
            onClick={() => router.push('/dashboard/sync')}
            style={{ background: 'rgba(201,168,76,0.15)', border: '1px solid rgba(201,168,76,0.4)', borderRadius: '0.875rem', color: '#c9a84c', padding: '0.65rem 1.5rem', fontSize: '0.85rem', cursor: 'pointer', fontWeight: 600 }}
          >
            Go to Live Sync ⟳
          </button>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {conversations.map(conv => {
          const isUnread = conv.lastMessagePreview && !conv.lastMessageAt
          return (
            <button
              key={conv.id}
              onClick={() => router.push('/dashboard/messages/' + conv.otherUserId + '?convId=' + conv.id + '&name=' + encodeURIComponent(conv.otherUserName))}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.875rem',
                background: 'rgba(8,6,28,0.88)', borderRadius: '1.25rem',
                border: '1px solid rgba(255,255,255,0.07)', padding: '0.875rem 1rem',
                backdropFilter: 'blur(12px)', cursor: 'pointer', textAlign: 'left',
                transition: 'all 0.2s', width: '100%',
              }}
            >
              <div style={{ position: 'relative', flexShrink: 0 }}>
                <Avatar name={conv.otherUserName} image={conv.otherUserAvatar || undefined} />
                <div style={{ position: 'absolute', bottom: 0, right: 0, width: 10, height: 10, borderRadius: '50%', background: '#4ade80', border: '2px solid rgba(5,5,20,1)' }} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.2rem' }}>
                  <span style={{ color: '#fff', fontSize: '0.92rem', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{conv.otherUserName}</span>
                  <span style={{ color: 'rgba(255,255,255,0.25)', fontSize: '0.68rem', flexShrink: 0, marginLeft: '0.5rem' }}>{timeAgo(conv.lastMessageAt)}</span>
                </div>
                <p style={{ color: conv.lastMessagePreview ? 'rgba(255,255,255,0.45)' : 'rgba(255,255,255,0.2)', fontSize: '0.78rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {conv.lastMessagePreview || 'Start your cosmic conversation...'}
                </p>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
