'use client'
import { useState, useEffect } from 'react'

const MKEY = 'synchrosoul_manifestations'

interface Manifestation {
  id: string
  title: string
  detail: string
  number: string
  category: string
  status: 'seeding' | 'growing' | 'blooming' | 'manifested'
  affirmation: string
  createdAt: string
  manifestedAt?: string
  steps: { text: string; done: boolean }[]
}

const CATEGORIES = ['Love', 'Abundance', 'Health', 'Career', 'Spiritual', 'Home', 'Travel', 'Other']
const STATUS_CONFIG = {
  seeding:    { label: 'Seeding',    emoji: '🌱', color: '#86efac', desc: 'Planting the intention' },
  growing:    { label: 'Growing',    emoji: '🌿', color: '#34d399', desc: 'Energy is building' },
  blooming:   { label: 'Blooming',   emoji: '🌸', color: '#f9a8d4', desc: 'Signs are appearing' },
  manifested: { label: 'Manifested', emoji: '✨', color: '#c9a84c', desc: 'Received with gratitude' },
}

function load(): Manifestation[] {
  if (typeof window === 'undefined') return []
  try { return JSON.parse(localStorage.getItem(MKEY) || '[]') } catch { return [] }
}
function save(items: Manifestation[]) { localStorage.setItem(MKEY, JSON.stringify(items)) }
function uid() { return Date.now().toString(36) + Math.random().toString(36).slice(2) }

