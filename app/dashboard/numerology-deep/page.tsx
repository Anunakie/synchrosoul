'use client'
import { useState, useEffect } from 'react'


const NUMBER_MEANINGS: Record<number, { title: string; archetype: string; shadow: string; gifts: string[]; challenges: string[]; famous: string; color: string; mantra: string }> = {
  1: { title: 'The Pioneer', archetype: 'Leader & Initiator', shadow: 'Arrogance, isolation', gifts: ['Natural leadership', 'Originality', 'Courage', 'Independence'], challenges: ['Stubbornness', 'Loneliness', 'Ego'], famous: 'Steve Jobs, Nikola Tesla', color: '#ef4444', mantra: 'I lead with courage and create my own path.' },
  2: { title: 'The Diplomat', archetype: 'Peacemaker & Partner', shadow: 'Codependency, indecision', gifts: ['Empathy', 'Cooperation', 'Intuition', 'Harmony'], challenges: ['People-pleasing', 'Self-doubt', 'Oversensitivity'], famous: 'Barack Obama, Jennifer Aniston', color: '#f472b6', mantra: 'I find strength in unity and trust my inner knowing.' },
  3: { title: 'The Creator', archetype: 'Artist & Communicator', shadow: 'Scattered energy, superficiality', gifts: ['Creativity', 'Joy', 'Self-expression', 'Inspiration'], challenges: ['Lack of focus', 'Emotional highs/lows', 'Procrastination'], famous: 'David Bowie, Cate Blanchett', color: '#fbbf24', mantra: 'I express my truth and inspire the world with my light.' },
  4: { title: 'The Builder', archetype: 'Foundation & Stability', shadow: 'Rigidity, workaholism', gifts: ['Discipline', 'Reliability', 'Practicality', 'Endurance'], challenges: ['Inflexibility', 'Resistance to change', 'Overwork'], famous: 'Oprah Winfrey, Bill Gates', color: '#34d399', mantra: 'I build lasting foundations with patience and integrity.' },
  5: { title: 'The Adventurer', archetype: 'Freedom & Change', shadow: 'Restlessness, addiction', gifts: ['Adaptability', 'Curiosity', 'Versatility', 'Freedom'], challenges: ['Commitment issues', 'Impulsiveness', 'Excess'], famous: 'Angelina Jolie, Vincent van Gogh', color: '#fb923c', mantra: 'I embrace change and find freedom in every experience.' },
  6: { title: 'The Nurturer', archetype: 'Healer & Caretaker', shadow: 'Martyrdom, control', gifts: ['Compassion', 'Responsibility', 'Healing', 'Beauty'], challenges: ['Self-sacrifice', 'Perfectionism', 'Meddling'], famous: 'John Lennon, Michael Jackson', color: '#60a5fa', mantra: 'I nurture with love and allow others to find their own way.' },
  7: { title: 'The Seeker', archetype: 'Mystic & Analyst', shadow: 'Isolation, cynicism', gifts: ['Wisdom', 'Intuition', 'Analysis', 'Spiritual depth'], challenges: ['Aloofness', 'Perfectionism', 'Distrust'], famous: 'Princess Diana, Marilyn Monroe', color: '#a78bfa', mantra: 'I trust the mystery and find wisdom in stillness.' },
  8: { title: 'The Powerhouse', archetype: 'Executive & Manifestor', shadow: 'Greed, control', gifts: ['Ambition', 'Authority', 'Manifestation', 'Abundance'], challenges: ['Materialism', 'Workaholism', 'Power struggles'], famous: 'Pablo Picasso, Nelson Mandela', color: '#c9a84c', mantra: 'I manifest abundance and use power with wisdom.' },
  9: { title: 'The Humanitarian', archetype: 'Sage & Healer', shadow: 'Martyrdom, bitterness', gifts: ['Compassion', 'Wisdom', 'Generosity', 'Completion'], challenges: ['Letting go', 'Boundaries', 'Disappointment'], famous: 'Mahatma Gandhi, Mother Teresa', color: '#e879f9', mantra: 'I serve with love and release what no longer serves.' },
  11: { title: 'The Illuminator', archetype: 'Master Intuitive', shadow: 'Anxiety, self-doubt', gifts: ['Psychic sensitivity', 'Inspiration', 'Visionary', 'Healing'], challenges: ['Nervous energy', 'Overwhelm', 'Impracticality'], famous: 'Barack Obama, Bill Clinton', color: '#c084fc', mantra: 'I channel divine light and inspire others to awaken.' },
  22: { title: 'The Master Builder', archetype: 'Visionary Architect', shadow: 'Overwhelm, self-sabotage', gifts: ['Manifestation at scale', 'Practicality', 'Vision', 'Leadership'], challenges: ['Pressure', 'Perfectionism', 'Fear of failure'], famous: 'Bill Gates, Dalai Lama', color: '#f59e0b', mantra: 'I build heaven on earth through disciplined vision.' },
  33: { title: 'The Master Teacher', archetype: 'Cosmic Healer', shadow: 'Martyrdom, self-neglect', gifts: ['Unconditional love', 'Teaching', 'Healing', 'Sacrifice'], challenges: ['Boundaries', 'Burnout', 'Perfectionism'], famous: 'Albert Einstein, Francis of Assisi', color: '#f472b6', mantra: 'I embody love and teach through my own transformation.' },
}

