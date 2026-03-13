'use client'
import { useState, useEffect } from 'react'
import MusicPlayer from '@/components/MusicPlayer'

const KEY = 'synchrosoul_vision_board'

type VisionItem = {
  id: string
  type: 'intention' | 'affirmation' | 'number' | 'symbol'
  content: string
  color: string
  size: 'small' | 'medium' | 'large'
  emoji: string
  createdAt: string
}

const COLORS = ['#a78bfa','#c9a84c','#f472b6','#60a5fa','#4ade80','#f97316','#e879f9','#34d399']
const SYMBOLS = ['✦','✧','◎','⟳','☽','✺','⊹','❋','⌘','✴','⭒','⋆']
const SAMPLE_ITEMS: VisionItem[] = [
  { id:'v1', type:'intention', content:'I am aligned with divine abundance', color:'#c9a84c', size:'large', emoji:'✨', createdAt: new Date().toISOString() },
  { id:'v2', type:'number', content:'1111', color:'#a78bfa', size:'medium', emoji:'✦', createdAt: new Date().toISOString() },
  { id:'v3', type:'affirmation', content:'My soul recognizes its perfect match', color:'#f472b6', size:'medium', emoji:'💫', createdAt: new Date().toISOString() },
  { id:'v4', type:'symbol', content:'☽', color:'#60a5fa', size:'small', emoji:'🌙', createdAt: new Date().toISOString() },
  { id:'v5', type:'intention', content:'I trust the timing of the universe', color:'#4ade80', size:'medium', emoji:'🌿', createdAt: new Date().toISOString() },
  { id:'v6', type:'number', content:'444', color:'#f97316', size:'small', emoji:'🔥', createdAt: new Date().toISOString() },
]

