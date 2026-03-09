'use client'
import Link from 'next/link'

const SECTIONS = [
  {
    title: 'Numerology',
    emoji: '🧮',
    color: '#a78bfa',
    tools: [
      { href: '/dashboard/numerology-deep', emoji: '🔮', label: 'Deep Numerology', desc: 'Full soul blueprint' },
      { href: '/dashboard/compatibility', emoji: '💞', label: 'Compatibility', desc: 'Match score calculator' },
      { href: '/dashboard/personal-year', emoji: '📅', label: 'Personal Year', desc: 'Annual forecast' },
      { href: '/dashboard/karmic-debt', emoji: '♾️', label: 'Karmic Debt', desc: 'Past life patterns' },
    ]
  },
  {
    title: 'Angel Numbers',
    emoji: '✨',
    color: '#c9a84c',
    tools: [
      { href: '/dashboard/journal', emoji: '📖', label: 'Journal', desc: 'Thought anchor log' },
      { href: '/dashboard/dictionary', emoji: '📚', label: 'Dictionary', desc: 'All number meanings' },
      { href: '/dashboard/stats', emoji: '📊', label: 'Statistics', desc: 'Your number patterns' },
      { href: '/dashboard/streak', emoji: '🔥', label: 'Streaks', desc: 'Daily logging streaks' },
    ]
  },
  {
    title: 'Cosmic Tools',
    emoji: '🌙',
    color: '#60a5fa',
    tools: [
      { href: '/dashboard/moon', emoji: '🌕', label: 'Moon Phase', desc: 'Lunar energy & rituals' },
      { href: '/dashboard/tarot', emoji: '🃏', label: 'Angel Tarot', desc: 'Daily card reading' },
      { href: '/dashboard/oracle', emoji: '◈', label: 'Oracle', desc: 'Number oracle cards' },
      { href: '/dashboard/calendar', emoji: '📆', label: 'Cosmic Calendar', desc: 'Auspicious dates' },
    ]
  },
  {
    title: 'Healing & Wellness',
    emoji: '🧘',
    color: '#34d399',
    tools: [
      { href: '/dashboard/chakras', emoji: '🌀', label: 'Chakras', desc: 'Energy center tracker' },
      { href: '/dashboard/breathwork', emoji: '💨', label: 'Breathwork', desc: 'Sacred breathing patterns' },
      { href: '/dashboard/meditations', emoji: '🧘', label: 'Meditations', desc: 'Guided sessions' },
      { href: '/dashboard/solfeggio', emoji: '🎵', label: 'Solfeggio', desc: 'Sacred frequencies' },
    ]
  },
  {
    title: 'Manifestation',
    emoji: '🌱',
    color: '#4ade80',
    tools: [
      { href: '/dashboard/manifestations', emoji: '🌱', label: 'Manifestations', desc: 'Track your desires' },
      { href: '/dashboard/vision-board', emoji: '🌌', label: 'Vision Board', desc: 'Cosmic dream board' },
      { href: '/dashboard/affirmations', emoji: '💫', label: 'Affirmations', desc: 'Daily power statements' },
      { href: '/dashboard/rituals', emoji: '❆', label: 'Rituals', desc: 'Sacred practices' },
    ]
  },
  {
    title: 'Journaling',
    emoji: '📓',
    color: '#f472b6',
    tools: [
      { href: '/dashboard/dreams', emoji: '🌙', label: 'Dream Journal', desc: 'Nightly visions' },
      { href: '/dashboard/gratitude', emoji: '💗', label: 'Gratitude', desc: 'Daily thankfulness' },
      { href: '/dashboard/timeline', emoji: '⏳', label: 'Timeline', desc: 'Your spiritual journey' },
      { href: '/dashboard/insights', emoji: '💡', label: 'Insights', desc: 'Pattern revelations' },
    ]
  },
  {
    title: 'Community',
    emoji: '🌍',
    color: '#fb923c',
    tools: [
      { href: '/dashboard/feed', emoji: '❇', label: 'Cosmic Feed', desc: 'Soul-matched posts' },
      { href: '/dashboard/sync', emoji: '⦿', label: 'Sync Matching', desc: 'Find your matches' },
      { href: '/dashboard/soul-twin', emoji: '🧬', label: 'Soul Twin Radar', desc: 'Twin flame finder' },
      { href: '/dashboard/circles', emoji: '🪄', label: 'Circles', desc: 'Sacred communities' },
    ]
  },
  {
    title: 'Profile & Growth',
    emoji: '◎',
    color: '#818cf8',
    tools: [
      { href: '/dashboard/profile', emoji: '◎', label: 'My Profile', desc: 'Your cosmic identity' },
      { href: '/dashboard/badges', emoji: '🏅', label: 'Badges', desc: 'Spiritual achievements' },
      { href: '/dashboard/synthesis', emoji: '✶', label: 'Cosmic Synthesis', desc: 'Weekly pattern report' },
      { href: '/dashboard/upgrade', emoji: '✨', label: 'Premium', desc: 'Unlock all features' },
    ]
  },
]

export default function ToolsPage() {
  const card: React.CSSProperties = {background:'rgba(8,6,28,0.88)',border:'1px solid rgba(200,180,255,0.1)',borderRadius:'1.25rem',backdropFilter:'blur(12px)'}

  return (
    <div style={{maxWidth:'680px',margin:'0 auto',padding:'1.5rem 1rem 2rem'}}>
      <h1 style={{fontFamily:'Cormorant Garamond,serif',fontSize:'1.8rem',color:'rgba(220,200,255,0.95)',margin:'0 0 0.25rem',fontWeight:400}}>All Tools</h1>
      <p style={{color:'rgba(180,160,255,0.5)',fontSize:'0.8rem',margin:'0 0 1.5rem'}}>Your complete spiritual toolkit — {SECTIONS.reduce((s,sec)=>s+sec.tools.length,0)} features</p>

      {SECTIONS.map(section => (
        <div key={section.title} style={{marginBottom:'1.5rem'}}>
          <div style={{display:'flex',alignItems:'center',gap:'0.5rem',marginBottom:'0.75rem'}}>
            <span style={{fontSize:'1rem'}}>{section.emoji}</span>
            <span style={{color:section.color,fontSize:'0.72rem',textTransform:'uppercase',letterSpacing:'0.12em',fontWeight:600}}>{section.title}</span>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'0.5rem'}}>
            {section.tools.map(tool => (
              <Link key={tool.href} href={tool.href} style={{textDecoration:'none'}}>
                <div style={{...card,padding:'0.875rem',display:'flex',alignItems:'center',gap:'0.75rem',cursor:'pointer',transition:'all 0.2s'}}>
                  <div style={{width:'38px',height:'38px',borderRadius:'0.625rem',background:section.color+'12',border:'1px solid '+section.color+'20',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0,fontSize:'1.1rem'}}>{tool.emoji}</div>
                  <div style={{minWidth:0}}>
                    <div style={{color:'rgba(220,200,255,0.85)',fontSize:'0.82rem',fontWeight:600,marginBottom:'0.1rem'}}>{tool.label}</div>
                    <div style={{color:'rgba(180,160,255,0.4)',fontSize:'0.7rem',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{tool.desc}</div>
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
