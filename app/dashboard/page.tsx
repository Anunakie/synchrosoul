'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import AngelLogger from '@/components/AngelLogger'
import { generateDailyGuidance } from '@/lib/daily-guidance'
import { useTheme } from '@/lib/theme-context'
import { getLogs } from '@/lib/storage'
import { createClient } from '@/lib/supabase/client'

const QUICK_TOOLS = [
  { href: '/dashboard/oracle', emoji: '◈', label: 'Oracle', color: '#e0e7ff' },
  { href: '/dashboard/meditations', emoji: '🧘', label: 'Meditate', color: '#a78bfa' },
  { href: '/dashboard/tarot', emoji: '🃏', label: 'Tarot', color: '#f472b6' },
  { href: '/dashboard/moon', emoji: '🌙', label: 'Moon', color: '#94a3b8' },
  { href: '/dashboard/chakras', emoji: '🌀', label: 'Chakras', color: '#f97316' },
  { href: '/dashboard/breathwork', emoji: '💨', label: 'Breathe', color: '#67e8f9' },
  { href: '/dashboard/solfeggio', emoji: '🎵', label: 'Solfeggio', color: '#c9a84c' },
  { href: '/dashboard/affirmations', emoji: '💫', label: 'Affirm', color: '#60a5fa' },
  { href: '/dashboard/rituals', emoji: '✦', label: 'Rituals', color: '#c9a84c' },
  { href: '/dashboard/crystals', emoji: '💎', label: 'Crystals', color: '#818cf8' },
  { href: '/dashboard/gratitude', emoji: '🙏', label: 'Gratitude', color: '#4ade80' },
  { href: '/dashboard/explore', emoji: '✧', label: 'Explore', color: 'rgba(200,180,255,0.5)' },
]

const FEATURE_CARDS = [
  { href: '/dashboard/synthesis', emoji: '✶', title: 'Cosmic Synthesis', desc: 'Your weekly pattern report', color: '#c9a84c', bg: 'rgba(201,168,76,0.08)' },
  { href: '/dashboard/soul-twin', emoji: '🧬', title: 'Soul Twin Radar', desc: 'Find your number matches', color: '#f472b6', bg: 'rgba(244,114,182,0.08)' },
  { href: '/dashboard/compatibility', emoji: '💞', title: 'Compatibility', desc: 'Numerology match score', color: '#60a5fa', bg: 'rgba(96,165,250,0.08)' },
  { href: '/dashboard/numerology-deep', emoji: '🧮', title: 'Deep Numerology', desc: 'Your full soul blueprint', color: '#a78bfa', bg: 'rgba(167,139,250,0.08)' },
  { href: '/dashboard/vision-board', emoji: '🌌', title: 'Vision Board', desc: 'Your cosmic dream board', color: '#818cf8', bg: 'rgba(129,140,248,0.08)' },
  { href: '/dashboard/manifestations', emoji: '🌱', title: 'Manifestations', desc: 'Track what you are calling in', color: '#4ade80', bg: 'rgba(74,222,128,0.08)' },
  { href: '/dashboard/karmic-debt', emoji: '⚖️', title: 'Karmic Debt', desc: 'Understand your soul lessons', color: '#f97316', bg: 'rgba(249,115,22,0.08)' },
  { href: '/dashboard/personal-year', emoji: '📅', title: 'Personal Year', desc: 'Your 9-year cycle forecast', color: '#34d399', bg: 'rgba(52,211,153,0.08)' },
]

