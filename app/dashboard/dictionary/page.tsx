'use client';
import { useState } from 'react';

const NUMBERS = [
  { number: '000', color: '#a78bfa', emoji: '🌌', title: 'Infinite Potential', keywords: ['infinity','void','source','reset'], meaning: 'You are at the beginning of a spiritual journey. The universe is signaling a fresh start and infinite possibilities. You are connected to the divine source of all creation.', affirmation: 'I am infinite. I am connected to all that is.' },
  { number: '111', color: '#f59e0b', emoji: '✨', title: 'Manifestation Portal', keywords: ['manifestation','new beginnings','alignment','thoughts'], meaning: 'Your thoughts are manifesting rapidly. Stay positive and focused on what you want to create. A portal of opportunity is open — your intentions are being heard by the universe.', affirmation: 'My thoughts create my reality. I choose thoughts of love and abundance.' },
  { number: '222', color: '#22d3ee', emoji: '⚖️', title: 'Divine Balance', keywords: ['balance','harmony','partnership','trust'], meaning: 'Trust the process. Everything is unfolding in divine timing. Your relationships and partnerships are being blessed. Have faith and maintain balance in all areas of life.', affirmation: 'I trust divine timing. Everything is in perfect balance.' },
  { number: '333', color: '#f472b6', emoji: '🔺', title: 'Ascended Masters', keywords: ['ascended masters','creativity','growth','trinity'], meaning: 'The Ascended Masters are near, offering guidance and support. Your creative energy is at a peak. Express yourself authentically and trust your inner wisdom.', affirmation: 'I am guided, protected, and supported by divine wisdom.' },
  { number: '444', color: '#c9a84c', emoji: '🏛️', title: 'Angelic Foundation', keywords: ['angels','protection','foundation','stability'], meaning: 'Your angels surround you with love and protection. You are building on solid foundations. The hard work you are doing is supported by divine forces. You are exactly where you need to be.', affirmation: 'I am safe, protected, and building something beautiful.' },
  { number: '555', color: '#22c55e', emoji: '🌀', title: 'Divine Change', keywords: ['change','transformation','freedom','adventure'], meaning: 'Major life changes are coming or already underway. These changes are divinely guided and will lead to your highest good. Embrace the transformation with an open heart.', affirmation: 'I welcome change. Every transformation leads me closer to my true self.' },
  { number: '666', color: '#8b5cf6', emoji: '💜', title: 'Heart Realignment', keywords: ['balance','home','family','compassion'], meaning: 'A gentle reminder to balance your material and spiritual worlds. Refocus on love, family, and what truly matters. Release fear and return to your heart center.', affirmation: 'I release fear and return to love. My heart is my compass.' },
  { number: '777', color: '#f59e0b', emoji: '🍀', title: 'Spiritual Luck', keywords: ['luck','spirituality','wisdom','inner knowing'], meaning: 'You are in perfect alignment with the universe. Spiritual gifts are awakening within you. This is a highly auspicious sign — you are on the right path and divine luck is with you.', affirmation: 'I am aligned with divine wisdom. Miracles flow to me naturally.' },
  { number: '888', color: '#c9a84c', emoji: '♾️', title: 'Infinite Abundance', keywords: ['abundance','prosperity','karma','cycles'], meaning: 'Abundance is flowing to you from all directions. Financial and material blessings are on their way. The karmic cycle of giving and receiving is in perfect balance for you now.', affirmation: 'I am a magnet for abundance. Prosperity flows to me from all directions.' },
  { number: '999', color: '#ef4444', emoji: '🌅', title: 'Divine Completion', keywords: ['completion','endings','lightworker','release'], meaning: 'A major cycle in your life is completing. Release what no longer serves you with gratitude. You are being called to step into your role as a lightworker and serve humanity.', affirmation: 'I release the old with gratitude and welcome the new with open arms.' },
  { number: '1010', color: '#22d3ee', emoji: '🚪', title: 'New Cycle Opening', keywords: ['new cycle','awakening','divine support','opportunity'], meaning: 'A powerful new cycle is beginning. The universe is opening doors for your spiritual growth and personal development. Stay optimistic and take inspired action.', affirmation: 'New doors are opening for me. I step forward with courage and faith.' },
  { number: '1111', color: '#f59e0b', emoji: '🌟', title: 'Master Manifestation', keywords: ['master number','awakening','synchronicity','portal'], meaning: 'The most powerful manifestation number. You are awakening to your true spiritual nature. Make a wish — the universe is listening. You are a co-creator with the divine.', affirmation: 'I am awake. I am aligned. I am a powerful creator of my reality.' },
  { number: '1212', color: '#f472b6', emoji: '🌸', title: 'Spiritual Growth', keywords: ['growth','positive thinking','divine path','encouragement'], meaning: 'You are on your divine life path. Keep your thoughts positive as you are manifesting your reality rapidly. Your angels encourage you to step out of your comfort zone.', affirmation: 'I am growing into my highest self. Every step forward is blessed.' },
  { number: '1234', color: '#22c55e', emoji: '📈', title: 'Ascending Steps', keywords: ['progress','steps','simplify','forward movement'], meaning: 'You are making steady progress on your path. Take things one step at a time. Simplify your life and focus on what truly matters. Each step forward is divinely guided.', affirmation: 'I move forward with ease. Every step I take is guided and purposeful.' },
  { number: '2222', color: '#22d3ee', emoji: '🕊️', title: 'Deep Harmony', keywords: ['deep harmony','patience','divine timing','relationships'], meaning: 'Extraordinary balance and harmony are available to you. Your relationships are being divinely orchestrated. Have patience — everything is coming together in perfect divine timing.', affirmation: 'I am in perfect harmony with the universe and all beings.' },
  { number: '3333', color: '#f472b6', emoji: '🎨', title: 'Creative Explosion', keywords: ['creativity','expression','joy','masters'], meaning: 'Your creative gifts are being amplified by the Ascended Masters. Express yourself fully and joyfully. Your unique gifts are needed in the world right now.', affirmation: 'I express my creativity freely. My gifts are a blessing to the world.' },
  { number: '4444', color: '#c9a84c', emoji: '🏰', title: 'Fortress of Angels', keywords: ['strong protection','stability','hard work','divine support'], meaning: 'You are surrounded by an army of angels. The foundations you are building are incredibly strong. Your dedication and hard work are being recognized and rewarded by the divine.', affirmation: 'I am powerfully protected. My foundations are unshakeable.' },
  { number: '5555', color: '#22c55e', emoji: '🌊', title: 'Tsunami of Change', keywords: ['massive change','freedom','adventure','transformation'], meaning: 'Massive, life-altering changes are sweeping through your life. These are divinely orchestrated for your highest evolution. Surrender to the flow and trust the process completely.', affirmation: 'I surrender to divine change. I am being transformed into my highest self.' },
];

