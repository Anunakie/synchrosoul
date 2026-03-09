'use client';
import { useState, useEffect } from 'react';

const mockSoulTwins = [
  { id: '1', name: 'Luna M.', avatar: '🌙', location: 'Portland, OR', sharedNumbers: ['1111', '333', '777'], syncScore: 94, lifePath: 7, bio: 'Spiritual seeker, crystal healer, and lover of midnight walks under the stars.', lastActive: '2 hours ago', verified: 3 },
  { id: '2', name: 'Orion K.', avatar: '⭐', location: 'Sedona, AZ', sharedNumbers: ['555', '1111'], syncScore: 87, lifePath: 11, bio: 'Energy worker and sound healer. I see 1111 every single day without fail.', lastActive: '5 hours ago', verified: 5 },
  { id: '3', name: 'Sage R.', avatar: '🌿', location: 'Asheville, NC', sharedNumbers: ['222', '444', '888'], syncScore: 82, lifePath: 2, bio: 'Herbalist and intuitive reader. Numbers guide my path daily.', lastActive: '1 day ago', verified: 2 },
  { id: '4', name: 'Nova T.', avatar: '💫', location: 'Santa Fe, NM', sharedNumbers: ['999', '333'], syncScore: 78, lifePath: 9, bio: 'Artist and mystic. In the middle of a massive life transformation.', lastActive: '3 hours ago', verified: 4 },
  { id: '5', name: 'River A.', avatar: '🌊', location: 'Byron Bay, AU', sharedNumbers: ['1111', '444'], syncScore: 75, lifePath: 4, bio: 'Surfer, meditator, and student of sacred geometry.', lastActive: '12 hours ago', verified: 1 },
];

const compatibilityMatrix: Record<string, Record<string, string>> = {
  '1': { '1': 'Powerful but competitive', '2': 'Perfect balance', '3': 'Creative fire', '4': 'Solid foundation', '5': 'Exciting tension', '6': 'Nurturing bond', '7': 'Mystical depth', '8': 'Power couple', '9': 'Inspiring union', '11': 'Visionary pair', '22': 'World changers', '33': 'Sacred service' },
  '7': { '1': 'Mystical depth', '2': 'Intuitive harmony', '3': 'Inspired creativity', '4': 'Grounded wisdom', '5': 'Adventurous minds', '6': 'Healing love', '7': 'Twin flame energy', '8': 'Spiritual power', '9': 'Enlightened souls', '11': 'Cosmic awakening', '22': 'Ancient wisdom', '33': 'Divine teachers' },
};

