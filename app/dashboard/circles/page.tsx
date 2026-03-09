'use client'
import { useState, useEffect } from 'react'

const KEY = 'synchrosoul_circles'

type Circle = {
  id: string
  name: string
  description: string
  emoji: string
  color: string
  members: number
  angelNumber: string
  category: string
  isJoined: boolean
  isPrivate: boolean
  recentActivity: string
  posts: { author: string; text: string; time: string }[]
}

const SAMPLE_CIRCLES: Circle[] = [
  { id:'c1', name:'1111 Portal Keepers', description:'For those who see 1111 daily and feel the portal energy. Share your experiences, synchronicities, and breakthroughs.', emoji:'🌀', color:'#a78bfa', members:847, angelNumber:'1111', category:'Number', isJoined:true, isPrivate:false, recentActivity:'2 min ago', posts:[
    { author:'Luna M.', text:'Saw 1111 three times today — once on a receipt, once on a license plate, and once when I woke up at 11:11 PM. Something big is shifting.', time:'5 min ago' },
    { author:'Orion S.', text:'The 1111 portal feels especially strong this week. Anyone else feeling the acceleration?', time:'1 hr ago' },
  ]},
  { id:'c2', name:'Twin Flame Seekers', description:'A sacred space for those on the twin flame journey. Share signs, synchronicities, and support each other through the process.', emoji:'🔥', color:'#f472b6', members:1203, angelNumber:'1212', category:'Relationship', isJoined:true, isPrivate:false, recentActivity:'8 min ago', posts:[
    { author:'Sage R.', text:'My twin and I both logged 1212 within 10 minutes of each other yesterday without knowing. The synchronicities are undeniable.', time:'20 min ago' },
  ]},
  { id:'c3', name:'555 Change Agents', description:'Embracing transformation together. 555 is the number of change — share your transitions, breakthroughs, and new beginnings.', emoji:'⚡', color:'#60a5fa', members:562, angelNumber:'555', category:'Number', isJoined:false, isPrivate:false, recentActivity:'45 min ago', posts:[
    { author:'River T.', text:'Left my corporate job today after seeing 555 every day for 3 weeks. Terrified and exhilarated. The universe is pushing me.', time:'2 hr ago' },
  ]},
  { id:'c4', name:'Sacred Geometry Circle', description:'Exploring the divine mathematics behind angel numbers, sacred geometry, and cosmic patterns. For the deep divers.', emoji:'✦', color:'#c9a84c', members:389, angelNumber:'777', category:'Study', isJoined:false, isPrivate:false, recentActivity:'3 hr ago', posts:[] },
  { id:'c5', name:'Lightworkers United', description:'A private circle for dedicated lightworkers. Share your mission, tools, and support each other in the work.', emoji:'✨', color:'#4ade80', members:234, angelNumber:'999', category:'Mission', isJoined:false, isPrivate:true, recentActivity:'1 hr ago', posts:[] },
  { id:'c6', name:'333 Ascension Path', description:'For those experiencing rapid spiritual awakening and seeing 333 as confirmation. Share your ascension symptoms and breakthroughs.', emoji:'🌟', color:'#f97316', members:678, angelNumber:'333', category:'Number', isJoined:false, isPrivate:false, recentActivity:'30 min ago', posts:[] },
]

