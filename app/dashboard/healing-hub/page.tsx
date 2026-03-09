'use client';
import Link from 'next/link';

const HEALING_SECTIONS = [
  {
    title: 'Sound & Frequency',
    color: '#c9a84c',
    gradient: 'rgba(201,168,76,0.12)',
    border: 'rgba(201,168,76,0.25)',
    items: [
      { href: '/dashboard/solfeggio', emoji: '🎵', name: 'Solfeggio Frequencies', desc: '396Hz to 963Hz healing tones for body and soul' },
      { href: '/dashboard/breathwork', emoji: '💨', name: 'Sacred Breathwork', desc: 'Box breathing, 4-7-8, and cosmic breath patterns' },
      { href: '/dashboard/meditations', emoji: '🧘', name: 'Guided Meditations', desc: 'Angel number activations and chakra journeys' },
    ]
  },
  {
    title: 'Energy & Chakras',
    color: '#f472b6',
    gradient: 'rgba(244,114,182,0.12)',
    border: 'rgba(244,114,182,0.25)',
    items: [
      { href: '/dashboard/chakras', emoji: '🌈', name: 'Chakra Alignment', desc: 'Balance your 7 energy centers with angel numbers' },
      { href: '/dashboard/crystals', emoji: '💎', name: 'Crystal Guide', desc: 'Crystals aligned to your angel number frequency' },
      { href: '/dashboard/rituals', emoji: '🕯️', name: 'Sacred Rituals', desc: 'Moon rituals, number ceremonies, and daily practices' },
    ]
  },
  {
    title: 'Mind & Spirit',
    color: '#a78bfa',
    gradient: 'rgba(167,139,250,0.12)',
    border: 'rgba(167,139,250,0.25)',
    items: [
      { href: '/dashboard/affirmations', emoji: '💫', name: 'Affirmations', desc: 'Numerology-aligned affirmations for your life path' },
      { href: '/dashboard/gratitude', emoji: '🙏', name: 'Gratitude Practice', desc: 'Daily gratitude with angel number guidance' },
      { href: '/dashboard/oracle', emoji: '◈', name: 'Angel Oracle', desc: 'Receive channeled messages from your guides' },
    ]
  },
  {
    title: 'Dreams & Visions',
    color: '#60a5fa',
    gradient: 'rgba(96,165,250,0.12)',
    border: 'rgba(96,165,250,0.25)',
    items: [
      { href: '/dashboard/dreams', emoji: '🌙', name: 'Dream Journal', desc: 'Record and decode your sacred dream messages' },
      { href: '/dashboard/vision-board', emoji: '🖼️', name: 'Vision Board', desc: 'Manifest your highest timeline visually' },
      { href: '/dashboard/manifestations', emoji: '🌱', name: 'Manifestations', desc: 'Track what you are calling into reality' },
    ]
  },
];

const DAILY_PRACTICES = [
  { time: 'Morning', emoji: '🌅', practice: 'Set your intention with a number log', href: '/dashboard', color: '#f59e0b' },
  { time: 'Midday', emoji: '☀️', practice: 'Check your cosmic weather forecast', href: '/dashboard/cosmic-weather', color: '#f97316' },
  { time: 'Evening', emoji: '🌆', practice: 'Breathwork or meditation session', href: '/dashboard/breathwork', color: '#8b5cf6' },
  { time: 'Night', emoji: '🌙', practice: 'Dream journal and gratitude practice', href: '/dashboard/dreams', color: '#3b82f6' },
];

export default function HealingHubPage() {
  return (
    <div style={{ minHeight: '100vh', padding: '2rem 1rem', maxWidth: '800px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <div style={{
          width: '80px', height: '80px', borderRadius: '50%', margin: '0 auto 1rem',
          background: 'radial-gradient(circle, rgba(74,222,128,0.3) 0%, rgba(96,165,250,0.2) 60%, transparent 100%)',
          border: '1px solid rgba(74,222,128,0.4)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem',
          boxShadow: '0 0 40px rgba(74,222,128,0.15)'
        }}>🌿</div>
        <h1 style={{ fontSize: '2rem', fontWeight: 700, color: '#4ade80', fontFamily: 'Cormorant Garamond, serif' }}>Healing Hub</h1>
        <p style={{ color: 'rgba(255,255,255,0.5)', marginTop: '0.5rem', maxWidth: '400px', margin: '0.5rem auto 0' }}>Your sacred space for sound healing, energy work, and spiritual restoration</p>
      </div>

      {/* Daily Rhythm */}
      <div style={{
        background: 'rgba(8,6,28,0.88)', borderRadius: '1.5rem',
        border: '1px solid rgba(255,255,255,0.08)', padding: '1.5rem',
        backdropFilter: 'blur(12px)', marginBottom: '1.75rem'
      }}>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.7rem', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '1rem' }}>Daily Healing Rhythm</p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem' }}>
          {DAILY_PRACTICES.map(p => (
            <Link key={p.time} href={p.href} style={{
              background: `${p.color}08`, border: `1px solid ${p.color}20`,
              borderRadius: '1rem', padding: '0.875rem', textDecoration: 'none',
              display: 'flex', flexDirection: 'column', gap: '0.25rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '1.1rem' }}>{p.emoji}</span>
                <span style={{ color: p.color, fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{p.time}</span>
              </div>
              <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.8rem', lineHeight: 1.4 }}>{p.practice}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* Healing Sections */}
      {HEALING_SECTIONS.map(section => (
        <div key={section.title} style={{
          background: section.gradient, borderRadius: '1.5rem',
          border: `1px solid ${section.border}`, padding: '1.5rem',
          backdropFilter: 'blur(12px)', marginBottom: '1.25rem'
        }}>
          <p style={{ color: section.color, fontSize: '0.7rem', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '1rem', fontWeight: 700 }}>{section.title}</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
            {section.items.map(item => (
              <Link key={item.href} href={item.href} style={{
                background: 'rgba(0,0,0,0.2)', borderRadius: '1rem',
                border: '1px solid rgba(255,255,255,0.06)', padding: '0.875rem 1rem',
                textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.875rem'
              }}>
                <span style={{
                  width: '42px', height: '42px', borderRadius: '50%', flexShrink: 0,
                  background: `${section.color}15`, border: `1px solid ${section.color}30`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem'
                }}>{item.emoji}</span>
                <div>
                  <p style={{ color: '#fff', fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.15rem' }}>{item.name}</p>
                  <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.78rem' }}>{item.desc}</p>
                </div>
                <span style={{ marginLeft: 'auto', color: 'rgba(255,255,255,0.2)', fontSize: '1rem' }}>›</span>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}