export default function ManifestationsPage() {
  const [items, setItems] = useState<Manifestation[]>([])
  const [view, setView] = useState<'list'|'add'|'detail'>('list')
  const [selected, setSelected] = useState<Manifestation | null>(null)
  const [filter, setFilter] = useState<string>('all')
  const [form, setForm] = useState({ title: '', detail: '', number: '1111', category: 'Love', affirmation: '', step: '' })
  const [steps, setSteps] = useState<{text:string;done:boolean}[]>([])
  const card: React.CSSProperties = { background: 'rgba(8,6,28,0.88)', border: '1px solid rgba(200,180,255,0.12)', borderRadius: '1.25rem', backdropFilter: 'blur(12px)' }

  useEffect(() => { setItems(load()) }, [])

  function addItem() {
    if (!form.title.trim()) return
    const m: Manifestation = { id: uid(), title: form.title, detail: form.detail, number: form.number, category: form.category, status: 'seeding', affirmation: form.affirmation || 'I am open to receiving this or something better.', createdAt: new Date().toISOString(), steps }
    const updated = [m, ...items]
    setItems(updated); save(updated)
    setForm({ title: '', detail: '', number: '1111', category: 'Love', affirmation: '', step: '' })
    setSteps([]); setView('list')
  }

  function updateStatus(id: string, status: Manifestation['status']) {
    const updated = items.map(i => i.id === id ? { ...i, status, manifestedAt: status === 'manifested' ? new Date().toISOString() : i.manifestedAt } : i)
    setItems(updated); save(updated)
    if (selected?.id === id) setSelected(updated.find(i => i.id === id) || null)
  }

  function toggleStep(mId: string, sIdx: number) {
    const updated = items.map(i => i.id === mId ? { ...i, steps: i.steps.map((s,j) => j===sIdx ? {...s,done:!s.done} : s) } : i)
    setItems(updated); save(updated)
    if (selected?.id === mId) setSelected(updated.find(i => i.id === mId) || null)
  }

  function deleteItem(id: string) {
    const updated = items.filter(i => i.id !== id)
    setItems(updated); save(updated); setView('list'); setSelected(null)
  }

  const visible = filter === 'all' ? items : items.filter(i => i.status === filter)
  const counts = { all: items.length, seeding: items.filter(i=>i.status==='seeding').length, growing: items.filter(i=>i.status==='growing').length, blooming: items.filter(i=>i.status==='blooming').length, manifested: items.filter(i=>i.status==='manifested').length }

  if (view === 'add') return (
    <div style={{ maxWidth: '520px', margin: '0 auto', padding: '1.5rem 1rem 2rem' }}>
      <button onClick={() => setView('list')} style={{ background: 'none', border: 'none', color: 'rgba(180,160,255,0.5)', cursor: 'pointer', fontSize: '0.8rem', marginBottom: '1rem', padding: 0 }}>← Back</button>
      <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.5rem', color: 'rgba(220,200,255,0.95)', margin: '0 0 1.25rem', fontWeight: 400 }}>Plant a New Intention</h2>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
        {[{label:'What do you wish to manifest?',key:'title',ph:'e.g. My dream home by the ocean...',multi:false},{label:'Describe it in vivid detail',key:'detail',ph:'Describe how it feels, looks, smells... be specific and present tense.',multi:true},{label:'Your affirmation',key:'affirmation',ph:'e.g. I am so grateful now that...',multi:false}].map(f => (
          <div key={f.key}>
            <label style={{ color: 'rgba(180,160,255,0.5)', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: '0.4rem' }}>{f.label}</label>
            {f.multi
              ? <textarea value={(form as any)[f.key]} onChange={e => setForm(p => ({...p,[f.key]:e.target.value}))} placeholder={f.ph} rows={3} style={{ width: '100%', background: 'rgba(8,6,28,0.8)', border: '1px solid rgba(200,180,255,0.15)', borderRadius: '0.75rem', padding: '0.75rem', color: 'rgba(220,200,255,0.85)', fontSize: '0.85rem', resize: 'none', outline: 'none', boxSizing: 'border-box' }} />
              : <input value={(form as any)[f.key]} onChange={e => setForm(p => ({...p,[f.key]:e.target.value}))} placeholder={f.ph} style={{ width: '100%', background: 'rgba(8,6,28,0.8)', border: '1px solid rgba(200,180,255,0.15)', borderRadius: '0.75rem', padding: '0.75rem', color: 'rgba(220,200,255,0.85)', fontSize: '0.85rem', outline: 'none', boxSizing: 'border-box' }} />
            }
          </div>
        ))}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
          <div>
            <label style={{ color: 'rgba(180,160,255,0.5)', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: '0.4rem' }}>Angel Number</label>
            <select value={form.number} onChange={e => setForm(p=>({...p,number:e.target.value}))} style={{ width: '100%', background: 'rgba(8,6,28,0.8)', border: '1px solid rgba(200,180,255,0.15)', borderRadius: '0.75rem', padding: '0.75rem', color: 'rgba(220,200,255,0.85)', fontSize: '0.85rem', outline: 'none' }}>
              {['111','222','333','444','555','666','777','888','999','1010','1111','1212'].map(n => <option key={n} value={n}>{n}</option>)}
            </select>
          </div>
          <div>
            <label style={{ color: 'rgba(180,160,255,0.5)', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: '0.4rem' }}>Category</label>
            <select value={form.category} onChange={e => setForm(p=>({...p,category:e.target.value}))} style={{ width: '100%', background: 'rgba(8,6,28,0.8)', border: '1px solid rgba(200,180,255,0.15)', borderRadius: '0.75rem', padding: '0.75rem', color: 'rgba(220,200,255,0.85)', fontSize: '0.85rem', outline: 'none' }}>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>
        <div>
          <label style={{ color: 'rgba(180,160,255,0.5)', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'block', marginBottom: '0.4rem' }}>Action Steps (optional)</label>
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
            <input value={form.step} onChange={e => setForm(p=>({...p,step:e.target.value}))} onKeyDown={e => { if(e.key==='Enter'&&form.step.trim()){setSteps(s=>[...s,{text:form.step.trim(),done:false}]);setForm(p=>({...p,step:''})) }}} placeholder='Add a step and press Enter...' style={{ flex:1, background:'rgba(8,6,28,0.8)', border:'1px solid rgba(200,180,255,0.15)', borderRadius:'0.75rem', padding:'0.625rem 0.875rem', color:'rgba(220,200,255,0.85)', fontSize:'0.82rem', outline:'none' }} />
            <button onClick={() => { if(form.step.trim()){setSteps(s=>[...s,{text:form.step.trim(),done:false}]);setForm(p=>({...p,step:''})) }}} style={{ padding:'0.625rem 1rem', borderRadius:'0.75rem', border:'1px solid rgba(200,180,255,0.15)', background:'rgba(200,180,255,0.08)', color:'rgba(200,180,255,0.6)', cursor:'pointer', fontSize:'0.82rem' }}>+</button>
          </div>
          {steps.map((s,i) => <div key={i} style={{ display:'flex', alignItems:'center', gap:'0.5rem', padding:'0.4rem 0.75rem', background:'rgba(200,180,255,0.04)', borderRadius:'0.5rem', marginBottom:'0.3rem' }}><span style={{color:'rgba(180,160,255,0.4)',fontSize:'0.75rem'}}>◦</span><span style={{color:'rgba(200,180,255,0.65)',fontSize:'0.8rem',flex:1}}>{s.text}</span><button onClick={()=>setSteps(st=>st.filter((_,j)=>j!==i))} style={{background:'none',border:'none',color:'rgba(244,114,182,0.4)',cursor:'pointer',fontSize:'0.75rem'}}>✕</button></div>)}
        </div>
        <button onClick={addItem} style={{ padding: '0.875rem', borderRadius: '0.875rem', border: '1px solid rgba(201,168,76,0.4)', background: 'rgba(201,168,76,0.15)', color: '#c9a84c', fontSize: '0.9rem', cursor: 'pointer', marginTop: '0.5rem' }}>🌱 Plant This Intention</button>
      </div>
    </div>
  )

  if (view === 'detail' && selected) {
    const sc = STATUS_CONFIG[selected.status]
    const daysAgo = Math.floor((Date.now() - new Date(selected.createdAt).getTime()) / 86400000)
    return (
      <div style={{ maxWidth: '520px', margin: '0 auto', padding: '1.5rem 1rem 2rem' }}>
        <button onClick={() => setView('list')} style={{ background: 'none', border: 'none', color: 'rgba(180,160,255,0.5)', cursor: 'pointer', fontSize: '0.8rem', marginBottom: '1rem', padding: 0 }}>← Back</button>
        <div style={{ ...card, padding: '1.5rem', borderColor: sc.color + '25', marginBottom: '0.875rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
            <div>
              <div style={{ color: 'rgba(180,160,255,0.35)', fontSize: '0.62rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.25rem' }}>{selected.category} · {selected.number}</div>
              <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.3rem', color: 'rgba(220,200,255,0.95)', margin: 0, fontWeight: 400 }}>{selected.title}</h2>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem' }}>{sc.emoji}</div>
              <div style={{ color: sc.color, fontSize: '0.62rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{sc.label}</div>
            </div>
          </div>
          {selected.detail && <p style={{ color: 'rgba(180,160,255,0.65)', fontSize: '0.82rem', lineHeight: 1.65, margin: '0 0 1rem', fontStyle: 'italic' }}>{selected.detail}</p>}
          <div style={{ background: 'rgba(201,168,76,0.06)', border: '1px solid rgba(201,168,76,0.15)', borderRadius: '0.75rem', padding: '0.875rem', marginBottom: '1rem' }}>
            <div style={{ color: '#c9a84c', fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.3rem' }}>Affirmation</div>
            <p style={{ color: 'rgba(220,200,255,0.75)', fontSize: '0.82rem', lineHeight: 1.6, margin: 0, fontStyle: 'italic' }}>&ldquo;{selected.affirmation}&rdquo;</p>
          </div>
          <div style={{ color: 'rgba(180,160,255,0.3)', fontSize: '0.7rem', marginBottom: '1rem' }}>Planted {daysAgo === 0 ? 'today' : daysAgo + ' days ago'}</div>
          <div style={{ marginBottom: '1rem' }}>
            <div style={{ color: 'rgba(180,160,255,0.35)', fontSize: '0.62rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>Update Status</div>
            <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
              {(Object.entries(STATUS_CONFIG) as [Manifestation['status'], typeof STATUS_CONFIG.seeding][]).map(([k,v]) => (
                <button key={k} onClick={() => updateStatus(selected.id, k)} style={{ padding: '0.35rem 0.75rem', borderRadius: '2rem', border: selected.status===k ? '1px solid ' + v.color + '60' : '1px solid rgba(200,180,255,0.1)', background: selected.status===k ? v.color + '15' : 'transparent', color: selected.status===k ? v.color : 'rgba(180,160,255,0.35)', fontSize: '0.72rem', cursor: 'pointer' }}>{v.emoji} {v.label}</button>
              ))}
            </div>
          </div>
          {selected.steps.length > 0 && (
            <div>
              <div style={{ color: 'rgba(180,160,255,0.35)', fontSize: '0.62rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>Action Steps ({selected.steps.filter(s=>s.done).length}/{selected.steps.length})</div>
              {selected.steps.map((s,i) => (
                <div key={i} onClick={() => toggleStep(selected.id, i)} style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', padding: '0.5rem 0.75rem', background: 'rgba(200,180,255,0.03)', borderRadius: '0.5rem', marginBottom: '0.3rem', cursor: 'pointer' }}>
                  <div style={{ width: '16px', height: '16px', borderRadius: '50%', border: '1px solid ' + (s.done ? '#34d399' : 'rgba(200,180,255,0.2)'), background: s.done ? '#34d39920' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{s.done && <span style={{ color: '#34d399', fontSize: '0.6rem' }}>✓</span>}</div>
                  <span style={{ color: s.done ? 'rgba(180,160,255,0.35)' : 'rgba(200,180,255,0.7)', fontSize: '0.8rem', textDecoration: s.done ? 'line-through' : 'none' }}>{s.text}</span>
                </div>
              ))}
            </div>
          )}
        </div>
        <button onClick={() => deleteItem(selected.id)} style={{ width: '100%', padding: '0.75rem', borderRadius: '0.875rem', border: '1px solid rgba(244,114,182,0.2)', background: 'transparent', color: 'rgba(244,114,182,0.4)', fontSize: '0.8rem', cursor: 'pointer' }}>Release this intention</button>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: '520px', margin: '0 auto', padding: '1.5rem 1rem 2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
        <div>
          <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.8rem', color: 'rgba(220,200,255,0.95)', margin: '0 0 0.25rem', fontWeight: 400 }}>Manifestations</h1>
          <p style={{ color: 'rgba(180,160,255,0.5)', fontSize: '0.8rem', margin: 0 }}>Plant intentions, watch them bloom</p>
        </div>
        <button onClick={() => setView('add')} style={{ padding: '0.5rem 1rem', borderRadius: '2rem', border: '1px solid rgba(201,168,76,0.4)', background: 'rgba(201,168,76,0.12)', color: '#c9a84c', fontSize: '0.78rem', cursor: 'pointer', whiteSpace: 'nowrap' }}>+ New</button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: '0.4rem', marginBottom: '1.25rem' }}>
        {(['all','seeding','growing','blooming','manifested'] as const).map(s => {
          const cfg = s === 'all' ? { emoji: '✦', color: '#a78bfa', label: 'All' } : STATUS_CONFIG[s]
          return (
            <button key={s} onClick={() => setFilter(s)} style={{ padding: '0.4rem 0.25rem', borderRadius: '0.75rem', border: filter===s ? '1px solid ' + cfg.color + '50' : '1px solid rgba(200,180,255,0.08)', background: filter===s ? cfg.color + '12' : 'rgba(8,6,28,0.6)', color: filter===s ? cfg.color : 'rgba(180,160,255,0.35)', fontSize: '0.6rem', cursor: 'pointer', textAlign: 'center' }}>
              <div style={{ fontSize: '1rem', marginBottom: '0.1rem' }}>{cfg.emoji}</div>
              <div>{(counts as any)[s]}</div>
            </button>
          )
        })}
      </div>
      {visible.length === 0 ? (
        <div style={{ ...card, padding: '3rem', textAlign: 'center' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>🌱</div>
          <p style={{ color: 'rgba(180,160,255,0.4)', fontSize: '0.85rem', margin: '0 0 1.25rem' }}>Your manifestation garden is empty.<br/>Plant your first intention.</p>
          <button onClick={() => setView('add')} style={{ padding: '0.625rem 1.5rem', borderRadius: '2rem', border: '1px solid rgba(201,168,76,0.4)', background: 'rgba(201,168,76,0.12)', color: '#c9a84c', fontSize: '0.82rem', cursor: 'pointer' }}>Plant Intention</button>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {visible.map(m => {
            const sc = STATUS_CONFIG[m.status]
            return (
              <button key={m.id} onClick={() => { setSelected(m); setView('detail') }} style={{ ...card, padding: '1.125rem', textAlign: 'left', cursor: 'pointer', borderColor: sc.color + '20', transition: 'all 0.2s' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ color: 'rgba(180,160,255,0.35)', fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.2rem' }}>{m.category} · {m.number}</div>
                    <div style={{ color: 'rgba(220,200,255,0.85)', fontFamily: 'Cormorant Garamond, serif', fontSize: '1rem', fontWeight: 400, marginBottom: '0.25rem' }}>{m.title}</div>
                    {m.steps.length > 0 && <div style={{ color: 'rgba(180,160,255,0.35)', fontSize: '0.68rem' }}>{m.steps.filter(s=>s.done).length}/{m.steps.length} steps</div>}
                  </div>
                  <div style={{ textAlign: 'center', marginLeft: '0.75rem' }}>
                    <div style={{ fontSize: '1.25rem' }}>{sc.emoji}</div>
                    <div style={{ color: sc.color, fontSize: '0.58rem', textTransform: 'uppercase', letterSpacing: '0.06em', marginTop: '0.1rem' }}>{sc.label}</div>
                  </div>
                </div>
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