export default function CirclesPage() {
  const [circles, setCircles] = useState<Circle[]>(SAMPLE_CIRCLES)
  const [selected, setSelected] = useState<Circle|null>(null)
  const [filter, setFilter] = useState<'all'|'joined'|'Number'|'Relationship'|'Study'|'Mission'>('all')
  const [newPost, setNewPost] = useState('')
  const [showCreate, setShowCreate] = useState(false)
  const [newName, setNewName] = useState('')
  const [newDesc, setNewDesc] = useState('')
  const [newNumber, setNewNumber] = useState('')

  function toggleJoin(id: string) {
    setCircles(prev => prev.map(c => c.id===id ? {...c, isJoined:!c.isJoined, members:c.isJoined?c.members-1:c.members+1} : c))
    if (selected?.id === id) setSelected(prev => prev ? {...prev, isJoined:!prev.isJoined} : null)
  }

  function postMessage() {
    if (!newPost.trim() || !selected) return
    const post = { author:'You', text:newPost.trim(), time:'Just now' }
    setCircles(prev => prev.map(c => c.id===selected.id ? {...c, posts:[post,...c.posts]} : c))
    setSelected(prev => prev ? {...prev, posts:[post,...prev.posts]} : null)
    setNewPost('')
  }

  const filtered = filter==='all' ? circles : filter==='joined' ? circles.filter(c=>c.isJoined) : circles.filter(c=>c.category===filter)
  const card: React.CSSProperties = {background:'rgba(8,6,28,0.88)',border:'1px solid rgba(200,180,255,0.1)',borderRadius:'1.25rem',backdropFilter:'blur(12px)'}
  const joinedCount = circles.filter(c=>c.isJoined).length

  return (
    <div style={{maxWidth:'560px',margin:'0 auto',padding:'1.5rem 1rem 2rem'}}>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'0.25rem'}}>
        <h1 style={{fontFamily:'Cormorant Garamond,serif',fontSize:'1.8rem',color:'rgba(220,200,255,0.95)',margin:0,fontWeight:400}}>Angel Circles</h1>
        <button onClick={()=>setShowCreate(!showCreate)} style={{padding:'0.4rem 0.875rem',borderRadius:'9999px',border:'1px solid rgba(201,168,76,0.3)',background:'rgba(201,168,76,0.08)',color:'#c9a84c',fontSize:'0.78rem',cursor:'pointer'}}>+ Create</button>
      </div>
      <p style={{color:'rgba(180,160,255,0.5)',fontSize:'0.8rem',margin:'0 0 1.25rem'}}>Member of {joinedCount} circles</p>

      {/* Create form */}
      {showCreate && (
        <div style={{...card,padding:'1.25rem',marginBottom:'1.25rem',borderColor:'rgba(201,168,76,0.15)'}}>
          <div style={{color:'rgba(180,160,255,0.4)',fontSize:'0.65rem',textTransform:'uppercase',letterSpacing:'0.12em',marginBottom:'0.875rem'}}>Create a Circle</div>
          <input value={newName} onChange={e=>setNewName(e.target.value)} placeholder='Circle name' style={{width:'100%',background:'rgba(200,180,255,0.04)',border:'1px solid rgba(200,180,255,0.1)',borderRadius:'0.625rem',padding:'0.5rem 0.75rem',color:'rgba(220,200,255,0.8)',fontSize:'0.85rem',fontFamily:'inherit',outline:'none',boxSizing:'border-box',marginBottom:'0.5rem'}} />
          <textarea value={newDesc} onChange={e=>setNewDesc(e.target.value)} placeholder='Describe your circle...' style={{width:'100%',background:'rgba(200,180,255,0.04)',border:'1px solid rgba(200,180,255,0.1)',borderRadius:'0.625rem',padding:'0.5rem 0.75rem',color:'rgba(220,200,255,0.8)',fontSize:'0.82rem',fontFamily:'inherit',outline:'none',resize:'none',height:'60px',boxSizing:'border-box',marginBottom:'0.5rem'}} />
          <input value={newNumber} onChange={e=>setNewNumber(e.target.value)} placeholder='Guardian angel number (e.g. 1111)' style={{width:'100%',background:'rgba(200,180,255,0.04)',border:'1px solid rgba(200,180,255,0.1)',borderRadius:'0.625rem',padding:'0.5rem 0.75rem',color:'rgba(220,200,255,0.8)',fontSize:'0.82rem',fontFamily:'inherit',outline:'none',boxSizing:'border-box',marginBottom:'0.875rem'}} />
          <div style={{display:'flex',gap:'0.5rem'}}>
            <button onClick={()=>{
              if(!newName.trim()) return
              const c: Circle = {id:Date.now().toString(),name:newName.trim(),description:newDesc.trim(),emoji:'⭕',color:'#a78bfa',members:1,angelNumber:newNumber.trim()||'111',category:'Number',isJoined:true,isPrivate:false,recentActivity:'Just now',posts:[]}
              setCircles(prev=>[c,...prev]); setNewName(''); setNewDesc(''); setNewNumber(''); setShowCreate(false)
            }} style={{flex:1,padding:'0.5rem',borderRadius:'0.75rem',border:'none',background:'linear-gradient(135deg,#a78bfa,#c9a84c)',color:'white',fontSize:'0.82rem',fontWeight:600,cursor:'pointer'}}>Create Circle</button>
            <button onClick={()=>setShowCreate(false)} style={{padding:'0.5rem 0.875rem',borderRadius:'0.75rem',border:'1px solid rgba(200,180,255,0.12)',background:'transparent',color:'rgba(180,160,255,0.5)',fontSize:'0.82rem',cursor:'pointer'}}>Cancel</button>
          </div>
        </div>
      )}

      {/* Filter */}
      <div style={{display:'flex',gap:'0.3rem',flexWrap:'wrap',marginBottom:'1.25rem'}}>
        {(['all','joined','Number','Relationship','Study','Mission'] as const).map(f=>(
          <button key={f} onClick={()=>setFilter(f)} style={{padding:'0.25rem 0.5rem',borderRadius:'9999px',border:filter===f?'1px solid rgba(167,139,250,0.5)':'1px solid rgba(200,180,255,0.08)',background:filter===f?'rgba(167,139,250,0.12)':'transparent',color:filter===f?'#a78bfa':'rgba(180,160,255,0.35)',fontSize:'0.68rem',cursor:'pointer',textTransform:'capitalize'}}>{f}</button>
        ))}
      </div>

      {/* Selected circle detail */}
      {selected && (
        <div style={{...card,padding:'1.25rem',marginBottom:'1.25rem',borderColor:selected.color+'20'}}>
          <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',marginBottom:'1rem'}}>
            <div style={{display:'flex',alignItems:'center',gap:'0.75rem'}}>
              <div style={{width:'44px',height:'44px',borderRadius:'0.875rem',background:selected.color+'15',border:'1px solid '+selected.color+'25',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'1.4rem'}}>{selected.emoji}</div>
              <div>
                <div style={{color:'rgba(220,200,255,0.9)',fontSize:'0.95rem',fontWeight:600}}>{selected.name}</div>
                <div style={{color:'rgba(180,160,255,0.4)',fontSize:'0.72rem'}}>{selected.members.toLocaleString()} members · {selected.recentActivity}</div>
              </div>
            </div>
            <button onClick={()=>setSelected(null)} style={{background:'none',border:'none',color:'rgba(180,160,255,0.4)',cursor:'pointer',fontSize:'1.2rem'}}>×</button>
          </div>
          <p style={{color:'rgba(200,180,255,0.55)',fontSize:'0.82rem',lineHeight:1.6,margin:'0 0 1rem'}}>{selected.description}</p>

          {/* Posts */}
          <div style={{marginBottom:'0.875rem'}}>
            {selected.posts.slice(0,3).map((post,i)=>(
              <div key={i} style={{padding:'0.625rem',background:'rgba(200,180,255,0.03)',borderRadius:'0.75rem',marginBottom:'0.4rem',border:'1px solid rgba(200,180,255,0.05)'}}>
                <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'0.25rem'}}>
                  <span style={{color:selected.color,fontSize:'0.72rem',fontWeight:600}}>{post.author}</span>
                  <span style={{color:'rgba(180,160,255,0.3)',fontSize:'0.65rem'}}>{post.time}</span>
                </div>
                <div style={{color:'rgba(200,180,255,0.6)',fontSize:'0.8rem',lineHeight:1.5}}>{post.text}</div>
              </div>
            ))}
          </div>

          {/* Post input */}
          {selected.isJoined && (
            <div style={{display:'flex',gap:'0.5rem'}}>
              <input value={newPost} onChange={e=>setNewPost(e.target.value)} onKeyDown={e=>e.key==='Enter'&&postMessage()} placeholder='Share with the circle...' style={{flex:1,background:'rgba(200,180,255,0.04)',border:'1px solid rgba(200,180,255,0.1)',borderRadius:'0.625rem',padding:'0.5rem 0.75rem',color:'rgba(220,200,255,0.8)',fontSize:'0.82rem',fontFamily:'inherit',outline:'none'}} />
              <button onClick={postMessage} style={{padding:'0.5rem 0.875rem',borderRadius:'0.625rem',border:'none',background:selected.color+'30',color:selected.color,fontSize:'0.82rem',cursor:'pointer',fontWeight:600}}>Post</button>
            </div>
          )}

          <button onClick={()=>toggleJoin(selected.id)} style={{width:'100%',marginTop:'0.875rem',padding:'0.5rem',borderRadius:'0.75rem',border:selected.isJoined?'1px solid rgba(248,113,113,0.2)':'none',background:selected.isJoined?'transparent':'linear-gradient(135deg,'+selected.color+','+selected.color+'aa)',color:selected.isJoined?'rgba(248,113,113,0.6)':'white',fontSize:'0.82rem',fontWeight:600,cursor:'pointer'}}>
            {selected.isJoined ? 'Leave Circle' : 'Join Circle'}
          </button>
        </div>
      )}

      {/* Circle list */}
      <div style={{display:'flex',flexDirection:'column',gap:'0.5rem'}}>
        {filtered.map(circle=>(
          <div key={circle.id} onClick={()=>setSelected(circle)} style={{...card,padding:'1rem',cursor:'pointer',borderColor:circle.isJoined?circle.color+'20':'rgba(200,180,255,0.08)',transition:'all 0.2s'}}>
            <div style={{display:'flex',alignItems:'center',gap:'0.75rem'}}>
              <div style={{width:'42px',height:'42px',borderRadius:'0.875rem',background:circle.color+'12',border:'1px solid '+circle.color+'20',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'1.2rem',flexShrink:0}}>{circle.emoji}</div>
              <div style={{flex:1,minWidth:0}}>
                <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'0.15rem'}}>
                  <div style={{color:'rgba(220,200,255,0.85)',fontSize:'0.88rem',fontWeight:600,display:'flex',alignItems:'center',gap:'0.35rem'}}>
                    {circle.name}
                    {circle.isPrivate && <span style={{fontSize:'0.6rem',color:'rgba(180,160,255,0.3)'}}>🔒</span>}
                  </div>
                  <span style={{color:'rgba(201,168,76,0.6)',fontSize:'0.72rem',fontWeight:700}}>{circle.angelNumber}</span>
                </div>
                <div style={{color:'rgba(180,160,255,0.4)',fontSize:'0.72rem',marginBottom:'0.3rem'}}>{circle.members.toLocaleString()} members · {circle.recentActivity}</div>
                <div style={{display:'flex',alignItems:'center',gap:'0.5rem'}}>
                  {circle.isJoined && <span style={{padding:'0.15rem 0.4rem',borderRadius:'0.3rem',background:circle.color+'10',border:'1px solid '+circle.color+'20',color:circle.color,fontSize:'0.62rem'}}>joined</span>}
                  <span style={{color:'rgba(180,160,255,0.3)',fontSize:'0.68rem',overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{circle.description.slice(0,50)}...</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
