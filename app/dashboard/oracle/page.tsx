'use client'
import { useState, useEffect } from 'react'

interface OracleCard {
  number: string
  title: string
  message: string
  guidance: string
  affirmation: string
  emoji: string
  color: string
  element: string
}

const ORACLE_CARDS: OracleCard[] = [
  { number: '111', title: 'The Awakening Gate', message: 'A portal of new beginnings opens before you. Your thoughts are seeds — plant only what you wish to grow.', guidance: 'This is a powerful manifestation window. Write down your deepest desire and speak it aloud three times at sunrise.', affirmation: 'I am a conscious creator. My thoughts shape my reality.', emoji: '🌟', color: '#fbbf24', element: 'Fire' },
  { number: '222', title: 'The Balance Point', message: 'Divine timing is at work. Trust the process even when you cannot see the full picture. Partnership and harmony are near.', guidance: 'Seek balance in all areas. Where have you been giving too much or too little? Restore equilibrium today.', affirmation: 'I trust divine timing. Everything unfolds perfectly for my highest good.', emoji: '⚖️', color: '#60a5fa', element: 'Air' },
  { number: '333', title: 'The Ascended Council', message: 'The masters of light surround you. Your creative gifts are needed in the world. Express yourself without fear.', guidance: 'Create something today — write, paint, sing, dance. The ascended masters amplify your creative energy now.', affirmation: 'I express my divine gifts freely. My creativity heals and inspires.', emoji: '🔺', color: '#a78bfa', element: 'Ether' },
  { number: '444', title: 'The Angel Shield', message: 'You are completely surrounded by angelic protection. The foundation you are building is blessed and solid.', guidance: 'Take the practical step you have been avoiding. Angels are holding the space for your success right now.', affirmation: 'I am divinely protected and guided. My foundation is strong and blessed.', emoji: '🏛️', color: '#34d399', element: 'Earth' },
  { number: '555', title: 'The Great Shift', message: 'Massive transformation is underway. Release what no longer serves you — the universe is clearing space for miracles.', guidance: 'Identify one thing to release today. Write it on paper and burn it, flush it, or bury it as a ritual of letting go.', affirmation: 'I embrace change with grace. Every ending births a magnificent new beginning.', emoji: '🌀', color: '#fb923c', element: 'Fire' },
  { number: '666', title: 'The Rebalancing', message: "Return to your spiritual center. Material concerns have pulled your focus — reconnect with your soul's true purpose.", guidance: 'Spend 20 minutes in nature today. Touch the earth, breathe deeply, and remember what truly matters to you.', affirmation: "I am more than my circumstances. My soul's wisdom guides every decision.", emoji: '🌿', color: '#86efac', element: 'Earth' },
  { number: '777', title: 'The Mystic Path', message: 'You are on the right path. Spiritual luck and divine synchronicity are flowing through your life in extraordinary ways.', guidance: 'Pay attention to every coincidence today — they are messages. Keep a synchronicity journal for the next 7 days.', affirmation: 'I am aligned with divine flow. Magic and miracles are my natural state.', emoji: '🔮', color: '#818cf8', element: 'Ether' },
  { number: '888', title: 'The Abundance Flow', message: 'Infinite abundance is your birthright. Financial and material blessings are flowing toward you now.', guidance: 'Open yourself to receiving. Say yes to an opportunity you would normally decline. Abundance requires open hands.', affirmation: 'I am a magnet for abundance. Prosperity flows to me from expected and unexpected sources.', emoji: '♾️', color: '#c9a84c', element: 'Earth' },
  { number: '999', title: 'The Sacred Completion', message: 'A major cycle in your life is completing. Honor what has been, release with gratitude, and prepare for rebirth.', guidance: 'Write a letter of gratitude and farewell to what is ending. This ritual seals the cycle and opens the next.', affirmation: 'I complete this cycle with grace and gratitude. I am ready for my magnificent new beginning.', emoji: '🌙', color: '#f472b6', element: 'Water' },
  { number: '1010', title: 'The Divine Reset', message: 'God/Source is speaking directly to you. A divine reset is occurring — your soul is being upgraded for its next mission.', guidance: 'Meditate for 10 minutes in complete silence. Listen for the still small voice within. It has important guidance for you.', affirmation: 'I am in direct communication with the divine. My soul receives its perfect upgrade now.', emoji: '✦', color: '#e0e7ff', element: 'Ether' },
  { number: '1111', title: 'The Manifestation Portal', message: 'The most powerful manifestation portal is open. What you focus on now will materialize with extraordinary speed.', guidance: 'Write your top 3 desires as if already fulfilled. Read them at 11:11 AM and 11:11 PM for 11 days straight.', affirmation: 'I am a master manifestor. My desires align with divine will and materialize now.', emoji: '🌟', color: '#fde68a', element: 'Fire' },
  { number: '1212', title: 'The Twin Flame Mirror', message: "Your twin flame or soul mirror is near. A profound soul connection is either arriving or deepening in your life.", guidance: "Open your heart fully today. Release any walls you have built around love. Your soul's mirror is seeking you.", affirmation: "I am open to profound soul connection. Love in its highest form flows to me now.", emoji: '💫', color: '#f9a8d4', element: 'Water' },
]

