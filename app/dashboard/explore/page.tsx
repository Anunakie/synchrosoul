'use client'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

const TOOL_SECTIONS = [
  {
    title: 'Numerology',
    emoji: '🔢',
    color: '#a78bfa',
    tools: [
      { href:'/dashboard/numerology-deep', emoji:'🧮', name:'Deep Numerology', desc:'Life Path, Soul Urge, Destiny & more' },
      { href:'/dashboard/personal-year', emoji:'📅', name:'Personal Year', desc:'Your current year energy cycle' },
      { href:'/dashboard/karmic-debt', emoji:'⚖️', name:'Karmic Debt', desc:'Karmic lessons & soul contracts' },
      { href:'/dashboard/compatibility', emoji:'💞', name:'Compatibility', desc:'Numerology match with anyone' },
    ]
  },
  {
    title: 'Divination',
    emoji: '🔮',
    color: '#c9a84c',
    tools: [
      { href:'/dashboard/oracle', emoji:'✦', name:'Angel Oracle', desc:'Channeled messages from your guides' },
      { href:'/dashboard/tarot', emoji:'🃏', name:'Cosmic Tarot', desc:'Major Arcana readings' },
      { href:'/dashboard/dictionary', emoji:'📖', name:'Number Dictionary', desc:'29 angel sequences decoded' },
      { href:'/dashboard/saved-readings', emoji:'🔖', name:'Saved Readings', desc:'Your bookmarked readings' },
      { href:'/dashboard/moon', emoji:'🌙', name:'Moon Phases', desc:'Lunar energy & guidance' },
    ]
  },
  {
    title: 'Cosmic Tracking',
    emoji: '🌌',
    color: '#60a5fa',
    tools: [
      { href:'/dashboard/insights', emoji:'📊', name:'Insights', desc:'Patterns in your angel number journey' },
      { href:'/dashboard/stats', emoji:'📈', name:'Statistics', desc:'Visual charts of your activity' },
      { href:'/dashboard/streak', emoji:'🔥', name:'Streak Tracker', desc:'Daily logging streaks & milestones' },
      { href:'/dashboard/calendar', emoji:'🗓️', name:'Cosmic Calendar', desc:'Angel numbers by date' },
      { href:'/dashboard/timeline', emoji:'⏳', name:'Vision Timeline', desc:'Your spiritual journey map' },
      { href:'/dashboard/synthesis', emoji:'✺', name:'Weekly Synthesis', desc:'AI-powered weekly cosmic report' },
      { href:'/dashboard/badges', emoji:'🏅', name:'Badges', desc:'30 achievement milestones' },
      { href:'/dashboard/notifications', emoji:'🔔', name:'Notifications', desc:'Stay updated on your journey' },
      { href:'/dashboard/cosmic-weather', emoji:'🌌', name:'Cosmic Weather', desc:'Daily cosmic energy forecast' },
    ]
  },
  {
    title: 'Healing & Practice',
    emoji: '✨',
    color: '#4ade80',
    tools: [
      { href:'/dashboard/healing-hub', emoji:'🌿', name:'Healing Hub', desc:'Your holistic wellness center' },
      { href:'/dashboard/healers', emoji:'🙌', name:'Find a Healer', desc:'Connect with spiritual healers' },
      { href:'/dashboard/musical-healers', emoji:'🎵', name:'Musical Healers', desc:'Discover healing music for your journey' },
      { href:'/dashboard/healers/my-listing', emoji:'🌿', name:'My Listing', desc:'Manage your healer profile' },
      { href:'/dashboard/my-bookings', emoji:'📅', name:'My Bookings', desc:'View your booked sessions' },
      { href:'/dashboard/meditations', emoji:'🧘', name:'Meditations', desc:'Guided angel number meditations' },
      { href:'/dashboard/breathwork', emoji:'💨', name:'Breathwork', desc:'Sacred breathing techniques' },
      { href:'/dashboard/solfeggio', emoji:'🎵', name:'Solfeggio', desc:'Healing frequency guide' },
      { href:'/dashboard/chakras', emoji:'🌈', name:'Chakras', desc:'Energy center alignment' },
      { href:'/dashboard/crystals', emoji:'💎', name:'Crystal Guide', desc:'12 sacred stones & their meanings' },
      { href:'/dashboard/rituals', emoji:'🕯️', name:'Rituals', desc:'Angel number rituals & ceremonies' },
      { href:'/dashboard/affirmations', emoji:'💫', name:'Affirmations', desc:'Daily affirmation practice' },
    ]
  },
  {
    title: 'Journaling',
    emoji: '📝',
    color: '#f472b6',
    tools: [
      { href:'/dashboard/journal', emoji:'📖', name:'Thought Journal', desc:'Angel number thought anchors' },
      { href:'/dashboard/dreams', emoji:'🌙', name:'Dream Journal', desc:'Dream symbols & angel numbers' },
      { href:'/dashboard/dream-resonances', emoji:'🔮', name:'Dream Resonances', desc:'Shared dream pattern matching' },
      { href:'/dashboard/gratitude', emoji:'🙏', name:'Gratitude', desc:'Daily gratitude practice' },
      { href:'/dashboard/manifestations', emoji:'🌟', name:'Manifestations', desc:'Track your manifestation journey' },
      { href:'/dashboard/vision-board', emoji:'🖼️', name:'Vision Board', desc:'Visual manifestation board' },
    ]
  },
  {
    title: 'Community',
    emoji: '💫',
    color: '#f97316',
    tools: [
      { href:'/dashboard/sync', emoji:'⟳', name:'Live Sync', desc:'Match with souls seeing your numbers' },
      { href:'/dashboard/soul-twin', emoji:'👥', name:'Soul Twin', desc:'Deep soul compatibility matching' },
      { href:'/dashboard/circles', emoji:'⭕', name:'Angel Circles', desc:'Private spiritual groups' },
      { href:'/dashboard/profile-card', emoji:'🪪', name:'Profile Card', desc:'Share your cosmic identity' },
      { href:'/dashboard/relationships', emoji:'💞', name:'Soul Connections', desc:'Your cosmic relationship map' },
      { href:'/dashboard/feed', emoji:'✧', name:'Cosmic Feed', desc:'Posts from your soul matches' },
    ]
  },
  {
    title: 'Account',
    emoji: '⚙️',
    color: '#818cf8',
    tools: [
      { href:'/dashboard/onboarding', emoji:'✦', name:'Setup', desc:'Complete your onboarding' },
      { href:'/dashboard/settings', emoji:'⚙️', name:'Settings', desc:'Customize your experience' },
      { href:'/dashboard/upgrade', emoji:'⭐', name:'Upgrade', desc:'Unlock advanced features' },
      { href:'/dashboard/referrals', emoji:'🌟', name:'Referrals', desc:'Invite friends, earn rewards' },
      { href:'/dashboard/admin', emoji:'⚡', name:'Admin', desc:'Administration panel' },
    ]
  },
]