const PERSONAL_YEAR_MEANINGS: Record<number, { theme: string; focus: string; avoid: string }> = {
  1: { theme: 'New Beginnings', focus: 'Start projects, set intentions, plant seeds', avoid: 'Clinging to the past' },
  2: { theme: 'Patience & Partnership', focus: 'Collaborate, nurture relationships, wait', avoid: 'Forcing outcomes' },
  3: { theme: 'Expression & Joy', focus: 'Create, communicate, celebrate', avoid: 'Scattering energy' },
  4: { theme: 'Work & Foundation', focus: 'Build systems, work hard, organize', avoid: 'Shortcuts' },
  5: { theme: 'Change & Freedom', focus: 'Travel, pivot, embrace the unexpected', avoid: 'Resistance to change' },
  6: { theme: 'Love & Responsibility', focus: 'Family, home, healing relationships', avoid: 'Neglecting self' },
  7: { theme: 'Reflection & Wisdom', focus: 'Study, meditate, go inward', avoid: 'Isolation' },
  8: { theme: 'Power & Abundance', focus: 'Career, finances, leadership', avoid: 'Greed' },
  9: { theme: 'Completion & Release', focus: 'Let go, forgive, complete cycles', avoid: 'Starting new things' },
}

function getPersonalYear(birthdate: string): number {
  if (!birthdate) return 1
  const [, month, day] = birthdate.split('-').map(Number)
  const currentYear = new Date().getFullYear()
  const sum = String(month).split('').reduce((a, b) => a + Number(b), 0) +
    String(day).split('').reduce((a, b) => a + Number(b), 0) +
    String(currentYear).split('').reduce((a, b) => a + Number(b), 0)
  let n = sum
  while (n > 9 && n !== 11 && n !== 22 && n !== 33) {
    n = String(n).split('').reduce((a, b) => a + Number(b), 0)
  }
  return n
}

function getPersonalMonth(birthdate: string): number {
  const py = getPersonalYear(birthdate)
  const cm = new Date().getMonth() + 1
  let n = py + cm
  while (n > 9 && n !== 11 && n !== 22) {
    n = String(n).split('').reduce((a, b) => a + Number(b), 0)
  }
  return n
}

