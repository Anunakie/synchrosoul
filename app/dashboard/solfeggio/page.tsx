'use client'
import { useState } from 'react'

const FREQUENCIES = [
  { hz: 174, name: 'Foundation', color: '#ef4444', chakra: 'Root', number: '111', emoji: '🔴', effect: 'Reduces pain and stress. Gives organs a sense of security and love. The lowest of the sacred frequencies — the foundation of all healing.', affirmation: 'I am safe. I am grounded. I am supported by the earth.', use: 'Play during grounding meditations, when feeling anxious or unrooted, or before sleep to release physical tension.' },
  { hz: 285, name: 'Quantum Cognition', color: '#f97316', chakra: 'Sacral', number: '333', emoji: '🟠', effect: 'Influences energy fields and heals tissues and organs. Sends a message to restructure damaged energy. Leaves the body rejuvenated and energized.', affirmation: 'My body heals itself perfectly. Every cell vibrates with divine health.', use: 'Use during healing intentions, after illness or injury, or when working on cellular regeneration.' },
  { hz: 396, name: 'Liberation', color: '#eab308', chakra: 'Solar Plexus', number: '999', emoji: '🟡', effect: 'Liberates you from fear and guilt. Cleanses the feeling of guilt which often represents one of the primary obstacles to realization. Turns grief into joy.', affirmation: 'I release all guilt and fear. I am free to live my highest life.', use: 'Play when processing grief, releasing guilt, or breaking free from limiting beliefs and past trauma.' },
  { hz: 417, name: 'Transmutation', color: '#84cc16', chakra: 'Solar Plexus', number: '555', emoji: '💚', effect: 'Facilitates change and undoes situations. Cleanses traumatic experiences and clears destructive influences of past events. Marks the beginning of new cycles.', affirmation: 'I welcome change. I am transformed by divine love into my highest self.', use: 'Use during major life transitions, when breaking old patterns, or at the start of new chapters.' },
  { hz: 432, name: 'Universal Harmony', color: '#10b981', chakra: 'Heart', number: '444', emoji: '💚', effect: 'The frequency of nature itself. Mathematically consistent with the universe. Creates a sense of peace and well-being. Connects to the heartbeat of the cosmos.', affirmation: 'I am in harmony with all of creation. The universe and I are one.', use: 'Use for general meditation, nature connection, or whenever you need to feel at peace with the world.' },
  { hz: 528, name: 'Miracle Tone', color: '#06b6d4', chakra: 'Heart', number: '1111', emoji: '💙', effect: 'The love frequency. Used by biochemists to repair DNA. Creates transformation and miracles. Brings deep inner peace. The most powerful of all solfeggio frequencies.', affirmation: 'I am made of love. Miracles flow through me and to me constantly.', use: 'Use during manifestation work, healing intentions, heart-opening meditations, or when calling in miracles.' },
  { hz: 639, name: 'Connection', color: '#3b82f6', chakra: 'Throat', number: '222', emoji: '💙', effect: 'Enhances communication, understanding, tolerance and love. Reconnects you with relationships. Creates harmonious community and enables creation of harmonious interpersonal relationships.', affirmation: 'I communicate with love and clarity. My relationships are divinely harmonious.', use: 'Play before important conversations, during relationship healing, or when seeking to attract soul connections.' },
  { hz: 741, name: 'Awakening', color: '#8b5cf6', chakra: 'Third Eye', number: '777', emoji: '💜', effect: 'Awakens intuition and leads to a purer, stable life. Cleans the cells from electromagnetic radiation. Solves problems and expands consciousness. The frequency of awakening.', affirmation: 'My intuition is crystal clear. I see truth in all things.', use: 'Use during intuition development, psychic work, problem-solving, or when seeking clarity and truth.' },
  { hz: 852, name: 'Spiritual Order', color: '#a855f7', chakra: 'Third Eye', number: '888', emoji: '🔮', effect: 'Returns spiritual order. Awakens intuition and inner strength. Raises awareness and lets you return to spiritual balance. Directly connected to the principle of Light.', affirmation: 'I am spiritually aligned. Divine order governs every area of my life.', use: 'Use when feeling spiritually disconnected, during deep meditation, or when seeking higher guidance.' },
  { hz: 963, name: 'Divine Consciousness', color: '#ec4899', chakra: 'Crown', number: '1010', emoji: '👑', effect: 'Activates the pineal gland and raises positive energy. Creates room for oneness and unity. Connects you with the light and enables direct experience of the divine. The God frequency.', affirmation: 'I am one with the divine. I am a vessel of pure cosmic consciousness.', use: 'Use during crown chakra activation, deep spiritual practice, or when seeking direct connection with Source.' },
]

