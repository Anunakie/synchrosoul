'use client';
import FeatureGate from '@/components/FeatureGate'
import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';

interface SoulMatch {
  id: string;
  name: string;
  avatar: string;
  lifePathNumber: number;
  syncScore: number;
  sharedNumbers: string[];
  lastActive: string;
  verified: number;
  bio: string;
  isReal: boolean;
}

const MOCK_TWINS: SoulMatch[] = [
  { id: 'm1', name: 'Luna S.', avatar: '🌙', lifePathNumber: 7, syncScore: 94, sharedNumbers: ['1111', '777'], lastActive: '2 min ago', verified: 3, bio: 'Spiritual seeker, crystal healer, and lover of sacred geometry.', isReal: false },
  { id: 'm2', name: 'Orion M.', avatar: '⭐', lifePathNumber: 11, syncScore: 87, sharedNumbers: ['1111', '333'], lastActive: '15 min ago', verified: 5, bio: 'Astrologer and meditation teacher walking the path of light.', isReal: false },
  { id: 'm3', name: 'Sage R.', avatar: '🌿', lifePathNumber: 5, syncScore: 81, sharedNumbers: ['555'], lastActive: '1 hr ago', verified: 2, bio: 'Digital nomad, sound healer, and angel number enthusiast.', isReal: false },
  { id: 'm4', name: 'Celeste V.', avatar: '✨', lifePathNumber: 2, syncScore: 76, sharedNumbers: ['444', '1111'], lastActive: '3 hr ago', verified: 4, bio: 'Yoga teacher and Akashic Records reader. Love and light always.', isReal: false },
];

const SOUL_SIGNS = [
  { sign: 'Identical number sequences', desc: 'When two souls are meant to connect, the universe sends the same numbers to both.', emoji: '🔢' },
  { sign: 'Unexplained magnetic pull', desc: 'A pull that defies logic — your soul recognizes theirs across time and space.', emoji: '🧲' },
  { sign: 'Shared life path numbers', desc: 'Matching or harmonically compatible life path numbers signal a pre-destined soul contract.', emoji: '💫' },
  { sign: 'Mirrored wounds and gifts', desc: 'Soul twins share the same core wounds and spiritual gifts, reflecting each other perfectly.', emoji: '🪞' },
];

function calcSyncScore(sharedNums: string[], myLifePath: number, theirLifePath: number): number {
  let score = 50;
  score += sharedNums.length * 15;
  const diff = Math.abs(myLifePath - theirLifePath);
  if (diff === 0) score += 20;
  else if (diff <= 2) score += 10;
  else if (diff <= 4) score += 5;
  return Math.min(99, score);
}

function getTier(score: number): { label: string; color: string } {
  if (score >= 90) return { label: 'Twin Flame', color: '#f472b6' };
  if (score >= 75) return { label: 'Cosmic Partner', color: '#a78bfa' };
  if (score >= 60) return { label: 'Spirit Guide', color: '#60a5fa' };
  return { label: 'Soul Student', color: '#4ade80' };
}

