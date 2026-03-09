'use client'
import { useState } from 'react'

const NUMBERS: Record<string, { meaning: string; message: string; keywords: string[]; love: string; career: string; spiritual: string; color: string; emoji: string }> = {
  '000': { emoji: '⭕', color: '#94a3b8', meaning: 'Divine Reset', message: 'You are at the beginning of a spiritual cycle. The universe is offering you a clean slate. Infinite potential surrounds you.', keywords: ['infinity', 'reset', 'wholeness', 'potential', 'void'], love: 'A relationship may be ending to make space for something divinely aligned. Trust the cycle.', career: 'A complete reset in your career path is being divinely orchestrated. Surrender to the new.', spiritual: 'You are merging with the infinite. Meditate on emptiness and allow divine downloads.' },
  '111': { emoji: '✦', color: '#f59e0b', meaning: 'Manifestation Portal', message: 'Your thoughts are manifesting at lightning speed. Be intentional. What you focus on now becomes your reality.', keywords: ['manifestation', 'new beginnings', 'alignment', 'focus', 'creation'], love: 'A new romantic chapter is opening. Your thoughts about love are creating your experience right now.', career: 'New opportunities are manifesting. Your ideas have power — act on your inspired thoughts immediately.', spiritual: 'You are a powerful creator. The universe is saying yes to your intentions. Think only of what you want.' },
  '1111': { emoji: '✦✦', color: '#c9a84c', meaning: 'Awakening Code', message: 'The most powerful angel number. A direct message that you are awakening to your true nature. You are exactly where you need to be.', keywords: ['awakening', 'divine alignment', 'portal', 'synchronicity', 'purpose'], love: 'Your twin flame or soulmate is near. This is a sign of profound romantic alignment and soul recognition.', career: 'You are being called to your soul purpose. The universe is aligning everything for your highest path.', spiritual: 'A spiritual portal is open. Make a wish. Set your highest intention. You are seen by the divine.' },
  '222': { emoji: '⟡', color: '#60a5fa', meaning: 'Divine Balance', message: 'Trust the process. Everything is unfolding in perfect divine timing. Have faith and maintain balance in all areas of life.', keywords: ['balance', 'trust', 'patience', 'harmony', 'partnership'], love: 'Your relationship is divinely guided. Trust the timing. If single, your person is being prepared for you.', career: 'Partnerships and collaborations are blessed right now. Trust the process — your efforts are working.', spiritual: 'The universe asks you to trust. Surrender control and allow divine order to work through you.' },
  '333': { emoji: '△', color: '#a78bfa', meaning: 'Ascended Masters', message: 'The ascended masters — Jesus, Buddha, Quan Yin — are with you. You are divinely supported, protected, and guided.', keywords: ['masters', 'creativity', 'growth', 'support', 'expression'], love: 'The ascended masters bless your love life. Express your feelings openly — divine support surrounds your heart.', career: 'Your creative gifts are needed. The masters support your self-expression and authentic work in the world.', spiritual: 'Call on the ascended masters directly. They are listening. You are never alone on your path.' },
  '444': { emoji: '◈', color: '#34d399', meaning: 'Angelic Protection', message: 'Your angels are surrounding you right now. You are completely protected, loved, and supported. All is well.', keywords: ['protection', 'angels', 'stability', 'foundation', 'safety'], love: 'Your angels are protecting your heart. A stable, grounded love is either present or coming to you.', career: 'You are building on solid foundations. Your angels support your work. Keep going — you are on the right path.', spiritual: 'Your angels are physically present with you right now. Feel their warmth. Ask them for help directly.' },
  '555': { emoji: '✺', color: '#f97316', meaning: 'Major Change', message: 'Massive transformation is underway. Release the old and embrace the new. This change is divinely orchestrated for your highest good.', keywords: ['change', 'transformation', 'freedom', 'adventure', 'release'], love: 'A significant shift in your love life is coming. Release what no longer serves and welcome the new.', career: 'A major career change or opportunity is approaching. Be open to unexpected shifts — they are blessings.', spiritual: 'You are shedding an old identity. The caterpillar phase is ending. Your wings are forming.' },
  '666': { emoji: '⬡', color: '#f472b6', meaning: 'Rebalance', message: 'Refocus from material concerns to spiritual truth. You may be overthinking or worrying. Return to love and trust.', keywords: ['balance', 'home', 'nurturing', 'rebalance', 'love'], love: 'Nurture your relationships. Show up with love and presence. Home and family are highlighted.', career: 'Rebalance your work and personal life. You may be overworking or neglecting your wellbeing.', spiritual: 'Release fear-based thinking. Return to love. Your thoughts create your reality — choose love.' },
  '777': { emoji: '✶', color: '#818cf8', meaning: 'Divine Magic', message: 'You are in perfect alignment with the universe. Magic is real and it is happening in your life right now. Trust your intuition completely.', keywords: ['luck', 'magic', 'intuition', 'wisdom', 'alignment'], love: 'Magical, fated love is in your field. Trust your intuition about romantic connections — it is always right.', career: 'You are in a lucky streak. Your intuition about career moves is spot on. Trust your inner knowing.', spiritual: 'You have reached a high level of spiritual alignment. Your psychic gifts are opening. Trust everything.' },
  '888': { emoji: '∞', color: '#c9a84c', meaning: 'Infinite Abundance', message: 'Abundance in all forms is flowing to you. Financial blessings, opportunities, and infinite possibilities are opening up.', keywords: ['abundance', 'infinity', 'prosperity', 'success', 'flow'], love: 'An abundant, generous love is coming or deepening. Relationships are entering a prosperous new phase.', career: 'Financial abundance and career success are flowing to you. Expect raises, opportunities, and windfalls.', spiritual: 'You are aligned with the infinite flow of the universe. Abundance is your natural state. Receive it.' },
  '999': { emoji: '◉', color: '#e879f9', meaning: 'Divine Completion', message: 'A major life chapter is completing. Release the old with gratitude. Your soul has graduated to the next level.', keywords: ['completion', 'endings', 'release', 'graduation', 'wisdom'], love: 'A relationship cycle is completing. Whether it ends or transforms, it is for your highest good.', career: 'A career chapter is ending to make way for your true calling. Trust the completion.', spiritual: 'You are completing a major soul contract. Forgive, release, and step into your next level of being.' },
  '1010': { emoji: '◎', color: '#67e8f9', meaning: 'Divine Support', message: 'God and your angels are with you. You are on the right path. Keep going with faith and trust.', keywords: ['faith', 'divine support', 'path', 'trust', 'encouragement'], love: 'Divine forces are supporting your love journey. Have faith in the process.', career: 'You are divinely supported in your career. Keep taking inspired action.', spiritual: 'The divine is actively supporting your spiritual growth. You are not alone.' },
  '1212': { emoji: '✧', color: '#a78bfa', meaning: 'Spiritual Growth', message: 'You are stepping into a higher version of yourself. Your spiritual gifts are awakening rapidly.', keywords: ['growth', 'awakening', 'higher self', 'evolution', 'gifts'], love: 'Your relationships are evolving to a higher vibration. Soul-level connections are deepening.', career: 'Your unique spiritual gifts are your greatest career asset. Step into your authentic expression.', spiritual: 'A rapid spiritual awakening is underway. Embrace the changes — you are becoming your highest self.' },
  '1234': { emoji: '→', color: '#34d399', meaning: 'Step by Step', message: 'You are on the right path and making steady progress. Trust the journey — each step is perfectly ordered.', keywords: ['progress', 'steps', 'journey', 'order', 'forward'], love: 'Your love story is unfolding step by step in perfect order. Trust the pace.', career: 'Take things one step at a time. Your career is progressing exactly as it should.', spiritual: 'Your spiritual journey is unfolding in perfect divine order. Trust each step.' },
  '2222': { emoji: '⟡⟡', color: '#60a5fa', meaning: 'Deep Trust', message: 'The universe is asking for your deepest trust. Everything is working out better than you can imagine.', keywords: ['deep trust', 'faith', 'divine plan', 'patience', 'surrender'], love: 'Trust the divine timing of your love story completely. It is more beautiful than you know.', career: 'Have deep faith in your career path. The universe is orchestrating something magnificent.', spiritual: 'Surrender completely to the divine plan. Your highest good is being served in ways you cannot yet see.' },
  '3333': { emoji: '△△', color: '#a78bfa', meaning: 'Amplified Creativity', message: 'Your creative and spiritual gifts are at their peak. Express yourself fully — the world needs your unique light.', keywords: ['creativity', 'expression', 'gifts', 'amplification', 'joy'], love: 'Express your love freely and joyfully. Creative, playful energy brings romance alive.', career: 'Your creative gifts are your superpower right now. Share them boldly with the world.', spiritual: 'The ascended masters are amplifying your spiritual gifts. You are a channel for divine creativity.' },
  '4444': { emoji: '◈◈', color: '#34d399', meaning: 'Fortress of Angels', message: 'You are surrounded by an army of angels. Complete protection, love, and support on all sides.', keywords: ['protection', 'fortress', 'angels', 'complete safety', 'love'], love: 'Your love life is completely protected by angelic forces. Trust and feel safe.', career: 'Your work is divinely protected. Move forward with complete confidence.', spiritual: 'You are in a sacred angelic fortress. Nothing can harm you. You are completely held.' },
  '5555': { emoji: '✺✺', color: '#f97316', meaning: 'Quantum Leap', message: 'A quantum leap in your life is happening. Massive, rapid transformation across all areas simultaneously.', keywords: ['quantum leap', 'rapid change', 'transformation', 'acceleration', 'breakthrough'], love: 'A quantum shift in your love life is imminent. Prepare for rapid, beautiful change.', career: 'A quantum career leap is happening. Rapid advancement and unexpected opportunities are coming.', spiritual: 'You are experiencing a quantum spiritual leap. Your vibration is rising rapidly.' },
  '7777': { emoji: '✶✶', color: '#818cf8', meaning: 'Miracle Frequency', message: 'You are vibrating at the frequency of miracles. Expect the unexpected. Magic is your new normal.', keywords: ['miracles', 'magic', 'frequency', 'luck', 'wonder'], love: 'A miraculous love story is unfolding. Expect the unexpected in the most beautiful way.', career: 'You are in a miracle frequency for career success. Extraordinary opportunities are manifesting.', spiritual: 'You have reached the miracle frequency. Your prayers are being answered in miraculous ways.' },
}

