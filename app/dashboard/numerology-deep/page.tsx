'use client'
import { useState, useEffect } from 'react'
import { calcLifePath, calcSoulUrge, calcDestiny } from '@/lib/numerology'

const NUM_DATA: Record<number, { title: string; archetype: string; color: string; emoji: string; strengths: string[]; challenges: string[]; purpose: string; love: string; career: string; spiritual: string; famous: string[] }> = {
  1: { title: 'The Pioneer', archetype: 'The Leader', color: '#fb923c', emoji: '🔥', strengths: ['Independent', 'Courageous', 'Original', 'Determined', 'Self-reliant'], challenges: ['Stubbornness', 'Selfishness', 'Arrogance', 'Impatience'], purpose: 'To lead, innovate, and forge new paths for others to follow. You are here to be a trailblazer.', love: 'You need a partner who respects your independence and matches your ambition. You love deeply but need space.', career: 'Entrepreneurship, leadership roles, innovation, pioneering new fields, executive positions.', spiritual: 'Your spiritual path involves learning to lead with humility and serve others through your gifts.', famous: ['Steve Jobs', 'Martin Luther King Jr.', 'Lady Gaga'] },
  2: { title: 'The Peacemaker', archetype: 'The Diplomat', color: '#a78bfa', emoji: '🕊️', strengths: ['Intuitive', 'Cooperative', 'Sensitive', 'Harmonious', 'Patient'], challenges: ['Indecisiveness', 'Over-sensitivity', 'Dependency', 'Self-doubt'], purpose: 'To bring harmony, balance, and cooperation to the world. You are the bridge between opposing forces.', love: 'You are a devoted, sensitive partner who thrives in deep emotional connection. You need reciprocity.', career: 'Counseling, diplomacy, partnerships, healing arts, music, mediation, support roles.', spiritual: 'Your spiritual path involves learning to trust your intuition and stand in your own power.', famous: ['Barack Obama', 'Jennifer Aniston', 'Bill Clinton'] },
  3: { title: 'The Creator', archetype: 'The Artist', color: '#e879f9', emoji: '🎨', strengths: ['Creative', 'Expressive', 'Joyful', 'Inspiring', 'Communicative'], challenges: ['Scattered energy', 'Superficiality', 'Moodiness', 'Self-doubt'], purpose: 'To inspire, uplift, and bring beauty and joy into the world through creative expression.', love: 'You are playful, romantic, and expressive in love. You need a partner who appreciates your creativity.', career: 'Arts, writing, speaking, entertainment, teaching, design, social media, coaching.', spiritual: 'Your spiritual path involves channeling your creative gifts in service of the highest good.', famous: ['David Bowie', 'Celine Dion', 'Snoop Dogg'] },
  4: { title: 'The Builder', archetype: 'The Foundation', color: '#34d399', emoji: '🗻', strengths: ['Reliable', 'Disciplined', 'Practical', 'Loyal', 'Hardworking'], challenges: ['Rigidity', 'Stubbornness', 'Workaholism', 'Resistance to change'], purpose: 'To build lasting foundations, systems, and structures that serve humanity for generations.', love: 'You are loyal, dependable, and committed. You show love through acts of service and stability.', career: 'Engineering, architecture, finance, management, construction, systems design, law.', spiritual: 'Your spiritual path involves finding the sacred in the practical and building heaven on earth.', famous: ['Oprah Winfrey', 'Bill Gates', 'Clint Eastwood'] },
  5: { title: 'The Adventurer', archetype: 'The Free Spirit', color: '#f59e0b', emoji: '🌍', strengths: ['Adaptable', 'Curious', 'Magnetic', 'Versatile', 'Progressive'], challenges: ['Restlessness', 'Impulsiveness', 'Overindulgence', 'Commitment issues'], purpose: 'To experience life fully, champion freedom, and inspire others to embrace change and adventure.', love: 'You need freedom and variety in love. You are passionate and exciting but need a partner who trusts you.', career: 'Travel, sales, media, entrepreneurship, politics, adventure sports, writing, acting.', spiritual: 'Your spiritual path involves finding freedom within, not just without, and using your gifts to liberate others.', famous: ['Angelina Jolie', 'Abraham Lincoln', 'Mick Jagger'] },
  6: { title: 'The Nurturer', archetype: 'The Healer', color: '#f472b6', emoji: '💞', strengths: ['Compassionate', 'Responsible', 'Loving', 'Protective', 'Harmonious'], challenges: ['Perfectionism', 'Self-sacrifice', 'Controlling', 'Worry'], purpose: 'To nurture, heal, and create harmony in families and communities. You are love in action.', love: 'You are devoted, romantic, and deeply caring. Home and family are sacred to you.', career: 'Healthcare, teaching, counseling, social work, design, hospitality, parenting, community service.', spiritual: 'Your spiritual path involves learning to receive love as gracefully as you give it.', famous: ['John Lennon', 'Michael Jackson', 'Albert Einstein'] },
  7: { title: 'The Seeker', archetype: 'The Mystic', color: '#60a5fa', emoji: '🔮', strengths: ['Analytical', 'Intuitive', 'Wise', 'Introspective', 'Spiritual'], challenges: ['Isolation', 'Skepticism', 'Aloofness', 'Perfectionism'], purpose: 'To seek truth, wisdom, and spiritual understanding, and share your insights with the world.', love: 'You need a deep intellectual and spiritual connection. Superficiality repels you.', career: 'Research, science, philosophy, spirituality, writing, psychology, technology, academia.', spiritual: 'Your spiritual path is the path itself. You are here to know the divine through direct experience.', famous: ['Princess Diana', 'Marilyn Monroe', 'Leonardo DiCaprio'] },
  8: { title: 'The Powerhouse', archetype: 'The Executive', color: '#c9a84c', emoji: '♾️', strengths: ['Ambitious', 'Authoritative', 'Efficient', 'Visionary', 'Resilient'], challenges: ['Materialism', 'Workaholism', 'Control issues', 'Ruthlessness'], purpose: 'To master the material world and use power and abundance in service of the greater good.', love: 'You are passionate and loyal but need a partner who matches your ambition and respects your drive.', career: 'Business, finance, law, real estate, executive leadership, politics, investment.', spiritual: 'Your spiritual path involves learning that true power comes from within and is used to uplift others.', famous: ['Nelson Mandela', 'Pablo Picasso', 'Martha Stewart'] },
  9: { title: 'The Humanitarian', archetype: 'The Sage', color: '#e879f9', emoji: '🌌', strengths: ['Compassionate', 'Wise', 'Generous', 'Idealistic', 'Magnetic'], challenges: ['Martyrdom', 'Resentment', 'Impracticality', 'Emotional volatility'], purpose: 'To serve humanity, complete karmic cycles, and embody unconditional love and wisdom.', love: 'You love deeply and universally. You need a partner who shares your humanitarian values.', career: 'Humanitarian work, arts, healing, teaching, activism, spirituality, counseling.', spiritual: 'Your spiritual path involves releasing the past, forgiving completely, and serving with an open heart.', famous: ['Mahatma Gandhi', 'Mother Teresa', 'Jim Carrey'] },
  11: { title: 'The Illuminator', archetype: 'The Visionary', color: '#e879f9', emoji: '✨', strengths: ['Highly intuitive', 'Inspirational', 'Idealistic', 'Sensitive', 'Charismatic'], challenges: ['Anxiety', 'Nervous energy', 'Impracticality', 'Overwhelm'], purpose: 'To illuminate the path for others through spiritual insight, inspiration, and visionary leadership.', love: 'You need a deeply spiritual and emotionally intelligent partner. Shallow connections drain you.', career: 'Spiritual leadership, counseling, arts, healing, teaching, psychology, innovation.', spiritual: 'You are a spiritual messenger. Your sensitivity is your superpower — protect and honor it.', famous: ['Barack Obama', 'Bill Clinton', 'Edgar Allan Poe'] },
  22: { title: 'The Master Builder', archetype: 'The Architect', color: '#c9a84c', emoji: '🏛️', strengths: ['Visionary', 'Practical', 'Disciplined', 'Powerful', 'Inspiring'], challenges: ['Overwhelm', 'Perfectionism', 'Self-doubt', 'Pressure'], purpose: 'To build systems, institutions, and structures that transform the world on a massive scale.', love: 'You need a partner who understands your grand vision and supports your mission.', career: 'Architecture, engineering, global business, politics, large-scale projects, philanthropy.', spiritual: 'You are here to manifest heaven on earth. Your work is your spiritual practice.', famous: ['Bill Gates', 'Oprah Winfrey', 'The Dalai Lama'] },
  33: { title: 'The Master Teacher', archetype: 'The Cosmic Parent', color: '#f472b6', emoji: '💛', strengths: ['Compassionate', 'Nurturing', 'Inspiring', 'Healing', 'Selfless'], challenges: ['Martyrdom', 'Perfectionism', 'Overwhelm', 'Self-neglect'], purpose: 'To uplift all of humanity through unconditional love, healing, and spiritual teaching.', love: 'You love with your whole being. You need a partner who honors your sacred heart.', career: 'Spiritual teaching, healing arts, humanitarian leadership, counseling, arts.', spiritual: 'You are a cosmic teacher. Every interaction is an opportunity to embody divine love.', famous: ['Albert Einstein', 'Francis of Assisi', 'Meryl Streep'] },
}

