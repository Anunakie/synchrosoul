'use client'
import { useState } from 'react'

const COMPAT: Record<string, {score:number;title:string;description:string;challenge:string;gift:string}> = {
  '1-1': {score:72,title:'Twin Flames of Ambition',description:'Two powerful creators who inspire each other. Passion runs high but so does the need for independence.',challenge:'Both need to lead — learning to take turns is the key.',gift:'Unstoppable when aligned on a shared vision.'},
  '1-2': {score:88,title:'The Leader & The Peacemaker',description:'A beautifully balanced pairing. The 1 provides direction while the 2 brings harmony and emotional depth.',challenge:'The 1 must slow down; the 2 must speak up.',gift:'Together you build something both powerful and beautiful.'},
  '1-3': {score:85,title:'The Visionary & The Creator',description:'Electric creative chemistry. The 1 has the vision, the 3 has the art to bring it to life.',challenge:'The 3 can scatter; the 1 can be too rigid.',gift:'Your combined creativity can change the world.'},
  '1-5': {score:78,title:'Two Free Spirits',description:'Both love freedom and adventure. Exciting and spontaneous but may struggle with stability.',challenge:'Someone needs to anchor the ship.',gift:'The most adventurous, exciting partnership possible.'},
  '1-6': {score:82,title:'The Pioneer & The Nurturer',description:'The 6 provides the loving home the 1 needs. The 1 brings excitement and purpose to the 6s world.',challenge:'The 1 must not neglect home; the 6 must not smother.',gift:'A deeply loving partnership with purpose and warmth.'},
  '1-7': {score:70,title:'The Doer & The Thinker',description:'Fascinating intellectual tension. The 1 acts while the 7 contemplates. Stimulating or frustrating.',challenge:'The 1 must respect the 7s need for solitude and depth.',gift:'When it works, this is a profoundly wise and powerful union.'},
  '1-8': {score:90,title:'Power Couple',description:'One of the most powerful pairings. Both are driven, ambitious, and capable of extraordinary achievement.',challenge:'Power struggles can arise. Both must share the throne.',gift:'Unstoppable material and spiritual success together.'},
  '1-9': {score:75,title:'The Pioneer & The Sage',description:'The 9 has wisdom the 1 needs; the 1 has drive the 9 admires. A relationship of mutual growth.',challenge:'The 9 can be too idealistic; the 1 too self-focused.',gift:'Together you can lead movements and inspire millions.'},
  '2-2': {score:80,title:'Twin Empaths',description:'Deeply sensitive and intuitive together. Extraordinary emotional understanding.',challenge:'Both avoid conflict — issues can fester unspoken.',gift:'The most emotionally safe and nurturing relationship possible.'},
  '2-3': {score:87,title:'Heart & Soul',description:'The 2s emotional depth meets the 3s joyful expression. Warm, creative, and deeply loving.',challenge:'The 3 must not dismiss the 2s emotional needs.',gift:'A relationship full of laughter, art, and deep feeling.'},
  '2-6': {score:91,title:'Divine Harmony',description:'The most naturally harmonious pairing. Both value love, home, and deep connection above all.',challenge:'Can become too comfortable and avoid necessary growth.',gift:'A love so warm and safe it feels like coming home.'},
  '3-3': {score:76,title:'Double Creative Fire',description:'Wildly creative and fun but can lack grounding. Life is a party but bills still need paying.',challenge:'Both need to develop discipline and follow-through.',gift:'The most joyful, creative, expressive partnership imaginable.'},
  '4-8': {score:89,title:'The Foundation & The Empire',description:'The 4 builds the structure; the 8 brings the vision and resources. A powerhouse combination.',challenge:'The 4 can be too rigid; the 8 too domineering.',gift:'Together you build empires that last generations.'},
  '5-7': {score:83,title:'The Adventurer & The Mystic',description:'The 5 brings excitement; the 7 brings depth. A fascinating and stimulating pairing.',challenge:'The 5 needs freedom; the 7 needs solitude. Respect both.',gift:'A relationship that is never boring and always evolving.'},
  '6-9': {score:88,title:'The Lovers & The Sage',description:'Both are deeply compassionate and devoted to love and humanity. A beautifully aligned pairing.',challenge:'Can be so focused on others they neglect each other.',gift:'A love that heals everyone around you.'},
  '7-7': {score:85,title:'Twin Mystics',description:'A rare and profound spiritual connection. Both seek truth, depth, and meaning.',challenge:'Both need solitude — must actively choose togetherness.',gift:'The deepest spiritual and intellectual bond possible.'},
  '8-8': {score:78,title:'Empire Builders',description:'Extraordinary material potential. Both understand ambition, power, and abundance.',challenge:'Must build together not against each other.',gift:'Generational wealth and legacy are possible together.'},
  '9-9': {score:82,title:'Twin Humanitarians',description:'A deeply compassionate and wise pairing. Both are here to serve humanity.',challenge:'Can be so focused on the world they neglect each other.',gift:'Together you can heal the world.'},
  '11-11': {score:95,title:'Twin Flames',description:'The rarest and most intense pairing. Two master numbers meeting is a cosmic event. Transformative and fated.',challenge:'The intensity can be overwhelming. Grounding is essential.',gift:'A once-in-many-lifetimes soul recognition and union.'},
  '22-22': {score:92,title:'Master Builders United',description:'Two master builders creating together. The potential for world-changing work is extraordinary.',challenge:'The weight of your combined potential can feel crushing.',gift:'You can literally build a better world together.'},
}

