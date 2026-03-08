'use client'

import { useState } from 'react'
import { AngelLog, deleteLog, toggleShare } from '@/lib/storage'

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
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  function handleDelete() {
    deleteLog(log.id)
    onDelete(log.id)
  }

  function handleShare() {
    toggleShare(log.id)
    onToggleShare(log.id)
  }

  return (
    <div
      className="relative transition-all duration-300"
      style={{
        background: expanded ? `linear-gradient(135deg, ${log.readingColor}0a 0%, rgba(10,8,25,0.95) 100%)` : 'rgba(255,255,255,0.03)',
        border: `1px solid ${expanded ? log.readingColor + '33' : 'rgba(200,180,255,0.1)'}`,
        borderRadius: '1rem',
        overflow: 'hidden',
      }}
    >
      {/* Main row */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full text-left p-5 flex items-start gap-4"
      >
        {/* Number badge */}
        <div
          className="flex-shrink-0 w-14 h-14 rounded-xl flex items-center justify-center font-bold text-sm tracking-wider"
          style={{
            background: log.readingColor + '18',
            border: `1px solid ${log.readingColor}44`,
            color: log.readingColor,
            boxShadow: expanded ? `0 0 20px ${log.readingColor}22` : 'none',
          }}
        >
          {log.number}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="text-sm font-medium" style={{ color: log.readingColor }}>{log.readingTitle}</span>
            {log.truthScore && (
              <span className="text-xs px-2 py-0.5 rounded-full"
                style={{ background: 'rgba(68,255,170,0.1)', color: '#44ffaa', border: '1px solid rgba(68,255,170,0.25)' }}>
                ✓ Angel Approved
              </span>
            )}
            {log.shared && (
              <span className="text-xs px-2 py-0.5 rounded-full"
                style={{ background: 'rgba(200,150,255,0.1)', color: 'rgba(200,150,255,0.8)', border: '1px solid rgba(200,150,255,0.25)' }}>
                ◈ Shared
              </span>
            )}
          </div>
          {log.thought && (
            <p className="text-xs truncate" style={{ color: 'rgba(200,180,255,0.45)' }}>
              &ldquo;{log.thought}&rdquo;
            </p>
          )}
          <p className="text-xs mt-1" style={{ color: 'rgba(200,180,255,0.25)' }}>{timeAgo(log.createdAt)}</p>
        </div>

        {/* Expand arrow */}
        <div className="flex-shrink-0 text-sm transition-transform duration-300"
          style={{ color: 'rgba(200,180,255,0.3)', transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)' }}>
          ▾
        </div>
      </button>

      {/* Expanded content */}
      {expanded && (
        <div className="px-5 pb-5 animate-fade-in-up">
          <div className="divider mb-4" />

          {/* Mini reading */}
          <div className="mb-4 p-4 rounded-xl" style={{ background: log.readingColor + '0d', border: `1px solid ${log.readingColor}22` }}>
            <p className="text-xs uppercase tracking-widest mb-2" style={{ color: log.readingColor + 'aa' }}>Cosmic Reading</p>
            <p className="text-sm leading-relaxed" style={{ color: 'rgba(220,200,255,0.7)' }}>{log.miniReading}</p>
          </div>

          {/* Thought */}
          {log.thought && (
            <div className="mb-4">
              <p className="text-xs uppercase tracking-widest mb-2" style={{ color: 'rgba(200,180,255,0.4)' }}>Your Thought Anchor</p>
              <p className="text-sm italic leading-relaxed" style={{ color: 'rgba(220,200,255,0.6)' }}>&ldquo;{log.thought}&rdquo;</p>
            </div>
          )}

          {/* Screenshot */}
          {log.screenshotUrl && (
            <div className="mb-4">
              <p className="text-xs uppercase tracking-widest mb-2" style={{ color: 'rgba(68,255,170,0.5)' }}>Proof Screenshot</p>
              <img src={log.screenshotUrl} alt="proof" className="rounded-xl max-h-40 object-cover w-full" style={{ border: '1px solid rgba(68,255,170,0.2)' }} />
            </div>
          )}

          {/* Timestamp */}
          <p className="text-xs mb-4" style={{ color: 'rgba(200,180,255,0.25)' }}>
            {new Date(log.createdAt).toLocaleString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
          </p>

          {/* Actions */}
          <div className="flex gap-2">
            <button
              onClick={handleShare}
              className="flex-1 py-2 rounded-xl text-xs font-medium transition-all"
              style={{
                background: log.shared ? 'rgba(200,150,255,0.15)' : 'rgba(255,255,255,0.04)',
                border: `1px solid ${log.shared ? 'rgba(200,150,255,0.4)' : 'rgba(200,180,255,0.15)'}`,
                color: log.shared ? 'rgba(200,150,255,0.9)' : 'rgba(200,180,255,0.4)',
              }}
            >
              {log.shared ? '◈ Shared with Matches' : '◇ Share with Match'}
            </button>
            {!showDeleteConfirm ? (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="px-4 py-2 rounded-xl text-xs transition-all"
                style={{ background: 'rgba(255,80,80,0.06)', border: '1px solid rgba(255,80,80,0.15)', color: 'rgba(255,120,120,0.5)' }}
              >
                Delete
              </button>
            ) : (
              <div className="flex gap-1">
                <button onClick={handleDelete}
                  className="px-3 py-2 rounded-xl text-xs"
                  style={{ background: 'rgba(255,80,80,0.15)', border: '1px solid rgba(255,80,80,0.3)', color: 'rgba(255,120,120,0.9)' }}>
                  Confirm
                </button>
                <button onClick={() => setShowDeleteConfirm(false)}
                  className="px-3 py-2 rounded-xl text-xs"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(200,180,255,0.15)', color: 'rgba(200,180,255,0.4)' }}>
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
