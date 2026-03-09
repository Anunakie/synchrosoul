'use client'
import { useState } from 'react'
import { calcLifePath, calcSoulUrge, calcDestiny, LIFE_PATH_DATA } from '@/lib/numerology'

const COMPAT_MATRIX: Record<number, number[]> = {
  1: [1,3,5,9], 2: [2,4,6,8], 3: [1,3,5,9], 4: [2,4,6,8],
  5: [1,3,5,7], 6: [2,4,6,9], 7: [5,7,11], 8: [2,4,6,8],
  9: [1,3,6,9], 11: [2,7,11,22], 22: [4,8,11,22], 33: [6,9,33],
}

const ANGEL_COMPAT: Record<string, { score: number; message: string }> = {
  '111-111': { score: 99, message: 'Rare mirror manifestors — you amplify each other’s reality.' },
  '111-1111': { score: 97, message: 'Twin manifestation energy. What you both think, becomes.' },
  '222-222': { score: 95, message: 'Perfect divine timing alignment. You move as one.' },
  '333-333': { score: 93, message: 'Creative soul twins. Your combined expression is unstoppable.' },
  '444-444': { score: 91, message: 'Angelic protection doubled. You are each other’s safe harbor.' },
  '555-555': { score: 88, message: 'Change catalysts. Together you transform everything you touch.' },
  '777-777': { score: 96, message: 'Spiritual masters. Your connection transcends the physical.' },
  '888-888': { score: 90, message: 'Abundance magnets. Together you attract unlimited prosperity.' },
  '999-999': { score: 94, message: 'Old souls completing a sacred cycle together.' },
  '1111-1111': { score: 100, message: 'The rarest connection. You are cosmic mirrors of each other.' },
}

function getCompatScore(lp1: number, lp2: number): number {
  const compatible = COMPAT_MATRIX[lp1] || []
  if (lp1 === lp2) return 85 + Math.floor(Math.random() * 10)
  if (compatible.includes(lp2)) return 75 + Math.floor(Math.random() * 15)
  return 45 + Math.floor(Math.random() * 25)
}

function getCompatLabel(score: number): { label: string; color: string; emoji: string } {
  if (score >= 90) return { label: 'Twin Flame', color: '#ff6b9d', emoji: '🔥' }
  if (score >= 80) return { label: 'Soul Mate', color: '#c9a84c', emoji: '✨' }
  if (score >= 70) return { label: 'Cosmic Partner', color: '#a78bfa', emoji: '💫' }
  if (score >= 60) return { label: 'Spirit Guide', color: '#60a5fa', emoji: '🌟' }
  return { label: 'Soul Student', color: '#34d399', emoji: '🌱' }
}

function getAngelCompat(nums1: string[], nums2: string[]): { score: number; message: string } | null {
  for (const n1 of nums1) {
    for (const n2 of nums2) {
      const key1 = n1 + '-' + n2
      const key2 = n2 + '-' + n1
      if (ANGEL_COMPAT[key1]) return ANGEL_COMPAT[key1]
      if (ANGEL_COMPAT[key2]) return ANGEL_COMPAT[key2]
      if (n1 === n2) return { score: 88 + Math.floor(Math.random() * 10), message: 'You both see ' + n1 + ' — a powerful cosmic synchronicity binding your paths.' }
    }
  }
  return null
}

interface PersonInput {
  name: string
  birthdate: string
  numbers: string
}

