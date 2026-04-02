'use client'

import { use, useState, useEffect } from 'react'

interface SharedDream {
  id: string
  title: string
  description: string
  dream_themes: string[]
  shared_at: string | null
  created_at: string
  author_name: string
  interpretation: string | null
  symbols: string[]
  moods: string[]
}

export default function SharedDreamPage({ params }: { params: Promise<{ dreamId: string }> }) {
  const { dreamId } = use(params)
  const [dream, setDream] = useState<SharedDream | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    async function fetchDream() {
      try {
        const res = await fetch(`/api/dream/${dreamId}`)
        if (!res.ok) {
          setNotFound(true)
          setLoading(false)
          return
        }
        const data = await res.json()
        if (data.dream) {
          setDream(data.dream)
        } else {
          setNotFound(true)
        }
      } catch {
        setNotFound(true)
      } finally {
        setLoading(false)
      }
    }
    fetchDream()
  }, [dreamId])

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr)
    return d.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  // ── LOADING STATE ──
  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0d0a2e 0%, #1a0a3e 50%, #0d1a3e 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: '1rem',
      }}>
        <div style={{ fontSize: '3rem', animation: 'pulse 2s ease-in-out infinite' }}>🌙</div>
        <p style={{ color: 'rgba(200,180,255,0.5)', fontSize: '0.9rem', fontFamily: 'Georgia, serif' }}>
          Loading dream from the cosmos...
        </p>
        <style>{`@keyframes pulse { 0%,100% { opacity: 0.5; transform: scale(1); } 50% { opacity: 1; transform: scale(1.1); } }`}</style>
      </div>
    )
  }

  // ── NOT FOUND STATE ──
  if (notFound || !dream) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0d0a2e 0%, #1a0a3e 50%, #0d1a3e 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: '1rem',
        padding: '2rem',
        textAlign: 'center',
      }}>
        <div style={{ fontSize: '4rem', opacity: 0.3 }}>🌑</div>
        <h1 style={{
          fontFamily: 'Georgia, serif',
          fontSize: '1.75rem',
          color: 'rgba(200,180,255,0.7)',
          fontWeight: 300,
        }}>
          This dream has faded from the cosmos
        </h1>
        <p style={{ color: 'rgba(200,180,255,0.4)', fontSize: '0.875rem', maxWidth: '400px', lineHeight: 1.6 }}>
          This dream may have been removed, unshared, or the link may be incorrect.
        </p>
        <a
          href="/"
          style={{
            marginTop: '1.5rem',
            padding: '0.75rem 2rem',
            borderRadius: '9999px',
            background: 'linear-gradient(135deg, rgba(100,60,180,0.4), rgba(60,30,120,0.4))',
            border: '1px solid rgba(160,100,255,0.4)',
            color: 'rgba(220,200,255,0.95)',
            textDecoration: 'none',
            fontSize: '0.9rem',
            fontWeight: 500,
          }}
        >
          ✨ Explore SynchroSoul
        </a>
      </div>
    )
  }

  // ── DREAM DISPLAY ──
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0d0a2e 0%, #1a0a3e 50%, #0d1a3e 100%)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: '2rem 1rem 3rem',
    }}>
      {/* ── HEADER ── */}
      <div style={{ textAlign: 'center', marginBottom: '2rem', maxWidth: '600px' }}>
        <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🌙</div>
        <p style={{
          fontSize: '0.65rem',
          textTransform: 'uppercase',
          letterSpacing: '0.25em',
          color: '#a78bfa',
          marginBottom: '0.5rem',
        }}>
          Shared Dream Vision
        </p>
        <h1 style={{
          fontFamily: 'Georgia, serif',
          fontSize: '1.75rem',
          color: '#f0c040',
          fontWeight: 400,
          lineHeight: 1.3,
          margin: '0 0 0.35rem',
        }}>
          {dream.title}
        </h1>
        <p style={{ color: 'rgba(200,180,255,0.45)', fontSize: '0.8rem' }}>
          Dreamt by <span style={{ color: '#a78bfa' }}>{dream.author_name}</span>
          {' · '}
          {formatDate(dream.created_at)}
        </p>
      </div>

      {/* ── DREAM CARD ── */}
      <div style={{
        width: '100%',
        maxWidth: '600px',
        background: 'rgba(255,255,255,0.05)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        border: '1px solid rgba(200,180,255,0.12)',
        borderRadius: '1.25rem',
        padding: '1.75rem 1.5rem',
        marginBottom: '1.5rem',
      }}>
        {/* Dream Description */}
        <div style={{
          color: 'rgba(240,235,255,0.85)',
          fontSize: '0.95rem',
          lineHeight: 1.75,
          fontFamily: 'Georgia, serif',
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
        }}>
          {dream.description}
        </div>

        {/* Symbols */}
        {dream.symbols && dream.symbols.length > 0 && (
          <div style={{ marginTop: '1.25rem', display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
            {dream.symbols.map((s, i) => (
              <span key={i} style={{
                fontSize: '1.3rem',
                padding: '0.15rem',
              }}>{s}</span>
            ))}
          </div>
        )}

        {/* Moods */}
        {dream.moods && dream.moods.length > 0 && (
          <div style={{ marginTop: '0.75rem', display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
            {dream.moods.map((m, i) => (
              <span key={i} style={{
                padding: '0.3rem 0.7rem',
                borderRadius: '9999px',
                background: 'rgba(167,139,250,0.1)',
                border: '1px solid rgba(167,139,250,0.2)',
                color: 'rgba(167,139,250,0.8)',
                fontSize: '0.72rem',
                fontWeight: 500,
              }}>{m}</span>
            ))}
          </div>
        )}
      </div>

      {/* ── THEMES / SYMBOLS PILLS ── */}
      {dream.dream_themes && dream.dream_themes.length > 0 && (
        <div style={{
          width: '100%',
          maxWidth: '600px',
          background: 'rgba(255,255,255,0.03)',
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(200,180,255,0.08)',
          borderRadius: '1rem',
          padding: '1.25rem 1.5rem',
          marginBottom: '1.5rem',
        }}>
          <p style={{
            fontSize: '0.65rem',
            textTransform: 'uppercase',
            letterSpacing: '0.2em',
            color: 'rgba(200,180,255,0.4)',
            marginBottom: '0.75rem',
          }}>
            🔮 AI-Extracted Themes & Symbols
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
            {dream.dream_themes.map((theme, i) => (
              <span key={i} style={{
                padding: '0.35rem 0.85rem',
                borderRadius: '9999px',
                background: 'rgba(167,139,250,0.12)',
                border: '1px solid rgba(167,139,250,0.25)',
                color: 'rgba(200,180,255,0.85)',
                fontSize: '0.75rem',
                fontWeight: 500,
                letterSpacing: '0.02em',
              }}>
                {theme}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* ── AI INTERPRETATION ── */}
      {dream.interpretation && (
        <div style={{
          width: '100%',
          maxWidth: '600px',
          background: 'rgba(240,192,64,0.04)',
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(240,192,64,0.15)',
          borderRadius: '1rem',
          padding: '1.25rem 1.5rem',
          marginBottom: '1.5rem',
        }}>
          <p style={{
            fontSize: '0.65rem',
            textTransform: 'uppercase',
            letterSpacing: '0.2em',
            color: 'rgba(240,192,64,0.5)',
            marginBottom: '0.75rem',
          }}>
            ✨ AI Dream Interpretation
          </p>
          <div style={{
            color: 'rgba(240,235,255,0.75)',
            fontSize: '0.875rem',
            lineHeight: 1.7,
            fontFamily: 'Georgia, serif',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
          }}>
            {dream.interpretation}
          </div>
        </div>
      )}

      {/* ── FOOTER CTA ── */}
      <div style={{
        width: '100%',
        maxWidth: '600px',
        textAlign: 'center',
        padding: '2rem 1rem',
        marginTop: '0.5rem',
      }}>
        <div style={{
          width: '60px',
          height: '1px',
          background: 'rgba(200,180,255,0.15)',
          margin: '0 auto 1.5rem',
        }} />
        <p style={{
          color: 'rgba(200,180,255,0.5)',
          fontSize: '0.85rem',
          marginBottom: '1rem',
          fontFamily: 'Georgia, serif',
          lineHeight: 1.6,
        }}>
          Dreams connect us across the cosmos.
          <br />
          Discover your own dream connections.
        </p>
        <a
          href="/"
          style={{
            display: 'inline-block',
            padding: '0.85rem 2.5rem',
            borderRadius: '9999px',
            background: 'linear-gradient(135deg, rgba(100,60,180,0.5), rgba(160,100,255,0.3))',
            border: '1px solid rgba(160,100,255,0.5)',
            color: '#f0c040',
            textDecoration: 'none',
            fontSize: '0.95rem',
            fontWeight: 600,
            letterSpacing: '0.03em',
            transition: 'all 0.2s',
          }}
        >
          ✨ Discover Your Dream Connections on SynchroSoul
        </a>
        <p style={{
          color: 'rgba(200,180,255,0.25)',
          fontSize: '0.7rem',
          marginTop: '1.5rem',
          letterSpacing: '0.1em',
        }}>
          SYNCHROSOUL · Where Souls Align
        </p>
      </div>
    </div>
  )
}
