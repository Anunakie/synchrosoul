'use client'
import { useState, useEffect } from 'react'

const KEY = 'synchrosoul_manifestations'

type Manifestation = {
  id: string
  title: string
  description: string
  angelNumber: string
  category: string
  status: 'seeding' | 'growing' | 'blooming' | 'manifested'
  progress: number
  createdAt: string
  manifestedAt?: string
  affirmation: string
}

const CATEGORIES = ['Love','Abundance','Health','Career','Spiritual','Home','Travel','Creativity']
const STATUS_CONFIG = {
  seeding:   { label:'Seeding',   emoji:'🌱', color:'#4ade80' },
  growing:   { label:'Growing',   emoji:'🌿', color:'#60a5fa' },
  blooming:  { label:'Blooming',  emoji:'🌸', color:'#f472b6' },
  manifested:{ label:'Manifested',emoji:'✨', color:'#c9a84c' },
}

const SAMPLE: Manifestation[] = [
  { id:'m1', title:'Soul Partner', description:'A deeply aligned spiritual partner who sees the same numbers', angelNumber:'1111', category:'Love', status:'growing', progress:60, createdAt:'2026-01-15T00:00:00Z', affirmation:'I am ready to receive my divine counterpart' },
  { id:'m2', title:'Abundant Flow', description:'Financial freedom that supports my spiritual mission', angelNumber:'888', category:'Abundance', status:'seeding', progress:30, createdAt:'2026-02-01T00:00:00Z', affirmation:'Money flows to me easily and joyfully' },
  { id:'m3', title:'Dream Home', description:'A sacred space surrounded by nature for healing work', angelNumber:'444', category:'Home', status:'blooming', progress:80, createdAt:'2025-11-01T00:00:00Z', affirmation:'My perfect home is already mine in the spiritual realm' },
]

