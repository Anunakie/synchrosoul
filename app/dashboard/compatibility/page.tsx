'use client'
import { useState } from 'react'
import { calcLifePath, calcSoulUrge, calcDestiny } from '@/lib/numerology'

function getCompatScore(a: number, b: number): number {
  const diff = Math.abs(a - b)
  if (diff === 0) return 100
  if (diff === 1 || diff === 8) return 88
  if (diff === 2 || diff === 7) return 72
  if (diff === 3 || diff === 6) return 65
  if (diff === 4 || diff === 5) return 55
  return 50
}

function getCompatLabel(score: number): { label: string; color: string; desc: string } {
  if (score >= 90) return { label: 'Twin Flame', color: '#c9a84c', desc: 'A rare and profound soul connection. You mirror each other perfectly.' }
  if (score >= 75) return { label: 'Soul Mate', color: '#a78bfa', desc: 'Deep resonance and natural harmony. This connection feels fated.' }
  if (score >= 60) return { label: 'Kindred Spirit', color: '#60a5fa', desc: 'Strong compatibility with room to grow and learn from each other.' }
  if (score >= 45) return { label: 'Complementary', color: '#34d399', desc: 'Different energies that balance and complete each other beautifully.' }
  return { label: 'Growth Path', color: '#fb923c', desc: 'Challenging but transformative. This connection accelerates your evolution.' }
}

