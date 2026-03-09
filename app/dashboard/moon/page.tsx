'use client';
import { useState, useEffect } from 'react';

const MOON_PHASES = [
  { name: 'New Moon', emoji: '🌑', color: '#6366f1', numbers: ['111','1111'], energy: 'New beginnings, intention setting, planting seeds', ritual: 'Write 3 intentions by candlelight. Bury a crystal in soil to charge.', affirmation: 'I plant seeds of intention in fertile darkness.', avoid: 'Starting arguments, making major decisions from fear' },
  { name: 'Waxing Crescent', emoji: '🌒', color: '#8b5cf6', numbers: ['222','333'], energy: 'Growth, momentum, taking first steps', ritual: 'Take one concrete action toward your new moon intention.', affirmation: 'I take inspired action toward my dreams.', avoid: 'Doubt and second-guessing your intentions' },
  { name: 'First Quarter', emoji: '🌓', color: '#a78bfa', numbers: ['444','555'], energy: 'Challenges, decisions, pushing through resistance', ritual: 'Identify one obstacle and write how you will overcome it.', affirmation: 'I face challenges with courage and clarity.', avoid: 'Giving up when things get difficult' },
  { name: 'Waxing Gibbous', emoji: '🌔', color: '#c9a84c', numbers: ['666','777'], energy: 'Refinement, patience, trust in the process', ritual: 'Review your intentions. Adjust your approach with wisdom.', affirmation: 'I trust divine timing and refine my path.', avoid: 'Forcing outcomes before they are ready' },
  { name: 'Full Moon', emoji: '🌕', color: '#f59e0b', numbers: ['777','888','1111'], energy: 'Manifestation, illumination, peak energy, release', ritual: 'Charge crystals under moonlight. Write what you are releasing. Burn the paper safely.', affirmation: 'I release what no longer serves and receive my blessings.', avoid: 'Emotional reactivity — energy is amplified now' },
  { name: 'Waning Gibbous', emoji: '🌖', color: '#22c55e', numbers: ['999','888'], energy: 'Gratitude, sharing, integration', ritual: 'Write 10 things you are grateful for. Share your gifts with others.', affirmation: 'I am grateful for all that I have received.', avoid: 'Hoarding energy or blessings — share them' },
  { name: 'Last Quarter', emoji: '🌗', color: '#22d3ee', numbers: ['999','555'], energy: 'Release, forgiveness, letting go', ritual: 'Forgiveness meditation. Release one grudge or old story.', affirmation: 'I forgive freely and release the past with love.', avoid: 'Holding onto what is clearly complete' },
  { name: 'Waning Crescent', emoji: '🌘', color: '#60a5fa', numbers: ['999','222'], energy: 'Rest, reflection, surrender, preparation', ritual: 'Rest deeply. Journal your lessons from this lunar cycle.', affirmation: 'I rest and surrender, trusting the next cycle.', avoid: 'Starting new projects — honor the need for rest' },
];

const MOON_SIGNS = [
  { sign: 'Aries', emoji: '♈', color: '#ef4444', numbers: ['111','333'], energy: 'Bold action, courage, new starts' },
  { sign: 'Taurus', emoji: '♉', color: '#22c55e', numbers: ['444','888'], energy: 'Stability, abundance, sensual pleasure' },
  { sign: 'Gemini', emoji: '♊', color: '#f59e0b', numbers: ['333','555'], energy: 'Communication, curiosity, duality' },
  { sign: 'Cancer', emoji: '♋', color: '#60a5fa', numbers: ['222','444'], energy: 'Emotions, home, nurturing, intuition' },
  { sign: 'Leo', emoji: '♌', color: '#f97316', numbers: ['111','888'], energy: 'Creativity, confidence, self-expression' },
  { sign: 'Virgo', emoji: '♍', color: '#10b981', numbers: ['444','666'], energy: 'Healing, service, purification, detail' },
  { sign: 'Libra', emoji: '♎', color: '#a78bfa', numbers: ['222','777'], energy: 'Balance, beauty, relationships, justice' },
  { sign: 'Scorpio', emoji: '♏', color: '#8b5cf6', numbers: ['999','555'], energy: 'Transformation, depth, power, mystery' },
  { sign: 'Sagittarius', emoji: '♐', color: '#c9a84c', numbers: ['777','333'], energy: 'Expansion, truth, adventure, wisdom' },
  { sign: 'Capricorn', emoji: '♑', color: '#6366f1', numbers: ['888','444'], energy: 'Ambition, structure, mastery, legacy' },
  { sign: 'Aquarius', emoji: '♒', color: '#22d3ee', numbers: ['1111','777'], energy: 'Innovation, freedom, humanity, awakening' },
  { sign: 'Pisces', emoji: '♓', color: '#f472b6', numbers: ['999','1212'], energy: 'Spirituality, dreams, compassion, surrender' },
];

