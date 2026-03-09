'use client';
import { useState, useEffect } from 'react';

const DEMO_TWINS = [
  { id: '1', name: 'Luna M.', avatar: '🌙', location: 'Sedona, AZ', syncScore: 94,
    sharedNumbers: ['1111','333','777'], lifePathNumber: 7, recentNumber: '1111',
    timeAgo: '12 min ago', bio: 'Spiritual seeker, crystal healer, moon lover.',
    numerologySign: 'The Seeker', color: '#8b5cf6', online: true },
  { id: '2', name: 'Orion K.', avatar: '⭐', location: 'Bali, Indonesia', syncScore: 88,
    sharedNumbers: ['444','1212'], lifePathNumber: 4, recentNumber: '444',
    timeAgo: '34 min ago', bio: 'Sacred geometry artist and meditation guide.',
    numerologySign: 'The Builder', color: '#3b82f6', online: true },
  { id: '3', name: 'Sage R.', avatar: '🌿', location: 'Glastonbury, UK', syncScore: 82,
    sharedNumbers: ['555','1111'], lifePathNumber: 5, recentNumber: '555',
    timeAgo: '1 hr ago', bio: 'Herbalist, tarot reader, nature mystic.',
    numerologySign: 'The Adventurer', color: '#22c55e', online: false },
  { id: '4', name: 'Nova S.', avatar: '✨', location: 'Tulum, Mexico', syncScore: 79,
    sharedNumbers: ['222','888'], lifePathNumber: 2, recentNumber: '222',
    timeAgo: '2 hrs ago', bio: 'Sound healer and sacred feminine teacher.',
    numerologySign: 'The Peacemaker', color: '#f9a8d4', online: false },
  { id: '5', name: 'Zephyr A.', avatar: '🌊', location: 'Byron Bay, AU', syncScore: 75,
    sharedNumbers: ['999','333'], lifePathNumber: 9, recentNumber: '999',
    timeAgo: '3 hrs ago', bio: 'Surfer, shaman, cosmic wanderer.',
    numerologySign: 'The Humanitarian', color: '#c9a84c', online: false },
];

const SYNC_FACTORS = [
  { label: 'Shared Angel Numbers', icon: '🔢', weight: 40 },
  { label: 'Life Path Harmony', icon: '🌟', weight: 30 },
  { label: 'Timing Proximity', icon: '⏱', weight: 20 },
  { label: 'Numerology Overlap', icon: '🔮', weight: 10 },
];

