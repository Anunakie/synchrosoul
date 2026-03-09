'use client';
import { useState, useEffect } from 'react';

interface AngelLog { id: string; number: string; createdAt: string; }
interface NumerologyProfile { lifePathNumber?: number; soulUrgeNumber?: number; destinyNumber?: number; }

const MOCK_TWINS = [
  { id: '1', name: 'Luna S.', avatar: '🌙', location: 'Sedona, AZ', numbers: ['1111', '444', '777'], lifePathNumber: 7, syncScore: 94, bio: 'Spiritual seeker, crystal healer, and lover of sacred geometry.', sharedNumbers: ['1111', '777'], lastActive: '2 min ago', verified: 3 },
  { id: '2', name: 'Orion M.', avatar: '⭐', location: 'Glastonbury, UK', numbers: ['333', '1111', '999'], lifePathNumber: 11, syncScore: 87, bio: 'Astrologer and meditation teacher walking the path of light.', sharedNumbers: ['1111', '333'], lastActive: '15 min ago', verified: 5 },
  { id: '3', name: 'Sage R.', avatar: '🌿', location: 'Bali, Indonesia', numbers: ['555', '1212', '888'], lifePathNumber: 5, syncScore: 81, bio: 'Digital nomad, sound healer, and angel number enthusiast.', sharedNumbers: ['555'], lastActive: '1 hr ago', verified: 2 },
  { id: '4', name: 'Celeste V.', avatar: '✨', location: 'Tulum, Mexico', numbers: ['222', '444', '1111'], lifePathNumber: 2, syncScore: 76, bio: 'Yoga teacher and Akashic Records reader. Love and light always.', sharedNumbers: ['444', '1111'], lastActive: '3 hr ago', verified: 4 },
  { id: '5', name: 'Phoenix A.', avatar: '🔥', location: 'Maui, HI', numbers: ['999', '111', '777'], lifePathNumber: 9, syncScore: 72, bio: 'Transformational coach helping souls rise from the ashes.', sharedNumbers: ['777'], lastActive: '5 hr ago', verified: 1 },
];

const COMPATIBILITY: Record<string, Record<number, string>> = {
  '7': { 1: 'Inspiring', 2: 'Harmonious', 3: 'Creative', 4: 'Grounding', 5: 'Adventurous', 6: 'Nurturing', 7: 'Twin Flame', 8: 'Powerful', 9: 'Transcendent', 11: 'Mystical', 22: 'Visionary', 33: 'Sacred' },
};

const SOUL_SIGNS = [
  { sign: 'You keep seeing the same numbers', desc: 'When two souls are meant to connect, the universe sends identical number sequences to both.', emoji: '🔢' },
  { sign: 'You feel an unexplained pull', desc: 'A magnetic, inexplicable attraction that defies logic — your soul recognizes theirs.', emoji: '🧲' },
  { sign: 'Dreams and synchronicities', desc: 'You may dream of them before meeting, or experience uncanny coincidences.', emoji: '🌙' },
  { sign: 'Instant deep recognition', desc: 'Upon meeting, you feel you have known them forever — because you have, across lifetimes.', emoji: '👁️' },
  { sign: 'Shared life path numbers', desc: 'Matching or harmonically compatible life path numbers signal a pre-destined soul contract.', emoji: '🔢' },
  { sign: 'Mirrored wounds and gifts', desc: 'Soul twins often share the same core wounds and spiritual gifts, reflecting each other perfectly.', emoji: '🪞' },
];