function getMoonPhase(): { phase: typeof MOON_PHASES[0]; dayInCycle: number } {
  const knownNew = new Date('2024-01-11').getTime();
  const cycleLength = 29.53;
  const now = Date.now();
  const daysSince = (now - knownNew) / 86400000;
  const dayInCycle = ((daysSince % cycleLength) + cycleLength) % cycleLength;
  let phaseIdx = 0;
  if (dayInCycle < 1.85) phaseIdx = 0;
  else if (dayInCycle < 7.38) phaseIdx = 1;
  else if (dayInCycle < 9.22) phaseIdx = 2;
  else if (dayInCycle < 14.77) phaseIdx = 3;
  else if (dayInCycle < 16.61) phaseIdx = 4;
  else if (dayInCycle < 22.15) phaseIdx = 5;
  else if (dayInCycle < 23.99) phaseIdx = 6;
  else phaseIdx = 7;
  return { phase: MOON_PHASES[phaseIdx], dayInCycle: Math.round(dayInCycle) };
}

function getCurrentMoonSign(): typeof MOON_SIGNS[0] {
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000);
  return MOON_SIGNS[Math.floor((dayOfYear / 2.5) % 12)];
}

export default function MoonPage() {
  const [tab, setTab] = useState<'today' | 'phases' | 'signs'>('today');
  const [selectedPhase, setSelectedPhase] = useState<number | null>(null);
  const { phase: currentPhase, dayInCycle } = getMoonPhase();
  const moonSign = getCurrentMoonSign();

  return (
    <div style={{ minHeight: '100vh', padding: '2rem 1rem', maxWidth: '700px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 700, color: '#c9a84c', fontFamily: 'Cormorant Garamond, serif' }}>Moon Phases</h1>
        <p style={{ color: 'rgba(255,255,255,0.4)', marginTop: '0.25rem' }}>Lunar wisdom and angel number guidance</p>
      </div>

      {/* Tab nav */}
      <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '1.5rem', background: 'rgba(255,255,255,0.03)', borderRadius: '999px', padding: '0.25rem' }}>
        {(['today', 'phases', 'signs'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)} style={{ flex: 1, padding: '0.5rem', borderRadius: '999px', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 600, background: tab === t ? 'rgba(201,168,76,0.2)' : 'transparent', border: tab === t ? '1px solid rgba(201,168,76,0.3)' : '1px solid transparent', color: tab === t ? '#c9a84c' : 'rgba(255,255,255,0.4)' }}>{t === 'today' ? 'Today' : t === 'phases' ? 'All Phases' : 'Moon Signs'}</button>
        ))}
      </div>

      {tab === 'today' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {/* Current moon */}
          <div style={{ background: `linear-gradient(135deg, ${currentPhase.color}15, rgba(8,6,28,0.95))`, borderRadius: '1.5rem', border: `1px solid ${currentPhase.color}25`, padding: '1.75rem', backdropFilter: 'blur(12px)', textAlign: 'center' }}>
            <div style={{ fontSize: '4rem', marginBottom: '0.5rem' }}>{currentPhase.emoji}</div>
            <h2 style={{ color: '#fff', fontWeight: 700, fontSize: '1.4rem', fontFamily: 'Cormorant Garamond, serif', marginBottom: '0.25rem' }}>{currentPhase.name}</h2>
            <p style={{ color: currentPhase.color, fontSize: '0.78rem', marginBottom: '1rem' }}>Day {dayInCycle} of lunar cycle</p>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.88rem', lineHeight: 1.7, marginBottom: '1rem' }}>{currentPhase.energy}</p>
            <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              {currentPhase.numbers.map(n => <span key={n} style={{ background: `${currentPhase.color}15`, border: `1px solid ${currentPhase.color}25`, borderRadius: '999px', padding: '0.2rem 0.75rem', fontSize: '0.82rem', color: currentPhase.color, fontFamily: 'Cormorant Garamond, serif', fontWeight: 700 }}>{n}</span>)}
            </div>
          </div>

          {/* Moon sign */}
          <div style={{ background: 'rgba(8,6,28,0.88)', borderRadius: '1.25rem', border: '1px solid rgba(255,255,255,0.07)', padding: '1.25rem', backdropFilter: 'blur(12px)', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: `${moonSign.color}15`, border: `2px solid ${moonSign.color}25`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', flexShrink: 0 }}>{moonSign.emoji}</div>
            <div>
              <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.2rem' }}>Moon in</p>
              <p style={{ color: '#fff', fontWeight: 700, fontSize: '1rem' }}>{moonSign.sign}</p>
              <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.78rem' }}>{moonSign.energy}</p>
            </div>
          </div>

          {/* Today ritual */}
          <div style={{ background: 'rgba(8,6,28,0.88)', borderRadius: '1.25rem', border: '1px solid rgba(255,255,255,0.07)', padding: '1.25rem', backdropFilter: 'blur(12px)' }}>
            <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.75rem' }}>Today’s Ritual</p>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.88rem', lineHeight: 1.7 }}>{currentPhase.ritual}</p>
          </div>

          {/* Affirmation */}
          <div style={{ background: `${currentPhase.color}08`, borderRadius: '1.25rem', border: `1px solid ${currentPhase.color}15`, padding: '1.25rem', backdropFilter: 'blur(12px)', textAlign: 'center' }}>
            <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>Moon Affirmation</p>
            <p style={{ color: currentPhase.color, fontStyle: 'italic', fontFamily: 'Cormorant Garamond, serif', fontSize: '1rem', lineHeight: 1.7 }}>&ldquo;{currentPhase.affirmation}&rdquo;</p>
          </div>
        </div>
      )}

      {tab === 'phases' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {MOON_PHASES.map((p, i) => (
            <div key={p.name} onClick={() => setSelectedPhase(selectedPhase === i ? null : i)} style={{ background: 'rgba(8,6,28,0.88)', borderRadius: '1.25rem', border: selectedPhase === i ? `1px solid ${p.color}40` : '1px solid rgba(255,255,255,0.07)', padding: '0.875rem 1rem', backdropFilter: 'blur(12px)', cursor: 'pointer' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
                <span style={{ fontSize: '1.5rem', flexShrink: 0 }}>{p.emoji}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <p style={{ color: '#fff', fontWeight: 600, fontSize: '0.9rem' }}>{p.name}</p>
                    {p.name === currentPhase.name && <span style={{ background: 'rgba(201,168,76,0.15)', border: '1px solid rgba(201,168,76,0.3)', borderRadius: '999px', padding: '0.1rem 0.4rem', fontSize: '0.6rem', color: '#c9a84c', fontWeight: 700 }}>NOW</span>}
                  </div>
                  <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.72rem' }}>{p.energy.split(',')[0]}</p>
                </div>
                <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: '1rem' }}>{selectedPhase === i ? '▾' : '›'}</span>
              </div>
              {selectedPhase === i && (
                <div style={{ marginTop: '0.875rem', paddingTop: '0.875rem', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                  <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.83rem', lineHeight: 1.6 }}>{p.energy}</p>
                  <div style={{ background: `${p.color}08`, borderRadius: '0.875rem', padding: '0.75rem', border: `1px solid ${p.color}15` }}>
                    <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.25rem' }}>Ritual</p>
                    <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.82rem' }}>{p.ritual}</p>
                  </div>
                  <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                    {p.numbers.map(n => <span key={n} style={{ background: `${p.color}10`, border: `1px solid ${p.color}20`, borderRadius: '999px', padding: '0.15rem 0.6rem', fontSize: '0.72rem', color: p.color }}>{n}</span>)}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {tab === 'signs' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.5rem' }}>
          {MOON_SIGNS.map(s => (
            <div key={s.sign} style={{ background: 'rgba(8,6,28,0.88)', borderRadius: '1.25rem', border: '1px solid rgba(255,255,255,0.07)', padding: '1rem', backdropFilter: 'blur(12px)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <span style={{ fontSize: '1.25rem' }}>{s.emoji}</span>
                <p style={{ color: s.color, fontWeight: 700, fontSize: '0.9rem' }}>{s.sign}</p>
              </div>
              <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.72rem', lineHeight: 1.5, marginBottom: '0.5rem' }}>{s.energy}</p>
              <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap' }}>
                {s.numbers.map(n => <span key={n} style={{ background: `${s.color}10`, border: `1px solid ${s.color}20`, borderRadius: '999px', padding: '0.1rem 0.4rem', fontSize: '0.62rem', color: s.color }}>{n}</span>)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}