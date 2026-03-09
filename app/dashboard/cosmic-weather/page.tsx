'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

function reduceToSingle(n: number): number {
  while (n > 9 && n !== 11 && n !== 22 && n !== 33) {
    n = String(n).split('').reduce((a, d) => a + parseInt(d), 0)
  }
  return n
}

function getUniversalDay(date: Date) {
  const d = date.getDate() + (date.getMonth() + 1) + date.getFullYear()
  return reduceToSingle(d)
}

function getUniversalMonth(date: Date) {
  return reduceToSingle((date.getMonth() + 1) + date.getFullYear())
}

function getUniversalYear(date: Date) {
  return reduceToSingle(date.getFullYear())
}

const DAY_ENERGIES: Record<number, { title: string; theme: string; color: string; emoji: string; focus: string[]; avoid: string[]; affirmation: string; angelNumbers: string[] }> = {
  1: { title: 'New Beginnings', theme: 'Leadership, initiation, independence, fresh starts', color: '#f97316', emoji: '🌅', focus: ['Start new projects', 'Assert your vision', 'Take bold action', 'Trust your instincts'], avoid: ['Procrastination', 'Seeking approval', 'Self-doubt', 'Following others blindly'], affirmation: 'I am a pioneer. I boldly begin what my soul calls me to create.', angelNumbers: ['111', '1111', '1010'] },
  2: { title: 'Divine Partnership', theme: 'Cooperation, balance, patience, intuition, harmony', color: '#60a5fa', emoji: '🕊️', focus: ['Nurture relationships', 'Listen deeply', 'Seek balance', 'Trust divine timing'], avoid: ['Forcing outcomes', 'Conflict', 'Impatience', 'Isolation'], affirmation: 'I trust the divine timing of my life. All is unfolding perfectly.', angelNumbers: ['222', '2222', '1212'] },
  3: { title: 'Creative Expression', theme: 'Joy, creativity, communication, self-expression, abundance', color: '#f472b6', emoji: '✨', focus: ['Create freely', 'Express yourself', 'Socialize', 'Embrace joy'], avoid: ['Self-criticism', 'Suppressing feelings', 'Overthinking', 'Isolation'], affirmation: 'I express my authentic self with joy and creative freedom.', angelNumbers: ['333', '3333', '1234'] },
  4: { title: 'Sacred Foundation', theme: 'Stability, hard work, discipline, building, protection', color: '#4ade80', emoji: '🏛️', focus: ['Build solid foundations', 'Organize your life', 'Work diligently', 'Create systems'], avoid: ['Shortcuts', 'Chaos', 'Procrastination', 'Rigidity'], affirmation: 'I build my life on a foundation of integrity, discipline, and divine order.', angelNumbers: ['444', '4444', '1234'] },
  5: { title: 'Freedom & Change', theme: 'Adventure, change, freedom, versatility, transformation', color: '#c9a84c', emoji: '🦋', focus: ['Embrace change', 'Seek adventure', 'Be adaptable', 'Try something new'], avoid: ['Resistance to change', 'Overindulgence', 'Recklessness', 'Commitment issues'], affirmation: 'I embrace change as the sacred catalyst for my highest evolution.', angelNumbers: ['555', '5555', '1515'] },
  6: { title: 'Love & Nurturing', theme: 'Love, family, responsibility, healing, service, beauty', color: '#f472b6', emoji: '💗', focus: ['Nurture loved ones', 'Create beauty', 'Heal relationships', 'Serve others'], avoid: ['Perfectionism', 'Martyrdom', 'Controlling others', 'Neglecting self'], affirmation: 'I give and receive love freely. My heart is a sacred vessel of divine love.', angelNumbers: ['666', '6666', '1616'] },
  7: { title: 'Spiritual Awakening', theme: 'Wisdom, introspection, spirituality, analysis, mystery', color: '#a78bfa', emoji: '🔮', focus: ['Meditate and reflect', 'Seek deeper truth', 'Study and learn', 'Connect with spirit'], avoid: ['Isolation', 'Cynicism', 'Overthinking', 'Distrust'], affirmation: 'I trust the wisdom within me. I am a channel for divine truth and insight.', angelNumbers: ['777', '7777', '1717'] },
  8: { title: 'Infinite Abundance', theme: 'Power, abundance, achievement, manifestation, authority', color: '#c9a84c', emoji: '♾️', focus: ['Take charge', 'Pursue abundance', 'Make power moves', 'Manifest boldly'], avoid: ['Greed', 'Control issues', 'Materialism', 'Abuse of power'], affirmation: 'I am a powerful manifestor. Abundance flows to me from all directions.', angelNumbers: ['888', '8888', '1818'] },
  9: { title: 'Completion & Release', theme: 'Endings, completion, compassion, humanitarianism, wisdom', color: '#818cf8', emoji: '🌅', focus: ['Release what no longer serves', 'Complete unfinished business', 'Forgive and let go', 'Serve humanity'], avoid: ['Holding grudges', 'Clinging to the past', 'Selfishness', 'Bitterness'], affirmation: 'I release with grace and gratitude. Every ending is a sacred new beginning.', angelNumbers: ['999', '9999', '1919'] },
  11: { title: 'Master Illumination', theme: 'Spiritual insight, intuition, inspiration, enlightenment', color: '#e0e7ff', emoji: '⚡', focus: ['Trust your intuition', 'Inspire others', 'Channel higher wisdom', 'Embrace your gifts'], avoid: ['Self-doubt', 'Anxiety', 'Ignoring intuition', 'Dimming your light'], affirmation: 'I am a beacon of divine light. My intuition is my greatest superpower.', angelNumbers: ['1111', '111', '1010'] },
  22: { title: 'Master Builder', theme: 'Manifestation, legacy, large-scale creation, mastery', color: '#c9a84c', emoji: '🏗️', focus: ['Think big', 'Build lasting structures', 'Lead with vision', 'Create your legacy'], avoid: ['Small thinking', 'Fear of responsibility', 'Perfectionism', 'Giving up'], affirmation: 'I am here to build something magnificent. My vision serves the greater good.', angelNumbers: ['2222', '222', '1212'] },
  33: { title: 'Master Teacher', theme: 'Compassion, healing, teaching, unconditional love', color: '#4ade80', emoji: '💚', focus: ['Teach and inspire', 'Heal with love', 'Serve selflessly', 'Embody compassion'], avoid: ['Martyrdom', 'Neglecting self', 'Preaching', 'Savior complex'], affirmation: 'I teach through love and example. My compassion heals and uplifts all I touch.', angelNumbers: ['333', '3333', '1212'] },
}