export default function VisionBoardPage() {
  const [items, setItems] = useState<VisionItem[]>([])
  const [showAdd, setShowAdd] = useState(false)
  const [newContent, setNewContent] = useState('')
  const [newType, setNewType] = useState<VisionItem['type']>('intention')
  const [newColor, setNewColor] = useState(COLORS[0])
  const [newSize, setNewSize] = useState<VisionItem['size']>('medium')
  const [newEmoji, setNewEmoji] = useState('✨')

  useEffect(() => {
    try {
      const saved = localStorage.getItem(KEY)
      setItems(saved ? JSON.parse(saved) : SAMPLE_ITEMS)
    } catch { setItems(SAMPLE_ITEMS) }
  }, [])

  function save(updated: VisionItem[]) {
    setItems(updated)
    localStorage.setItem(KEY, JSON.stringify(updated))
  }

  function addItem() {
    if (!newContent.trim()) return
    const item: VisionItem = {
      id: Date.now().toString(),
      type: newType, content: newContent.trim(),
      color: newColor, size: newSize, emoji: newEmoji,
      createdAt: new Date().toISOString()
    }
    save([item, ...items])
    setNewContent(''); setShowAdd(false)
  }

  function removeItem(id: string) { save(items.filter(i=>i.id!==id)) }

  const card: React.CSSProperties = {background:'rgba(8,6,28,0.88)',border:'1px solid rgba(200,180,255,0.1)',borderRadius:'1.25rem',backdropFilter:'blur(12px)'}

  const sizeStyles: Record<VisionItem['size'], React.CSSProperties> = {
    small: { gridColumn: 'span 1', minHeight: '90px', fontSize: '0.82rem' },
    medium: { gridColumn: 'span 1', minHeight: '120px', fontSize: '0.9rem' },
    large: { gridColumn: 'span 2', minHeight: '110px', fontSize: '1rem' },
  }

  return (
    <div style={{maxWidth:'600px',margin:'0 auto',padding:'1.5rem 1rem 2rem'}}>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'0.25rem'}}>
        <h1 style={{fontFamily:'Cormorant Garamond,serif',fontSize:'1.8rem',color:'rgba(220,200,255,0.95)',margin:0,fontWeight:400}}>Vision Board</h1>
        <button onClick={()=>setShowAdd(!showAdd)} style={{padding:'0.4rem 0.875rem',borderRadius:'9999px',border:'1px solid rgba(201,168,76,0.3)',background:'rgba(201,168,76,0.08)',color:'#c9a84c',fontSize:'0.78rem',cursor:'pointer'}}>+ Add</button>
      </div>
      <p style={{color:'rgba(180,160,255,0.5)',fontSize:'0.8rem',margin:'0 0 1.5rem'}}>Your sacred intentions & manifestations</p>

      {showAdd && (
        <div style={{...card,padding:'1.25rem',marginBottom:'1.25rem',borderColor:'rgba(201,168,76,0.15)'}}>
          <div style={{color:'rgba(180,160,255,0.4)',fontSize:'0.65rem',textTransform:'uppercase',letterSpacing:'0.12em',marginBottom:'0.875rem'}}>New Vision</div>
          
          {/* Type */}
          <div style={{display:'flex',gap:'0.35rem',marginBottom:'0.875rem',flexWrap:'wrap'}}>
            {(['intention','affirmation','number','symbol'] as const).map(t=>(
              <button key={t} onClick={()=>setNewType(t)} style={{padding:'0.25rem 0.625rem',borderRadius:'9999px',border:newType===t?'1px solid rgba(167,139,250,0.5)':'1px solid rgba(200,180,255,0.1)',background:newType===t?'rgba(167,139,250,0.12)':'transparent',color:newType===t?'#a78bfa':'rgba(180,160,255,0.4)',fontSize:'0.72rem',cursor:'pointer',textTransform:'capitalize'}}>{t}</button>
            ))}
          </div>

          {/* Content */}
          <textarea value={newContent} onChange={e=>setNewContent(e.target.value)}
            placeholder={newType==='number'?'e.g. 1111':newType==='symbol'?'e.g. ☽':'Write your intention...'}
            style={{width:'100%',background:'rgba(200,180,255,0.04)',border:'1px solid rgba(200,180,255,0.1)',borderRadius:'0.75rem',padding:'0.625rem',color:'rgba(220,200,255,0.8)',fontSize:'0.85rem',fontFamily:'inherit',outline:'none',resize:'none',height:'70px',boxSizing:'border-box',marginBottom:'0.75rem'}} />

          {/* Emoji */}
          <div style={{marginBottom:'0.75rem'}}>
            <div style={{color:'rgba(180,160,255,0.35)',fontSize:'0.65rem',marginBottom:'0.35rem'}}>Icon</div>
            <div style={{display:'flex',gap:'0.35rem',flexWrap:'wrap'}}>
              {['✨','💫','🌙','⭐','🔥','💎','🌿','🦋','🌸','🕊️','⚡','🌊'].map(e=>(
                <button key={e} onClick={()=>setNewEmoji(e)} style={{width:'32px',height:'32px',borderRadius:'0.4rem',border:newEmoji===e?'1px solid rgba(167,139,250,0.5)':'1px solid rgba(200,180,255,0.08)',background:newEmoji===e?'rgba(167,139,250,0.12)':'transparent',cursor:'pointer',fontSize:'1rem'}}>{e}</button>
              ))}
            </div>
          </div>

          {/* Color */}
          <div style={{marginBottom:'0.75rem'}}>
            <div style={{color:'rgba(180,160,255,0.35)',fontSize:'0.65rem',marginBottom:'0.35rem'}}>Color</div>
            <div style={{display:'flex',gap:'0.35rem'}}>
              {COLORS.map(c=>(
                <button key={c} onClick={()=>setNewColor(c)} style={{width:'24px',height:'24px',borderRadius:'50%',background:c,border:newColor===c?'2px solid white':'2px solid transparent',cursor:'pointer'}} />
              ))}
            </div>
          </div>

          {/* Size */}
          <div style={{marginBottom:'1rem'}}>
            <div style={{color:'rgba(180,160,255,0.35)',fontSize:'0.65rem',marginBottom:'0.35rem'}}>Size</div>
            <div style={{display:'flex',gap:'0.35rem'}}>
              {(['small','medium','large'] as const).map(s=>(
                <button key={s} onClick={()=>setNewSize(s)} style={{padding:'0.25rem 0.625rem',borderRadius:'9999px',border:newSize===s?'1px solid rgba(167,139,250,0.5)':'1px solid rgba(200,180,255,0.1)',background:newSize===s?'rgba(167,139,250,0.12)':'transparent',color:newSize===s?'#a78bfa':'rgba(180,160,255,0.4)',fontSize:'0.72rem',cursor:'pointer',textTransform:'capitalize'}}>{s}</button>
              ))}
            </div>
          </div>

          <div style={{display:'flex',gap:'0.5rem'}}>
            <button onClick={addItem} style={{flex:1,padding:'0.5rem',borderRadius:'0.75rem',border:'none',background:'linear-gradient(135deg,#a78bfa,#c9a84c)',color:'white',fontSize:'0.82rem',fontWeight:600,cursor:'pointer'}}>Add to Board</button>
            <button onClick={()=>setShowAdd(false)} style={{padding:'0.5rem 0.875rem',borderRadius:'0.75rem',border:'1px solid rgba(200,180,255,0.12)',background:'transparent',color:'rgba(180,160,255,0.5)',fontSize:'0.82rem',cursor:'pointer'}}>Cancel</button>
          </div>
        </div>
      )}

      {/* Board grid */}
      <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'0.625rem'}}>
        {items.map(item=>(
          <div key={item.id} style={{
            ...sizeStyles[item.size],
            background: 'linear-gradient(135deg,'+item.color+'12,rgba(8,6,28,0.95))',
            border: '1px solid '+item.color+'25',
            borderRadius: '1.25rem',
            backdropFilter: 'blur(12px)',
            padding: '1rem',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            position: 'relative',
            overflow: 'hidden',
          }}>
            {/* Glow */}
            <div style={{position:'absolute',top:'-20px',right:'-20px',width:'60px',height:'60px',borderRadius:'50%',background:item.color+'15',filter:'blur(20px)'}} />
            
            <div style={{fontSize:'1.4rem',marginBottom:'0.4rem'}}>{item.emoji}</div>
            <div style={{color:'rgba(220,200,255,0.85)',lineHeight:1.5,fontFamily:item.type==='intention'||item.type==='affirmation'?'Cormorant Garamond,serif':'inherit',fontStyle:item.type==='intention'?'italic':'normal',flex:1}}>{item.content}</div>
            <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginTop:'0.5rem'}}>
              <span style={{color:item.color,fontSize:'0.62rem',textTransform:'capitalize',opacity:0.7}}>{item.type}</span>
              <button onClick={()=>removeItem(item.id)} style={{background:'none',border:'none',color:'rgba(180,160,255,0.2)',cursor:'pointer',fontSize:'0.9rem',padding:'0',lineHeight:1}}>×</button>
            </div>
          </div>
        ))}
      </div>

      {items.length === 0 && (
        <div style={{textAlign:'center',padding:'3rem 1rem',color:'rgba(180,160,255,0.3)'}}>
          <div style={{fontSize:'2.5rem',marginBottom:'0.75rem'}}>🖼️</div>
          <div style={{fontSize:'0.9rem'}}>Your vision board is empty</div>
          <div style={{fontSize:'0.78rem',marginTop:'0.35rem'}}>Add intentions, affirmations, and sacred numbers</div>
        </div>
      )}
    
      {/* Sacred Sounds */}
      <div style={{ marginTop: '1.5rem' }}>
        <MusicPlayer defaultCategory="all" title="Sacred Sounds" />
      </div>
    </div>
  )
}
