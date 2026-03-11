'use client';
import { useState, useEffect } from 'react';
import { getLiveSyncMatches, LiveSyncMatch } from '@/lib/supabase-db';
import { getMockMatches } from '@/lib/sync-matching';
import { getLogs, getNumerologyProfile } from '@/lib/storage';

function SyncScoreRing({ score }: { score: number }) {
  const r = 28, circ = 2 * Math.PI * r;
  const dash = (score / 100) * circ;
  const color = score >= 80 ? '#c9a84c' : score >= 60 ? '#a78bfa' : '#60a5fa';
  return (
    <svg width="72" height="72" style={{ transform: 'rotate(-90deg)' }}>
      <circle cx="36" cy="36" r={r} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="6" />
      <circle cx="36" cy="36" r={r} fill="none" stroke={color} strokeWidth="6"
        strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
        style={{ transition: 'stroke-dasharray 1s ease', filter: `drop-shadow(0 0 6px ${color})` }} />
      <text x="36" y="36" textAnchor="middle" dominantBaseline="middle"
        style={{ transform: 'rotate(90deg)', transformOrigin: '36px 36px', fill: color, fontSize: '1rem', fontWeight: 800, fontFamily: 'Cormorant Garamond, serif' }}>
        {score}%
      </text>
    </svg>
  );
}