function PersonalYearNumber(birthdate: string): number {
  const now = new Date()
  const [y, m, d] = birthdate.split('-').map(Number)
  const sum = d + m + now.getFullYear()
  let n = sum
  while (n > 9 && n !== 11 && n !== 22 && n !== 33) {
    n = String(n).split('').reduce((a, c) => a + parseInt(c), 0)
  }
  return n
}

function PersonalMonthNumber(birthdate: string): number {
  const now = new Date()
  const [, , d] = birthdate.split('-').map(Number)
  const py = PersonalYearNumber(birthdate)
  const sum = d + (now.getMonth() + 1) + py
  let n = sum
  while (n > 9 && n !== 11 && n !== 22 && n !== 33) {
    n = String(n).split('').reduce((a, c) => a + parseInt(c), 0)
  }
  return n
}

export default function NumerologyDeepPage() {
  const [profile, setProfile] = useState<any>(null)
  const [birthdate, setBirthdate] = useState('')
  const [name, setName] = useState('')
  const [activeTab, setActiveTab] = useState<'overview' | 'cycles' | 'compatibility'>('overview')
  const [compatNum, setCompatNum] = useState('')

  useEffect(() => {
    const p = JSON.parse(localStorage.getItem('synchrosoul_profile') || 'null')
    if (p) { setProfile(p); setBirthdate(p.birthdate || ''); setName(p.name || '') }
  }, [])

  function calculate() {
    if (!birthdate) return
    const lp = calcLifePath(birthdate)
    const su = name ? calcSoulUrge(name) : 0
    const de = name ? calcDestiny(name) : 0
    const py = PersonalYearNumber(birthdate)
    const pm = PersonalMonthNumber(birthdate)
    const p = { birthdate, name, lifePathNumber: lp, soulUrgeNumber: su, destinyNumber: de, personalYear: py, personalMonth: pm }
    setProfile(p)
    localStorage.setItem('synchrosoul_profile', JSON.stringify(p))
  }

  const card = { background: 'rgba(8,6,28,0.88)', border: '1px solid rgba(200,180,255,0.12)', borderRadius: '1.25rem', backdropFilter: 'blur(12px)' } as React.CSSProperties

  function NumberCard({ num, label }: { num: number; label: string }) {
    const data = NUM_DATA[num]
    if (!data) return null
    return (
      <div style={{ ...card, padding: '1.25rem', borderColor: `${data.color}33` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem', marginBottom: '1rem' }}>
          <div style={{ width: '3rem', height: '3rem', borderRadius: '50%', background: `${data.color}18`, border: `1px solid ${data.color}44`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem', flexShrink: 0 }}>{data.emoji}</div>
          <div>
            <div style={{ color: 'rgba(180,160,255,0.4)', fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.15rem' }}>{label}</div>
            <div style={{ color: data.color, fontSize: '1.1rem', fontWeight: 700 }}>{num} — {data.title}</div>
            <div style={{ color: 'rgba(180,160,255,0.5)', fontSize: '0.72rem' }}>{data.archetype}</div>
          </div>
        </div>
        <p style={{ color: 'rgba(200,180,255,0.75)', fontSize: '0.85rem', margin: '0 0 0.875rem', lineHeight: 1.6 }}>{data.purpose}</p>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '0.875rem' }}>
          <div style={{ background: 'rgba(52,211,153,0.06)', border: '1px solid rgba(52,211,153,0.15)', borderRadius: '0.75rem', padding: '0.75rem' }}>
            <div style={{ color: '#34d399', fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.4rem' }}>Strengths</div>
            {data.strengths.map(s => <div key={s} style={{ color: 'rgba(200,180,255,0.65)', fontSize: '0.75rem', marginBottom: '0.2rem' }}>✦ {s}</div>)}
          </div>
          <div style={{ background: 'rgba(239,68,68,0.05)', border: '1px solid rgba(239,68,68,0.12)', borderRadius: '0.75rem', padding: '0.75rem' }}>
            <div style={{ color: 'rgba(239,68,68,0.6)', fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.4rem' }}>Challenges</div>
            {data.challenges.map(s => <div key={s} style={{ color: 'rgba(200,180,255,0.55)', fontSize: '0.75rem', marginBottom: '0.2rem' }}>◦ {s}</div>)}
          </div>
        </div>
        {[{ label: 'Love & Relationships', text: data.love, color: '#f472b6' }, { label: 'Career & Purpose', text: data.career, color: '#c9a84c' }, { label: 'Spiritual Path', text: data.spiritual, color: '#a78bfa' }].map(section => (
          <div key={section.label} style={{ marginBottom: '0.625rem' }}>
            <div style={{ color: section.color, fontSize: '0.62rem', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.3rem' }}>{section.label}</div>
            <p style={{ color: 'rgba(200,180,255,0.65)', fontSize: '0.8rem', margin: 0, lineHeight: 1.5 }}>{section.text}</p>
          </div>
        ))}
        <div style={{ marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid rgba(200,180,255,0.06)' }}>
          <div style={{ color: 'rgba(180,160,255,0.35)', fontSize: '0.62rem', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.4rem' }}>Famous {num}s</div>
          <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
            {data.famous.map(f => <span key={f} style={{ padding: '0.2rem 0.5rem', borderRadius: '2rem', background: `${data.color}10`, border: `1px solid ${data.color}22`, color: data.color, fontSize: '0.7rem' }}>{f}</span>)}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: '680px', margin: '0 auto', padding: '1.5rem 1rem 2rem' }}>
      <div style={{ marginBottom: '1.25rem' }}>
        <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.8rem', color: 'rgba(220,200,255,0.95)', margin: '0 0 0.25rem', fontWeight: 400 }}>Deep Numerology</h1>
        <p style={{ color: 'rgba(180,160,255,0.5)', fontSize: '0.8rem', margin: 0 }}>Your complete soul blueprint</p>
      </div>

      {/* Input */}
      <div style={{ ...card, padding: '1.25rem', marginBottom: '1.25rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '0.75rem' }}>
          <div>
            <div style={{ color: 'rgba(180,160,255,0.4)', fontSize: '0.62rem', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.4rem' }}>Birth Date</div>
            <input type="date" value={birthdate} onChange={e => setBirthdate(e.target.value)} style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(200,180,255,0.15)', borderRadius: '0.75rem', padding: '0.6rem 0.75rem', color: 'rgba(220,200,255,0.9)', fontSize: '0.85rem', outline: 'none', boxSizing: 'border-box' }} />
          </div>
          <div>
            <div style={{ color: 'rgba(180,160,255,0.4)', fontSize: '0.62rem', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.4rem' }}>Full Birth Name</div>
            <input value={name} onChange={e => setName(e.target.value)} placeholder="For Soul Urge & Destiny" style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(200,180,255,0.15)', borderRadius: '0.75rem', padding: '0.6rem 0.75rem', color: 'rgba(220,200,255,0.9)', fontSize: '0.85rem', outline: 'none', boxSizing: 'border-box' }} />
          </div>
        </div>
        <button onClick={calculate} style={{ width: '100%', padding: '0.75rem', borderRadius: '0.875rem', background: 'linear-gradient(135deg, #4c1d95, #7c3aed)', border: 'none', color: 'white', fontSize: '0.88rem', cursor: 'pointer', fontWeight: 600 }}>Calculate My Blueprint ✦</button>
      </div>

      {profile && (
        <>
          {/* Core numbers summary */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem', marginBottom: '1.25rem' }}>
            {[
              { label: 'Life Path', num: profile.lifePathNumber, desc: 'Your soul mission', color: NUM_DATA[profile.lifePathNumber]?.color || '#a78bfa' },
              { label: 'Soul Urge', num: profile.soulUrgeNumber, desc: 'Your heart desire', color: NUM_DATA[profile.soulUrgeNumber]?.color || '#f472b6' },
              { label: 'Destiny', num: profile.destinyNumber, desc: 'Your life purpose', color: NUM_DATA[profile.destinyNumber]?.color || '#c9a84c' },
            ].filter(n => n.num).map(n => (
              <div key={n.label} style={{ ...card, padding: '0.875rem', textAlign: 'center', borderColor: `${n.color}33` }}>
                <div style={{ color: n.color, fontSize: '1.6rem', fontWeight: 700, fontFamily: 'Cormorant Garamond, serif' }}>{n.num}</div>
                <div style={{ color: 'rgba(220,200,255,0.8)', fontSize: '0.72rem', fontWeight: 600, marginBottom: '0.15rem' }}>{n.label}</div>
                <div style={{ color: 'rgba(180,160,255,0.4)', fontSize: '0.62rem' }}>{n.desc}</div>
              </div>
            ))}
          </div>

          {/* Tabs */}
          <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '1.25rem' }}>
            {(['overview','cycles'] as const).map(t => (
              <button key={t} onClick={() => setActiveTab(t)} style={{ padding: '0.4rem 0.875rem', borderRadius: '2rem', border: activeTab === t ? '1px solid rgba(167,139,250,0.5)' : '1px solid rgba(200,180,255,0.1)', background: activeTab === t ? 'rgba(167,139,250,0.15)' : 'rgba(8,6,28,0.7)', color: activeTab === t ? '#a78bfa' : 'rgba(180,160,255,0.45)', fontSize: '0.75rem', cursor: 'pointer', textTransform: 'capitalize' }}>{t === 'cycles' ? 'Current Cycles' : 'Deep Readings'}</button>
            ))}
          </div>

          {activeTab === 'overview' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {profile.lifePathNumber && <NumberCard num={profile.lifePathNumber} label="Life Path Number" />}
              {profile.soulUrgeNumber > 0 && <NumberCard num={profile.soulUrgeNumber} label="Soul Urge Number" />}
              {profile.destinyNumber > 0 && <NumberCard num={profile.destinyNumber} label="Destiny Number" />}
            </div>
          )}

          {activeTab === 'cycles' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {[{ label: 'Personal Year', num: profile.personalYear, desc: `The overarching theme and energy of ${new Date().getFullYear()} for you.` }, { label: 'Personal Month', num: profile.personalMonth, desc: `The specific energy and focus for ${new Date().toLocaleString('default', { month: 'long' })} ${new Date().getFullYear()}.` }].map(cycle => {
                const data = NUM_DATA[cycle.num]
                if (!data) return null
                return (
                  <div key={cycle.label} style={{ ...card, padding: '1.25rem', borderColor: `${data.color}33` }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem', marginBottom: '0.75rem' }}>
                      <div style={{ width: '2.75rem', height: '2.75rem', borderRadius: '50%', background: `${data.color}18`, border: `1px solid ${data.color}44`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: data.color, fontSize: '1.2rem', fontWeight: 700, flexShrink: 0 }}>{cycle.num}</div>
                      <div>
                        <div style={{ color: 'rgba(180,160,255,0.4)', fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.15rem' }}>{cycle.label}</div>
                        <div style={{ color: data.color, fontSize: '0.95rem', fontWeight: 600 }}>{data.title}</div>
                      </div>
                    </div>
                    <p style={{ color: 'rgba(180,160,255,0.5)', fontSize: '0.8rem', margin: '0 0 0.625rem', fontStyle: 'italic' }}>{cycle.desc}</p>
                    <p style={{ color: 'rgba(200,180,255,0.75)', fontSize: '0.85rem', margin: 0, lineHeight: 1.6 }}>{data.purpose}</p>
                  </div>
                )
              })}
            </div>
          )}
        </>
      )}

      {!profile && (
        <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🧠</div>
          <p style={{ color: 'rgba(180,160,255,0.4)', fontSize: '0.88rem' }}>Enter your birthdate above to unlock your complete soul blueprint.</p>
        </div>
      )}
    </div>
  )
}
