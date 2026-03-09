'use client';
import { useState } from 'react';

const CHAKRAS = [
  { id: 'root', name: 'Root Chakra', sanskrit: 'Muladhara', emoji: '🔴', color: '#ef4444', position: '1st', location: 'Base of spine', element: 'Earth', numbers: ['444','111','333'], crystal: 'Black Tourmaline', affirmation: 'I am safe, grounded, and supported.', blocked: 'Fear, anxiety, financial insecurity, feeling ungrounded', balanced: 'Security, stability, trust, physical vitality', healing: ['Walk barefoot on grass or earth', 'Hold black tourmaline and breathe deeply', 'Eat red foods: beets, tomatoes, strawberries', 'Practice 444 breathing (4-4-4-4)', 'Visualize red light at the base of your spine'] },
  { id: 'sacral', name: 'Sacral Chakra', sanskrit: 'Svadhisthana', emoji: '🟠', color: '#f97316', position: '2nd', location: 'Below navel', element: 'Water', numbers: ['222','333','555'], crystal: 'Carnelian', affirmation: 'I embrace pleasure, creativity, and flow.', blocked: 'Guilt, shame, creative blocks, relationship issues', balanced: 'Creativity, passion, emotional intelligence, joy', healing: ['Dance freely to music you love', 'Create something with your hands', 'Spend time near water', 'Journal about your desires without judgment', 'Wear or carry carnelian'] },
  { id: 'solar', name: 'Solar Plexus', sanskrit: 'Manipura', emoji: '🟡', color: '#f59e0b', position: '3rd', location: 'Upper abdomen', element: 'Fire', numbers: ['888','111','333'], crystal: 'Citrine', affirmation: 'I am powerful, confident, and worthy.', blocked: 'Low self-esteem, lack of purpose, control issues', balanced: 'Confidence, willpower, personal power, motivation', healing: ['Stand in sunlight for 10 minutes', 'Practice power poses', 'Repeat: I am worthy of success', 'Carry citrine in your pocket', 'Core strengthening exercises'] },
  { id: 'heart', name: 'Heart Chakra', sanskrit: 'Anahata', emoji: '💚', color: '#22c55e', position: '4th', location: 'Center of chest', element: 'Air', numbers: ['222','444','1212'], crystal: 'Rose Quartz', affirmation: 'I give and receive love freely and fully.', blocked: 'Grief, loneliness, inability to forgive, codependency', balanced: 'Unconditional love, compassion, forgiveness, connection', healing: ['Practice loving-kindness meditation', 'Hug someone you love', 'Write a forgiveness letter (you need not send it)', 'Place rose quartz on your heart during rest', 'Breathe in love, breathe out fear'] },
  { id: 'throat', name: 'Throat Chakra', sanskrit: 'Vishuddha', emoji: '🔵', color: '#3b82f6', position: '5th', location: 'Throat', element: 'Sound', numbers: ['333','555','777'], crystal: 'Lapis Lazuli', affirmation: 'I speak my truth with clarity and love.', blocked: 'Fear of speaking, lying, inability to express feelings', balanced: 'Clear communication, authentic expression, creativity', healing: ['Sing or hum for 5 minutes', 'Write in your journal without censoring', 'Speak one truth you have been holding back', 'Wear blue or carry lapis lazuli', 'Practice saying no when you mean no'] },
  { id: 'third-eye', name: 'Third Eye', sanskrit: 'Ajna', emoji: '💜', color: '#8b5cf6', position: '6th', location: 'Between eyebrows', element: 'Light', numbers: ['777','1111','333'], crystal: 'Amethyst', affirmation: 'I trust my intuition and inner wisdom.', blocked: 'Confusion, lack of intuition, overthinking, closed-mindedness', balanced: 'Intuition, clarity, psychic awareness, wisdom', healing: ['Meditate with amethyst on your forehead', 'Practice visualization exercises', 'Trust your first instinct today', 'Spend time in darkness and silence', 'Journal your dreams immediately upon waking'] },
  { id: 'crown', name: 'Crown Chakra', sanskrit: 'Sahasrara', emoji: '✨', color: '#c9a84c', position: '7th', location: 'Top of head', element: 'Thought', numbers: ['1111','777','999'], crystal: 'Clear Quartz', affirmation: 'I am connected to the divine and all that is.', blocked: 'Spiritual disconnection, cynicism, feeling lost', balanced: 'Spiritual connection, enlightenment, oneness, purpose', healing: ['Sit in silent meditation for 10 minutes', 'Spend time in nature under open sky', 'Practice gratitude for existence itself', 'Hold clear quartz and visualize white light', 'Ask: What is my highest purpose?'] },
];

