'use client'
import { useState, useEffect } from 'react'

const MAJOR_ARCANA = [
  { num: 0, name: 'The Fool', emoji: '★', color: '#fbbf24', element: 'Air', keywords: ['New beginnings', 'Innocence', 'Adventure'], upright: 'A leap of faith awaits. Trust the universe and step into the unknown with an open heart. New beginnings are blessed.', reversed: 'Recklessness or fear of change holds you back. Ground yourself before leaping.', angelNumber: '000', affirmation: 'I trust the journey. Every step is divinely guided.' },
  { num: 1, name: 'The Magician', emoji: '✨', color: '#c9a84c', element: 'Air', keywords: ['Manifestation', 'Power', 'Skill'], upright: 'You have all the tools you need. The universe is conspiring in your favor. Manifest with intention.', reversed: 'Manipulation or untapped potential. Align your actions with your highest self.', angelNumber: '111', affirmation: 'I am a powerful creator. I manifest my desires with ease.' },
  { num: 2, name: 'The High Priestess', emoji: '🌙', color: '#a78bfa', element: 'Water', keywords: ['Intuition', 'Mystery', 'Inner knowing'], upright: 'Trust your intuition above all else. The answers you seek are within. Be still and listen.', reversed: 'Ignoring your inner voice. Secrets or hidden agendas. Go within.', angelNumber: '222', affirmation: 'I trust my inner wisdom. My intuition is my superpower.' },
  { num: 3, name: 'The Empress', emoji: '🌸', color: '#f472b6', element: 'Earth', keywords: ['Abundance', 'Fertility', 'Nurturing'], upright: 'Abundance flows to you. A time of growth, creativity, and nurturing. Nature heals you now.', reversed: 'Creative blocks or neglecting self-care. Reconnect with your body and nature.', angelNumber: '333', affirmation: 'I am abundant. I nurture myself and others with love.' },
  { num: 4, name: 'The Emperor', emoji: '👑', color: '#ef4444', element: 'Fire', keywords: ['Authority', 'Structure', 'Stability'], upright: 'Build solid foundations. Take charge of your life with discipline and confidence.', reversed: 'Rigidity or abuse of power. Soften your approach. Flexibility is strength.', angelNumber: '444', affirmation: 'I am grounded, stable, and in command of my life.' },
  { num: 5, name: 'The Hierophant', emoji: '⛪', color: '#6366f1', element: 'Earth', keywords: ['Tradition', 'Wisdom', 'Guidance'], upright: 'Seek wisdom from a mentor or tradition. Spiritual guidance is available to you.', reversed: 'Question dogma. Your own spiritual path may differ from convention.', angelNumber: '555', affirmation: 'I am open to divine wisdom and spiritual guidance.' },
  { num: 6, name: 'The Lovers', emoji: '❤️', color: '#f43f5e', element: 'Air', keywords: ['Love', 'Choice', 'Union'], upright: 'A significant choice or deep connection approaches. Follow your heart. Love is your compass.', reversed: 'Misalignment in values or a difficult choice. Choose with your heart, not fear.', angelNumber: '666', affirmation: 'I choose love. I am worthy of deep, soulful connection.' },
  { num: 7, name: 'The Chariot', emoji: '💎', color: '#0ea5e9', element: 'Water', keywords: ['Victory', 'Willpower', 'Control'], upright: 'Victory is yours through determination. Harness your willpower and charge forward.', reversed: 'Lack of direction or aggression. Slow down and realign your intentions.', angelNumber: '777', affirmation: 'I move forward with confidence and unstoppable will.' },
  { num: 8, name: 'Strength', emoji: '🦁', color: '#f97316', element: 'Fire', keywords: ['Courage', 'Patience', 'Inner strength'], upright: 'True strength comes from compassion and patience. You are stronger than you know.', reversed: 'Self-doubt or fear. Reconnect with your inner courage.', angelNumber: '888', affirmation: 'I am strong, courageous, and capable of anything.' },
  { num: 9, name: 'The Hermit', emoji: '🕯️', color: '#94a3b8', element: 'Earth', keywords: ['Solitude', 'Wisdom', 'Introspection'], upright: 'Withdraw and seek inner wisdom. A period of solitude brings profound insight.', reversed: 'Isolation or refusing guidance. Balance solitude with connection.', angelNumber: '999', affirmation: 'I find wisdom in stillness. My inner light guides the way.' },
  { num: 10, name: 'Wheel of Fortune', emoji: '☉', color: '#c9a84c', element: 'Fire', keywords: ['Cycles', 'Fate', 'Turning point'], upright: 'The wheel turns in your favor. A lucky cycle begins. Embrace the flow of life.', reversed: 'Resistance to change or bad luck. Trust the cycle. This too shall pass.', angelNumber: '1010', affirmation: 'I flow with the cycles of life. Fortune favors me.' },
  { num: 11, name: 'Justice', emoji: '⚖️', color: '#6366f1', element: 'Air', keywords: ['Truth', 'Fairness', 'Karma'], upright: 'Truth and fairness prevail. Karmic balance is restored. Act with integrity.', reversed: 'Injustice or dishonesty. Examine your own role in the situation.', angelNumber: '1111', affirmation: 'I act with integrity. The universe balances all things.' },
  { num: 12, name: 'The Hanged Man', emoji: '🌀', color: '#06b6d4', element: 'Water', keywords: ['Surrender', 'Pause', 'New perspective'], upright: 'Surrender to the moment. A pause brings a new perspective that changes everything.', reversed: 'Stalling or martyrdom. Release what you cannot control.', angelNumber: '1212', affirmation: 'I surrender and trust. New perspectives transform my reality.' },
  { num: 13, name: 'Death', emoji: '🍂', color: '#6b7280', element: 'Water', keywords: ['Transformation', 'Endings', 'Rebirth'], upright: 'A powerful transformation is underway. Let go of the old to welcome the new. Rebirth awaits.', reversed: 'Resistance to change. Clinging to the past delays your evolution.', angelNumber: '1313', affirmation: 'I embrace transformation. Every ending births a beautiful beginning.' },
  { num: 14, name: 'Temperance', emoji: '🌟', color: '#4ade80', element: 'Fire', keywords: ['Balance', 'Patience', 'Moderation'], upright: 'Find the middle path. Balance and patience create miracles. Flow between extremes.', reversed: 'Imbalance or excess. Restore harmony in your life.', angelNumber: '1414', affirmation: 'I am balanced, patient, and in perfect flow.' },
  { num: 15, name: 'The Devil', emoji: '🔗', color: '#dc2626', element: 'Earth', keywords: ['Shadow', 'Attachment', 'Liberation'], upright: 'Examine your attachments and shadow self. What chains you? Awareness is the first step to freedom.', reversed: 'Breaking free from addiction or toxic patterns. Liberation is near.', angelNumber: '1515', affirmation: 'I release all that no longer serves me. I am free.' },
  { num: 16, name: 'The Tower', emoji: '⚡', color: '#f97316', element: 'Fire', keywords: ['Upheaval', 'Revelation', 'Breakthrough'], upright: 'Sudden change shatters illusions. What falls was built on false foundations. Truth liberates.', reversed: 'Avoiding necessary change. The tower will fall eventually. Embrace it.', angelNumber: '1616', affirmation: 'I welcome necessary change. Breakthroughs come through breakdowns.' },
  { num: 17, name: 'The Star', emoji: '⭐', color: '#38bdf8', element: 'Air', keywords: ['Hope', 'Healing', 'Inspiration'], upright: 'Hope and healing flow to you. You are guided by starlight. Trust in the universe2019s plan.', reversed: 'Despair or lack of faith. Look up. Your star still shines.', angelNumber: '1717', affirmation: 'I am filled with hope. The universe guides and heals me.' },
  { num: 18, name: 'The Moon', emoji: '🌕', color: '#c084fc', element: 'Water', keywords: ['Illusion', 'Intuition', 'The unconscious'], upright: 'Not all is as it seems. Trust your intuition over appearances. Dreams carry messages.', reversed: 'Confusion lifting. Illusions dissolve. Clarity returns.', angelNumber: '1818', affirmation: 'I trust my intuition to navigate the unknown.' },
  { num: 19, name: 'The Sun', emoji: '☀️', color: '#fbbf24', element: 'Fire', keywords: ['Joy', 'Success', 'Vitality'], upright: 'Radiant success and joy are yours. A time of celebration, clarity, and abundant energy.', reversed: 'Temporary setbacks or excessive optimism. The sun always returns.', angelNumber: '1919', affirmation: 'I radiate joy and success. Life is beautiful and abundant.' },
  { num: 20, name: 'Judgement', emoji: '🎺', color: '#a78bfa', element: 'Fire', keywords: ['Awakening', 'Renewal', 'Calling'], upright: 'A spiritual awakening calls you to your higher purpose. Answer the call. Rise.', reversed: 'Self-doubt or ignoring your calling. You are ready. Trust yourself.', angelNumber: '2020', affirmation: 'I answer my soul2019s calling. I rise into my highest self.' },
  { num: 21, name: 'The World', emoji: '🌍', color: '#4ade80', element: 'Earth', keywords: ['Completion', 'Integration', 'Achievement'], upright: 'A cycle completes in triumph. You have achieved mastery. Celebrate and prepare for the next journey.', reversed: 'Incomplete cycles or shortcuts. Finish what you started.', angelNumber: '2121', affirmation: 'I am complete. I celebrate my journey and embrace what comes next.' },
]

