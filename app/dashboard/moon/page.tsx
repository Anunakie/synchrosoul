'use client';
import { useState } from 'react';

const PHASES = [
  { name: 'New Moon', emoji: '🌑', energy: 'New Beginnings', color: '#1e1b4b', textColor: '#a5b4fc', ritual: 'Set intentions. Write your desires. Plant seeds of what you want to manifest.', numbers: ['111', '1111', '000'], affirmation: 'I plant seeds of infinite possibility.' },
  { name: 'Waxing Crescent', emoji: '🌒', energy: 'Taking Action', color: '#1e3a5f', textColor: '#93c5fd', ritual: 'Take the first steps toward your intentions. Make a plan. Begin.', numbers: ['222', '1234', '333'], affirmation: 'I take inspired action toward my dreams.' },
  { name: 'First Quarter', emoji: '🌓', energy: 'Overcoming Challenges', color: '#1a3a2a', textColor: '#86efac', ritual: 'Push through resistance. Recommit to your intentions. Adjust your approach.', numbers: ['444', '555', '777'], affirmation: 'I overcome all obstacles with grace.' },
  { name: 'Waxing Gibbous', emoji: '🌔', energy: 'Refinement', color: '#3b2a1a', textColor: '#fcd34d', ritual: 'Refine your approach. Express gratitude for progress. Trust the process.', numbers: ['888', '333', '1212'], affirmation: 'I refine and perfect my path.' },
  { name: 'Full Moon', emoji: '🌕', energy: 'Manifestation Peak', color: '#2a2a1a', textColor: '#fde68a', ritual: 'Celebrate what has manifested. Release what no longer serves. Charge your crystals.', numbers: ['1111', '777', '888', '999'], affirmation: 'I am in full bloom. My manifestations are complete.' },
  { name: 'Waning Gibbous', emoji: '🌖', energy: 'Gratitude & Sharing', color: '#2a1a3b', textColor: '#c4b5fd', ritual: 'Share your gifts. Express deep gratitude. Give back to others.', numbers: ['999', '666', '333'], affirmation: 'I share my abundance with the world.' },
  { name: 'Last Quarter', emoji: '🌗', energy: 'Release & Forgiveness', color: '#3b1a1a', textColor: '#fca5a5', ritual: 'Release resentments. Forgive yourself and others. Let go of what blocks you.', numbers: ['999', '555', '000'], affirmation: 'I release all that no longer serves my highest good.' },
  { name: 'Waning Crescent', emoji: '🌘', energy: 'Rest & Surrender', color: '#1a1a2a', textColor: '#94a3b8', ritual: 'Rest deeply. Surrender to the divine plan. Prepare for the new cycle.', numbers: ['222', '000', '444'], affirmation: 'I rest in divine trust and surrender.' },
];

function getMoonPhase(date: Date): number {
  const known = new Date(2000, 0, 6);
  const diff = (date.getTime() - known.getTime()) / (1000 * 60 * 60 * 24);
  const cycle = 29.53059;
  return Math.floor(((diff % cycle + cycle) % cycle) / cycle * 8) % 8;
}

const MOON_CALENDAR_MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

