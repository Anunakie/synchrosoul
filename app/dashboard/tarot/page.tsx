'use client'
import { useState, useEffect } from 'react'

const MAJOR_ARCANA = [
  { num:0, name:'The Fool', emoji:'🌟', keywords:['new beginnings','spontaneity','innocence'], upright:'A leap of faith awaits. The universe is inviting you to begin without knowing the full path. Trust your instincts — the ground will appear beneath your feet.', reversed:'Recklessness or fear of starting. You may be holding back from a necessary leap, or rushing in without reflection.', element:'Air', numbers:['0','000','1111'] },
  { num:1, name:'The Magician', emoji:'✦', keywords:['willpower','manifestation','skill'], upright:'You have all the tools you need. This is a powerful moment for manifestation — your thoughts are becoming reality faster than usual. Act with intention.', reversed:'Manipulation or untapped potential. Skills are present but not being used. Check your motives.', element:'Air', numbers:['1','111','1111'] },
  { num:2, name:'The High Priestess', emoji:'🌙', keywords:['intuition','mystery','inner knowing'], upright:'The answers you seek are already within you. Go inward. Your intuition is sharper than your logic right now — trust the whispers.', reversed:'Secrets, disconnection from intuition. You may be ignoring your inner voice or someone is withholding truth.', element:'Water', numbers:['2','222','11'] },
  { num:3, name:'The Empress', emoji:'🌸', keywords:['abundance','fertility','nurturing'], upright:'A season of growth, creativity, and abundance. Nature is on your side. Nurture your projects and relationships — they are ready to bloom.', reversed:'Creative block or neglect. You may be overgiving or undervaluing yourself. Return to self-care.', element:'Earth', numbers:['3','333','3333'] },
  { num:4, name:'The Emperor', emoji:'⚔️', keywords:['authority','structure','stability'], upright:'Build the foundation. This is a time for discipline, structure, and taking charge. Your leadership is needed — step into your authority.', reversed:'Rigidity or abuse of power. Examine where control is becoming a cage rather than a container.', element:'Fire', numbers:['4','444','4444'] },
  { num:5, name:'The Hierophant', emoji:'🏛️', keywords:['tradition','spiritual guidance','conformity'], upright:'Seek wisdom from established traditions or a mentor. There is value in the tried and true. A spiritual teacher or community may be calling you.', reversed:'Rebellion against convention or spiritual dogma. Question the rules — some are worth breaking.', element:'Earth', numbers:['5','555','22'] },
  { num:6, name:'The Lovers', emoji:'💞', keywords:['love','choice','alignment'], upright:'A significant choice approaches — one that aligns with your deepest values. In love or partnership, deep harmony is possible. Choose with your whole heart.', reversed:'Misalignment or avoidance of a difficult choice. A relationship may need honest examination.', element:'Air', numbers:['6','66','222'] },
  { num:7, name:'The Chariot', emoji:'🏆', keywords:['victory','determination','control'], upright:'You are moving forward with unstoppable momentum. Harness your willpower and focus — victory is within reach. Do not let doubt steer you off course.', reversed:'Aggression or loss of direction. Check whether you are forcing outcomes rather than flowing with them.', element:'Water', numbers:['7','777','7777'] },
  { num:8, name:'Strength', emoji:'🦁', keywords:['courage','patience','inner strength'], upright:'True strength is gentle. You are being called to face challenges with compassion rather than force. Your quiet courage is more powerful than you know.', reversed:'Self-doubt or suppressed emotions. The lion within you is waiting to be acknowledged, not caged.', element:'Fire', numbers:['8','888','8888'] },
  { num:9, name:'The Hermit', emoji:'🕯️', keywords:['solitude','inner wisdom','guidance'], upright:'A period of sacred solitude. Withdraw from noise and seek your own light. The answers you need cannot be found outside — they live in the silence within.', reversed:'Isolation or refusal to seek help. Solitude has become avoidance. It is time to re-emerge.', element:'Earth', numbers:['9','999','9999'] },
  { num:10, name:'Wheel of Fortune', emoji:'☸️', keywords:['cycles','fate','turning point'], upright:'The wheel is turning in your favor. A significant shift is underway — cycles are completing and new ones beginning. Embrace the change; it is fated.', reversed:'Resistance to change or bad luck. You may be fighting a cycle that needs to complete. Surrender.', element:'Fire', numbers:['10','1010','1111'] },
  { num:11, name:'Justice', emoji:'⚖️', keywords:['truth','fairness','karma'], upright:'Truth will prevail. A situation is being brought into balance — karmic accounts are being settled. Act with integrity; the universe is watching.', reversed:'Injustice or avoidance of accountability. Examine where you have been unfair to yourself or others.', element:'Air', numbers:['11','1111','111'] },
  { num:12, name:'The Hanged Man', emoji:'🌀', keywords:['surrender','pause','new perspective'], upright:'Surrender is not defeat — it is wisdom. A voluntary pause will reveal what force cannot. Let go of control and see the situation from a completely new angle.', reversed:'Stalling or martyrdom. You may be sacrificing unnecessarily or refusing to release what must go.', element:'Water', numbers:['12','1212','222'] },
  { num:13, name:'Death', emoji:'🦋', keywords:['transformation','endings','rebirth'], upright:'Something is ending so something greater can begin. This is not loss — it is metamorphosis. The caterpillar does not mourn the cocoon.', reversed:'Resistance to change or stagnation. You are clinging to what has already ended. Release it with love.', element:'Water', numbers:['13','999','1111'] },
  { num:14, name:'Temperance', emoji:'🌊', keywords:['balance','patience','moderation'], upright:'Find the middle path. Extremes are not serving you. Blend opposites with patience and grace — the alchemy of balance will create something beautiful.', reversed:'Imbalance or excess. Something in your life has tipped too far. Recalibrate with gentleness.', element:'Fire', numbers:['14','444','222'] },
  { num:15, name:'The Devil', emoji:'⛓️', keywords:['shadow','bondage','materialism'], upright:'Examine what has you bound. The chains are often of your own making — beliefs, addictions, or fears that feel like facts. The key to freedom is awareness.', reversed:'Breaking free from limitation. You are releasing a long-held pattern. The shadow is losing its grip.', element:'Earth', numbers:['15','666','555'] },
  { num:16, name:'The Tower', emoji:'⚡', keywords:['sudden change','revelation','upheaval'], upright:'A sudden revelation or disruption clears away what was built on false foundations. Though it feels chaotic, this lightning bolt is a gift — truth is being revealed.', reversed:'Avoiding necessary change or a delayed crisis. The tower will fall eventually; better to dismantle it consciously.', element:'Fire', numbers:['16','1111','555'] },
  { num:17, name:'The Star', emoji:'⭐', keywords:['hope','healing','inspiration'], upright:'After the storm, the stars appear. This is a card of profound hope and healing. You are being renewed. Trust that the universe has not forgotten you.', reversed:'Despair or disconnection from hope. The star is still there — you have simply lost sight of it temporarily.', element:'Air', numbers:['17','777','1111'] },
  { num:18, name:'The Moon', emoji:'🌕', keywords:['illusion','subconscious','dreams'], upright:'Not everything is as it appears. The subconscious is speaking loudly through dreams, intuitions, and fears. Navigate by feeling rather than logic right now.', reversed:'Confusion lifting or repressed emotions surfacing. The fog is beginning to clear — trust what emerges.', element:'Water', numbers:['18','222','1212'] },
  { num:19, name:'The Sun', emoji:'☀️', keywords:['joy','success','vitality'], upright:'Pure radiance. A period of joy, clarity, and success is here or approaching. Celebrate your light — you have earned this warmth. Share it generously.', reversed:'Temporary setback or dimmed joy. The sun is behind clouds, not gone. Your light is not lost.', element:'Fire', numbers:['19','111','888'] },
  { num:20, name:'Judgement', emoji:'📯', keywords:['awakening','reckoning','calling'], upright:'A profound awakening is underway. You are being called to rise into your highest self. Answer the call — this is the moment you have been preparing for.', reversed:'Self-doubt or ignoring the call. You may be judging yourself too harshly or refusing to hear what the universe is asking of you.', element:'Fire', numbers:['20','999','1111'] },
  { num:21, name:'The World', emoji:'🌍', keywords:['completion','integration','wholeness'], upright:'A major cycle is complete. You have arrived. Celebrate this wholeness before beginning the next journey. Everything you sought is now within you.', reversed:'Incompletion or loose ends. Something needs to be fully resolved before you can move forward with integrity.', element:'Earth', numbers:['21','333','1234'] },
]