export default function NumerologyDeepPage() {
  const [profile, setProfile] = useState<{ lifePathNumber: number; soulUrgeNumber: number; destinyNumber: number; birthdate: string; name: string } | null>(null)
  const [activeTab, setActiveTab] = useState<'core' | 'year' | 'compatibility'>('core')
  const [compatNum, setCompatNum] = useState('')

  useEffect(() => {
    try {
      const p = localStorage.getItem('synchrosoul_numerology')
      if (p) setProfile(JSON.parse(p))
    } catch {}
  }, [])

  const card = { background: 'rgba(8,6,28,0.88)', border: '1px solid rgba(200,180,255,0.12)', borderRadius: '1.25rem', backdropFilter: 'blur(12px)' } as React.CSSProperties

  if (!profile) {
    return (
      <div style={{ maxWidth: '600px', margin: '0 auto', padding: '1.5rem 1rem 2rem' }}>
        <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.8rem', color: 'rgba(220,200,255,0.95)', margin: '0 0 1.5rem', fontWeight: 400 }}>Deep Numerology</h1>
        <div style={{ ...card, padding: '2rem', textAlign: 'center' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>✦</div>
          <div style={{ color: 'rgba(180,160,255,0.6)', fontSize: '0.88rem', marginBottom: '1rem' }}>Complete your numerology profile first.</div>
          <a href="/dashboard/onboarding" style={{ display: 'inline-block', padding: '0.65rem 1.5rem', borderRadius: '2rem', background: 'rgba(167,139,250,0.15)', border: '1px solid rgba(167,139,250,0.4)', color: '#a78bfa', fontSize: '0.85rem', textDecoration: 'none' }}>Go to Onboarding</a>
        </div>
      </div>
    )
  }

  const personalYear = getPersonalYear(profile.birthdate)
  const personalMonth = getPersonalMonth(profile.birthdate)
  const pyMeaning = PERSONAL_YEAR_MEANINGS[personalYear] || PERSONAL_YEAR_MEANINGS[1]
  const pmMeaning = PERSONAL_YEAR_MEANINGS[personalMonth] || PERSONAL_YEAR_MEANINGS[1]

  const coreNumbers = [
    { label: 'Life Path', value: profile.lifePathNumber, desc: 'Your soul’s journey and purpose' },
    { label: 'Soul Urge', value: profile.soulUrgeNumber, desc: 'Your heart’s deepest desire' },
    { label: 'Destiny', value: profile.destinyNumber, desc: 'Your life’s mission' },
  ]

  function compatibilityScore(a: number, b: number): number {
    const harmonics: Record<string, number> = {
      '1-1': 70, '1-2': 85, '1-3': 90, '1-4': 75, '1-5': 88, '1-6': 72, '1-7': 80, '1-8': 85, '1-9': 78,
      '2-3': 88, '2-4': 82, '2-5': 70, '2-6': 95, '2-7': 78, '2-8': 72, '2-9': 90,
      '3-3': 85, '3-4': 70, '3-5': 92, '3-6': 80, '3-7': 75, '3-8': 78, '3-9': 88,
      '4-4': 80, '4-5': 68, '4-6': 88, '4-7': 85, '4-8': 90, '4-9': 72,
      '5-5': 75, '5-6': 70, '5-7': 82, '5-8': 78, '5-9': 85,
      '6-6': 88, '6-7': 75, '6-8': 80, '6-9': 92,
      '7-7': 82, '7-8': 78, '7-9': 88,
      '8-8': 85, '8-9': 80,
      '9-9': 90,
    }
    const key = [Math.min(a,b), Math.max(a,b)].join('-')
    return harmonics[key] || 75
  }

  const compatTarget = parseInt(compatNum) || 0
  const compatScore = compatTarget >= 1 && compatTarget <= 9 ? compatibilityScore(profile.lifePathNumber, compatTarget) : null

  const tabs = ['core', 'year', 'compatibility'] as const

  return (
    <div style={{ maxWidth: '640px', margin: '0 auto', padding: '1.5rem 1rem 2rem' }}>
      <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.8rem', color: 'rgba(220,200,255,0.95)', margin: '0 0 0.25rem', fontWeight: 400 }}>Deep Numerology</h1>
      <p style={{ color: 'rgba(180,160,255,0.5)', fontSize: '0.8rem', margin: '0 0 1.5rem' }}>Your complete cosmic blueprint, {profile.name}</p>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '1.25rem', background: 'rgba(255,255,255,0.03)', borderRadius: '0.75rem', padding: '0.3rem' }}>
        {tabs.map(t => (
          <button key={t} onClick={() => setActiveTab(t)} style={{ flex: 1, padding: '0.5rem', borderRadius: '0.5rem', cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.75rem', textTransform: 'capitalize', border: 'none', background: activeTab === t ? 'rgba(167,139,250,0.2)' : 'transparent', color: activeTab === t ? '#a78bfa' : 'rgba(180,160,255,0.45)', fontWeight: activeTab === t ? 600 : 400, transition: 'all 0.2s' }}>{t === 'year' ? 'Personal Year' : t}</button>
        ))}
      </div>

      {activeTab === 'core' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {coreNumbers.map(({ label, value, desc }) => {
            const m = NUMBER_MEANINGS[value]
            if (!m) return null
            return (
              <div key={label} style={{ ...card, padding: '1.5rem', border: `1px solid ${m.color}33` }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                  <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: `${m.color}18`, border: `2px solid ${m.color}55`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <span style={{ color: m.color, fontSize: '1.4rem', fontFamily: 'Cormorant Garamond, serif', fontWeight: 700 }}>{value}</span>
                  </div>
                  <div>
                    <div style={{ color: 'rgba(180,160,255,0.4)', fontSize: '0.62rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{label}</div>
                    <div style={{ color: 'rgba(220,200,255,0.9)', fontSize: '1rem', fontWeight: 600 }}>{m.title}</div>
                    <div style={{ color: 'rgba(180,160,255,0.5)', fontSize: '0.72rem' }}>{desc}</div>
                  </div>
                </div>
                <div style={{ color: 'rgba(180,160,255,0.4)', fontSize: '0.62rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.4rem' }}>Archetype</div>
                <div style={{ color: m.color, fontSize: '0.82rem', marginBottom: '0.85rem' }}>{m.archetype}</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.85rem' }}>
                  <div>
                    <div style={{ color: 'rgba(180,160,255,0.4)', fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.35rem' }}>Gifts</div>
                    {m.gifts.map((g, i) => <div key={i} style={{ color: 'rgba(200,180,255,0.7)', fontSize: '0.75rem', marginBottom: '0.2rem' }}>✦ {g}</div>)}
                  </div>
                  <div>
                    <div style={{ color: 'rgba(180,160,255,0.4)', fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.35rem' }}>Challenges</div>
                    {m.challenges.map((c, i) => <div key={i} style={{ color: 'rgba(200,180,255,0.7)', fontSize: '0.75rem', marginBottom: '0.2rem' }}>• {c}</div>)}
                  </div>
                </div>
                <div style={{ padding: '0.75rem', borderRadius: '0.6rem', background: `${m.color}0d`, border: `1px solid ${m.color}22`, fontFamily: 'Cormorant Garamond, serif', fontSize: '0.95rem', color: 'rgba(220,200,255,0.85)', fontStyle: 'italic', lineHeight: 1.6 }}>{m.mantra}</div>
              </div>
            )
          })}
        </div>
      )}

      {activeTab === 'year' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ ...card, padding: '1.5rem', border: '1px solid rgba(201,168,76,0.3)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
              <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: 'rgba(201,168,76,0.15)', border: '2px solid rgba(201,168,76,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <span style={{ color: '#c9a84c', fontSize: '1.4rem', fontFamily: 'Cormorant Garamond, serif', fontWeight: 700 }}>{personalYear}</span>
              </div>
              <div>
                <div style={{ color: 'rgba(180,160,255,0.4)', fontSize: '0.62rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Personal Year {new Date().getFullYear()}</div>
                <div style={{ color: 'rgba(220,200,255,0.9)', fontSize: '1rem', fontWeight: 600 }}>{pyMeaning.theme}</div>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              <div style={{ padding: '0.65rem 0.85rem', borderRadius: '0.6rem', background: 'rgba(74,222,128,0.08)', border: '1px solid rgba(74,222,128,0.2)' }}>
                <span style={{ color: '#4ade80', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Focus: </span>
                <span style={{ color: 'rgba(200,180,255,0.75)', fontSize: '0.82rem' }}>{pyMeaning.focus}</span>
              </div>
              <div style={{ padding: '0.65rem 0.85rem', borderRadius: '0.6rem', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)' }}>
                <span style={{ color: '#ef4444', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Avoid: </span>
                <span style={{ color: 'rgba(200,180,255,0.75)', fontSize: '0.82rem' }}>{pyMeaning.avoid}</span>
              </div>
            </div>
          </div>

          <div style={{ ...card, padding: '1.5rem', border: '1px solid rgba(167,139,250,0.25)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
              <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: 'rgba(167,139,250,0.15)', border: '2px solid rgba(167,139,250,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <span style={{ color: '#a78bfa', fontSize: '1.4rem', fontFamily: 'Cormorant Garamond, serif', fontWeight: 700 }}>{personalMonth}</span>
              </div>
              <div>
                <div style={{ color: 'rgba(180,160,255,0.4)', fontSize: '0.62rem', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Personal Month {new Date().toLocaleString('default', { month: 'long' })}</div>
                <div style={{ color: 'rgba(220,200,255,0.9)', fontSize: '1rem', fontWeight: 600 }}>{pmMeaning.theme}</div>
              </div>
            </div>
            <div style={{ color: 'rgba(180,160,255,0.6)', fontSize: '0.82rem', lineHeight: 1.6 }}>{pmMeaning.focus}</div>
          </div>
        </div>
      )}

      {activeTab === 'compatibility' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ ...card, padding: '1.5rem' }}>
            <div style={{ color: 'rgba(180,160,255,0.4)', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.75rem' }}>Check Compatibility</div>
            <div style={{ color: 'rgba(180,160,255,0.5)', fontSize: '0.78rem', marginBottom: '1rem' }}>Your Life Path: <span style={{ color: '#a78bfa', fontWeight: 700 }}>{profile.lifePathNumber}</span></div>
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem' }}>
              <input
                type="number" min="1" max="9" placeholder="Enter Life Path (1-9)"
                value={compatNum} onChange={e => setCompatNum(e.target.value)}
                style={{ flex: 1, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(200,180,255,0.15)', borderRadius: '0.6rem', color: 'rgba(220,200,255,0.9)', padding: '0.65rem 0.85rem', fontSize: '0.85rem', outline: 'none', fontFamily: 'inherit' }}
              />
            </div>
            {compatScore !== null && (
              <div style={{ padding: '1.25rem', borderRadius: '0.85rem', background: compatScore >= 85 ? 'rgba(74,222,128,0.08)' : compatScore >= 70 ? 'rgba(251,191,36,0.08)' : 'rgba(239,68,68,0.08)', border: `1px solid ${compatScore >= 85 ? 'rgba(74,222,128,0.3)' : compatScore >= 70 ? 'rgba(251,191,36,0.3)' : 'rgba(239,68,68,0.3)'}`, textAlign: 'center' }}>
                <div style={{ fontSize: '2.5rem', fontFamily: 'Cormorant Garamond, serif', fontWeight: 700, color: compatScore >= 85 ? '#4ade80' : compatScore >= 70 ? '#fbbf24' : '#ef4444', marginBottom: '0.25rem' }}>{compatScore}%</div>
                <div style={{ color: 'rgba(200,180,255,0.7)', fontSize: '0.82rem' }}>
                  {compatScore >= 85 ? '✨ Highly compatible — natural harmony' : compatScore >= 70 ? '✦ Good compatibility — growth potential' : '🔥 Challenging — powerful lessons'}
                </div>
              </div>
            )}
          </div>

          <div style={{ ...card, padding: '1.25rem' }}>
            <div style={{ color: 'rgba(180,160,255,0.4)', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.75rem' }}>Most Compatible With Life Path {profile.lifePathNumber}</div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
              {[1,2,3,4,5,6,7,8,9].sort((a,b) => compatibilityScore(profile.lifePathNumber,b) - compatibilityScore(profile.lifePathNumber,a)).slice(0,4).map(n => (
                <div key={n} style={{ padding: '0.4rem 0.85rem', borderRadius: '2rem', background: 'rgba(74,222,128,0.1)', border: '1px solid rgba(74,222,128,0.3)', color: '#4ade80', fontSize: '0.78rem', fontWeight: 600 }}>Life Path {n} • {compatibilityScore(profile.lifePathNumber,n)}%</div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
