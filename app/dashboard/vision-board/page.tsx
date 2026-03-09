'use client'
import { useState, useEffect, useRef } from 'react'

interface VisionItem {
  id: string
  type: 'image' | 'affirmation' | 'number' | 'intention'
  content: string
  label: string
  color: string
  x: number
  y: number
  createdAt: string
}

const VB_KEY = 'synchrosoul_visionboard_v2'
const COLORS = ['#a78bfa','#f472b6','#c9a84c','#34d399','#60a5fa','#fb923c','#e0e7ff']

const INTENTION_TEMPLATES = [
  'I am aligned with my highest purpose',
  'Abundance flows to me effortlessly',
  'I attract love that mirrors my soul',
  'My angel numbers guide me daily',
  'I trust the divine timing of my life',
  'I am a magnet for miracles',
  'My dreams are becoming reality',
  'I radiate light and attract light',
]

export default function VisionBoardPage() {
  const [items, setItems] = useState<VisionItem[]>([])
  const [mode, setMode] = useState<'view'|'add'>('view')
  const [addType, setAddType] = useState<'affirmation'|'number'|'intention'|'image'>('intention')
  const [text, setText] = useState('')
  const [label, setLabel] = useState('')
  const [color, setColor] = useState(COLORS[0])
  const [selectedTemplate, setSelectedTemplate] = useState('')
  const fileRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const saved = localStorage.getItem(VB_KEY)
    if (saved) setItems(JSON.parse(saved))
  }, [])

  function save(updated: VisionItem[]) {
    setItems(updated)
    localStorage.setItem(VB_KEY, JSON.stringify(updated))
  }

  function addItem(content: string, type: VisionItem['type']) {
    if (!content.trim()) return
    const item: VisionItem = {
      id: Date.now().toString(),
      type,
      content: content.trim(),
      label: label.trim() || (type === 'number' ? 'Angel Number' : type === 'image' ? 'Vision' : 'Intention'),
      color,
      x: Math.random() * 60 + 10,
      y: Math.random() * 60 + 10,
      createdAt: new Date().toISOString(),
    }
    save([item, ...items])
    setText('')
    setLabel('')
    setSelectedTemplate('')
    setMode('view')
  }

  function handleImage(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string
      addItem(dataUrl, 'image')
    }
    reader.readAsDataURL(file)
  }

  function removeItem(id: string) {
    save(items.filter(i => i.id !== id))
  }

  const card: React.CSSProperties = { background: 'rgba(8,6,28,0.88)', border: '1px solid rgba(200,180,255,0.12)', borderRadius: '1.25rem', backdropFilter: 'blur(12px)' }
  const input: React.CSSProperties = { width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(200,180,255,0.15)', borderRadius: '0.75rem', padding: '0.75rem 1rem', color: 'rgba(220,200,255,0.9)', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit' }

  return (
    <div style={{ maxWidth: '520px', margin: '0 auto', padding: '1.5rem 1rem 2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
        <div>
          <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.8rem', color: 'rgba(220,200,255,0.95)', margin: '0 0 0.25rem', fontWeight: 400 }}>Vision Board</h1>
          <p style={{ color: 'rgba(180,160,255,0.5)', fontSize: '0.8rem', margin: 0 }}>Manifest your cosmic intentions</p>
        </div>
        <button onClick={() => setMode(mode === 'add' ? 'view' : 'add')} style={{ padding: '0.5rem 1rem', borderRadius: '2rem', border: '1px solid rgba(201,168,76,0.4)', background: mode === 'add' ? 'rgba(244,114,182,0.15)' : 'rgba(201,168,76,0.15)', color: mode === 'add' ? '#f472b6' : '#c9a84c', fontSize: '0.8rem', cursor: 'pointer' }}>{mode === 'add' ? '✕ Cancel' : '+ Add'}</button>
      </div>

      {/* Add panel */}
      {mode === 'add' && (
        <div style={{ ...card, padding: '1.25rem', marginBottom: '1.25rem' }}>
          {/* Type selector */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '0.4rem', marginBottom: '1rem' }}>
            {([['intention','🌟','Intention'],['affirmation','💫','Affirmation'],['number','✦','Number'],['image','🖼️','Image']] as const).map(([t,e,l]) => (
              <button key={t} onClick={() => setAddType(t)} style={{ padding: '0.5rem 0.25rem', borderRadius: '0.75rem', border: addType===t ? '1px solid rgba(201,168,76,0.6)' : '1px solid rgba(200,180,255,0.1)', background: addType===t ? 'rgba(201,168,76,0.15)' : 'rgba(8,6,28,0.5)', color: addType===t ? '#c9a84c' : 'rgba(180,160,255,0.4)', fontSize: '0.65rem', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.2rem' }}>
                <span style={{ fontSize: '1rem' }}>{e}</span>{l}
              </button>
            ))}
          </div>

          {addType === 'image' ? (
            <div>
              <input ref={fileRef} type="file" accept="image/*" onChange={handleImage} style={{ display: 'none' }} />
              <input placeholder="Label (optional)" value={label} onChange={e => setLabel(e.target.value)} style={{ ...input, marginBottom: '0.75rem' }} />
              <button onClick={() => fileRef.current?.click()} style={{ width: '100%', padding: '2rem', borderRadius: '0.875rem', border: '2px dashed rgba(201,168,76,0.3)', background: 'rgba(201,168,76,0.05)', color: '#c9a84c', fontSize: '0.85rem', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ fontSize: '2rem' }}>🖼️</span>
                Tap to upload an image
              </button>
            </div>
          ) : (
            <div>
              {addType === 'intention' && (
                <div style={{ marginBottom: '0.75rem' }}>
                  <div style={{ color: 'rgba(180,160,255,0.4)', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.5rem' }}>Quick templates</div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
                    {INTENTION_TEMPLATES.map(t => (
                      <button key={t} onClick={() => { setText(t); setSelectedTemplate(t) }} style={{ padding: '0.3rem 0.625rem', borderRadius: '2rem', border: selectedTemplate===t ? '1px solid rgba(201,168,76,0.5)' : '1px solid rgba(200,180,255,0.1)', background: selectedTemplate===t ? 'rgba(201,168,76,0.12)' : 'rgba(8,6,28,0.5)', color: selectedTemplate===t ? '#c9a84c' : 'rgba(180,160,255,0.45)', fontSize: '0.68rem', cursor: 'pointer' }}>{t}</button>
                    ))}
                  </div>
                </div>
              )}
              <input placeholder={addType === 'number' ? 'Angel number (e.g. 1111)' : 'Your intention...'} value={text} onChange={e => setText(e.target.value)} style={{ ...input, marginBottom: '0.625rem' }} />
              <input placeholder="Label (optional)" value={label} onChange={e => setLabel(e.target.value)} style={{ ...input, marginBottom: '0.75rem' }} />
              <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '0.875rem' }}>
                {COLORS.map(c => (
                  <button key={c} onClick={() => setColor(c)} style={{ width: '24px', height: '24px', borderRadius: '50%', background: c, border: color===c ? '2px solid white' : '2px solid transparent', cursor: 'pointer', flexShrink: 0 }} />
                ))}
              </div>
              <button onClick={() => addItem(text, addType)} disabled={!text.trim()} style={{ width: '100%', padding: '0.75rem', borderRadius: '0.875rem', border: '1px solid rgba(201,168,76,0.4)', background: 'rgba(201,168,76,0.15)', color: '#c9a84c', fontSize: '0.85rem', cursor: text.trim() ? 'pointer' : 'not-allowed', opacity: text.trim() ? 1 : 0.4 }}>✦ Add to Board</button>
            </div>
          )}
        </div>
      )}

      {/* Board grid */}
      {items.length === 0 ? (
        <div style={{ ...card, padding: '3rem 1.5rem', textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🌟</div>
          <div style={{ color: 'rgba(220,200,255,0.7)', fontFamily: 'Cormorant Garamond, serif', fontSize: '1.2rem', marginBottom: '0.5rem' }}>Your vision board awaits</div>
          <div style={{ color: 'rgba(180,160,255,0.4)', fontSize: '0.8rem', lineHeight: 1.6 }}>Add intentions, angel numbers, affirmations, and images to manifest your dreams</div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: '0.75rem' }}>
          {items.map(item => (
            <div key={item.id} style={{ ...card, padding: '1rem', borderColor: item.color + '25', background: item.color + '08', position: 'relative', minHeight: '120px', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
              <button onClick={() => removeItem(item.id)} style={{ position: 'absolute', top: '0.4rem', right: '0.4rem', background: 'rgba(244,114,182,0.15)', border: '1px solid rgba(244,114,182,0.2)', borderRadius: '50%', width: '20px', height: '20px', color: '#f472b6', fontSize: '0.6rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', lineHeight: 1 }}>✕</button>
              {item.type === 'image' ? (
                <img src={item.content} alt={item.label} style={{ width: '100%', height: '120px', objectFit: 'cover', borderRadius: '0.625rem', marginBottom: '0.5rem' }} />
              ) : item.type === 'number' ? (
                <div style={{ color: item.color, fontSize: '2rem', fontWeight: 700, fontFamily: 'Cormorant Garamond, serif', textShadow: '0 0 20px ' + item.color + '60', marginBottom: '0.25rem' }}>{item.content}</div>
              ) : (
                <div style={{ color: 'rgba(220,200,255,0.85)', fontSize: '0.8rem', lineHeight: 1.5, fontFamily: 'Cormorant Garamond, serif', fontStyle: 'italic', marginBottom: '0.25rem' }}>{item.content}</div>
              )}
              <div style={{ color: item.color, fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.1em', opacity: 0.7 }}>{item.label}</div>
            </div>
          ))}
        </div>
      )}

      {items.length > 0 && (
        <div style={{ textAlign: 'center', marginTop: '1.25rem', color: 'rgba(180,160,255,0.3)', fontSize: '0.72rem' }}>{items.length} intention{items.length !== 1 ? 's' : ''} on your board</div>
      )}
    </div>
  )
}
