'use client'

import { useState, useEffect } from 'react'
import { useTheme } from '@/lib/theme-context'
import { AngelLog, deleteLog, toggleShare } from '@/lib/storage'
import { speakText, stopSpeaking } from './VoiceRecorder'

interface Props {
  log: AngelLog
  onDelete: (id: string) => void
  onToggleShare: (id: string) => void
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  if (hours < 24) return `${hours}h ago`
  if (days < 7) return `${days}d ago`
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export default function JournalEntry({ log, onDelete, onToggleShare }: Props) {
  const [expanded, setExpanded] = useState(false)
  const { theme } = useTheme()
  const isSim = theme === 'simulation'
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)

  useEffect(() => {
    return () => stopSpeaking()
  }, [])

  function handleSpeak() {
    if (isSpeaking) {
      stopSpeaking()
      setIsSpeaking(false)
      return
    }
    const text = [
      `Angel number ${log.number.split('').join(' ')}.`,
      log.readingTitle + '.',
      log.miniReading,
      log.thought ? `Your thought anchor: ${log.thought}` : '',
    ].filter(Boolean).join(' ')
    speakText(text)
    setIsSpeaking(true)
    // estimate duration and reset state
    const wordCount = text.split(' ').length
    const ms = (wordCount / 2.5) * 1000
    setTimeout(() => setIsSpeaking(false), ms + 500)
  }

  async function handleDelete() {
    await deleteLog(log.id)
    onDelete(log.id)
  }

  async function handleShare() {
    await toggleShare(log.id)
    onToggleShare(log.id)
  }