function reduceLP(n: number): number {
  if (n === 11 || n === 22 || n === 33) return n
  if (n < 10) return n
  return reduceLP(String(n).split('').reduce((a,d) => a + parseInt(d), 0))
}

function getCompat(a: number, b: number) {
  const lo = Math.min(a,b), hi = Math.max(a,b)
  return COMPAT[lo+'-'+hi] || COMPAT[a+'-'+b] || {score:74,title:'Unique Soul Contract',description:'Your combination is rare and carries a unique cosmic purpose. The universe brought you together for a reason only you can discover.',challenge:'Embrace your differences as teachers, not obstacles.',gift:'Your unique combination creates something the world has never seen.'}
}

export default function CompatibilityPage() {
  const [numA, setNumA] = useState('')
  const [numB, setNumB] = useState('')
  const [result, setResult] = useState<any>(null)

  function calculate() {
    const a = parseInt(numA), b = parseInt(numB)
    if (!a || !b) return
    const lpA = reduceLP(a), lpB = reduceLP(b)
    setResult({ lpA, lpB, ...getCompat(lpA, lpB) })
  }

  const scoreColor = result ? (result.score >= 90 ? '#c9a84c' : result.score >= 80 ? '#a78bfa' : '#60a5fa') : '#a78bfa'
  const card: React.CSSProperties = { background: 'rgba(8,6,28,0.88)', border: '1px solid rgba(200,180,255,0.12)', borderRadius: '1.25rem', backdropFilter: 'blur(12px)' }

  return (
    <div style={{ maxWidth: '680px', margin: '0 auto', padding: '1.5rem 1rem 2rem' }}>
      <div style={{ marginBottom: '1.5rem' }}>
        <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.8rem', color: 'rgba(220,200,255,0.95)', margin: '0 0 0.25rem', fontWeight: 400 }}>Soul Compatibility</h1>
        <p style={{ color: 'rgba(180,160,255,0.5)', fontSize: '0.8rem', margin: 0 }}>Enter two Life Path numbers to reveal your cosmic compatibility</p>
      </div>

      <div style={{ ...card, padding: '1.5rem', marginBottom: '1.25rem' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr auto 1fr', gap: '1rem', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div>
            <label style={{ display: 'block', color: 'rgba(180,160,255,0.5)', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.4rem' }}>Your Life Path</label>
            <input type='number' min='1' max='33' value={numA} onChange={e => setNumA(e.target.value)} placeholder='e.g. 7' style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(200,180,255,0.2)', borderRadius: '0.75rem', padding: '0.75rem 1rem', color: 'rgba(220,200,255,0.9)', fontSize: '1.2rem', textAlign: 'center', outline: 'none', boxSizing: 'border-box' }} />
          </div>
          <div style={{ color: 'rgba(201,168,76,0.6)', fontSize: '1.5rem', textAlign: 'center', paddingTop: '1.2rem' }}>✦</div>
          <div>
            <label style={{ display: 'block', color: 'rgba(180,160,255,0.5)', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.4rem' }}>Their Life Path</label>
            <input type='number' min='1' max='33' value={numB} onChange={e => setNumB(e.target.value)} placeholder='e.g. 11' style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(200,180,255,0.2)', borderRadius: '0.75rem', padding: '0.75rem 1rem', color: 'rgba(220,200,255,0.9)', fontSize: '1.2rem', textAlign: 'center', outline: 'none', boxSizing: 'border-box' }} />
          </div>
        </div>
        <button onClick={calculate} style={{ width: '100%', padding: '0.875rem', borderRadius: '0.875rem', background: 'linear-gradient(135deg, rgba(167,139,250,0.4), rgba(201,168,76,0.4))', border: '1px solid rgba(167,139,250,0.3)', color: 'rgba(220,200,255,0.95)', fontSize: '0.95rem', cursor: 'pointer', fontWeight: 600 }}>✦ Reveal Compatibility</button>
      </div>

      {result && (
        <div style={{ ...card, padding: '1.75rem', borderColor: scoreColor+'33', marginBottom: '1.25rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
            <div style={{ display: 'inline-flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '7rem', height: '7rem', borderRadius: '50%', background: 'radial-gradient(circle, '+scoreColor+'18 0%, transparent 70%)', border: '2px solid '+scoreColor+'44', marginBottom: '0.75rem' }}>
              <div style={{ color: scoreColor, fontSize: '2rem', fontWeight: 700 }}>{result.score}%</div>
              <div style={{ color: 'rgba(180,160,255,0.4)', fontSize: '0.6rem', textTransform: 'uppercase' }}>soul sync</div>
            </div>
            <div style={{ color: 'rgba(220,200,255,0.9)', fontSize: '1.2rem', fontFamily: 'Cormorant Garamond, serif', marginBottom: '0.25rem' }}>{result.title}</div>
            <div style={{ color: 'rgba(180,160,255,0.4)', fontSize: '0.75rem' }}>Life Path {result.lpA} × Life Path {result.lpB}</div>
          </div>
          <p style={{ color: 'rgba(200,180,255,0.8)', fontSize: '0.9rem', lineHeight: 1.7, margin: '0 0 1.25rem', fontStyle: 'italic', fontFamily: 'Cormorant Garamond, serif', textAlign: 'center' }}>&ldquo;{result.description}&rdquo;</p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '0.875rem', padding: '1rem' }}>
              <div style={{ color: 'rgba(239,68,68,0.7)', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.4rem' }}>⚡ Challenge</div>
              <p style={{ color: 'rgba(200,180,255,0.7)', fontSize: '0.8rem', margin: 0, lineHeight: 1.5 }}>{result.challenge}</p>
            </div>
            <div style={{ background: 'rgba(52,211,153,0.08)', border: '1px solid rgba(52,211,153,0.2)', borderRadius: '0.875rem', padding: '1rem' }}>
              <div style={{ color: 'rgba(52,211,153,0.7)', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.4rem' }}>✦ Gift</div>
              <p style={{ color: 'rgba(200,180,255,0.7)', fontSize: '0.8rem', margin: 0, lineHeight: 1.5 }}>{result.gift}</p>
            </div>
          </div>
        </div>
      )}

      <div style={{ ...card, padding: '1.25rem' }}>
        <div style={{ color: 'rgba(180,160,255,0.5)', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.875rem' }}>Most Powerful Pairings</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {[['11 × 11','95%','Twin Flames','#c9a84c'],['1 × 8','90%','Power Couple','#a78bfa'],['2 × 6','91%','Divine Harmony','#f472b6'],['22 × 22','92%','Master Builders','#60a5fa'],['2 × 3','87%','Heart & Soul','#34d399']].map(([pair,score,title,color]) => (
            <div key={pair} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <span style={{ color, fontSize: '0.85rem', fontWeight: 700, minWidth: '3.5rem' }}>{pair}</span>
              <div style={{ flex: 1, height: '4px', borderRadius: '2px', background: 'rgba(255,255,255,0.05)', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: score, background: 'linear-gradient(90deg, '+color+'88, '+color+')', borderRadius: '2px' }} />
              </div>
              <span style={{ color: 'rgba(180,160,255,0.5)', fontSize: '0.72rem', minWidth: '2.5rem', textAlign: 'right' }}>{score}</span>
              <span style={{ color: 'rgba(180,160,255,0.4)', fontSize: '0.7rem', minWidth: '8rem' }}>{title}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}