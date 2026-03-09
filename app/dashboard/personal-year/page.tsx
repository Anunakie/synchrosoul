'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

function calcPersonalYear(birthdate: string, year: number): number {
  if (!birthdate) return 0
  const [, mm, dd] = birthdate.split('-').map(Number)
  const digits = String(mm) + String(dd) + String(year)
  let sum = digits.split('').reduce((a, c) => a + parseInt(c), 0)
  while (sum > 9 && sum !== 11 && sum !== 22 && sum !== 33) {
    sum = String(sum).split('').reduce((a, c) => a + parseInt(c), 0)
  }
  return sum
}

const PY_MEANINGS: Record<number, { theme: string; keywords: string[]; guidance: string; color: string; emoji: string }> = {
  1: { theme: 'New Beginnings', keywords: ['Independence','Leadership','Initiative','Fresh Start'], guidance: 'This is your year to plant seeds. Bold new beginnings are favored. Start that project, make that move, step into your power. The universe is clearing the path.', color: '#f97316', emoji: '🌱' },
  2: { theme: 'Partnership & Patience', keywords: ['Cooperation','Balance','Intuition','Relationships'], guidance: 'A year of subtle growth and deep connection. Focus on partnerships, diplomacy, and listening to your inner voice. What you plant in relationships now will bloom for years.', color: '#a78bfa', emoji: '🤝' },
  3: { theme: 'Creative Expression', keywords: ['Joy','Creativity','Communication','Expansion'], guidance: 'Your most expressive year. Creativity flows freely — write, create, speak, perform. Social connections bring unexpected blessings. Let yourself be seen.', color: '#fbbf24', emoji: '✨' },
  4: { theme: 'Foundation Building', keywords: ['Discipline','Structure','Hard Work','Stability'], guidance: 'A year to build solid foundations. Hard work pays off. Focus on health, finances, and long-term plans. What you build now will support you for a decade.', color: '#60a5fa', emoji: '🏗️' },
  5: { theme: 'Freedom & Change', keywords: ['Adventure','Change','Freedom','Versatility'], guidance: 'Expect the unexpected. Travel, change, and liberation define this year. Embrace flexibility — the universe is reshuffling your deck for something better.', color: '#34d399', emoji: '🌊' },
  6: { theme: 'Love & Responsibility', keywords: ['Family','Healing','Service','Harmony'], guidance: 'A year centered on home, family, and healing. Deep love connections form or deepen. You may be called to serve or nurture others. Beauty and harmony surround you.', color: '#f472b6', emoji: '💗' },
  7: { theme: 'Spiritual Awakening', keywords: ['Introspection','Wisdom','Solitude','Truth'], guidance: 'Your most spiritual year. Retreat inward. Study, meditate, seek truth. Mystical experiences are heightened. Trust your intuition above all external advice.', color: '#818cf8', emoji: '🔮' },
  8: { theme: 'Power & Abundance', keywords: ['Success','Manifestation','Authority','Wealth'], guidance: 'Your power year. Financial and career opportunities abound. Step into leadership. What you focus on manifests rapidly. Align your actions with your highest vision.', color: '#c9a84c', emoji: '👑' },
  9: { theme: 'Completion & Release', keywords: ['Endings','Forgiveness','Wisdom','Transformation'], guidance: 'A year of completion and release. Let go of what no longer serves you — relationships, habits, beliefs. This clearing makes space for the new cycle beginning next year.', color: '#e879f9', emoji: '🌙' },
  11: { theme: 'Illumination (Master)', keywords: ['Intuition','Inspiration','Spiritual Insight','Awakening'], guidance: 'A master number year of heightened intuition and spiritual illumination. You are a channel for higher wisdom. Trust the visions and synchronicities — they are messages.', color: '#c9a84c', emoji: '⚡' },
  22: { theme: 'Master Builder', keywords: ['Vision','Legacy','Manifestation','Global Impact'], guidance: 'The most powerful year in numerology. You have the ability to manifest dreams into reality on a grand scale. Think big — your actions now can create lasting legacy.', color: '#c9a84c', emoji: '🌟' },
  33: { theme: 'Master Teacher', keywords: ['Compassion','Healing','Upliftment','Divine Love'], guidance: 'A rare master year of unconditional love and healing. You are called to uplift others through compassion and wisdom. Your presence alone transforms those around you.', color: '#c9a84c', emoji: '🕊️' },
}

