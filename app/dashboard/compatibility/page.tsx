'use client'
import { useState } from 'react'
import { calcLifePath, calcSoulUrge, calcDestiny, LIFE_PATH_DATA } from '@/lib/numerology'

const COMPAT_MEANINGS: Record<number, { title: string; desc: string; color: string }> = {
  1: { title: 'The Pioneer', desc: 'Independent, ambitious, leadership energy', color: '#f87171' },
  2: { title: 'The Diplomat', desc: 'Sensitive, cooperative, harmony-seeking', color: '#fb923c' },
  3: { title: 'The Creator', desc: 'Expressive, joyful, artistic spirit', color: '#fbbf24' },
  4: { title: 'The Builder', desc: 'Stable, practical, foundation-laying', color: '#34d399' },
  5: { title: 'The Adventurer', desc: 'Free-spirited, curious, change-loving', color: '#22d3ee' },
  6: { title: 'The Nurturer', desc: 'Caring, responsible, home-centered', color: '#60a5fa' },
  7: { title: 'The Seeker', desc: 'Mystical, analytical, truth-seeking', color: '#818cf8' },
  8: { title: 'The Achiever', desc: 'Powerful, material mastery, abundance', color: '#a78bfa' },
  9: { title: 'The Humanitarian', desc: 'Compassionate, wise, universal love', color: '#f472b6' },
  11: { title: 'The Illuminator', desc: 'Intuitive master, spiritual messenger', color: '#e0e7ff' },
  22: { title: 'The Master Builder', desc: 'Visionary architect of great works', color: '#c9a84c' },
  33: { title: 'The Master Teacher', desc: 'Highest vibration, cosmic healer', color: '#fde68a' },
}