export default function SyncPage() {
  const [matches, setMatches] = useState<LiveSyncMatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [expanded, setExpanded] = useState<string | null>(null);
  const [isRealData, setIsRealData] = useState(false);
  const [userNumbers, setUserNumbers] = useState<string[]>([]);

  useEffect(() => {
    ;(async () => {
      const logs = await getLogs();
      const nums = [...new Set(logs.map((l: any) => l.number))] as string[];
      setUserNumbers(nums);
      const profile = await getNumerologyProfile();

      // Try real Supabase data first
      try {
        const real = await getLiveSyncMatches();
        if (real.length > 0) {
          setMatches(real);
          setIsRealData(true);
          setLoading(false);
          return;
        }
      } catch {}

      // Fallback to mock data
      setTimeout(() => {
        setMatches(getMockMatches(nums, profile?.lifePath || 7) as any);
        setLoading(false);
      }, 800);
    })();
  }, []);

  const filtered = matches.filter(m => {
    if (filter === 'high') return m.syncScore >= 80;
    if (filter === 'verified') return (m.verified || 0) >= 2;
    return true;
  });

  return (
    <div style={{ minHeight: '100vh', padding: '1.5rem 1rem 6rem', maxWidth: '600px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🔮</div>
        <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2rem', fontWeight: 700, color: '#fff', margin: 0 }}>Live Sync</h1>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', marginTop: '0.3rem' }}>
          {isRealData ? '✦ Real-time cosmic connections' : '✦ Demo connections — log numbers to find real matches'}
        </p>
        {isRealData && (
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.5rem',
            padding: '0.25rem 0.75rem', borderRadius: '999px', background: 'rgba(201,168,76,0.15)',
            border: '1px solid rgba(201,168,76,0.3)', color: '#c9a84c', fontSize: '0.75rem' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#c9a84c',
              boxShadow: '0 0 6px #c9a84c', animation: 'pulse 2s infinite' }} />
            Live Data
          </div>
        )}
      </div>

      {/* Your numbers */}
      {userNumbers.length > 0 && (
        <div style={{ background: 'rgba(8,6,28,0.7)', border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: '16px', padding: '1rem', marginBottom: '1.5rem', backdropFilter: 'blur(12px)' }}>
          <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.75rem', marginBottom: '0.5rem' }}>YOUR RECENT NUMBERS</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
            {userNumbers.slice(0, 8).map(n => (
              <span key={n} style={{ padding: '0.2rem 0.6rem', borderRadius: '999px',
                background: 'rgba(201,168,76,0.15)', border: '1px solid rgba(201,168,76,0.3)',
                color: '#c9a84c', fontSize: '0.8rem', fontWeight: 700 }}>{n}</span>
            ))}
          </div>
        </div>
      )}

      {/* Filters */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', overflowX: 'auto', paddingBottom: '0.25rem' }}>
        {[['all','All Matches'],['high','High Sync (80%+)'],['verified','Verified']].map(([val, label]) => (
          <button key={val} onClick={() => setFilter(val)}
            style={{ padding: '0.4rem 1rem', borderRadius: '999px', border: 'none', cursor: 'pointer',
              whiteSpace: 'nowrap', fontSize: '0.8rem', fontWeight: 600,
              background: filter === val ? 'rgba(201,168,76,0.3)' : 'rgba(255,255,255,0.07)',
              color: filter === val ? '#c9a84c' : 'rgba(255,255,255,0.6)' }}>
            {label}
          </button>
        ))}
      </div>

      {/* Matches */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem 0' }}>
          <div style={{ fontSize: '2rem', marginBottom: '1rem', animation: 'spin 2s linear infinite' }}>✦</div>
          <p style={{ color: 'rgba(255,255,255,0.4)' }}>Scanning the cosmos...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem 1rem',
          background: 'rgba(8,6,28,0.7)', borderRadius: '20px', border: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🌌</div>
          <p style={{ color: 'rgba(255,255,255,0.6)', marginBottom: '0.5rem' }}>No matches yet</p>
          <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.85rem' }}>Log more angel numbers to attract cosmic connections</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {filtered.map((m, i) => (
            <div key={m.userId || i}
              onClick={() => setExpanded(expanded === (m.userId || String(i)) ? null : (m.userId || String(i)))}
              style={{ background: 'rgba(8,6,28,0.85)', border: expanded === (m.userId || String(i))
                ? '1px solid rgba(201,168,76,0.4)' : '1px solid rgba(255,255,255,0.08)',
                borderRadius: '20px', padding: '1.25rem', cursor: 'pointer',
                backdropFilter: 'blur(12px)', transition: 'all 0.3s ease' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                {/* Avatar */}
                <div style={{ width: '52px', height: '52px', borderRadius: '50%', flexShrink: 0,
                  background: m.avatarUrl ? 'transparent' : (m.avatarColor || '#9b59b6'),
                  border: '2px solid rgba(255,255,255,0.15)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1.4rem', overflow: 'hidden' }}>
                  {m.avatarUrl
                    ? <img src={m.avatarUrl} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    : '✨'}
                </div>
                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                    <span style={{ color: '#fff', fontWeight: 700, fontSize: '1rem' }}>{m.displayName}</span>
                    {m.lifePath && (
                      <span style={{ fontSize: '0.65rem', padding: '0.1rem 0.4rem', borderRadius: '999px',
                        background: 'rgba(155,89,182,0.15)', border: '1px solid rgba(155,89,182,0.3)', color: '#9b59b6' }}>
                        LP {m.lifePath}
                      </span>
                    )}
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem', marginTop: '0.4rem' }}>
                    {m.sharedNumbers.slice(0, 4).map(n => (
                      <span key={n} style={{ fontSize: '0.75rem', padding: '0.15rem 0.5rem', borderRadius: '999px',
                        background: 'rgba(201,168,76,0.15)', border: '1px solid rgba(201,168,76,0.3)', color: '#c9a84c' }}>
                        {n}
                      </span>
                    ))}
                    {m.sharedNumbers.length > 4 && (
                      <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)' }}>+{m.sharedNumbers.length - 4} more</span>
                    )}
                  </div>
                </div>
                {/* Score ring */}
                <SyncScoreRing score={m.syncScore} />
              </div>

              {/* Expanded */}
              {expanded === (m.userId || String(i)) && (
                <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                  <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem', marginBottom: '0.75rem' }}>
                    You both logged <strong style={{ color: '#c9a84c' }}>{m.sharedNumbers.join(', ')}</strong> in the last 48 hours.
                    The universe is aligning your paths. ✨
                  </p>
                  <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <button style={{ flex: 1, padding: '0.6rem', borderRadius: '12px', border: 'none',
                      background: 'rgba(201,168,76,0.2)', color: '#c9a84c', fontWeight: 600,
                      fontSize: '0.85rem', cursor: 'pointer' }}>💌 Send Sync Signal</button>
                    <button style={{ flex: 1, padding: '0.6rem', borderRadius: '12px', border: 'none',
                      background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.6)',
                      fontSize: '0.85rem', cursor: 'pointer' }}>👁 View Profile</button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