export default function CompatibilityPage() {
  const [dob1, setDob1] = useState('')
  const [dob2, setDob2] = useState('')
  const [name1, setName1] = useState('')
  const [name2, setName2] = useState('')
  const [result, setResult] = useState<any>(null)

  function calculate() {
    if (!dob1 || !dob2) return
    const p1 = { lifePathNumber: calcLifePath(dob1), soulUrgeNumber: calcSoulUrge(name1 || "Person One"), destinyNumber: calcDestiny(name1 || "Person One") }
    const p2 = { lifePathNumber: calcLifePath(dob2), soulUrgeNumber: calcSoulUrge(name2 || "Person Two"), destinyNumber: calcDestiny(name2 || "Person Two") }
    const lpScore = getCompatScore(p1.lifePathNumber, p2.lifePathNumber)
    const suScore = getCompatScore(p1.soulUrgeNumber, p2.soulUrgeNumber)
    const dnScore = getCompatScore(p1.destinyNumber, p2.destinyNumber)
    const overall = Math.round((lpScore * 0.5) + (suScore * 0.3) + (dnScore * 0.2))
    setResult({ p1, p2, lpScore, suScore, dnScore, overall, label: getCompatLabel(overall) })
  }

  const card = { background: 'rgba(8,6,28,0.88)', border: '1px solid rgba(200,180,255,0.12)', borderRadius: '1.25rem', backdropFilter: 'blur(12px)' } as React.CSSProperties
  const input = { width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(200,180,255,0.15)', borderRadius: '0.75rem', padding: '0.65rem 0.875rem', color: 'rgba(220,200,255,0.9)', fontSize: '0.88rem', outline: 'none', boxSizing: 'border-box' as const }

  return (
    <div style={{ maxWidth: '640px', margin: '0 auto', padding: '1.5rem 1rem 2rem' }}>
      <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.8rem', color: 'rgba(220,200,255,0.95)', margin: '0 0 0.25rem', fontWeight: 400 }}>Compatibility</h1>
      <p style={{ color: 'rgba(180,160,255,0.5)', fontSize: '0.8rem', margin: '0 0 1.5rem' }}>Discover your numerological soul connection</p>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
        {[{ dob: dob1, setDob: setDob1, name: name1, setName: setName1, label: 'Person 1', emoji: '✨' },
          { dob: dob2, setDob: setDob2, name: name2, setName: setName2, label: 'Person 2', emoji: '💞' }].map((p, i) => (
          <div key={i} style={{ ...card, padding: '1rem' }}>
            <div style={{ color: 'rgba(180,160,255,0.5)', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.75rem' }}>{p.emoji} {p.label}</div>
            <input value={p.name} onChange={e => p.setName(e.target.value)} placeholder="Name (optional)" style={{ ...input, marginBottom: '0.5rem' }} />
            <input type="date" value={p.dob} onChange={e => p.setDob(e.target.value)} style={{ ...input }} />
          </div>
        ))}
      </div>

      <button
        onClick={calculate}
        disabled={!dob1 || !dob2}
        style={{ width: '100%', padding: '0.875rem', borderRadius: '0.875rem', background: dob1 && dob2 ? 'linear-gradient(135deg, #7c3aed, #a78bfa)' : 'rgba(255,255,255,0.05)', border: 'none', color: dob1 && dob2 ? 'white' : 'rgba(180,160,255,0.3)', fontSize: '0.9rem', fontWeight: 600, cursor: dob1 && dob2 ? 'pointer' : 'default', marginBottom: '1.5rem', letterSpacing: '0.03em' }}
      >Calculate Soul Compatibility</button>

      {result && (
        <>
          {/* Overall score */}
          <div style={{ ...card, padding: '2rem', textAlign: 'center', marginBottom: '1rem', border: `1px solid ${result.label.color}33` }}>
            <div style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.12em', color: 'rgba(180,160,255,0.4)', marginBottom: '0.75rem' }}>Soul Compatibility Score</div>
            <div style={{ fontSize: '4rem', fontFamily: 'Cormorant Garamond, serif', color: result.label.color, lineHeight: 1, marginBottom: '0.5rem', fontWeight: 700 }}>{result.overall}%</div>
            <div style={{ color: result.label.color, fontSize: '1.1rem', fontFamily: 'Cormorant Garamond, serif', marginBottom: '0.5rem' }}>{result.label.label}</div>
            <p style={{ color: 'rgba(200,180,255,0.65)', fontSize: '0.85rem', margin: 0, lineHeight: 1.6 }}>{result.label.desc}</p>
          </div>

          {/* Breakdown */}
          <div style={{ ...card, padding: '1.25rem', marginBottom: '1rem' }}>
            <div style={{ color: 'rgba(180,160,255,0.4)', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.875rem' }}>Compatibility Breakdown</div>
            {[
              { label: 'Life Path', score: result.lpScore, weight: '50%', a: result.p1.lifePathNumber, b: result.p2.lifePathNumber },
              { label: 'Soul Urge', score: result.suScore, weight: '30%', a: result.p1.soulUrgeNumber, b: result.p2.soulUrgeNumber },
              { label: 'Destiny', score: result.dnScore, weight: '20%', a: result.p1.destinyNumber, b: result.p2.destinyNumber },
            ].map(row => (
              <div key={row.label} style={{ marginBottom: '0.875rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                  <span style={{ color: 'rgba(200,180,255,0.7)', fontSize: '0.8rem' }}>{row.label} <span style={{ color: 'rgba(180,160,255,0.35)', fontSize: '0.7rem' }}>({row.a} & {row.b})</span></span>
                  <span style={{ color: 'rgba(220,200,255,0.8)', fontSize: '0.8rem', fontWeight: 600 }}>{row.score}%</span>
                </div>
                <div style={{ height: '6px', borderRadius: '3px', background: 'rgba(255,255,255,0.05)', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${row.score}%`, background: `linear-gradient(90deg, #7c3aed, #a78bfa)`, borderRadius: '3px', transition: 'width 0.6s' }} />
                </div>
              </div>
            ))}
          </div>

          {/* Number profiles */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            {[{ p: result.p1, name: name1 || 'Person 1' }, { p: result.p2, name: name2 || 'Person 2' }].map((item, i) => (
              <div key={i} style={{ ...card, padding: '1rem' }}>
                <div style={{ color: 'rgba(180,160,255,0.5)', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.75rem' }}>{item.name}</div>
                {[['Life Path', item.p.lifePathNumber], ['Soul Urge', item.p.soulUrgeNumber], ['Destiny', item.p.destinyNumber]].map(([label, val]) => (
                  <div key={label as string} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                    <span style={{ color: 'rgba(180,160,255,0.5)', fontSize: '0.75rem' }}>{label}</span>
                    <span style={{ color: '#a78bfa', fontSize: '0.85rem', fontWeight: 700 }}>{val}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
