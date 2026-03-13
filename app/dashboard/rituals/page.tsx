'use client';
import { useState } from 'react';
import MusicPlayer from '@/components/MusicPlayer'

const RITUALS = [
  { id: 'new-moon', title: 'New Moon Intention Setting', icon: '🌑', color: '#6366f1',
    timing: 'New Moon · 30 min', category: 'Moon',
    description: 'A sacred ceremony to plant seeds of intention in the fertile darkness of the new moon.',
    materials: ['White candle', 'Journal & pen', 'Crystals (clear quartz or moonstone)', 'Sage or palo santo'],
    steps: [
      'Cleanse your space by burning sage or palo santo, moving clockwise.',
      'Light your white candle and sit comfortably before it.',
      'Close your eyes and breathe deeply 9 times, releasing the old cycle.',
      'Open your journal and write: In this lunar cycle, I intend to...',
      'Write 3-5 clear, present-tense intentions as if already manifested.',
      'Hold your crystal and speak each intention aloud to the universe.',
      'Visualize each intention as already real. Feel the emotions fully.',
      'Close with gratitude: Thank you for these blessings, already on their way.',
      'Let the candle burn safely for at least 30 minutes.',
    ],
    numbers: ['111','1111','222'] },
  { id: 'angel-altar', title: 'Angel Number Altar', icon: '✨', color: '#c9a84c',
    timing: 'Any time · 20 min setup', category: 'Spiritual',
    description: 'Create a sacred space dedicated to your angel number practice and divine communication.',
    materials: ['Small table or shelf', 'White cloth', 'Candles in your number colors', 'Crystals', 'Paper with your numbers'],
    steps: [
      'Choose a quiet corner or shelf for your altar.',
      'Lay a white or gold cloth as the foundation.',
      'Write your most frequently seen angel numbers on paper and place in center.',
      'Arrange crystals that correspond to your numbers around the paper.',
      'Place candles in colors matching your numbers (gold for 1111, blue for 222, etc.).',
      'Add any meaningful objects: feathers, flowers, photos.',
      'Light the candles and sit before your altar for 5 minutes daily.',
      'Use this space to log new angel number sightings and journal.',
    ],
    numbers: ['444','1111','777'] },
  { id: 'full-moon-release', title: 'Full Moon Release Ritual', icon: '🌕', color: '#c9a84c',
    timing: 'Full Moon · 45 min', category: 'Moon',
    description: 'A powerful ceremony to release what no longer serves you under the illuminating full moon.',
    materials: ['Fire-safe bowl', 'Paper & pen', 'Black candle', 'Salt', 'Water'],
    steps: [
      'Fill a bowl with water and add a pinch of salt for purification.',
      'Light the black candle to absorb and transmute negative energy.',
      'Write on paper everything you wish to release: fears, patterns, relationships, beliefs.',
      'Be specific and honest. This is sacred and private.',
      'Read each item aloud, then say: I release you with love and gratitude.',
      'Safely burn the paper in the fire-safe bowl (or tear into tiny pieces).',
      'Submerge the ashes in the salt water, symbolizing purification.',
      'Pour the water outside or down the drain, releasing it to the earth.',
      'Sit in the moonlight and breathe in fresh, clear energy.',
    ],
    numbers: ['999','555','333'] },
  { id: 'morning-activation', title: 'Morning Angel Activation', icon: '🌅', color: '#f97316',
    timing: 'Every morning · 10 min', category: 'Daily',
    description: 'Start each day by activating your connection to angelic guidance and setting your energetic tone.',
    materials: ['Journal', 'Pen', 'Optional: candle or incense'],
    steps: [
      'Before checking your phone, sit up in bed and take 3 deep breaths.',
      'Place your hands on your heart and say: Good morning, angels. I am open to your guidance today.',
      'Set one clear intention for the day. Write it in your journal.',
      'Ask: What angel numbers should I watch for today?',
      'Sit in silence for 2 minutes and notice any numbers, images, or feelings.',
      'Write down any impressions you receive.',
      'Close with: I am guided, protected, and loved. Today is a magical day.',
      'Open your SynchroSoul app and log any numbers that come to you.',
    ],
    numbers: ['111','333','444'] },
  { id: 'crystal-charging', title: 'Crystal Charging Ceremony', icon: '💎', color: '#8b5cf6',
    timing: 'Full Moon or Sunday · 15 min', category: 'Crystals',
    description: 'Cleanse and charge your crystals with moonlight, intention, and angel number energy.',
    materials: ['Your crystals', 'Moonlight or sunlight', 'Sage', 'Journal'],
    steps: [
      'Gather all your crystals and cleanse them with sage smoke.',
      'Hold each crystal and set a clear intention for its purpose.',
      'Place crystals on a windowsill or outside to charge in moonlight overnight.',
      'Write the angel numbers associated with each crystal in your journal.',
      'In the morning, retrieve your crystals and hold each one.',
      'Feel the renewed energy. Thank the moon and your angels.',
      'Place crystals on your altar or carry them with you.',
    ],
    numbers: ['777','444','1111'] },
  { id: 'number-bath', title: 'Sacred Number Bath', icon: '🛁', color: '#06b6d4',
    timing: 'Weekly · 30 min', category: 'Self-Care',
    description: 'A luxurious spiritual bath ritual using your angel numbers to cleanse your aura and raise your vibration.',
    materials: ['Bath salts or Epsom salt', 'Essential oils', 'Candles', 'Rose petals (optional)', 'Crystals'],
    steps: [
      'Add 1-2 cups of Epsom salt to warm bath water for energetic cleansing.',
      'Add essential oils: lavender for peace, rose for love, frankincense for spiritual connection.',
      'Place candles and crystals around the bath.',
      'As you enter the water, visualize it as liquid light cleansing your aura.',
      'Soak for at least 20 minutes, breathing deeply.',
      'Mentally repeat your most significant angel number as a mantra.',
      'Visualize any stress, negativity, or stagnant energy dissolving into the water.',
      'As you drain the bath, watch the old energy spiral away.',
      'Emerge feeling renewed, cleansed, and vibrationally elevated.',
    ],
    numbers: ['222','555','888'] },
];

