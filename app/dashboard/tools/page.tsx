'use client'
import Link from 'next/link'

const SECTIONS = [
  {
    title: 'Daily Practice',
    emoji: '☀️',
    color: '#c9a84c',
    items: [
      { href: '/dashboard', emoji: '✦', label: 'Home', desc: 'Daily guidance & logger' },
      { href: '/dashboard/gratitude', emoji: '🙏', label: 'Gratitude', desc: 'Daily gratitude practice' },
      { href: '/dashboard/affirmations', emoji: '💫', label: 'Affirmations', desc: 'Daily cosmic affirmations' },
      { href: '/dashboard/breathwork', emoji: '💨', label: 'Breathwork', desc: 'Guided breathing patterns' },
      { href: '/dashboard/meditations', emoji: '🧘', label: 'Meditations', desc: 'Guided meditation sessions' },
      { href: '/dashboard/streak', emoji: '🔥', label: 'Streak', desc: 'Daily practice streak' },
    ]
  },
  {
    title: 'Angel Numbers',
    emoji: '✨',
    color: '#a78bfa',
    items: [
      { href: '/dashboard/journal', emoji: '📖', label: 'Journal', desc: 'Log & track angel numbers' },
      { href: '/dashboard/oracle', emoji: '◈', label: 'Oracle', desc: 'Angel number readings' },
      { href: '/dashboard/dictionary', emoji: '📚', label: 'Dictionary', desc: 'Full number meanings guide' },
      { href: '/dashboard/insights', emoji: '🔍', label: 'Insights', desc: 'Your number patterns' },
      { href: '/dashboard/stats', emoji: '📊', label: 'Statistics', desc: 'Your logging analytics' },
    ]
  },
  {
    title: 'Numerology',
    emoji: '🔢',
    color: '#60a5fa',
    items: [
      { href: '/dashboard/numerology-deep', emoji: '🧮', label: 'Deep Numerology', desc: 'Full soul blueprint' },
      { href: '/dashboard/compatibility', emoji: '💞', label: 'Compatibility', desc: 'Numerology match score' },
      { href: '/dashboard/personal-year', emoji: '📅', label: 'Personal Year', desc: 'Your yearly cycle number' },
      { href: '/dashboard/karmic-debt', emoji: '⚖️', label: 'Karmic Debt', desc: 'Karmic lessons & patterns' },
    ]
  },
  {
    title: 'Cosmic Tools',
    emoji: '🌌',
    color: '#34d399',
    items: [
      { href: '/dashboard/moon', emoji: '🌙', label: 'Moon Calendar', desc: 'Lunar phases & rituals' },
      { href: '/dashboard/tarot', emoji: '🃏', label: 'Tarot', desc: 'Daily tarot card draws' },
      { href: '/dashboard/chakras', emoji: '🌀', label: 'Chakras', desc: 'Chakra balance guide' },
      { href: '/dashboard/crystals', emoji: '💎', label: 'Crystals', desc: 'Crystal healing guide' },
      { href: '/dashboard/solfeggio', emoji: '🎵', label: 'Solfeggio', desc: 'Healing frequencies' },
      { href: '/dashboard/rituals', emoji: '✦', label: 'Rituals', desc: 'Sacred ritual guides' },
    ]
  },
  {
    title: 'Manifestation',
    emoji: '🌱',
    color: '#4ade80',
    items: [
      { href: '/dashboard/manifestations', emoji: '🌱', label: 'Manifestations', desc: 'Track what you are calling in' },
      { href: '/dashboard/vision-board', emoji: '🌌', label: 'Vision Board', desc: 'Your cosmic dream board' },
      { href: '/dashboard/timeline', emoji: '⏳', label: 'Timeline', desc: 'Your manifestation timeline' },
      { href: '/dashboard/synthesis', emoji: '✶', label: 'Cosmic Synthesis', desc: 'Weekly pattern report' },
    ]
  },
  {
    title: 'Dreams & Soul',
    emoji: '🌙',
    color: '#f472b6',
    items: [
      { href: '/dashboard/dreams', emoji: '🌙', label: 'Dream Journal', desc: 'Log & decode your dreams' },
      { href: '/dashboard/soul-twin', emoji: '🧬', label: 'Soul Twin Radar', desc: 'Find your number matches' },
      { href: '/dashboard/circles', emoji: '⭕', label: 'Angel Circles', desc: 'Community by number' },
      { href: '/dashboard/calendar', emoji: '📆', label: 'Cosmic Calendar', desc: 'Spiritual event calendar' },
    ]
  },
  {
    title: 'Social & Profile',
    emoji: '👤',
    color: '#fb923c',
    items: [
      { href: '/dashboard/feed', emoji: '✧', label: 'Cosmic Feed', desc: 'Posts from matched souls' },
      { href: '/dashboard/profile', emoji: '◎', label: 'Profile', desc: 'Your spiritual identity' },
      { href: '/dashboard/profile-card', emoji: '🪪', label: 'Profile Card', desc: 'Shareable soul card' },
      { href: '/dashboard/badges', emoji: '🏅', label: 'Badges', desc: 'Your spiritual achievements' },
    ]
  },
  {
    title: 'Account',
    emoji: '⚙️',
    color: '#94a3b8',
    items: [
      { href: '/dashboard/settings', emoji: '⚙️', label: 'Settings', desc: 'App preferences' },
      { href: '/dashboard/upgrade', emoji: '⭐', label: 'Upgrade', desc: 'Premium features' },
      { href: '/dashboard/notifications', emoji: '🔔', label: 'Notifications', desc: 'Alerts & reminders' },
      { href: '/dashboard/onboarding', emoji: '🚀', label: 'Onboarding', desc: 'Setup your profile' },
    ]
  },
]

export default function ToolsPage() {
  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '1.5rem 1rem 2rem' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.8rem', color: 'rgba(220,200,255,0.95)', margin: '0 0 0.25rem', fontWeight: 400 }}>All Features</h1>
        <p style={{ color: 'rgba(180,160,255,0.5)', fontSize: '0.8rem', margin: 0 }}>Your complete spiritual toolkit</p>
      </div>

      {SECTIONS.map(section => (
        <div key={section.title} style={{ marginBottom: '1.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '1rem' }}>{section.emoji}</span>
            <h2 style={{ color: section.color, fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.12em', margin: 0, fontWeight: 600 }}>{section.title}</h2>
            <div style={{ flex: 1, height: '1px', background: section.color + '20', marginLeft: '0.5rem' }} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.5rem' }}>
            {section.items.map(item => (
              <Link key={item.href} href={item.href} style={{ textDecoration: 'none' }}>
                <div style={{
                  background: 'rgba(8,6,28,0.82)',
                  border: '1px solid rgba(200,180,255,0.1)',
                  borderRadius: '0.875rem',
                  padding: '0.875rem',
                  backdropFilter: 'blur(12px)',
                  transition: 'all 0.2s ease',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                }}>
                  <div style={{
                    width: '2.25rem', height: '2.25rem', borderRadius: '0.625rem', flexShrink: 0,
                    background: section.color + '15',
                    border: '1px solid ' + section.color + '25',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '1rem',
                  }}>{item.emoji}</div>
                  <div style={{ minWidth: 0 }}>
                    <div style={{ color: 'rgba(220,200,255,0.88)', fontSize: '0.82rem', fontWeight: 500, marginBottom: '0.1rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.label}</div>
                    <div style={{ color: 'rgba(180,160,255,0.4)', fontSize: '0.68rem', lineHeight: 1.3, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' }}>{item.desc}</div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
