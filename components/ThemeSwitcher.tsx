'use client'
import { useState } from 'react'
import { useTheme, THEMES, AppTheme } from '@/lib/theme-context'

export default function ThemeSwitcher() {
  const { theme, setTheme } = useTheme()
  const [open, setOpen] = useState(false)

  const isLight = theme === 'light'
  const isSim = theme === 'simulation'

  const panelBg = isLight
    ? 'rgba(245,240,255,0.97)'
    : isSim
    ? 'rgba(0,10,0,0.97)'
    : 'rgba(8,6,28,0.92)'
  const panelBorder = isLight
    ? 'rgba(109,40,217,0.25)'
    : isSim
    ? 'rgba(0,255,65,0.3)'
    : 'rgba(255,255,255,0.12)'
  const itemColor = isLight ? '#1a0a3e' : isSim ? '#00ff41' : 'rgba(255,255,255,0.8)'
  const activeColor = isLight ? '#6d28d9' : isSim ? '#00ff41' : '#c9a84c'
  const activeBorder = isLight ? 'rgba(109,40,217,0.6)' : isSim ? '#00ff41' : 'rgba(201,168,76,0.9)'
  const activeBg = isLight ? 'rgba(109,40,217,0.1)' : isSim ? 'rgba(0,255,65,0.1)' : 'rgba(201,168,76,0.18)'
  const btnBg = open
    ? (isLight ? 'rgba(109,40,217,0.15)' : isSim ? 'rgba(0,255,65,0.15)' : 'rgba(201,168,76,0.25)')
    : (isLight ? 'rgba(245,240,255,0.9)' : isSim ? 'rgba(0,10,0,0.9)' : 'rgba(8,6,28,0.82)')
  const btnBorder = open
    ? (isLight ? 'rgba(109,40,217,0.6)' : isSim ? '#00ff41' : 'rgba(201,168,76,0.7)')
    : (isLight ? 'rgba(109,40,217,0.3)' : isSim ? 'rgba(0,255,65,0.5)' : 'rgba(255,255,255,0.2)')

  return (
    <div style={{ position: 'fixed', bottom: '5.5rem', right: '1rem', zIndex: 9999 }}>
      {open && (
        <div style={{
          position: 'absolute', bottom: '3.4rem', right: 0,
          display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'flex-end',
          background: panelBg,
          border: '1px solid ' + panelBorder,
          borderRadius: isSim ? '0.25rem' : '1rem',
          padding: '0.75rem',
          backdropFilter: 'blur(20px)',
          boxShadow: isLight
            ? '0 8px 32px rgba(109,40,217,0.15)'
            : isSim
            ? '0 0 24px rgba(0,255,65,0.2), 0 8px 32px rgba(0,0,0,0.8)'
            : '0 8px 32px rgba(0,0,0,0.5)',
          minWidth: '190px',
        }}>
          <div style={{
            fontSize: '0.65rem',
            fontWeight: 600,
            letterSpacing: isSim ? '0.18em' : '0.12em',
            textTransform: 'uppercase',
            color: isLight ? 'rgba(45,27,94,0.5)' : isSim ? 'rgba(0,255,65,0.5)' : 'rgba(255,255,255,0.35)',
            paddingBottom: '0.4rem',
            paddingLeft: '0.4rem',
            fontFamily: isSim ? 'monospace' : 'inherit',
          }}>{isSim ? '> SELECT_THEME' : 'Theme'}</div>

          {THEMES.map((t) => (
            <button
              key={t.id}
              onClick={() => { setTheme(t.id as AppTheme); setOpen(false) }}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.6rem',
                padding: '0.45rem 0.8rem',
                borderRadius: isSim ? '0.2rem' : '2rem',
                border: theme === t.id
                  ? '1px solid ' + activeBorder
                  : '1px solid ' + (isLight ? 'rgba(109,40,217,0.12)' : isSim ? 'rgba(0,255,65,0.15)' : 'rgba(255,255,255,0.1)'),
                background: theme === t.id ? activeBg : 'transparent',
                cursor: 'pointer',
                color: theme === t.id ? activeColor : itemColor,
                fontSize: '0.82rem',
                fontFamily: isSim ? 'monospace' : 'inherit',
                letterSpacing: isSim ? '0.06em' : '0.04em',
                whiteSpace: 'nowrap', width: '100%',
                boxShadow: theme === t.id
                  ? (isLight ? '0 0 12px rgba(109,40,217,0.15)' : isSim ? '0 0 10px rgba(0,255,65,0.2)' : '0 0 12px rgba(201,168,76,0.25)')
                  : 'none',
                transition: 'all 0.15s ease',
                fontWeight: theme === t.id ? 500 : 400,
                textTransform: isSim ? 'uppercase' : 'none',
              }}
            >
              {t.id === 'simulation' ? (
                <div style={{
                  width: '28px', height: '28px', borderRadius: '0.2rem', flexShrink: 0,
                  background: '#000800',
                  border: '1px solid rgba(0,255,65,0.6)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.75rem',
                  fontFamily: 'monospace',
                  color: '#00ff41',
                  boxShadow: '0 0 8px rgba(0,255,65,0.3)',
                }}>10</div>
              ) : t.id === 'light' ? (
                <div style={{
                  width: '28px', height: '28px', borderRadius: '0.4rem', flexShrink: 0,
                  background: 'linear-gradient(135deg, #f5f0ff 0%, #e8e0ff 50%, #f0f4ff 100%)',
                  border: '1px solid rgba(109,40,217,0.2)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.9rem',
                }}>🌙</div>
              ) : t.id === 'bright' ? (
                <div style={{
                  width: '28px', height: '28px', borderRadius: '0.4rem', flexShrink: 0,
                  background: 'linear-gradient(135deg, #1a1040 0%, #0d0a1f 100%)',
                  border: '1px solid rgba(255,255,255,0.25)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.9rem',
                }}>☀️</div>
              ) : (
                <div style={{
                  width: '28px', height: '28px', borderRadius: '0.4rem', overflow: 'hidden', flexShrink: 0,
                  border: '1px solid rgba(255,255,255,0.12)',
                  backgroundImage: t.thumbnail ? 'url(' + t.thumbnail + ')' : undefined,
                  backgroundSize: 'cover', backgroundPosition: 'center',
                  background: t.thumbnail ? undefined : 'radial-gradient(ellipse at 30% 40%, rgba(120,60,200,0.9) 0%, rgba(20,10,60,1) 70%)',
                }} />
              )}
              <span>{isSim ? t.label.toUpperCase() : t.label}</span>
              {theme === t.id && (
                <span style={{ marginLeft: 'auto', color: activeColor, fontSize: '0.75rem' }}>{isSim ? '[X]' : '✓'}</span>
              )}
            </button>
          ))}

          {isSim ? (
            <div style={{
              fontSize: '0.6rem',
              color: 'rgba(0,255,65,0.35)',
              paddingTop: '0.3rem',
              paddingLeft: '0.4rem',
              lineHeight: 1.6,
              fontFamily: 'monospace',
              letterSpacing: '0.05em',
            }}>
              // SIMULATION ACTIVE<br/>
              // ANOMALY DETECTION ON
            </div>
          ) : (
            <div style={{
              fontSize: '0.62rem',
              color: isLight ? 'rgba(45,27,94,0.4)' : 'rgba(255,255,255,0.25)',
              paddingTop: '0.3rem',
              paddingLeft: '0.4rem',
              lineHeight: 1.4,
            }}>
              Light Mode recommended<br/>for easier reading
            </div>
          )}
        </div>
      )}

      <button
        onClick={() => setOpen(o => !o)}
        title={isSim ? 'CHANGE_THEME' : 'Change theme'}
        style={{
          width: '2.6rem', height: '2.6rem',
          borderRadius: isSim ? '0.3rem' : '50%',
          background: btnBg,
          border: '1px solid ' + btnBorder,
          backdropFilter: 'blur(12px)', cursor: 'pointer',
          fontSize: isSim ? '0.7rem' : '1.1rem',
          fontFamily: isSim ? 'monospace' : 'inherit',
          color: isSim ? '#00ff41' : 'inherit',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: open
            ? (isLight ? '0 0 16px rgba(109,40,217,0.25)' : isSim ? '0 0 16px rgba(0,255,65,0.4)' : '0 0 16px rgba(201,168,76,0.3)')
            : isSim ? '0 0 8px rgba(0,255,65,0.2)' : '0 2px 12px rgba(0,0,0,0.3)',
          transition: 'all 0.25s ease',
          transform: open ? 'rotate(30deg)' : 'rotate(0deg)',
          letterSpacing: '0.05em',
        }}
      >
        {isSim ? '>_' : '🎨'}
      </button>
    </div>
  )
}
