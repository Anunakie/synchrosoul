'use client'
import { forwardRef } from 'react'

export interface ShareableCardProps {
  type: 'oracle' | 'angel-number' | 'streak'
  headline: string
  body: string
  accent?: string
  footer?: string
  simulation?: boolean
}

const ShareableCard = forwardRef<HTMLDivElement, ShareableCardProps>(
  ({ type, headline, body, accent, footer, simulation }, ref) => {
    const isSim = simulation || false

    const typeStyles: Record<string, { icon: string; gradient: string; accentColor: string }> = {
      'oracle': {
        icon: '🔮',
        gradient: 'linear-gradient(135deg, #1a0a3e 0%, #0d0221 40%, #1a0533 100%)',
        accentColor: '#c9a84c',
      },
      'angel-number': {
        icon: '✨',
        gradient: 'linear-gradient(135deg, #0a1628 0%, #0d0221 40%, #1a0a3e 100%)',
        accentColor: '#a78bfa',
      },
      'streak': {
        icon: '🔥',
        gradient: 'linear-gradient(135deg, #1a0a2e 0%, #2d0a0a 40%, #1a0533 100%)',
        accentColor: '#f59e0b',
      },
    }

    const style = typeStyles[type] || typeStyles['oracle']

    return (
      <div
        ref={ref}
        style={{
          width: 360,
          minHeight: 420,
          background: isSim
            ? 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 40%, #0d0d0d 100%)'
            : style.gradient,
          borderRadius: 24,
          padding: '2.5rem 2rem',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '1.25rem',
          position: 'relative',
          overflow: 'hidden',
          border: `1px solid ${isSim ? 'rgba(0,255,0,0.15)' : 'rgba(167,139,250,0.2)'}`,
        }}
      >
        {/* Decorative stars */}
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              width: Math.random() * 3 + 1,
              height: Math.random() * 3 + 1,
              borderRadius: '50%',
              background: isSim ? 'rgba(0,255,0,0.3)' : 'rgba(255,255,255,0.4)',
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              pointerEvents: 'none',
            }}
          />
        ))}

        {/* Icon */}
        <span style={{ fontSize: '2.5rem' }}>{isSim ? '⚡' : style.icon}</span>

        {/* Headline */}
        <h2
          style={{
            color: isSim ? '#00ff00' : style.accentColor,
            fontSize: '1.5rem',
            fontWeight: 700,
            textAlign: 'center',
            margin: 0,
            lineHeight: 1.3,
            letterSpacing: '0.02em',
          }}
        >
          {headline}
        </h2>

        {/* Body text */}
        <p
          style={{
            color: isSim ? 'rgba(0,255,0,0.7)' : 'rgba(220,200,255,0.85)',
            fontSize: '1rem',
            textAlign: 'center',
            margin: 0,
            lineHeight: 1.6,
            maxWidth: 300,
          }}
        >
          &ldquo;{body}&rdquo;
        </p>

        {/* Accent text */}
        {accent && (
          <p
            style={{
              color: isSim ? 'rgba(0,255,0,0.5)' : 'rgba(180,160,255,0.6)',
              fontSize: '0.85rem',
              textAlign: 'center',
              margin: 0,
              fontStyle: 'italic',
            }}
          >
            {accent}
          </p>
        )}

        {/* Footer */}
        {footer && (
          <p
            style={{
              color: isSim ? 'rgba(0,255,0,0.4)' : 'rgba(160,140,200,0.5)',
              fontSize: '0.75rem',
              textAlign: 'center',
              margin: 0,
            }}
          >
            {footer}
          </p>
        )}

        {/* Branding */}
        <div
          style={{
            marginTop: 'auto',
            paddingTop: '1rem',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '0.25rem',
          }}
        >
          <span
            style={{
              color: isSim ? '#00ff00' : '#c9a84c',
              fontSize: '1rem',
              fontWeight: 600,
              letterSpacing: '0.08em',
            }}
          >
            {isSim ? '⚡ SynchroSoul' : '✦ SynchroSoul'}
          </span>
          <span
            style={{
              color: isSim ? 'rgba(0,255,0,0.4)' : 'rgba(167,139,250,0.5)',
              fontSize: '0.7rem',
              letterSpacing: '0.1em',
            }}
          >
            synchrosoul.app
          </span>
        </div>
      </div>
    )
  }
)

ShareableCard.displayName = 'ShareableCard'
export default ShareableCard
