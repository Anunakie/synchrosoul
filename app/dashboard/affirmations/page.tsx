'use client';
import { useState, useEffect } from 'react';

const affirmationSets: Record<string, { title: string; color: string; emoji: string; affirmations: string[] }> = {
  abundance: { title: 'Abundance', color: '#c9a84c', emoji: '✨', affirmations: ['I am a magnet for miracles and abundance', 'Money flows to me easily and effortlessly', 'I deserve all the wealth and prosperity the universe offers', 'My income is constantly increasing', 'I am open to receiving abundance in all its forms', 'The universe always provides for my needs and desires', 'I attract opportunities that create financial freedom', 'Abundance is my natural state of being'] },
  love: { title: 'Love', color: '#f48fb1', emoji: '💞', affirmations: ['I am worthy of deep, unconditional love', 'Love flows to me and through me freely', 'I attract loving, supportive relationships', 'My heart is open to giving and receiving love', 'I am loved beyond measure by the universe', 'I radiate love and it returns to me multiplied', 'My soulmate is being guided to me right now', 'I am complete and whole, love enhances my wholeness'] },
  healing: { title: 'Healing', color: '#48bb78', emoji: '🌿', affirmations: ['My body knows how to heal itself perfectly', 'Every cell in my body vibrates with health and vitality', 'I release all pain and welcome healing light', 'I am grateful for my strong and healthy body', 'Divine healing energy flows through me now', 'I choose thoughts that support my wellbeing', 'I am at peace with my body and my journey', 'Healing is happening in every moment'] },
  confidence: { title: 'Confidence', color: '#ed8936', emoji: '🦁', affirmations: ['I am powerful beyond measure', 'I trust myself completely and deeply', 'I speak my truth with clarity and confidence', 'I am worthy of success and recognition', 'My unique gifts are needed in this world', 'I walk into every room knowing my worth', 'I am capable of achieving anything I set my mind to', 'My confidence grows stronger every single day'] },
  spiritual: { title: 'Spiritual', color: '#9b59b6', emoji: '🔮', affirmations: ['I am divinely guided and protected at all times', 'I trust the universe has a perfect plan for me', 'I am connected to infinite wisdom and love', 'My intuition is my superpower', 'I am a spiritual being having a human experience', 'Angels and guides surround me with love', 'I am aligned with my highest purpose', 'The universe speaks to me through signs and synchronicities'] },
  protection: { title: 'Protection', color: '#4299e1', emoji: '🛡️', affirmations: ['I am surrounded by divine white light and protection', 'Only love and light can enter my energy field', 'I release all fear and embrace divine safety', 'I am shielded from all negative energies', 'My boundaries are clear, loving, and respected', 'I am safe in all situations and circumstances', 'The universe protects me in all my endeavors', 'I walk in the light and the light walks with me'] },
  manifestation: { title: 'Manifestation', color: '#b794f4', emoji: '🌟', affirmations: ['Everything I desire is already mine in the quantum field', 'I am a powerful conscious creator of my reality', 'My thoughts and feelings shape my world', 'I visualize my dreams and they become real', 'The universe conspires in my favor always', 'I am worthy of everything I desire to manifest', 'My manifestations arrive at the perfect divine time', 'I act as if my dreams are already real'] },
  gratitude: { title: 'Gratitude', color: '#68d391', emoji: '🙏', affirmations: ['I am grateful for the miracle of this moment', 'Gratitude opens the door to more blessings', 'I find beauty and gifts in every experience', 'Thank you universe for all that I have and all that is coming', 'My grateful heart attracts more to be grateful for', 'I appreciate the small miracles in every day', 'Gratitude is my superpower and my prayer', 'I live in a constant state of thankfulness'] },
};

