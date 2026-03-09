'use client'
import { useState, useMemo } from 'react'
import Link from 'next/link'

const ALL_PAGES = [
  // Numerology
  { href:'/dashboard/numerology-deep', label:'Deep Numerology', emoji:'🧮', category:'Numerology', tags:['life path','soul urge','destiny','expression','personality','maturity','numerology','numbers','calculate'] },
  { href:'/dashboard/personal-year', label:'Personal Year', emoji:'📅', category:'Numerology', tags:['personal year','cycle','energy','forecast','yearly'] },
  { href:'/dashboard/karmic-debt', label:'Karmic Debt', emoji:'⚖️', category:'Numerology', tags:['karma','karmic','debt','past life','lessons','soul contract'] },
  { href:'/dashboard/compatibility', label:'Compatibility', emoji:'💞', category:'Numerology', tags:['compatibility','match','partner','relationship','numerology match'] },
  // Divination
  { href:'/dashboard/oracle', label:'Angel Oracle', emoji:'✦', category:'Divination', tags:['oracle','message','guidance','angels','channeled','reading'] },
  { href:'/dashboard/tarot', label:'Cosmic Tarot', emoji:'🃏', category:'Divination', tags:['tarot','cards','major arcana','reading','divination','spread'] },
  { href:'/dashboard/dictionary', label:'Number Dictionary', emoji:'📚', category:'Divination', tags:['dictionary','meaning','angel number','111','222','333','444','555','666','777','888','999','1111'] },
  { href:'/dashboard/moon', label:'Moon Phases', emoji:'🌙', category:'Divination', tags:['moon','lunar','full moon','new moon','phases','cycle','energy'] },
  // Tracking
  { href:'/dashboard/insights', label:'Insights', emoji:'📊', category:'Tracking', tags:['insights','patterns','analysis','data','trends','frequency'] },
  { href:'/dashboard/stats', label:'Statistics', emoji:'📈', category:'Tracking', tags:['stats','statistics','charts','activity','history','count'] },
  { href:'/dashboard/streak', label:'Streak Tracker', emoji:'🔥', category:'Tracking', tags:['streak','daily','consistency','habit','milestone','fire'] },
  { href:'/dashboard/calendar', label:'Cosmic Calendar', emoji:'🗓️', category:'Tracking', tags:['calendar','date','schedule','cosmic','monthly','daily'] },
  { href:'/dashboard/timeline', label:'Vision Timeline', emoji:'⏳', category:'Tracking', tags:['timeline','journey','history','vision','map','spiritual'] },
  { href:'/dashboard/synthesis', label:'Weekly Synthesis', emoji:'✺', category:'Tracking', tags:['synthesis','report','weekly','summary','cosmic','analysis'] },
  { href:'/dashboard/badges', label:'Badges', emoji:'🏅', category:'Tracking', tags:['badges','achievements','milestones','rewards','unlock','gamification'] },
  { href:'/dashboard/notifications', label:'Notifications', emoji:'🔔', category:'Tracking', tags:['notifications','alerts','updates','messages','reminders'] },
  // Healing
  { href:'/dashboard/meditations', label:'Meditations', emoji:'🧘', category:'Healing', tags:['meditation','guided','mindfulness','breathe','calm','peace','angel'] },
  { href:'/dashboard/breathwork', label:'Breathwork', emoji:'💨', category:'Healing', tags:['breathwork','breathing','pranayama','box breathing','4-7-8','calm','anxiety'] },
  { href:'/dashboard/solfeggio', label:'Solfeggio Frequencies', emoji:'🎵', category:'Healing', tags:['solfeggio','frequency','528hz','432hz','healing','sound','vibration','music'] },
  { href:'/dashboard/chakras', label:'Chakras', emoji:'🌈', category:'Healing', tags:['chakra','energy','root','sacral','solar','heart','throat','third eye','crown','alignment'] },
  { href:'/dashboard/crystals', label:'Crystal Guide', emoji:'💎', category:'Healing', tags:['crystals','gemstones','amethyst','rose quartz','citrine','healing','stones'] },
  { href:'/dashboard/rituals', label:'Rituals', emoji:'🕯️', category:'Healing', tags:['ritual','ceremony','candle','intention','sacred','practice','angel number'] },
  { href:'/dashboard/affirmations', label:'Affirmations', emoji:'💫', category:'Healing', tags:['affirmations','positive','mantra','daily','abundance','love','healing'] },
  // Journaling
  { href:'/dashboard/journal', label:'Thought Journal', emoji:'📖', category:'Journaling', tags:['journal','thoughts','log','angel number','entry','diary','private'] },
  { href:'/dashboard/dreams', label:'Dream Journal', emoji:'🌙', category:'Journaling', tags:['dreams','dream journal','symbols','interpretation','sleep','subconscious'] },
  { href:'/dashboard/gratitude', label:'Gratitude', emoji:'🙏', category:'Journaling', tags:['gratitude','thankful','appreciation','daily','practice','positive'] },
  { href:'/dashboard/manifestations', label:'Manifestations', emoji:'🌱', category:'Journaling', tags:['manifestation','law of attraction','intention','goals','desires','abundance'] },
  { href:'/dashboard/vision-board', label:'Vision Board', emoji:'🖼️', category:'Journaling', tags:['vision board','goals','dreams','visual','manifestation','future'] },
  // Community
  { href:'/dashboard/sync', label:'Live Sync', emoji:'⟳', category:'Community', tags:['sync','matching','live','real time','angel number','connect','souls'] },
  { href:'/dashboard/soul-twin', label:'Soul Twin', emoji:'👥', category:'Community', tags:['soul twin','twin flame','soulmate','compatibility','match','connection'] },
  { href:'/dashboard/feed', label:'Cosmic Feed', emoji:'✧', category:'Community', tags:['feed','posts','social','community','share','cosmic'] },
  { href:'/dashboard/circles', label:'Angel Circles', emoji:'⭕', category:'Community', tags:['circles','groups','community','private','spiritual','members'] },
  { href:'/dashboard/profile-card', label:'Profile Card', emoji:'🪪', category:'Community', tags:['profile card','share','identity','numerology','cosmic','card'] },
  // Account
  { href:'/dashboard/profile', label:'My Profile', emoji:'◎', category:'Account', tags:['profile','account','photo','bio','posts','numerology'] },
  { href:'/dashboard/onboarding', label:'Setup', emoji:'✦', category:'Account', tags:['setup','onboarding','start','configure','birthdate','name'] },
  { href:'/dashboard/settings', label:'Settings', emoji:'⚙️', category:'Account', tags:['settings','preferences','notifications','theme','account'] },
  { href:'/dashboard/upgrade', label:'Premium Upgrade', emoji:'⭐', category:'Account', tags:['upgrade','premium','pro','subscription','features','unlock'] },
]