const PAIR_COMPAT: Record<string, { score: number; title: string; desc: string }> = {
  '1-1': { score: 72, title: 'Twin Flames of Ambition', desc: 'Two leaders who must learn to take turns. Magnetic but competitive.' },
  '1-2': { score: 88, title: 'Yin & Yang Union', desc: 'The pioneer and the peacemaker — beautifully balanced opposites.' },
  '1-3': { score: 85, title: 'Creative Fire', desc: 'Inspiring and energetic. You push each other to shine.' },
  '1-4': { score: 65, title: 'Vision Meets Structure', desc: 'Tension between freedom and stability. Growth through compromise.' },
  '1-5': { score: 78, title: 'Adventure Seekers', desc: 'Both love freedom. Exciting but may lack grounding.' },
  '1-6': { score: 70, title: 'Leader & Nurturer', desc: 'Complementary roles. 6 softens 1 edges beautifully.' },
  '1-7': { score: 75, title: 'Mind & Will', desc: 'Deep intellectual bond. Both need space to thrive.' },
  '1-8': { score: 80, title: 'Power Couple', desc: 'Unstoppable when aligned. Watch for ego clashes.' },
  '1-9': { score: 82, title: 'Visionary Souls', desc: 'Inspiring combination. 9 wisdom guides 1 drive.' },
  '2-2': { score: 90, title: 'Soul Mirror', desc: 'Deep emotional understanding. Almost telepathic connection.' },
  '2-3': { score: 87, title: 'Heart & Art', desc: 'Warm, creative, joyful union. Natural harmony.' },
  '2-4': { score: 83, title: 'Safe Harbor', desc: 'Stable and nurturing. A relationship built to last.' },
  '2-5': { score: 60, title: 'Stability vs Freedom', desc: 'Challenging but growth-inducing. Requires deep trust.' },
  '2-6': { score: 95, title: 'Divine Partnership', desc: 'One of the most harmonious pairings. Pure love energy.' },
  '2-7': { score: 72, title: 'Mystic & Empath', desc: 'Spiritually rich but emotionally complex. Requires patience.' },
  '2-8': { score: 68, title: 'Heart vs Power', desc: '8 ambition can overwhelm 2 sensitivity. Balance is key.' },
  '2-9': { score: 88, title: 'Compassion Squared', desc: 'Both deeply caring. A relationship that heals the world.' },
  '3-3': { score: 85, title: 'Double Joy', desc: 'Playful, creative, fun. Can lack depth without effort.' },
  '3-4': { score: 65, title: 'Dream vs Reality', desc: '3 dreams, 4 builds. Friction that can create magic.' },
  '3-5': { score: 90, title: 'Free Spirits', desc: 'Adventurous, spontaneous, electric. Never boring.' },
  '3-6': { score: 88, title: 'Love & Laughter', desc: 'Warm, expressive, family-oriented. Beautiful home life.' },
  '3-7': { score: 70, title: 'Art & Philosophy', desc: 'Intellectually stimulating. 7 grounds 3 scattered energy.' },
  '3-8': { score: 75, title: 'Charm & Power', desc: '3 charisma + 8 ambition = a formidable pair.' },
  '3-9': { score: 92, title: 'Creative Humanitarians', desc: 'Deeply aligned values. Inspiring and world-changing together.' },
  '4-4': { score: 80, title: 'Rock Solid', desc: 'Extremely stable. May need to inject more spontaneity.' },
  '4-5': { score: 55, title: 'Order vs Chaos', desc: 'Most challenging pairing. Requires enormous mutual respect.' },
  '4-6': { score: 88, title: 'Home Builders', desc: 'Both value security and family. A deeply grounded love.' },
  '4-7': { score: 82, title: 'Wisdom & Work', desc: '7 insight + 4 diligence = quiet, profound partnership.' },
  '4-8': { score: 85, title: 'Empire Builders', desc: 'Powerfully productive together. Material success is natural.' },
  '4-9': { score: 70, title: 'Practical Idealists', desc: '9 inspires, 4 executes. Can be deeply fulfilling.' },
  '5-5': { score: 75, title: 'Wild & Free', desc: 'Thrilling but unstable. Both must choose to commit.' },
  '5-6': { score: 65, title: 'Freedom vs Home', desc: '5 craves adventure, 6 craves stability. Loving tension.' },
  '5-7': { score: 80, title: 'Seekers Together', desc: 'Both love truth and exploration. Intellectually electric.' },
  '5-8': { score: 72, title: 'Ambition & Adventure', desc: 'Dynamic and driven. Must align on life direction.' },
  '5-9': { score: 85, title: 'World Travelers', desc: 'Both expansive souls. Inspiring, adventurous, free.' },
  '6-6': { score: 88, title: 'Love Incarnate', desc: 'Deeply nurturing. Risk of codependency — maintain individuality.' },
  '6-7': { score: 72, title: 'Heart & Mind', desc: '6 warmth softens 7 solitude. Quietly beautiful.' },
  '6-8': { score: 80, title: 'Provider & Nurturer', desc: 'Both want to build something lasting. Strong family energy.' },
  '6-9': { score: 92, title: 'Healers United', desc: 'One of the most loving combinations. Service-oriented souls.' },
  '7-7': { score: 78, title: 'Twin Mystics', desc: 'Profound spiritual depth. May retreat from the world together.' },
  '7-8': { score: 68, title: 'Spirit & Matter', desc: '7 seeks truth, 8 seeks success. Fascinating but challenging.' },
  '7-9': { score: 88, title: 'Cosmic Wisdom', desc: 'Both deeply spiritual. A relationship of profound meaning.' },
  '8-8': { score: 75, title: 'Double Power', desc: 'Incredibly capable together. Must share control equally.' },
  '8-9': { score: 78, title: 'Legacy Builders', desc: '8 power + 9 wisdom = lasting impact on the world.' },
  '9-9': { score: 85, title: 'Old Souls', desc: 'Deeply understanding. Both carry the weight of the world.' },
  '11-2': { score: 92, title: 'Intuitive Harmony', desc: 'Master number 11 and 2 share deep sensitivity. Rare bond.' },
  '22-4': { score: 90, title: 'Master Builders', desc: 'Both build for eternity. Extraordinary potential together.' },
  '33-6': { score: 95, title: 'Divine Love', desc: 'The highest vibration pairing. Cosmic healers united.' },
}

