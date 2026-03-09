'use client';
import Link from 'next/link';

const HEALING_SECTIONS = [
  {
    title: 'Energy & Frequency',
    items: [
      { href: '/dashboard/chakras', icon: '🌈', name: 'Chakra Alignment', desc: 'Balance your 7 energy centers', color: '#8b5cf6' },
      { href: '/dashboard/solfeggio', icon: '🎵', name: 'Solfeggio Frequencies', desc: '9 sacred healing tones', color: '#3b82f6' },
      { href: '/dashboard/crystals', icon: '💎', name: 'Crystal Guide', desc: 'Stones aligned to your numbers', color: '#c9a84c' },
      { href: '/dashboard/breathwork', icon: '🌬️', name: 'Sacred Breathwork', desc: 'Breathing for healing & clarity', color: '#22c55e' },
    ]
  },
  {
    title: 'Cosmic Wisdom',
    items: [
      { href: '/dashboard/moon', icon: '🌙', name: 'Moon Calendar', desc: 'Align with lunar cycles', color: '#6366f1' },
      { href: '/dashboard/tarot', icon: '🃏', name: 'Angel Tarot', desc: 'Major Arcana guidance', color: '#ec4899' },
      { href: '/dashboard/oracle', icon: '🔮', name: 'Angel Oracle', desc: 'Divine messages for you', color: '#8b5cf6' },
      { href: '/dashboard/cosmic-weather', icon: '🌌', name: 'Cosmic Weather', desc: 'Daily energetic forecast', color: '#06b6d4' },
    ]
  },
  {
    title: 'Numerology Deep Dive',
    items: [
      { href: '/dashboard/dictionary', icon: '📖', name: 'Number Dictionary', desc: 'Complete angel number guide', color: '#c9a84c' },
      { href: '/dashboard/personal-year', icon: '📅', name: 'Personal Year', desc: 'Your yearly numerology cycle', color: '#f97316' },
      { href: '/dashboard/karmic-debt', icon: '⚖️', name: 'Karmic Debt', desc: 'Understand your soul lessons', color: '#ef4444' },
      { href: '/dashboard/compatibility', icon: '💞', name: 'Compatibility', desc: 'Numerology relationship match', color: '#f9a8d4' },
    ]
  },
  {
    title: 'Mind & Spirit',
    items: [
      { href: '/dashboard/meditations', icon: '🧘', name: 'Guided Meditations', desc: 'Sacred meditation sessions', color: '#8b5cf6' },
      { href: '/dashboard/affirmations', icon: '✨', name: 'Affirmations', desc: 'Daily spiritual affirmations', color: '#22c55e' },
      { href: '/dashboard/gratitude', icon: '🙏', name: 'Gratitude Practice', desc: 'Daily gratitude ritual', color: '#f97316' },
      { href: '/dashboard/rituals', icon: '🕯️', name: 'Sacred Rituals', desc: 'Spiritual practices & ceremonies', color: '#c9a84c' },
    ]
  },
  {
    title: 'Insights & Growth',
    items: [
      { href: '/dashboard/insights', icon: '📊', name: 'Cosmic Insights', desc: 'Patterns in your journey', color: '#3b82f6' },
      { href: '/dashboard/vision-board', icon: '🎯', name: 'Vision Board', desc: 'Sacred intentions & goals', color: '#ec4899' },
      { href: '/dashboard/manifestations', icon: '🌱', name: 'Manifestations', desc: 'Track what you are creating', color: '#22c55e' },
      { href: '/dashboard/badges', icon: '🏆', name: 'Spiritual Badges', desc: 'Achievements on your path', color: '#c9a84c' },
    ]
  },
];

export default function HealingHubPage() {
  return (
    <div style={{ minHeight: '100vh', padding: '2rem 1rem', maxWidth: '900px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <div style={{ fontSize: '3rem', marginBottom: '0.75rem' }}>🌿</div>
        <h1 style={{ fontSize: '2.2rem', fontWeight: 700, color: '#c9a84c', fontFamily: 'Cormorant Garamond, serif' }}>Healing Hub</h1>
        <p style={{ color: 'rgba(255,255,255,0.6)', marginTop: '0.5rem', fontSize: '1rem' }}>Your complete spiritual wellness sanctuary</p>
      </div>

      {HEALING_SECTIONS.map(section => (
        <div key={section.title} style={{ marginBottom: '2.5rem' }}>
          <h2 style={{
            color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem', fontWeight: 700,
            letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '1rem',
            paddingLeft: '0.25rem'
          }}>{section.title}</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem' }}>
            {section.items.map(item => (
              <Link key={item.href} href={item.href} style={{ textDecoration: 'none' }}>
                <div style={{
                  background: 'rgba(8,6,28,0.85)', borderRadius: '1.25rem',
                  border: `1px solid ${item.color}25`,
                  padding: '1.25rem', cursor: 'pointer',
                  backdropFilter: 'blur(12px)',
                  transition: 'all 0.2s',
                  display: 'flex', alignItems: 'center', gap: '1rem'
                }}>
                  <div style={{
                    width: '48px', height: '48px', borderRadius: '12px', flexShrink: 0,
                    background: `${item.color}20`, border: `1px solid ${item.color}40`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '1.5rem'
                  }}>{item.icon}</div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ color: '#fff', fontWeight: 600, fontSize: '0.95rem' }}>{item.name}</div>
                    <div style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.78rem', marginTop: '0.15rem' }}>{item.desc}</div>
                  </div>
                  <div style={{ color: item.color, fontSize: '1rem', flexShrink: 0 }}>›</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}