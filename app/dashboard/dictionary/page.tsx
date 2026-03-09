'use client'
import { useState } from 'react'

const NUMBERS = [
  { n: '000', title: 'Infinite Potential', color: '#a78bfa', emoji: '∞', meaning: 'You are at the beginning of a spiritual cycle. The universe is reminding you that you are one with the infinite. A reset is occurring — trust the void.', keywords: ['infinity','reset','oneness','void','potential'], affirmation: 'I am infinite. I am whole. I am the universe experiencing itself.' },
  { n: '111', title: 'Manifestation Portal', color: '#c9a84c', emoji: '✦', meaning: 'Your thoughts are manifesting rapidly. This is a powerful gateway — focus only on what you want, not what you fear. The universe is listening intently.', keywords: ['manifestation','new beginnings','alignment','focus','intention'], affirmation: 'My thoughts create my reality. I choose thoughts of love and abundance.' },
  { n: '222', title: 'Divine Balance', color: '#60a5fa', emoji: '⚖', meaning: 'Trust the process. Everything is unfolding in divine timing. You are being asked to have faith and maintain balance in all areas of your life.', keywords: ['balance','faith','partnership','harmony','patience'], affirmation: 'I trust divine timing. Everything is working out for my highest good.' },
  { n: '333', title: 'Ascended Masters', color: '#f472b6', emoji: '△', meaning: 'The ascended masters are near, offering guidance and support. Your creative energy is at a peak. Express yourself authentically and joyfully.', keywords: ['creativity','guidance','expression','masters','joy'], affirmation: 'I am divinely guided and supported. My creativity flows freely.' },
  { n: '444', title: 'Angelic Protection', color: '#34d399', emoji: '◇', meaning: 'Your angels surround you with love and protection. You are on the right path. Build solid foundations — your hard work is being acknowledged.', keywords: ['protection','foundation','stability','angels','hard work'], affirmation: 'I am protected and supported by divine forces. My foundations are strong.' },
  { n: '555', title: 'Major Change', color: '#fb923c', emoji: '⟳', meaning: 'Significant transformation is coming. Release what no longer serves you and embrace the new. Change is not to be feared — it is your evolution.', keywords: ['change','transformation','freedom','adventure','release'], affirmation: 'I embrace change with grace. Every transformation leads me to my highest self.' },
  { n: '666', title: 'Rebalance Focus', color: '#e879f9', emoji: '☯', meaning: 'A gentle nudge to rebalance your thoughts — you may be overthinking or focusing too much on material concerns. Return to love, spirit, and inner peace.', keywords: ['balance','rebalance','material','spiritual','love'], affirmation: 'I release fear and return to love. I balance the material and spiritual.' },
  { n: '777', title: 'Divine Luck', color: '#fbbf24', emoji: '✧', meaning: 'You are in perfect alignment with the universe. Miracles are flowing to you. This is the most spiritually significant number — you are on the right path.', keywords: ['luck','miracles','alignment','spiritual','reward'], affirmation: 'I am in perfect alignment. Miracles flow to me naturally and easily.' },
  { n: '888', title: 'Infinite Abundance', color: '#4ade80', emoji: '∞', meaning: 'Financial and material abundance is flowing to you. The cycle of giving and receiving is in perfect balance. Prosperity in all forms is yours.', keywords: ['abundance','prosperity','wealth','cycles','karma'], affirmation: 'I am a magnet for abundance. Prosperity flows to me from all directions.' },
  { n: '999', title: 'Completion & Release', color: '#f87171', emoji: '◯', meaning: 'A major cycle is completing. Release the old with gratitude — it has served its purpose. A new, higher chapter is about to begin. Let go with love.', keywords: ['completion','endings','release','wisdom','new chapter'], affirmation: 'I release the old with gratitude. I welcome the new chapter with open arms.' },
  { n: '1010', title: 'Spiritual Awakening', color: '#818cf8', emoji: '☽', meaning: 'You are awakening to your true spiritual nature. Pay attention to your thoughts and feelings — they are guiding you toward your soul purpose.', keywords: ['awakening','purpose','intuition','growth','soul'], affirmation: 'I am awakening to my highest potential. My soul purpose is clear.' },
  { n: '1111', title: 'Twin Flame Portal', color: '#c9a84c', emoji: '||', meaning: 'The most powerful manifestation number. A twin flame or soulmate connection may be near. Make a wish — the universe is granting your deepest desires right now.', keywords: ['twin flame','soulmate','manifestation','wish','portal'], affirmation: 'I am ready to receive my deepest desires. Love and magic flow to me now.' },
  { n: '1212', title: 'Cosmic Alignment', color: '#67e8f9', emoji: '✦', meaning: 'You are in perfect cosmic alignment. Your positive thoughts and actions are creating a beautiful reality. Stay optimistic — you are exactly where you need to be.', keywords: ['alignment','optimism','reality','cosmic','positive'], affirmation: 'I am cosmically aligned. My positive energy creates a beautiful reality.' },
  { n: '1234', title: 'Step by Step', color: '#a3e635', emoji: '→', meaning: 'You are progressing perfectly, one step at a time. Trust the journey. Each step you take is building toward something magnificent. Keep moving forward.', keywords: ['progress','steps','journey','trust','forward'], affirmation: 'I trust my journey. Each step I take leads me closer to my dreams.' },
  { n: '2222', title: 'Deep Trust', color: '#60a5fa', emoji: '≈', meaning: 'An amplified call for trust and patience. Your manifestations are taking form behind the scenes. The universe is weaving everything together perfectly.', keywords: ['trust','patience','manifestation','behind scenes','weaving'], affirmation: 'I trust the unseen forces working on my behalf. All is well.' },
  { n: '3333', title: 'Creative Explosion', color: '#f472b6', emoji: '✺', meaning: 'Your creative and spiritual gifts are amplified. The Holy Trinity — mind, body, spirit — is in harmony. Express your truth boldly and without apology.', keywords: ['creativity','trinity','expression','gifts','harmony'], affirmation: 'My creative gifts are a blessing to the world. I express myself freely.' },
  { n: '4444', title: 'Fortress of Angels', color: '#34d399', emoji: '⬡', meaning: 'You are completely surrounded and protected by angels. This is a sign of extraordinary divine support. You are never alone — the angelic realm walks with you.', keywords: ['angels','protection','support','divine','fortress'], affirmation: 'I am completely protected and loved by the angelic realm.' },
  { n: '5555', title: 'Quantum Leap', color: '#fb923c', emoji: '⚡', meaning: 'A quantum leap in your evolution is occurring. Multiple areas of your life are transforming simultaneously. Buckle up — this is an extraordinary acceleration.', keywords: ['quantum leap','acceleration','evolution','transformation','multiple'], affirmation: 'I embrace my quantum leap. I evolve rapidly and gracefully.' },
  { n: '7777', title: 'Miracle Frequency', color: '#fbbf24', emoji: '★', meaning: 'You have reached the miracle frequency. Extraordinary synchronicities and blessings are flooding your life. You are a living example of divine grace.', keywords: ['miracles','synchronicity','blessings','grace','extraordinary'], affirmation: 'I live in miracle frequency. Extraordinary blessings are my natural state.' },
  { n: '8888', title: 'Karmic Harvest', color: '#4ade80', emoji: '⊕', meaning: 'You are reaping the karmic rewards of your past positive actions. Financial windfalls, opportunities, and blessings are arriving. Your generosity returns multiplied.', keywords: ['karma','harvest','reward','financial','generosity'], affirmation: 'I reap the abundant rewards of my positive karma. Blessings multiply for me.' },
  { n: '9999', title: 'Lightworker Calling', color: '#f87171', emoji: '☀', meaning: 'You are being called to your highest lightworker mission. Your spiritual gifts are needed in the world. Step into your power and serve humanity with love.', keywords: ['lightworker','mission','service','humanity','power'], affirmation: 'I answer my lightworker calling with courage and love.' },
  { n: '11', title: 'Master Intuition', color: '#c9a84c', emoji: '|', meaning: 'Master Number 11 — the most intuitive of all numbers. You are a spiritual messenger with heightened psychic abilities. Trust your inner knowing above all else.', keywords: ['master number','intuition','psychic','messenger','spiritual'], affirmation: 'I trust my powerful intuition. I am a clear channel for divine wisdom.' },
  { n: '22', title: 'Master Builder', color: '#60a5fa', emoji: '||', meaning: 'Master Number 22 — the Master Builder. You have the power to turn the most ambitious dreams into reality. Your potential to create lasting change is extraordinary.', keywords: ['master number','builder','dreams','reality','potential'], affirmation: 'I am a master builder. I create lasting positive change in the world.' },
  { n: '33', title: 'Master Teacher', color: '#f472b6', emoji: '|||', meaning: 'Master Number 33 — the Master Teacher. You are here to uplift humanity through compassion, healing, and unconditional love. Your presence heals others.', keywords: ['master number','teacher','compassion','healing','love'], affirmation: 'I am a master teacher. My love and wisdom uplift all who encounter me.' },
]