export default function MoonPage() {
  const today = new Date();
  const currentPhase = getMoonPhase(today);
  const [selected, setSelected] = useState(currentPhase);

  const phase = PHASES[selected];

  // Generate next 8 phase dates (approximate)
  const nextPhases = PHASES.map((p, i) => {
    const daysUntil = ((i - currentPhase + 8) % 8) * (29.53 / 8);
    const date = new Date(today.getTime() + daysUntil * 86400000);
    return { ...p, date, daysUntil: Math.round(daysUntil), isCurrent: i === currentPhase };
  });

  return (
    <div style={{ minHeight: '100vh', padding: '2rem 1rem', maxWidth: '700px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 700, color: '#fde68a', fontFamily: 'Cormorant Garamond, serif' }}>Moon Phases</h1>
        <p style={{ color: 'rgba(255,255,255,0.4)', marginTop: '0.25rem' }}>Align your practice with lunar energy</p>
      </div>

      {/* Current moon hero */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(253,230,138,0.1), rgba(8,6,28,0.95))',
        borderRadius: '1.5rem', border: '1px solid rgba(253,230,138,0.2)',
        padding: '2rem', backdropFilter: 'blur(12px)', marginBottom: '1.25rem', textAlign: 'center'
      }}>
        <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.15em', marginBottom: '0.5rem' }}>Tonight</p>
        <div style={{ fontSize: '5rem', lineHeight: 1, marginBottom: '0.5rem' }}>{PHASES[currentPhase].emoji}</div>
        <h2 style={{ color: '#fde68a', fontSize: '1.5rem', fontWeight: 700, fontFamily: 'Cormorant Garamond, serif', marginBottom: '0.25rem' }}>{PHASES[currentPhase].name}</h2>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem' }}>{PHASES[currentPhase].energy}</p>
      </div>

      {/* Phase selector */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '0.5rem', marginBottom: '1.25rem' }}>
        {PHASES.map((p, i) => (
          <button key={i} onClick={() => setSelected(i)} style={{
            background: selected === i ? 'rgba(253,230,138,0.12)' : 'rgba(8,6,28,0.88)',
            borderRadius: '1rem', border: selected === i ? '1px solid rgba(253,230,138,0.3)' : '1px solid rgba(255,255,255,0.07)',
            padding: '0.75rem 0.5rem', cursor: 'pointer', textAlign: 'center',
            backdropFilter: 'blur(12px)', position: 'relative'
          }}>
            {i === currentPhase && <div style={{ position: 'absolute', top: '6px', right: '6px', width: '6px', height: '6px', borderRadius: '50%', background: '#fde68a' }} />}
            <div style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>{p.emoji}</div>
            <div style={{ color: selected === i ? '#fde68a' : 'rgba(255,255,255,0.4)', fontSize: '0.62rem', lineHeight: 1.3 }}>{p.name}</div>
          </button>
        ))}
      </div>

      {/* Selected phase detail */}
      <div style={{ background: 'rgba(8,6,28,0.88)', borderRadius: '1.5rem', border: '1px solid rgba(255,255,255,0.08)', padding: '1.5rem', backdropFilter: 'blur(12px)', marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem' }}>
          <span style={{ fontSize: '2.5rem' }}>{phase.emoji}</span>
          <div>
            <h3 style={{ color: '#fff', fontSize: '1.2rem', fontWeight: 700, fontFamily: 'Cormorant Garamond, serif' }}>{phase.name}</h3>
            <p style={{ color: phase.textColor, fontSize: '0.85rem' }}>{phase.energy}</p>
          </div>
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>Ritual Practice</p>
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.88rem', lineHeight: 1.6 }}>{phase.ritual}</p>
        </div>

        <div style={{ marginBottom: '1rem' }}>
          <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>Power Numbers</p>
          <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
            {phase.numbers.map(n => (
              <span key={n} style={{ background: 'rgba(253,230,138,0.1)', border: '1px solid rgba(253,230,138,0.2)', borderRadius: '999px', padding: '0.2rem 0.6rem', color: '#fde68a', fontSize: '0.82rem', fontWeight: 700, fontFamily: 'Cormorant Garamond, serif' }}>{n}</span>
            ))}
          </div>
        </div>

        <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '0.875rem', padding: '0.875rem', borderLeft: `3px solid ${phase.textColor}` }}>
          <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.62rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.3rem' }}>Affirmation</p>
          <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.88rem', fontStyle: 'italic' }}>&ldquo;{phase.affirmation}&rdquo;</p>
        </div>
      </div>

      {/* Upcoming phases */}
      <div style={{ background: 'rgba(8,6,28,0.88)', borderRadius: '1.5rem', border: '1px solid rgba(255,255,255,0.08)', padding: '1.25rem', backdropFilter: 'blur(12px)' }}>
        <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1rem' }}>Upcoming Phases</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {nextPhases.filter(p => p.daysUntil > 0).slice(0, 4).map((p, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.875rem', padding: '0.6rem 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
              <span style={{ fontSize: '1.5rem', width: '2rem', textAlign: 'center' }}>{p.emoji}</span>
              <div style={{ flex: 1 }}>
                <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.88rem', fontWeight: 600 }}>{p.name}</p>
                <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.75rem' }}>{p.date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
              </div>
              <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.75rem' }}>in {p.daysUntil}d</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}