function getCompat(a: number, b: number) {
  const key1 = a <= b ? a+'-'+b : b+'-'+a
  if (PAIR_COMPAT[key1]) return PAIR_COMPAT[key1]
  // fallback formula
  const diff = Math.abs(a - b)
  const score = Math.max(55, 95 - diff * 4)
  return { score, title: 'Cosmic Connection', desc: 'A unique pairing with its own special energy and lessons.' }
}

function ScoreRing({ score, color }: { score: number; color: string }) {
  const r = 36; const circ = 2 * Math.PI * r
  const dash = (score / 100) * circ
  return (
    <svg width="90" height="90" style={{ transform: 'rotate(-90deg)' }}>
      <circle cx="45" cy="45" r={r} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="6" />
      <circle cx="45" cy="45" r={r} fill="none" stroke={color} strokeWidth="6"
        strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
        style={{ filter: `drop-shadow(0 0 6px ${color})` }} />
      <text x="45" y="45" textAnchor="middle" dominantBaseline="central"
        style={{ transform: 'rotate(90deg)', transformOrigin: '45px 45px', fill: color, fontSize: '1.1rem', fontWeight: 700, fontFamily: 'inherit' }}>
        {score}%
      </text>
    </svg>
  )
}

export default function CompatibilityPage() {
  const [dateA, setDateA] = useState('')
  const [dateB, setDateB] = useState('')
  const [nameA, setNameA] = useState('')
  const [nameB, setNameB] = useState('')
  const [result, setResult] = useState<any>(null)

  const card: React.CSSProperties = { background: 'rgba(8,6,28,0.88)', border: '1px solid rgba(200,180,255,0.12)', borderRadius: '1.25rem', backdropFilter: 'blur(12px)', padding: '1.25rem' }
  const input: React.CSSProperties = { width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(200,180,255,0.15)', borderRadius: '0.75rem', padding: '0.75rem 1rem', color: 'rgba(220,200,255,0.9)', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' }

  function calculate() {
    if (!dateA || !dateB) return
    const profA = { lifePath: calcLifePath(dateA), soulUrge: calcSoulUrge(nameA || 'Soul A'), destiny: calcDestiny(nameA || 'Soul A') }
    const profB = { lifePath: calcLifePath(dateB), soulUrge: calcSoulUrge(nameB || 'Soul B'), destiny: calcDestiny(nameB || 'Soul B') }
    const lpCompat = getCompat(profA.lifePath, profB.lifePath)
    const suCompat = getCompat(profA.soulUrge, profB.soulUrge)
    const destCompat = getCompat(profA.destiny, profB.destiny)
    const overall = Math.round((lpCompat.score * 0.5) + (suCompat.score * 0.3) + (destCompat.score * 0.2))
    setResult({ profA, profB, lpCompat, suCompat, destCompat, overall })
  }

  const overallColor = result ? (result.overall >= 85 ? '#34d399' : result.overall >= 70 ? '#c9a84c' : '#f87171') : '#a78bfa'

  return (
    <div style={{ maxWidth: '520px', margin: '0 auto', padding: '1.5rem 1rem 2rem' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.8rem', color: 'rgba(220,200,255,0.95)', margin: '0 0 0.25rem', fontWeight: 400 }}>Soul Compatibility</h1>
        <p style={{ color: 'rgba(180,160,255,0.5)', fontSize: '0.8rem', margin: 0 }}>Discover your numerological harmony</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.875rem', marginBottom: '1rem' }}>
        {[{ name: nameA, setName: setNameA, date: dateA, setDate: setDateA, label: 'Soul A', emoji: '✦' },
          { name: nameB, setName: setNameB, date: dateB, setDate: setDateB, label: 'Soul B', emoji: '✧' }].map((s, i) => (
          <div key={i} style={card}>
            <div style={{ color: 'rgba(180,160,255,0.5)', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.75rem' }}>{s.emoji} {s.label}</div>
            <input placeholder="Name (optional)" value={s.name} onChange={e => s.setName(e.target.value)} style={{ ...input, marginBottom: '0.5rem' }} />
            <input type="date" value={s.date} onChange={e => s.setDate(e.target.value)} style={input} />
          </div>
        ))}
      </div>

      <button onClick={calculate} disabled={!dateA || !dateB} style={{ width: '100%', padding: '0.875rem', borderRadius: '0.875rem', border: '1px solid rgba(201,168,76,0.4)', background: 'rgba(201,168,76,0.15)', color: '#c9a84c', fontSize: '0.9rem', cursor: dateA && dateB ? 'pointer' : 'not-allowed', opacity: dateA && dateB ? 1 : 0.4, letterSpacing: '0.05em', marginBottom: '1.5rem' }}>✦ Calculate Compatibility</button>

      {result && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {/* Overall score */}
          <div style={{ ...card, textAlign: 'center', borderColor: overallColor + '30', background: overallColor + '08' }}>
            <div style={{ color: 'rgba(180,160,255,0.5)', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.875rem' }}>Overall Soul Harmony</div>
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.875rem' }}>
              <ScoreRing score={result.overall} color={overallColor} />
            </div>
            <div style={{ color: 'rgba(220,200,255,0.9)', fontFamily: 'Cormorant Garamond, serif', fontSize: '1.2rem', marginBottom: '0.25rem' }}>
              {result.overall >= 90 ? '🌟 Twin Flame Energy' : result.overall >= 80 ? '💫 Soul Mate Potential' : result.overall >= 70 ? '✨ Karmic Connection' : '🌱 Growth Partnership'}
            </div>
          </div>

          {/* Life Path */}
          <div style={card}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <div>
                <div style={{ color: 'rgba(180,160,255,0.5)', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Life Path Compatibility</div>
                <div style={{ color: 'rgba(220,200,255,0.85)', fontSize: '0.9rem', marginTop: '0.2rem' }}>{result.lpCompat.title}</div>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <span style={{ background: 'rgba(167,139,250,0.15)', border: '1px solid rgba(167,139,250,0.3)', borderRadius: '0.5rem', padding: '0.25rem 0.5rem', color: '#a78bfa', fontSize: '0.85rem', fontWeight: 700 }}>{result.profA.lifePath}</span>
                <span style={{ color: 'rgba(180,160,255,0.3)', fontSize: '0.7rem' }}>+</span>
                <span style={{ background: 'rgba(167,139,250,0.15)', border: '1px solid rgba(167,139,250,0.3)', borderRadius: '0.5rem', padding: '0.25rem 0.5rem', color: '#a78bfa', fontSize: '0.85rem', fontWeight: 700 }}>{result.profB.lifePath}</span>
                <span style={{ color: '#a78bfa', fontSize: '0.8rem', fontWeight: 700, marginLeft: '0.25rem' }}>{result.lpCompat.score}%</span>
              </div>
            </div>
            <p style={{ color: 'rgba(180,160,255,0.6)', fontSize: '0.8rem', lineHeight: 1.6, margin: 0, fontFamily: 'Cormorant Garamond, serif', fontStyle: 'italic' }}>{result.lpCompat.desc}</p>
          </div>

          {/* Soul Urge */}
          <div style={card}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <div>
                <div style={{ color: 'rgba(180,160,255,0.5)', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Soul Urge Harmony</div>
                <div style={{ color: 'rgba(220,200,255,0.85)', fontSize: '0.9rem', marginTop: '0.2rem' }}>{result.suCompat.title}</div>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <span style={{ background: 'rgba(244,114,182,0.15)', border: '1px solid rgba(244,114,182,0.3)', borderRadius: '0.5rem', padding: '0.25rem 0.5rem', color: '#f472b6', fontSize: '0.85rem', fontWeight: 700 }}>{result.profA.soulUrge}</span>
                <span style={{ color: 'rgba(180,160,255,0.3)', fontSize: '0.7rem' }}>+</span>
                <span style={{ background: 'rgba(244,114,182,0.15)', border: '1px solid rgba(244,114,182,0.3)', borderRadius: '0.5rem', padding: '0.25rem 0.5rem', color: '#f472b6', fontSize: '0.85rem', fontWeight: 700 }}>{result.profB.soulUrge}</span>
                <span style={{ color: '#f472b6', fontSize: '0.8rem', fontWeight: 700, marginLeft: '0.25rem' }}>{result.suCompat.score}%</span>
              </div>
            </div>
            <p style={{ color: 'rgba(180,160,255,0.6)', fontSize: '0.8rem', lineHeight: 1.6, margin: 0, fontFamily: 'Cormorant Garamond, serif', fontStyle: 'italic' }}>{result.suCompat.desc}</p>
          </div>

          {/* Destiny */}
          <div style={card}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <div>
                <div style={{ color: 'rgba(180,160,255,0.5)', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Destiny Alignment</div>
                <div style={{ color: 'rgba(220,200,255,0.85)', fontSize: '0.9rem', marginTop: '0.2rem' }}>{result.destCompat.title}</div>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <span style={{ background: 'rgba(201,168,76,0.15)', border: '1px solid rgba(201,168,76,0.3)', borderRadius: '0.5rem', padding: '0.25rem 0.5rem', color: '#c9a84c', fontSize: '0.85rem', fontWeight: 700 }}>{result.profA.destiny}</span>
                <span style={{ color: 'rgba(180,160,255,0.3)', fontSize: '0.7rem' }}>+</span>
                <span style={{ background: 'rgba(201,168,76,0.15)', border: '1px solid rgba(201,168,76,0.3)', borderRadius: '0.5rem', padding: '0.25rem 0.5rem', color: '#c9a84c', fontSize: '0.85rem', fontWeight: 700 }}>{result.profB.destiny}</span>
                <span style={{ color: '#c9a84c', fontSize: '0.8rem', fontWeight: 700, marginLeft: '0.25rem' }}>{result.destCompat.score}%</span>
              </div>
            </div>
            <p style={{ color: 'rgba(180,160,255,0.6)', fontSize: '0.8rem', lineHeight: 1.6, margin: 0, fontFamily: 'Cormorant Garamond, serif', fontStyle: 'italic' }}>{result.destCompat.desc}</p>
          </div>

          {/* Profile cards */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            {[{ prof: result.profA, name: nameA || 'Soul A', emoji: '✦' }, { prof: result.profB, name: nameB || 'Soul B', emoji: '✧' }].map((s, i) => (
              <div key={i} style={{ ...card, padding: '1rem' }}>
                <div style={{ color: 'rgba(180,160,255,0.5)', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.625rem' }}>{s.emoji} {s.name}</div>
                {[{ label: 'Life Path', val: s.prof.lifePathNumber, color: '#a78bfa' }, { label: 'Soul Urge', val: s.prof.soulUrgeNumber, color: '#f472b6' }, { label: 'Destiny', val: s.prof.destinyNumber, color: '#c9a84c' }].map(n => (
                  <div key={n.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                    <span style={{ color: 'rgba(180,160,255,0.45)', fontSize: '0.7rem' }}>{n.label}</span>
                    <span style={{ color: n.color, fontWeight: 700, fontSize: '0.85rem' }}>{n.val}</span>
                  </div>
                ))}
                <div style={{ marginTop: '0.5rem', color: 'rgba(180,160,255,0.55)', fontSize: '0.7rem', fontFamily: 'Cormorant Garamond, serif', fontStyle: 'italic' }}>{COMPAT_MEANINGS[s.prof.lifePathNumber]?.title || 'Cosmic Soul'}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
