'use client';
import { useState } from 'react';

const CRYSTALS = [
  { name: 'Amethyst', emoji: '💜', color: '#8b5cf6', numbers: ['777', '1111', '333'], chakra: 'Crown', element: 'Air', affirmation: 'I am divinely guided and spiritually awakened.', properties: ['Spiritual protection', 'Intuition amplifier', 'Dream enhancer', 'Anxiety relief', 'Psychic development'], howToUse: 'Place under your pillow to enhance dreams. Hold during meditation when seeing 777. Wear as jewelry for continuous spiritual protection.', angelMessage: 'When you see 777 and hold amethyst, you are creating a direct channel to your higher self. The purple ray of transformation is activating.' },
  { name: 'Clear Quartz', emoji: '🔮', color: '#e2e8f0', numbers: ['1111', '1212', '111'], chakra: 'All', element: 'All', affirmation: 'I am a clear channel for divine light and truth.', properties: ['Master healer', 'Amplifies intentions', 'Clarity of mind', 'Energy magnifier', 'Manifestation booster'], howToUse: 'Program with your intention by holding it and stating your desire three times. Place on your journal when logging 1111. Use in crystal grids.', angelMessage: 'Clear quartz is the universe\u2019s antenna. When 1111 appears, your quartz is already vibrating at the frequency of your manifestation.' },
  { name: 'Rose Quartz', emoji: '🌸', color: '#f9a8d4', numbers: ['222', '444', '1212'], chakra: 'Heart', element: 'Water', affirmation: 'I am worthy of infinite love and I give love freely.', properties: ['Unconditional love', 'Self-love healer', 'Relationship harmony', 'Emotional healing', 'Compassion opener'], howToUse: 'Place over your heart during meditation. Keep in your bedroom for relationship harmony. Hold when journaling about love after seeing 222.', angelMessage: 'The angels send 222 when your heart is ready to receive love. Rose quartz opens the door they are knocking on.' },
  { name: 'Citrine', emoji: '🌟', color: '#f59e0b', numbers: ['888', '555', '111'], chakra: 'Solar Plexus', element: 'Fire', affirmation: 'Abundance flows to me naturally and effortlessly.', properties: ['Abundance magnet', 'Confidence booster', 'Creativity spark', 'Joy amplifier', 'Manifestation crystal'], howToUse: 'Place in the wealth corner of your home (far left from entrance). Carry in your wallet. Hold when you see 888 to amplify financial flow.', angelMessage: 'Citrine never needs cleansing — it only transmits positive energy. When 888 appears, your citrine is already celebrating your incoming abundance.' },
  { name: 'Black Tourmaline', emoji: '🖤', color: '#374151', numbers: ['444', '999', '1111'], chakra: 'Root', element: 'Earth', affirmation: 'I am protected, grounded, and safe in all dimensions.', properties: ['Psychic protection', 'EMF shield', 'Grounding stone', 'Negative energy absorber', 'Anxiety neutralizer'], howToUse: 'Place at the four corners of your home for protection grid. Carry when in crowded spaces. Cleanse monthly under running water.', angelMessage: 'When 444 appears, your angels are already surrounding you. Black tourmaline makes their protective shield physical and tangible.' },
  { name: 'Lapis Lazuli', emoji: '🔵', color: '#1d4ed8', numbers: ['333', '777', '1111'], chakra: 'Third Eye', element: 'Water', affirmation: 'I speak my truth and trust my inner wisdom.', properties: ['Truth revealer', 'Wisdom activator', 'Communication enhancer', 'Third eye opener', 'Ancient knowledge'], howToUse: 'Place on your forehead during meditation. Wear as a necklace near your throat. Journal with lapis nearby when receiving 333 messages.', angelMessage: 'Lapis lazuli was the stone of pharaohs and high priests. When 333 appears, the Ascended Masters are activating your ancient wisdom through this stone.' },
  { name: 'Selenite', emoji: '🤍', color: '#f1f5f9', numbers: ['1111', '222', '777'], chakra: 'Crown', element: 'Spirit', affirmation: 'I am connected to the highest realms of light and love.', properties: ['Angelic connection', 'Space cleanser', 'Aura cleanser', 'Mental clarity', 'Higher self access'], howToUse: 'Never cleanse with water — it dissolves. Wave over your body to cleanse aura. Place on windowsills to purify your space. Use as a wand in rituals.', angelMessage: 'Selenite is named after Selene, goddess of the moon. It holds the frequency of pure angelic light — the same frequency as 1111.' },
  { name: 'Labradorite', emoji: '🌈', color: '#06b6d4', numbers: ['555', '1212', '333'], chakra: 'Third Eye', element: 'Water', affirmation: 'I embrace transformation and trust the magic of change.', properties: ['Transformation stone', 'Magic amplifier', 'Synchronicity enhancer', 'Intuition booster', 'Aura protector'], howToUse: 'Carry during times of major change. Meditate with it when seeing 555. Its flash of color (labradorescence) activates when your energy aligns.', angelMessage: 'Labradorite shows its true colors only when light hits it at the right angle — just like you. When 555 appears, your transformation is revealing your hidden brilliance.' },
  { name: 'Moldavite', emoji: '💚', color: '#16a34a', numbers: ['999', '1111', '555'], chakra: 'Heart', element: 'Cosmic', affirmation: 'I welcome rapid spiritual evolution and cosmic transformation.', properties: ['Rapid transformation', 'Cosmic connection', 'Spiritual acceleration', 'Past life access', 'Manifestation amplifier'], howToUse: 'Use with caution — its energy is intense. Start with short sessions. Place on heart chakra. Combine with grounding stones like black tourmaline.', angelMessage: 'Moldavite fell from the sky 15 million years ago. It carries cosmic intelligence. When 999 appears alongside moldavite, a major life chapter is completing.' },
  { name: 'Moonstone', emoji: '🌙', color: '#c7d2fe', numbers: ['222', '1212', '333'], chakra: 'Sacral', element: 'Water', affirmation: 'I flow with divine timing and trust the cycles of life.', properties: ['Intuition enhancer', 'Divine feminine', 'New beginnings', 'Emotional balance', 'Psychic sensitivity'], howToUse: 'Charge under the full moon monthly. Wear during new moon rituals. Hold when journaling about relationships and divine timing after seeing 222.', angelMessage: 'Moonstone carries the energy of the moon’s cycles. When 222 appears, the universe is reminding you that divine timing is as reliable as the tides.' },
];

