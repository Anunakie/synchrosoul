'use client'
import { useState } from 'react'

const NUMBERS = [
  { n:'000', color:'#818cf8', title:'Divine Wholeness', keywords:['infinity','source','completion'], meaning:'You are one with the universe. A reminder that you are never separate from the divine source. Everything is connected, everything is whole. This is a moment of profound spiritual unity.' },
  { n:'111', color:'#a78bfa', title:'Manifestation Portal', keywords:['thoughts','creation','alignment'], meaning:'Your thoughts are seeds being planted in the cosmic field right now. Be intentional — what you focus on is rapidly manifesting. This is one of the most powerful manifestation numbers.' },
  { n:'1111', color:'#c084fc', title:'Awakening Gateway', keywords:['awakening','portal','new chapter'], meaning:'A master portal number. You are crossing a threshold into a new chapter of your soul journey. Your guides are unusually close. Make a wish — it will be heard.' },
  { n:'222', color:'#67e8f9', title:'Divine Balance', keywords:['trust','patience','harmony'], meaning:'Trust the process. Everything is unfolding in perfect divine timing. You are exactly where you need to be. Relationships and partnerships are highlighted — nurture them.' },
  { n:'2222', color:'#22d3ee', title:'Deep Trust', keywords:['faith','alignment','co-creation'], meaning:'A powerful confirmation that you are in deep alignment with your highest path. The universe is asking you to have unwavering faith. What you have been building is about to bloom.' },
  { n:'333', color:'#34d399', title:'Ascended Masters', keywords:['creativity','expansion','support'], meaning:'The ascended masters — Jesus, Buddha, Quan Yin — are surrounding you with love and support. Your creative gifts are needed in the world. Express yourself fully and fearlessly.' },
  { n:'3333', color:'#10b981', title:'Creative Explosion', keywords:['expression','joy','abundance'], meaning:'An amplified call to create. Your creative energy is at its peak. Whatever you make now will carry a special frequency. Joy and abundance flow through authentic self-expression.' },
  { n:'444', color:'#60a5fa', title:'Angelic Protection', keywords:['protection','stability','foundation'], meaning:'You are completely surrounded by angels. They are working behind the scenes on your behalf. Build your foundations now — this is a time of stability, safety, and divine support.' },
  { n:'4444', color:'#3b82f6', title:'Fortress of Light', keywords:['security','divine order','grounding'], meaning:'An extraordinary level of angelic protection. You are held in a fortress of light. Trust that the structures you are building now are divinely guided and will stand the test of time.' },
  { n:'555', color:'#f97316', title:'Sacred Change', keywords:['transformation','freedom','adventure'], meaning:'Major change is coming — and it is divinely orchestrated. Release resistance. The universe is rearranging circumstances for your highest good. Embrace the unknown with excitement.' },
  { n:'5555', color:'#fb923c', title:'Total Transformation', keywords:['rebirth','liberation','quantum leap'], meaning:'A quantum leap is underway. Your entire reality is being upgraded. This level of change can feel disorienting — anchor yourself in your values while everything else shifts.' },
  { n:'666', color:'#f472b6', title:'Rebalance', keywords:['balance','home','compassion'], meaning:'A gentle nudge to rebalance your focus. You may be over-investing in material concerns or neglecting your spiritual life. Return to love, family, and inner harmony.' },
  { n:'777', color:'#818cf8', title:'Spiritual Luck', keywords:['luck','wisdom','spiritual growth'], meaning:'The luckiest spiritual number. You are in perfect alignment with the universe. Spiritual gifts are awakening. Trust your intuition completely — it is operating at its highest frequency.' },
  { n:'7777', color:'#6366f1', title:'Cosmic Download', keywords:['enlightenment','psychic gifts','mastery'], meaning:'A rare and powerful number. You are receiving a cosmic download of wisdom and spiritual gifts. Your psychic abilities are heightened. Pay close attention to dreams and synchronicities.' },
  { n:'888', color:'#c9a84c', title:'Infinite Abundance', keywords:['abundance','karma','cycles'], meaning:'The infinity symbol turned upright. Financial and material abundance is flowing toward you. Karmic cycles are completing — what you have given is returning multiplied.' },
  { n:'8888', color:'#d97706', title:'Abundance Overflow', keywords:['wealth','legacy','power'], meaning:'Extraordinary abundance is available to you. This is a number of legacy and lasting wealth. Your relationship with money and power is being upgraded to its highest expression.' },
  { n:'999', color:'#f472b6', title:'Sacred Completion', keywords:['endings','release','lightworker'], meaning:'A major cycle is completing. Something must end for something greater to begin. You are also being called to your lightworker mission — your gifts are needed by the world.' },
  { n:'9999', color:'#ec4899', title:'Era Complete', keywords:['transformation','mission','rebirth'], meaning:'An entire era of your life is complete. This is one of the most significant numbers you can see. Honor what has been, release it with love, and step boldly into your new beginning.' },
  { n:'1010', color:'#a78bfa', title:'Divine Completion', keywords:['cycles','new beginning','divine timing'], meaning:'A cycle is completing and a new one is beginning simultaneously. You are being guided by the divine in every step. Trust the transitions — they are perfectly orchestrated.' },
  { n:'1212', color:'#c084fc', title:'Spiritual Growth', keywords:['growth','positive thinking','manifestation'], meaning:'Stay positive — your thoughts are creating your reality at an accelerated rate. This number appears when you are on the verge of a significant spiritual breakthrough.' },
  { n:'1234', color:'#818cf8', title:'Step by Step', keywords:['progress','order','momentum'], meaning:'You are moving in the right direction, one step at a time. Trust the sequential unfolding of your path. Each step is preparing you for the next. Keep going — you are making real progress.' },
  { n:'1313', color:'#a78bfa', title:'Ascended Support', keywords:['guidance','creativity','optimism'], meaning:'The ascended masters are cheering you on. They want you to know that your creative endeavors are divinely supported. Optimism is your superpower right now.' },
  { n:'2121', color:'#67e8f9', title:'New Cycle Balance', keywords:['new beginnings','balance','co-creation'], meaning:'A new cycle is beginning in perfect balance. You are being invited to co-create with the universe. Your partnerships — romantic, business, or spiritual — are blessed.' },
  { n:'3030', color:'#34d399', title:'Divine Creativity', keywords:['expression','divine support','flow'], meaning:'The divine is flowing through your creative expression. You are a channel for higher wisdom and beauty. Share your gifts without holding back.' },
  { n:'414', color:'#60a5fa', title:'Angelic Building', keywords:['hard work','angels','foundation'], meaning:'Your angels are helping you build something lasting. The hard work you are putting in is seen and supported. Keep going — the foundation you are laying is solid.' },
  { n:'515', color:'#f97316', title:'Guided Change', keywords:['change','guidance','positive shift'], meaning:'Change is coming and your angels are guiding every step of it. This transition is positive even if it does not feel that way yet. Trust the guidance you are receiving.' },
  { n:'711', color:'#818cf8', title:'Spiritual Reward', keywords:['reward','spiritual path','gratitude'], meaning:'You are being rewarded for your spiritual dedication. The universe acknowledges your growth and is sending blessings. Gratitude amplifies this energy significantly.' },
  { n:'818', color:'#c9a84c', title:'Abundance Shift', keywords:['financial change','new chapter','abundance'], meaning:'A significant shift in your financial reality is underway. Old patterns around money are dissolving. A new, more abundant chapter is beginning.' },
  { n:'919', color:'#f472b6', title:'Lightworker Call', keywords:['purpose','service','completion'], meaning:'Your soul mission is calling loudly. A phase of your life is ending to make room for your true purpose. You are a lightworker — your gifts are urgently needed.' },
]