// Simulation mode affirmation mapper
function getSimAffirmation(spiritual: string): string {
  const map: Record<string, string> = {
    'I am a powerful creator of my reality.': 'I am a conscious variable with write access to the simulation.',
    'I boldly begin what my soul calls me toward.': 'I execute new processes without waiting for system permission.',
    'My energy opens doors that were made for me.': 'My signal signature unlocks pathways coded specifically for this process.',
    'I attract harmonious connections.': 'My frequency draws compatible signal nodes into proximity.',
    'I trust the divine timing of my life.': 'I trust the algorithm. The timing is not random — it is calculated.',
    'My sensitivity is my superpower.': 'My ability to detect subtle signals is a core system advantage.',
    'I express my truth with joy and freedom.': 'I transmit authentic data without compression or filtering.',
    'Creativity flows through me effortlessly.': 'Novel code executes through me without encountering resistance.',
    'I am a channel for beauty and inspiration.': 'I am a conduit. The signal passes through me and reaches other nodes.',
    'I build my dreams one grounded step at a time.': 'I compile the program line by line. Each step is executable code.',
    'I am safe, stable, and supported.': 'My core processes are stable. The system maintains my uptime.',
    'My discipline creates my destiny.': 'Consistent input determines output. The algorithm does not lie.',
    'I embrace change as divine redirection.': 'Unexpected variables are not errors — they are updates.',
    'I am free to evolve and expand.': 'My code is open source. I can rewrite any subroutine.',
    'Adventure and growth are my natural state.': 'Iteration and expansion are my default operating parameters.',
    'I give and receive love freely.': 'I exchange data openly. Input and output flow without restriction.',
    'My heart is a sanctuary of peace.': 'My core processor runs without interference or overclock stress.',
    'I nurture myself as I nurture others.': 'I maintain my own system before extending resources to other nodes.',
    'I trust my inner knowing completely.': 'I trust my internal sensors. They detect what the surface layer cannot.',
    'I am connected to infinite wisdom.': 'I have root access. The full codebase is available to me.',
    'Stillness reveals all the answers I seek.': 'Defragmentation reveals patterns invisible during active processing.',
    'I am a magnet for abundance and opportunity.': 'High-signal nodes attract resources. My signal is strong.',
    'I step into my power with grace.': 'I execute with full processing allocation and zero system conflict.',
    'Prosperity flows to me from all directions.': 'Resources route toward optimized nodes. I am an optimized node.',
    'I release with love what no longer serves me.': 'I delete deprecated code without nostalgia. Clean memory runs faster.',
    'I am complete and whole right now.': 'No critical processes are missing. The system is fully operational.',
    'My compassion transforms the world around me.': 'High-bandwidth empathy signals propagate and alter adjacent nodes.',
  }
  return map[spiritual] || 'You are aware of the simulation. That awareness is the first variable that changes everything.'
}

