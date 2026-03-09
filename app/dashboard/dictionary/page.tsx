'use client';
import { useState } from 'react';

const NUMBERS: Record<string, { meaning: string; theme: string; color: string; keywords: string[]; affirmation: string; action: string }> = {
  '000': { theme: 'Infinite Potential', color: '#ffffff', keywords: ['void','creation','source','reset'], meaning: 'You are at the beginning of a new cycle. The universe is offering you a blank slate. This is a powerful moment of pure potential — anything is possible.', affirmation: 'I am open to infinite possibilities.', action: 'Meditate on what you truly want to create.' },
  '111': { theme: 'Manifestation Portal', color: '#f59e0b', keywords: ['thoughts','manifest','new start','alignment'], meaning: 'Your thoughts are manifesting rapidly. Be mindful of what you focus on — the universe is listening and responding in real time. A powerful portal is open.', affirmation: 'My thoughts create my reality with ease.', action: 'Write down your most important intention right now.' },
  '222': { theme: 'Divine Timing', color: '#3b82f6', keywords: ['patience','trust','balance','partnership'], meaning: 'Trust the process. Everything is unfolding in perfect divine timing. Your seeds are germinating beneath the surface — keep the faith and stay balanced.', affirmation: 'I trust divine timing completely.', action: 'Release control and surrender to the flow.' },
  '333': { theme: 'Ascended Masters', color: '#f97316', keywords: ['creativity','guides','expression','growth'], meaning: 'The Ascended Masters are near, offering guidance and support. Your creative energy is amplified. Express yourself authentically and trust your inner wisdom.', affirmation: 'I am guided, protected, and divinely supported.', action: 'Create something — write, draw, sing, or speak your truth.' },
  '444': { theme: 'Angelic Protection', color: '#22c55e', keywords: ['foundation','protection','stability','angels'], meaning: 'The angels surround you with love and protection. You are on the right path. Build solid foundations and trust that your hard work is supported by divine forces.', affirmation: 'I am safe, protected, and divinely guided.', action: 'Ground yourself — walk barefoot, breathe deeply, feel supported.' },
  '555': { theme: 'Major Change', color: '#8b5cf6', keywords: ['change','transformation','freedom','adventure'], meaning: 'Significant change is coming or already underway. Release resistance and embrace the transformation. This shift is divinely orchestrated for your highest good.', affirmation: 'I embrace change as divine transformation.', action: 'Identify one thing you need to release to make space for the new.' },
  '666': { theme: 'Rebalance', color: '#ec4899', keywords: ['balance','home','love','rebalance'], meaning: 'A call to rebalance your thoughts and energy. Shift focus from material concerns to love, family, and spiritual growth. Nurture yourself and those around you.', affirmation: 'I bring love and balance to all areas of my life.', action: 'Spend time in nature or with loved ones today.' },
  '777': { theme: 'Spiritual Luck', color: '#6366f1', keywords: ['luck','wisdom','spiritual','reward'], meaning: 'You are in perfect alignment with the universe. Spiritual luck and divine rewards are flowing to you. Your spiritual practice is paying off — keep going.', affirmation: 'I am in perfect alignment with divine flow.', action: 'Deepen your spiritual practice — meditate, journal, or study.' },
  '888': { theme: 'Infinite Abundance', color: '#f59e0b', keywords: ['abundance','infinity','karma','wealth'], meaning: 'The infinite loop of abundance is activated. Financial and material blessings are flowing. Karmic rewards for past efforts are arriving. Receive with gratitude.', affirmation: 'Abundance flows to me from all directions.', action: 'Open yourself to receive — say yes to opportunities today.' },
  '999': { theme: 'Completion & Release', color: '#ef4444', keywords: ['completion','release','endings','lightworker'], meaning: 'A major cycle is completing. Release what no longer serves your highest path. You are being called to step into your role as a lightworker and serve humanity.', affirmation: 'I release the old with gratitude and welcome the new.', action: 'Complete something unfinished or consciously let something go.' },
  '1010': { theme: 'Spiritual Awakening', color: '#a78bfa', keywords: ['awakening','growth','divine','path'], meaning: 'You are on a path of rapid spiritual awakening. The universe is nudging you toward your higher purpose. Stay positive and keep taking inspired action.', affirmation: 'I am awakening to my highest potential.', action: 'Take one step toward your soul purpose today.' },
  '1111': { theme: 'Master Portal', color: '#fde68a', keywords: ['portal','wishes','alignment','master'], meaning: 'The most powerful manifestation portal. Your thoughts, words, and intentions are being supercharged by the universe. Make a wish. Set an intention. You are seen.', affirmation: 'I am a powerful creator aligned with divine will.', action: 'Make a wish or set a powerful intention right now.' },
  '1212': { theme: 'Soul Mission', color: '#60a5fa', keywords: ['mission','purpose','divine','path'], meaning: 'You are aligned with your soul mission. The universe is confirming you are exactly where you need to be. Trust your path and keep moving forward with courage.', affirmation: 'I am fulfilling my soul mission with joy.', action: 'Reflect on your deepest purpose and take one aligned action.' },
  '1234': { theme: 'Step by Step', color: '#4ade80', keywords: ['progress','steps','forward','growth'], meaning: 'You are making steady, sequential progress. Each step is building on the last. Trust the process and keep moving forward — you are climbing the right staircase.', affirmation: 'I trust each step of my journey.', action: 'Identify your next small step and take it today.' },
  '2222': { theme: 'Master Builder', color: '#3b82f6', keywords: ['building','vision','patience','master'], meaning: 'Master builder energy is with you. Your vision is being built brick by brick. Have patience — the structure you are creating will stand the test of time.', affirmation: 'I am building something magnificent and lasting.', action: 'Work on your most important long-term project today.' },
  '3333': { theme: 'Trinity Power', color: '#f97316', keywords: ['trinity','mind body spirit','masters','power'], meaning: 'The trinity of mind, body, and spirit is in perfect alignment. Multiple Ascended Masters are with you. Your creative and spiritual power is at its peak.', affirmation: 'My mind, body, and spirit are in perfect harmony.', action: 'Do something that nourishes all three: mind, body, and spirit.' },
  '4444': { theme: 'Angelic Army', color: '#22c55e', keywords: ['angels','army','protection','foundation'], meaning: 'An entire army of angels surrounds you. You are deeply protected and supported. The foundations you are building are blessed and will endure.', affirmation: 'I am surrounded by divine love and protection.', action: 'Trust completely and take bold action knowing you are protected.' },
  '5555': { theme: 'Massive Shift', color: '#8b5cf6', keywords: ['massive','shift','transformation','freedom'], meaning: 'A massive, life-altering transformation is underway. This is one of the most powerful change sequences. Surrender completely to the divine plan unfolding.', affirmation: 'I surrender to divine transformation with trust and joy.', action: 'Release your biggest fear about the changes happening.' },
  '7777': { theme: 'Divine Miracle', color: '#6366f1', keywords: ['miracle','luck','divine','reward'], meaning: 'A divine miracle is unfolding in your life. This is the highest luck sequence. The universe is rewarding your spiritual dedication with extraordinary blessings.', affirmation: 'Miracles are natural in my life.', action: 'Expect a miracle today and watch for signs of it.' },
  '8888': { theme: 'Infinite Wealth', color: '#f59e0b', keywords: ['wealth','infinite','karma','abundance'], meaning: 'Infinite wealth and abundance are flowing to you from all directions. This is the most powerful abundance sequence. Your karmic bank account is overflowing.', affirmation: 'I am a magnet for infinite abundance.', action: 'Take one bold financial or abundance-focused action today.' },
  '9999': { theme: 'Cosmic Completion', color: '#ef4444', keywords: ['cosmic','completion','ascension','lightworker'], meaning: 'The highest completion sequence. A cosmic cycle is ending and a new one is about to begin. You are being called to your highest lightworker mission on Earth.', affirmation: 'I complete this cycle with grace and step into my highest calling.', action: 'Write a letter of gratitude for everything this cycle taught you.' },
};

