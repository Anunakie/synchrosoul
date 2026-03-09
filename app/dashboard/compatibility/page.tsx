
'use client'
import { useState } from 'react'
import { ANGEL_MEANINGS } from '@/lib/angel-meanings'

const COMPAT: Record<string, Record<string, { score: number; label: string; description: string }>> = {
  '111': {
    '111': { score: 100, label: 'Twin Flame', description: 'Identical frequency — a mirror soul connection of the highest order.' },
    '222': { score: 88, label: 'Divine Union', description: 'New beginnings meet partnership. A powerful co-creation energy.' },
    '333': { score: 92, label: 'Ascended Bond', description: 'Manifestation amplified — together you call in miracles.' },
    '444': { score: 75, label: 'Grounded Light', description: 'Vision meets foundation. One dreams, the other builds.' },
    '555': { score: 70, label: 'Change Catalysts', description: 'Both in transformation — exciting but requires anchoring.' },
    '666': { score: 65, label: 'Heart Healers', description: 'New beginnings healing old wounds. Tender and transformative.' },
    '777': { score: 85, label: 'Mystic Pair', description: 'Spiritual seekers aligned. Deep soul recognition.' },
    '888': { score: 80, label: 'Abundance Creators', description: 'Manifestation power doubled. Material and spiritual wealth.' },
    '999': { score: 78, label: 'Completion Cycle', description: 'One beginning, one completing. A karmic soul contract.' },
    '1111': { score: 95, label: 'Portal Pair', description: 'Both seeing the same portal. Rare and cosmically significant.' },
  },
  '222': {
    '333': { score: 90, label: 'Sacred Trinity', description: 'Partnership with divine creativity. Deeply harmonious.' },
    '444': { score: 85, label: 'Stable Love', description: 'Partnership built on solid ground. Lasting and secure.' },
    '555': { score: 72, label: 'Evolving Together', description: 'Change within partnership. Growth requires communication.' },
    '777': { score: 88, label: 'Spiritual Partners', description: 'Harmony meets mysticism. A deeply intuitive bond.' },
    '888': { score: 82, label: 'Prosperous Union', description: 'Partnership and abundance. Building a beautiful life together.' },
    '999': { score: 76, label: 'Healing Partners', description: 'Partnership completing karmic cycles. Deeply healing.' },
    '1111': { score: 88, label: 'Awakened Pair', description: 'Partnership awakening to higher purpose together.' },
  },
  '333': {
    '444': { score: 80, label: 'Creator Builder', description: 'Creative vision with practical execution. Powerful team.' },
    '555': { score: 85, label: 'Expressive Explorers', description: 'Both love freedom and expression. Joyful and adventurous.' },
    '777': { score: 92, label: 'Cosmic Artists', description: 'Creativity meets spirituality. Deeply inspired connection.' },
    '888': { score: 78, label: 'Abundant Creators', description: 'Creative gifts manifesting abundance together.' },
    '999': { score: 82, label: 'Healing Artists', description: 'Creative expression healing the world together.' },
    '1111': { score: 90, label: 'Manifestation Masters', description: 'Triple creativity with portal energy. Magical together.' },
  },
  '444': {
    '555': { score: 68, label: 'Tension & Growth', description: 'Stability meets change. Challenging but deeply transformative.' },
    '777': { score: 85, label: 'Sacred Builders', description: 'Building spiritual foundations. Deeply purposeful.' },
    '888': { score: 90, label: 'Empire Builders', description: 'Foundation meets abundance. Building lasting legacy.' },
    '999': { score: 75, label: 'Completing Builders', description: 'Building toward completion. A purposeful karmic bond.' },
    '1111': { score: 82, label: 'Grounded Visionaries', description: 'Vision anchored in reality. Powerful manifestors.' },
  },
  '555': {
    '777': { score: 80, label: 'Free Mystics', description: 'Freedom-loving spiritual seekers. Exciting and expansive.' },
    '888': { score: 75, label: 'Abundant Adventurers', description: 'Change creating abundance. Dynamic and prosperous.' },
    '999': { score: 85, label: 'Transformers', description: 'Both in cycles of change and completion. Deeply karmic.' },
    '1111': { score: 88, label: 'Portal Explorers', description: 'Change and new beginnings. Constantly evolving together.' },
  },
  '777': {
    '888': { score: 88, label: 'Mystic Manifestors', description: 'Spiritual wisdom creating material abundance. Rare gift.' },
    '999': { score: 90, label: 'Enlightened Souls', description: 'Both near completion of spiritual cycles. Profound bond.' },
    '1111': { score: 95, label: 'Cosmic Seers', description: 'Two mystics at the portal. Extraordinarily rare connection.' },
  },
  '888': {
    '999': { score: 85, label: 'Abundant Completers', description: 'Abundance completing a great cycle. Powerful legacy.' },
    '1111': { score: 88, label: 'Manifestation Portal', description: 'Abundance flowing through the portal. Magical prosperity.' },
  },
  '999': {
    '1111': { score: 92, label: 'Completion Portal', description: 'One cycle ending as a new one begins. Deeply fated.' },
  },
}