export default function ChakrasPage() {
  const [active, setActive] = useState<string | null>(null);
  const [tab, setTab] = useState<'overview' | 'healing'>('overview');

  const chakra = CHAKRAS.find(c => c.id === active);

  return (
    <div style={{ minHeight: '100vh', padding: '2rem 1rem', maxWidth: '700px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 700, color: '#a78bfa', fontFamily: 'Cormorant Garamond, serif' }}>Chakra Alignment</h1>
        <p style={{ color: 'rgba(255,255,255,0.4)', marginTop: '0.25rem' }}>Balance your 7 energy centers with angel numbers</p>
      </div>

      {/* Chakra spine visualization */}
      <div style={{ background: 'rgba(8,6,28,0.88)', borderRadius: '1.5rem', border: '1px solid rgba(255,255,255,0.07)', padding: '1.25rem', backdropFilter: 'blur(12px)', marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
          {CHAKRAS.map(c => (
            <button key={c.id} onClick={() => setActive(active === c.id ? null : c.id)} style={{ width: '44px', height: '44px', borderRadius: '50%', background: active === c.id ? `${c.color}30` : `${c.color}15`, border: `2px solid ${active === c.id ? c.color : c.color + '40'}`, cursor: 'pointer', fontSize: '1.1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s', boxShadow: active === c.id ? `0 0 16px ${c.color}40` : 'none' }} title={c.name}>{c.emoji}</button>
          ))}
        </div>
        <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.3)', fontSize: '0.72rem', marginTop: '0.75rem' }}>Tap a chakra to explore</p>
      </div>

      {/* Chakra detail */}
      {chakra ? (
        <div style={{ background: 'rgba(8,6,28,0.92)', borderRadius: '1.5rem', border: `1px solid ${chakra.color}25`, padding: '1.5rem', backdropFilter: 'blur(12px)', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.25rem' }}>
            <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: `${chakra.color}20`, border: `2px solid ${chakra.color}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', flexShrink: 0, boxShadow: `0 0 20px ${chakra.color}30` }}>{chakra.emoji}</div>
            <div>
              <h2 style={{ color: '#fff', fontWeight: 700, fontSize: '1.15rem', fontFamily: 'Cormorant Garamond, serif' }}>{chakra.name}</h2>
              <p style={{ color: chakra.color, fontSize: '0.78rem' }}>{chakra.sanskrit} · {chakra.position} · {chakra.location}</p>
            </div>
          </div>

          {/* Tabs */}
          <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '1.25rem', background: 'rgba(255,255,255,0.03)', borderRadius: '999px', padding: '0.2rem' }}>
            {(['overview', 'healing'] as const).map(t => (
              <button key={t} onClick={() => setTab(t)} style={{ flex: 1, padding: '0.4rem', borderRadius: '999px', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 600, background: tab === t ? `${chakra.color}20` : 'transparent', border: tab === t ? `1px solid ${chakra.color}30` : '1px solid transparent', color: tab === t ? chakra.color : 'rgba(255,255,255,0.4)' }}>{t === 'overview' ? 'Overview' : 'Healing'}</button>
            ))}
          </div>

          {tab === 'overview' ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ background: `${chakra.color}08`, borderRadius: '1rem', padding: '0.875rem', border: `1px solid ${chakra.color}15` }}>
                <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.35rem' }}>Affirmation</p>
                <p style={{ color: chakra.color, fontStyle: 'italic', fontFamily: 'Cormorant Garamond, serif', fontSize: '0.95rem' }}>&ldquo;{chakra.affirmation}&rdquo;</p>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '0.875rem', padding: '0.75rem', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.25rem' }}>Element</p>
                  <p style={{ color: '#fff', fontSize: '0.85rem', fontWeight: 600 }}>{chakra.element}</p>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '0.875rem', padding: '0.75rem', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.25rem' }}>Crystal</p>
                  <p style={{ color: '#fff', fontSize: '0.85rem', fontWeight: 600 }}>{chakra.crystal}</p>
                </div>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '0.875rem', padding: '0.75rem', border: '1px solid rgba(255,255,255,0.06)' }}>
                <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.35rem' }}>When Blocked</p>
                <p style={{ color: 'rgba(255,100,100,0.8)', fontSize: '0.82rem' }}>{chakra.blocked}</p>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '0.875rem', padding: '0.75rem', border: '1px solid rgba(255,255,255,0.06)' }}>
                <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.35rem' }}>When Balanced</p>
                <p style={{ color: 'rgba(100,255,150,0.8)', fontSize: '0.82rem' }}>{chakra.balanced}</p>
              </div>
              <div>
                <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.5rem' }}>Angel Numbers</p>
                <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                  {chakra.numbers.map(n => <span key={n} style={{ background: `${chakra.color}10`, border: `1px solid ${chakra.color}20`, borderRadius: '999px', padding: '0.2rem 0.75rem', fontSize: '0.82rem', color: chakra.color, fontFamily: 'Cormorant Garamond, serif', fontWeight: 700 }}>{n}</span>)}
                </div>
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {chakra.healing.map((h, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.875rem', padding: '0.75rem', background: 'rgba(255,255,255,0.03)', borderRadius: '0.875rem', border: '1px solid rgba(255,255,255,0.05)' }}>
                  <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: `${chakra.color}15`, border: `1px solid ${chakra.color}25`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', color: chakra.color, fontWeight: 800, flexShrink: 0, marginTop: '0.1rem' }}>{i + 1}</div>
                  <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', lineHeight: 1.6 }}>{h}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        /* All chakras list */
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {CHAKRAS.map(c => (
            <div key={c.id} onClick={() => setActive(c.id)} style={{ background: 'rgba(8,6,28,0.88)', borderRadius: '1.25rem', border: '1px solid rgba(255,255,255,0.07)', padding: '0.875rem 1rem', backdropFilter: 'blur(12px)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
              <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: `${c.color}15`, border: `2px solid ${c.color}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem', flexShrink: 0 }}>{c.emoji}</div>
              <div style={{ flex: 1 }}>
                <p style={{ color: '#fff', fontWeight: 600, fontSize: '0.9rem' }}>{c.name}</p>
                <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.72rem' }}>{c.sanskrit} · {c.location}</p>
              </div>
              <div style={{ display: 'flex', gap: '0.3rem' }}>
                {c.numbers.slice(0, 2).map(n => <span key={n} style={{ background: `${c.color}10`, borderRadius: '999px', padding: '0.1rem 0.4rem', fontSize: '0.62rem', color: c.color }}>{n}</span>)}
              </div>
              <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: '1rem' }}>›</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}