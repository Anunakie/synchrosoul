'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'

const KEY = 'synchrosoul_relationships'

function reduceToSingle(n: number): number {
  while (n > 9 && n !== 11 && n !== 22 && n !== 33) {
    n = String(n).split('').reduce((a, d) => a + parseInt(d), 0)
  }
  return n
}

function getLifePath(birthdate: string): number | null {
  if (!birthdate) return null
  try {
    const [y, m, d] = birthdate.split('-').map(Number)
    const sum = String(y).split('').reduce((a,c)=>a+parseInt(c),0) + m + d
    return reduceToSingle(sum)
  } catch { return null }
}

const PYTHAGOREAN: Record<string, number> = {
  a:1,b:2,c:3,d:4,e:5,f:6,g:7,h:8,i:9,
  j:1,k:2,l:3,m:4,n:5,o:6,p:7,q:8,r:9,
  s:1,t:2,u:3,v:4,w:5,x:6,y:7,z:8
}

function getSoulUrge(name: string): number | null {
  if (!name) return null
  const vowels = name.toLowerCase().replace(/[^aeiou]/g, '')
  if (!vowels) return null
  const sum = vowels.split('').reduce((a, c) => a + (PYTHAGOREAN[c] || 0), 0)
  return reduceToSingle(sum)
}

function getDestiny(name: string): number | null {
  if (!name) return null
  const letters = name.toLowerCase().replace(/[^a-z]/g, '')
  if (!letters) return null
  const sum = letters.split('').reduce((a, c) => a + (PYTHAGOREAN[c] || 0), 0)
  return reduceToSingle(sum)
}