function getCompatibility(a: string, b: string) {
  const result = COMPAT[a]?.[b] || COMPAT[b]?.[a]
  if (result) return result
  if (a === b) return { score: 100, label: 'Mirror Souls', description: 'Identical angel number frequency — a rare and powerful mirror connection.' }
  const aNum = parseInt(a)
  const bNum = parseInt(b)
  const diff = Math.abs(aNum - bNum)
  const score = Math.max(50, 85 - Math.floor(diff / 100) * 5)
  return { score, label: 'Cosmic Connection', description: 'Your numbers carry unique harmonic resonance. Every soul pairing has divine purpose.' }
}

const COMMON_NUMBERS = ['111','222','333','444','555','666','777','888','999','1111','1212','1234']

export default function CompatibilityPage() {
  const [numA, setNumA] = useState('')
  const [numB, setNumB] = useState('')
  const [result, setResult] = useState<{ score: number; label: string; description: string; meaningA: any; meaningB: any } | null>(null)

  function calculate() {
    if (!numA || !numB) return
    const compat = getCompatibility(numA, numB)
    const meaningA = ANGEL_MEANINGS[numA] || ANGEL_MEANINGS['default']
    const meaningB = ANGEL_MEANINGS[numB] || ANGEL_MEANINGS['default']
    setResult({ ...compat, meaningA, meaningB })
  }

  const scoreColor = result ? (result.score >= 90 ? '#ffd700' : result.score >= 80 ? '#c9a84c' : result.score >= 70 ? '#a78bfa' : '#60a5fa') : '#c9a84c'

  return (
    <div style={{ minHeight: '100vh', padding: '1.5rem 1rem 2rem', maxWidth: '480px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
        <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.8rem', color: 'rgba(220,200,255,0.95)', margin: 0 }}>Number Compatibility</h1>
        <p style={{ color: 'rgba(200,180,255,0.5)', fontSize: '0.8rem', marginTop: '0.25rem' }}>Discover the harmony between two angel numbers</p>
      </div>

      {/* Number A */}
      <div style={{ marginBottom: '1rem' }}>
        <label style={{ display: 'block', fontSize: '0.7rem', color: 'rgba(200,180,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>First Number</label>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '0.5rem' }}>
          {COMMON_NUMBERS.map(n => (
            <button key={n} onClick={() => setNumA(n)}
              style={{ padding: '0.35rem 0.65rem', borderRadius: '0.5rem', fontSize: '0.8rem', cursor: 'pointer', transition: 'all 0.15s',
                background: numA === n ? 'rgba(167,139,250,0.25)' : 'rgba(255,255,255,0.04)',
                border: numA === n ? '1px solid rgba(167,139,250,0.6)' : '1px solid rgba(255,255,255,0.08)',
                color: numA === n ? '#a78bfa' : 'rgba(200,180,255,0.6)' }}>{n}</button>
          ))}
        </div>
        <input value={numA} onChange={e => setNumA(e.target.value)} placeholder="Or type any number..."
          style={{ width: '100%', padding: '0.625rem 0.875rem', borderRadius: '0.625rem', background: 'rgba(8,6,28,0.88)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(220,200,255,0.9)', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' }} />
      </div>

      {/* VS divider */}
      <div style={{ textAlign: 'center', margin: '0.75rem 0', color: 'rgba(200,180,255,0.3)', fontFamily: 'Cormorant Garamond, serif', fontSize: '1.1rem', letterSpacing: '0.2em' }}>✦ VS ✦</div>

      {/* Number B */}
      <div style={{ marginBottom: '1.25rem' }}>
        <label style={{ display: 'block', fontSize: '0.7rem', color: 'rgba(200,180,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>Second Number</label>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '0.5rem' }}>
          {COMMON_NUMBERS.map(n => (
            <button key={n} onClick={() => setNumB(n)}
              style={{ padding: '0.35rem 0.65rem', borderRadius: '0.5rem', fontSize: '0.8rem', cursor: 'pointer', transition: 'all 0.15s',
                background: numB === n ? 'rgba(201,168,76,0.25)' : 'rgba(255,255,255,0.04)',
                border: numB === n ? '1px solid rgba(201,168,76,0.6)' : '1px solid rgba(255,255,255,0.08)',
                color: numB === n ? '#c9a84c' : 'rgba(200,180,255,0.6)' }}>{n}</button>
          ))}
        </div>
        <input value={numB} onChange={e => setNumB(e.target.value)} placeholder="Or type any number..."
          style={{ width: '100%', padding: '0.625rem 0.875rem', borderRadius: '0.625rem', background: 'rgba(8,6,28,0.88)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(220,200,255,0.9)', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' }} />
      </div>

      <button onClick={calculate} disabled={!numA || !numB}
        style={{ width: '100%', padding: '0.875rem', borderRadius: '0.75rem', fontSize: '0.9rem', fontWeight: 600, cursor: numA && numB ? 'pointer' : 'not-allowed', transition: 'all 0.2s', letterSpacing: '0.08em', textTransform: 'uppercase',
          background: numA && numB ? 'linear-gradient(135deg, rgba(167,139,250,0.3), rgba(201,168,76,0.3))' : 'rgba(255,255,255,0.04)',
          border: numA && numB ? '1px solid rgba(201,168,76,0.4)' : '1px solid rgba(255,255,255,0.06)',
          color: numA && numB ? 'rgba(220,200,255,0.9)' : 'rgba(200,180,255,0.3)' }}>
        Calculate Harmony
      </button>

      {result && (
        <div style={{ marginTop: '1.5rem' }}>
          {/* Score ring */}
          <div style={{ textAlign: 'center', padding: '1.5rem', borderRadius: '1rem', background: 'rgba(8,6,28,0.9)', border: '1px solid rgba(201,168,76,0.2)', backdropFilter: 'blur(12px)', marginBottom: '1rem' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '5rem', height: '5rem', borderRadius: '50%', border: '3px solid ' + scoreColor, background: scoreColor + '15', marginBottom: '0.75rem' }}>
              <span style={{ fontSize: '1.5rem', fontWeight: 700, color: scoreColor }}>{result.score}</span>
            </div>
            <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.4rem', color: scoreColor, marginBottom: '0.25rem' }}>{result.label}</div>
            <div style={{ fontSize: '0.85rem', color: 'rgba(200,180,255,0.7)', lineHeight: 1.5, maxWidth: '320px', margin: '0 auto' }}>{result.description}</div>
          </div>

          {/* Number meanings */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            {[{ num: numA, m: result.meaningA }, { num: numB, m: result.meaningB }].map(({ num, m }) => (
              <div key={num} style={{ padding: '0.875rem', borderRadius: '0.875rem', background: 'rgba(8,6,28,0.88)', border: '1px solid ' + (m?.color || '#c9a84c') + '33', backdropFilter: 'blur(8px)' }}>
                <div style={{ fontSize: '1.2rem', fontWeight: 700, color: m?.color || '#c9a84c', marginBottom: '0.25rem' }}>{num}</div>
                <div style={{ fontSize: '0.7rem', color: 'rgba(200,180,255,0.5)', marginBottom: '0.25rem' }}>{m?.title || 'Angel Number'}</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem' }}>
                  {(m?.keywords || []).slice(0, 2).map((k: string) => (
                    <span key={k} style={{ fontSize: '0.6rem', padding: '0.15rem 0.4rem', borderRadius: '9999px', background: (m?.color || '#c9a84c') + '22', color: m?.color || '#c9a84c', border: '1px solid ' + (m?.color || '#c9a84c') + '33' }}>{k}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