const MOON_PHASES = [
  { name: 'New Moon', emoji: '🌑', energy: 'Set intentions, plant seeds, begin anew' },
  { name: 'Waxing Crescent', emoji: '🌒', energy: 'Take action, build momentum, stay committed' },
  { name: 'First Quarter', emoji: '🌓', energy: 'Overcome challenges, make decisions, push forward' },
  { name: 'Waxing Gibbous', emoji: '🌔', energy: 'Refine, adjust, prepare for manifestation' },
  { name: 'Full Moon', emoji: '🌕', energy: 'Celebrate, release, illuminate truth, peak energy' },
  { name: 'Waning Gibbous', emoji: '🌖', energy: 'Share wisdom, express gratitude, give back' },
  { name: 'Last Quarter', emoji: '🌗', energy: 'Release, forgive, let go of what no longer serves' },
  { name: 'Waning Crescent', emoji: '🌘', energy: 'Rest, reflect, surrender, prepare for renewal' },
]

function getMoonPhase(date: Date) {
  const known = new Date('2000-01-06')
  const diff = (date.getTime() - known.getTime()) / (1000 * 60 * 60 * 24)
  const cycle = diff % 29.53
  const idx = Math.floor((cycle / 29.53) * 8) % 8
  return MOON_PHASES[idx]
}

const PLANETS: { name: string; emoji: string; day: number; energy: string }[] = [
  { name: 'Sun', emoji: '☀️', day: 0, energy: 'Vitality, ego, purpose, leadership' },
  { name: 'Moon', emoji: '🌙', day: 1, energy: 'Emotions, intuition, nurturing, cycles' },
  { name: 'Mars', emoji: '♂️', day: 2, energy: 'Action, courage, drive, passion' },
  { name: 'Mercury', emoji: '☿', day: 3, energy: 'Communication, intellect, travel, commerce' },
  { name: 'Jupiter', emoji: '♃', day: 4, energy: 'Expansion, luck, wisdom, abundance' },
  { name: 'Venus', emoji: '♀️', day: 5, energy: 'Love, beauty, harmony, pleasure' },
  { name: 'Saturn', emoji: '♄', day: 6, energy: 'Discipline, karma, structure, mastery' },
]