const CHAKRA_COLORS: Record<string, string> = {
  'Crown': '#8b5cf6', 'Third Eye': '#6366f1', 'Throat': '#3b82f6', 'Heart': '#22c55e',
  'Solar Plexus': '#f59e0b', 'Sacral': '#f97316', 'Root': '#ef4444', 'All': '#e2e8f0', 'Spirit': '#f1f5f9'
};

export default function CrystalsPage() {
  const [selected, setSelected] = useState<string | null>(null);
  const [filter, setFilter] = useState<string>('all');
  const [search, setSearch] = useState('');

  const chakras = ['all', 'Crown', 'Third Eye', 'Heart', 'Solar Plexus', 'Root', 'All'];

  const filtered = CRYSTALS.filter(c => {
    const matchChakra = filter === 'all' || c.chakra === filter;
    const matchSearch = !search || c.name.toLowerCase().includes(search.toLowerCase()) || c.numbers.some(n => n.includes(search));
    return matchChakra && matchSearch;
  });

  const selectedCrystal = CRYSTALS.find(c => c.name === selected);

  return (
    <div style={{ minHeight: '100vh', padding: '2rem 1rem', maxWidth: '700px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 700, color: '#c7d2fe', fontFamily: 'Cormorant Garamond, serif' }}>Crystal Guide</h1>
        <p style={{ color: 'rgba(255,255,255,0.4)', marginTop: '0.25rem' }}>Sacred stones aligned with your angel numbers</p>
      </div>

      {/* Search */}
      <input value={search} onChange={e => setSearch(e.target.value)}
        placeholder="Search crystals or angel numbers..."
        style={{ width: '100%', boxSizing: 'border-box', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '999px', padding: '0.75rem 1.25rem', color: '#fff', fontSize: '0.9rem', outline: 'none', marginBottom: '1rem' }} />

      {/* Chakra filter */}
      <div style={{ display: 'flex', gap: '0.4rem', overflowX: 'auto', paddingBottom: '0.5rem', marginBottom: '1.25rem' }}>
        {chakras.map(c => (
          <button key={c} onClick={() => setFilter(c)} style={{
            flexShrink: 0, padding: '0.35rem 0.875rem', borderRadius: '999px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 600,
            background: filter === c ? 'rgba(199,210,254,0.15)' : 'rgba(255,255,255,0.04)',
            border: filter === c ? '1px solid rgba(199,210,254,0.3)' : '1px solid rgba(255,255,255,0.08)',
            color: filter === c ? '#c7d2fe' : 'rgba(255,255,255,0.4)',
            textTransform: 'capitalize'
          }}>{c === 'all' ? 'All Crystals' : c}</button>
        ))}
      </div>

      {/* Crystal grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.6rem', marginBottom: '1.5rem' }}>
        {filtered.map(crystal => (
          <div key={crystal.name} onClick={() => setSelected(selected === crystal.name ? null : crystal.name)} style={{
            background: selected === crystal.name ? `${crystal.color}12` : 'rgba(8,6,28,0.88)',
            borderRadius: '1.25rem', border: selected === crystal.name ? `1px solid ${crystal.color}30` : '1px solid rgba(255,255,255,0.07)',
            padding: '1rem', cursor: 'pointer', backdropFilter: 'blur(12px)'
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>{crystal.emoji}</div>
            <p style={{ color: '#fff', fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.2rem' }}>{crystal.name}</p>
            <p style={{ color: CHAKRA_COLORS[crystal.chakra] || '#a78bfa', fontSize: '0.7rem', marginBottom: '0.4rem' }}>{crystal.chakra} Chakra</p>
            <div style={{ display: 'flex', gap: '0.25rem', flexWrap: 'wrap' }}>
              {crystal.numbers.map(n => (
                <span key={n} style={{ background: `${crystal.color}15`, borderRadius: '999px', padding: '0.1rem 0.4rem', fontSize: '0.62rem', color: crystal.color }}>{n}</span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Selected crystal detail */}
      {selectedCrystal && (
        <div style={{ background: 'rgba(8,6,28,0.95)', borderRadius: '1.5rem', border: `1px solid ${selectedCrystal.color}25`, padding: '1.5rem', backdropFilter: 'blur(12px)', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem' }}>
            <span style={{ fontSize: '2.5rem' }}>{selectedCrystal.emoji}</span>
            <div>
              <h2 style={{ color: '#fff', fontSize: '1.3rem', fontWeight: 700, fontFamily: 'Cormorant Garamond, serif' }}>{selectedCrystal.name}</h2>
              <p style={{ color: selectedCrystal.color, fontSize: '0.8rem' }}>{selectedCrystal.chakra} Chakra · {selectedCrystal.element} Element</p>
            </div>
          </div>

          <div style={{ background: `${selectedCrystal.color}08`, borderRadius: '0.875rem', padding: '0.875rem', borderLeft: `3px solid ${selectedCrystal.color}40`, marginBottom: '1rem' }}>
            <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.62rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.35rem' }}>Angel Message</p>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', lineHeight: 1.6, fontStyle: 'italic' }}>{selectedCrystal.angelMessage}</p>
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.62rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>Properties</p>
            <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
              {selectedCrystal.properties.map(p => (
                <span key={p} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '999px', padding: '0.2rem 0.6rem', fontSize: '0.72rem', color: 'rgba(255,255,255,0.6)' }}>{p}</span>
              ))}
            </div>
          </div>

          <div style={{ marginBottom: '1rem' }}>
            <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.62rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>How To Use</p>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.83rem', lineHeight: 1.6 }}>{selectedCrystal.howToUse}</p>
          </div>

          <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '0.875rem', padding: '0.875rem' }}>
            <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.62rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.35rem' }}>Daily Affirmation</p>
            <p style={{ color: selectedCrystal.color, fontSize: '0.88rem', lineHeight: 1.6, fontStyle: 'italic', fontFamily: 'Cormorant Garamond, serif' }}>&ldquo;{selectedCrystal.affirmation}&rdquo;</p>
          </div>
        </div>
      )}
    </div>
  );
}