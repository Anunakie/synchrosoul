'use client';
import { useState, useEffect } from 'react';

const oracleMessages: Record<string, string[]> = {
  '111': [
    'Your thoughts are seeds being planted in the cosmic garden right now. Guard them carefully — only water what you wish to grow.',
    'A manifestation portal has opened. The universe is listening with extraordinary attention. Speak your desires clearly.',
    'You are the architect of your reality. The blueprint you hold in your mind is already being constructed in the unseen.',
  ],
  '222': [
    'Trust the timing. What feels like waiting is actually divine preparation. Your foundation is being strengthened.',
    'Balance is not stillness — it is the dance between giving and receiving. You are being called to harmonize.',
    'A partnership or collaboration is being divinely orchestrated. Open your heart to co-creation.',
  ],
  '333': [
    'The Ascended Masters walk beside you today. You are never alone in your journey — call on them freely.',
    'Your creative gifts are needed in the world. Stop dimming your light out of fear of being seen.',
    'Mind, body, and spirit are asking for alignment. Which one have you been neglecting?',
  ],
  '444': [
    'You are surrounded by angels building a fortress of protection around you. Rest in this safety.',
    'The hard work you have been doing is being noticed by the universe. Your foundation is solid.',
    'When you see 444, know that your prayers have been heard. The answer is already in motion.',
  ],
  '555': [
    'A massive transformation is underway. Do not resist the change — you called this in.',
    'Old structures are dissolving to make room for something far more aligned with your soul.',
    'The caterpillar does not mourn the cocoon. Trust your metamorphosis completely.',
  ],
  '666': [
    'Rebalance your focus. You have been too caught in the material world — your spirit is calling you home.',
    'Compassion begins with yourself. The love you freely give others is also yours to receive.',
    'Your home and family life are asking for your loving attention. Nurture your roots.',
  ],
  '777': [
    'You are in perfect divine alignment. Magic is not coming — it is already here, woven into this moment.',
    'Your spiritual gifts are awakening rapidly. Trust the visions, the knowing, the whispers.',
    'Lucky synchronicities are multiplying around you. Follow the breadcrumbs the universe is leaving.',
  ],
  '888': [
    'Abundance is your birthright and it is flowing to you now. Open your hands and your heart to receive.',
    'A financial or material blessing is approaching. Prepare yourself to receive it gracefully.',
    'The infinite loop of giving and receiving is in perfect motion in your life. Trust the flow.',
  ],
  '999': [
    'A major chapter of your life is completing. Honor what was, release it with love, and step forward.',
    'You are being called to your highest service. The world needs what only you can offer.',
    'Let go. Whatever you are clinging to that no longer serves you — the universe is gently prying your fingers open.',
  ],
  '1111': [
    'You have stepped through a master portal. Your soul chose this moment for a reason. Wake up fully.',
    'The veil between worlds is thin right now. Your angels, guides, and ancestors are speaking. Listen.',
    'You are a lightworker remembering your mission. The amnesia is lifting. Trust what you are becoming.',
  ],
};

const generalMessages = [
  'The universe has been trying to reach you. This moment — right now — is the message.',
  'You are exactly where you need to be, even if it does not feel that way. Trust the path.',
  'Something you have been waiting for is closer than you think. Keep your vibration high.',
  'Your ancestors are proud of how far you have come. You carry their strength in your blood.',
  'The answer you seek is not outside you. Sit in silence and let it rise.',
  'A divine plot twist is coming that will make everything make sense.',
  'You are being prepared, not punished. The pressure is creating a diamond.',
  'Love is the frequency that unlocks every door. Lead with it today.',
  'Your sensitivity is your superpower, not your weakness. Feel everything — it is data from the divine.',
  'The version of you that exists six months from now is already celebrating.',
];

const cardSpreads = [
  { name: 'Single Oracle', count: 1, desc: 'One message for right now' },
  { name: 'Past · Present · Future', count: 3, desc: 'Your journey across time' },
  { name: 'Mind · Body · Spirit', count: 3, desc: 'Alignment reading' },
  { name: 'Challenge · Guidance · Outcome', count: 3, desc: 'Navigate your situation' },
];

