'use client'
import { useState, useEffect } from 'react'

const KEY = 'synchrosoul_notifications'
const KEY_SETTINGS = 'synchrosoul_notif_settings'

type Notif = {
  id: string
  type: 'sync'|'angel'|'streak'|'badge'|'moon'|'guidance'|'match'
  title: string
  body: string
  emoji: string
  time: string
  read: boolean
}

const TYPE_COLORS: Record<string,string> = {
  sync:'#a78bfa', angel:'#c9a84c', streak:'#f97316',
  badge:'#4ade80', moon:'#818cf8', guidance:'#67e8f9', match:'#f472b6'
}

const DEMO_NOTIFS: Notif[] = [
  { id:'n1', type:'match', emoji:'💫', title:'New Soul Sync!', body:'Luna M. is seeing 1111 just like you — 94% sync score. Your cosmic paths are crossing.', time: new Date(Date.now()-1000*60*8).toISOString(), read:false },
  { id:'n2', type:'angel', emoji:'✦', title:'Angel Number Alert', body:'You logged 444 three times this week. Your angels are sending a strong protection message.', time: new Date(Date.now()-1000*60*45).toISOString(), read:false },
  { id:'n3', type:'streak', emoji:'🔥', title:'7-Day Streak!', body:'You have been logging angel numbers for 7 days straight. You earned the Lightning badge!', time: new Date(Date.now()-1000*60*60*2).toISOString(), read:false },
  { id:'n4', type:'moon', emoji:'🌕', title:'Full Moon Tonight', body:'The Full Moon in Virgo amplifies your 6 Life Path energy. Perfect time to log and journal.', time: new Date(Date.now()-1000*60*60*5).toISOString(), read:true },
  { id:'n5', type:'sync', emoji:'⟳', title:'Sync Surge', body:'3 people in your area logged 555 in the last hour. A wave of change energy is building.', time: new Date(Date.now()-1000*60*60*8).toISOString(), read:true },
  { id:'n6', type:'badge', emoji:'🏆', title:'Badge Unlocked: Seeker', body:'You have logged 50 angel numbers. Your dedication to the path is being recognized.', time: new Date(Date.now()-1000*60*60*24).toISOString(), read:true },
  { id:'n7', type:'guidance', emoji:'🌟', title:'Daily Guidance Ready', body:'Your cosmic message for today is waiting. The numbers you logged yesterday have a message.', time: new Date(Date.now()-1000*60*60*26).toISOString(), read:true },
  { id:'n8', type:'match', emoji:'💫', title:'Orion S. resonated with you', body:'Orion resonated with your 777 post. You share a 88% numerology compatibility.', time: new Date(Date.now()-1000*60*60*48).toISOString(), read:true },
  { id:'n9', type:'angel', emoji:'✦', title:'Pattern Detected', body:'You have seen 1111 every Monday for 3 weeks. Your angels have a Monday message for you.', time: new Date(Date.now()-1000*60*60*72).toISOString(), read:true },
]

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime()
  const m = Math.floor(diff/60000)
  if(m<1) return 'just now'
  if(m<60) return m+'m ago'
  const h = Math.floor(m/60)
  if(h<24) return h+'h ago'
  return Math.floor(h/24)+'d ago'
}