const COMPATIBILITY: Record<string, { score: number; desc: string; color: string }> = {
  '1-1': { score: 72, desc: "Two leaders — powerful but competitive. Respect each other’s independence.", color: '#f97316' },
  '1-2': { score: 88, desc: "Leader meets nurturer. Beautiful balance of strength and sensitivity.", color: '#4ade80' },
  '1-3': { score: 85, desc: "Dynamic and creative. You inspire each other to shine.", color: '#f472b6' },
  '1-4': { score: 65, desc: "Visionary meets builder. Can clash but build great things together.", color: '#c9a84c' },
  '1-5': { score: 78, desc: "Both love freedom. Exciting but may struggle with commitment.", color: '#60a5fa' },
  '1-6': { score: 70, desc: "Leader meets caretaker. 6 may feel overshadowed by 1’s drive.", color: '#a78bfa' },
  '1-7': { score: 75, desc: "Outer action meets inner wisdom. Deeply complementary.", color: '#818cf8' },
  '1-8': { score: 80, desc: "Power couple energy. Both ambitious — align your goals.", color: '#c9a84c' },
  '1-9': { score: 82, desc: "Pioneer meets humanitarian. Inspiring and purposeful connection.", color: '#4ade80' },
  '2-2': { score: 90, desc: "Deep emotional harmony. Intuitive understanding of each other.", color: '#4ade80' },
  '2-3': { score: 87, desc: "Sensitive meets expressive. Joyful, warm, and nurturing bond.", color: '#f472b6' },
  '2-4': { score: 85, desc: "Stability and care. A grounded, loyal, and lasting connection.", color: '#4ade80' },
  '2-5': { score: 60, desc: "Sensitive meets adventurous. 2 may feel insecure with 5’s freedom.", color: '#f97316' },
  '2-6': { score: 95, desc: "Soulmate energy. Both devoted to love, home, and harmony.", color: '#4ade80' },
  '2-7': { score: 78, desc: "Emotional meets spiritual. Deep but may need space to breathe.", color: '#a78bfa' },
  '2-8': { score: 72, desc: "Heart meets ambition. 2 provides emotional support for 8’s drive.", color: '#c9a84c' },
  '2-9': { score: 88, desc: "Compassion meets wisdom. A deeply loving and giving bond.", color: '#4ade80' },
  '3-3': { score: 85, desc: "Double creative energy. Joyful but may lack grounding.", color: '#f472b6' },
  '3-4': { score: 68, desc: "Creative meets practical. Can balance beautifully with effort.", color: '#c9a84c' },
  '3-5': { score: 90, desc: "Two free spirits. Exciting, adventurous, and full of life.", color: '#4ade80' },
  '3-6': { score: 88, desc: "Joy meets love. Warm, expressive, and deeply nurturing.", color: '#f472b6' },
  '3-7': { score: 70, desc: "Expressive meets introspective. Fascinating but needs balance.", color: '#818cf8' },
  '3-8': { score: 75, desc: "Creative meets powerful. 3 brings joy to 8’s serious world.", color: '#c9a84c' },
  '3-9': { score: 92, desc: "Creative meets wise. A beautiful, inspired, and giving bond.", color: '#4ade80' },
  '4-4': { score: 80, desc: "Double stability. Reliable and loyal but may feel routine.", color: '#4ade80' },
  '4-5': { score: 62, desc: "Structure meets freedom. Fundamentally different approaches to life.", color: '#f97316' },
  '4-6': { score: 90, desc: "Builder meets nurturer. A devoted, stable, and loving home.", color: '#4ade80' },
  '4-7': { score: 82, desc: "Practical meets spiritual. Grounding for 7, structure for 4.", color: '#a78bfa' },
  '4-8': { score: 88, desc: "Two builders. Powerful team for creating lasting abundance.", color: '#c9a84c' },
  '4-9': { score: 72, desc: "Practical meets idealistic. Can inspire each other with effort.", color: '#818cf8' },
  '5-5': { score: 78, desc: "Double freedom. Exciting but may struggle to commit.", color: '#60a5fa' },
  '5-6': { score: 65, desc: "Freedom meets responsibility. 6 may feel 5 is unreliable.", color: '#f97316' },
  '5-7': { score: 85, desc: "Adventure meets wisdom. Both love exploring life’s mysteries.", color: '#a78bfa' },
  '5-8': { score: 78, desc: "Freedom meets power. Both ambitious in different directions.", color: '#c9a84c' },
  '5-9': { score: 88, desc: "Freedom meets wisdom. Both expansive, philosophical souls.", color: '#4ade80' },
  '6-6': { score: 88, desc: "Double love energy. Deeply devoted but watch for codependency.", color: '#f472b6' },
  '6-7': { score: 72, desc: "Love meets solitude. 7 needs space that 6 may misread.", color: '#818cf8' },
  '6-8': { score: 80, desc: "Love meets ambition. 6 creates the home 8 works to build.", color: '#c9a84c' },
  '6-9': { score: 92, desc: "Love meets compassion. A deeply giving and beautiful bond.", color: '#4ade80' },
  '7-7': { score: 82, desc: "Two seekers. Profound spiritual connection but need social life.", color: '#a78bfa' },
  '7-8': { score: 70, desc: "Spiritual meets material. Different values but can complement.", color: '#818cf8' },
  '7-9': { score: 90, desc: "Wisdom meets wisdom. A deeply spiritual and philosophical bond.", color: '#a78bfa' },
  '8-8': { score: 75, desc: "Double power. Incredible potential but power struggles possible.", color: '#c9a84c' },
  '8-9': { score: 78, desc: "Abundance meets wisdom. 9 helps 8 use power for good.", color: '#4ade80' },
  '9-9': { score: 85, desc: "Two old souls. Deep understanding and shared humanitarian vision.", color: '#818cf8' },
}

function getCompatibility(a: number, b: number) {
  const key1 = a <= b ? a+'-'+b : b+'-'+a
  return COMPATIBILITY[key1] || { score: 75, desc: "A unique cosmic connection with its own special energy.", color: '#a78bfa' }
}

type Person = {
  id: string
  name: string
  birthdate: string
  relation: string
  notes: string
  addedAt: string
}

const RELATION_TYPES = ['Partner', 'Friend', 'Family', 'Colleague', 'Soulmate', 'Other']
const RELATION_EMOJIS: Record<string,string> = { Partner:'💑', Friend:'🤝', Family:'👨‍👩‍👧', Colleague:'💼', Soulmate:'✨', Other:'◎' }

