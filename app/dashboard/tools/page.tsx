'use client'
import Link from 'next/link'

const TOOL_SECTIONS = [
  {
    title: 'Daily Practice',
    emoji: '🌅',
    tools: [
      { href: '/dashboard/meditations', emoji: '🧘', name: 'Meditations', desc: '6 guided practices', color: '#a78bfa' },
      { href: '/dashboard/rituals', emoji: '✦', name: 'Rituals', desc: 'Sacred daily practices', color: '#c9a84c' },
      { href: '/dashboard/affirmations', emoji: '💫', name: 'Affirmations', desc: 'Daily cosmic affirmations', color: '#60a5fa' },
      { href: '/dashboard/gratitude', emoji: '💛', name: 'Gratitude', desc: 'Gratitude journal & streaks', color: '#fbbf24' },
      { href: '/dashboard/breathwork', emoji: '🌀', name: 'Breathwork', desc: 'Guided breathing exercises', color: '#67e8f9' },
    ],
  },
  {
    title: 'Guidance & Divination',
    emoji: '✨',
    tools: [
      { href: '/dashboard/oracle', emoji: '◈', name: 'Angel Oracle', desc: 'Draw sacred number spreads', color: '#e0e7ff' },
      { href: '/dashboard/tarot', emoji: '🃏', name: 'Daily Tarot', desc: 'Major Arcana daily card', color: '#f472b6' },
      { href: '/dashboard/dictionary', emoji: '📖', name: 'Number Dictionary', desc: '18 angel number meanings', color: '#34d399' },
      { href: '/dashboard/moon', emoji: '🌙', name: 'Moon Phases', desc: 'Lunar energy & rituals', color: '#94a3b8' },
      { href: '/dashboard/crystals', emoji: '💎', name: 'Crystal Guide', desc: 'Crystals for your numbers', color: '#67e8f9' },
    ],
  },
  {
    title: 'Numerology & Soul',
    emoji: '✶',
    tools: [
      { href: '/dashboard/numerology-deep', emoji: '🧮', name: 'Deep Numerology', desc: 'Full soul blueprint reading', color: '#a78bfa' },
      { href: '/dashboard/compatibility', emoji: '💞', name: 'Compatibility', desc: 'Numerology match score', color: '#ff6b9d' },
      { href: '/dashboard/chakras', emoji: '🌀', name: 'Chakra Map', desc: 'Energy body alignment', color: '#f97316' },
      { href: '/dashboard/solfeggio', emoji: '🎵', name: 'Solfeggio Tones', desc: 'Sacred healing frequencies', color: '#818cf8' },
    ],
  },
  {
    title: 'Manifestation',
    emoji: '🌱',
    tools: [
      { href: '/dashboard/manifestations', emoji: '🌱', name: 'Manifestations', desc: 'Track what you are calling in', color: '#4ade80' },
      { href: '/dashboard/vision-board', emoji: '🌌', name: 'Vision Board', desc: 'Your cosmic dream board', color: '#818cf8' },
      { href: '/dashboard/timeline', emoji: '⟳', name: 'Timeline', desc: 'Full sighting history', color: '#fb923c' },
      { href: '/dashboard/calendar', emoji: '📅', name: 'Cosmic Calendar', desc: 'Angel number calendar view', color: '#60a5fa' },
    ],
  },
  {
    title: 'Insights & Reports',
    emoji: '📊',
    tools: [
      { href: '/dashboard/synthesis', emoji: '✶', name: 'Cosmic Synthesis', desc: 'Weekly pattern report', color: '#c9a84c' },
      { href: '/dashboard/insights', emoji: '📊', name: 'Insights', desc: 'Your number patterns', color: '#a78bfa' },
      { href: '/dashboard/badges', emoji: '🏆', name: 'Badges', desc: 'Achievements & milestones', color: '#fbbf24' },
      { href: '/dashboard/stats', emoji: '📊', name: 'Stats', desc: 'Number frequency & heatmap', color: '#60a5fa' },
    ],
  },
  {
    title: 'Community & Profile',
    emoji: '🌍',
    tools: [
      { href: '/dashboard/soul-twin', emoji: '🧬', name: 'Soul Twin Radar', desc: 'Find your number matches', color: '#f472b6' },
      { href: '/dashboard/profile-card', emoji: '◎', name: 'Profile Card', desc: 'Your shareable cosmic card', color: '#60a5fa' },
      { href: '/dashboard/upgrade', emoji: '✨', name: 'Upgrade', desc: 'Premium features', color: '#c9a84c' },
      { href: '/dashboard/notifications', emoji: '🔔', name: 'Notifications', desc: 'Reminders & alerts', color: '#fbbf24' },
      { href: '/dashboard/settings', emoji: '⚙️', name: 'Settings', desc: 'App preferences', color: '#94a3b8' },
    ],
  },
]

export default function ToolsPage() {
  const card: React.CSSProperties = { background: 'rgba(8,6,28,0.88)', border: '1px solid rgba(200,180,255,0.12)', borderRadius: '1.25rem', backdropFilter: 'blur(12px)' }
  return (
    <div style={{ maxWidth: '680px', margin: '0 auto', padding: '1.5rem 1rem 2rem' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.8rem', color: 'rgba(220,200,255,0.95)', margin: '0 0 0.25rem', fontWeight: 400 }}>Sacred Tools</h1>
        <p style={{ color: 'rgba(180,160,255,0.5)', fontSize: '0.8rem', margin: 0 }}>30+ spiritual tools for your awakening journey</p>
      </div>
      {TOOL_SECTIONS.map(section => (
        <div key={section.title} style={{ marginBottom: '1.75rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '1rem' }}>{section.emoji}</span>
            <span style={{ color: 'rgba(180,160,255,0.5)', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: 600 }}>{section.title}</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: '0.625rem' }}>
            {section.tools.map(tool => (
              <Link key={tool.href} href={tool.href} style={{ textDecoration: 'none' }}>
                <div style={{ ...card, padding: '1rem', cursor: 'pointer', transition: 'all 0.2s', borderColor: 'rgba(200,180,255,0.1)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
                    <div style={{ width: '2rem', height: '2rem', borderRadius: '0.5rem', background: tool.color+'18', border: '1px solid '+tool.color+'33', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.9rem', flexShrink: 0 }}>{tool.emoji}</div>
                    <span style={{ color: 'rgba(220,200,255,0.9)', fontSize: '0.82rem', fontWeight: 600 }}>{tool.name}</span>
                  </div>
                  <div style={{ color: 'rgba(180,160,255,0.4)', fontSize: '0.68rem', lineHeight: 1.4 }}>{tool.desc}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}