const ALL_NUMBERS = Object.keys(NUMBERS);
const CATEGORIES = [
  { label: 'All', filter: (n: string) => true },
  { label: '000-099', filter: (n: string) => parseInt(n) < 100 },
  { label: '100-499', filter: (n: string) => parseInt(n) >= 100 && parseInt(n) < 500 },
  { label: '500-999', filter: (n: string) => parseInt(n) >= 500 && parseInt(n) < 1000 },
  { label: '1000+', filter: (n: string) => parseInt(n) >= 1000 },
];

export default function DictionaryPage() {
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<string | null>(null);
  const [category, setCategory] = useState(0);

  const filtered = ALL_NUMBERS.filter(n => {
    const matchSearch = !search || n.includes(search) || NUMBERS[n].theme.toLowerCase().includes(search.toLowerCase()) || NUMBERS[n].keywords.some(k => k.includes(search.toLowerCase()));
    const matchCat = CATEGORIES[category].filter(n);
    return matchSearch && matchCat;
  });

  const entry = selected ? NUMBERS[selected] : null;

  return (
    <div style={{ minHeight: '100vh', padding: '2rem 1rem', maxWidth: '700px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 700, color: '#a78bfa', fontFamily: 'Cormorant Garamond, serif' }}>Angel Number Dictionary</h1>
        <p style={{ color: 'rgba(255,255,255,0.4)', marginTop: '0.25rem' }}>Decode the messages from your guides</p>
      </div>

      {/* Search */}
      <div style={{
        background: 'rgba(8,6,28,0.88)', borderRadius: '1.5rem',
        border: '1px solid rgba(255,255,255,0.1)', padding: '0.25rem 0.25rem 0.25rem 1.25rem',
        backdropFilter: 'blur(12px)', marginBottom: '1rem',
        display: 'flex', alignItems: 'center', gap: '0.75rem'
      }}>
        <span style={{ opacity: 0.4 }}>🔍</span>
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search by number, theme, or keyword..."
          style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: '#fff', fontSize: '1rem', padding: '0.75rem 0' }} />
        {search && <button onClick={() => setSearch('')} style={{ background: 'rgba(255,255,255,0.08)', border: 'none', borderRadius: '999px', width: '2rem', height: '2rem', cursor: 'pointer', color: 'rgba(255,255,255,0.5)' }}>✕</button>}
      </div>

      {/* Category chips */}
      <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
        {CATEGORIES.map((c, i) => (
          <button key={c.label} onClick={() => setCategory(i)} style={{
            padding: '0.3rem 0.75rem', borderRadius: '999px', cursor: 'pointer', fontSize: '0.75rem',
            background: category === i ? 'rgba(167,139,250,0.2)' : 'rgba(255,255,255,0.04)',
            border: category === i ? '1px solid rgba(167,139,250,0.4)' : '1px solid rgba(255,255,255,0.07)',
            color: category === i ? '#a78bfa' : 'rgba(255,255,255,0.4)'
          }}>{c.label}</button>
        ))}
      </div>

      {/* Detail panel */}
      {entry && selected && (
        <div style={{
          background: `${entry.color}10`, borderRadius: '1.5rem',
          border: `1px solid ${entry.color}30`, padding: '1.5rem',
          backdropFilter: 'blur(12px)', marginBottom: '1.5rem',
          boxShadow: `0 0 40px ${entry.color}10`
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <div>
              <div style={{ fontSize: '2.5rem', fontWeight: 800, color: entry.color, fontFamily: 'Cormorant Garamond, serif', lineHeight: 1 }}>{selected}</div>
              <div style={{ color: '#fff', fontSize: '1.1rem', fontWeight: 700, marginTop: '0.25rem' }}>{entry.theme}</div>
            </div>
            <button onClick={() => setSelected(null)} style={{ background: 'rgba(255,255,255,0.06)', border: 'none', borderRadius: '999px', width: '2rem', height: '2rem', cursor: 'pointer', color: 'rgba(255,255,255,0.4)', fontSize: '1rem' }}>✕</button>
          </div>
          <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.9rem', lineHeight: 1.7, marginBottom: '1rem' }}>{entry.meaning}</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '1rem' }}>
            {entry.keywords.map(k => (
              <span key={k} style={{ background: `${entry.color}15`, border: `1px solid ${entry.color}25`, borderRadius: '999px', padding: '0.2rem 0.6rem', fontSize: '0.72rem', color: entry.color }}>{k}</span>
            ))}
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '0.875rem', padding: '0.875rem' }}>
              <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.62rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.4rem' }}>Affirmation</p>
              <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.82rem', lineHeight: 1.5, fontStyle: 'italic' }}>&ldquo;{entry.affirmation}&rdquo;</p>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '0.875rem', padding: '0.875rem' }}>
              <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.62rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.4rem' }}>Action</p>
              <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.82rem', lineHeight: 1.5 }}>{entry.action}</p>
            </div>
          </div>
        </div>
      )}

      {/* Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '0.6rem' }}>
        {filtered.map(n => {
          const e = NUMBERS[n];
          return (
            <button key={n} onClick={() => setSelected(selected === n ? null : n)} style={{
              background: selected === n ? `${e.color}15` : 'rgba(8,6,28,0.88)',
              borderRadius: '1.25rem',
              border: selected === n ? `1px solid ${e.color}40` : '1px solid rgba(255,255,255,0.07)',
              padding: '1rem 0.75rem', cursor: 'pointer', textAlign: 'center',
              backdropFilter: 'blur(12px)', transition: 'all 0.2s'
            }}>
              <div style={{ fontSize: '1.4rem', fontWeight: 800, color: e.color, fontFamily: 'Cormorant Garamond, serif', lineHeight: 1, marginBottom: '0.3rem' }}>{n}</div>
              <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.68rem', lineHeight: 1.3 }}>{e.theme}</div>
            </button>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'rgba(255,255,255,0.3)' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>📚</div>
          <p>No numbers found for &ldquo;{search}&rdquo;</p>
        </div>
      )}
    </div>
  );
}