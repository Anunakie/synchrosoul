'use client';
import { useState, useEffect } from 'react';
import { getSavedReadings, deleteReading, SavedReading } from '@/lib/saved-readings';

const TYPE_META: Record<string, { emoji: string; color: string; label: string }> = {
  numerology:     { emoji: '🔢', color: '#c9a84c',  label: 'Numerology' },
  tarot:          { emoji: '🃏', color: '#a78bfa',  label: 'Tarot' },
  oracle:         { emoji: '🔮', color: '#60a5fa',  label: 'Oracle' },
  compatibility:  { emoji: '💞', color: '#f472b6',  label: 'Compatibility' },
  'karmic-debt':  { emoji: '⛓️', color: '#ef4444',  label: 'Karmic Debt' },
  'personal-year':{ emoji: '📅', color: '#34d399',  label: 'Personal Year' },
  relationships:  { emoji: '🌹', color: '#fb923c',  label: 'Relationships' },
  synthesis:      { emoji: '✨', color: '#c9a84c',  label: 'Synthesis' },
  'cosmic-report':{ emoji: '🌌', color: '#818cf8',  label: 'Cosmic Report' },
  affirmation:    { emoji: '💫', color: '#4ade80',  label: 'Affirmation' },
  other:          { emoji: '📖', color: '#94a3b8',  label: 'Reading' },
};

function timeAgo(ts: string) {
  const diff = Date.now() - new Date(ts).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'just now';
  if (m < 60) return m + 'm ago';
  const h = Math.floor(m / 60);
  if (h < 24) return h + 'h ago';
  return Math.floor(h / 24) + 'd ago';
}

export default function SavedReadingsPage() {
  const [readings, setReadings] = useState<SavedReading[]>([]);
  const [filter, setFilter] = useState('all');
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => { setReadings(getSavedReadings()); }, []);

  const handleDelete = (id: string) => {
    deleteReading(id);
    setReadings(getSavedReadings());
    if (expanded === id) setExpanded(null);
  };

  const types = ['all', ...Array.from(new Set(readings.map(r => r.type)))];
  const filtered = filter === 'all' ? readings : readings.filter(r => r.type === filter);

  return (
    <div style={{ minHeight: '100vh', padding: '1.5rem 1rem 6rem', maxWidth: '640px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>📚</div>
        <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2rem', fontWeight: 700, color: '#fff', margin: 0 }}>Saved Readings</h1>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem', marginTop: '0.3rem' }}>
          {readings.length} reading{readings.length !== 1 ? 's' : ''} saved to your cosmic library
        </p>
      </div>

      {/* Type filters */}
      {readings.length > 0 && (
        <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '1.5rem', overflowX: 'auto', paddingBottom: '0.25rem' }}>
          {types.map(t => {
            const meta = t === 'all' ? { emoji: '✦', color: '#c9a84c', label: 'All' } : TYPE_META[t] || TYPE_META.other;
            return (
              <button key={t} onClick={() => setFilter(t)}
                style={{ padding: '0.35rem 0.85rem', borderRadius: '999px', border: 'none', cursor: 'pointer',
                  whiteSpace: 'nowrap', fontSize: '0.78rem', fontWeight: 600,
                  background: filter === t ? `rgba(${hexToRgb(meta.color)},0.25)` : 'rgba(255,255,255,0.07)',
                  color: filter === t ? meta.color : 'rgba(255,255,255,0.5)' }}>
                {meta.emoji} {meta.label}
              </button>
            );
          })}
        </div>
      )}

      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem 1rem',
          background: 'rgba(8,6,28,0.7)', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📖</div>
          <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '0.5rem' }}>No saved readings yet</p>
          <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.85rem' }}>Tap ✧ Save Reading on any reading to add it here</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          {filtered.map(r => {
            const meta = TYPE_META[r.type] || TYPE_META.other;
            const isOpen = expanded === r.id;
            return (
              <div key={r.id} style={{ background: 'rgba(8,6,28,0.88)', border: `1px solid ${isOpen ? meta.color + '55' : 'rgba(255,255,255,0.08)'}`,
                borderRadius: '18px', overflow: 'hidden', backdropFilter: 'blur(12px)',
                transition: 'border-color 0.2s' }}>
                {/* Header row */}
                <div onClick={() => setExpanded(isOpen ? null : r.id)}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1rem 1.1rem', cursor: 'pointer' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '12px', flexShrink: 0,
                    background: `rgba(${hexToRgb(meta.color)},0.15)`,
                    border: `1px solid ${meta.color}44`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem' }}>
                    {r.emoji || meta.emoji}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ color: '#fff', fontWeight: 700, fontSize: '0.95rem',
                      overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.title}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.2rem' }}>
                      <span style={{ fontSize: '0.7rem', padding: '0.1rem 0.45rem', borderRadius: '999px',
                        background: `rgba(${hexToRgb(meta.color)},0.15)`, color: meta.color,
                        border: `1px solid ${meta.color}44` }}>{meta.label}</span>
                      <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.72rem' }}>{timeAgo(r.savedAt)}</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <button onClick={e => { e.stopPropagation(); handleDelete(r.id); }}
                      style={{ padding: '0.3rem 0.6rem', borderRadius: '8px', border: 'none', cursor: 'pointer',
                        background: 'rgba(239,68,68,0.1)', color: 'rgba(239,68,68,0.7)', fontSize: '0.75rem',
                        fontWeight: 600, transition: 'all 0.2s' }}
                      title="Delete reading">
                      🗑
                    </button>
                    <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.8rem', transition: 'transform 0.2s',
                      transform: isOpen ? 'rotate(180deg)' : 'none', display: 'inline-block' }}>▾</span>
                  </div>
                </div>

                {/* Expanded content */}
                {isOpen && (
                  <div style={{ padding: '0 1.1rem 1.1rem', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                    {r.subtitle && (
                      <p style={{ color: meta.color, fontSize: '0.8rem', fontWeight: 600, margin: '0.75rem 0 0.5rem' }}>{r.subtitle}</p>
                    )}
                    <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.9rem', lineHeight: 1.7,
                      margin: '0.75rem 0 0', whiteSpace: 'pre-wrap' }}>{r.content}</p>
                    {r.metadata && Object.keys(r.metadata).length > 0 && (
                      <div style={{ marginTop: '0.75rem', display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                        {Object.entries(r.metadata).map(([k, v]) => (
                          <span key={k} style={{ fontSize: '0.72rem', padding: '0.15rem 0.5rem', borderRadius: '999px',
                            background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.45)',
                            border: '1px solid rgba(255,255,255,0.08)' }}>
                            {k}: {String(v)}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function hexToRgb(hex: string): string {
  const r = parseInt(hex.slice(1,3),16);
  const g = parseInt(hex.slice(3,5),16);
  const b = parseInt(hex.slice(5,7),16);
  return `${r},${g},${b}`;
}
