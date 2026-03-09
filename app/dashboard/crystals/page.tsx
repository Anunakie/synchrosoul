'use client'
import { useState } from 'react'

const CRYSTALS = [
  { name:'Amethyst', color:'#9b59b6', bg:'#9b59b615', emoji:'💜', numbers:['777','333','111'], chakra:'Crown', element:'Air', affirmation:'I am connected to divine wisdom', properties:['Spiritual protection','Intuition amplifier','Dream enhancer','Stress relief','Psychic development'], howToUse:'Hold during meditation, place under pillow for vivid dreams, wear as jewelry to maintain spiritual connection throughout the day.', angelMessage:'Your angels are amplifying your psychic gifts. Amethyst creates a direct channel to higher realms.' },
  { name:'Clear Quartz', color:'#e8e8f0', bg:'#e8e8f010', emoji:'🔮', numbers:['1111','111','1212'], chakra:'All', element:'All', affirmation:'I am a clear channel for divine light', properties:['Master healer','Amplifies intentions','Clarity of mind','Energy purifier','Manifestation accelerator'], howToUse:'Program with your intention by holding it and stating your desire clearly. Place on your altar, use in crystal grids, or carry to amplify all other crystals.', angelMessage:'Clear Quartz is the stone of the angels themselves. It magnifies every prayer and intention you send to the universe.' },
  { name:'Rose Quartz', color:'#f4a7b9', bg:'#f4a7b910', emoji:'🌸', numbers:['222','444','6','66'], chakra:'Heart', element:'Water', affirmation:'I am worthy of infinite love', properties:['Unconditional love','Self-love','Emotional healing','Attracting romance','Heart opening'], howToUse:'Place over your heart during meditation, keep in your bedroom to attract love, add to bathwater for a self-love ritual, or gift to someone you love.', angelMessage:'Your heart chakra is opening. Rose Quartz carries the frequency of divine love — the same love your angels have for you.' },
  { name:'Citrine', color:'#f9c74f', bg:'#f9c74f10', emoji:'🌟', numbers:['888','555','333'], chakra:'Solar Plexus', element:'Fire', affirmation:'I attract abundance effortlessly', properties:['Abundance magnet','Confidence booster','Creativity enhancer','Joy amplifier','Manifestation stone'], howToUse:'Place in the wealth corner of your home (far left from entrance), keep in your wallet or cash register, hold during abundance affirmations.', angelMessage:'Citrine carries the energy of the sun. Your angels are illuminating your path to abundance — receive it with open hands.' },
  { name:'Black Tourmaline', color:'#2d2d3a', bg:'#2d2d3a40', emoji:'🖤', numbers:['444','4444','000'], chakra:'Root', element:'Earth', affirmation:'I am protected and grounded', properties:['Psychic protection','EMF shield','Grounding','Negative energy repellent','Anxiety relief'], howToUse:'Place near electronics to absorb EMF, keep by your front door for home protection, hold when feeling anxious or ungrounded, wear during challenging situations.', angelMessage:'Your angels have placed an invisible shield around you. Black Tourmaline makes that protection physical and tangible.' },
  { name:'Lapis Lazuli', color:'#1a3a6b', bg:'#1a3a6b20', emoji:'🔵', numbers:['777','333','1111'], chakra:'Third Eye', element:'Water', affirmation:'I trust my inner wisdom completely', properties:['Third eye activator','Truth revealer','Wisdom enhancer','Communication booster','Ancient knowledge'], howToUse:'Place on your forehead during meditation to activate the third eye, wear as a necklace to enhance communication, keep on your desk for mental clarity.', angelMessage:'The ancient wisdom of the universe is available to you. Lapis Lazuli opens the channel to your highest knowing.' },
  { name:'Selenite', color:'#f0f0f8', bg:'#f0f0f810', emoji:'🤍', numbers:['111','1111','777'], chakra:'Crown', element:'Spirit', affirmation:'I am bathed in divine white light', properties:['Aura cleanser','Angel communicator','Space purifier','Mental clarity','Charging other crystals'], howToUse:'Never cleanse with water — it dissolves. Wave over your body to cleanse your aura, place in rooms to purify energy, use to charge other crystals overnight.', angelMessage:'Selenite is named after Selene, goddess of the moon. It is the most direct physical connection to angelic realms.' },
  { name:'Labradorite', color:'#4a7c8e', bg:'#4a7c8e15', emoji:'🌊', numbers:['555','1212','333'], chakra:'Third Eye', element:'Water', affirmation:'I embrace magical transformation', properties:['Magic amplifier','Transformation stone','Synchronicity enhancer','Psychic protection','Destiny activator'], howToUse:'Hold when you need to make a major decision, carry during times of change, meditate with it to receive visions about your path forward.', angelMessage:'Labradorite is the stone of synchronicity. When you see it flash with color, your angels are winking at you.' },
  { name:'Moldavite', color:'#2d6a4f', bg:'#2d6a4f15', emoji:'💚', numbers:['1111','999','555'], chakra:'Heart & Crown', element:'Cosmic', affirmation:'I welcome rapid spiritual transformation', properties:['Rapid transformation','Cosmic connection','DNA activation','Spiritual acceleration','Extraterrestrial energy'], howToUse:'Use with caution — its energy is intense. Start with short meditations (5 min), ground yourself with black tourmaline after use, keep in a special pouch.', angelMessage:'Moldavite fell from the stars 15 million years ago. It carries the frequency of cosmic evolution and rapid awakening.' },
  { name:'Moonstone', color:'#c8d8e8', bg:'#c8d8e810', emoji:'🌙', numbers:['222','2222','999'], chakra:'Sacral & Crown', element:'Water', affirmation:'I flow with divine feminine wisdom', properties:['Intuition enhancer','Feminine energy','New beginnings','Emotional balance','Psychic dreams'], howToUse:'Charge under the full moon monthly, wear during new moon rituals for new beginnings, place under your pillow for prophetic dreams, use during emotional healing work.', angelMessage:'Moonstone is the stone of the divine feminine. Your angels are asking you to trust your intuitive knowing above all else.' },
  { name:'Pyrite', color:'#c9a84c', bg:'#c9a84c10', emoji:'✨', numbers:['888','444','111'], chakra:'Solar Plexus', element:'Earth', affirmation:'I am a magnet for wealth and success', properties:['Wealth attractor','Confidence builder','Willpower enhancer','Protective shield','Action motivator'], howToUse:'Place on your desk or workspace, keep in your wallet alongside citrine, hold when setting financial intentions, use in abundance crystal grids.', angelMessage:'Pyrite is called Fool&#39;s Gold — but there is nothing foolish about calling in real abundance. Your angels are opening financial doors.' },
  { name:'Obsidian', color:'#1a1a2e', bg:'#1a1a2e40', emoji:'⚫', numbers:['999','000','444'], chakra:'Root', element:'Earth & Fire', affirmation:'I release all that no longer serves me', properties:['Shadow work tool','Truth mirror','Deep healing','Cord cutting','Psychic protection'], howToUse:'Use during shadow work journaling, place on your altar during release rituals, gaze into it for scrying, hold during cord-cutting meditations.', angelMessage:'Obsidian is the great revealer. Your angels are asking you to look honestly at what needs to be released for your highest good.' },
]