export default function ExplorePage() {
  const card: React.CSSProperties = {background:'rgba(8,6,28,0.88)',border:'1px solid rgba(200,180,255,0.1)',borderRadius:'1.25rem',backdropFilter:'blur(12px)'}
  const totalTools = TOOL_SECTIONS.reduce((a,s)=>a+s.tools.length,0)

  const handleLogout = async () => {
    try {
      const supabase = createClient()
      await supabase.auth.signOut()
    } catch {}
    window.location.href = '/'
  }

  return (
    <div style={{maxWidth:'600px',margin:'0 auto',padding:'1.5rem 1rem 2rem',width:'100%',boxSizing:'border-box',overflowX:'hidden'}}>
      <h1 style={{fontFamily:'Cormorant Garamond,serif',fontSize:'1.8rem',color:'rgba(220,200,255,0.95)',margin:'0 0 0.25rem',fontWeight:400}}>Explore</h1>
      <p style={{color:'rgba(180,160,255,0.5)',fontSize:'0.8rem',margin:'0 0 1.75rem'}}>{totalTools} features for your spiritual journey</p>

      {TOOL_SECTIONS.map(section=>(
        <div key={section.title} style={{marginBottom:'1.75rem'}}>
          {/* Section header */}
          <div style={{display:'flex',alignItems:'center',gap:'0.5rem',marginBottom:'0.75rem'}}>
            <span style={{fontSize:'1rem'}}>{section.emoji}</span>
            <span style={{color:section.color,fontSize:'0.72rem',textTransform:'uppercase',letterSpacing:'0.12em',fontWeight:600}}>{section.title}</span>
            <div style={{flex:1,height:'1px',background:'linear-gradient(90deg,'+section.color+'20,transparent)'}} />
          </div>

          {/* Tools grid */}
          <div className='tools-grid' style={{display:'grid',gridTemplateColumns:'repeat(2,minmax(0,1fr))',gap:'0.4rem',width:'100%',boxSizing:'border-box'}}>
            {section.tools.map(tool=>(
              <Link key={tool.href} href={tool.href} style={{textDecoration:'none'}}>
                <div style={{...card,padding:'0.875rem',display:'flex',alignItems:'flex-start',gap:'0.625rem',cursor:'pointer',transition:'all 0.2s',borderColor:'rgba(200,180,255,0.07)'}}>
                  <div style={{width:'34px',height:'34px',borderRadius:'0.625rem',background:section.color+'12',border:'1px solid '+section.color+'20',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'1rem',flexShrink:0}}>{tool.emoji}</div>
                  <div style={{minWidth:0}}>
                    <div style={{color:'rgba(220,200,255,0.82)',fontSize:'0.82rem',fontWeight:600,marginBottom:'0.15rem',overflow:'hidden',textOverflow:'ellipsis',wordBreak:'break-word'}}>{tool.name}</div>
                    <div style={{color:'rgba(180,160,255,0.38)',fontSize:'0.68rem',lineHeight:1.4,overflow:'hidden',display:'-webkit-box',WebkitLineClamp:2,WebkitBoxOrient:'vertical'}}>{tool.desc}</div>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Logout button in Account section */}
          {section.title === 'Account' && (
            <button
              onClick={handleLogout}
              style={{
                width:'100%', marginTop:'0.5rem', display:'flex', alignItems:'center', justifyContent:'center',
                gap:'0.5rem', padding:'0.75rem', borderRadius:'0.75rem',
                background:'rgba(255,80,80,0.06)', border:'1px solid rgba(255,80,80,0.15)',
                cursor:'pointer', color:'rgba(255,120,120,0.7)', fontSize:'0.8rem',
                textTransform:'uppercase', letterSpacing:'0.1em',
              }}
            >
              <span>⏻</span>
              <span>Sign Out</span>
            </button>
          )}
        </div>
      ))}
    </div>
  )
}