export default function SoulTwinPage() {
  const [tab, setTab] = useState<'matches' | 'signs' | 'reading'>('matches');
  const [selected, setSelected] = useState<string | null>(null);
  const [logs, setLogs] = useState<AngelLog[]>([]);
  const [profile, setProfile] = useState<NumerologyProfile>({});
  const [connectionSent, setConnectionSent] = useState<Set<string>>(new Set());

  useEffect(() => {
    try {
      setLogs(JSON.parse(localStorage.getItem('angel_logs') || '[]'));
      const p = JSON.parse(localStorage.getItem('synchrosoul_numerology') || '{}');
      setProfile(p);
    } catch {}
  }, []);

  const myNumbers = [...new Set(logs.map(l => l.number))].slice(0, 5);
  const selectedTwin = MOCK_TWINS.find(t => t.id === selected);

  const sendConnection = (id: string) => {
    setConnectionSent(prev => new Set([...prev, id]));
  };

  return (
    <div style={{ minHeight: '100vh', padding: '2rem 1rem', maxWidth: '700px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 700, color: '#ec4899', fontFamily: 'Cormorant Garamond, serif' }}>Soul Twin Finder</h1>
        <p style={{ color: 'rgba(255,255,255,0.4)', marginTop: '0.25rem' }}>Discover souls vibrating at your frequency</p>
      </div>

      {/* My numbers */}
      {myNumbers.length > 0 && (
        <div style={{ background: 'rgba(236,72,153,0.08)', borderRadius: '1.25rem', border: '1px solid rgba(236,72,153,0.15)', padding: '1rem 1.25rem', marginBottom: '1.25rem', backdropFilter: 'blur(12px)' }}>
          <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.6rem' }}>Your Signature Numbers</p>
          <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
            {myNumbers.map(n => (
              <span key={n} style={{ background: 'rgba(236,72,153,0.15)', border: '1px solid rgba(236,72,153,0.25)', borderRadius: '999px', padding: '0.2rem 0.7rem', fontSize: '0.82rem', color: '#ec4899', fontWeight: 700 }}>{n}</span>
            ))}
          </div>
        </div>
      )}

      {/* Tab nav */}
      <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '1.5rem', background: 'rgba(255,255,255,0.03)', borderRadius: '999px', padding: '0.25rem' }}>
        {(['matches', 'signs', 'reading'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)} style={{
            flex: 1, padding: '0.5rem', borderRadius: '999px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600,
            background: tab === t ? 'rgba(236,72,153,0.2)' : 'transparent',
            border: tab === t ? '1px solid rgba(236,72,153,0.3)' : '1px solid transparent',
            color: tab === t ? '#ec4899' : 'rgba(255,255,255,0.4)',
            textTransform: 'capitalize'
          }}>{t === 'matches' ? 'Soul Matches' : t === 'signs' ? 'Recognition Signs' : 'Soul Reading'}</button>
        ))}
      </div>

      {tab === 'matches' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {MOCK_TWINS.map(twin => (
            <div key={twin.id}>
              <div onClick={() => setSelected(selected === twin.id ? null : twin.id)} style={{
                background: selected === twin.id ? 'rgba(236,72,153,0.08)' : 'rgba(8,6,28,0.88)',
                borderRadius: '1.5rem', border: selected === twin.id ? '1px solid rgba(236,72,153,0.2)' : '1px solid rgba(255,255,255,0.07)',
                padding: '1.25rem', cursor: 'pointer', backdropFilter: 'blur(12px)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                  <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: 'rgba(236,72,153,0.15)', border: '2px solid rgba(236,72,153,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', flexShrink: 0 }}>{twin.avatar}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                      <p style={{ color: '#fff', fontWeight: 700, fontSize: '0.95rem' }}>{twin.name}</p>
                      <span style={{ color: 'rgba(255,255,255,0.25)', fontSize: '0.7rem' }}>{'✅'.repeat(Math.min(twin.verified, 3))}</span>
                    </div>
                    <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.72rem' }}>📍 {twin.location} · {twin.lastActive}</p>
                    <div style={{ display: 'flex', gap: '0.3rem', marginTop: '0.4rem', flexWrap: 'wrap' }}>
                      {twin.sharedNumbers.map(n => (
                        <span key={n} style={{ background: 'rgba(236,72,153,0.12)', border: '1px solid rgba(236,72,153,0.2)', borderRadius: '999px', padding: '0.1rem 0.5rem', fontSize: '0.68rem', color: '#ec4899' }}>✦ {n}</span>
                      ))}
                    </div>
                  </div>
                  <div style={{ textAlign: 'center', flexShrink: 0 }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: `conic-gradient(#ec4899 ${twin.syncScore * 3.6}deg, rgba(255,255,255,0.05) 0deg)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                      <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#050510', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <span style={{ color: '#ec4899', fontSize: '0.7rem', fontWeight: 800 }}>{twin.syncScore}%</span>
                      </div>
                    </div>
                    <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: '0.6rem', marginTop: '0.2rem' }}>sync</p>
                  </div>
                </div>

                {selected === twin.id && (
                  <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                    <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem', lineHeight: 1.6, marginBottom: '0.875rem', fontStyle: 'italic' }}>&ldquo;{twin.bio}&rdquo;</p>
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.875rem' }}>
                      {twin.numbers.map(n => (
                        <span key={n} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '999px', padding: '0.2rem 0.6rem', fontSize: '0.72rem', color: 'rgba(255,255,255,0.5)' }}>{n}</span>
                      ))}
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button
                        onClick={e => { e.stopPropagation(); sendConnection(twin.id); }}
                        disabled={connectionSent.has(twin.id)}
                        style={{ flex: 1, padding: '0.6rem', borderRadius: '999px', cursor: connectionSent.has(twin.id) ? 'default' : 'pointer', fontSize: '0.82rem', fontWeight: 700, background: connectionSent.has(twin.id) ? 'rgba(255,255,255,0.05)' : 'rgba(236,72,153,0.2)', border: connectionSent.has(twin.id) ? '1px solid rgba(255,255,255,0.1)' : '1px solid rgba(236,72,153,0.3)', color: connectionSent.has(twin.id) ? 'rgba(255,255,255,0.3)' : '#ec4899' }}
                      >{connectionSent.has(twin.id) ? '✓ Request Sent' : '💞 Connect'}</button>
                      <button onClick={e => e.stopPropagation()} style={{ padding: '0.6rem 1rem', borderRadius: '999px', cursor: 'pointer', fontSize: '0.82rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.5)' }}>👁 View</button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'signs' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div style={{ background: 'rgba(236,72,153,0.08)', borderRadius: '1.5rem', border: '1px solid rgba(236,72,153,0.15)', padding: '1.25rem', backdropFilter: 'blur(12px)', marginBottom: '0.5rem' }}>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem', lineHeight: 1.7, fontStyle: 'italic', fontFamily: 'Cormorant Garamond, serif' }}>
              &ldquo;A soul twin is not someone who completes you — they are someone who helps you complete yourself. The universe uses angel numbers as cosmic breadcrumbs leading you to each other.&rdquo;
            </p>
          </div>
          {SOUL_SIGNS.map((s, i) => (
            <div key={i} style={{ background: 'rgba(8,6,28,0.88)', borderRadius: '1.25rem', border: '1px solid rgba(255,255,255,0.07)', padding: '1.25rem', backdropFilter: 'blur(12px)', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
              <span style={{ fontSize: '1.5rem', flexShrink: 0 }}>{s.emoji}</span>
              <div>
                <p style={{ color: '#fff', fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.35rem' }}>{s.sign}</p>
                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.83rem', lineHeight: 1.6 }}>{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'reading' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <div style={{ background: 'linear-gradient(135deg, rgba(236,72,153,0.12), rgba(8,6,28,0.95))', borderRadius: '1.5rem', border: '1px solid rgba(236,72,153,0.2)', padding: '1.5rem', backdropFilter: 'blur(12px)' }}>
            <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '0.75rem' }}>Your Soul Twin Reading</p>
            {profile.lifePathNumber ? (
              <>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                  <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'rgba(236,72,153,0.15)', border: '2px solid rgba(236,72,153,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', fontWeight: 800, color: '#ec4899', fontFamily: 'Cormorant Garamond, serif' }}>{profile.lifePathNumber}</div>
                  <div>
                    <p style={{ color: '#fff', fontWeight: 700 }}>Life Path {profile.lifePathNumber}</p>
                    <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.78rem' }}>Your soul twin vibration</p>
                  </div>
                </div>
                <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.88rem', lineHeight: 1.7 }}>
                  Your Life Path {profile.lifePathNumber} soul is seeking a twin who mirrors your deepest spiritual lessons. The angel numbers you log are cosmic signals — each sighting narrows the distance between you and your destined soul connection. Keep logging. The universe is arranging the meeting.
                </p>
              </>
            ) : (
              <div style={{ textAlign: 'center', padding: '1.5rem' }}>
                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.88rem', marginBottom: '1rem' }}>Complete your numerology profile to unlock your soul twin reading</p>
                <a href="/auth/signup" style={{ display: 'inline-block', background: 'rgba(236,72,153,0.2)', border: '1px solid rgba(236,72,153,0.3)', borderRadius: '999px', padding: '0.6rem 1.5rem', color: '#ec4899', fontSize: '0.85rem', fontWeight: 700, textDecoration: 'none' }}>Complete Profile →</a>
              </div>
            )}
          </div>

          <div style={{ background: 'rgba(8,6,28,0.88)', borderRadius: '1.5rem', border: '1px solid rgba(255,255,255,0.07)', padding: '1.25rem', backdropFilter: 'blur(12px)' }}>
            <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '0.875rem' }}>Soul Twin Number Pairs</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {[['1111 + 1111', 'Mirror souls — identical frequency, instant recognition'],['111 + 999', 'Beginning meets completion — perfect karmic balance'],['222 + 444', 'Trust meets protection — divine partnership energy'],['333 + 777', 'Creativity meets wisdom — ascended master connection'],['555 + 1212', 'Change meets alignment — transformational twin bond']].map(([pair, desc]) => (
                <div key={pair} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.875rem', padding: '0.6rem 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                  <span style={{ color: '#ec4899', fontWeight: 800, fontSize: '0.82rem', minWidth: '90px', fontFamily: 'Cormorant Garamond, serif' }}>{pair}</span>
                  <span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem', lineHeight: 1.5 }}>{desc}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}