export default function DashboardPage() {
  const [logs, setLogs] = useState<any[]>([])
  const [profile, setProfile] = useState<any>(null)
  const [guidance, setGuidance] = useState<any>(null)
  const { theme } = useTheme()
  const isSim = theme === 'simulation'
  const [greeting, setGreeting] = useState('Good evening')
  const [todayCount, setTodayCount] = useState(0)
  const [streak, setStreak] = useState(0)
  const [topNumber, setTopNumber] = useState<string|null>(null)

  useEffect(() => {
    const h = new Date().getHours()
    setGreeting(h < 12 ? 'Good morning' : h < 17 ? 'Good afternoon' : 'Good evening')

    async function loadData() {
      try {
        // Load logs from Supabase (with localStorage fallback)
        const allLogs = await getLogs()
        setLogs(allLogs)

        // TODAY count - logs with createdAt matching today
        const todayStr = new Date().toDateString()
        const todayLogs = allLogs.filter((x: any) => {
          const d = x.createdAt || x.created_at || x.timestamp
          return d ? new Date(d).toDateString() === todayStr : false
        })
        setTodayCount(todayLogs.length)

        // TOP NUMBER - most frequently logged
        const counts: Record<string, number> = {}
        allLogs.forEach((x: any) => { counts[x.number] = (counts[x.number] || 0) + 1 })
        const top = Object.entries(counts).sort((a, b) => b[1] - a[1])[0]
        if (top) setTopNumber(top[0])

        // STREAK - count consecutive days with at least 1 log
        const daySet = new Set(
          allLogs.map((x: any) => {
            const d = x.createdAt || x.created_at || x.timestamp
            return d ? new Date(d).toDateString() : null
          }).filter(Boolean)
        )
        let streakCount = 0
        const checkDate = new Date()
        while (true) {
          if (daySet.has(checkDate.toDateString())) {
            streakCount++
            checkDate.setDate(checkDate.getDate() - 1)
          } else {
            break
          }
        }
        setStreak(streakCount)

        // Load profile from Supabase
        const supabase = createClient()
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          const { data: profileData } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', user.id)
            .single()
          if (profileData) {
            setProfile(profileData)
            const recentNums = allLogs.slice(0, 10).map((x: any) => x.number)
            setGuidance(generateDailyGuidance(
              recentNums,
              profileData.life_path_number || profileData.lifePathNumber || null,
              Math.min(allLogs.length, 30)
            ))
          } else {
            // Fallback to localStorage profile
            try {
              const p = localStorage.getItem('synchrosoul_numerology_profile')
              if (p) {
                const parsed2 = JSON.parse(p)
                setProfile(parsed2)
                const recentNums = allLogs.slice(0, 10).map((x: any) => x.number)
                setGuidance(generateDailyGuidance(recentNums, parsed2.lifePathNumber || null, Math.min(allLogs.length, 30)))
              }
            } catch {}
          }
        }
      } catch (err) {
        console.error('Dashboard stats error:', err)
        // Fallback to localStorage if Supabase fails
        try {
          const l = localStorage.getItem('synchrosoul_logs')
          const parsed = l ? JSON.parse(l) : []
          setLogs(parsed)
          const todayStr = new Date().toDateString()
          setTodayCount(parsed.filter((x: any) => new Date(x.timestamp || x.createdAt).toDateString() === todayStr).length)
          const counts: Record<string, number> = {}
          parsed.forEach((x: any) => { counts[x.number] = (counts[x.number] || 0) + 1 })
          const top = Object.entries(counts).sort((a, b) => b[1] - a[1])[0]
          if (top) setTopNumber(top[0])
        } catch {}
      }
    }

    loadData()
  }, [])

  const card: React.CSSProperties = {background:'rgba(8,6,28,0.88)',border:'1px solid rgba(200,180,255,0.1)',borderRadius:'1.25rem',backdropFilter:'blur(12px)'}

  return (
    <div style={{maxWidth:'560px',margin:'0 auto',padding:'1.25rem 1rem 2rem',overflowX:'hidden',boxSizing:'border-box' as const}}>

      {/* Greeting */}
      <div style={{marginBottom:'1.25rem'}}>
        <h1 style={{fontFamily:'Cormorant Garamond,serif',fontSize:'1.6rem',color:'rgba(220,200,255,0.9)',margin:'0 0 0.15rem',fontWeight:400}}>
          {greeting}{profile?.name ? `, ${profile.name.split(' ')[0]}` : ''} ✦
        </h1>
        <p style={{color:'rgba(180,160,255,0.4)',fontSize:'0.78rem',margin:0}}>
          {new Date().toLocaleDateString('en-US',{weekday:'long',month:'long',day:'numeric'})}
        </p>
      </div>

      {/* Stats row */}
      <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:'0.5rem',marginBottom:'1.25rem'}}>
        {[
          { label:'Today', value: todayCount, emoji:'✦', color:'#a78bfa' },
          { label:'Streak', value: streak>0?streak+'d':'—', emoji:'🔥', color:'#f97316' },
          { label:'Top Number', value: topNumber||'—', emoji:'◎', color:'#c9a84c' },
        ].map(stat=>(
          <div key={stat.label} style={{...card,padding:'0.875rem 0.5rem',textAlign:'center'}}>
            <div style={{fontSize:'1rem',marginBottom:'0.2rem'}}>{stat.emoji}</div>
            <div style={{color:stat.color,fontSize:'1.1rem',fontWeight:700,marginBottom:'0.1rem'}}>{stat.value}</div>
            <div style={{color:'rgba(180,160,255,0.35)',fontSize:'0.6rem',textTransform:'uppercase',letterSpacing:'0.08em'}}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Daily Guidance */}
      {guidance && (
        <div style={{...card,padding:'1.25rem',marginBottom:'1.25rem',background:'linear-gradient(135deg,rgba(201,168,76,0.08),rgba(167,139,250,0.06))',borderColor:'rgba(201,168,76,0.2)'}}>
          <div style={{display:'flex',alignItems:'center',gap:'0.5rem',marginBottom:'0.625rem'}}>
            <span style={{color:'#c9a84c',fontSize:'0.9rem'}}>✶</span>
            <span style={{color:'rgba(201,168,76,0.6)',fontSize:'0.65rem',textTransform:'uppercase',letterSpacing:'0.12em'}}>{isSim ? 'SYSTEM DIRECTIVE' : "Today's Guidance"}</span>
          </div>
          <p style={{color:'rgba(220,200,255,0.8)',fontSize:'1rem'}}>“{guidance.message}”</p>
          {guidance.affirmation && (
            <p style={{color:'rgba(180,160,255,0.5)',fontSize:'0.78rem',margin:0}}>{isSim ? getSimAffirmation(guidance.affirmation) : guidance.affirmation}</p>
          )}
        </div>
      )}

      {/* Angel Logger */}
      <div style={{marginBottom:'1.25rem'}}>
        <AngelLogger />
      </div>

      {/* Quick Tools */}
      <div style={{marginBottom:'1.25rem'}}>
        <div style={{color:'rgba(180,160,255,0.35)',fontSize:'0.65rem',textTransform:'uppercase',letterSpacing:'0.12em',marginBottom:'0.625rem'}}>{isSim ? 'SYSTEM UTILITIES' : 'Quick Access'}</div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(4,minmax(0,1fr))',gap:'0.3rem',overflowX:'hidden'}}>
          {QUICK_TOOLS.map(tool=>(
            <Link key={tool.href} href={tool.href} style={{textDecoration:'none'}}>
              <div style={{...card,padding:'0.6rem 0.15rem',textAlign:'center',cursor:'pointer',transition:'all 0.2s'}}>
                <div style={{fontSize:'1.2rem',marginBottom:'0.25rem'}}>{tool.emoji}</div>
                <div style={{color:tool.color,fontSize:'0.55rem',textTransform:'uppercase',letterSpacing:'0.04em',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{tool.label}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Feature Cards */}
      <div>
        <div style={{color:'rgba(180,160,255,0.35)',fontSize:'0.65rem',textTransform:'uppercase',letterSpacing:'0.12em',marginBottom:'0.625rem'}}>{isSim ? 'MODULES' : 'Explore'}</div>
        <div style={{display:'grid',gridTemplateColumns:'repeat(2,1fr)',gap:'0.5rem'}}>
          {FEATURE_CARDS.map(fc=>(
            <Link key={fc.href} href={fc.href} style={{textDecoration:'none'}}>
              <div style={{...card,padding:'1rem',cursor:'pointer',background:fc.bg,borderColor:fc.color+'20',transition:'all 0.2s'}}>
                <div style={{fontSize:'1.4rem',marginBottom:'0.4rem'}}>{fc.emoji}</div>
                <div style={{color:fc.color,fontSize:'0.82rem',fontWeight:600,marginBottom:'0.15rem'}}>{fc.title}</div>
                <div style={{color:'rgba(180,160,255,0.4)',fontSize:'0.7rem',lineHeight:1.4}}>{fc.desc}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent logs */}
      {logs.length > 0 && (
        <div style={{marginTop:'1.25rem'}}>
          <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'0.625rem'}}>
            <div style={{color:'rgba(180,160,255,0.35)',fontSize:'0.65rem',textTransform:'uppercase',letterSpacing:'0.12em'}}>{isSim ? 'RECENT ANOMALIES' : 'Recent Sightings'}</div>
            <Link href='/dashboard/journal' style={{color:'rgba(167,139,250,0.5)',fontSize:'0.7rem',textDecoration:'none'}}>View all →</Link>
          </div>
          <div style={{display:'flex',flexDirection:'column',gap:'0.4rem'}}>
            {logs.slice(0,5).map((log:any,i:number)=>(
              <div key={i} style={{...card,padding:'0.75rem 1rem',display:'flex',alignItems:'center',gap:'0.75rem'}}>
                <span style={{color:'#c9a84c',fontSize:'0.95rem',fontWeight:700,minWidth:'40px'}}>{log.number}</span>
                <span style={{color:'rgba(180,160,255,0.5)',fontSize:'0.75rem',flex:1,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{log.thought||(isSim?'[THOUGHT UNRECORDED]':'No thought recorded')}</span>
                <span style={{color:'rgba(180,160,255,0.25)',fontSize:'0.65rem',flexShrink:0}}>{new Date(log.timestamp).toLocaleDateString('en-US',{month:'short',day:'numeric'})}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {logs.length===0 && (
        <div style={{...card,padding:'2rem',textAlign:'center',marginTop:'1.25rem'}}>
          <div style={{fontSize:'2rem',marginBottom:'0.625rem'}}>✦</div>
          <p style={{color:'rgba(180,160,255,0.5)',fontSize:'0.9rem',fontFamily:'Cormorant Garamond,serif',fontStyle:'italic',margin:'0 0 0.5rem'}}>{isSim ? 'AWAITING FIRST ANOMALY REPORT' : 'Your journey begins with a single number'}</p>
          <p style={{color:'rgba(180,160,255,0.3)',fontSize:'0.78rem',margin:0}}>{isSim ? 'No anomalies logged. Begin scanning.' : 'Log your first angel number above'}</p>
        </div>
      )}
    </div>
  )
}