function getDailyCard(date: Date) {
  const seed = date.getFullYear() * 10000 + (date.getMonth() + 1) * 100 + date.getDate()
  const idx = seed % MAJOR_ARCANA.length
  const reversed = (seed % 7) < 2
  return { card: MAJOR_ARCANA[idx], reversed }
}

export default function TarotPage() {
  const [today] = useState(new Date())
  const { card, reversed } = getDailyCard(today)
  const [revealed, setRevealed] = useState(false)
  const [journalEntry, setJournalEntry] = useState('')
  const [saved, setSaved] = useState(false)
  const [history, setHistory] = useState<Array<{ date: string; cardName: string; reversed: boolean; note: string }>>([]) 
  const [showHistory, setShowHistory] = useState(false)

  useEffect(() => {
    const h = JSON.parse(localStorage.getItem('synchrosoul_tarot_history') || '[]')
    setHistory(h)
    const todayKey = today.toDateString()
    const alreadyRevealed = h.some((e: any) => e.date === todayKey)
    if (alreadyRevealed) setRevealed(true)
  }, [])

  function saveReading() {
    const todayKey = today.toDateString()
    const h = JSON.parse(localStorage.getItem('synchrosoul_tarot_history') || '[]')
    const existing = h.findIndex((e: any) => e.date === todayKey)
    const entry = { date: todayKey, cardName: card.name, reversed, note: journalEntry }
    if (existing >= 0) h[existing] = entry
    else h.unshift(entry)
    localStorage.setItem('synchrosoul_tarot_history', JSON.stringify(h.slice(0, 90)))
    setHistory(h)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  const cardStyle = { background: 'rgba(8,6,28,0.88)', border: '1px solid rgba(200,180,255,0.12)', borderRadius: '1.25rem', backdropFilter: 'blur(12px)' } as React.CSSProperties

  return (
    <div style={{ maxWidth: '560px', margin: '0 auto', padding: '1.5rem 1rem 2rem' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.8rem', color: 'rgba(220,200,255,0.95)', margin: '0 0 0.25rem', fontWeight: 400 }}>Daily Tarot</h1>
          <p style={{ color: 'rgba(180,160,255,0.5)', fontSize: '0.8rem', margin: 0 }}>{today.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}</p>
        </div>
        <button onClick={() => setShowHistory(!showHistory)} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(200,180,255,0.12)', borderRadius: '0.6rem', cursor: 'pointer', color: 'rgba(180,160,255,0.6)', fontSize: '0.72rem', padding: '0.4rem 0.75rem', fontFamily: 'inherit' }}>History</button>
      </div>

      {showHistory ? (
        <div>
          <h3 style={{ color: 'rgba(180,160,255,0.6)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.75rem' }}>Past Readings</h3>
          {history.length === 0 ? <p style={{ color: 'rgba(180,160,255,0.35)', fontSize: '0.82rem' }}>No readings yet.</p> : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {history.map((h, i) => {
                const c = MAJOR_ARCANA.find(c => c.name === h.cardName)
                return (
                  <div key={i} style={{ ...cardStyle, padding: '0.9rem 1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <span style={{ fontSize: '1.4rem' }}>{c?.emoji}</span>
                      <div>
                        <div style={{ color: 'rgba(220,200,255,0.85)', fontSize: '0.82rem', fontWeight: 600 }}>{h.cardName} {h.reversed ? '(R)' : ''}</div>
                        <div style={{ color: 'rgba(180,160,255,0.4)', fontSize: '0.68rem' }}>{h.date}</div>
                        {h.note && <div style={{ color: 'rgba(180,160,255,0.55)', fontSize: '0.72rem', marginTop: '0.2rem' }}>{h.note}</div>}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      ) : (
        <div>
          {/* Card reveal */}
          {!revealed ? (
            <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
              <div style={{ fontSize: '4rem', marginBottom: '1.5rem', opacity: 0.4 }}>🃏</div>
              <p style={{ color: 'rgba(180,160,255,0.6)', fontSize: '0.88rem', marginBottom: '2rem' }}>Your card for today awaits. Take a breath and set your intention.</p>
              <button onClick={() => setRevealed(true)} style={{ padding: '0.85rem 2.5rem', borderRadius: '2rem', cursor: 'pointer', background: 'rgba(167,139,250,0.15)', border: '1px solid rgba(167,139,250,0.4)', color: '#a78bfa', fontSize: '0.9rem', fontFamily: 'Cormorant Garamond, serif', letterSpacing: '0.05em', fontWeight: 600 }}>Reveal My Card</button>
            </div>
          ) : (
            <div>
              {/* Main card */}
              <div style={{ ...cardStyle, padding: '2rem', marginBottom: '1rem', textAlign: 'center', border: `1px solid ${card.color}33`, background: `radial-gradient(ellipse at 50% 0%, ${card.color}12 0%, rgba(8,6,28,0.95) 70%)` }}>
                <div style={{ fontSize: '4.5rem', marginBottom: '0.75rem', filter: `drop-shadow(0 0 20px ${card.color}66)`, transform: reversed ? 'rotate(180deg)' : 'none', display: 'inline-block' }}>{card.emoji}</div>
                <div style={{ color: 'rgba(180,160,255,0.4)', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '0.25rem' }}>Card {card.num} {reversed ? '• Reversed' : ''}</div>
                <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.8rem', color: card.color, margin: '0 0 0.75rem', fontWeight: 400 }}>{card.name}</h2>
                <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '1rem' }}>
                  {card.keywords.map(k => <span key={k} style={{ padding: '0.2rem 0.6rem', borderRadius: '2rem', background: `${card.color}12`, border: `1px solid ${card.color}25`, color: card.color, fontSize: '0.7rem' }}>{k}</span>)}
                </div>
                <p style={{ color: 'rgba(200,180,255,0.8)', fontSize: '0.88rem', lineHeight: 1.75, margin: 0 }}>{reversed ? card.reversed : card.upright}</p>
              </div>

              {/* Angel number + affirmation */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
                <div style={{ ...cardStyle, padding: '1rem', textAlign: 'center' }}>
                  <div style={{ color: 'rgba(180,160,255,0.4)', fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.4rem' }}>Angel Number</div>
                  <div style={{ color: card.color, fontSize: '1.3rem', fontFamily: 'Cormorant Garamond, serif', fontWeight: 700 }}>{card.angelNumber}</div>
                  <div style={{ color: 'rgba(180,160,255,0.4)', fontSize: '0.65rem' }}>{card.element} energy</div>
                </div>
                <div style={{ ...cardStyle, padding: '1rem' }}>
                  <div style={{ color: 'rgba(180,160,255,0.4)', fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.4rem' }}>Affirmation</div>
                  <div style={{ color: 'rgba(200,180,255,0.8)', fontSize: '0.75rem', lineHeight: 1.5, fontStyle: 'italic' }}>“{card.affirmation}”</div>
                </div>
              </div>

              {/* Journal */}
              <div style={{ ...cardStyle, padding: '1.25rem' }}>
                <div style={{ color: 'rgba(180,160,255,0.4)', fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.6rem' }}>Reflect on this card</div>
                <textarea value={journalEntry} onChange={e => setJournalEntry(e.target.value)} placeholder="What does this card mean for you today?" rows={3}
                  style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(200,180,255,0.12)', borderRadius: '0.6rem', color: 'rgba(220,200,255,0.9)', padding: '0.75rem', fontSize: '0.85rem', resize: 'none', outline: 'none', fontFamily: 'inherit', boxSizing: 'border-box' }} />
                <button onClick={saveReading} style={{ marginTop: '0.6rem', width: '100%', padding: '0.65rem', borderRadius: '0.6rem', cursor: 'pointer', background: saved ? 'rgba(74,222,128,0.15)' : `${card.color}18`, border: saved ? '1px solid rgba(74,222,128,0.4)' : `1px solid ${card.color}44`, color: saved ? '#4ade80' : card.color, fontSize: '0.85rem', fontFamily: 'inherit', fontWeight: 600, transition: 'all 0.3s' }}>
                  {saved ? '✓ Saved' : 'Save Reading'}
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