export default function DictionaryPage() {
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<typeof NUMBERS[0] | null>(null);

  const filtered = NUMBERS.filter(n =>
    n.number.includes(search) ||
    n.title.toLowerCase().includes(search.toLowerCase()) ||
    n.keywords.some(k => k.includes(search.toLowerCase()))
  );

  if (selected) {
    return (
      <div style={{ minHeight: '100vh', padding: '2rem 1rem', maxWidth: '700px', margin: '0 auto' }}>
        <button onClick={() => setSelected(null)} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '999px', padding: '0.4rem 1rem', cursor: 'pointer', color: 'rgba(255,255,255,0.6)', fontSize: '0.82rem', marginBottom: '1.5rem' }}>← Back to Dictionary</button>
        <div style={{ background: 'rgba(8,6,28,0.92)', borderRadius: '2rem', border: `1px solid ${selected.color}25`, padding: '2rem', backdropFilter: 'blur(16px)', textAlign: 'center' }}>
          <div style={{ fontSize: '3.5rem', marginBottom: '0.75rem' }}>{selected.emoji}</div>
          <div style={{ color: selected.color, fontWeight: 800, fontSize: '2.5rem', fontFamily: 'Cormorant Garamond, serif', marginBottom: '0.25rem' }}>{selected.number}</div>
          <h2 style={{ color: '#fff', fontSize: '1.25rem', fontWeight: 700, fontFamily: 'Cormorant Garamond, serif', marginBottom: '1.5rem' }}>{selected.title}</h2>
          <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '1.5rem' }}>
            {selected.keywords.map(k => <span key={k} style={{ background: `${selected.color}10`, border: `1px solid ${selected.color}20`, borderRadius: '999px', padding: '0.2rem 0.625rem', fontSize: '0.72rem', color: selected.color }}>{k}</span>)}
          </div>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.95rem', lineHeight: 1.8, marginBottom: '1.5rem', textAlign: 'left' }}>{selected.meaning}</p>
          <div style={{ background: `${selected.color}08`, borderRadius: '1.25rem', padding: '1.25rem', border: `1px solid ${selected.color}15` }}>
            <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>Affirmation</p>
            <p style={{ color: selected.color, fontSize: '1rem', fontStyle: 'italic', fontFamily: 'Cormorant Garamond, serif', lineHeight: 1.6 }}>"{selected.affirmation}"</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', padding: '2rem 1rem', maxWidth: '700px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 700, color: '#c9a84c', fontFamily: 'Cormorant Garamond, serif' }}>Angel Number Dictionary</h1>
        <p style={{ color: 'rgba(255,255,255,0.4)', marginTop: '0.25rem' }}>Tap any number to explore its divine meaning</p>
      </div>
      <div style={{ position: 'relative', marginBottom: '1.25rem' }}>
        <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.3)', fontSize: '1rem' }}>🔍</span>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search numbers, titles, keywords..." style={{ width: '100%', background: 'rgba(8,6,28,0.88)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '1rem', padding: '0.75rem 1rem 0.75rem 2.5rem', color: '#fff', fontSize: '0.88rem', outline: 'none', boxSizing: 'border-box', backdropFilter: 'blur(12px)' }} />
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(160px,1fr))', gap: '0.625rem' }}>
        {filtered.map(n => (
          <button key={n.number} onClick={() => setSelected(n)} style={{ background: 'rgba(8,6,28,0.88)', borderRadius: '1.25rem', border: `1px solid ${n.color}20`, padding: '1.25rem 0.875rem', backdropFilter: 'blur(12px)', cursor: 'pointer', textAlign: 'center', transition: 'border-color 0.2s' }}>
            <div style={{ fontSize: '1.75rem', marginBottom: '0.4rem' }}>{n.emoji}</div>
            <div style={{ color: n.color, fontWeight: 800, fontSize: '1.1rem', fontFamily: 'Cormorant Garamond, serif', marginBottom: '0.2rem' }}>{n.number}</div>
            <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.72rem', lineHeight: 1.3 }}>{n.title}</div>
          </button>
        ))}
      </div>
      {filtered.length === 0 && (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'rgba(255,255,255,0.3)' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>🔍</div>
          <p>No numbers found for "{search}"</p>
        </div>
      )}
    </div>
  );
}
