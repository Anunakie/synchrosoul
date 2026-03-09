'use client'
import { useState } from 'react'
import { ANGEL_MEANINGS } from '@/lib/angel-meanings'

const CATEGORIES = [
  { id: 'all', label: 'All' },
  { id: 'triple', label: 'Triple' },
  { id: 'quad', label: 'Quad' },
  { id: 'sequence', label: 'Sequence' },
  { id: 'master', label: 'Master' },
]

function getCategory(num: string) {
  if (['11','22','33','44','55','66','77','88','99'].includes(num)) return 'master'
  if (num.length === 4 && new Set(num.split('')).size === 1) return 'quad'
  if (num.length === 3 && new Set(num.split('')).size === 1) return 'triple'
  if (['1234','1111','1212','1221','1234','2222','3333','4444','5555','6666','7777','8888','9999'].includes(num)) return 'quad'
  return 'sequence'
}

export default function DictionaryPage() {
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('all')
  const [expanded, setExpanded] = useState<string | null>(null)

  const entries = Object.entries(ANGEL_MEANINGS)
  const filtered = entries.filter(([num, m]) => {
    const matchSearch = !search || num.includes(search) || m.title.toLowerCase().includes(search.toLowerCase()) || m.keywords?.some((k: string) => k.toLowerCase().includes(search.toLowerCase()))
    const matchCat = category === 'all' || getCategory(num) === category
    return matchSearch && matchCat
  })

  return (
    <div style={{ maxWidth: '560px', margin: '0 auto', padding: '1.5rem 1rem 2rem' }}>
      <div style={{ marginBottom: '1.25rem' }}>
        <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.8rem', color: 'rgba(220,200,255,0.95)', margin: '0 0 0.25rem', fontWeight: 400 }}>Angel Number Dictionary</h1>
        <p style={{ color: 'rgba(180,160,255,0.5)', fontSize: '0.8rem', margin: 0 }}>Complete guide to angel number meanings</p>
      </div>

      {/* Search */}
      <input
        value={search} onChange={e => setSearch(e.target.value)}
        placeholder='Search numbers or meanings...'
        style={{ width: '100%', padding: '0.875rem 1rem', background: 'rgba(8,6,28,0.88)', border: '1px solid rgba(200,180,255,0.15)', borderRadius: '0.875rem', color: 'rgba(220,200,255,0.9)', fontSize: '0.88rem', outline: 'none', boxSizing: 'border-box', marginBottom: '0.875rem' }}
      />

      {/* Category filter */}
      <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '1.25rem', overflowX: 'auto', paddingBottom: '0.25rem' }}>
        {CATEGORIES.map(c => (
          <button key={c.id} onClick={() => setCategory(c.id)} style={{ padding: '0.35rem 0.875rem', borderRadius: '9999px', border: category === c.id ? '1px solid rgba(167,139,250,0.5)' : '1px solid rgba(200,180,255,0.1)', background: category === c.id ? 'rgba(167,139,250,0.15)' : 'rgba(8,6,28,0.7)', color: category === c.id ? '#a78bfa' : 'rgba(180,160,255,0.45)', fontSize: '0.75rem', cursor: 'pointer', whiteSpace: 'nowrap', transition: 'all 0.2s' }}>{c.label}</button>
        ))}
      </div>

      <div style={{ color: 'rgba(180,160,255,0.3)', fontSize: '0.72rem', marginBottom: '0.875rem' }}>{filtered.length} numbers</div>

      {/* Entries */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {filtered.map(([num, m]) => (
          <div key={num} style={{ background: 'rgba(8,6,28,0.88)', border: expanded === num ? '1px solid ' + m.color + '40' : '1px solid rgba(200,180,255,0.1)', borderRadius: '1rem', overflow: 'hidden', transition: 'border 0.2s', backdropFilter: 'blur(12px)' }}>
            <button onClick={() => setExpanded(expanded === num ? null : num)} style={{ width: '100%', padding: '0.875rem 1rem', background: 'none', border: 'none', display: 'flex', alignItems: 'center', gap: '0.875rem', cursor: 'pointer', textAlign: 'left' }}>
              <div style={{ width: '3rem', height: '3rem', borderRadius: '0.75rem', background: m.color + '15', border: '1px solid ' + m.color + '25', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <span style={{ color: m.color, fontSize: '0.9rem', fontWeight: 700 }}>{num}</span>
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ color: 'rgba(220,200,255,0.88)', fontSize: '0.88rem', fontWeight: 500, marginBottom: '0.15rem' }}>{m.title}</div>
                <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                  {m.keywords?.slice(0,3).map((k: string) => (
                    <span key={k} style={{ background: m.color + '12', border: '1px solid ' + m.color + '20', borderRadius: '9999px', padding: '0.1rem 0.5rem', color: m.color, fontSize: '0.62rem', opacity: 0.8 }}>{k}</span>
                  ))}
                </div>
              </div>
              <span style={{ color: 'rgba(180,160,255,0.3)', fontSize: '0.75rem', transform: expanded === num ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s', flexShrink: 0 }}>▾</span>
            </button>
            {expanded === num && (
              <div style={{ padding: '0 1rem 1rem' }}>
                <div style={{ height: '1px', background: m.color + '15', marginBottom: '0.875rem' }} />
                <p style={{ color: 'rgba(200,180,255,0.65)', fontSize: '0.83rem', lineHeight: 1.7, margin: '0 0 0.875rem' }}>{m.message}</p>
                {m.keywords && (
                  <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                    {m.keywords.map((k: string) => (
                      <span key={k} style={{ background: m.color + '10', border: '1px solid ' + m.color + '20', borderRadius: '9999px', padding: '0.2rem 0.625rem', color: m.color, fontSize: '0.7rem' }}>{k}</span>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