export default function SoulTwinPage() {
  const [selected, setSelected] = useState(DEMO_TWINS[0]);
  const [filter, setFilter] = useState<'all'|'online'|'high'>('all');
  const [connected, setConnected] = useState<string[]>([]);

  const filtered = DEMO_TWINS.filter(t => {
    if (filter === 'online') return t.online;
    if (filter === 'high') return t.syncScore >= 85;
    return true;
  });

  const connect = (id: string) => setConnected(prev =>
    prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
  );

  return (
    <div style={{ minHeight: '100vh', padding: '2rem 1rem', maxWidth: '900px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 700, color: '#c9a84c', fontFamily: 'Cormorant Garamond, serif' }}>Soul Twin Radar</h1>
        <p style={{ color: 'rgba(255,255,255,0.6)', marginTop: '0.5rem' }}>Souls seeing the same numbers as you right now</p>
      </div>

      {/* Live indicator */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '1.5rem' }}>
        <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#22c55e', boxShadow: '0 0 8px #22c55e' }} />
        <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem' }}>Live matching active · {DEMO_TWINS.filter(t => t.online).length} souls online now</span>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', justifyContent: 'center' }}>
        {(['all','online','high'] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{
            padding: '0.4rem 1rem', borderRadius: '999px', cursor: 'pointer',
            background: filter === f ? '#c9a84c' : 'rgba(255,255,255,0.08)',
            color: filter === f ? '#000' : 'rgba(255,255,255,0.7)',
            border: 'none', fontSize: '0.85rem', fontWeight: 600,
            textTransform: 'capitalize'
          }}>{f === 'high' ? 'High Sync (85%+)' : f === 'online' ? 'Online Now' : 'All Matches'}</button>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '1.5rem' }}>
        {/* Match List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {filtered.map(twin => (
            <button key={twin.id} onClick={() => setSelected(twin)} style={{
              background: selected.id === twin.id ? `${twin.color}15` : 'rgba(255,255,255,0.04)',
              border: `1px solid ${selected.id === twin.id ? twin.color + '60' : 'rgba(255,255,255,0.08)'}`,
              borderRadius: '1.25rem', padding: '1rem',
              cursor: 'pointer', textAlign: 'left', width: '100%',
              transition: 'all 0.2s'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{ position: 'relative' }}>
                  <div style={{
                    width: '44px', height: '44px', borderRadius: '50%',
                    background: `${twin.color}30`, border: `2px solid ${twin.color}60`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem'
                  }}>{twin.avatar}</div>
                  {twin.online && <div style={{
                    position: 'absolute', bottom: 0, right: 0,
                    width: '10px', height: '10px', borderRadius: '50%',
                    background: '#22c55e', border: '2px solid #050510'
                  }} />}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ color: '#fff', fontWeight: 600, fontSize: '0.95rem' }}>{twin.name}</div>
                  <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem' }}>{twin.location}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ color: twin.color, fontWeight: 700, fontSize: '1.1rem' }}>{twin.syncScore}%</div>
                  <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.7rem' }}>sync</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.3rem', marginTop: '0.5rem', flexWrap: 'wrap' }}>
                {twin.sharedNumbers.map(n => (
                  <span key={n} style={{
                    background: `${twin.color}20`, borderRadius: '999px',
                    padding: '0.1rem 0.5rem', color: twin.color, fontSize: '0.7rem', fontWeight: 700
                  }}>{n}</span>
                ))}
              </div>
            </button>
          ))}
        </div>

        {/* Detail Panel */}
        <div style={{
          background: 'rgba(8,6,28,0.88)', borderRadius: '1.5rem',
          border: `1px solid ${selected.color}40`, padding: '1.5rem',
          backdropFilter: 'blur(12px)', alignSelf: 'start', position: 'sticky', top: '1rem'
        }}>
          {/* Avatar & Name */}
          <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
            <div style={{
              width: '72px', height: '72px', borderRadius: '50%', margin: '0 auto 0.75rem',
              background: `radial-gradient(circle, ${selected.color}40, ${selected.color}10)`,
              border: `2px solid ${selected.color}80`,
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2rem',
              boxShadow: `0 0 30px ${selected.color}30`
            }}>{selected.avatar}</div>
            <h3 style={{ color: '#fff', fontSize: '1.2rem', fontWeight: 700, fontFamily: 'Cormorant Garamond, serif' }}>{selected.name}</h3>
            <p style={{ color: selected.color, fontSize: '0.85rem' }}>{selected.numerologySign} · Life Path {selected.lifePathNumber}</p>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem' }}>{selected.location}</p>
          </div>

          {/* Sync Score Ring */}
          <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
            <div style={{
              display: 'inline-flex', flexDirection: 'column', alignItems: 'center',
              background: `${selected.color}10`, borderRadius: '1rem',
              padding: '1rem 2rem', border: `1px solid ${selected.color}30`
            }}>
              <span style={{ fontSize: '2.5rem', fontWeight: 800, color: selected.color }}>{selected.syncScore}%</span>
              <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem' }}>Sync Score</span>
            </div>
          </div>

          {/* Sync Factors */}
          <div style={{ marginBottom: '1.5rem' }}>
            {SYNC_FACTORS.map(f => (
              <div key={f.label} style={{ marginBottom: '0.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.2rem' }}>
                  <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.75rem' }}>{f.icon} {f.label}</span>
                  <span style={{ color: selected.color, fontSize: '0.75rem' }}>{Math.round(selected.syncScore * f.weight / 100 * (0.8 + Math.random() * 0.4))}%</span>
                </div>
                <div style={{ height: '4px', background: 'rgba(255,255,255,0.08)', borderRadius: '2px' }}>
                  <div style={{
                    height: '100%', borderRadius: '2px',
                    background: selected.color,
                    width: `${Math.round(selected.syncScore * f.weight / 100 * (0.8 + 0.2))}%`
                  }} />
                </div>
              </div>
            ))}
          </div>

          {/* Bio */}
          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', marginBottom: '1rem', fontStyle: 'italic' }}>“{selected.bio}”</p>

          {/* Shared numbers */}
          <div style={{ marginBottom: '1.5rem' }}>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.7rem', marginBottom: '0.4rem' }}>SHARED NUMBERS</p>
            <div style={{ display: 'flex', gap: '0.4rem' }}>
              {selected.sharedNumbers.map(n => (
                <span key={n} style={{
                  background: `${selected.color}20`, border: `1px solid ${selected.color}50`,
                  borderRadius: '999px', padding: '0.25rem 0.7rem',
                  color: selected.color, fontSize: '0.85rem', fontWeight: 700
                }}>{n}</span>
              ))}
            </div>
          </div>

          {/* Connect button */}
          <button onClick={() => connect(selected.id)} style={{
            width: '100%', padding: '0.75rem', borderRadius: '999px', cursor: 'pointer',
            background: connected.includes(selected.id) ? 'rgba(255,255,255,0.08)' : selected.color,
            color: connected.includes(selected.id) ? 'rgba(255,255,255,0.7)' : '#000',
            border: connected.includes(selected.id) ? '1px solid rgba(255,255,255,0.2)' : 'none',
            fontSize: '0.95rem', fontWeight: 700
          }}>{connected.includes(selected.id) ? '✓ Connected' : '✨ Connect Souls'}</button>
        </div>
      </div>
    </div>
  );
}