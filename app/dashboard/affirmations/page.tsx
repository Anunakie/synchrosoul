'use client'
import { useState, useEffect } from 'react'

const KEY_LOGS = 'synchrosoul_logs'
const KEY_PROFILE = 'synchrosoul_numerology_profile'
const KEY_FAV = 'synchrosoul_fav_affirmations'

const AFFIRMATIONS = [
  { id:'a1', text:'I am a magnet for miracles. The universe conspires in my favor in ways I cannot yet see.', category:'manifestation', number:'1111', color:'#a78bfa' },
  { id:'a2', text:'My soul knows the way. I trust the path even when I cannot see the destination.', category:'trust', number:'444', color:'#60a5fa' },
  { id:'a3', text:'I release what no longer serves me with love and gratitude. Space is being made for something extraordinary.', category:'release', number:'999', color:'#f472b6' },
  { id:'a4', text:'I am in perfect alignment with my highest timeline. Every number I see confirms I am exactly where I need to be.', category:'alignment', number:'1111', color:'#a78bfa' },
  { id:'a5', text:'Abundance is my birthright. I open my hands and my heart to receive all that is meant for me.', category:'abundance', number:'888', color:'#c9a84c' },
  { id:'a6', text:'I am deeply loved by the universe. My guardian angels walk beside me in every moment.', category:'love', number:'444', color:'#60a5fa' },
  { id:'a7', text:'My intuition is a sacred gift. I honor the whispers of my soul and act on divine guidance.', category:'intuition', number:'777', color:'#818cf8' },
  { id:'a8', text:'I am the author of my reality. With every thought, I write the story of my most beautiful life.', category:'manifestation', number:'333', color:'#34d399' },
  { id:'a9', text:'Change is not happening to me — it is happening for me. I welcome transformation with open arms.', category:'change', number:'555', color:'#f97316' },
  { id:'a10', text:'I am worthy of everything I desire. My dreams are not too big — the universe is simply preparing the stage.', category:'worthiness', number:'222', color:'#67e8f9' },
  { id:'a11', text:'My past does not define me. I am a new soul in every moment, capable of infinite reinvention.', category:'healing', number:'999', color:'#f472b6' },
  { id:'a12', text:'I radiate love, light, and healing energy. My presence is a gift to everyone I encounter.', category:'love', number:'333', color:'#34d399' },
  { id:'a13', text:'The universe has perfect timing. What is meant for me will not miss me. I rest in divine patience.', category:'trust', number:'222', color:'#67e8f9' },
  { id:'a14', text:'I am connected to an infinite source of wisdom, creativity, and power. I access it freely and fully.', category:'power', number:'777', color:'#818cf8' },
  { id:'a15', text:'My body is a sacred vessel. I honor it with love, nourishment, and deep reverence.', category:'healing', number:'444', color:'#60a5fa' },
  { id:'a16', text:'Every ending in my life is a sacred beginning in disguise. I trust the cycles of my soul.', category:'change', number:'999', color:'#f472b6' },
  { id:'a17', text:'I am a channel for divine creativity. Ideas, inspiration, and genius flow through me effortlessly.', category:'creativity', number:'333', color:'#34d399' },
  { id:'a18', text:'My financial reality is shifting. Wealth, opportunity, and prosperity are flowing to me now.', category:'abundance', number:'888', color:'#c9a84c' },
]

const CATEGORIES = ['all','manifestation','trust','release','alignment','abundance','love','intuition','healing','change']