export default function DictionaryPage() {
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<typeof NUMBERS[0]|null>(null)

  const filtered = NUMBERS.filter(n =>
    n.n.includes(search) ||
    n.title.toLowerCase().includes(search.toLowerCase()) ||
    n.keywords.some(k=>k.toLowerCase().includes(search.toLowerCase()))
  )

  const card: React.CSSProperties = {background:'rgba(8,6,28,0.88)',border:'1px solid rgba(200,180,255,0.1)',borderRadius:'1.25rem',backdropFilter:'blur(12px)'}

  return (
    <div style={{maxWidth:'560px',margin:'0 auto',padding:'1.5rem 1rem 2rem'}}>
      <h1 style={{fontFamily:'Cormorant Garamond,serif',fontSize:'1.8rem',color:'rgba(220,200,255,0.95)',margin:'0 0 0.25rem',fontWeight:400}}>Angel Number Dictionary</h1>
      <p style={{color:'rgba(180,160,255,0.5)',fontSize:'0.8rem',margin:'0 0 1.25rem'}}>{NUMBERS.length} sacred sequences decoded</p>

      <input
        value={search} onChange={e=>setSearch(e.target.value)}
        placeholder='Search by number, title, or keyword...'
        style={{width:'100%',background:'rgba(200,180,255,0.05)',border:'1px solid rgba(200,180,255,0.12)',borderRadius:'0.875rem',padding:'0.75rem 1rem',color:'rgba(220,200,255,0.85)',fontSize:'0.88rem',fontFamily:'inherit',outline:'none',boxSizing:'border-box',marginBottom:'1.25rem'}}
      />

      {selected && (
        <div style={{...card,padding:'1.5rem',marginBottom:'1.25rem',background:'linear-gradient(135deg,'+selected.color+'08,rgba(8,6,28,0.95))',borderColor:selected.color+'30'}}>
          <div style={{display:'flex',alignItems:'center',justifyContent:'space-between',marginBottom:'1rem'}}>
            <div>
              <div style={{color:selected.color,fontSize:'2rem',fontWeight:700,lineHeight:1,marginBottom:'0.25rem'}}>{selected.n}</div>
              <div style={{color:'rgba(220,200,255,0.8)',fontSize:'1rem',fontWeight:600}}>{selected.title}</div>
            </div>
            <button onClick={()=>setSelected(null)} style={{background:'none',border:'none',color:'rgba(180,160,255,0.4)',cursor:'pointer',fontSize:'1.2rem'}}>×</button>
          </div>
          <div style={{display:'flex',gap:'0.35rem',flexWrap:'wrap',marginBottom:'0.875rem'}}>
            {selected.keywords.map(k=>(<span key={k} style={{padding:'0.2rem 0.5rem',borderRadius:'9999px',background:selected.color+'12',border:'1px solid '+selected.color+'25',color:selected.color,fontSize:'0.7rem'}}>{k}</span>))}
          </div>
          <p style={{color:'rgba(200,180,255,0.75)',fontSize:'0.92rem',lineHeight:1.75,margin:0,fontFamily:'Cormorant Garamond,serif',fontStyle:'italic'}}>{selected.meaning}</p>
        </div>
      )}

      <div style={{display:'grid',gridTemplateColumns:'repeat(2,1fr)',gap:'0.5rem'}}>
        {filtered.map(n=>(
          <div key={n.n} onClick={()=>setSelected(n)}
            style={{...card,padding:'1rem',cursor:'pointer',borderColor:selected?.n===n.n?n.color+'40':'rgba(200,180,255,0.08)',background:selected?.n===n.n?n.color+'08':'rgba(8,6,28,0.88)',transition:'all 0.2s'}}>
            <div style={{color:n.color,fontSize:'1.2rem',fontWeight:700,marginBottom:'0.2rem'}}>{n.n}</div>
            <div style={{color:'rgba(220,200,255,0.75)',fontSize:'0.8rem',fontWeight:600,marginBottom:'0.25rem'}}>{n.title}</div>
            <div style={{display:'flex',gap:'0.25rem',flexWrap:'wrap'}}>
              {n.keywords.slice(0,2).map(k=>(<span key={k} style={{color:'rgba(180,160,255,0.35)',fontSize:'0.65rem'}}>{k}</span>)).reduce((a:any,b:any,i)=>[...a,i>0?<span key={'d'+i} style={{color:'rgba(180,160,255,0.2)'}}>·</span>:null,b],[])}
            </div>
          </div>
        ))}
      </div>

      {filtered.length===0 && (
        <div style={{...card,padding:'3rem',textAlign:'center'}}>
          <p style={{color:'rgba(180,160,255,0.4)',fontSize:'0.9rem',fontFamily:'Cormorant Garamond,serif',fontStyle:'italic',margin:0}}>No numbers found for “{search}”</p>
        </div>
      )}
    </div>
  )
}
