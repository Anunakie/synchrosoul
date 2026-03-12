'use client';
import FeatureGate from '@/components/FeatureGate'
import { useState } from 'react';
import SaveReadingButton from '@/components/SaveReadingButton';

const majorArcana = [
  { num: 0, name: 'The Fool', emoji: '🌟', upright: 'New beginnings, innocence, spontaneity, free spirit', reversed: 'Recklessness, risk-taking, holding back', angelNumber: '000', element: 'Air', color: '#ffd700', desc: 'The Fool represents the start of a new journey. Pure potential, unlimited possibility, and the courage to leap into the unknown with faith.' },
  { num: 1, name: 'The Magician', emoji: '🪄', upright: 'Manifestation, resourcefulness, power, inspired action', reversed: 'Manipulation, poor planning, untapped talents', angelNumber: '111', element: 'Air', color: '#ed8936', desc: 'The Magician channels divine energy into the material world. You have all the tools you need. It is time to act with intention and confidence.' },
  { num: 2, name: 'The High Priestess', emoji: '🌙', upright: 'Intuition, sacred knowledge, divine feminine, subconscious', reversed: 'Secrets, disconnected from intuition, withdrawal', angelNumber: '222', element: 'Water', color: '#4299e1', desc: 'The High Priestess guards the veil between worlds. Trust your inner knowing. The answers you seek are already within you.' },
  { num: 3, name: 'The Empress', emoji: '🌸', upright: 'Femininity, beauty, nature, nurturing, abundance', reversed: 'Creative block, dependence, smothering', angelNumber: '333', element: 'Earth', color: '#48bb78', desc: 'The Empress embodies fertile abundance and creative power. Nature, beauty, and sensuality are calling you. Nurture yourself and your creations.' },
  { num: 4, name: 'The Emperor', emoji: '👑', upright: 'Authority, structure, control, fatherhood, stability', reversed: 'Domination, excessive control, rigidity', angelNumber: '444', element: 'Fire', color: '#e53e3e', desc: 'The Emperor brings order and structure. Build solid foundations. Lead with wisdom and authority. Your discipline creates lasting results.' },
  { num: 5, name: 'The Hierophant', emoji: '⛪', upright: 'Spiritual wisdom, tradition, conformity, morality', reversed: 'Personal beliefs, freedom, challenging the status quo', angelNumber: '555', element: 'Earth', color: '#9b59b6', desc: 'The Hierophant connects you to spiritual tradition and collective wisdom. Seek guidance from teachers and mentors. Honor sacred traditions.' },
  { num: 6, name: 'The Lovers', emoji: '💞', upright: 'Love, harmony, relationships, values alignment, choices', reversed: 'Self-love, disharmony, imbalance, misalignment', angelNumber: '666', element: 'Air', color: '#f48fb1', desc: 'The Lovers represent deep connection and the power of choice. Align your actions with your values. Love in all its forms is your teacher.' },
  { num: 7, name: 'The Chariot', emoji: '⚡', upright: 'Control, willpower, success, action, determination', reversed: 'Self-discipline, opposition, lack of direction', angelNumber: '777', element: 'Water', color: '#c9a84c', desc: 'The Chariot charges forward with unstoppable will. You have the power to overcome any obstacle. Focus your energy and drive toward victory.' },
  { num: 8, name: 'Strength', emoji: '🦁', upright: 'Strength, courage, patience, control, compassion', reversed: 'Inner strength, self-doubt, low energy', angelNumber: '888', element: 'Fire', color: '#f6ad55', desc: 'Strength is not force but gentle mastery. Your compassion and patience are your greatest powers. Tame the wild with love, not fear.' },
  { num: 9, name: 'The Hermit', emoji: '🕯️', upright: 'Soul-searching, introspection, being alone, inner guidance', reversed: 'Isolation, loneliness, withdrawal', angelNumber: '999', element: 'Earth', color: '#76e4f7', desc: 'The Hermit retreats to find inner light. Solitude is sacred right now. The wisdom you seek can only be found within the silence.' },
  { num: 10, name: 'Wheel of Fortune', emoji: '🎡', upright: 'Good luck, karma, life cycles, destiny, turning point', reversed: 'Bad luck, resistance to change, breaking cycles', angelNumber: '1010', element: 'Fire', color: '#b794f4', desc: 'The Wheel turns and destiny shifts. A major cycle is completing or beginning. Embrace the flow of life and trust in divine timing.' },
  { num: 11, name: 'Justice', emoji: '⚖️', upright: 'Justice, fairness, truth, cause and effect, law', reversed: 'Unfairness, lack of accountability, dishonesty', angelNumber: '1111', element: 'Air', color: '#68d391', desc: 'Justice sees all with perfect clarity. Truth will prevail. Every action has its consequence. Act with integrity and fairness in all things.' },
  { num: 12, name: 'The Hanged Man', emoji: '🙃', upright: 'Pause, surrender, letting go, new perspectives', reversed: 'Delays, resistance, stalling, indecision', angelNumber: '1212', element: 'Water', color: '#4299e1', desc: 'The Hanged Man surrenders to gain new sight. Pause and see from a different angle. What you resist persists. Let go and receive wisdom.' },
  { num: 13, name: 'Death', emoji: '🦋', upright: 'Endings, change, transformation, transition', reversed: 'Resistance to change, personal transformation, inner purging', angelNumber: '1313', element: 'Water', color: '#2d3748', desc: 'Death is the great transformer. An old chapter must end for the new to begin. Release what no longer serves. Transformation is beautiful.' },
  { num: 14, name: 'Temperance', emoji: '🌊', upright: 'Balance, moderation, patience, purpose, meaning', reversed: 'Imbalance, excess, self-healing, realignment', angelNumber: '1414', element: 'Fire', color: '#48bb78', desc: 'Temperance flows between extremes with grace. Find the middle path. Patience and moderation create lasting alchemy in your life.' },
  { num: 15, name: 'The Devil', emoji: '⛓️', upright: 'Shadow self, attachment, addiction, restriction, sexuality', reversed: 'Releasing limiting beliefs, exploring dark thoughts, detachment', angelNumber: '555', element: 'Earth', color: '#e53e3e', desc: 'The Devil reveals your chains — and shows they are self-imposed. Face your shadows with courage. Freedom begins the moment you choose it.' },
  { num: 16, name: 'The Tower', emoji: '⚡', upright: 'Sudden change, upheaval, chaos, revelation, awakening', reversed: 'Personal transformation, fear of change, averting disaster', angelNumber: '999', element: 'Fire', color: '#fc8181', desc: 'The Tower shatters what was built on false foundations. Though it feels like destruction, it is divine liberation. What falls was never truly yours.' },
  { num: 17, name: 'The Star', emoji: '⭐', upright: 'Hope, faith, purpose, renewal, spirituality', reversed: 'Lack of faith, despair, self-trust, disconnection', angelNumber: '777', element: 'Air', color: '#76e4f7', desc: 'The Star pours healing light after the storm. Hope is returning. You are being renewed and restored. Trust in the universe completely.' },
  { num: 18, name: 'The Moon', emoji: '🌕', upright: 'Illusion, fear, the subconscious, intuition, dreams', reversed: 'Release of fear, repressed emotion, inner confusion', angelNumber: '1818', element: 'Water', color: '#b794f4', desc: 'The Moon illuminates the hidden depths. Your dreams and intuition carry important messages. Navigate the unknown with trust in your inner compass.' },
  { num: 19, name: 'The Sun', emoji: '☀️', upright: 'Positivity, fun, warmth, success, vitality', reversed: 'Inner child, feeling down, overly optimistic', angelNumber: '1919', element: 'Fire', color: '#ffd700', desc: 'The Sun radiates pure joy and success. Everything is coming together beautifully. Celebrate, shine, and share your light with the world.' },
  { num: 20, name: 'Judgement', emoji: '📯', upright: 'Judgement, rebirth, inner calling, absolution', reversed: 'Self-doubt, inner critic, ignoring the call', angelNumber: '2020', element: 'Fire', color: '#ed8936', desc: 'Judgement calls you to rise and answer your highest calling. A profound awakening is happening. Forgive yourself and others. Rebirth is now.' },
  { num: 21, name: 'The World', emoji: '🌍', upright: 'Completion, integration, accomplishment, travel', reversed: 'Seeking personal closure, short-cuts, delays', angelNumber: '2121', element: 'Earth', color: '#c9a84c', desc: 'The World celebrates total completion and mastery. You have come full circle. Everything you sought is now yours. Dance in the joy of wholeness.' },
];