export default function RelationshipsPage() {
  const [people, setPeople] = useState<Person[]>([])
  const [myProfile, setMyProfile] = useState<any>(null)
  const [showAdd, setShowAdd] = useState(false)
  const [selected, setSelected] = useState<Person | null>(null)
  const [form, setForm] = useState({ name:'', birthdate:'', relation:'Friend', notes:'' })

  useEffect(() => {
    try {
      const p = localStorage.getItem(KEY)
      if (p) setPeople(JSON.parse(p))
      const mp = localStorage.getItem('synchrosoul_numerology_profile')
      if (mp) setMyProfile(JSON.parse(mp))
    } catch {}
  }, [])

  function save(updated: Person[]) {
    setPeople(updated)
    localStorage.setItem(KEY, JSON.stringify(updated))
  }

  function addPerson() {
    if (!form.name.trim()) return
    const p: Person = { id: Date.now().toString(), name: form.name.trim(), birthdate: form.birthdate, relation: form.relation, notes: form.notes, addedAt: new Date().toISOString() }
    save([...people, p])
    setForm({ name:'', birthdate:'', relation:'Friend', notes:'' })
    setShowAdd(false)
  }

  function deletePerson(id: string) {
    save(people.filter(p => p.id !== id))
    if (selected?.id === id) setSelected(null)
  }

  const myLP = myProfile?.lifePathNumber || null
  const card: React.CSSProperties = { background:'rgba(8,6,28,0.88)', border:'1px solid rgba(200,180,255,0.1)', borderRadius:'1.25rem', backdropFilter:'blur(12px)' }

  const selectedLP = selected ? getLifePath(selected.birthdate) : null
  const selectedSU = selected ? getSoulUrge(selected.name) : null
  const selectedDest = selected ? getDestiny(selected.name) : null
  const compat = (myLP && selectedLP) ? getCompatibility(myLP, selectedLP) : null

  return (
    <div style={{ maxWidth:'600px', margin:'0 auto', padding:'1.5rem 1rem 2rem' }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'1.5rem' }}>
        <div>
          <h1 style={{ fontFamily:'Cormorant Garamond,serif', fontSize:'1.8rem', color:'rgba(220,200,255,0.95)', margin:'0 0 0.2rem', fontWeight:400 }}>Soul Connections</h1>
          <p style={{ color:'rgba(180,160,255,0.5)', fontSize:'0.8rem', margin:0 }}>Numerology compatibility with people in your life</p>
        </div>
        <button onClick={() => setShowAdd(true)} style={{ background:'rgba(167,139,250,0.12)', border:'1px solid rgba(167,139,250,0.25)', color:'#a78bfa', padding:'0.5rem 1rem', borderRadius:'0.75rem', fontSize:'0.8rem', cursor:'pointer', fontWeight:600 }}>+ Add Person</button>
      </div>

      {/* Add form */}
      {showAdd && (
        <div style={{ ...card, padding:'1.25rem', marginBottom:'1.25rem', borderColor:'rgba(167,139,250,0.2)' }}>
          <div style={{ color:'rgba(167,139,250,0.6)', fontSize:'0.65rem', textTransform:'uppercase', letterSpacing:'0.12em', marginBottom:'1rem' }}>Add Soul Connection</div>
          <div style={{ display:'flex', flexDirection:'column', gap:'0.625rem' }}>
            <input value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="Their name" style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(200,180,255,0.15)', borderRadius:'0.625rem', padding:'0.625rem 0.875rem', color:'rgba(220,200,255,0.9)', fontSize:'0.875rem', outline:'none', width:'100%', boxSizing:'border-box' }} />
            <input type="date" value={form.birthdate} onChange={e=>setForm({...form,birthdate:e.target.value})} style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(200,180,255,0.15)', borderRadius:'0.625rem', padding:'0.625rem 0.875rem', color:'rgba(220,200,255,0.9)', fontSize:'0.875rem', outline:'none', width:'100%', boxSizing:'border-box', colorScheme:'dark' }} />
            <select value={form.relation} onChange={e=>setForm({...form,relation:e.target.value})} style={{ background:'rgba(8,6,28,0.95)', border:'1px solid rgba(200,180,255,0.15)', borderRadius:'0.625rem', padding:'0.625rem 0.875rem', color:'rgba(220,200,255,0.9)', fontSize:'0.875rem', outline:'none', width:'100%', boxSizing:'border-box' }}>
              {RELATION_TYPES.map(r => <option key={r} value={r}>{RELATION_EMOJIS[r]} {r}</option>)}
            </select>
            <textarea value={form.notes} onChange={e=>setForm({...form,notes:e.target.value})} placeholder="Notes (optional)" rows={2} style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(200,180,255,0.15)', borderRadius:'0.625rem', padding:'0.625rem 0.875rem', color:'rgba(220,200,255,0.9)', fontSize:'0.875rem', outline:'none', width:'100%', boxSizing:'border-box', resize:'none' }} />
            <div style={{ display:'flex', gap:'0.5rem' }}>
              <button onClick={addPerson} style={{ flex:1, background:'rgba(167,139,250,0.15)', border:'1px solid rgba(167,139,250,0.3)', color:'#a78bfa', padding:'0.625rem', borderRadius:'0.625rem', fontSize:'0.85rem', cursor:'pointer', fontWeight:600 }}>Add Connection</button>
              <button onClick={()=>setShowAdd(false)} style={{ padding:'0.625rem 1rem', background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.08)', color:'rgba(180,160,255,0.5)', borderRadius:'0.625rem', fontSize:'0.85rem', cursor:'pointer' }}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* My profile reminder */}
      {!myProfile?.birthdate && (
        <div style={{ ...card, padding:'1rem', marginBottom:'1rem', textAlign:'center' }}>
          <p style={{ color:'rgba(180,160,255,0.4)', fontSize:'0.8rem', margin:'0 0 0.5rem' }}>Add your birthdate to see compatibility scores</p>
          <Link href="/dashboard/onboarding" style={{ color:'#a78bfa', fontSize:'0.8rem', textDecoration:'none' }}>Complete your profile →</Link>
        </div>
      )}

      {/* People list */}
      {people.length === 0 && !showAdd && (
        <div style={{ ...card, padding:'2.5rem', textAlign:'center' }}>
          <div style={{ fontSize:'2.5rem', marginBottom:'0.75rem' }}>💫</div>
          <p style={{ color:'rgba(180,160,255,0.5)', fontSize:'0.9rem', fontFamily:'Cormorant Garamond,serif', fontStyle:'italic', margin:'0 0 0.5rem' }}>Every soul in your life has a cosmic purpose</p>
          <p style={{ color:'rgba(180,160,255,0.3)', fontSize:'0.78rem', margin:0 }}>Add people to discover your numerology connections</p>
        </div>
      )}

      <div style={{ display:'flex', flexDirection:'column', gap:'0.5rem', marginBottom: selected ? '1.25rem' : 0 }}>
        {people.map(person => {
          const lp = getLifePath(person.birthdate)
          const compat2 = (myLP && lp) ? getCompatibility(myLP, lp) : null
          const isSelected = selected?.id === person.id
          return (
            <div key={person.id} onClick={() => setSelected(isSelected ? null : person)} style={{ ...card, padding:'1rem', cursor:'pointer', borderColor: isSelected ? 'rgba(167,139,250,0.3)' : 'rgba(200,180,255,0.1)', background: isSelected ? 'rgba(167,139,250,0.06)' : 'rgba(8,6,28,0.88)', transition:'all 0.2s' }}>
              <div style={{ display:'flex', alignItems:'center', gap:'0.875rem' }}>
                <div style={{ width:'2.75rem', height:'2.75rem', borderRadius:'50%', background: compat2 ? compat2.color+'18' : 'rgba(167,139,250,0.1)', border:'1px solid '+(compat2?.color||'rgba(167,139,250,0.2)')+'40', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.2rem', flexShrink:0 }}>{RELATION_EMOJIS[person.relation]||'◎'}</div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ color:'rgba(220,200,255,0.9)', fontSize:'0.9rem', fontWeight:600, marginBottom:'0.15rem' }}>{person.name}</div>
                  <div style={{ display:'flex', gap:'0.5rem', alignItems:'center', flexWrap:'wrap' }}>
                    <span style={{ color:'rgba(180,160,255,0.4)', fontSize:'0.7rem' }}>{person.relation}</span>
                    {lp && <span style={{ color:'rgba(201,168,76,0.7)', fontSize:'0.7rem' }}>LP {lp}</span>}
                  </div>
                </div>
                {compat2 && (
                  <div style={{ textAlign:'center', flexShrink:0 }}>
                    <div style={{ color:compat2.color, fontSize:'1.1rem', fontWeight:700 }}>{compat2.score}%</div>
                    <div style={{ color:'rgba(180,160,255,0.35)', fontSize:'0.6rem', textTransform:'uppercase' }}>Sync</div>
                  </div>
                )}
                <button onClick={e=>{e.stopPropagation();deletePerson(person.id)}} style={{ background:'none', border:'none', color:'rgba(180,160,255,0.2)', cursor:'pointer', fontSize:'1rem', padding:'0.25rem', flexShrink:0 }}>✕</button>
              </div>
            </div>
          )
        })}
      </div>

      {/* Detail panel */}
      {selected && (
        <div style={{ ...card, padding:'1.5rem', borderColor:'rgba(167,139,250,0.2)', background:'rgba(167,139,250,0.04)' }}>
          <div style={{ display:'flex', alignItems:'center', gap:'0.875rem', marginBottom:'1.25rem' }}>
            <div style={{ width:'3.5rem', height:'3.5rem', borderRadius:'50%', background: compat ? compat.color+'18' : 'rgba(167,139,250,0.1)', border:'1px solid '+(compat?.color||'rgba(167,139,250,0.2)')+'40', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.5rem' }}>{RELATION_EMOJIS[selected.relation]||'◎'}</div>
            <div>
              <div style={{ color:'rgba(220,200,255,0.95)', fontSize:'1.1rem', fontWeight:600, fontFamily:'Cormorant Garamond,serif' }}>{selected.name}</div>
              <div style={{ color:'rgba(180,160,255,0.45)', fontSize:'0.75rem' }}>{selected.relation}{selected.birthdate ? ' · ' + new Date(selected.birthdate+'T12:00:00').toLocaleDateString('en-US',{month:'long',day:'numeric',year:'numeric'}) : ''}</div>
            </div>
          </div>

          {/* Numbers */}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'0.5rem', marginBottom:'1.25rem' }}>
            {[
              { label:'Life Path', value: selectedLP, color:'#a78bfa' },
              { label:'Soul Urge', value: selectedSU, color:'#f472b6' },
              { label:'Destiny', value: selectedDest, color:'#c9a84c' },
            ].map(n => (
              <div key={n.label} style={{ textAlign:'center', padding:'0.75rem 0.5rem', background:n.color+'08', borderRadius:'0.75rem', border:'1px solid '+n.color+'15' }}>
                <div style={{ color:n.color, fontSize:'1.4rem', fontWeight:700, marginBottom:'0.2rem' }}>{n.value || '?'}</div>
                <div style={{ color:'rgba(180,160,255,0.4)', fontSize:'0.6rem', textTransform:'uppercase', letterSpacing:'0.06em' }}>{n.label}</div>
              </div>
            ))}
          </div>

          {/* Compatibility */}
          {compat && myLP ? (
            <div style={{ background:compat.color+'08', border:'1px solid '+compat.color+'20', borderRadius:'1rem', padding:'1rem', marginBottom:'1rem' }}>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'0.625rem' }}>
                <span style={{ color:'rgba(180,160,255,0.5)', fontSize:'0.65rem', textTransform:'uppercase', letterSpacing:'0.1em' }}>Compatibility Score</span>
                <span style={{ color:compat.color, fontSize:'1.3rem', fontWeight:700 }}>{compat.score}%</span>
              </div>
              <div style={{ background:'rgba(255,255,255,0.06)', borderRadius:'9999px', height:'6px', marginBottom:'0.75rem', overflow:'hidden' }}>
                <div style={{ width:compat.score+'%', height:'100%', background:'linear-gradient(90deg,'+compat.color+'80,'+compat.color+')', borderRadius:'9999px', transition:'width 0.8s ease' }} />
              </div>
              <p style={{ color:'rgba(220,200,255,0.7)', fontSize:'0.8rem', lineHeight:1.5, margin:0 }}>{compat.desc}</p>
            </div>
          ) : !myLP ? (
            <div style={{ textAlign:'center', padding:'0.75rem', marginBottom:'1rem' }}>
              <Link href="/dashboard/onboarding" style={{ color:'#a78bfa', fontSize:'0.8rem', textDecoration:'none' }}>Add your birthdate to see compatibility →</Link>
            </div>
          ) : (
            <div style={{ textAlign:'center', padding:'0.75rem', color:'rgba(180,160,255,0.4)', fontSize:'0.8rem', marginBottom:'1rem' }}>Add their birthdate to see compatibility</div>
          )}

          {selected.notes && (
            <div style={{ background:'rgba(255,255,255,0.03)', borderRadius:'0.75rem', padding:'0.75rem', border:'1px solid rgba(255,255,255,0.06)' }}>
              <div style={{ color:'rgba(180,160,255,0.35)', fontSize:'0.62rem', textTransform:'uppercase', letterSpacing:'0.1em', marginBottom:'0.35rem' }}>Notes</div>
              <p style={{ color:'rgba(180,160,255,0.6)', fontSize:'0.8rem', margin:0, lineHeight:1.5 }}>{selected.notes}</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