export default function AffirmationsPage() {
  const [category, setCategory] = useState('abundance');
  const [currentIdx, setCurrentIdx] = useState(0);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [tab, setTab] = useState<'browse'|'favorites'>('browse');

  useEffect(() => {
    const saved = localStorage.getItem('synchrosoul_affirmation_favs');
    if (saved) setFavorites(JSON.parse(saved));
  }, []);

  const toggleFav = (aff: string) => {
    const updated = favorites.includes(aff) ? favorites.filter(f => f !== aff) : [...favorites, aff];
    setFavorites(updated);
    localStorage.setItem('synchrosoul_affirmation_favs', JSON.stringify(updated));
  };

  const set = affirmationSets[category];
  const current = set.affirmations[currentIdx];
  const next = () => setCurrentIdx(i => (i + 1) % set.affirmations.length);
  const prev = () => setCurrentIdx(i => (i - 1 + set.affirmations.length) % set.affirmations.length);

  return (
    <div style={{ minHeight: '100vh', padding: '2rem 1rem', maxWidth: '680px', margin: '0 auto' }}>
      <h1 style={{ textAlign: 'center', fontSize: '1.8rem', fontWeight: 700, color: '#e8d5b7', marginBottom: '0.5rem' }}>🌟 Affirmations</h1>
      <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.5)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>Sacred words to reprogram your reality</p>

      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', marginBottom: '1.5rem' }}>
        {(['browse','favorites'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)} style={{ padding: '0.5rem 1.25rem', borderRadius: '999px', background: tab === t ? 'rgba(201,168,76,0.2)' : 'rgba(255,255,255,0.05)', border: tab === t ? '1px solid rgba(201,168,76,0.4)' : '1px solid rgba(255,255,255,0.1)', color: tab === t ? '#c9a84c' : 'rgba(255,255,255,0.5)', cursor: 'pointer', fontSize: '0.85rem', textTransform: 'capitalize' }}>{t} {t === 'favorites' ? '(' + favorites.length + ')' : ''}</button>
        ))}
      </div>

      {tab === 'browse' && (
        <>
          <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '1.5rem' }}>
            {Object.entries(affirmationSets).map(([key, val]) => (
              <button key={key} onClick={() => { setCategory(key); setCurrentIdx(0); }} style={{ padding: '0.4rem 0.9rem', borderRadius: '999px', background: category === key ? val.color + '33' : 'rgba(255,255,255,0.05)', border: category === key ? '1px solid ' + val.color + '66' : '1px solid rgba(255,255,255,0.08)', color: category === key ? val.color : 'rgba(255,255,255,0.5)', cursor: 'pointer', fontSize: '0.8rem' }}>{val.emoji} {val.title}</button>
            ))}
          </div>

          <div style={{ background: 'rgba(8,6,28,0.88)', border: '1px solid ' + set.color + '44', borderRadius: '1.5rem', padding: '2.5rem 2rem', backdropFilter: 'blur(12px)', textAlign: 'center', marginBottom: '1rem', minHeight: '200px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{set.emoji}</div>
            <p style={{ color: '#e8d5b7', fontSize: '1.2rem', lineHeight: 1.7, fontStyle: 'italic', margin: '0 0 1.5rem 0' }}>“{current}”</p>
            <button onClick={() => toggleFav(current)} style={{ background: favorites.includes(current) ? set.color + '33' : 'rgba(255,255,255,0.05)', border: '1px solid ' + (favorites.includes(current) ? set.color + '66' : 'rgba(255,255,255,0.1)'), color: favorites.includes(current) ? set.color : 'rgba(255,255,255,0.4)', padding: '0.4rem 1rem', borderRadius: '999px', cursor: 'pointer', fontSize: '0.85rem' }}>{favorites.includes(current) ? '★ Saved' : '☆ Save'}</button>
          </div>

          <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', marginBottom: '1.5rem' }}>
            <button onClick={prev} style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.7)', padding: '0.7rem 1.5rem', borderRadius: '999px', cursor: 'pointer', fontSize: '0.9rem' }}>← Prev</button>
            <span style={{ color: 'rgba(255,255,255,0.3)', display: 'flex', alignItems: 'center', fontSize: '0.85rem' }}>{currentIdx + 1} / {set.affirmations.length}</span>
            <button onClick={next} style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.7)', padding: '0.7rem 1.5rem', borderRadius: '999px', cursor: 'pointer', fontSize: '0.9rem' }}>Next →</button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {set.affirmations.map((aff, i) => (
              <div key={i} onClick={() => setCurrentIdx(i)} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1rem', borderRadius: '0.75rem', background: i === currentIdx ? set.color + '15' : 'rgba(8,6,28,0.6)', border: i === currentIdx ? '1px solid ' + set.color + '44' : '1px solid rgba(255,255,255,0.05)', cursor: 'pointer' }}>
                <span style={{ color: i === currentIdx ? set.color : 'rgba(255,255,255,0.2)', fontSize: '0.8rem', minWidth: '1.5rem' }}>{i + 1}.</span>
                <span style={{ color: i === currentIdx ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.5)', fontSize: '0.85rem', flex: 1 }}>{aff}</span>
                {favorites.includes(aff) && <span style={{ color: set.color, fontSize: '0.8rem' }}>★</span>}
              </div>
            ))}
          </div>
        </>
      )}

      {tab === 'favorites' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {favorites.length === 0 ? (
            <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.4)', padding: '3rem' }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>☆</div>
              <p>No saved affirmations yet. Browse and save your favorites!</p>
            </div>
          ) : favorites.map((aff, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem 1.25rem', borderRadius: '0.9rem', background: 'rgba(8,6,28,0.85)', border: '1px solid rgba(201,168,76,0.2)', backdropFilter: 'blur(8px)' }}>
              <span style={{ color: '#c9a84c', fontSize: '1rem' }}>★</span>
              <span style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.9rem', flex: 1, fontStyle: 'italic' }}>{aff}</span>
              <button onClick={() => toggleFav(aff)} style={{ background: 'none', border: 'none', color: 'rgba(255,100,100,0.6)', cursor: 'pointer', fontSize: '1rem' }}>×</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
