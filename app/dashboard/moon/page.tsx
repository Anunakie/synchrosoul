'use client';
import { useState } from 'react';

const MOON_PHASES = [
  { name: 'New Moon', emoji: '🌑', energy: 'New Beginnings', numbers: ['111','1111','1'],
    color: '#6366f1', ritual: 'Set intentions, plant seeds, begin new projects',
    affirmation: 'I plant seeds of intention in fertile cosmic soil.',
    description: 'The dark moon is a time of rest, reflection, and new beginnings. The veil between worlds is thin.' },
  { name: 'Waxing Crescent', emoji: '🌒', energy: 'Growth & Intention', numbers: ['222','2'],
    color: '#8b5cf6', ritual: 'Take first steps, build momentum, nurture intentions',
    affirmation: 'My intentions grow stronger with each passing day.',
    description: 'The crescent moon whispers of growth. Your intentions are taking root in the cosmic soil.' },
  { name: 'First Quarter', emoji: '🌓', energy: 'Action & Decision', numbers: ['333','3'],
    color: '#3b82f6', ritual: 'Take decisive action, overcome obstacles, push forward',
    affirmation: 'I take bold action toward my highest vision.',
    description: 'The half moon calls you to action. Challenges arise to strengthen your resolve.' },
  { name: 'Waxing Gibbous', emoji: '🌔', energy: 'Refinement & Trust', numbers: ['444','4'],
    color: '#06b6d4', ritual: 'Refine your approach, trust the process, stay committed',
    affirmation: 'I trust the divine timing of my manifestations.',
    description: 'Almost full. The universe is fine-tuning your manifestations. Trust and refine.' },
  { name: 'Full Moon', emoji: '🌕', energy: 'Manifestation & Release', numbers: ['555','1111','999'],
    color: '#c9a84c', ritual: 'Celebrate wins, release what no longer serves, charge crystals',
    affirmation: 'I am in full bloom. I release all that dims my light.',
    description: 'The full moon illuminates all. Manifestations peak. Release what no longer serves your highest good.' },
  { name: 'Waning Gibbous', emoji: '🌖', energy: 'Gratitude & Sharing', numbers: ['666','6'],
    color: '#f97316', ritual: 'Express gratitude, share wisdom, give back',
    affirmation: 'I am grateful for all the abundance in my life.',
    description: 'The moon begins to release her light. Share your gifts and express deep gratitude.' },
  { name: 'Last Quarter', emoji: '🌗', energy: 'Release & Forgiveness', numbers: ['777','7'],
    color: '#ef4444', ritual: 'Forgive, let go, clear space for new beginnings',
    affirmation: 'I release with love all that no longer serves me.',
    description: 'The half moon of release. Forgive yourself and others. Clear the energetic slate.' },
  { name: 'Waning Crescent', emoji: '🌘', energy: 'Rest & Surrender', numbers: ['888','999','8'],
    color: '#6b7280', ritual: 'Rest, meditate, surrender, prepare for new cycle',
    affirmation: 'I surrender to the divine flow and rest in cosmic peace.',
    description: 'The balsamic moon calls you inward. Rest, reflect, and prepare for the next cycle.' },
];

const MOON_SIGNS = [
  { sign: 'Aries', element: 'Fire', energy: 'Bold action, new starts', emoji: '♈' },
  { sign: 'Taurus', element: 'Earth', energy: 'Grounding, pleasure, abundance', emoji: '♉' },
  { sign: 'Gemini', element: 'Air', energy: 'Communication, curiosity', emoji: '♊' },
  { sign: 'Cancer', element: 'Water', energy: 'Emotions, home, nurturing', emoji: '♋' },
  { sign: 'Leo', element: 'Fire', energy: 'Creativity, self-expression', emoji: '♌' },
  { sign: 'Virgo', element: 'Earth', energy: 'Healing, service, refinement', emoji: '♍' },
  { sign: 'Libra', element: 'Air', energy: 'Balance, relationships, beauty', emoji: '♎' },
  { sign: 'Scorpio', element: 'Water', energy: 'Transformation, depth, power', emoji: '♏' },
  { sign: 'Sagittarius', element: 'Fire', energy: 'Expansion, truth, adventure', emoji: '♐' },
  { sign: 'Capricorn', element: 'Earth', energy: 'Discipline, achievement', emoji: '♑' },
  { sign: 'Aquarius', element: 'Air', energy: 'Innovation, community, freedom', emoji: '♒' },
  { sign: 'Pisces', element: 'Water', energy: 'Intuition, dreams, spirituality', emoji: '♓' },
];