export default function DictionaryPage() {
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState<typeof NUMBERS[0] | null>(null)

  const filtered = NUMBERS.filter(n =>
    n.n.includes(search) ||
    n.title.toLowerCase().includes(search.toLowerCase()) ||
    n.keywords.some(k => k.includes(search.toLowerCase()))
  )

  const card = {
    background: 'rgba(8,6,28,0.88)', border: '1px solid rgba(200,180,255,0.12)',
    borderRadius: '1rem', backdropFilter: 'blur(12px)',
  } as React.CSSProperties

  return (
    <div style={{ maxWidth: '700px', margin: '0 auto', padding: '1.5rem 1rem 2rem' }}>
      <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.8rem', color: 'rgba(220,200,255,0.95)', margin: '0 0 0.25rem', fontWeight: 400 }}>Angel Number Dictionary</h1>
      <p style={{ color: 'rgba(180,160,255,0.5)', fontSize: '0.8rem', margin: '0 0 1.25rem' }}>The complete guide to angel number meanings</p>

      <input
        value={search} onChange={e => setSearch(e.target.value)}
        placeholder="Search numbers, meanings, keywords..."
        style={{
          width: '100%', padding: '0.75rem 1rem', borderRadius: '0.75rem', boxSizing: 'border-box',
          background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(200,180,255,0.15)',
          color: 'rgba(220,200,255,0.9)', fontSize: '0.9rem', outline: 'none', fontFamily: 'inherit',
          marginBottom: '1.25rem',
        }}
      />

      {/* Detail Modal */}
      {selected && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }} onClick={() => setSelected(null)}>
          <div style={{ ...card, padding: '2rem', maxWidth: '480px', width: '100%', position: 'relative' }} onClick={e => e.stopPropagation()}>
            <button onClick={() => setSelected(null)} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', color: 'rgba(200,180,255,0.5)', cursor: 'pointer', fontSize: '1.2rem' }}>✕</button>
            <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>{selected.emoji}</div>
            <div style={{ color: selected.color, fontSize: '2rem', fontFamily: 'Cormorant Garamond, serif', fontWeight: 600, marginBottom: '0.25rem' }}>{selected.n}</div>
            <div style={{ color: 'rgba(220,200,255,0.95)', fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem' }}>{selected.title}</div>
            <p style={{ color: 'rgba(200,180,255,0.75)', fontSize: '0.85rem', lineHeight: 1.7, marginBottom: '1rem' }}>{selected.meaning}</p>
            <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '0.75rem', padding: '1rem', marginBottom: '1rem' }}>
              <div style={{ color: 'rgba(180,160,255,0.5)', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>Affirmation</div>
              <p style={{ color: 'rgba(220,200,255,0.85)', fontSize: '0.85rem', fontStyle: 'italic', margin: 0 }}>“{selected.affirmation}”</p>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
              {selected.keywords.map(k => (
                <span key={k} style={{ padding: '0.2rem 0.6rem', borderRadius: '2rem', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(200,180,255,0.12)', color: 'rgba(180,160,255,0.7)', fontSize: '0.7rem' }}>{k}</span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '0.75rem' }}>
        {filtered.map(n => (
          <button key={n.n} onClick={() => setSelected(n)} style={{
            ...card, padding: '1.1rem 0.75rem', cursor: 'pointer', textAlign: 'center',
            border: `1px solid ${n.color}22`,
            transition: 'all 0.2s', fontFamily: 'inherit',
          }}>
            <div style={{ fontSize: '1.4rem', marginBottom: '0.3rem' }}>{n.emoji}</div>
            <div style={{ color: n.color, fontSize: '1.3rem', fontFamily: 'Cormorant Garamond, serif', fontWeight: 600 }}>{n.n}</div>
            <div style={{ color: 'rgba(200,180,255,0.7)', fontSize: '0.68rem', marginTop: '0.25rem', lineHeight: 1.3 }}>{n.title}</div>
          </button>
        ))}
      </div>

      {filtered.length === 0 && (
        <div style={{ ...card, padding: '2rem', textAlign: 'center', color: 'rgba(180,160,255,0.5)', fontSize: '0.85rem' }}>
          No numbers found for “{search}”
        </div>
      )}
    </div>
  )
}
