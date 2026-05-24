'use client'
import { useState, useRef } from 'react'
import ShareableCard, { ShareableCardProps } from './ShareableCard'
import { useShareCard } from '@/lib/use-share-card'

interface ShareModalProps extends ShareableCardProps {
  onClose: () => void
  fileName?: string
}

export default function ShareModal({ onClose, fileName, ...cardProps }: ShareModalProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const { captureAndShare } = useShareCard(cardRef, {
    fileName: fileName || 'synchrosoul-share',
    shareTitle: 'SynchroSoul',
    shareText: 'Check out my spiritual journey on SynchroSoul ✨',
  })
  const [sharing, setSharing] = useState(false)

  const handleShare = async () => {
    setSharing(true)
    try {
      await captureAndShare()
    } finally {
      setSharing(false)
    }
  }

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
        background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
        zIndex: 9999, padding: '1rem',
      }}
    >
      <div onClick={(e) => e.stopPropagation()} style={{ maxHeight: '80vh', overflowY: 'auto' }}>
        <ShareableCard ref={cardRef} {...cardProps} />
      </div>

      <div onClick={(e) => e.stopPropagation()} style={{ display: 'flex', gap: '0.75rem', marginTop: '1.25rem' }}>
        <button
          onClick={handleShare}
          disabled={sharing}
          style={{
            padding: '0.75rem 2rem', borderRadius: '9999px', cursor: sharing ? 'wait' : 'pointer',
            background: 'linear-gradient(135deg, rgba(201,168,76,0.3), rgba(167,139,250,0.3))',
            border: '1px solid rgba(201,168,76,0.5)',
            color: '#c9a84c', fontSize: '0.95rem', fontWeight: 600,
            letterSpacing: '0.05em', opacity: sharing ? 0.6 : 1,
          }}
        >
          {sharing ? 'Preparing...' : '📤 Share Image'}
        </button>
        <button
          onClick={onClose}
          style={{
            padding: '0.75rem 1.5rem', borderRadius: '9999px', cursor: 'pointer',
            background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)',
            color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem',
          }}
        >
          Close
        </button>
      </div>
    </div>
  )
}
