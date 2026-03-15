'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

const dataTypes = [
  { id: 'angel_logs', label: 'Angel Number Logs', description: 'All logged angel number sightings and thought anchors', icon: '✨' },
  { id: 'dreams', label: 'Dream Journal', description: 'All dream entries and recordings', icon: '🌙' },
  { id: 'posts', label: 'Social Posts', description: 'All posts shared on the Cosmic Feed', icon: '🌟' },
  { id: 'saved_readings', label: 'Saved Readings', description: 'Saved tarot, oracle, and numerology readings', icon: '🔮' },
  { id: 'notifications', label: 'Notifications', description: 'All notification history', icon: '🔔' },
]

export default function DeleteDataPage() {
  const [selected, setSelected] = useState<string[]>([])
  const [status, setStatus] = useState<'idle' | 'confirming' | 'deleting' | 'done' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const toggle = (id: string) => {
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])
  }

  const handleDelete = async () => {
    if (selected.length === 0) return
    setStatus('deleting')
    try {
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        setMessage('You must be logged in to delete data.')
        setStatus('error')
        return
      }
      for (const table of selected) {
        await supabase.from(table).delete().eq('user_id', user.id)
      }
      if (selected.includes('angel_logs')) {
        localStorage.removeItem('synchrosoul_logs')
        localStorage.removeItem('angel_logs')
      }
      if (selected.includes('dreams')) {
        localStorage.removeItem('synchrosoul_dreams')
      }
      if (selected.includes('posts')) {
        localStorage.removeItem('synchrosoul_posts')
      }
      setStatus('done')
      setMessage('Selected data has been permanently deleted.')
    } catch {
      setStatus('error')
      setMessage('Something went wrong. Please try again.')
    }
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#050510',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem',
      fontFamily: 'system-ui, sans-serif'
    }}>
      <div style={{
        maxWidth: '520px',
        width: '100%',
        background: 'rgba(255,255,255,0.05)',
        border: '1px solid rgba(167,139,250,0.3)',
        borderRadius: '1.5rem',
        padding: '2.5rem',
        color: 'white'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🗑️</div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#a78bfa', marginBottom: '0.5rem' }}>Delete My Data</h1>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.95rem' }}>
            Select which data you would like to permanently delete. Your account will remain active.
          </p>
        </div>

        {status === 'done' ? (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✅</div>
            <p style={{ color: '#86efac', fontSize: '1.1rem', fontWeight: 600 }}>Data deleted successfully</p>
            <p style={{ color: 'rgba(255,255,255,0.5)', marginTop: '0.5rem', fontSize: '0.9rem' }}>{message}</p>
            <a href="/dashboard" style={{
              display: 'inline-block',
              marginTop: '1.5rem',
              padding: '0.75rem 2rem',
              background: 'rgba(167,139,250,0.2)',
              border: '1px solid rgba(167,139,250,0.4)',
              borderRadius: '0.75rem',
              color: '#a78bfa',
              textDecoration: 'none',
              fontWeight: 600
            }}>Return to Dashboard</a>
          </div>
        ) : (
          <>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '2rem' }}>
              {dataTypes.map(dt => (
                <label key={dt.id} style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '1rem',
                  padding: '1rem',
                  background: selected.includes(dt.id) ? 'rgba(167,139,250,0.15)' : 'rgba(255,255,255,0.03)',
                  border: `1px solid ${selected.includes(dt.id) ? 'rgba(167,139,250,0.5)' : 'rgba(255,255,255,0.1)'}`,
                  borderRadius: '0.75rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}>
                  <input
                    type="checkbox"
                    checked={selected.includes(dt.id)}
                    onChange={() => toggle(dt.id)}
                    style={{ marginTop: '2px', accentColor: '#a78bfa', width: '18px', height: '18px', flexShrink: 0 }}
                  />
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{dt.icon} {dt.label}</div>
                    <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.82rem', marginTop: '0.2rem' }}>{dt.description}</div>
                  </div>
                </label>
              ))}
            </div>

            {status === 'error' && (
              <div style={{
                padding: '0.75rem 1rem',
                background: 'rgba(239,68,68,0.15)',
                border: '1px solid rgba(239,68,68,0.3)',
                borderRadius: '0.5rem',
                color: '#fca5a5',
                fontSize: '0.9rem',
                marginBottom: '1rem'
              }}>{message}</div>
            )}

            {status === 'confirming' ? (
              <div style={{ textAlign: 'center' }}>
                <p style={{ color: '#fbbf24', marginBottom: '1rem', fontSize: '0.95rem' }}>
                  This will permanently delete {selected.length} data type{selected.length > 1 ? 's' : ''}. This cannot be undone.
                </p>
                <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center' }}>
                  <button onClick={() => setStatus('idle')} style={{
                    padding: '0.75rem 1.5rem',
                    background: 'rgba(255,255,255,0.1)',
                    border: '1px solid rgba(255,255,255,0.2)',
                    borderRadius: '0.75rem',
                    color: 'white',
                    cursor: 'pointer',
                    fontWeight: 600
                  }}>Cancel</button>
                  <button onClick={handleDelete} style={{
                    padding: '0.75rem 1.5rem',
                    background: 'rgba(239,68,68,0.8)',
                    border: 'none',
                    borderRadius: '0.75rem',
                    color: 'white',
                    cursor: 'pointer',
                    fontWeight: 600
                  }}>Yes, Delete Forever</button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => selected.length > 0 && setStatus('confirming')}
                disabled={selected.length === 0 || status === 'deleting'}
                style={{
                  width: '100%',
                  padding: '1rem',
                  background: selected.length > 0 ? 'rgba(239,68,68,0.7)' : 'rgba(255,255,255,0.05)',
                  border: `1px solid ${selected.length > 0 ? 'rgba(239,68,68,0.5)' : 'rgba(255,255,255,0.1)'}`,
                  borderRadius: '0.75rem',
                  color: selected.length > 0 ? 'white' : 'rgba(255,255,255,0.3)',
                  cursor: selected.length > 0 ? 'pointer' : 'not-allowed',
                  fontWeight: 700,
                  fontSize: '1rem'
                }}>
                {status === 'deleting' ? 'Deleting...' : `Delete Selected Data (${selected.length} selected)`}
              </button>
            )}

            <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
              <a href="/account/delete" style={{ color: 'rgba(239,68,68,0.6)', fontSize: '0.85rem', textDecoration: 'underline' }}>
                Want to delete your entire account instead?
              </a>
            </div>
            <div style={{ textAlign: 'center', marginTop: '0.75rem' }}>
              <a href="/dashboard" style={{ color: 'rgba(167,139,250,0.6)', fontSize: '0.85rem', textDecoration: 'none' }}>
                Back to Dashboard
              </a>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