const CHAKRA_COLORS: Record<string,string> = {
  'Root':'#ef4444','Sacral':'#f97316','Solar Plexus':'#eab308','Heart':'#22c55e',
  'Throat':'#3b82f6','Third Eye':'#6366f1','Crown':'#a855f7','All':'#c9a84c',
  'Heart & Crown':'#ec4899','Sacral & Crown':'#8b5cf6','Earth & Fire':'#78716c','Spirit':'#e2e8f0','Cosmic':'#10b981'
}

export default function CrystalsPage() {
  const [selected, setSelected] = useState<typeof CRYSTALS[0]|null>(null)
  const [filter, setFilter] = useState('all')

  const chakras = ['all',...Array.from(new Set(CRYSTALS.map(c=>c.chakra)))]
  const filtered = filter==='all' ? CRYSTALS : CRYSTALS.filter(c=>c.chakra===filter)
  const card: React.CSSProperties = {background:'rgba(8,6,28,0.88)',border:'1px solid rgba(200,180,255,0.1)',borderRadius:'1.25rem',backdropFilter:'blur(12px)'}

  return (
    <div style={{maxWidth:'560px',margin:'0 auto',padding:'1.5rem 1rem 2rem'}}>
      <h1 style={{fontFamily:'Cormorant Garamond,serif',fontSize:'1.8rem',color:'rgba(220,200,255,0.95)',margin:'0 0 0.25rem',fontWeight:400}}>Crystal Guide</h1>
      <p style={{color:'rgba(180,160,255,0.5)',fontSize:'0.8rem',margin:'0 0 1.25rem'}}>{CRYSTALS.length} sacred stones for your journey</p>

      {/* Chakra filter */}
      <div style={{display:'flex',gap:'0.3rem',flexWrap:'wrap',marginBottom:'1.25rem'}}>
        {chakras.slice(0,8).map(c=>{
          const col = CHAKRA_COLORS[c]||'#a78bfa'
          return (
            <button key={c} onClick={()=>setFilter(c)} style={{padding:'0.3rem 0.625rem',borderRadius:'9999px',border:filter===c?'1px solid '+col+'60':'1px solid rgba(200,180,255,0.1)',background:filter===c?col+'15':'transparent',color:filter===c?col:'rgba(180,160,255,0.4)',fontSize:'0.7rem',cursor:'pointer',textTransform:'capitalize'}}>{c}</button>
          )
        })}
      </div>

      {/* Detail panel */}
      {selected && (
        <div style={{...card,padding:'1.5rem',marginBottom:'1.25rem',background:'linear-gradient(135deg,'+selected.color+'08,rgba(8,6,28,0.95))',borderColor:selected.color+'30'}}>
          <div style={{display:'flex',alignItems:'flex-start',justifyContent:'space-between',marginBottom:'1rem'}}>
            <div style={{display:'flex',alignItems:'center',gap:'0.875rem'}}>
              <span style={{fontSize:'2.5rem'}}>{selected.emoji}</span>
              <div>
                <div style={{color:selected.color,fontSize:'1.1rem',fontWeight:700}}>{selected.name}</div>
                <div style={{color:'rgba(180,160,255,0.5)',fontSize:'0.75rem'}}>{selected.chakra} Chakra · {selected.element}</div>
              </div>
            </div>
            <button onClick={()=>setSelected(null)} style={{background:'none',border:'none',color:'rgba(180,160,255,0.4)',cursor:'pointer',fontSize:'1.2rem'}}>×</button>
          </div>

          <div style={{background:'rgba(200,180,255,0.04)',borderRadius:'0.75rem',padding:'0.75rem',marginBottom:'0.875rem',borderLeft:'2px solid '+selected.color+'40'}}>
            <div style={{color:'rgba(180,160,255,0.4)',fontSize:'0.65rem',textTransform:'uppercase',letterSpacing:'0.1em',marginBottom:'0.25rem'}}>Affirmation</div>
            <div style={{color:'rgba(220,200,255,0.8)',fontSize:'0.88rem',fontFamily:'Cormorant Garamond,serif',fontStyle:'italic'}}>“{selected.affirmation}”</div>
          </div>

          <div style={{marginBottom:'0.875rem'}}>
            <div style={{color:'rgba(180,160,255,0.4)',fontSize:'0.65rem',textTransform:'uppercase',letterSpacing:'0.1em',marginBottom:'0.5rem'}}>Properties</div>
            <div style={{display:'flex',flexWrap:'wrap',gap:'0.3rem'}}>
              {selected.properties.map(p=>(<span key={p} style={{padding:'0.2rem 0.5rem',borderRadius:'9999px',background:selected.color+'10',border:'1px solid '+selected.color+'20',color:selected.color,fontSize:'0.7rem'}}>{p}</span>))}
            </div>
          </div>

          <div style={{marginBottom:'0.875rem'}}>
            <div style={{color:'rgba(180,160,255,0.4)',fontSize:'0.65rem',textTransform:'uppercase',letterSpacing:'0.1em',marginBottom:'0.35rem'}}>Angel Numbers</div>
            <div style={{display:'flex',gap:'0.35rem'}}>
              {selected.numbers.map(n=>(<span key={n} style={{padding:'0.2rem 0.5rem',borderRadius:'0.4rem',background:'rgba(201,168,76,0.1)',border:'1px solid rgba(201,168,76,0.2)',color:'#c9a84c',fontSize:'0.78rem',fontWeight:700}}>{n}</span>))}
            </div>
          </div>

          <div style={{marginBottom:'0.875rem'}}>
            <div style={{color:'rgba(180,160,255,0.4)',fontSize:'0.65rem',textTransform:'uppercase',letterSpacing:'0.1em',marginBottom:'0.35rem'}}>How To Use</div>
            <p style={{color:'rgba(200,180,255,0.65)',fontSize:'0.82rem',lineHeight:1.65,margin:0}}>{selected.howToUse}</p>
          </div>

          <div style={{background:selected.color+'08',borderRadius:'0.75rem',padding:'0.75rem',border:'1px solid '+selected.color+'15'}}>
            <div style={{color:'rgba(180,160,255,0.4)',fontSize:'0.65rem',textTransform:'uppercase',letterSpacing:'0.1em',marginBottom:'0.25rem'}}>✦ Angel Message</div>
            <p style={{color:'rgba(220,200,255,0.75)',fontSize:'0.85rem',lineHeight:1.65,margin:0,fontFamily:'Cormorant Garamond,serif',fontStyle:'italic'}}>{selected.angelMessage}</p>
          </div>
        </div>
      )}

      {/* Grid */}
      <div style={{display:'grid',gridTemplateColumns:'repeat(2,1fr)',gap:'0.5rem'}}>
        {filtered.map(c=>(
          <div key={c.name} onClick={()=>setSelected(c)}
            style={{...card,padding:'1rem',cursor:'pointer',borderColor:selected?.name===c.name?c.color+'40':'rgba(200,180,255,0.08)',background:selected?.name===c.name?c.color+'08':'rgba(8,6,28,0.88)',transition:'all 0.2s'}}>
            <div style={{fontSize:'1.8rem',marginBottom:'0.35rem'}}>{c.emoji}</div>
            <div style={{color:c.color,fontSize:'0.88rem',fontWeight:700,marginBottom:'0.15rem'}}>{c.name}</div>
            <div style={{color:'rgba(180,160,255,0.4)',fontSize:'0.7rem',marginBottom:'0.35rem'}}>{c.chakra} Chakra</div>
            <div style={{display:'flex',gap:'0.25rem',flexWrap:'wrap'}}>
              {c.numbers.slice(0,2).map(n=>(<span key={n} style={{color:'rgba(201,168,76,0.6)',fontSize:'0.65rem',fontWeight:600}}>{n}</span>)).reduce((a:any,b:any,i)=>[...a,i>0?<span key={'d'+i} style={{color:'rgba(180,160,255,0.2)'}}>·</span>:null,b],[])}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