const ANGEL_NUMBERS = [
  { number:'111', meaning:'New beginnings, manifestation portal, alignment', emoji:'✨' },
  { number:'222', meaning:'Balance, partnership, divine timing', emoji:'⚖️' },
  { number:'333', meaning:'Ascended masters, creativity, expansion', emoji:'🔺' },
  { number:'444', meaning:'Angels present, protection, solid foundation', emoji:'🛡️' },
  { number:'555', meaning:'Major change incoming, transformation', emoji:'🦋' },
  { number:'666', meaning:'Rebalance, home, nurturing energy', emoji:'🏠' },
  { number:'777', meaning:'Divine luck, spiritual awakening, magic', emoji:'🍀' },
  { number:'888', meaning:'Abundance, infinite flow, financial alignment', emoji:'♾️' },
  { number:'999', meaning:'Completion, endings, humanitarian calling', emoji:'🌅' },
  { number:'1010', meaning:'Spiritual growth, divine support, new chapter', emoji:'🌱' },
  { number:'1111', meaning:'Master manifestation, wake-up call, portal', emoji:'🌟' },
  { number:'1212', meaning:'Stay positive, divine path, cosmic order', emoji:'✦' },
  { number:'1234', meaning:'Steps forward, progression, building', emoji:'📶' },
  { number:'2222', meaning:'Deep alignment, patience, trust the process', emoji:'🕊️' },
  { number:'3333', meaning:'Trinity energy, mind body spirit', emoji:'🔱' },
  { number:'4444', meaning:'Powerful protection, angels surround you', emoji:'👼' },
  { number:'5555', meaning:'Massive transformation, life overhaul', emoji:'🌊' },
]

const CATEGORY_COLORS: Record<string,string> = {
  Numerology: '#a78bfa',
  Divination: '#c9a84c',
  Tracking: '#60a5fa',
  Healing: '#4ade80',
  Journaling: '#f472b6',
  Community: '#f97316',
  Account: '#818cf8',
}