const ALL_NUMBERS = Object.keys(NUMBERS).sort((a, b) => parseInt(a) - parseInt(b))

export default function DictionaryPage() {
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<string | null>(null)
  const [tab, setTab] = useState<'meaning' | 'love' | 'career' | 'spiritual'>('meaning')

  const filtered = ALL_NUMBERS.filter(n =>
    n.includes(search) ||
    NUMBERS[n].meaning.toLowerCase().includes(search.toLowerCase()) ||
    NUMBERS[n].keywords.some(k => k.includes(search.toLowerCase()))
  )

  const selectedData = selected ? NUMBERS[selected] : null
  const card = { background: 'rgba(8,6,28,0.88)', border: '1px solid rgba(200,180,255,0.12)', borderRadius: '1.25rem', backdropFilter: 'blur(12px)' } as React.CSSProperties

  return (
    <div style={{ maxWidth: '680px', margin: '0 auto', padding: '1.5rem 1rem 2rem' }}>
      <div style={{ marginBottom: '1.25rem' }}>
        <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.8rem', color: 'rgba(220,200,255,0.95)', margin: '0 0 0.25rem', fontWeight: 400 }}>Angel Number Dictionary</h1>
        <p style={{ color: 'rgba(180,160,255,0.5)', fontSize: '0.8rem', margin: 0 }}>{ALL_NUMBERS.length} sacred numbers · Tap any to reveal its full message</p>
      </div>

      {/* Search */}
      <div style={{ position: 'relative', marginBottom: '1.25rem' }}>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search numbers or meanings..." style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(200,180,255,0.15)', borderRadius: '0.875rem', padding: '0.75rem 1rem 0.75rem 2.5rem', color: 'rgba(220,200,255,0.9)', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' }} />
        <span style={{ position: 'absolute', left: '0.875rem', top: '50%', transform: 'translateY(-50%)', color: 'rgba(180,160,255,0.35)', fontSize: '0.9rem' }}>✦</span>
      </div>

      {/* Selected number detail */}
      {selected && selectedData && (
        <div style={{ ...card, padding: '1.5rem', marginBottom: '1.25rem', borderColor: `${selectedData.color}44` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
            <div style={{ width: '3.5rem', height: '3.5rem', borderRadius: '1rem', background: `${selectedData.color}18`, border: `1px solid ${selectedData.color}44`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem' }}>{selectedData.emoji}</div>
            <div>
              <div style={{ color: selectedData.color, fontSize: '1.5rem', fontWeight: 700, fontFamily: 'Cormorant Garamond, serif' }}>{selected}</div>
              <div style={{ color: 'rgba(220,200,255,0.7)', fontSize: '0.85rem' }}>{selectedData.meaning}</div>
            </div>
            <button onClick={() => setSelected(null)} style={{ marginLeft: 'auto', background: 'none', border: 'none', color: 'rgba(180,160,255,0.3)', cursor: 'pointer', fontSize: '1rem' }}>✕</button>
          </div>

          {/* Tabs */}
          <div style={{ display: 'flex', gap: '0.35rem', marginBottom: '1rem', overflowX: 'auto' }}>
            {(['meaning','love','career','spiritual'] as const).map(t => (
              <button key={t} onClick={() => setTab(t)} style={{ flexShrink: 0, padding: '0.3rem 0.75rem', borderRadius: '2rem', border: tab === t ? `1px solid ${selectedData.color}66` : '1px solid rgba(200,180,255,0.1)', background: tab === t ? `${selectedData.color}18` : 'rgba(8,6,28,0.7)', color: tab === t ? selectedData.color : 'rgba(180,160,255,0.45)', fontSize: '0.72rem', cursor: 'pointer', textTransform: 'capitalize' }}>{t}</button>
            ))}
          </div>

          <p style={{ color: 'rgba(200,180,255,0.8)', fontSize: '0.9rem', margin: '0 0 1rem', lineHeight: 1.7, fontStyle: 'italic', fontFamily: 'Cormorant Garamond, serif' }}>&ldquo;{selectedData[tab]}&rdquo;</p>

          <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
            {selectedData.keywords.map(k => <span key={k} style={{ padding: '0.2rem 0.5rem', borderRadius: '2rem', background: `${selectedData.color}10`, border: `1px solid ${selectedData.color}22`, color: selectedData.color, fontSize: '0.68rem' }}>{k}</span>)}
          </div>
        </div>
      )}

      {/* Number grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '0.625rem' }}>
        {filtered.map(n => {
          const d = NUMBERS[n]
          const isSelected = selected === n
          return (
            <div key={n} onClick={() => { setSelected(isSelected ? null : n); setTab('meaning') }} style={{ ...card, padding: '1rem', cursor: 'pointer', borderColor: isSelected ? `${d.color}55` : 'rgba(200,180,255,0.1)', background: isSelected ? `${d.color}10` : 'rgba(8,6,28,0.88)', transition: 'all 0.2s' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
                <span style={{ fontSize: '1rem' }}>{d.emoji}</span>
                <span style={{ color: d.color, fontSize: '1rem', fontWeight: 700 }}>{n}</span>
              </div>
              <div style={{ color: 'rgba(200,180,255,0.7)', fontSize: '0.72rem', fontWeight: 600, marginBottom: '0.25rem' }}>{d.meaning}</div>
              <div style={{ color: 'rgba(180,160,255,0.35)', fontSize: '0.65rem', lineHeight: 1.4 }}>{d.keywords.slice(0,2).join(' · ')}</div>
            </div>
          )
        })}
      </div>

      {filtered.length === 0 && (
        <div style={{ ...card, padding: '2rem', textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>🔍</div>
          <p style={{ color: 'rgba(180,160,255,0.5)', fontSize: '0.85rem', margin: 0 }}>No numbers found for &ldquo;{search}&rdquo;</p>
        </div>
      )}
    </div>
  )
}
