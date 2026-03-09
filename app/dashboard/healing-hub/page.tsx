'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

const HEALING_TOOLS = [
  {
    category: 'Sound & Frequency',
    emoji: '🎵',
    color: '#c9a84c',
    tools: [
      { href: '/dashboard/solfeggio', emoji: '🎵', name: 'Solfeggio Frequencies', desc: '396Hz to 963Hz healing tones', tag: 'Popular' },
      { href: '/dashboard/breathwork', emoji: '💨', name: 'Sacred Breathwork', desc: 'Box breathing, 4-7-8, cosmic breath', tag: '' },
      { href: '/dashboard/meditations', emoji: '🧘', name: 'Guided Meditations', desc: 'Angel number activations', tag: 'New' },
    ]
  },
  {
    category: 'Energy & Body',
    emoji: '🌈',
    color: '#f472b6',
    tools: [
      { href: '/dashboard/chakras', emoji: '🌈', name: 'Chakra Alignment', desc: 'Balance your 7 energy centers', tag: '' },
      { href: '/dashboard/crystals', emoji: '💎', name: 'Crystal Guide', desc: '10 crystals with angel alignments', tag: 'New' },
      { href: '/dashboard/rituals', emoji: '🕯️', name: 'Sacred Rituals', desc: 'Moon ceremonies and practices', tag: '' },
    ]
  },
  {
    category: 'Mind & Spirit',
    emoji: '🧠',
    color: '#a78bfa',
    tools: [
      { href: '/dashboard/affirmations', emoji: '💫', name: 'Affirmations', desc: 'Daily affirmations by category', tag: '' },
      { href: '/dashboard/oracle', emoji: '✦', name: 'Angel Oracle', desc: 'Receive divine guidance', tag: 'Popular' },
      { href: '/dashboard/tarot', emoji: '🃏', name: 'Angel Tarot', desc: 'Major Arcana readings', tag: '' },
    ]
  },
  {
    category: 'Soul & Purpose',
    emoji: '✨',
    color: '#22d3ee',
    tools: [
      { href: '/dashboard/numerology-deep', emoji: '🧮', name: 'Deep Numerology', desc: 'Advanced number calculations', tag: '' },
      { href: '/dashboard/cosmic-weather', emoji: '🌌', name: 'Cosmic Weather', desc: 'Planetary energy forecasts', tag: '' },
      { href: '/dashboard/moon', emoji: '🌙', name: 'Moon Phases', desc: 'Lunar rituals and guidance', tag: '' },
    ]
  },
];

const DAILY_PRACTICES = [
  { time: 'Morning', emoji: '🌅', duration: '5 min', practice: 'Angel Number Intention', desc: 'Log your morning number and set an intention aligned with its meaning.', href: '/dashboard/journal', color: '#f59e0b' },
  { time: 'Midday', emoji: '☀️', duration: '3 min', practice: 'Breathwork Reset', desc: 'Box breathing (4-4-4-4) to clear energy and invite angel messages.', href: '/dashboard/breathwork', color: '#22c55e' },
  { time: 'Afternoon', emoji: '🌤️', duration: '10 min', practice: 'Solfeggio Frequency', desc: '528Hz (Love frequency) to raise your vibration and attract synchronicities.', href: '/dashboard/solfeggio', color: '#c9a84c' },
  { time: 'Evening', emoji: '🌙', duration: '15 min', practice: 'Guided Meditation', desc: 'Angel number activation meditation to process the day’s messages.', href: '/dashboard/meditations', color: '#8b5cf6' },
  { time: 'Night', emoji: '⭐', duration: '5 min', practice: 'Gratitude & Dream Prep', desc: 'Log gratitude and set an intention for angel number dreams.', href: '/dashboard/gratitude', color: '#6366f1' },
];