export default function NotificationsPage() {
  const [notifs, setNotifs] = useState<Notif[]>([])
  const [filter, setFilter] = useState<'all'|'unread'>('all')
  const [settings, setSettings] = useState({ streaks:true, matches:true, moon:true, guidance:true, badges:true, angels:true })
  const [showSettings, setShowSettings] = useState(false)

  useEffect(() => {
    try {
      const saved = localStorage.getItem(KEY)
      setNotifs(saved ? JSON.parse(saved) : DEMO_NOTIFS)
      const s = localStorage.getItem(KEY_SETTINGS)
      if(s) setSettings(JSON.parse(s))
    } catch { setNotifs(DEMO_NOTIFS) }
  }, [])

  function markAllRead() {
    const updated = notifs.map(n=>({...n,read:true}))
    setNotifs(updated)
    localStorage.setItem(KEY, JSON.stringify(updated))
  }

  function markRead(id: string) {
    const updated = notifs.map(n=>n.id===id?{...n,read:true}:n)
    setNotifs(updated)
    localStorage.setItem(KEY, JSON.stringify(updated))
  }

  function deleteNotif(id: string) {
    const updated = notifs.filter(n=>n.id!==id)
    setNotifs(updated)
    localStorage.setItem(KEY, JSON.stringify(updated))
  }

  function saveSettings(s: typeof settings) {
    setSettings(s)
    localStorage.setItem(KEY_SETTINGS, JSON.stringify(s))
  }

  const displayed = filter==='unread' ? notifs.filter(n=>!n.read) : notifs
  const unreadCount = notifs.filter(n=>!n.read).length
  const card: React.CSSProperties = {background:'rgba(8,6,28,0.88)',border:'1px solid rgba(200,180,255,0.1)',borderRadius:'1.25rem',backdropFilter:'blur(12px)'}

  return (
    <div style={{maxWidth:'560px',margin:'0 auto',padding:'1.5rem 1rem 2rem'}}>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'0.25rem'}}>
        <h1 style={{fontFamily:'Cormorant Garamond,serif',fontSize:'1.8rem',color:'rgba(220,200,255,0.95)',margin:0,fontWeight:400}}>Notifications</h1>
        <button onClick={()=>setShowSettings(s=>!s)} style={{background:'none',border:'1px solid rgba(200,180,255,0.12)',borderRadius:'0.5rem',padding:'0.35rem 0.625rem',color:'rgba(180,160,255,0.5)',cursor:'pointer',fontSize:'0.75rem'}}>⚙ Settings</button>
      </div>
      <p style={{color:'rgba(180,160,255,0.5)',fontSize:'0.8rem',margin:'0 0 1.25rem'}}>{unreadCount > 0 ? unreadCount+' unread messages from the cosmos' : 'All caught up ✓'}</p>

      {/* Settings panel */}
      {showSettings && (
        <div style={{...card,padding:'1.25rem',marginBottom:'1.25rem',borderColor:'rgba(167,139,250,0.2)'}}>
          <div style={{color:'rgba(180,160,255,0.4)',fontSize:'0.68rem',textTransform:'uppercase',letterSpacing:'0.12em',marginBottom:'0.875rem'}}>Notification Preferences</div>
          {([
            ['streaks','🔥','Streak milestones'],
            ['matches','💫','New soul matches'],
            ['moon','🌙','Moon phase alerts'],
            ['guidance','🌟','Daily guidance'],
            ['badges','🏆','Badge unlocks'],
            ['angels','✦','Angel number patterns'],
          ] as const).map(([key,emoji,label])=>(
            <div key={key} style={{display:'flex',alignItems:'center',justifyContent:'space-between',padding:'0.5rem 0',borderBottom:'1px solid rgba(200,180,255,0.04)'}}>
              <div style={{display:'flex',alignItems:'center',gap:'0.5rem'}}>
                <span>{emoji}</span>
                <span style={{color:'rgba(200,180,255,0.65)',fontSize:'0.85rem'}}>{label}</span>
              </div>
              <button
                onClick={()=>saveSettings({...settings,[key]:!settings[key]})}
                style={{width:'40px',height:'22px',borderRadius:'11px',background:settings[key]?'rgba(167,139,250,0.4)':'rgba(200,180,255,0.08)',border:settings[key]?'1px solid rgba(167,139,250,0.5)':'1px solid rgba(200,180,255,0.1)',cursor:'pointer',position:'relative',transition:'all 0.2s'}}>
                <div style={{width:'16px',height:'16px',borderRadius:'50%',background:settings[key]?'#a78bfa':'rgba(180,160,255,0.3)',position:'absolute',top:'2px',left:settings[key]?'21px':'2px',transition:'all 0.2s'}} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Filter + mark all */}
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'1rem'}}>
        <div style={{display:'flex',gap:'0.35rem'}}>
          {(['all','unread'] as const).map(f=>(
            <button key={f} onClick={()=>setFilter(f)} style={{padding:'0.3rem 0.75rem',borderRadius:'9999px',border:filter===f?'1px solid rgba(167,139,250,0.4)':'1px solid rgba(200,180,255,0.1)',background:filter===f?'rgba(167,139,250,0.12)':'transparent',color:filter===f?'#a78bfa':'rgba(180,160,255,0.4)',fontSize:'0.75rem',cursor:'pointer',textTransform:'capitalize'}}>
              {f}{f==='unread'&&unreadCount>0?<span style={{marginLeft:'0.3rem',background:'#a78bfa',color:'white',borderRadius:'9999px',padding:'0 0.3rem',fontSize:'0.6rem'}}>{unreadCount}</span>:null}
            </button>
          ))}
        </div>
        {unreadCount>0 && <button onClick={markAllRead} style={{background:'none',border:'none',color:'rgba(167,139,250,0.5)',cursor:'pointer',fontSize:'0.75rem'}}>Mark all read</button>}
      </div>

      {/* Notification list */}
      <div style={{display:'flex',flexDirection:'column',gap:'0.5rem'}}>
        {displayed.length===0 && (
          <div style={{...card,padding:'3rem',textAlign:'center'}}>
            <div style={{fontSize:'2rem',marginBottom:'0.5rem'}}>🌙</div>
            <p style={{color:'rgba(180,160,255,0.4)',fontSize:'0.9rem',fontFamily:'Cormorant Garamond,serif',fontStyle:'italic',margin:0}}>The cosmos is quiet right now</p>
          </div>
        )}
        {displayed.map(n=>(
          <div key={n.id} onClick={()=>markRead(n.id)}
            style={{...card,padding:'1rem',cursor:'pointer',borderColor:!n.read?TYPE_COLORS[n.type]+'25':'rgba(200,180,255,0.06)',background:!n.read?TYPE_COLORS[n.type]+'05':'rgba(8,6,28,0.7)',transition:'all 0.2s',position:'relative'}}>
            {!n.read && <div style={{position:'absolute',top:'1rem',right:'1rem',width:'7px',height:'7px',borderRadius:'50%',background:TYPE_COLORS[n.type]}} />}
            <div style={{display:'flex',alignItems:'flex-start',gap:'0.75rem'}}>
              <div style={{width:'36px',height:'36px',borderRadius:'50%',background:TYPE_COLORS[n.type]+'15',border:'1px solid '+TYPE_COLORS[n.type]+'25',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'1rem',flexShrink:0}}>{n.emoji}</div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'0.2rem'}}>
                  <div style={{color:!n.read?'rgba(220,200,255,0.9)':'rgba(200,180,255,0.6)',fontSize:'0.85rem',fontWeight:!n.read?600:400}}>{n.title}</div>
                  <div style={{color:'rgba(180,160,255,0.3)',fontSize:'0.68rem',flexShrink:0,marginLeft:'0.5rem'}}>{timeAgo(n.time)}</div>
                </div>
                <p style={{color:'rgba(180,160,255,0.5)',fontSize:'0.78rem',lineHeight:1.55,margin:'0 0 0.5rem'}}>{n.body}</p>
                <button onClick={e=>{e.stopPropagation();deleteNotif(n.id)}} style={{background:'none',border:'none',color:'rgba(180,160,255,0.2)',cursor:'pointer',fontSize:'0.68rem',padding:0}}>dismiss</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