export default function AffirmationsPage() {
  const [idx, setIdx] = useState(0)
  const [category, setCategory] = useState('all')
  const [favorites, setFavorites] = useState<string[]>([])
  const [showFavs, setShowFavs] = useState(false)
  const [copied, setCopied] = useState(false)
  const [animDir, setAnimDir] = useState<'left'|'right'|null>(null)

  useEffect(() => {
    try { const f = localStorage.getItem(KEY_FAV); if(f) setFavorites(JSON.parse(f)) } catch {}
    // Start with a random affirmation
    setIdx(Math.floor(Math.random() * AFFIRMATIONS.length))
  }, [])

  const filtered = category==='all' ? AFFIRMATIONS : AFFIRMATIONS.filter(a=>a.category===category)
  const current = filtered[idx % filtered.length]

  function navigate(dir: 'left'|'right') {
    setAnimDir(dir)
    setTimeout(() => {
      setIdx(i => dir==='right' ? (i+1)%filtered.length : (i-1+filtered.length)%filtered.length)
      setAnimDir(null)
    }, 200)
  }

  function toggleFav(id: string) {
    const newFavs = favorites.includes(id) ? favorites.filter(f=>f!==id) : [...favorites, id]
    setFavorites(newFavs)
    localStorage.setItem(KEY_FAV, JSON.stringify(newFavs))
  }

  function copyAffirmation() {
    navigator.clipboard.writeText(current.text).then(() => { setCopied(true); setTimeout(()=>setCopied(false),2000) })
  }

  const favAffirmations = AFFIRMATIONS.filter(a=>favorites.includes(a.id))
  const card: React.CSSProperties = {background:'rgba(8,6,28,0.88)',border:'1px solid rgba(200,180,255,0.1)',borderRadius:'1.25rem',backdropFilter:'blur(12px)'}

  return (
    <div style={{maxWidth:'520px',margin:'0 auto',padding:'1.5rem 1rem 2rem'}}>
      <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'0.25rem'}}>
        <h1 style={{fontFamily:'Cormorant Garamond,serif',fontSize:'1.8rem',color:'rgba(220,200,255,0.95)',margin:0,fontWeight:400}}>Affirmations</h1>
        <button onClick={()=>setShowFavs(!showFavs)} style={{background:'none',border:'none',color:showFavs?'#c9a84c':'rgba(180,160,255,0.4)',fontSize:'0.75rem',cursor:'pointer'}}>♡ Saved ({favorites.length})</button>
      </div>
      <p style={{color:'rgba(180,160,255,0.5)',fontSize:'0.8rem',margin:'0 0 1.25rem'}}>{AFFIRMATIONS.length} sacred declarations for your soul</p>

      {/* Category filter */}
      <div style={{display:'flex',gap:'0.35rem',flexWrap:'wrap',marginBottom:'1.25rem'}}>
        {CATEGORIES.map(c=>(
          <button key={c} onClick={()=>{setCategory(c);setIdx(0)}} style={{padding:'0.3rem 0.625rem',borderRadius:'9999px',border:category===c?'1px solid rgba(167,139,250,0.5)':'1px solid rgba(200,180,255,0.1)',background:category===c?'rgba(167,139,250,0.15)':'transparent',color:category===c?'#a78bfa':'rgba(180,160,255,0.4)',fontSize:'0.7rem',cursor:'pointer',textTransform:'capitalize'}}>{c}</button>
        ))}
      </div>

      {/* Main affirmation card */}
      {!showFavs && current && (
        <>
          <div style={{...card,padding:'2rem 1.75rem',marginBottom:'1rem',background:'linear-gradient(135deg,'+current.color+'08,rgba(8,6,28,0.95))',borderColor:current.color+'25',minHeight:'220px',display:'flex',flexDirection:'column',justifyContent:'space-between',opacity:animDir?0.3:1,transition:'opacity 0.2s'}}>
            <div>
              <div style={{display:'flex',alignItems:'center',gap:'0.5rem',marginBottom:'1.25rem'}}>
                <span style={{padding:'0.2rem 0.5rem',borderRadius:'9999px',background:current.color+'12',border:'1px solid '+current.color+'25',color:current.color,fontSize:'0.7rem'}}>{current.number}</span>
                <span style={{padding:'0.2rem 0.5rem',borderRadius:'9999px',background:'rgba(200,180,255,0.05)',border:'1px solid rgba(200,180,255,0.1)',color:'rgba(180,160,255,0.4)',fontSize:'0.7rem',textTransform:'capitalize'}}>{current.category}</span>
                <span style={{marginLeft:'auto',color:'rgba(180,160,255,0.25)',fontSize:'0.7rem'}}>{(idx%filtered.length)+1}/{filtered.length}</span>
              </div>
              <p style={{color:'rgba(220,200,255,0.9)',fontSize:'1.1rem',lineHeight:1.75,margin:0,fontFamily:'Cormorant Garamond,serif',fontStyle:'italic',fontWeight:400}}>“{current.text}”</p>
            </div>
          </div>

          {/* Controls */}
          <div style={{display:'flex',alignItems:'center',gap:'0.5rem',marginBottom:'1.25rem'}}>
            <button onClick={()=>navigate('left')} style={{width:'44px',height:'44px',borderRadius:'50%',background:'rgba(200,180,255,0.06)',border:'1px solid rgba(200,180,255,0.12)',color:'rgba(180,160,255,0.5)',fontSize:'1.1rem',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center'}}>←</button>
            <button onClick={()=>toggleFav(current.id)} style={{flex:1,padding:'0.625rem',borderRadius:'0.875rem',background:favorites.includes(current.id)?'rgba(201,168,76,0.12)':'rgba(200,180,255,0.06)',border:favorites.includes(current.id)?'1px solid rgba(201,168,76,0.3)':'1px solid rgba(200,180,255,0.12)',color:favorites.includes(current.id)?'#c9a84c':'rgba(180,160,255,0.5)',fontSize:'0.82rem',cursor:'pointer',fontFamily:'inherit'}}>{favorites.includes(current.id)?'♥ Saved':'♡ Save'}</button>
            <button onClick={copyAffirmation} style={{flex:1,padding:'0.625rem',borderRadius:'0.875rem',background:copied?'rgba(74,222,128,0.1)':'rgba(200,180,255,0.06)',border:copied?'1px solid rgba(74,222,128,0.3)':'1px solid rgba(200,180,255,0.12)',color:copied?'#4ade80':'rgba(180,160,255,0.5)',fontSize:'0.82rem',cursor:'pointer',fontFamily:'inherit'}}>{copied?'✓ Copied':'⎘ Copy'}</button>
            <button onClick={()=>navigate('right')} style={{width:'44px',height:'44px',borderRadius:'50%',background:'rgba(200,180,255,0.06)',border:'1px solid rgba(200,180,255,0.12)',color:'rgba(180,160,255,0.5)',fontSize:'1.1rem',cursor:'pointer',display:'flex',alignItems:'center',justifyContent:'center'}}>→</button>
          </div>

          {/* Random button */}
          <button onClick={()=>setIdx(Math.floor(Math.random()*filtered.length))} style={{width:'100%',padding:'0.75rem',borderRadius:'0.875rem',background:'rgba(167,139,250,0.08)',border:'1px solid rgba(167,139,250,0.15)',color:'rgba(167,139,250,0.6)',fontSize:'0.85rem',cursor:'pointer',fontFamily:'inherit'}}>✦ Random Affirmation</button>
        </>
      )}

      {/* Favorites */}
      {showFavs && (
        <div>
          {favAffirmations.length===0 ? (
            <div style={{...card,padding:'3rem',textAlign:'center'}}>
              <p style={{color:'rgba(180,160,255,0.4)',fontSize:'0.9rem',fontFamily:'Cormorant Garamond,serif',fontStyle:'italic',margin:0}}>No saved affirmations yet. Tap ♡ to save your favorites.</p>
            </div>
          ) : (
            <div style={{display:'flex',flexDirection:'column',gap:'0.625rem'}}>
              {favAffirmations.map(a=>(
                <div key={a.id} style={{...card,padding:'1.25rem',borderColor:a.color+'20'}}>
                  <p style={{color:'rgba(220,200,255,0.85)',fontSize:'0.9rem',lineHeight:1.7,margin:'0 0 0.625rem',fontFamily:'Cormorant Garamond,serif',fontStyle:'italic'}}>“{a.text}”</p>
                  <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
                    <span style={{color:a.color,fontSize:'0.7rem'}}>{a.number} · {a.category}</span>
                    <button onClick={()=>toggleFav(a.id)} style={{background:'none',border:'none',color:'rgba(201,168,76,0.5)',cursor:'pointer',fontSize:'0.8rem'}}>♥ Remove</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
