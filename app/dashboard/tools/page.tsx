'use client'
import Link from 'next/link'

const TOOL_SECTIONS = [
  {
    title: 'Practice',
    tools: [
      { href: '/dashboard/meditations', emoji: '🧘', name: 'Meditations', desc: '6 guided practices', color: '#a78bfa' },
      { href: '/dashboard/rituals', emoji: '✦', name: 'Rituals', desc: 'Sacred daily practices', color: '#c9a84c' },
      { href: '/dashboard/affirmations', emoji: '💫', name: 'Affirmations', desc: 'Daily cosmic affirmations', color: '#60a5fa' },
    ],
  },
  {
    title: 'Guidance',
    tools: [
      { href: '/dashboard/oracle', emoji: '◈', name: 'Angel Oracle', desc: 'Draw sacred number spreads', color: '#e0e7ff' },
      { href: '/dashboard/dictionary', emoji: '📖', name: 'Number Dictionary', desc: 'All angel number meanings', color: '#34d399' },
      { href: '/dashboard/compatibility', emoji: '💞', name: 'Compatibility', desc: 'Numerology match score', color: '#ff6b9d' },
    ],
  },
  {
    title: 'Manifestation',
    tools: [
      { href: '/dashboard/manifestations', emoji: '🌱', name: 'Manifestations', desc: 'Track what you are calling in', color: '#4ade80' },
      { href: '/dashboard/vision-board', emoji: '🌌', name: 'Vision Board', desc: 'Your cosmic dream board', color: '#818cf8' },
      { href: '/dashboard/timeline', emoji: '⟳', name: 'Timeline', desc: 'Your full sighting history', color: '#fb923c' },
    ],
  },
  {
    title: 'Insights',
    tools: [
      { href: '/dashboard/insights', emoji: '📊', name: 'Insights', desc: 'Patterns in your numbers', color: '#fbbf24' },
      { href: '/dashboard/synthesis', emoji: '🌙', name: 'Cosmic Synthesis', desc: 'Weekly cosmic report', color: '#a78bfa' },
      { href: '/dashboard/calendar', emoji: '📅', name: 'Cosmic Calendar', desc: 'Moon phases and energies', color: '#60a5fa' },
    ],
  },
  {
    title: 'Journey',
    tools: [
      { href: '/dashboard/badges', emoji: '🎖', name: 'Badges', desc: 'Your spiritual milestones', color: '#c9a84c' },
      { href: '/dashboard/soul-twin', emoji: '💫', name: 'Soul Twin Radar', desc: 'Find your cosmic match', color: '#ff6b9d' },
      { href: '/dashboard/profile-card', emoji: '◎', name: 'Profile Card', desc: 'Share your cosmic identity', color: '#818cf8' },
    ],
  },
]

export default function ToolsPage() {
  return (
    <div style={{ maxWidth: '640px', margin: '0 auto', padding: '1.5rem 1rem 2rem' }}>
      <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.8rem', color: 'rgba(220,200,255,0.95)', margin: '0 0 0.25rem', fontWeight: 400 }}>Cosmic Tools</h1>
      <p style={{ color: 'rgba(180,160,255,0.5)', fontSize: '0.8rem', margin: '0 0 1.75rem' }}>Everything you need for your spiritual journey</p>

      {TOOL_SECTIONS.map(section => (
        <div key={section.title} style={{ marginBottom: '1.75rem' }}>
          <div style={{ color: 'rgba(180,160,255,0.4)', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: 600, marginBottom: '0.75rem' }}>{section.title}</div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.6rem' }}>
            {section.tools.map(tool => (
              <Link key={tool.href} href={tool.href} style={{ textDecoration: 'none' }}>
                <div style={{ background: 'rgba(8,6,28,0.88)', border: '1px solid rgba(200,180,255,0.12)', borderRadius: '1rem', backdropFilter: 'blur(12px)', padding: '1rem 0.75rem', textAlign: 'center', cursor: 'pointer' }}>
                  <div style={{ fontSize: '1.6rem', marginBottom: '0.4rem' }}>{tool.emoji}</div>
                  <div style={{ color: 'rgba(220,200,255,0.9)', fontSize: '0.78rem', fontWeight: 600, marginBottom: '0.2rem', lineHeight: 1.2 }}>{tool.name}</div>
                  <div style={{ color: 'rgba(180,160,255,0.45)', fontSize: '0.65rem', lineHeight: 1.3 }}>{tool.desc}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      ))}

      <Link href="/dashboard/upgrade" style={{ textDecoration: 'none' }}>
        <div style={{ background: 'rgba(201,168,76,0.08)', border: '1px solid rgba(201,168,76,0.3)', borderRadius: '1.25rem', padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.5rem' }}>
          <span style={{ fontSize: '1.8rem' }}>👑</span>
          <div style={{ flex: 1 }}>
            <div style={{ color: '#c9a84c', fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.15rem' }}>Unlock Premium</div>
            <div style={{ color: 'rgba(180,160,255,0.55)', fontSize: '0.75rem' }}>Full oracle readings, AI guidance, soul twin matching and more</div>
          </div>
          <span style={{ color: 'rgba(201,168,76,0.5)', fontSize: '1rem' }}>&#x203a;</span>
        </div>
      </Link>
    </div>
  )
}