  return (
    <div
      style={{
        background: expanded
          ? `linear-gradient(135deg, ${log.readingColor}0a 0%, rgba(10,8,25,0.95) 100%)`
          : 'rgba(255,255,255,0.03)',
        border: `1px solid ${expanded ? log.readingColor + '33' : 'rgba(200,180,255,0.1)'}`,
        borderRadius: '1rem',
        overflow: 'hidden',
        transition: 'all 0.3s ease',
      }}
    >
      {/* Main row */}
      <button
        onClick={() => setExpanded(!expanded)}
        style={{
          width: '100%', textAlign: 'left', padding: '1.25rem',
          display: 'flex', alignItems: 'flex-start', gap: '1rem',
          background: 'none', border: 'none', cursor: 'pointer',
        }}
      >
        {/* Number badge */}
        <div style={{
          flexShrink: 0, width: '3.5rem', height: '3.5rem', borderRadius: '0.75rem',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontWeight: 700, fontSize: '0.8rem', letterSpacing: '0.05em',
          background: log.readingColor + '18', border: `1px solid ${log.readingColor}44`,
          color: log.readingColor,
          boxShadow: expanded ? `0 0 20px ${log.readingColor}22` : 'none',
        }}>{log.number}</div>

        {/* Content */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.875rem', fontWeight: 500, color: log.readingColor }}>{log.readingTitle}</span>
            {log.truthScore && (
              <span style={{
                fontSize: '0.7rem', padding: '0.15rem 0.6rem', borderRadius: '9999px',
                background: 'rgba(68,255,170,0.1)', color: '#44ffaa',
                border: '1px solid rgba(68,255,170,0.25)',
              }}>{isSim ? '>> SIGNAL VERIFIED' : '✦ Angel Approved'}</span>
            )}
            {log.shared && (
              <span style={{
                fontSize: '0.7rem', padding: '0.15rem 0.6rem', borderRadius: '9999px',
                background: 'rgba(200,150,255,0.1)', color: 'rgba(200,150,255,0.8)',
                border: '1px solid rgba(200,150,255,0.25)',
              }}>◈ Shared</span>
            )}
          </div>
          {log.thought && (
            <p style={{ fontSize: '0.75rem', color: 'rgba(200,180,255,0.45)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              &ldquo;{log.thought}&rdquo;
            </p>
          )}
          <p style={{ fontSize: '0.7rem', marginTop: '0.25rem', color: 'rgba(200,180,255,0.25)' }}>{timeAgo(log.createdAt)}</p>
        </div>

        {/* Expand arrow */}
        <div style={{
          flexShrink: 0, fontSize: '0.875rem', color: 'rgba(200,180,255,0.3)',
          transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s',
        }}>▾</div>
      </button>

      {/* Expanded content */}
      {expanded && (
        <div style={{ padding: '0 1.25rem 1.25rem' }}>
          <div style={{ height: '1px', background: 'rgba(200,180,255,0.08)', marginBottom: '1rem' }} />

          {/* Mini reading with speak button */}
          <div style={{
            marginBottom: '1rem', padding: '1rem', borderRadius: '0.75rem',
            background: log.readingColor + '0d', border: `1px solid ${log.readingColor}22`,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <p style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: log.readingColor + 'aa' }}>Cosmic Reading</p>
              <button
                onClick={(e) => { e.stopPropagation(); handleSpeak() }}
                title={isSpeaking ? 'Stop reading' : 'Read aloud'}
                style={{
                  display: 'flex', alignItems: 'center', gap: '0.3rem',
                  padding: '0.3rem 0.75rem', borderRadius: '9999px',
                  background: isSpeaking ? `rgba(${log.readingColor.slice(1).match(/.{2}/g)?.map(h => parseInt(h,16)).join(',')},0.2)` : 'rgba(200,150,255,0.1)',
                  border: `1px solid ${isSpeaking ? log.readingColor + '66' : 'rgba(200,150,255,0.25)'}`,
                  color: isSpeaking ? log.readingColor : 'rgba(200,150,255,0.6)',
                  cursor: 'pointer', fontSize: '0.7rem',
                  transition: 'all 0.2s',
                }}
              >
                <span>{isSpeaking ? '⏹' : '🔊'}</span>
                <span>{isSpeaking ? 'Stop' : 'Listen'}</span>
              </button>
            </div>
            <p style={{ fontSize: '0.875rem', lineHeight: 1.6, color: 'rgba(220,200,255,0.7)' }}>{log.miniReading}</p>
          </div>

          {/* Thought anchor */}
          {log.thought && (
            <div style={{ marginBottom: '1rem' }}>
              <p style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'rgba(200,180,255,0.4)', marginBottom: '0.5rem' }}>Your Thought Anchor</p>
              <p style={{ fontSize: '0.875rem', fontStyle: 'italic', lineHeight: 1.6, color: 'rgba(220,200,255,0.6)' }}>&ldquo;{log.thought}&rdquo;</p>
            </div>
          )}

          {/* Screenshot / Truth Score */}
          {log.screenshotUrl && (
            <div style={{ marginBottom: '1rem' }}>
              <p style={{ fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: 'rgba(68,255,170,0.5)', marginBottom: '0.5rem' }}>✦ Truth Score · Proof Screenshot</p>
              <img src={log.screenshotUrl} alt="proof" style={{
                borderRadius: '0.75rem', maxHeight: '10rem', objectFit: 'cover', width: '100%',
                border: '1px solid rgba(68,255,170,0.2)',
              }} />
            </div>
          )}

          {/* Timestamp */}
          <p style={{ fontSize: '0.7rem', marginBottom: '1rem', color: 'rgba(200,180,255,0.25)' }}>
            {new Date(log.createdAt).toLocaleString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
          </p>

          {/* Actions */}
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button onClick={handleShare} style={{
              flex: 1, padding: '0.5rem', borderRadius: '0.75rem', fontSize: '0.75rem', fontWeight: 500,
              background: log.shared ? 'rgba(200,150,255,0.15)' : 'rgba(255,255,255,0.04)',
              border: `1px solid ${log.shared ? 'rgba(200,150,255,0.4)' : 'rgba(200,180,255,0.15)'}`,
              color: log.shared ? 'rgba(200,150,255,0.9)' : 'rgba(200,180,255,0.4)',
              cursor: 'pointer',
            }}>
              {log.shared ? '◈ Shared with Matches' : '◇ Share with Match'}
            </button>
            {!showDeleteConfirm ? (
              <button onClick={() => setShowDeleteConfirm(true)} style={{
                padding: '0.5rem 1rem', borderRadius: '0.75rem', fontSize: '0.75rem',
                background: 'rgba(255,80,80,0.06)', border: '1px solid rgba(255,80,80,0.15)',
                color: 'rgba(255,120,120,0.5)', cursor: 'pointer',
              }}>Delete</button>
            ) : (
              <div style={{ display: 'flex', gap: '0.25rem' }}>
                <button onClick={handleDelete} style={{
                  padding: '0.5rem 0.75rem', borderRadius: '0.75rem', fontSize: '0.75rem',
                  background: 'rgba(255,80,80,0.15)', border: '1px solid rgba(255,80,80,0.3)',
                  color: 'rgba(255,120,120,0.9)', cursor: 'pointer',
                }}>Confirm</button>
                <button onClick={() => setShowDeleteConfirm(false)} style={{
                  padding: '0.5rem 0.75rem', borderRadius: '0.75rem', fontSize: '0.75rem',
                  background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(200,180,255,0.15)',
                  color: 'rgba(200,180,255,0.4)', cursor: 'pointer',
                }}>Cancel</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