function TarotPageInner() {
  const [drawn, setDrawn] = useState<typeof majorArcana[0] | null>(null);
  const [reversed, setReversed] = useState(false);
  const [flipped, setFlipped] = useState(false);
  const [history, setHistory] = useState<Array<{card: typeof majorArcana[0], reversed: boolean}>>([]);

  const drawCard = () => {
    setFlipped(false);
    setTimeout(() => {
      const card = majorArcana[Math.floor(Math.random() * majorArcana.length)];
      const rev = Math.random() > 0.7;
      setDrawn(card);
      setReversed(rev);
      setHistory(h => [{ card, reversed: rev }, ...h.slice(0, 4)]);
      setTimeout(() => setFlipped(true), 100);
    }, 300);
  };

  return (
    <div style={{ minHeight: '100vh', padding: '2rem 1rem', maxWidth: '680px', margin: '0 auto' }}>
      <h1 style={{ textAlign: 'center', fontSize: '1.8rem', fontWeight: 700, color: '#e8d5b7', marginBottom: '0.5rem' }}>🃏 Angel Tarot</h1>
      <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.5)', marginBottom: '2rem', fontSize: '0.9rem' }}>Major Arcana aligned with angel numbers</p>

      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <div onClick={drawCard} style={{ display: 'inline-block', cursor: 'pointer', perspective: '1000px' }}>
          <div style={{ width: '160px', height: '260px', borderRadius: '1rem', background: drawn && flipped ? 'rgba(8,6,28,0.95)' : 'linear-gradient(135deg, #1a0533, #0d1b4b)', border: drawn && flipped ? '2px solid ' + drawn.color + '66' : '2px solid rgba(201,168,76,0.4)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', transition: 'all 0.5s', transform: reversed && flipped ? 'rotate(180deg)' : 'rotate(0deg)', boxShadow: drawn && flipped ? '0 0 40px ' + drawn.color + '33' : '0 0 20px rgba(201,168,76,0.2)', margin: '0 auto' }}>
            {drawn && flipped ? (
              <>
                <div style={{ fontSize: '3.5rem', marginBottom: '0.5rem' }}>{drawn.emoji}</div>
                <div style={{ color: drawn.color, fontSize: '0.75rem', fontWeight: 700, textAlign: 'center', padding: '0 0.5rem' }}>{drawn.name}</div>
                <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.65rem', marginTop: '0.25rem' }}>{drawn.angelNumber}</div>
              </>
            ) : (
              <>
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>✨</div>
                <div style={{ color: 'rgba(201,168,76,0.7)', fontSize: '0.8rem', textAlign: 'center' }}>Tap to draw</div>
              </>
            )}
          </div>
        </div>
        <div style={{ marginTop: '1rem' }}>
          <button onClick={drawCard} style={{ background: 'linear-gradient(135deg, #9b59b6, #c9a84c)', color: 'white', border: 'none', padding: '0.75rem 2rem', borderRadius: '999px', fontSize: '0.95rem', fontWeight: 600, cursor: 'pointer' }}>🔮 Draw Card</button>
        </div>
      </div>

      {drawn && flipped && (
        <div style={{ background: 'rgba(8,6,28,0.88)', border: '1px solid ' + drawn.color + '44', borderRadius: '1.25rem', padding: '1.75rem', backdropFilter: 'blur(12px)', marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
            <span style={{ fontSize: '2rem' }}>{drawn.emoji}</span>
            <div>
              <h2 style={{ color: drawn.color, margin: 0, fontSize: '1.3rem' }}>{drawn.name} {reversed ? '(Reversed)' : ''}</h2>
              <p style={{ color: 'rgba(255,255,255,0.4)', margin: 0, fontSize: '0.8rem' }}>Card {drawn.num} · {drawn.element} · {drawn.angelNumber}</p>
            </div>
          </div>
          <p style={{ color: 'rgba(255,255,255,0.85)', lineHeight: 1.75, marginBottom: '1rem' }}>{drawn.desc}</p>
          <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '0.75rem', padding: '1rem', marginBottom: '0.75rem' }}>
            <div style={{ color: '#48bb78', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.4rem' }}>✨ {reversed ? 'Reversed' : 'Upright'}</div>
            <p style={{ color: 'rgba(255,255,255,0.8)', margin: 0, fontSize: '0.9rem' }}>{reversed ? drawn.reversed : drawn.upright}</p>
          </div>
        </div>
      )}

      {history.length > 0 && (
        <div style={{ background: 'rgba(8,6,28,0.75)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '1rem', padding: '1.25rem', backdropFilter: 'blur(10px)' }}>
          <h3 style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.75rem' }}>Recent Draws</h3>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {history.map((h, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(255,255,255,0.05)', padding: '0.4rem 0.75rem', borderRadius: '999px', border: '1px solid rgba(255,255,255,0.08)' }}>
                <span style={{ fontSize: '0.9rem' }}>{h.card.emoji}</span>
                <span style={{ color: h.card.color, fontSize: '0.8rem' }}>{h.card.name}</span>
                {h.reversed && <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.7rem' }}>↩</span>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}


export default function TarotPage() {
  return (
    <FeatureGate feature="tarot-full" requiredTier="mystic">
      <TarotPageInner />
    </FeatureGate>
  )
}