const SPREADS = [
  { id:'single', name:'Single Card', desc:'One card for immediate guidance', count:1 },
  { id:'three', name:'Past · Present · Future', desc:'Three cards for timeline clarity', count:3 },
  { id:'celtic', name:'Soul Cross', desc:'Five cards for deep insight', count:5 },
]

export default function TarotPage() {
  const [spread, setSpread] = useState(SPREADS[0])
  const [drawn, setDrawn] = useState<{card:typeof MAJOR_ARCANA[0],reversed:boolean}[]>([])
  const [flipped, setFlipped] = useState<number[]>([])
  const [phase, setPhase] = useState<'choose'|'drawing'|'revealed'>('choose')
  const [history, setHistory] = useState<{date:string,spread:string,cards:string[]}[]>([])

  useEffect(() => {
    try { const h = localStorage.getItem('synchrosoul_tarot_history'); if(h) setHistory(JSON.parse(h)) } catch {}
  }, [])

  function drawCards() {
    setPhase('drawing')
    setFlipped([])
    setTimeout(() => {
      const shuffled = [...MAJOR_ARCANA].sort(()=>Math.random()-0.5)
      const cards = shuffled.slice(0,spread.count).map(card=>({card,reversed:Math.random()>0.7}))
      setDrawn(cards)
      setPhase('revealed')
      const entry = {date:new Date().toLocaleDateString(),spread:spread.name,cards:cards.map(c=>c.card.name+(c.reversed?' (R)':''))}
      const newHistory = [entry,...history].slice(0,20)
      setHistory(newHistory)
      localStorage.setItem('synchrosoul_tarot_history',JSON.stringify(newHistory))
    }, 1500)
  }

  function reset() { setPhase('choose'); setDrawn([]); setFlipped([]) }

  const POSITIONS = ['Present','Past','Future','Challenge','Outcome']
  const card: React.CSSProperties = {background:'rgba(8,6,28,0.88)',border:'1px solid rgba(200,180,255,0.1)',borderRadius:'1.25rem',backdropFilter:'blur(12px)'}

  return (
    <div style={{maxWidth:'520px',margin:'0 auto',padding:'1.5rem 1rem 2rem'}}>
      <h1 style={{fontFamily:'Cormorant Garamond,serif',fontSize:'1.8rem',color:'rgba(220,200,255,0.95)',margin:'0 0 0.25rem',fontWeight:400}}>Sacred Tarot</h1>
      <p style={{color:'rgba(180,160,255,0.5)',fontSize:'0.8rem',margin:'0 0 1.5rem'}}>Major Arcana · 22 cards of the soul's journey</p>

      {phase==='choose' && (
        <>
          <div style={{...card,padding:'1.25rem',marginBottom:'1rem'}}>
            <div style={{color:'rgba(180,160,255,0.4)',fontSize:'0.68rem',textTransform:'uppercase',letterSpacing:'0.12em',marginBottom:'0.75rem'}}>Choose Your Spread</div>
            {SPREADS.map(s=>(
              <div key={s.id} onClick={()=>setSpread(s)}
                style={{padding:'0.875rem',borderRadius:'0.875rem',border:spread.id===s.id?'1px solid rgba(167,139,250,0.4)':'1px solid rgba(200,180,255,0.06)',background:spread.id===s.id?'rgba(167,139,250,0.08)':'transparent',cursor:'pointer',marginBottom:'0.4rem',transition:'all 0.2s'}}>
                <div style={{display:'flex',alignItems:'center',justifyContent:'space-between'}}>
                  <div>
                    <div style={{color:spread.id===s.id?'#a78bfa':'rgba(200,180,255,0.7)',fontSize:'0.88rem',fontWeight:600,marginBottom:'0.15rem'}}>{s.name}</div>
                    <div style={{color:'rgba(180,160,255,0.4)',fontSize:'0.75rem'}}>{s.desc}</div>
                  </div>
                  <div style={{color:'rgba(180,160,255,0.3)',fontSize:'0.75rem'}}>{s.count} card{s.count>1?'s':''}</div>
                </div>
              </div>
            ))}
          </div>
          <button onClick={drawCards} style={{width:'100%',padding:'1rem',borderRadius:'1rem',background:'linear-gradient(135deg,rgba(167,139,250,0.2),rgba(201,168,76,0.1))',border:'1px solid rgba(167,139,250,0.3)',color:'rgba(220,200,255,0.9)',fontSize:'1rem',cursor:'pointer',fontFamily:'Cormorant Garamond,serif',fontStyle:'italic',letterSpacing:'0.05em'}}>Draw the Cards ✦</button>

          {history.length>0 && (
            <div style={{...card,padding:'1rem',marginTop:'1.25rem'}}>
              <div style={{color:'rgba(180,160,255,0.4)',fontSize:'0.68rem',textTransform:'uppercase',letterSpacing:'0.12em',marginBottom:'0.625rem'}}>Recent Readings</div>
              {history.slice(0,3).map((h,i)=>(
                <div key={i} style={{padding:'0.5rem 0',borderBottom:'1px solid rgba(200,180,255,0.05)'}}>
                  <div style={{color:'rgba(200,180,255,0.6)',fontSize:'0.78rem',marginBottom:'0.15rem'}}>{h.spread}</div>
                  <div style={{color:'rgba(180,160,255,0.35)',fontSize:'0.7rem'}}>{h.cards.join(' · ')} · {h.date}</div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {phase==='drawing' && (
        <div style={{textAlign:'center',padding:'4rem 2rem'}}>
          <div style={{fontSize:'3rem',marginBottom:'1.25rem'}}>🃏</div>
          <p style={{color:'rgba(180,160,255,0.6)',fontSize:'0.9rem',fontFamily:'Cormorant Garamond,serif',fontStyle:'italic'}}>The cards are being drawn from the cosmic deck...</p>
        </div>
      )}

      {phase==='revealed' && drawn.length>0 && (
        <>
          <div style={{display:'flex',flexDirection:'column',gap:'0.875rem',marginBottom:'1rem'}}>
            {drawn.map((draw,i)=>(
              <div key={i}>
                {spread.count>1 && <div style={{color:'rgba(180,160,255,0.35)',fontSize:'0.65rem',textTransform:'uppercase',letterSpacing:'0.12em',marginBottom:'0.4rem'}}>{POSITIONS[i]}</div>}
                <div onClick={()=>setFlipped(f=>f.includes(i)?f.filter(x=>x!==i):[...f,i])}
                  style={{...card,padding:'1.25rem',cursor:'pointer',borderColor:flipped.includes(i)?draw.card.num%2===0?'rgba(167,139,250,0.3)':'rgba(201,168,76,0.3)':'rgba(200,180,255,0.1)',transition:'all 0.3s'}}>
                  <div style={{display:'flex',alignItems:'center',gap:'1rem'}}>
                    <div style={{width:'56px',height:'80px',borderRadius:'0.625rem',background:'linear-gradient(135deg,rgba(167,139,250,0.15),rgba(201,168,76,0.08))',border:'1px solid rgba(167,139,250,0.2)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'1.8rem',flexShrink:0,transform:draw.reversed?'rotate(180deg)':'none'}}>{draw.card.emoji}</div>
                    <div style={{flex:1}}>
                      <div style={{display:'flex',alignItems:'center',gap:'0.4rem',marginBottom:'0.2rem'}}>
                        <span style={{color:'rgba(220,200,255,0.9)',fontSize:'0.95rem',fontWeight:700}}>{draw.card.name}</span>
                        {draw.reversed && <span style={{color:'rgba(239,68,68,0.6)',fontSize:'0.65rem',padding:'0.1rem 0.35rem',borderRadius:'9999px',border:'1px solid rgba(239,68,68,0.2)',background:'rgba(239,68,68,0.06)'}}>Reversed</span>}
                      </div>
                      <div style={{display:'flex',gap:'0.3rem',flexWrap:'wrap',marginBottom:'0.3rem'}}>
                        {draw.card.keywords.map(k=>(<span key={k} style={{color:'rgba(180,160,255,0.4)',fontSize:'0.68rem'}}>{k}</span>)).reduce((a:any,b:any,i)=>[...a,i>0?<span key={'d'+i} style={{color:'rgba(180,160,255,0.2)'}}>·</span>:null,b],[])}
                      </div>
                      <div style={{color:'rgba(180,160,255,0.3)',fontSize:'0.68rem'}}>{draw.card.element} · Tap to reveal</div>
                    </div>
                  </div>
                  {flipped.includes(i) && (
                    <div style={{marginTop:'0.875rem',paddingTop:'0.875rem',borderTop:'1px solid rgba(200,180,255,0.06)'}}>
                      <p style={{color:'rgba(200,180,255,0.75)',fontSize:'0.88rem',lineHeight:1.7,margin:'0 0 0.625rem',fontFamily:'Cormorant Garamond,serif',fontStyle:'italic'}}>{draw.reversed?draw.card.reversed:draw.card.upright}</p>
                      <div style={{display:'flex',gap:'0.3rem',flexWrap:'wrap'}}>
                        {draw.card.numbers.map(n=>(<span key={n} style={{padding:'0.15rem 0.4rem',borderRadius:'9999px',background:'rgba(201,168,76,0.08)',border:'1px solid rgba(201,168,76,0.15)',color:'rgba(201,168,76,0.6)',fontSize:'0.65rem'}}>{n}</span>))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
          <button onClick={reset} style={{width:'100%',padding:'0.875rem',borderRadius:'0.875rem',background:'rgba(200,180,255,0.06)',border:'1px solid rgba(200,180,255,0.12)',color:'rgba(180,160,255,0.6)',fontSize:'0.88rem',cursor:'pointer',fontFamily:'inherit'}}>Draw Again ✦</button>
        </>
      )}
    </div>
  )
}
