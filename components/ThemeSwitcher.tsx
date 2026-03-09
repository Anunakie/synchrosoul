'use client'
import { useState } from 'react'
import { useTheme, THEMES, AppTheme } from '@/lib/theme-context'

export default function ThemeSwitcher() {
  const { theme, setTheme } = useTheme()
  const [open, setOpen] = useState(false)

  return (
    <div style={{ position: 'fixed', bottom: '5.5rem', right: '1rem', zIndex: 9999 }}>
      {open && (
        <div style={{ position: 'absolute', bottom: '3.4rem', right: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem', alignItems: 'flex-end' }}>
          {THEMES.map((t) => (
            <button
              key={t.id}
              onClick={() => { setTheme(t.id as AppTheme); setOpen(false) }}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.6rem',
                padding: '0.45rem 0.8rem', borderRadius: '2rem',
                border: theme === t.id ? '1px solid rgba(201,168,76,0.9)' : '1px solid rgba(255,255,255,0.15)',
                background: theme === t.id ? 'rgba(201,168,76,0.18)' : 'rgba(8,6,28,0.88)',
                backdropFilter: 'blur(12px)', cursor: 'pointer',
                color: theme === t.id ? '#c9a84c' : 'rgba(255,255,255,0.8)',
                fontSize: '0.78rem', fontFamily: 'inherit', letterSpacing: '0.05em',
                whiteSpace: 'nowrap', minWidth: '140px',
                boxShadow: theme === t.id ? '0 0 12px rgba(201,168,76,0.25)' : '0 2px 12px rgba(0,0,0,0.5)',
                transition: 'all 0.2s ease',
              }}
            >
              <div style={{
                width: '34px', height: '34px', borderRadius: '0.4rem', overflow: 'hidden', flexShrink: 0,
                border: '1px solid rgba(255,255,255,0.12)',
                backgroundImage: t.thumbnail ? `url(${t.thumbnail})` : undefined,
                backgroundSize: 'cover', backgroundPosition: 'center',
                background: t.thumbnail ? undefined : 'radial-gradient(ellipse at 30% 40%, rgba(120,60,200,0.9) 0%, rgba(20,10,60,1) 70%)',
              }} />
              <span>{t.emoji} {t.label}</span>
              {theme === t.id && (
                <span style={{ marginLeft: 'auto', color: '#c9a84c', fontSize: '0.7rem' }}>✓</span>
              )}
            </button>
          ))}
        </div>
      )}

      <button
        onClick={() => setOpen(o => !o)}
        title="Change background theme"
        style={{
          width: '2.6rem', height: '2.6rem', borderRadius: '50%',
          background: open ? 'rgba(201,168,76,0.25)' : 'rgba(8,6,28,0.82)',
          border: open ? '1px solid rgba(201,168,76,0.7)' : '1px solid rgba(255,255,255,0.2)',
          backdropFilter: 'blur(12px)', cursor: 'pointer', fontSize: '1.1rem',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: open ? '0 0 16px rgba(201,168,76,0.3)' : '0 2px 12px rgba(0,0,0,0.5)',
          transition: 'all 0.25s ease',
          transform: open ? 'rotate(30deg)' : 'rotate(0deg)',
        }}
      >
        🎨
      </button>
    </div>
  )
}