const CATEGORIES = ['All', 'Moon', 'Spiritual', 'Daily', 'Crystals', 'Self-Care'];

export default function RitualsPage() {
  const [selected, setSelected] = useState(RITUALS[0]);
  const [category, setCategory] = useState('All');
  const [checkedSteps, setCheckedSteps] = useState<number[]>([]);

  const filtered = category === 'All' ? RITUALS : RITUALS.filter(r => r.category === category);
  const toggleStep = (i: number) => setCheckedSteps(prev =>
    prev.includes(i) ? prev.filter(x => x !== i) : [...prev, i]
  );
  const selectRitual = (r: typeof RITUALS[0]) => { setSelected(r); setCheckedSteps([]); };

  return (
    <div style={{ minHeight: '100vh', padding: '2rem 1rem', maxWidth: '900px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 700, color: '#c9a84c', fontFamily: 'Cormorant Garamond, serif' }}>Sacred Rituals</h1>
        <p style={{ color: 'rgba(255,255,255,0.6)', marginTop: '0.5rem' }}>Ceremonies and practices for spiritual alignment</p>
      </div>

      {/* Category filter */}
      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.5rem', justifyContent: 'center' }}>
        {CATEGORIES.map(c => (
          <button key={c} onClick={() => setCategory(c)} style={{
            padding: '0.35rem 0.9rem', borderRadius: '999px', cursor: 'pointer',
            background: category === c ? '#c9a84c' : 'rgba(255,255,255,0.08)',
            color: category === c ? '#000' : 'rgba(255,255,255,0.7)',
            border: 'none', fontSize: '0.8rem', fontWeight: 600
          }}>{c}</button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: '1.5rem' }}>
        {/* Ritual List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {filtered.map(r => (
            <button key={r.id} onClick={() => selectRitual(r)} style={{
              background: selected.id === r.id ? `${r.color}15` : 'rgba(255,255,255,0.04)',
              border: `1px solid ${selected.id === r.id ? r.color + '60' : 'rgba(255,255,255,0.08)'}`,
              borderRadius: '1rem', padding: '0.85rem 1rem',
              cursor: 'pointer', textAlign: 'left', width: '100%'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <span style={{ fontSize: '1.5rem' }}>{r.icon}</span>
                <div>
                  <div style={{ color: '#fff', fontWeight: 600, fontSize: '0.9rem' }}>{r.title}</div>
                  <div style={{ color: r.color, fontSize: '0.72rem', marginTop: '0.1rem' }}>{r.timing}</div>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* Ritual Detail */}
        <div style={{
          background: 'rgba(8,6,28,0.88)', borderRadius: '1.5rem',
          border: `1px solid ${selected.color}40`, padding: '1.5rem',
          backdropFilter: 'blur(12px)', alignSelf: 'start', position: 'sticky', top: '1rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
            <span style={{ fontSize: '2rem' }}>{selected.icon}</span>
            <div>
              <h3 style={{ color: '#fff', fontSize: '1.1rem', fontWeight: 700, fontFamily: 'Cormorant Garamond, serif' }}>{selected.title}</h3>
              <p style={{ color: selected.color, fontSize: '0.8rem' }}>{selected.timing}</p>
            </div>
          </div>

          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', lineHeight: 1.6, marginBottom: '1rem' }}>{selected.description}</p>

          {/* Numbers */}
          <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '1rem' }}>
            {selected.numbers.map(n => (
              <span key={n} style={{
                background: `${selected.color}20`, border: `1px solid ${selected.color}40`,
                borderRadius: '999px', padding: '0.2rem 0.6rem',
                color: selected.color, fontSize: '0.8rem', fontWeight: 700
              }}>{n}</span>
            ))}
          </div>

          {/* Materials */}
          <div style={{ marginBottom: '1rem' }}>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.7rem', marginBottom: '0.4rem' }}>YOU WILL NEED</p>
            <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
              {selected.materials.map(m => (
                <span key={m} style={{
                  background: 'rgba(255,255,255,0.06)', borderRadius: '999px',
                  padding: '0.2rem 0.6rem', color: 'rgba(255,255,255,0.65)', fontSize: '0.75rem'
                }}>{m}</span>
              ))}
            </div>
          </div>

          {/* Steps */}
          <div>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.7rem', marginBottom: '0.5rem' }}>STEPS ({checkedSteps.length}/{selected.steps.length} complete)</p>
            {selected.steps.map((step, i) => (
              <button key={i} onClick={() => toggleStep(i)} style={{
                display: 'flex', gap: '0.75rem', alignItems: 'flex-start',
                width: '100%', background: 'none', border: 'none',
                cursor: 'pointer', padding: '0.4rem 0', textAlign: 'left'
              }}>
                <div style={{
                  width: '20px', height: '20px', borderRadius: '50%', flexShrink: 0, marginTop: '0.1rem',
                  background: checkedSteps.includes(i) ? selected.color : 'rgba(255,255,255,0.08)',
                  border: `1px solid ${checkedSteps.includes(i) ? selected.color : 'rgba(255,255,255,0.2)'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '0.6rem', color: '#000'
                }}>{checkedSteps.includes(i) ? '✓' : ''}</div>
                <span style={{
                  color: checkedSteps.includes(i) ? 'rgba(255,255,255,0.35)' : 'rgba(255,255,255,0.75)',
                  fontSize: '0.82rem', lineHeight: 1.5,
                  textDecoration: checkedSteps.includes(i) ? 'line-through' : 'none'
                }}>{step}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    
      {/* Sacred Sounds */}
      <div style={{ marginTop: '1.5rem' }}>
        <MusicPlayer defaultCategory="healing" title="Ritual Ambience" />
      </div>
    </div>
  );
}