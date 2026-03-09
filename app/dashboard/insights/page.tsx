'use client';
import { useState } from 'react';

const INSIGHTS = [
  { id: '1', category: 'Pattern', emoji: '🔍', color: '#c9a84c', title: 'You see 1111 most on Mondays', body: 'Your data shows a strong pattern of 1111 sightings at the start of the week. This may indicate your intuition is sharpest when setting intentions for the week ahead.', number: '1111', action: 'Try a Monday morning intention ritual to amplify this energy.' },
  { id: '2', category: 'Numerology', emoji: '🔢', color: '#a78bfa', title: 'Your Life Path aligns with 444', body: 'As a Life Path 4, the number 444 is your power number. When you see it, your angels are confirming you are building exactly what your soul came here to create.', number: '444', action: 'When you see 444, pause and acknowledge the foundation you are building.' },
  { id: '3', category: 'Timing', emoji: '⏰', color: '#22d3ee', title: 'Most sightings between 11am–1pm', body: 'Your peak angel number awareness window is midday. This is when your conscious and subconscious minds are most aligned, making you more receptive to divine messages.', number: 'All', action: 'Keep your phone accessible during lunch hours for quick logging.' },
  { id: '4', category: 'Spiritual', emoji: '✨', color: '#f472b6', title: '555 appears before major changes', body: 'Looking at your journal entries, 555 consistently appears 1–3 days before you note significant life changes. Your angels are giving you advance notice.', number: '555', action: 'When you see 555, journal what areas of your life feel ready to shift.' },
  { id: '5', category: 'Growth', emoji: '🌱', color: '#22c55e', title: 'Your awareness is growing', body: 'Your logging frequency has increased over time. As you pay more attention to angel numbers, they appear more frequently. You are raising your vibration.', number: 'All', action: 'Continue your daily practice. Consistency is the key to deeper connection.' },
  { id: '6', category: 'Pattern', emoji: '🌙', color: '#8b5cf6', title: 'More logs during moon phases', body: 'You tend to log more angel numbers around new and full moons. Your sensitivity to cosmic energy is heightened during lunar transitions.', number: 'All', action: 'Track moon phases alongside your angel number logs for deeper insight.' },
];

export default function InsightsPage() {
  const [filter, setFilter] = useState('All');
  const categories = ['All', ...Array.from(new Set(INSIGHTS.map(i => i.category)))];
  const filtered = filter === 'All' ? INSIGHTS : INSIGHTS.filter(i => i.category === filter);

  return (
    <div style={{ minHeight: '100vh', padding: '2rem 1rem', maxWidth: '700px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 700, color: '#22d3ee', fontFamily: 'Cormorant Garamond, serif' }}>Insights</h1>
        <p style={{ color: 'rgba(255,255,255,0.4)', marginTop: '0.25rem' }}>Patterns and wisdom from your angel number journey</p>
      </div>
      <div style={{ display: 'flex', gap: '0.4rem', overflowX: 'auto', paddingBottom: '0.5rem', marginBottom: '1.25rem' }}>
        {categories.map(c => (
          <button key={c} onClick={() => setFilter(c)} style={{ flexShrink: 0, padding: '0.35rem 0.875rem', borderRadius: '999px', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 600, background: filter === c ? 'rgba(34,211,238,0.2)' : 'rgba(255,255,255,0.04)', border: filter === c ? '1px solid rgba(34,211,238,0.4)' : '1px solid rgba(255,255,255,0.08)', color: filter === c ? '#22d3ee' : 'rgba(255,255,255,0.4)' }}>{c}</button>
        ))}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {filtered.map(ins => (
          <div key={ins.id} style={{ background: 'rgba(8,6,28,0.88)', borderRadius: '1.5rem', border: `1px solid ${ins.color}20`, padding: '1.25rem', backdropFilter: 'blur(12px)' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.875rem', marginBottom: '0.875rem' }}>
              <div style={{ width: '44px', height: '44px', borderRadius: '50%', background: `${ins.color}15`, border: `1px solid ${ins.color}25`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem', flexShrink: 0 }}>{ins.emoji}</div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '0.3rem', flexWrap: 'wrap' }}>
                  <span style={{ background: `${ins.color}10`, border: `1px solid ${ins.color}20`, borderRadius: '999px', padding: '0.1rem 0.5rem', fontSize: '0.6rem', color: ins.color, fontWeight: 700 }}>{ins.category}</span>
                  <span style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '999px', padding: '0.1rem 0.5rem', fontSize: '0.6rem', color: 'rgba(255,255,255,0.3)' }}>{ins.number}</span>
                </div>
                <p style={{ color: '#fff', fontWeight: 700, fontSize: '0.92rem', fontFamily: 'Cormorant Garamond, serif' }}>{ins.title}</p>
              </div>
            </div>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.83rem', lineHeight: 1.7, marginBottom: '0.75rem' }}>{ins.body}</p>
            <div style={{ background: `${ins.color}08`, borderRadius: '0.875rem', padding: '0.75rem', border: `1px solid ${ins.color}15` }}>
              <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.2rem' }}>Action</p>
              <p style={{ color: ins.color, fontSize: '0.82rem', lineHeight: 1.5 }}>{ins.action}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