export default function PersonalYearPage() {
  const [birthdate, setBirthdate] = useState('')
  const [currentYear] = useState(new Date().getFullYear())
  const [pyNow, setPyNow] = useState(0)
  const [pyNext, setPyNext] = useState(0)
  const [pyPrev, setPyPrev] = useState(0)

  useEffect(() => {
    const profile = localStorage.getItem('synchrosoul_profile')
    if (profile) {
      const p = JSON.parse(profile)
      if (p.birthdate) setBirthdate(p.birthdate)
    }
  }, [])

  useEffect(() => {
    if (birthdate) {
      setPyNow(calcPersonalYear(birthdate, currentYear))
      setPyNext(calcPersonalYear(birthdate, currentYear + 1))
      setPyPrev(calcPersonalYear(birthdate, currentYear - 1))
    }
  }, [birthdate, currentYear])

  const card: React.CSSProperties = { background: 'rgba(8,6,28,0.88)', border: '1px solid rgba(200,180,255,0.12)', borderRadius: '1.25rem', backdropFilter: 'blur(12px)' }
  const meaning = PY_MEANINGS[pyNow]

  return (
    <div style={{ maxWidth: '520px', margin: '0 auto', padding: '1.5rem 1rem 2rem' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.8rem', color: 'rgba(220,200,255,0.95)', margin: '0 0 0.25rem', fontWeight: 400 }}>Personal Year</h1>
        <p style={{ color: 'rgba(180,160,255,0.5)', fontSize: '0.8rem', margin: 0 }}>Your numerological theme for {currentYear}</p>
      </div>

      {/* Birthdate input */}
      <div style={{ ...card, padding: '1.25rem', marginBottom: '1.25rem' }}>
        <label style={{ display: 'block', color: 'rgba(180,160,255,0.5)', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>Your Birthdate</label>
        <input
          type="date"
          value={birthdate}
          onChange={e => setBirthdate(e.target.value)}
          style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(200,180,255,0.2)', borderRadius: '0.625rem', color: 'rgba(220,200,255,0.9)', padding: '0.625rem 0.875rem', fontSize: '0.9rem', boxSizing: 'border-box' }}
        />
      </div>

      {pyNow > 0 && meaning && (
        <>
          {/* Main year card */}
          <div style={{ ...card, padding: '1.75rem', marginBottom: '1.25rem', borderColor: meaning.color + '33', background: 'rgba(8,6,28,0.92)' }}>
            <div style={{ textAlign: 'center', marginBottom: '1.25rem' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>{meaning.emoji}</div>
              <div style={{ fontSize: '3.5rem', fontWeight: 800, color: meaning.color, lineHeight: 1, marginBottom: '0.25rem', fontFamily: 'Cormorant Garamond, serif' }}>{pyNow}</div>
              <div style={{ color: 'rgba(220,200,255,0.9)', fontSize: '1.1rem', fontFamily: 'Cormorant Garamond, serif', fontWeight: 400 }}>{meaning.theme}</div>
              <div style={{ color: 'rgba(180,160,255,0.4)', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: '0.25rem' }}>Personal Year {currentYear}</div>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', justifyContent: 'center', marginBottom: '1.25rem' }}>
              {meaning.keywords.map(k => (
                <span key={k} style={{ padding: '0.25rem 0.75rem', borderRadius: '2rem', background: meaning.color + '18', border: '1px solid ' + meaning.color + '33', color: meaning.color, fontSize: '0.72rem', letterSpacing: '0.05em' }}>{k}</span>
              ))}
            </div>
            <p style={{ color: 'rgba(200,180,255,0.7)', fontSize: '0.875rem', lineHeight: 1.7, margin: 0, fontStyle: 'italic', textAlign: 'center', fontFamily: 'Cormorant Garamond, serif' }}>"{meaning.guidance}"</p>
          </div>

          {/* Year timeline */}
          <div style={{ ...card, padding: '1.25rem', marginBottom: '1.25rem' }}>
            <div style={{ color: 'rgba(180,160,255,0.4)', fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '1rem' }}>Your Year Cycle</div>
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              {[
                { year: currentYear - 1, py: pyPrev, label: 'Last Year' },
                { year: currentYear, py: pyNow, label: 'This Year', active: true },
                { year: currentYear + 1, py: pyNext, label: 'Next Year' },
              ].map(item => {
                const m = PY_MEANINGS[item.py]
                return (
                  <div key={item.year} style={{ flex: 1, padding: '0.875rem 0.5rem', borderRadius: '0.875rem', background: item.active ? (m?.color || '#a78bfa') + '15' : 'rgba(255,255,255,0.03)', border: '1px solid ' + (item.active ? (m?.color || '#a78bfa') + '40' : 'rgba(200,180,255,0.08)'), textAlign: 'center' }}>
                    <div style={{ fontSize: '1.1rem', marginBottom: '0.25rem' }}>{m?.emoji || '✦'}</div>
                    <div style={{ color: item.active ? (m?.color || '#a78bfa') : 'rgba(180,160,255,0.5)', fontSize: '1.4rem', fontWeight: 700, lineHeight: 1 }}>{item.py}</div>
                    <div style={{ color: 'rgba(180,160,255,0.35)', fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: '0.2rem' }}>{item.year}</div>
                    <div style={{ color: 'rgba(180,160,255,0.4)', fontSize: '0.62rem', marginTop: '0.2rem' }}>{m?.theme?.split(' ')[0]}</div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* 9-year cycle */}
          <div style={{ ...card, padding: '1.25rem' }}>
            <div style={{ color: 'rgba(180,160,255,0.4)', fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '1rem' }}>Your 9-Year Cycle</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '0.5rem' }}>
              {[1,2,3,4,5,6,7,8,9].map(n => {
                const m = PY_MEANINGS[n]
                const isNow = n === pyNow
                return (
                  <div key={n} style={{ padding: '0.625rem', borderRadius: '0.75rem', background: isNow ? m.color + '18' : 'rgba(255,255,255,0.03)', border: '1px solid ' + (isNow ? m.color + '40' : 'rgba(200,180,255,0.06)'), textAlign: 'center' }}>
                    <div style={{ fontSize: '0.9rem' }}>{m.emoji}</div>
                    <div style={{ color: isNow ? m.color : 'rgba(180,160,255,0.5)', fontSize: '1rem', fontWeight: 700 }}>{n}</div>
                    <div style={{ color: 'rgba(180,160,255,0.35)', fontSize: '0.55rem', lineHeight: 1.2 }}>{m.theme.split(' ')[0]}</div>
                  </div>
                )
              })}
            </div>
          </div>
        </>
      )}

      {!birthdate && (
        <div style={{ ...card, padding: '2rem', textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>📅</div>
          <p style={{ color: 'rgba(180,160,255,0.5)', fontSize: '0.9rem', margin: 0, fontFamily: 'Cormorant Garamond, serif', fontStyle: 'italic' }}>Enter your birthdate to reveal your personal year theme</p>
        </div>
      )}
    </div>
  )
}
