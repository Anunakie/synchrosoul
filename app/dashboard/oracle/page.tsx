'use client'
import { useState, useEffect } from 'react'
import { askOracle, saveOracleReading, getOracleHistory, OracleReading } from '@/lib/oracle'

const SUGGESTED = [
  'What is the universe trying to tell me right now?',
  'Am I on the right path with my career?',
  'What do I need to release to move forward?',
  'Is this relationship aligned with my highest good?',
  'What should I focus on this week?',
]

export default function OraclePage() {
  const [question, setQuestion] = useState('')
  const [reading, setReading] = useState<OracleReading | null>(null)
  const [history, setHistory] = useState<OracleReading[]>([])
  const [loading, setLoading] = useState(false)
  const [showHistory, setShowHistory] = useState(false)

  useEffect(() => {
    setHistory(getOracleHistory())
  }, [])

  function handleAsk() {
    if (!question.trim()) return
    setLoading(true)
    setTimeout(() => {
      const r = askOracle(question)
      saveOracleReading(r)
      setReading(r)
      setHistory(getOracleHistory())
      setLoading(false)
    }, 1800)
  }

  return (
    <div style={{ maxWidth: '680px', margin: '0 auto', padding: '2rem 1rem 6rem' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🔮</div>
        <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2rem', fontWeight: 300, color: 'rgba(220,200,255,0.95)', letterSpacing: '0.05em', margin: 0 }}>Angel Number Oracle</h1>
        <p style={{ color: 'rgba(200,180,255,0.5)', fontSize: '0.8rem', letterSpacing: '0.1em', marginTop: '0.5rem' }}>Ask the universe. Receive through your numbers.</p>
      </div>

      {/* Question input */}
      <div style={{ background: 'rgba(8,6,28,0.85)', border: '1px solid rgba(200,180,255,0.15)', borderRadius: '1.25rem', padding: '1.5rem', marginBottom: '1rem', backdropFilter: 'blur(12px)' }}>
        <textarea
          value={question}
          onChange={e => setQuestion(e.target.value)}
          placeholder="Ask the oracle anything... What is the universe trying to tell me?"
          rows={3}
          style={{ width: '100%', background: 'transparent', border: 'none', outline: 'none', color: 'rgba(220,200,255,0.9)', fontSize: '0.95rem', lineHeight: 1.7, resize: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }}
        />
        <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.75rem' }}>
          <button
            onClick={handleAsk}
            disabled={!question.trim() || loading}
            style={{ padding: '0.6rem 1.5rem', background: question.trim() && !loading ? 'rgba(139,92,246,0.3)' : 'rgba(139,92,246,0.1)', border: '1px solid rgba(139,92,246,0.4)', borderRadius: '9999px', color: question.trim() && !loading ? 'rgba(200,180,255,0.9)' : 'rgba(200,180,255,0.3)', cursor: question.trim() && !loading ? 'pointer' : 'default', fontSize: '0.85rem', letterSpacing: '0.05em', transition: 'all 0.2s' }}
          >
            {loading ? 'Consulting the cosmos...' : 'Ask the Oracle ✦'}
          </button>
        </div>
      </div>

      {/* Suggested questions */}
      {!reading && (
        <div style={{ marginBottom: '1.5rem' }}>
          <p style={{ color: 'rgba(200,180,255,0.35)', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '0.75rem' }}>Suggested questions</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {SUGGESTED.map(s => (
              <button key={s} onClick={() => setQuestion(s)} style={{ padding: '0.4rem 0.85rem', background: 'rgba(8,6,28,0.7)', border: '1px solid rgba(200,180,255,0.12)', borderRadius: '9999px', color: 'rgba(200,180,255,0.55)', fontSize: '0.75rem', cursor: 'pointer', transition: 'all 0.2s' }}>{s}</button>
            ))}
          </div>
        </div>
      )}

      {/* Loading animation */}
      {loading && (
        <div style={{ textAlign: 'center', padding: '3rem', background: 'rgba(8,6,28,0.85)', borderRadius: '1.25rem', border: '1px solid rgba(139,92,246,0.2)', backdropFilter: 'blur(12px)' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem', animation: 'pulse 2s infinite' }}>🔮</div>
          <p style={{ color: 'rgba(200,180,255,0.6)', fontFamily: 'Cormorant Garamond, serif', fontSize: '1.1rem', fontStyle: 'italic' }}>The oracle is reading your number field...</p>
        </div>
      )}

      {/* Reading result */}
      {reading && !loading && (
        <div style={{ marginBottom: '1.5rem' }}>
          {/* Guiding number */}
          <div style={{ background: 'rgba(8,6,28,0.85)', border: `1px solid ${reading.guidingColor}33`, borderRadius: '1.25rem', padding: '1.5rem', marginBottom: '1rem', backdropFilter: 'blur(12px)', textAlign: 'center' }}>
            <div style={{ width: '4rem', height: '4rem', borderRadius: '50%', background: `${reading.guidingColor}22`, border: `2px solid ${reading.guidingColor}55`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.75rem' }}>
              <span style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.1rem', color: reading.guidingColor, fontWeight: 600 }}>{reading.guidingNumber}</span>
            </div>
            <p style={{ color: 'rgba(200,180,255,0.5)', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.15em', margin: '0 0 0.25rem' }}>Your guiding number</p>
            <p style={{ color: 'rgba(220,200,255,0.7)', fontSize: '0.85rem', margin: 0 }}>{reading.guidingMeaning}</p>
          </div>

          {/* Oracle response */}
          <div style={{ background: 'rgba(8,6,28,0.85)', border: '1px solid rgba(201,168,76,0.2)', borderRadius: '1.25rem', padding: '1.5rem', marginBottom: '1rem', backdropFilter: 'blur(12px)' }}>
            <p style={{ color: 'rgba(200,180,255,0.4)', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.15em', margin: '0 0 0.75rem' }}>Oracle speaks</p>
            <p style={{ color: 'rgba(220,200,255,0.9)', lineHeight: 1.8, fontSize: '1rem', margin: '0 0 1rem', fontStyle: 'italic', fontFamily: 'Cormorant Garamond, serif' }}>{reading.response}</p>
            <p style={{ color: 'rgba(200,180,255,0.55)', lineHeight: 1.7, fontSize: '0.85rem', margin: 0, borderTop: '1px solid rgba(200,180,255,0.08)', paddingTop: '0.75rem' }}>{reading.numerologyNote}</p>
          </div>

          {/* Ask again */}
          <button onClick={() => { setReading(null); setQuestion('') }} style={{ width: '100%', padding: '0.75rem', background: 'transparent', border: '1px solid rgba(200,180,255,0.15)', borderRadius: '9999px', color: 'rgba(200,180,255,0.5)', cursor: 'pointer', fontSize: '0.8rem', letterSpacing: '0.1em' }}>Ask another question</button>
        </div>
      )}

      {/* History */}
      {history.length > 0 && (
        <div>
          <button onClick={() => setShowHistory(h => !h)} style={{ width: '100%', padding: '0.75rem', background: 'rgba(8,6,28,0.6)', border: '1px solid rgba(200,180,255,0.1)', borderRadius: '1rem', color: 'rgba(200,180,255,0.5)', cursor: 'pointer', fontSize: '0.8rem', letterSpacing: '0.1em', marginBottom: '0.75rem' }}>
            {showHistory ? 'Hide' : 'Show'} Past Readings ({history.length})
          </button>
          {showHistory && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {history.slice(0, 5).map((h, i) => (
                <div key={i} style={{ background: 'rgba(8,6,28,0.75)', border: '1px solid rgba(200,180,255,0.08)', borderRadius: '1rem', padding: '1rem', backdropFilter: 'blur(8px)' }}>
                  <p style={{ color: 'rgba(200,180,255,0.4)', fontSize: '0.7rem', margin: '0 0 0.4rem' }}>{new Date(h.timestamp).toLocaleDateString()}</p>
                  <p style={{ color: 'rgba(220,200,255,0.7)', fontSize: '0.85rem', margin: '0 0 0.5rem', fontStyle: 'italic' }}>Q: {h.question}</p>
                  <p style={{ color: 'rgba(200,180,255,0.55)', fontSize: '0.8rem', margin: 0, lineHeight: 1.6 }}>{h.response}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