const SPREADS = [
  { id: 'single', name: 'Single Card', desc: 'One message for now', count: 1, emoji: '✦' },
  { id: 'three', name: 'Past · Present · Future', desc: 'Your timeline reading', count: 3, emoji: '◈' },
  { id: 'cross', name: 'Soul Cross', desc: 'Challenge & guidance', count: 4, emoji: '✚' },
]

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function OracleCardDisplay({ card, label, delay = 0 }: { card: OracleCard; label?: string; delay?: number }) {
  const [flipped, setFlipped] = useState(false)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const t1 = setTimeout(() => setVisible(true), delay)
    const t2 = setTimeout(() => setFlipped(true), delay + 400)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [delay])

  return (
    <div style={{ opacity: visible ? 1 : 0, transition: 'opacity 0.4s ease', marginBottom: '1rem' }}>
      {label && <div style={{ color: 'rgba(180,160,255,0.4)', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.12em', textAlign: 'center', marginBottom: '0.5rem' }}>{label}</div>}
      <div style={{ background: 'rgba(8,6,28,0.92)', border: '1px solid ' + card.color + '40', borderRadius: '1.25rem', backdropFilter: 'blur(12px)', padding: '1.5rem', transition: 'all 0.6s ease', transform: flipped ? 'rotateY(0deg)' : 'rotateY(90deg)', boxShadow: '0 0 30px ' + card.color + '15' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem', marginBottom: '1rem' }}>
          <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: card.color + '18', border: '1px solid ' + card.color + '40', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.6rem', flexShrink: 0, boxShadow: '0 0 20px ' + card.color + '25' }}>{card.emoji}</div>
          <div>
            <div style={{ color: card.color, fontSize: '1.4rem', fontWeight: 700, fontFamily: 'Cormorant Garamond, serif', lineHeight: 1 }}>{card.number}</div>
            <div style={{ color: 'rgba(220,200,255,0.85)', fontSize: '0.85rem', marginTop: '0.2rem', fontFamily: 'Cormorant Garamond, serif' }}>{card.title}</div>
            <div style={{ color: card.color + 'aa', fontSize: '0.62rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: '0.15rem' }}>{card.element} · Oracle</div>
          </div>
        </div>
        <p style={{ color: 'rgba(200,180,255,0.8)', fontSize: '0.88rem', lineHeight: 1.7, margin: '0 0 1rem', fontFamily: 'Cormorant Garamond, serif', fontStyle: 'italic' }}>{card.message}</p>
        <div style={{ background: card.color + '0c', border: '1px solid ' + card.color + '20', borderRadius: '0.75rem', padding: '0.875rem', marginBottom: '0.75rem' }}>
          <div style={{ color: card.color, fontSize: '0.62rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.4rem' }}>✦ Guidance</div>
          <p style={{ color: 'rgba(180,160,255,0.7)', fontSize: '0.8rem', lineHeight: 1.6, margin: 0 }}>{card.guidance}</p>
        </div>
        <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(200,180,255,0.08)', borderRadius: '0.75rem', padding: '0.75rem' }}>
          <div style={{ color: 'rgba(180,160,255,0.35)', fontSize: '0.62rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.35rem' }}>Affirmation</div>
          <p style={{ color: 'rgba(220,200,255,0.65)', fontSize: '0.8rem', lineHeight: 1.5, margin: 0, fontStyle: 'italic' }}>&ldquo;{card.affirmation}&rdquo;</p>
        </div>
      </div>
    </div>
  )
}

export default function OraclePage() {
  const [spread, setSpread] = useState(SPREADS[0])
  const [drawn, setDrawn] = useState<OracleCard[]>([])
  const [drawing, setDrawing] = useState(false)
  const [history, setHistory] = useState<{ date: string; spread: string; numbers: string[] }[]>([])

  useEffect(() => {
    const saved = localStorage.getItem('synchrosoul_oracle_history')
    if (saved) setHistory(JSON.parse(saved))
  }, [])

  function drawCards() {
    setDrawing(true)
    setDrawn([])
    setTimeout(() => {
      const cards = shuffle(ORACLE_CARDS).slice(0, spread.count)
      setDrawn(cards)
      const entry = { date: new Date().toLocaleDateString(), spread: spread.name, numbers: cards.map(c => c.number) }
      const updated = [entry, ...history].slice(0, 10)
      setHistory(updated)
      localStorage.setItem('synchrosoul_oracle_history', JSON.stringify(updated))
      setDrawing(false)
    }, 800)
  }

  const card: React.CSSProperties = { background: 'rgba(8,6,28,0.88)', border: '1px solid rgba(200,180,255,0.12)', borderRadius: '1.25rem', backdropFilter: 'blur(12px)' }
  const LABELS: Record<string, string[]> = {
    single: ['Your Message'],
    three: ['Past', 'Present', 'Future'],
    cross: ['Foundation', 'Challenge', 'Guidance', 'Outcome'],
  }

  return (
    <div style={{ maxWidth: '520px', margin: '0 auto', padding: '1.5rem 1rem 2rem' }}>
      <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
        <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2rem', color: 'rgba(220,200,255,0.95)', margin: '0 0 0.25rem', fontWeight: 400 }}>Angel Oracle</h1>
        <p style={{ color: 'rgba(180,160,255,0.5)', fontSize: '0.8rem', margin: 0 }}>Draw sacred number cards for divine guidance</p>
      </div>

      {/* Spread selector */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '0.5rem', marginBottom: '1.25rem' }}>
        {SPREADS.map(s => (
          <button key={s.id} onClick={() => { setSpread(s); setDrawn([]) }} style={{ ...card, padding: '0.875rem 0.5rem', border: spread.id===s.id ? '1px solid rgba(201,168,76,0.5)' : '1px solid rgba(200,180,255,0.1)', background: spread.id===s.id ? 'rgba(201,168,76,0.12)' : 'rgba(8,6,28,0.7)', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.3rem' }}>
            <span style={{ fontSize: '1.2rem' }}>{s.emoji}</span>
            <span style={{ color: spread.id===s.id ? '#c9a84c' : 'rgba(220,200,255,0.6)', fontSize: '0.72rem', fontWeight: 600, textAlign: 'center', lineHeight: 1.3 }}>{s.name}</span>
            <span style={{ color: 'rgba(180,160,255,0.35)', fontSize: '0.62rem', textAlign: 'center' }}>{s.desc}</span>
          </button>
        ))}
      </div>

      {/* Draw button */}
      <button onClick={drawCards} disabled={drawing} style={{ width: '100%', padding: '1rem', borderRadius: '1rem', border: '1px solid rgba(201,168,76,0.4)', background: drawing ? 'rgba(201,168,76,0.08)' : 'rgba(201,168,76,0.15)', color: '#c9a84c', fontSize: '1rem', cursor: drawing ? 'not-allowed' : 'pointer', fontFamily: 'Cormorant Garamond, serif', letterSpacing: '0.08em', marginBottom: '1.5rem', transition: 'all 0.3s' }}>
        {drawing ? '✦ The cards are speaking...' : drawn.length ? '✦ Draw Again' : '✦ Draw Your Cards'}
      </button>

      {/* Cards */}
      {drawn.map((c, i) => (
        <OracleCardDisplay key={c.number + i} card={c} label={LABELS[spread.id]?.[i]} delay={i * 300} />
      ))}

      {/* History */}
      {history.length > 0 && drawn.length === 0 && (
        <div style={{ ...card, padding: '1.25rem' }}>
          <div style={{ color: 'rgba(180,160,255,0.4)', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.875rem' }}>Recent Readings</div>
          {history.slice(0, 5).map((h, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0', borderBottom: i < 4 ? '1px solid rgba(200,180,255,0.06)' : 'none' }}>
              <div>
                <span style={{ color: 'rgba(220,200,255,0.6)', fontSize: '0.8rem' }}>{h.spread}</span>
                <span style={{ color: 'rgba(180,160,255,0.35)', fontSize: '0.72rem', marginLeft: '0.5rem' }}>{h.numbers.join(' · ')}</span>
              </div>
              <span style={{ color: 'rgba(180,160,255,0.3)', fontSize: '0.7rem' }}>{h.date}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