const HEALING_NUMBERS: Record<string, { title: string; practices: string[]; color: string }> = {
  '111': { title: 'New Beginnings Healing', color: '#f59e0b', practices: ['Morning affirmations facing east', 'Clear quartz meditation', '396Hz solfeggio for liberation', 'Write 11 intentions'] },
  '222': { title: 'Balance & Trust Healing', color: '#22c55e', practices: ['Rose quartz heart meditation', 'Box breathing 2-2-2-2', 'Moonstone under pillow', 'Gratitude for divine timing'] },
  '333': { title: 'Creative Expression Healing', color: '#f97316', practices: ['Throat chakra activation', 'Lapis lazuli journaling', '528Hz love frequency', 'Speak your truth aloud'] },
  '444': { title: 'Protection & Grounding', color: '#22c55e', practices: ['Black tourmaline grid', 'Root chakra breathwork', 'Earth grounding meditation', '417Hz solfeggio'] },
  '555': { title: 'Change & Transformation', color: '#8b5cf6', practices: ['Labradorite transformation ritual', 'Release ceremony', '741Hz solfeggio', 'Moldavite meditation (gentle)'] },
  '777': { title: 'Spiritual Awakening', color: '#c9a84c', practices: ['Amethyst crown meditation', 'Third eye activation', '963Hz solfeggio', 'Full moon ritual'] },
  '888': { title: 'Abundance Activation', color: '#c9a84c', practices: ['Citrine wealth corner ritual', 'Solar plexus breathwork', '888Hz abundance tone', 'Abundance affirmations'] },
  '999': { title: 'Release & Completion', color: '#6366f1', practices: ['Letting go ceremony', 'Moldavite completion ritual', 'Forgiveness meditation', 'New moon intention reset'] },
};