function SoulTwinPageInner() {
  const [tab, setTab] = useState<'matches' | 'signs'>('matches');
  const [matches, setMatches] = useState<SoulMatch[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<string | null>(null);
  const [connectionSent, setConnectionSent] = useState<Set<string>>(new Set());
  const [myLifePath, setMyLifePath] = useState(7);
  const [myNumbers, setMyNumbers] = useState<string[]>([]);
  const [realCount, setRealCount] = useState(0);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());

  const loadMatches = useCallback(async () => {
    setLoading(true);
    try {
      // Load my profile
      const lp = parseInt(localStorage.getItem('synchrosoul_numerology') ? JSON.parse(localStorage.getItem('synchrosoul_numerology')!).lifePath || '7' : '7');
      setMyLifePath(lp);

      // Load my recent angel logs
      const myLogs: {number: string}[] = JSON.parse(localStorage.getItem('angel_logs') || '[]');
      const myNums = [...new Set(myLogs.slice(0, 20).map((l: {number: string}) => l.number))];
      setMyNumbers(myNums);

      // Try Supabase for real matches
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();

      if (user && myNums.length > 0) {
        // Get logs from other users in last 48h with same numbers
        const cutoff = new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString();
        const { data: recentLogs } = await supabase
          .from('angel_logs')
          .select('user_id, number, created_at')
          .in('number', myNums)
          .gte('created_at', cutoff)
          .neq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (recentLogs && recentLogs.length > 0) {
          // Group by user
          const userMap = new Map<string, { numbers: string[]; lastSeen: string }>();
          for (const log of recentLogs) {
            if (!userMap.has(log.user_id)) userMap.set(log.user_id, { numbers: [], lastSeen: log.created_at });
            const u = userMap.get(log.user_id)!;
            if (!u.numbers.includes(log.number)) u.numbers.push(log.number);
          }

          // Get profiles for matched users
          const userIds = [...userMap.keys()].slice(0, 10);
          const { data: profiles } = await supabase
            .from('profiles')
            .select('id, display_name, life_path, bio, avatar_url')
            .in('id', userIds);

          const realMatches: SoulMatch[] = (profiles || []).map(p => {
            const userLogs = userMap.get(p.id)!;
            const shared = userLogs.numbers.filter(n => myNums.includes(n));
            const score = calcSyncScore(shared, lp, p.life_path || 7);
            const minsAgo = Math.floor((Date.now() - new Date(userLogs.lastSeen).getTime()) / 60000);
            const timeLabel = minsAgo < 60 ? `${minsAgo}m ago` : `${Math.floor(minsAgo/60)}h ago`;
            return {
              id: p.id,
              name: p.display_name || 'Cosmic Soul',
              avatar: '✨',
              lifePathNumber: p.life_path || 7,
              syncScore: score,
              sharedNumbers: shared,
              lastActive: timeLabel,
              verified: shared.length,
              bio: p.bio || 'A soul on the cosmic journey.',
              isReal: true,
            };
          }).sort((a, b) => b.syncScore - a.syncScore);

          setRealCount(realMatches.length);
          // Merge real + mock, real first
          const mockFill = MOCK_TWINS.slice(0, Math.max(0, 4 - realMatches.length));
          setMatches([...realMatches, ...mockFill]);
          setLastRefresh(new Date());
          setLoading(false);
          return;
        }
      }
    } catch (e) {
      console.error('Soul twin load error:', e);
    }
    // Fallback to mock
    setMatches(MOCK_TWINS);
    setRealCount(0);
    setLastRefresh(new Date());
    setLoading(false);
  }, []);

  useEffect(() => {
    loadMatches();
    // Realtime: refresh when new angel_logs come in
    const supabase = createClient();
    const channel = supabase
      .channel('soul-twin-realtime')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'angel_logs' }, () => {
        loadMatches();
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, [loadMatches]);

  const sendConnection = (id: string) => {
    setConnectionSent(prev => new Set([...prev, id]));
  };

  return (
    <div style={{ maxWidth: '480px', margin: '0 auto', padding: '1.5rem 1rem 2rem' }}>

      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
        <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🧲</div>
        <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.8rem', fontWeight: 300, color: 'rgba(220,200,255,0.95)', marginBottom: '0.25rem' }}>Soul Twin Radar</h1>
        <p style={{ color: 'rgba(180,160,255,0.5)', fontSize: '0.8rem' }}>Souls seeing your numbers in the last 48 hours</p>
        {realCount > 0 && (
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: 'rgba(74,222,128,0.1)', border: '1px solid rgba(74,222,128,0.25)', borderRadius: '9999px', padding: '0.3rem 0.875rem', marginTop: '0.5rem' }}>
            <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#4ade80', animation: 'pulse 2s infinite' }} />
            <span style={{ fontSize: '0.72rem', color: 'rgba(134,239,172,0.9)' }}>{realCount} real soul{realCount !== 1 ? 's' : ''} synced live</span>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem', background: 'rgba(255,255,255,0.03)', borderRadius: '0.875rem', padding: '0.25rem' }}>
        {(['matches', 'signs'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)} style={{ flex: 1, padding: '0.6rem', borderRadius: '0.625rem', border: 'none', cursor: 'pointer', background: tab === t ? 'rgba(167,139,250,0.15)' : 'transparent', color: tab === t ? 'rgba(220,200,255,0.9)' : 'rgba(180,160,255,0.4)', fontSize: '0.8rem', textTransform: 'capitalize', fontWeight: tab === t ? 600 : 400 }}>
            {t === 'matches' ? '✨ Matches' : '💫 Soul Signs'}
          </button>
        ))}
      </div>

      {tab === 'matches' && (
        <>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'rgba(180,160,255,0.4)' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>✨</div>
              <p style={{ fontSize: '0.85rem' }}>Scanning the cosmic field...</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {matches.map(match => {
                const tier = getTier(match.syncScore);
                const isOpen = selected === match.id;
                const sent = connectionSent.has(match.id);
                return (
                  <div key={match.id} style={{ background: 'rgba(8,6,28,0.88)', border: `1px solid ${isOpen ? tier.color + '40' : 'rgba(200,180,255,0.1)'}`, borderRadius: '1.25rem', overflow: 'hidden', transition: 'all 0.2s' }}>
                    <div onClick={() => setSelected(isOpen ? null : match.id)} style={{ padding: '1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
                      {/* Avatar */}
                      <div style={{ width: '3rem', height: '3rem', borderRadius: '50%', background: `${tier.color}18`, border: `1px solid ${tier.color}40`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', flexShrink: 0, position: 'relative' }}>
                        {match.avatar}
                        {match.isReal && <div style={{ position: 'absolute', bottom: 0, right: 0, width: '10px', height: '10px', borderRadius: '50%', background: '#4ade80', border: '2px solid rgba(8,6,28,0.9)' }} />}
                      </div>
                      {/* Info */}
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                          <span style={{ color: 'rgba(220,200,255,0.9)', fontSize: '0.95rem', fontWeight: 500 }}>{match.name}</span>
                          <span style={{ fontSize: '0.65rem', color: tier.color, background: tier.color + '15', border: `1px solid ${tier.color}30`, borderRadius: '9999px', padding: '0.1rem 0.5rem' }}>{tier.label}</span>
                        </div>
                        <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap' }}>
                          {match.sharedNumbers.map(n => (
                            <span key={n} style={{ fontSize: '0.65rem', background: 'rgba(167,139,250,0.1)', border: '1px solid rgba(167,139,250,0.2)', borderRadius: '0.375rem', padding: '0.1rem 0.4rem', color: 'rgba(200,180,255,0.7)' }}>{n}</span>
                          ))}
                        </div>
                      </div>
                      {/* Score */}
                      <div style={{ textAlign: 'center', flexShrink: 0 }}>
                        <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.5rem', color: tier.color, lineHeight: 1 }}>{match.syncScore}%</div>
                        <div style={{ fontSize: '0.55rem', color: 'rgba(180,160,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>sync</div>
                      </div>
                    </div>
                    {isOpen && (
                      <div style={{ padding: '0 1rem 1rem', borderTop: '1px solid rgba(200,180,255,0.06)' }}>
                        <p style={{ color: 'rgba(180,160,255,0.65)', fontSize: '0.85rem', lineHeight: 1.6, margin: '0.75rem 0' }}>{match.bio}</p>
                        <div style={{ display: 'flex', gap: '0.5rem', fontSize: '0.75rem', color: 'rgba(180,160,255,0.4)', marginBottom: '0.875rem' }}>
                          <span>Life Path {match.lifePathNumber}</span>
                          <span>•</span>
                          <span>Active {match.lastActive}</span>
                          {match.isReal && <><span>•</span><span style={{ color: 'rgba(74,222,128,0.7)' }}>✓ Real user</span></>}
                        </div>
                        <button
                          onClick={() => sendConnection(match.id)}
                          style={{ width: '100%', background: sent ? 'rgba(74,222,128,0.1)' : `linear-gradient(135deg, ${tier.color}cc, ${tier.color})`, border: sent ? '1px solid rgba(74,222,128,0.3)' : 'none', borderRadius: '0.75rem', color: sent ? 'rgba(134,239,172,0.9)' : 'white', fontSize: '0.85rem', fontWeight: 500, padding: '0.75rem', cursor: sent ? 'default' : 'pointer' }}
                        >
                          {sent ? '✓ Sync Signal Sent' : 'Send Sync Signal ✨'}
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
          <button onClick={loadMatches} style={{ width: '100%', marginTop: '1rem', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(200,180,255,0.1)', borderRadius: '0.875rem', color: 'rgba(180,160,255,0.5)', fontSize: '0.75rem', padding: '0.75rem', cursor: 'pointer' }}>
            ↻ Refresh Radar
          </button>
        </>
      )}

      {tab === 'signs' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {SOUL_SIGNS.map(({ sign, desc, emoji }) => (
            <div key={sign} style={{ background: 'rgba(8,6,28,0.85)', border: '1px solid rgba(167,139,250,0.12)', borderRadius: '1rem', padding: '1rem 1.25rem', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
              <span style={{ fontSize: '1.75rem', flexShrink: 0 }}>{emoji}</span>
              <div>
                <div style={{ color: 'rgba(220,200,255,0.85)', fontSize: '0.9rem', fontWeight: 500, marginBottom: '0.3rem' }}>{sign}</div>
                <div style={{ color: 'rgba(180,160,255,0.55)', fontSize: '0.8rem', lineHeight: 1.6 }}>{desc}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}


export default function SoulTwinPage() {
  return (
    <FeatureGate feature="soul-twin-radar" requiredTier="mystic">
      <SoulTwinPageInner />
    </FeatureGate>
  )
}