export default function MoonPage() {
  const [selectedPhase, setSelectedPhase] = useState(MOON_PHASES[4]);
  const [tab, setTab] = useState<'phases'|'signs'>('phases');

  // Calculate approximate current moon phase based on date
  const now = new Date();
  const dayOfMonth = now.getDate();
  const approxPhaseIndex = Math.floor((dayOfMonth / 30) * 8) % 8;
  const currentMoonSign = MOON_SIGNS[now.getMonth() % 12];

  return (
    <div style={{ minHeight: '100vh', padding: '2rem 1rem', maxWidth: '900px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 700, color: '#c9a84c', fontFamily: 'Cormorant Garamond, serif' }}>Moon Calendar</h1>
        <p style={{ color: 'rgba(255,255,255,0.6)', marginTop: '0.5rem' }}>Align your angel number practice with lunar cycles</p>
      </div>

      {/* Current Moon Card */}
      <div style={{
        background: 'rgba(8,6,28,0.88)', borderRadius: '1.5rem',
        border: '1px solid rgba(201,168,76,0.3)', padding: '1.5rem',
        backdropFilter: 'blur(12px)', marginBottom: '2rem',
        display: 'flex', alignItems: 'center', gap: '1.5rem'
      }}>
        <div style={{ fontSize: '4rem' }}>{MOON_PHASES[approxPhaseIndex].emoji}</div>
        <div style={{ flex: 1 }}>
          <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem', marginBottom: '0.25rem' }}>CURRENT MOON</div>
          <h3 style={{ color: '#c9a84c', fontSize: '1.3rem', fontWeight: 700, fontFamily: 'Cormorant Garamond, serif' }}>{MOON_PHASES[approxPhaseIndex].name}</h3>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem' }}>{MOON_PHASES[approxPhaseIndex].energy}</p>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div style={{ fontSize: '1.5rem' }}>{currentMoonSign.emoji}</div>
          <div style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.8rem' }}>Moon in {currentMoonSign.sign}</div>
          <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem' }}>{currentMoonSign.energy}</div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
        {(['phases','signs'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            padding: '0.4rem 1.25rem', borderRadius: '999px', cursor: 'pointer',
            background: tab === t ? '#c9a84c' : 'rgba(255,255,255,0.08)',
            color: tab === t ? '#000' : 'rgba(255,255,255,0.7)',
            border: 'none', fontSize: '0.85rem', fontWeight: 600,
            textTransform: 'capitalize'
          }}>{t === 'phases' ? 'Moon Phases' : 'Moon Signs'}</button>
        ))}
      </div>

      {tab === 'phases' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.3fr', gap: '1.5rem' }}>
          {/* Phase list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {MOON_PHASES.map((p, i) => (
              <button key={p.name} onClick={() => setSelectedPhase(p)} style={{
                background: selectedPhase.name === p.name ? `${p.color}15` : 'rgba(255,255,255,0.04)',
                border: `1px solid ${selectedPhase.name === p.name ? p.color + '60' : 'rgba(255,255,255,0.08)'}`,
                borderRadius: '1rem', padding: '0.75rem 1rem',
                display: 'flex', alignItems: 'center', gap: '0.75rem',
                cursor: 'pointer', textAlign: 'left', width: '100%'
              }}>
                {i === approxPhaseIndex && <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#22c55e', flexShrink: 0 }} />}
                <span style={{ fontSize: '1.3rem' }}>{p.emoji}</span>
                <div>
                  <div style={{ color: '#fff', fontSize: '0.9rem', fontWeight: 600 }}>{p.name}</div>
                  <div style={{ color: p.color, fontSize: '0.75rem' }}>{p.energy}</div>
                </div>
              </button>
            ))}
          </div>

          {/* Phase detail */}
          <div style={{
            background: 'rgba(8,6,28,0.88)', borderRadius: '1.5rem',
            border: `1px solid ${selectedPhase.color}40`, padding: '1.5rem',
            backdropFilter: 'blur(12px)', alignSelf: 'start', position: 'sticky', top: '1rem'
          }}>
            <div style={{ textAlign: 'center', marginBottom: '1rem' }}>
              <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>{selectedPhase.emoji}</div>
              <h3 style={{ color: '#fff', fontSize: '1.2rem', fontWeight: 700, fontFamily: 'Cormorant Garamond, serif' }}>{selectedPhase.name}</h3>
              <p style={{ color: selectedPhase.color, fontSize: '0.85rem' }}>{selectedPhase.energy}</p>
            </div>
            <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.85rem', lineHeight: 1.6, marginBottom: '1rem' }}>{selectedPhase.description}</p>
            <div style={{ marginBottom: '1rem' }}>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.7rem', marginBottom: '0.4rem' }}>ANGEL NUMBERS</p>
              <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                {selectedPhase.numbers.map(n => (
                  <span key={n} style={{
                    background: `${selectedPhase.color}20`, border: `1px solid ${selectedPhase.color}50`,
                    borderRadius: '999px', padding: '0.2rem 0.6rem',
                    color: selectedPhase.color, fontSize: '0.8rem', fontWeight: 700
                  }}>{n}</span>
                ))}
              </div>
            </div>
            <div style={{
              background: `${selectedPhase.color}10`, borderRadius: '0.75rem',
              padding: '0.75rem', marginBottom: '1rem',
              borderLeft: `3px solid ${selectedPhase.color}`
            }}>
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.7rem', marginBottom: '0.25rem' }}>RITUAL</p>
              <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.85rem' }}>{selectedPhase.ritual}</p>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '0.75rem', padding: '0.75rem' }}>
              <p style={{ color: 'rgba(255,255,255,0.9)', fontStyle: 'italic', fontSize: '0.85rem', fontFamily: 'Cormorant Garamond, serif' }}>“{selectedPhase.affirmation}”</p>
            </div>
          </div>
        </div>
      )}

      {tab === 'signs' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem' }}>
          {MOON_SIGNS.map(s => (
            <div key={s.sign} style={{
              background: 'rgba(255,255,255,0.04)', borderRadius: '1rem',
              border: '1px solid rgba(255,255,255,0.08)', padding: '1rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '1.5rem' }}>{s.emoji}</span>
                <div>
                  <div style={{ color: '#fff', fontWeight: 600 }}>{s.sign}</div>
                  <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem' }}>{s.element}</div>
                </div>
              </div>
              <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.8rem' }}>{s.energy}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}