export default function CosmicWeatherPage() {
  const [date] = useState(new Date())
  const [profile, setProfile] = useState<any>(null)

  useEffect(() => {
    try {
      const p = localStorage.getItem('synchrosoul_numerology_profile')
      if (p) setProfile(JSON.parse(p))
    } catch {}
  }, [])

  const universalDay = getUniversalDay(date)
  const universalMonth = getUniversalMonth(date)
  const universalYear = getUniversalYear(date)
  const moonPhase = getMoonPhase(date)
  const planet = PLANETS[date.getDay()]
  const dayEnergy = DAY_ENERGIES[universalDay] || DAY_ENERGIES[1]

  let personalDay: number | null = null
  if (profile?.birthdate) {
    const bd = new Date(profile.birthdate)
    const bdNum = bd.getDate() + (bd.getMonth() + 1)
    personalDay = reduceToSingle(bdNum + universalMonth + universalYear)
  }

  const card: React.CSSProperties = { background: 'rgba(8,6,28,0.88)', border: '1px solid rgba(200,180,255,0.1)', borderRadius: '1.25rem', backdropFilter: 'blur(12px)' }

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '1.5rem 1rem 2rem' }}>
      <h1 style={{ fontFamily: 'Cormorant Garamond,serif', fontSize: '1.8rem', color: 'rgba(220,200,255,0.95)', margin: '0 0 0.25rem', fontWeight: 400 }}>Cosmic Weather</h1>
      <p style={{ color: 'rgba(180,160,255,0.5)', fontSize: '0.8rem', margin: '0 0 1.5rem' }}>
        {date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
      </p>

      {/* Universal Day - Hero */}
      <div style={{ ...card, padding: '1.5rem', marginBottom: '1rem', background: 'linear-gradient(135deg,' + dayEnergy.color + '12,' + dayEnergy.color + '06)', borderColor: dayEnergy.color + '30' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
          <div style={{ width: '4rem', height: '4rem', borderRadius: '1rem', background: dayEnergy.color + '18', border: '1px solid ' + dayEnergy.color + '40', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem', flexShrink: 0 }}>{dayEnergy.emoji}</div>
          <div>
            <div style={{ color: 'rgba(180,160,255,0.4)', fontSize: '0.62rem', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '0.2rem' }}>Universal Day {universalDay}</div>
            <div style={{ color: dayEnergy.color, fontSize: '1.3rem', fontFamily: 'Cormorant Garamond,serif', fontWeight: 600 }}>{dayEnergy.title}</div>
            <div style={{ color: 'rgba(180,160,255,0.55)', fontSize: '0.75rem', marginTop: '0.2rem' }}>{dayEnergy.theme}</div>
          </div>
        </div>
        <p style={{ color: 'rgba(220,200,255,0.75)', fontSize: '0.85rem', lineHeight: 1.6, margin: '0 0 1rem', fontStyle: 'italic' }}>“{dayEnergy.affirmation}”</p>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {dayEnergy.angelNumbers.map(n => (
            <Link key={n} href="/dashboard/dictionary" style={{ textDecoration: 'none', background: dayEnergy.color + '15', color: dayEnergy.color, padding: '0.2rem 0.6rem', borderRadius: '9999px', fontSize: '0.75rem', border: '1px solid ' + dayEnergy.color + '30' }}>{n}</Link>
          ))}
        </div>
      </div>

      {/* Grid: Moon + Planet */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
        <div style={{ ...card, padding: '1rem' }}>
          <div style={{ color: 'rgba(180,160,255,0.4)', fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>Moon Phase</div>
          <div style={{ fontSize: '2rem', marginBottom: '0.35rem' }}>{moonPhase.emoji}</div>
          <div style={{ color: 'rgba(220,200,255,0.85)', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.25rem' }}>{moonPhase.name}</div>
          <div style={{ color: 'rgba(180,160,255,0.45)', fontSize: '0.72rem', lineHeight: 1.4 }}>{moonPhase.energy}</div>
        </div>
        <div style={{ ...card, padding: '1rem' }}>
          <div style={{ color: 'rgba(180,160,255,0.4)', fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>Day Ruler</div>
          <div style={{ fontSize: '2rem', marginBottom: '0.35rem' }}>{planet.emoji}</div>
          <div style={{ color: 'rgba(220,200,255,0.85)', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.25rem' }}>{planet.name}</div>
          <div style={{ color: 'rgba(180,160,255,0.45)', fontSize: '0.72rem', lineHeight: 1.4 }}>{planet.energy}</div>
        </div>
      </div>

      {/* Personal Day */}
      {personalDay && (
        <div style={{ ...card, padding: '1.25rem', marginBottom: '1rem', background: 'rgba(167,139,250,0.06)', borderColor: 'rgba(167,139,250,0.2)' }}>
          <div style={{ color: 'rgba(167,139,250,0.5)', fontSize: '0.62rem', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '0.5rem' }}>Your Personal Day</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
            <div style={{ width: '3rem', height: '3rem', borderRadius: '0.75rem', background: 'rgba(167,139,250,0.12)', border: '1px solid rgba(167,139,250,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', fontWeight: 700, color: '#a78bfa', flexShrink: 0 }}>{personalDay}</div>
            <div>
              <div style={{ color: '#a78bfa', fontSize: '1rem', fontWeight: 600, marginBottom: '0.2rem' }}>{DAY_ENERGIES[personalDay]?.title || 'Personal Energy'}</div>
              <div style={{ color: 'rgba(180,160,255,0.5)', fontSize: '0.75rem' }}>{DAY_ENERGIES[personalDay]?.theme || 'Your unique energy for today'}</div>
            </div>
          </div>
        </div>
      )}

      {!profile?.birthdate && (
        <div style={{ ...card, padding: '1rem', marginBottom: '1rem', textAlign: 'center' }}>
          <p style={{ color: 'rgba(180,160,255,0.4)', fontSize: '0.8rem', margin: '0 0 0.5rem' }}>Add your birthdate to see your Personal Day number</p>
          <Link href="/dashboard/onboarding" style={{ color: '#a78bfa', fontSize: '0.8rem', textDecoration: 'none' }}>Set up profile →</Link>
        </div>
      )}

      {/* Focus & Avoid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
        <div style={{ ...card, padding: '1rem' }}>
          <div style={{ color: '#4ade80', fontSize: '0.62rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.625rem' }}>✓ Focus On</div>
          {dayEnergy.focus.map((f, i) => (
            <div key={i} style={{ color: 'rgba(220,200,255,0.7)', fontSize: '0.75rem', padding: '0.25rem 0', borderBottom: i < dayEnergy.focus.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>• {f}</div>
          ))}
        </div>
        <div style={{ ...card, padding: '1rem' }}>
          <div style={{ color: '#f87171', fontSize: '0.62rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.625rem' }}>✗ Avoid</div>
          {dayEnergy.avoid.map((a, i) => (
            <div key={i} style={{ color: 'rgba(220,200,255,0.7)', fontSize: '0.75rem', padding: '0.25rem 0', borderBottom: i < dayEnergy.avoid.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none' }}>• {a}</div>
          ))}
        </div>
      </div>

      {/* Cycle numbers */}
      <div style={{ ...card, padding: '1.25rem', marginBottom: '1rem' }}>
        <div style={{ color: 'rgba(180,160,255,0.4)', fontSize: '0.62rem', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '0.875rem' }}>Current Cycles</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '0.5rem' }}>
          {[
            { label: 'Universal Day', value: universalDay, color: dayEnergy.color },
            { label: 'Universal Month', value: universalMonth, color: '#60a5fa' },
            { label: 'Universal Year', value: universalYear, color: '#a78bfa' },
          ].map(c => (
            <div key={c.label} style={{ textAlign: 'center', padding: '0.75rem 0.5rem', background: c.color + '08', borderRadius: '0.75rem', border: '1px solid ' + c.color + '15' }}>
              <div style={{ color: c.color, fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.2rem' }}>{c.value}</div>
              <div style={{ color: 'rgba(180,160,255,0.4)', fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.06em', lineHeight: 1.3 }}>{c.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick links */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '0.5rem' }}>
        {[
          { href: '/dashboard/moon', label: 'Moon Calendar', emoji: '🌙' },
          { href: '/dashboard/personal-year', label: 'Personal Year', emoji: '📅' },
          { href: '/dashboard/numerology-deep', label: 'Full Blueprint', emoji: '🧮' },
        ].map(l => (
          <Link key={l.href} href={l.href} style={{ textDecoration: 'none' }}>
            <div style={{ ...card, padding: '0.875rem 0.5rem', textAlign: 'center' }}>
              <div style={{ fontSize: '1.3rem', marginBottom: '0.3rem' }}>{l.emoji}</div>
              <div style={{ color: 'rgba(180,160,255,0.6)', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.06em', lineHeight: 1.3 }}>{l.label}</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