export default function SolfeggioPage() {
  const [selected, setSelected] = useState<typeof FREQUENCIES[0] | null>(null)
  const card: React.CSSProperties = { background: 'rgba(8,6,28,0.88)', border: '1px solid rgba(200,180,255,0.12)', borderRadius: '1.25rem', backdropFilter: 'blur(12px)' }

  if (selected) return (
    <div style={{ maxWidth: '520px', margin: '0 auto', padding: '1.5rem 1rem 2rem' }}>
      <button onClick={() => setSelected(null)} style={{ background: 'none', border: 'none', color: 'rgba(180,160,255,0.5)', cursor: 'pointer', fontSize: '0.8rem', marginBottom: '1rem', padding: 0 }}>← All Frequencies</button>
      <div style={{ ...card, padding: '1.75rem', borderColor: selected.color + '30', marginBottom: '1rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>{selected.emoji}</div>
          <div style={{ color: selected.color, fontSize: '2rem', fontWeight: 700, fontFamily: 'Cormorant Garamond, serif', lineHeight: 1, marginBottom: '0.25rem' }}>{selected.hz} Hz</div>
          <div style={{ color: 'rgba(220,200,255,0.85)', fontFamily: 'Cormorant Garamond, serif', fontSize: '1.3rem', marginBottom: '0.25rem' }}>{selected.name}</div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', marginTop: '0.5rem' }}>
            <span style={{ padding: '0.2rem 0.625rem', borderRadius: '2rem', background: selected.color + '15', border: '1px solid ' + selected.color + '30', color: selected.color, fontSize: '0.68rem' }}>{selected.chakra} Chakra</span>
            <span style={{ padding: '0.2rem 0.625rem', borderRadius: '2rem', background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.25)', color: '#c9a84c', fontSize: '0.68rem' }}>Angel {selected.number}</span>
          </div>
        </div>
        <div style={{ background: 'rgba(255,255,255,0.02)', borderRadius: '0.875rem', padding: '1rem', marginBottom: '1rem' }}>
          <p style={{ color: 'rgba(200,180,255,0.75)', fontSize: '0.85rem', lineHeight: 1.7, margin: 0, fontFamily: 'Cormorant Garamond, serif', fontStyle: 'italic' }}>{selected.effect}</p>
        </div>
        <div style={{ background: selected.color + '08', border: '1px solid ' + selected.color + '20', borderRadius: '0.875rem', padding: '1rem', marginBottom: '1rem' }}>
          <div style={{ color: selected.color, fontSize: '0.62rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.4rem' }}>Affirmation</div>
          <p style={{ color: 'rgba(220,200,255,0.8)', fontSize: '0.85rem', lineHeight: 1.6, margin: 0, fontStyle: 'italic' }}>&ldquo;{selected.affirmation}&rdquo;</p>
        </div>
        <div style={{ background: 'rgba(255,255,255,0.02)', borderRadius: '0.875rem', padding: '1rem' }}>
          <div style={{ color: 'rgba(180,160,255,0.35)', fontSize: '0.62rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.4rem' }}>How to Use</div>
          <p style={{ color: 'rgba(180,160,255,0.65)', fontSize: '0.8rem', lineHeight: 1.6, margin: 0 }}>{selected.use}</p>
        </div>
      </div>
      <div style={{ ...card, padding: '1rem', textAlign: 'center' }}>
        <div style={{ color: 'rgba(180,160,255,0.4)', fontSize: '0.72rem', marginBottom: '0.5rem' }}>Search YouTube or Spotify for:</div>
        <div style={{ color: 'rgba(220,200,255,0.8)', fontSize: '0.9rem', fontWeight: 600 }}>&ldquo;{selected.hz} Hz Solfeggio Frequency&rdquo;</div>
        <div style={{ color: 'rgba(180,160,255,0.3)', fontSize: '0.7rem', marginTop: '0.35rem' }}>Listen with headphones for best results</div>
      </div>
    </div>
  )

  return (
    <div style={{ maxWidth: '520px', margin: '0 auto', padding: '1.5rem 1rem 2rem' }}>
      <div style={{ marginBottom: '1.25rem' }}>
        <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.8rem', color: 'rgba(220,200,255,0.95)', margin: '0 0 0.25rem', fontWeight: 400 }}>Solfeggio Frequencies</h1>
        <p style={{ color: 'rgba(180,160,255,0.5)', fontSize: '0.8rem', margin: 0 }}>Ancient sacred tones for healing and awakening</p>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {FREQUENCIES.map(f => (
          <button key={f.hz} onClick={() => setSelected(f)} style={{ ...card, padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', gap: '1rem', cursor: 'pointer', textAlign: 'left', borderColor: f.color + '20', transition: 'all 0.2s' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: f.color + '15', border: '1px solid ' + f.color + '35', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 0 16px ' + f.color + '20' }}>
              <span style={{ color: f.color, fontSize: '1rem', fontWeight: 700 }}>{f.hz}</span>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ color: 'rgba(220,200,255,0.85)', fontFamily: 'Cormorant Garamond, serif', fontSize: '1rem', fontWeight: 400 }}>{f.name}</div>
              <div style={{ color: 'rgba(180,160,255,0.4)', fontSize: '0.72rem', marginTop: '0.1rem' }}>{f.chakra} Chakra · {f.hz} Hz</div>
            </div>
            <span style={{ color: 'rgba(180,160,255,0.25)', fontSize: '0.8rem' }}>›</span>
          </button>
        ))}
      </div>
    </div>
  )
}
