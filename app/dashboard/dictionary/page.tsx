'use client'
import { useState } from 'react'
import { ANGEL_MEANINGS } from '@/lib/angel-meanings'
import { getAngelMeaning } from '@/lib/angel-meanings'

const ALL_NUMBERS = [
  '000','111','222','333','444','555','666','777','888','999',
  '1010','1111','1212','1234','2222','3333','4444','5555',
  '1122','1133','1144','1155','1166','1177','1188','1199',
  '2211','2233','2244','3311','3322','4411','4422','5511',
]

export default function DictionaryPage() {
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<string | null>(null)

  const filtered = ALL_NUMBERS.filter(n => n.includes(search.trim()))
  const meaning = selected ? getAngelMeaning(selected) : null
  const card = { background: 'rgba(8,6,28,0.88)', border: '1px solid rgba(200,180,255,0.12)', borderRadius: '1.25rem', backdropFilter: 'blur(12px)' } as React.CSSProperties

  return (
    <div style={{ maxWidth: '640px', margin: '0 auto', padding: '1.5rem 1rem 2rem' }}>
      <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.8rem', color: 'rgba(220,200,255,0.95)', margin: '0 0 0.25rem', fontWeight: 400 }}>Angel Number Dictionary</h1>
      <p style={{ color: 'rgba(180,160,255,0.5)', fontSize: '0.8rem', margin: '0 0 1.25rem' }}>The complete guide to angel number meanings</p>

      <input
        value={search}
        onChange={e => setSearch(e.target.value)}
        placeholder="Search any number (e.g. 444, 1111)..."
        style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(200,180,255,0.15)', borderRadius: '0.875rem', padding: '0.75rem 1rem', color: 'rgba(220,200,255,0.9)', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box', marginBottom: '1.25rem' }}
      />

      {selected && meaning && (
        <div style={{ ...card, padding: '1.5rem', marginBottom: '1.25rem', borderColor: `${meaning.color}33` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <div style={{ width: '3rem', height: '3rem', borderRadius: '50%', background: `${meaning.color}22`, border: `1px solid ${meaning.color}44`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <span style={{ color: meaning.color, fontSize: '1rem', fontWeight: 700 }}>{selected}</span>
            </div>
            <div>
              <div style={{ color: meaning.color, fontSize: '1.1rem', fontFamily: 'Cormorant Garamond, serif', fontWeight: 600 }}>{meaning.title}</div>
              <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginTop: '0.3rem' }}>
                {meaning.keywords.map((k: string) => (
                  <span key={k} style={{ background: `${meaning.color}15`, border: `1px solid ${meaning.color}30`, borderRadius: '2rem', padding: '0.15rem 0.5rem', fontSize: '0.65rem', color: meaning.color }}>{k}</span>
                ))}
              </div>
            </div>
            <button onClick={() => setSelected(null)} style={{ marginLeft: 'auto', background: 'none', border: 'none', color: 'rgba(180,160,255,0.4)', cursor: 'pointer', fontSize: '1.2rem' }}>&times;</button>
          </div>
          <p style={{ color: 'rgba(200,180,255,0.75)', fontSize: '0.88rem', lineHeight: 1.65, margin: 0 }}>{meaning.message}</p>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem' }}>
        {filtered.map(n => {
          const m = getAngelMeaning(n)
          return (
            <button
              key={n}
              onClick={() => setSelected(n === selected ? null : n)}
              style={{
                background: selected === n ? `${m.color}18` : 'rgba(8,6,28,0.7)',
                border: `1px solid ${selected === n ? m.color + '55' : 'rgba(200,180,255,0.1)'}`,
                borderRadius: '0.875rem', padding: '0.75rem 0.5rem', cursor: 'pointer',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.3rem',
                transition: 'all 0.2s',
              }}
            >
              <span style={{ color: m.color, fontSize: '0.95rem', fontWeight: 700 }}>{n}</span>
              <span style={{ color: 'rgba(180,160,255,0.45)', fontSize: '0.58rem', textAlign: 'center', lineHeight: 1.2 }}>{m.title.split(' ').slice(0,2).join(' ')}</span>
            </button>
          )
        })}
      </div>

      {filtered.length === 0 && search && (
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <p style={{ color: 'rgba(180,160,255,0.5)', fontSize: '0.85rem', marginBottom: '0.75rem' }}>No exact match. Showing reading for {search}:</p>
          <button onClick={() => setSelected(search)} style={{ padding: '0.6rem 1.5rem', borderRadius: '2rem', background: 'rgba(167,139,250,0.15)', border: '1px solid rgba(167,139,250,0.3)', color: '#a78bfa', fontSize: '0.85rem', cursor: 'pointer' }}>Get Reading for {search}</button>
        </div>
      )}
    </div>
  )
}