export default function CompatibilityPage() {
  const [person1, setPerson1] = useState<PersonInput>({ name: '', birthdate: '', numbers: '' })
  const [person2, setPerson2] = useState<PersonInput>({ name: '', birthdate: '', numbers: '' })
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  function calculate() {
    setLoading(true)
    setTimeout(() => {
      const lp1 = person1.birthdate ? calcLifePath(person1.birthdate) : 0
      const lp2 = person2.birthdate ? calcLifePath(person2.birthdate) : 0
      const su1 = person1.name ? calcSoulUrge(person1.name) : 0
      const su2 = person2.name ? calcSoulUrge(person2.name) : 0
      const dest1 = person1.name ? calcDestiny(person1.name) : 0
      const dest2 = person2.name ? calcDestiny(person2.name) : 0

      const nums1 = person1.numbers.split(',').map(n => n.trim()).filter(Boolean)
      const nums2 = person2.numbers.split(',').map(n => n.trim()).filter(Boolean)

      const lpScore = lp1 && lp2 ? getCompatScore(lp1, lp2) : 70
      const suScore = su1 && su2 ? getCompatScore(su1, su2) : 70
      const destScore = dest1 && dest2 ? getCompatScore(dest1, dest2) : 70
      const angelCompat = getAngelCompat(nums1, nums2)
      const sharedNums = nums1.filter(n => nums2.includes(n))
      const angelBonus = sharedNums.length * 5

      const overall = Math.min(100, Math.round((lpScore * 0.4 + suScore * 0.3 + destScore * 0.3) + angelBonus))
      const label = getCompatLabel(overall)

      setResult({
        overall, label,
        lp1, lp2, su1, su2, dest1, dest2,
        lpScore, suScore, destScore,
        sharedNums, angelCompat,
        nums1, nums2,
      })
      setLoading(false)
    }, 1200)
  }

  const canCalculate = (person1.birthdate || person1.name) && (person2.birthdate || person2.name)
  const card = { background: 'rgba(8,6,28,0.88)', border: '1px solid rgba(200,180,255,0.12)', borderRadius: '1.25rem', backdropFilter: 'blur(12px)' } as React.CSSProperties
  const inp = { background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(200,180,255,0.15)', borderRadius: '0.6rem', color: 'rgba(220,200,255,0.9)', padding: '0.65rem 0.85rem', fontSize: '0.88rem', width: '100%', outline: 'none', boxSizing: 'border-box' as const, fontFamily: 'inherit' } as React.CSSProperties

  return (
    <div style={{ maxWidth: '640px', margin: '0 auto', padding: '1.5rem 1rem 2rem' }}>
      <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.8rem', color: 'rgba(220,200,255,0.95)', margin: '0 0 0.25rem', fontWeight: 400 }}>Soul Compatibility</h1>
      <p style={{ color: 'rgba(180,160,255,0.5)', fontSize: '0.8rem', margin: '0 0 1.5rem' }}>Discover your cosmic connection through numerology</p>

      {/* Input cards */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
        {([{ p: person1, set: setPerson1, label: 'Person 1' }, { p: person2, set: setPerson2, label: 'Person 2' }] as const).map(({ p, set, label }, idx) => (
          <div key={idx} style={{ ...card, padding: '1.25rem' }}>
            <div style={{ color: 'rgba(180,160,255,0.5)', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.75rem' }}>{label}</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <input style={inp} placeholder="Name" value={p.name} onChange={e => set({ ...p, name: e.target.value })} />
              <input type="date" style={inp} value={p.birthdate} onChange={e => set({ ...p, birthdate: e.target.value })} />
              <input style={inp} placeholder="Angel numbers (111,444...)" value={p.numbers} onChange={e => set({ ...p, numbers: e.target.value })} />
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={calculate}
        disabled={!canCalculate || loading}
        style={{ width: '100%', padding: '1rem', borderRadius: '0.75rem', cursor: canCalculate ? 'pointer' : 'default', background: canCalculate ? 'rgba(167,139,250,0.2)' : 'rgba(255,255,255,0.04)', border: canCalculate ? '1px solid rgba(167,139,250,0.5)' : '1px solid rgba(200,180,255,0.08)', color: canCalculate ? 'rgba(220,200,255,0.95)' : 'rgba(180,160,255,0.3)', fontSize: '0.95rem', fontFamily: 'inherit', marginBottom: '1.5rem', transition: 'all 0.2s' }}
      >{loading ? '✦ Reading the cosmos...' : '✦ Calculate Compatibility'}</button>

      {/* Results */}
      {result && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Overall score */}
          <div style={{ ...card, padding: '2rem', textAlign: 'center', background: 'rgba(20,10,50,0.95)', border: `1px solid ${result.label.color}44`, position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', top: '-40px', left: '50%', transform: 'translateX(-50%)', width: '200px', height: '200px', borderRadius: '50%', background: `radial-gradient(circle, ${result.label.color}18 0%, transparent 70%)`, pointerEvents: 'none' }} />
            <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>{result.label.emoji}</div>
            <div style={{ color: result.label.color, fontSize: '3.5rem', fontFamily: 'Cormorant Garamond, serif', fontWeight: 700, lineHeight: 1 }}>{result.overall}%</div>
            <div style={{ color: result.label.color, fontSize: '1.1rem', fontWeight: 600, marginTop: '0.4rem' }}>{result.label.label}</div>
            <div style={{ color: 'rgba(180,160,255,0.6)', fontSize: '0.82rem', marginTop: '0.5rem' }}>
              {person1.name || 'Person 1'} & {person2.name || 'Person 2'}
            </div>
          </div>

          {/* Breakdown */}
          <div style={{ ...card, padding: '1.25rem' }}>
            <div style={{ color: 'rgba(180,160,255,0.4)', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.75rem' }}>Numerology Breakdown</div>
            {[
              { label: 'Life Path', v1: result.lp1, v2: result.lp2, score: result.lpScore, color: '#c9a84c' },
              { label: 'Soul Urge', v1: result.su1, v2: result.su2, score: result.suScore, color: '#a78bfa' },
              { label: 'Destiny', v1: result.dest1, v2: result.dest2, score: result.destScore, color: '#60a5fa' },
            ].filter(r => r.v1 && r.v2).map(row => (
              <div key={row.label} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.75rem' }}>
                <div style={{ width: '70px', color: 'rgba(200,180,255,0.6)', fontSize: '0.72rem' }}>{row.label}</div>
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: `${row.color}22`, border: `1px solid ${row.color}44`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: row.color, fontSize: '0.8rem', fontWeight: 700, flexShrink: 0 }}>{row.v1}</div>
                <div style={{ flex: 1, height: '4px', borderRadius: '9999px', background: 'rgba(255,255,255,0.06)', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: row.score + '%', background: `linear-gradient(90deg, ${row.color}88, ${row.color})`, borderRadius: '9999px', transition: 'width 1s ease' }} />
                </div>
                <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: `${row.color}22`, border: `1px solid ${row.color}44`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: row.color, fontSize: '0.8rem', fontWeight: 700, flexShrink: 0 }}>{row.v2}</div>
                <div style={{ width: '32px', color: row.color, fontSize: '0.72rem', fontWeight: 700, textAlign: 'right' }}>{row.score}%</div>
              </div>
            ))}
          </div>

          {/* Shared angel numbers */}
          {result.sharedNums.length > 0 && (
            <div style={{ ...card, padding: '1.25rem' }}>
              <div style={{ color: 'rgba(180,160,255,0.4)', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.75rem' }}>Shared Angel Numbers ✦</div>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {result.sharedNums.map((n: string) => (
                  <span key={n} style={{ padding: '0.35rem 0.85rem', borderRadius: '2rem', background: 'rgba(201,168,76,0.15)', border: '1px solid rgba(201,168,76,0.4)', color: '#c9a84c', fontSize: '0.85rem', fontWeight: 600 }}>{n}</span>
                ))}
              </div>
            </div>
          )}

          {/* Angel number message */}
          {result.angelCompat && (
            <div style={{ ...card, padding: '1.25rem', background: 'rgba(20,10,50,0.92)', border: '1px solid rgba(201,168,76,0.2)' }}>
              <div style={{ color: '#c9a84c', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>Cosmic Message</div>
              <p style={{ color: 'rgba(220,200,255,0.85)', fontSize: '0.9rem', lineHeight: 1.7, margin: 0, fontStyle: 'italic', fontFamily: 'Cormorant Garamond, serif' }}>{result.angelCompat.message}</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