export default function ManifestationsPage() {
  const [items, setItems] = useState<Manifestation[]>([])
  const [showAdd, setShowAdd] = useState(false)
  const [filter, setFilter] = useState<string>('all')
  const [title, setTitle] = useState('')
  const [desc, setDesc] = useState('')
  const [number, setNumber] = useState('')
  const [category, setCategory] = useState('Love')
  const [affirmation, setAffirmation] = useState('')
  const [expandedId, setExpandedId] = useState<string|null>(null)

  useEffect(() => {
    try { const s = localStorage.getItem(KEY); setItems(s ? JSON.parse(s) : SAMPLE) } catch { setItems(SAMPLE) }
  }, [])

  function save(updated: Manifestation[]) { setItems(updated); localStorage.setItem(KEY, JSON.stringify(updated)) }

  function addItem() {
    if (!title.trim()) return
    save([{ id:Date.now().toString(), title:title.trim(), description:desc.trim(), angelNumber:number.trim()||'111', category, status:'seeding', progress:10, createdAt:new Date().toISOString(), affirmation:affirmation.trim()||'I am open to receiving this blessing' }, ...items])
    setTitle(''); setDesc(''); setNumber(''); setAffirmation(''); setShowAdd(false)
  }

  function updateProgress(id: string, delta: number) {
    save(items.map(i => {
      if (i.id !== id) return i
      const p = Math.min(100, Math.max(0, i.progress + delta))
      const status: Manifestation['status'] = p >= 100 ? 'manifested' : p >= 70 ? 'blooming' : p >= 40 ? 'growing' : 'seeding'
      return { ...i, progress: p, status, manifestedAt: p >= 100 ? new Date().toISOString() : i.manifestedAt }
    }))
  }

  function remove(id: string) { save(items.filter(i=>i.id!==id)) }

  const filtered = filter === 'all' ? items : filter === 'manifested' ? items.filter(i=>i.status==='manifested') : items.filter(i=>i.category===filter)
  const card: React.CSSProperties = {background:'rgba(8,6,28,0.88)',border:'1px solid rgba(200,180,255,0.1)',borderRadius:'1.25rem',backdropFilter:'blur(12px)'}
  const manifested = items.filter(i=>i.status==='manifested').length

  return (
    <div style={{maxWidth:'560px',margin:'0 auto',padding:'1.5rem 1rem 2rem'}}>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'0.25rem'}}>
        <h1 style={{fontFamily:'Cormorant Garamond,serif',fontSize:'1.8rem',color:'rgba(220,200,255,0.95)',margin:0,fontWeight:400}}>Manifestations</h1>
        <button onClick={()=>setShowAdd(!showAdd)} style={{padding:'0.4rem 0.875rem',borderRadius:'9999px',border:'1px solid rgba(201,168,76,0.3)',background:'rgba(201,168,76,0.08)',color:'#c9a84c',fontSize:'0.78rem',cursor:'pointer'}}>+ New</button>
      </div>
      <p style={{color:'rgba(180,160,255,0.5)',fontSize:'0.8rem',margin:'0 0 1rem'}}>{manifested} of {items.length} manifested ✨</p>

      {/* Stats row */}
      <div style={{display:'grid',gridTemplateColumns:'repeat(4,1fr)',gap:'0.4rem',marginBottom:'1.25rem'}}>
        {Object.entries(STATUS_CONFIG).map(([k,v])=>{
          const count = items.filter(i=>i.status===k).length
          return (
            <div key={k} style={{...card,padding:'0.625rem',textAlign:'center'}}>
              <div style={{fontSize:'1.2rem'}}>{v.emoji}</div>
              <div style={{color:v.color,fontSize:'1rem',fontWeight:700}}>{count}</div>
              <div style={{color:'rgba(180,160,255,0.35)',fontSize:'0.6rem'}}>{v.label}</div>
            </div>
          )
        })}
      </div>

      {/* Add form */}
      {showAdd && (
        <div style={{...card,padding:'1.25rem',marginBottom:'1.25rem',borderColor:'rgba(201,168,76,0.15)'}}>
          <div style={{color:'rgba(180,160,255,0.4)',fontSize:'0.65rem',textTransform:'uppercase',letterSpacing:'0.12em',marginBottom:'0.875rem'}}>New Manifestation</div>
          <input value={title} onChange={e=>setTitle(e.target.value)} placeholder='What are you calling in?' style={{width:'100%',background:'rgba(200,180,255,0.04)',border:'1px solid rgba(200,180,255,0.1)',borderRadius:'0.625rem',padding:'0.5rem 0.75rem',color:'rgba(220,200,255,0.8)',fontSize:'0.85rem',fontFamily:'inherit',outline:'none',boxSizing:'border-box',marginBottom:'0.5rem'}} />
          <textarea value={desc} onChange={e=>setDesc(e.target.value)} placeholder='Describe it in detail...' style={{width:'100%',background:'rgba(200,180,255,0.04)',border:'1px solid rgba(200,180,255,0.1)',borderRadius:'0.625rem',padding:'0.5rem 0.75rem',color:'rgba(220,200,255,0.8)',fontSize:'0.82rem',fontFamily:'inherit',outline:'none',resize:'none',height:'60px',boxSizing:'border-box',marginBottom:'0.5rem'}} />
          <input value={affirmation} onChange={e=>setAffirmation(e.target.value)} placeholder='Your affirmation (I am...)' style={{width:'100%',background:'rgba(200,180,255,0.04)',border:'1px solid rgba(200,180,255,0.1)',borderRadius:'0.625rem',padding:'0.5rem 0.75rem',color:'rgba(220,200,255,0.8)',fontSize:'0.82rem',fontFamily:'Cormorant Garamond,serif',fontStyle:'italic',outline:'none',boxSizing:'border-box',marginBottom:'0.5rem'}} />
          <div style={{display:'flex',gap:'0.5rem',marginBottom:'0.875rem'}}>
            <input value={number} onChange={e=>setNumber(e.target.value)} placeholder='Angel # (e.g. 1111)' style={{flex:1,background:'rgba(200,180,255,0.04)',border:'1px solid rgba(200,180,255,0.1)',borderRadius:'0.625rem',padding:'0.5rem 0.75rem',color:'rgba(220,200,255,0.8)',fontSize:'0.82rem',fontFamily:'inherit',outline:'none'}} />
            <select value={category} onChange={e=>setCategory(e.target.value)} style={{flex:1,background:'rgba(200,180,255,0.06)',border:'1px solid rgba(200,180,255,0.1)',borderRadius:'0.625rem',padding:'0.5rem',color:'rgba(220,200,255,0.8)',fontSize:'0.82rem',fontFamily:'inherit',outline:'none'}}>
              {CATEGORIES.map(c=><option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div style={{display:'flex',gap:'0.5rem'}}>
            <button onClick={addItem} style={{flex:1,padding:'0.5rem',borderRadius:'0.75rem',border:'none',background:'linear-gradient(135deg,#a78bfa,#c9a84c)',color:'white',fontSize:'0.82rem',fontWeight:600,cursor:'pointer'}}>Plant Seed 🌱</button>
            <button onClick={()=>setShowAdd(false)} style={{padding:'0.5rem 0.875rem',borderRadius:'0.75rem',border:'1px solid rgba(200,180,255,0.12)',background:'transparent',color:'rgba(180,160,255,0.5)',fontSize:'0.82rem',cursor:'pointer'}}>Cancel</button>
          </div>
        </div>
      )}

      {/* Filter */}
      <div style={{display:'flex',gap:'0.3rem',flexWrap:'wrap',marginBottom:'1rem'}}>
        {['all','manifested',...CATEGORIES].map(f=>(
          <button key={f} onClick={()=>setFilter(f)} style={{padding:'0.25rem 0.5rem',borderRadius:'9999px',border:filter===f?'1px solid rgba(167,139,250,0.5)':'1px solid rgba(200,180,255,0.08)',background:filter===f?'rgba(167,139,250,0.12)':'transparent',color:filter===f?'#a78bfa':'rgba(180,160,255,0.35)',fontSize:'0.68rem',cursor:'pointer',textTransform:'capitalize'}}>{f}</button>
        ))}
      </div>

      {/* List */}
      <div style={{display:'flex',flexDirection:'column',gap:'0.625rem'}}>
        {filtered.map(item=>{
          const sc = STATUS_CONFIG[item.status]
          const expanded = expandedId === item.id
          return (
            <div key={item.id} style={{...card,padding:'1rem',borderColor:expanded?sc.color+'20':'rgba(200,180,255,0.08)'}}>
              <div style={{display:'flex',alignItems:'flex-start',gap:'0.75rem',cursor:'pointer'}} onClick={()=>setExpandedId(expanded?null:item.id)}>
                <div style={{width:'40px',height:'40px',borderRadius:'0.75rem',background:sc.color+'12',border:'1px solid '+sc.color+'20',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'1.2rem',flexShrink:0}}>{sc.emoji}</div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
                    <div style={{color:'rgba(220,200,255,0.85)',fontSize:'0.88rem',fontWeight:600}}>{item.title}</div>
                    <span style={{color:'rgba(201,168,76,0.7)',fontSize:'0.72rem',fontWeight:700}}>{item.angelNumber}</span>
                  </div>
                  <div style={{color:'rgba(180,160,255,0.4)',fontSize:'0.72rem',marginBottom:'0.4rem'}}>{item.category} · {sc.label}</div>
                  {/* Progress bar */}
                  <div style={{height:'4px',background:'rgba(200,180,255,0.08)',borderRadius:'2px',overflow:'hidden'}}>
                    <div style={{height:'100%',width:item.progress+'%',background:'linear-gradient(90deg,'+sc.color+','+sc.color+'88)',borderRadius:'2px',transition:'width 0.3s'}} />
                  </div>
                </div>
              </div>
              {expanded && (
                <div style={{marginTop:'0.875rem',paddingTop:'0.875rem',borderTop:'1px solid rgba(200,180,255,0.06)'}}>
                  {item.description && <p style={{color:'rgba(200,180,255,0.55)',fontSize:'0.82rem',margin:'0 0 0.625rem',lineHeight:1.6}}>{item.description}</p>}
                  <p style={{color:sc.color,fontSize:'0.82rem',fontFamily:'Cormorant Garamond,serif',fontStyle:'italic',margin:'0 0 0.875rem',opacity:0.8}}>“{item.affirmation}”</p>
                  <div style={{display:'flex',alignItems:'center',gap:'0.5rem'}}>
                    <span style={{color:'rgba(180,160,255,0.4)',fontSize:'0.72rem'}}>{item.progress}%</span>
                    <button onClick={()=>updateProgress(item.id,-10)} style={{padding:'0.25rem 0.5rem',borderRadius:'0.4rem',border:'1px solid rgba(200,180,255,0.1)',background:'transparent',color:'rgba(180,160,255,0.5)',fontSize:'0.75rem',cursor:'pointer'}}>−</button>
                    <button onClick={()=>updateProgress(item.id,10)} style={{padding:'0.25rem 0.5rem',borderRadius:'0.4rem',border:'1px solid rgba(167,139,250,0.2)',background:'rgba(167,139,250,0.08)',color:'#a78bfa',fontSize:'0.75rem',cursor:'pointer'}}>+</button>
                    <button onClick={()=>remove(item.id)} style={{marginLeft:'auto',padding:'0.25rem 0.5rem',borderRadius:'0.4rem',border:'1px solid rgba(248,113,113,0.15)',background:'transparent',color:'rgba(248,113,113,0.4)',fontSize:'0.72rem',cursor:'pointer'}}>Remove</button>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