export default function SoulTwinPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [profile, setProfile] = useState<any>(null);
  const [filter, setFilter] = useState<'all'|'high'|'verified'>('all');
  const [selected, setSelected] = useState<string | null>(null);
  const [connected, setConnected] = useState<string[]>([]);

  useEffect(() => {
    const l = localStorage.getItem('synchrosoul_logs'); if (l) setLogs(JSON.parse(l));
    const p = localStorage.getItem('synchrosoul_profile'); if (p) setProfile(JSON.parse(p));
    const c = localStorage.getItem('synchrosoul_connections'); if (c) setConnected(JSON.parse(c));
  }, []);

  const myNumbers = [...new Set(logs.slice(0, 20).map((l: any) => l.number))];

  const twins = mockSoulTwins.map(t => ({
    ...t,
    sharedWithMe: t.sharedNumbers.filter(n => myNumbers.includes(n)),
  })).sort((a, b) => b.syncScore - a.syncScore);

  const filtered = twins.filter(t => {
    if (filter === 'high') return t.syncScore >= 85;
    if (filter === 'verified') return t.verified >= 3;
    return true;
  });

  const connect = (id: string) => {
    const updated = connected.includes(id) ? connected.filter(c => c !== id) : [...connected, id];
    setConnected(updated);
    localStorage.setItem('synchrosoul_connections', JSON.stringify(updated));
  };

  const selectedTwin = twins.find(t => t.id === selected);

  return (
    <div style={{ minHeight: '100vh', padding: '2rem 1rem', maxWidth: '700px', margin: '0 auto' }}>
      <h1 style={{ textAlign: 'center', fontSize: '1.8rem', fontWeight: 700, color: '#e8d5b7', marginBottom: '0.5rem' }}>👥 Soul Twin Radar</h1>
      <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.5)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>Souls seeing the same numbers as you right now</p>

      {myNumbers.length > 0 && (
        <div style={{ background: 'rgba(8,6,28,0.85)', border: '1px solid rgba(201,168,76,0.2)', borderRadius: '1rem', padding: '1rem 1.25rem', backdropFilter: 'blur(10px)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
          <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.78rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>Your signal:</span>
          {myNumbers.slice(0, 6).map(n => (
            <span key={n} style={{ padding: '0.2rem 0.6rem', background: 'rgba(201,168,76,0.15)', border: '1px solid rgba(201,168,76,0.3)', borderRadius: '999px', color: '#c9a84c', fontSize: '0.82rem', fontWeight: 600 }}>{n}</span>
          ))}
        </div>
      )}

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', justifyContent: 'center' }}>
        {(['all','high','verified'] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{ padding: '0.4rem 1rem', borderRadius: '999px', background: filter === f ? 'rgba(155,89,182,0.2)' : 'rgba(255,255,255,0.05)', border: filter === f ? '1px solid rgba(155,89,182,0.4)' : '1px solid rgba(255,255,255,0.08)', color: filter === f ? '#b794f4' : 'rgba(255,255,255,0.5)', cursor: 'pointer', fontSize: '0.82rem' }}>
            {f === 'all' ? '✨ All' : f === 'high' ? '🔥 85%+ Sync' : '✅ Verified'}
          </button>
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginBottom: '1.5rem' }}>
        {filtered.map(twin => {
          const isConnected = connected.includes(twin.id);
          const isSelected = selected === twin.id;
          return (
            <div key={twin.id} style={{ background: 'rgba(8,6,28,0.88)', border: isSelected ? '1px solid rgba(155,89,182,0.4)' : '1px solid rgba(255,255,255,0.07)', borderRadius: '1.25rem', padding: '1.25rem', backdropFilter: 'blur(10px)', cursor: 'pointer', transition: 'all 0.2s' }} onClick={() => setSelected(isSelected ? null : twin.id)}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'linear-gradient(135deg, rgba(155,89,182,0.3), rgba(201,168,76,0.2))', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', flexShrink: 0, border: '1px solid rgba(255,255,255,0.1)' }}>{twin.avatar}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <span style={{ color: '#e8d5b7', fontWeight: 600, fontSize: '0.95rem' }}>{twin.name}</span>
                    <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.75rem' }}>LP {twin.lifePath}</span>
                    {twin.verified >= 3 && <span style={{ fontSize: '0.65rem', background: 'rgba(72,187,120,0.15)', color: '#48bb78', padding: '0.1rem 0.4rem', borderRadius: '999px', border: '1px solid rgba(72,187,120,0.25)' }}>✓ Verified</span>}
                  </div>
                  <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem' }}>{twin.location} · {twin.lastActive}</div>
                  <div style={{ display: 'flex', gap: '0.3rem', marginTop: '0.4rem', flexWrap: 'wrap' }}>
                    {twin.sharedNumbers.map(n => (
                      <span key={n} style={{ fontSize: '0.7rem', padding: '0.1rem 0.4rem', background: myNumbers.includes(n) ? 'rgba(201,168,76,0.2)' : 'rgba(255,255,255,0.06)', border: myNumbers.includes(n) ? '1px solid rgba(201,168,76,0.35)' : '1px solid rgba(255,255,255,0.08)', borderRadius: '999px', color: myNumbers.includes(n) ? '#c9a84c' : 'rgba(255,255,255,0.4)' }}>{n}</span>
                    ))}
                  </div>
                </div>
                <div style={{ textAlign: 'center', flexShrink: 0 }}>
                  <div style={{ fontSize: '1.3rem', fontWeight: 800, color: twin.syncScore >= 90 ? '#c9a84c' : twin.syncScore >= 80 ? '#9b59b6' : '#3498db' }}>{twin.syncScore}%</div>
                  <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.65rem' }}>sync</div>
                </div>
              </div>

              {isSelected && (
                <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
                  <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.88rem', lineHeight: 1.7, marginBottom: '1rem', fontStyle: 'italic' }}>“{twin.bio}”</p>
                  {twin.sharedWithMe.length > 0 && (
                    <div style={{ marginBottom: '0.75rem', padding: '0.6rem 0.9rem', background: 'rgba(201,168,76,0.08)', borderRadius: '0.6rem', border: '1px solid rgba(201,168,76,0.15)' }}>
                      <span style={{ color: '#c9a84c', fontSize: '0.8rem' }}>✨ You both see: {twin.sharedWithMe.join(', ')}</span>
                    </div>
                  )}
                  <button onClick={e => { e.stopPropagation(); connect(twin.id); }} style={{ width: '100%', padding: '0.7rem', borderRadius: '0.75rem', background: isConnected ? 'rgba(72,187,120,0.15)' : 'linear-gradient(135deg, rgba(155,89,182,0.3), rgba(201,168,76,0.2))', border: isConnected ? '1px solid rgba(72,187,120,0.3)' : '1px solid rgba(155,89,182,0.3)', color: isConnected ? '#48bb78' : '#e8d5b7', cursor: 'pointer', fontWeight: 600, fontSize: '0.9rem' }}>
                    {isConnected ? '✓ Connected — Send Message' : '💫 Connect Souls'}
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div style={{ background: 'rgba(8,6,28,0.75)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '1rem', padding: '1.25rem', backdropFilter: 'blur(8px)', textAlign: 'center' }}>
        <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.8rem', lineHeight: 1.7, margin: 0 }}>🔮 Real-time matching activates when you connect your Supabase account. These are preview matches based on your logged numbers.</p>
      </div>
    </div>
  );
}