export default function OraclePage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [spread, setSpread] = useState(0);
  const [cards, setCards] = useState<string[]>([]);
  const [revealed, setRevealed] = useState<boolean[]>([]);
  const [question, setQuestion] = useState('');
  const [history, setHistory] = useState<Array<{date: string; question: string; cards: string[]}>>([]);

  useEffect(() => {
    const l = localStorage.getItem('synchrosoul_logs');
    if (l) setLogs(JSON.parse(l));
    const h = localStorage.getItem('synchrosoul_oracle_history');
    if (h) setHistory(JSON.parse(h));
  }, []);

  const getOracleMessage = () => {
    const recentNums = logs.slice(0, 10).map((l: any) => l.number);
    const pool: string[] = [];
    recentNums.forEach((num: string) => {
      const msgs = oracleMessages[num];
      if (msgs) pool.push(...msgs);
    });
    if (pool.length === 0) pool.push(...generalMessages);
    return pool[Math.floor(Math.random() * pool.length)];
  };

  const drawCards = () => {
    const count = cardSpreads[spread].count;
    const newCards = Array.from({ length: count }, () => getOracleMessage());
    setCards(newCards);
    setRevealed(new Array(count).fill(false));
    const entry = { date: new Date().toISOString(), question, cards: newCards };
    const updated = [entry, ...history.slice(0, 9)];
    setHistory(updated);
    localStorage.setItem('synchrosoul_oracle_history', JSON.stringify(updated));
  };

  const revealCard = (i: number) => {
    setRevealed(r => { const n = [...r]; n[i] = true; return n; });
  };

  const spreadLabels = [
    ['Message'],
    ['Past', 'Present', 'Future'],
    ['Mind', 'Body', 'Spirit'],
    ['Challenge', 'Guidance', 'Outcome'],
  ];

  return (
    <div style={{ minHeight: '100vh', padding: '2rem 1rem', maxWidth: '700px', margin: '0 auto' }}>
      <h1 style={{ textAlign: 'center', fontSize: '1.8rem', fontWeight: 700, color: '#e8d5b7', marginBottom: '0.5rem' }}>🔮 Angel Oracle</h1>
      <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.5)', marginBottom: '2rem', fontSize: '0.9rem' }}>Personalized messages from your angel number patterns</p>

      <div style={{ background: 'rgba(8,6,28,0.85)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '1.25rem', padding: '1.5rem', backdropFilter: 'blur(12px)', marginBottom: '1.5rem' }}>
        <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.75rem' }}>Your Question (optional)</div>
        <input value={question} onChange={e => setQuestion(e.target.value)} placeholder="What guidance do you seek?" style={{ width: '100%', padding: '0.75rem 1rem', borderRadius: '0.75rem', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'white', fontSize: '0.95rem', outline: 'none', boxSizing: 'border-box', marginBottom: '1rem' }} />
        <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.75rem' }}>Spread</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.5rem', marginBottom: '1.25rem' }}>
          {cardSpreads.map((s, i) => (
            <button key={i} onClick={() => setSpread(i)} style={{ padding: '0.75rem', borderRadius: '0.75rem', background: spread === i ? 'rgba(155,89,182,0.25)' : 'rgba(255,255,255,0.04)', border: spread === i ? '1px solid rgba(155,89,182,0.5)' : '1px solid rgba(255,255,255,0.08)', color: spread === i ? '#b794f4' : 'rgba(255,255,255,0.6)', cursor: 'pointer', textAlign: 'left' }}>
              <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{s.name}</div>
              <div style={{ fontSize: '0.72rem', opacity: 0.6, marginTop: '0.2rem' }}>{s.desc}</div>
            </button>
          ))}
        </div>
        <button onClick={drawCards} style={{ width: '100%', padding: '0.9rem', borderRadius: '0.9rem', background: 'linear-gradient(135deg, #9b59b6, #c9a84c)', color: 'white', border: 'none', fontSize: '1rem', fontWeight: 600, cursor: 'pointer' }}>✨ Receive Oracle Message</button>
      </div>

      {cards.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: cards.length === 1 ? '1fr' : 'repeat(' + cards.length + ', 1fr)', gap: '0.75rem', marginBottom: '1.5rem' }}>
          {cards.map((card, i) => (
            <div key={i} onClick={() => revealCard(i)} style={{ background: revealed[i] ? 'rgba(8,6,28,0.9)' : 'linear-gradient(135deg, #1a0533, #0d1b4b)', border: '1px solid rgba(155,89,182,0.3)', borderRadius: '1.25rem', padding: '1.5rem 1rem', cursor: revealed[i] ? 'default' : 'pointer', minHeight: '180px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', textAlign: 'center', transition: 'all 0.4s', backdropFilter: 'blur(10px)' }}>
              <div style={{ color: '#b794f4', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.75rem' }}>{spreadLabels[spread][i]}</div>
              {revealed[i] ? (
                <p style={{ color: '#e8d5b7', fontSize: '0.88rem', lineHeight: 1.7, fontStyle: 'italic', margin: 0 }}>“{card}”</p>
              ) : (
                <>
                  <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>✨</div>
                  <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem' }}>Tap to reveal</div>
                </>
              )}
            </div>
          ))}
        </div>
      )}

      {history.length > 0 && (
        <div style={{ background: 'rgba(8,6,28,0.75)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '1rem', padding: '1.25rem', backdropFilter: 'blur(8px)' }}>
          <h3 style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.75rem' }}>Recent Readings</h3>
          {history.slice(0, 3).map((h, i) => (
            <div key={i} style={{ padding: '0.75rem', borderRadius: '0.75rem', background: 'rgba(255,255,255,0.03)', marginBottom: '0.5rem', borderLeft: '2px solid rgba(155,89,182,0.4)' }}>
              <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.72rem', marginBottom: '0.3rem' }}>{new Date(h.date).toLocaleDateString()}{h.question ? ' · ' + h.question : ''}</div>
              <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.82rem', margin: 0, fontStyle: 'italic' }}>“{h.cards[0].slice(0, 80)}...”</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