export default function HealingHubPage() {
  const [tab, setTab] = useState<'tools' | 'routine' | 'by-number'>('tools');
  const [logs, setLogs] = useState<{number: string}[]>([]);
  const [selectedNumber, setSelectedNumber] = useState<string>('111');

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('angel_logs') || '[]');
      setLogs(saved);
      if (saved.length > 0) {
        // Find most common number
        const counts: Record<string, number> = {};
        saved.forEach((l: {number: string}) => { counts[l.number] = (counts[l.number] || 0) + 1; });
        const top = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
        if (top && HEALING_NUMBERS[top[0]]) setSelectedNumber(top[0]);
      }
    } catch {}
  }, []);

  const topNumber = logs.length > 0 ? (() => {
    const counts: Record<string, number> = {};
    logs.forEach(l => { counts[l.number] = (counts[l.number] || 0) + 1; });
    return Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0];
  })() : null;

  const healing = HEALING_NUMBERS[selectedNumber];

  return (
    <div style={{ minHeight: '100vh', padding: '2rem 1rem', maxWidth: '700px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 700, color: '#22d3ee', fontFamily: 'Cormorant Garamond, serif' }}>Healing Hub</h1>
        <p style={{ color: 'rgba(255,255,255,0.4)', marginTop: '0.25rem' }}>Your complete spiritual wellness sanctuary</p>
      </div>

      {/* Personalized recommendation */}
      {topNumber && HEALING_NUMBERS[topNumber] && (
        <div style={{ background: 'linear-gradient(135deg, rgba(34,211,238,0.1), rgba(8,6,28,0.95))', borderRadius: '1.5rem', border: '1px solid rgba(34,211,238,0.2)', padding: '1.25rem', marginBottom: '1.25rem', backdropFilter: 'blur(12px)' }}>
          <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.62rem', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '0.5rem' }}>Recommended for your {topNumber} energy</p>
          <p style={{ color: '#fff', fontWeight: 700, fontSize: '1rem', marginBottom: '0.35rem' }}>{HEALING_NUMBERS[topNumber].title}</p>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.82rem' }}>Based on your most logged angel number</p>
        </div>
      )}

      {/* Tab nav */}
      <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '1.5rem', background: 'rgba(255,255,255,0.03)', borderRadius: '999px', padding: '0.25rem' }}>
        {(['tools', 'routine', 'by-number'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            flex: 1, padding: '0.5rem', borderRadius: '999px', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 600,
            background: tab === t ? 'rgba(34,211,238,0.15)' : 'transparent',
            border: tab === t ? '1px solid rgba(34,211,238,0.3)' : '1px solid transparent',
            color: tab === t ? '#22d3ee' : 'rgba(255,255,255,0.4)',
          }}>{t === 'tools' ? 'All Tools' : t === 'routine' ? 'Daily Routine' : 'By Number'}</button>
        ))}
      </div>

      {tab === 'tools' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {HEALING_TOOLS.map(section => (
            <div key={section.category}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <span style={{ fontSize: '1.1rem' }}>{section.emoji}</span>
                <h3 style={{ color: section.color, fontSize: '0.85rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em' }}>{section.category}</h3>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                {section.tools.map(tool => (
                  <Link key={tool.href} href={tool.href} style={{ textDecoration: 'none' }}>
                    <div style={{ background: 'rgba(8,6,28,0.88)', borderRadius: '1.25rem', border: '1px solid rgba(255,255,255,0.07)', padding: '0.875rem 1rem', backdropFilter: 'blur(12px)', display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
                      <span style={{ fontSize: '1.4rem', flexShrink: 0 }}>{tool.emoji}</span>
                      <div style={{ flex: 1 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <p style={{ color: '#fff', fontWeight: 600, fontSize: '0.9rem' }}>{tool.name}</p>
                          {tool.tag && <span style={{ background: `${section.color}20`, border: `1px solid ${section.color}30`, borderRadius: '999px', padding: '0.1rem 0.4rem', fontSize: '0.6rem', color: section.color, fontWeight: 700 }}>{tool.tag}</span>}
                        </div>
                        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem', marginTop: '0.1rem' }}>{tool.desc}</p>
                      </div>
                      <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: '1rem' }}>›</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'routine' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
          <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '1rem', padding: '0.875rem 1rem', marginBottom: '0.5rem', border: '1px solid rgba(255,255,255,0.06)' }}>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.83rem', lineHeight: 1.6, fontStyle: 'italic', fontFamily: 'Cormorant Garamond, serif' }}>
              &ldquo;A consistent spiritual practice is not about perfection — it is about showing up for yourself and the universe, one angel number at a time.&rdquo;
            </p>
          </div>
          {DAILY_PRACTICES.map(p => (
            <Link key={p.time} href={p.href} style={{ textDecoration: 'none' }}>
              <div style={{ background: 'rgba(8,6,28,0.88)', borderRadius: '1.25rem', border: '1px solid rgba(255,255,255,0.07)', padding: '1rem 1.25rem', backdropFilter: 'blur(12px)', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
                <div style={{ textAlign: 'center', flexShrink: 0, minWidth: '52px' }}>
                  <span style={{ fontSize: '1.5rem' }}>{p.emoji}</span>
                  <p style={{ color: p.color, fontSize: '0.65rem', fontWeight: 700, marginTop: '0.2rem' }}>{p.time}</p>
                  <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: '0.6rem' }}>{p.duration}</p>
                </div>
                <div style={{ flex: 1 }}>
                  <p style={{ color: '#fff', fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.25rem' }}>{p.practice}</p>
                  <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem', lineHeight: 1.5 }}>{p.desc}</p>
                </div>
                <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: '1rem', flexShrink: 0 }}>›</span>
              </div>
            </Link>
          ))}
        </div>
      )}

      {tab === 'by-number' && (
        <div>
          {/* Number selector */}
          <div style={{ display: 'flex', gap: '0.4rem', overflowX: 'auto', paddingBottom: '0.5rem', marginBottom: '1.25rem' }}>
            {Object.keys(HEALING_NUMBERS).map(n => (
              <button key={n} onClick={() => setSelectedNumber(n)} style={{
                flexShrink: 0, padding: '0.35rem 0.875rem', borderRadius: '999px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 700,
                background: selectedNumber === n ? `${HEALING_NUMBERS[n].color}20` : 'rgba(255,255,255,0.04)',
                border: selectedNumber === n ? `1px solid ${HEALING_NUMBERS[n].color}40` : '1px solid rgba(255,255,255,0.08)',
                color: selectedNumber === n ? HEALING_NUMBERS[n].color : 'rgba(255,255,255,0.4)',
                fontFamily: 'Cormorant Garamond, serif'
              }}>{n}</button>
            ))}
          </div>

          {healing && (
            <div style={{ background: 'rgba(8,6,28,0.92)', borderRadius: '1.5rem', border: `1px solid ${healing.color}20`, padding: '1.5rem', backdropFilter: 'blur(12px)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem', marginBottom: '1.25rem' }}>
                <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: `${healing.color}15`, border: `2px solid ${healing.color}25`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: healing.color, fontFamily: 'Cormorant Garamond, serif', fontSize: '1.1rem' }}>{selectedNumber}</div>
                <div>
                  <h3 style={{ color: '#fff', fontWeight: 700, fontSize: '1.1rem', fontFamily: 'Cormorant Garamond, serif' }}>{healing.title}</h3>
                  <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.72rem' }}>Recommended healing practices</p>
                </div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {healing.practices.map((practice, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.875rem', padding: '0.75rem', background: 'rgba(255,255,255,0.03)', borderRadius: '0.875rem', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: `${healing.color}15`, border: `1px solid ${healing.color}25`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', color: healing.color, fontWeight: 800, flexShrink: 0 }}>{i + 1}</div>
                    <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem' }}>{practice}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}