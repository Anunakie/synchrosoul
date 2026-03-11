'use client'
import { useEffect, useState } from 'react'
import { getSyncStatus, onSyncStatusChange } from '@/lib/storage'
import { getCurrentUserId } from '@/lib/supabase-db'

export default function CloudSyncStatus() {
  const [status, setStatus] = useState<'idle' | 'syncing' | 'synced' | 'offline'>('idle')
  const [isAuth, setIsAuth] = useState(false)

  useEffect(() => {
    getCurrentUserId().then(id => setIsAuth(!!id))
    setStatus(getSyncStatus())
    const unsub = onSyncStatusChange(setStatus)
    return unsub
  }, [])

  if (!isAuth) return null

  const config = {
    idle:    { icon: '☁️', label: 'Cloud Ready',  color: 'rgba(255,255,255,0.3)' },
    syncing: { icon: '↻',      label: 'Syncing...',   color: '#c9a84c' },
    synced:  { icon: '✓',      label: 'Synced',       color: '#4ade80' },
    offline: { icon: '⚠️', label: 'Offline',     color: '#f87171' },
  }[status]

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '0.3rem',
      fontSize: '0.7rem',
      color: config.color,
      opacity: 0.85,
      transition: 'color 0.3s',
      whiteSpace: 'nowrap',
    }}>
      <span style={{ fontSize: '0.75rem' }}>{config.icon}</span>
      <span>{config.label}</span>
    </div>
  )
}