export default function SearchPage() {
  const [query, setQuery] = useState('')
  const [activeCategory, setActiveCategory] = useState<string|null>(null)

  const filteredPages = useMemo(() => {
    const q = query.toLowerCase().trim()
    return ALL_PAGES.filter(p => {
      const matchesCategory = !activeCategory || p.category === activeCategory
      if (!q) return matchesCategory
      const matchesQuery = p.label.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q) ||
        p.tags.some(t => t.includes(q))
      return matchesCategory && matchesQuery
    })
  }, [query, activeCategory])

  const filteredNumbers = useMemo(() => {
    const q = query.toLowerCase().trim()
    if (!q || activeCategory) return []
    return ANGEL_NUMBERS.filter(n =>
      n.number.includes(q) || n.meaning.toLowerCase().includes(q)
    )
  }, [query, activeCategory])

  const categories = Array.from(new Set(ALL_PAGES.map(p => p.category)))
  const card: React.CSSProperties = { background:'rgba(8,6,28,0.88)', border:'1px solid rgba(200,180,255,0.1)', borderRadius:'1rem', backdropFilter:'blur(12px)' }

  return (
    <div style={{ maxWidth:'600px', margin:'0 auto', padding:'1.5rem 1rem 2rem' }}>
      <h1 style={{ fontFamily:'Cormorant Garamond,serif', fontSize:'1.8rem', color:'rgba(220,200,255,0.95)', margin:'0 0 0.25rem', fontWeight:400 }}>Search</h1>
      <p style={{ color:'rgba(180,160,255,0.5)', fontSize:'0.8rem', margin:'0 0 1.25rem' }}>Find features, angel numbers, and guidance</p>

      {/* Search input */}
      <div style={{ position:'relative', marginBottom:'1rem' }}>
        <span style={{ position:'absolute', left:'1rem', top:'50%', transform:'translateY(-50%)', fontSize:'1rem', opacity:0.4 }}>🔍</span>
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search features, numbers, topics..."
          autoFocus
          style={{
            width:'100%', boxSizing:'border-box',
            background:'rgba(8,6,28,0.9)', border:'1px solid rgba(200,180,255,0.2)',
            borderRadius:'0.875rem', padding:'0.875rem 1rem 0.875rem 2.75rem',
            color:'rgba(220,200,255,0.9)', fontSize:'0.95rem',
            outline:'none', backdropFilter:'blur(12px)',
          }}
        />
        {query && (
          <button onClick={() => setQuery('')} style={{ position:'absolute', right:'0.875rem', top:'50%', transform:'translateY(-50%)', background:'none', border:'none', color:'rgba(200,180,255,0.4)', cursor:'pointer', fontSize:'1rem', padding:'0.25rem' }}>✕</button>
        )}
      </div>

      {/* Category filters */}
      <div style={{ display:'flex', gap:'0.4rem', flexWrap:'wrap', marginBottom:'1.25rem' }}>
        <button
          onClick={() => setActiveCategory(null)}
          style={{ padding:'0.3rem 0.75rem', borderRadius:'9999px', fontSize:'0.7rem', textTransform:'uppercase', letterSpacing:'0.08em', cursor:'pointer', background: !activeCategory ? 'rgba(200,180,255,0.15)' : 'rgba(255,255,255,0.04)', border: !activeCategory ? '1px solid rgba(200,180,255,0.3)' : '1px solid rgba(255,255,255,0.08)', color: !activeCategory ? 'rgba(220,200,255,0.9)' : 'rgba(180,160,255,0.5)' }}
        >All</button>
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(activeCategory === cat ? null : cat)}
            style={{ padding:'0.3rem 0.75rem', borderRadius:'9999px', fontSize:'0.7rem', textTransform:'uppercase', letterSpacing:'0.08em', cursor:'pointer', background: activeCategory === cat ? CATEGORY_COLORS[cat]+'22' : 'rgba(255,255,255,0.04)', border: activeCategory === cat ? '1px solid '+CATEGORY_COLORS[cat]+'55' : '1px solid rgba(255,255,255,0.08)', color: activeCategory === cat ? CATEGORY_COLORS[cat] : 'rgba(180,160,255,0.5)' }}
          >{cat}</button>
        ))}
      </div>

      {/* Angel number results */}
      {filteredNumbers.length > 0 && (
        <div style={{ marginBottom:'1.5rem' }}>
          <div style={{ color:'rgba(201,168,76,0.6)', fontSize:'0.65rem', textTransform:'uppercase', letterSpacing:'0.12em', marginBottom:'0.6rem' }}>Angel Numbers</div>
          <div style={{ display:'flex', flexDirection:'column', gap:'0.4rem' }}>
            {filteredNumbers.map(n => (
              <Link key={n.number} href={'/dashboard/dictionary'} style={{ textDecoration:'none' }}>
                <div style={{ ...card, padding:'0.875rem 1rem', display:'flex', alignItems:'center', gap:'0.875rem' }}>
                  <div style={{ width:'3rem', height:'3rem', borderRadius:'0.75rem', background:'rgba(201,168,76,0.1)', border:'1px solid rgba(201,168,76,0.2)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.3rem', flexShrink:0 }}>{n.emoji}</div>
                  <div>
                    <div style={{ color:'rgba(201,168,76,0.9)', fontSize:'1rem', fontWeight:700, letterSpacing:'0.05em', marginBottom:'0.2rem' }}>{n.number}</div>
                    <div style={{ color:'rgba(180,160,255,0.55)', fontSize:'0.75rem', lineHeight:1.4 }}>{n.meaning}</div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Page results */}
      {!query && !activeCategory ? (
        // Show all categories when no search
        categories.map(cat => {
          const pages = ALL_PAGES.filter(p => p.category === cat)
          return (
            <div key={cat} style={{ marginBottom:'1.5rem' }}>
              <div style={{ display:'flex', alignItems:'center', gap:'0.5rem', marginBottom:'0.6rem' }}>
                <span style={{ color:CATEGORY_COLORS[cat], fontSize:'0.65rem', textTransform:'uppercase', letterSpacing:'0.12em' }}>{cat}</span>
                <div style={{ flex:1, height:'1px', background:'linear-gradient(90deg,'+CATEGORY_COLORS[cat]+'20,transparent)' }} />
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:'0.4rem' }}>
                {pages.map(p => (
                  <Link key={p.href} href={p.href} style={{ textDecoration:'none' }}>
                    <div style={{ ...card, padding:'0.75rem', display:'flex', alignItems:'center', gap:'0.625rem' }}>
                      <span style={{ fontSize:'1.2rem', flexShrink:0 }}>{p.emoji}</span>
                      <span style={{ color:'rgba(220,200,255,0.8)', fontSize:'0.8rem', fontWeight:500 }}>{p.label}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )
        })
      ) : (
        <div>
          <div style={{ color:'rgba(180,160,255,0.4)', fontSize:'0.65rem', textTransform:'uppercase', letterSpacing:'0.12em', marginBottom:'0.6rem' }}>
            {filteredPages.length} result{filteredPages.length !== 1 ? 's' : ''}
          </div>
          {filteredPages.length === 0 ? (
            <div style={{ ...card, padding:'2rem', textAlign:'center' }}>
              <div style={{ fontSize:'2rem', marginBottom:'0.75rem' }}>🔮</div>
              <div style={{ color:'rgba(180,160,255,0.5)', fontSize:'0.85rem' }}>No results found for "{query}"</div>
              <div style={{ color:'rgba(180,160,255,0.3)', fontSize:'0.75rem', marginTop:'0.5rem' }}>Try searching for a number, topic, or feature name</div>
            </div>
          ) : (
            <div style={{ display:'flex', flexDirection:'column', gap:'0.4rem' }}>
              {filteredPages.map(p => (
                <Link key={p.href} href={p.href} style={{ textDecoration:'none' }}>
                  <div style={{ ...card, padding:'0.875rem 1rem', display:'flex', alignItems:'center', gap:'0.875rem' }}>
                    <div style={{ width:'2.5rem', height:'2.5rem', borderRadius:'0.625rem', background:CATEGORY_COLORS[p.category]+'12', border:'1px solid '+CATEGORY_COLORS[p.category]+'20', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.1rem', flexShrink:0 }}>{p.emoji}</div>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ color:'rgba(220,200,255,0.85)', fontSize:'0.85rem', fontWeight:600 }}>{p.label}</div>
                      <div style={{ color:CATEGORY_COLORS[p.category], fontSize:'0.65rem', textTransform:'uppercase', letterSpacing:'0.08em', opacity:0.7, marginTop:'0.1rem' }}>{p.category}</div>
                    </div>
                    <span style={{ color:'rgba(200,180,255,0.2)', fontSize:'0.8rem' }}>›</span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
