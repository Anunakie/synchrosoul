'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

interface AngelLog {
  id: string;
  number: string;
  thought?: string;
  createdAt: string;
  verified?: boolean;
}

interface DreamEntry {
  id: string;
  title: string;
  content: string;
  numbers: string[];
  createdAt: string;
}

const ALL_PAGES = [
  { href: '/dashboard', label: 'Home', emoji: '✦', desc: 'Dashboard overview and daily guidance' },
  { href: '/dashboard/journal', label: 'Journal', emoji: '📖', desc: 'Log angel numbers and thoughts' },
  { href: '/dashboard/timeline', label: 'Timeline', emoji: '⏳', desc: 'Chronological view of all sightings' },
  { href: '/dashboard/calendar', label: 'Calendar', emoji: '🗓️', desc: 'Monthly calendar of angel number sightings' },
  { href: '/dashboard/dreams', label: 'Dreams', emoji: '🌙', desc: 'Dream journal with angel number tracking' },
  { href: '/dashboard/insights', label: 'Insights', emoji: '📊', desc: 'AI pattern analysis of your numbers' },
  { href: '/dashboard/stats', label: 'Statistics', emoji: '📈', desc: 'Detailed statistics and charts' },
  { href: '/dashboard/streak', label: 'Streak', emoji: '🔥', desc: 'Daily logging streak and milestones' },
  { href: '/dashboard/numerology-deep', label: 'Deep Numerology', emoji: '🧮', desc: 'Advanced numerology calculations' },
  { href: '/dashboard/compatibility', label: 'Compatibility', emoji: '💞', desc: 'Numerology compatibility calculator' },
  { href: '/dashboard/personal-year', label: 'Personal Year', emoji: '📅', desc: 'Your personal year number and forecast' },
  { href: '/dashboard/karmic-debt', label: 'Karmic Debt', emoji: '⚖️', desc: 'Karmic debt numbers and lessons' },
  { href: '/dashboard/oracle', label: 'Oracle', emoji: '✦', desc: 'Angel number oracle card readings' },
  { href: '/dashboard/tarot', label: 'Tarot', emoji: '🃏', desc: 'Angel-aligned tarot card readings' },
  { href: '/dashboard/dictionary', label: 'Dictionary', emoji: '📚', desc: 'Complete angel number meanings' },
  { href: '/dashboard/moon', label: 'Moon Phases', emoji: '🌙', desc: 'Lunar phases and angel number rituals' },
  { href: '/dashboard/cosmic-weather', label: 'Cosmic Weather', emoji: '🌌', desc: 'Planetary energies and forecasts' },
  { href: '/dashboard/meditations', label: 'Meditations', emoji: '🧘', desc: 'Guided angel number meditations' },
  { href: '/dashboard/breathwork', label: 'Breathwork', emoji: '💨', desc: 'Sacred breathing techniques' },
  { href: '/dashboard/solfeggio', label: 'Solfeggio', emoji: '🎵', desc: 'Healing frequencies aligned with angel numbers' },
  { href: '/dashboard/chakras', label: 'Chakras', emoji: '🌈', desc: 'Chakra system and angel number alignment' },
  { href: '/dashboard/crystals', label: 'Crystals', emoji: '💎', desc: 'Crystal healing guide' },
  { href: '/dashboard/affirmations', label: 'Affirmations', emoji: '💫', desc: 'Daily affirmations by category' },
  { href: '/dashboard/rituals', label: 'Rituals', emoji: '🕯️', desc: 'Sacred rituals for angel numbers' },
  { href: '/dashboard/healing-hub', label: 'Healing Hub', emoji: '🌿', desc: 'Complete healing resource center' },
  { href: '/dashboard/gratitude', label: 'Gratitude', emoji: '🙏', desc: 'Daily gratitude practice' },
  { href: '/dashboard/manifestations', label: 'Manifestations', emoji: '🌱', desc: 'Track your manifestations' },
  { href: '/dashboard/vision-board', label: 'Vision Board', emoji: '🖼️', desc: 'Sacred intentions vision board' },
  { href: '/dashboard/synthesis', label: 'Synthesis', emoji: '✺', desc: 'Weekly cosmic synthesis report' },
  { href: '/dashboard/badges', label: 'Badges', emoji: '🏅', desc: 'Spiritual achievement badges' },
  { href: '/dashboard/sync', label: 'Live Sync', emoji: '⟳', desc: 'Match with souls seeing the same numbers' },
  { href: '/dashboard/soul-twin', label: 'Soul Twin', emoji: '👥', desc: 'Find your soul twin connection' },
  { href: '/dashboard/circles', label: 'Circles', emoji: '⭕', desc: 'Angel number community circles' },
  { href: '/dashboard/relationships', label: 'Soul Connections', emoji: '💞', desc: 'Map your sacred soul connections' },
  { href: '/dashboard/feed', label: 'Feed', emoji: '✧', desc: 'Social feed from matched souls' },
  { href: '/dashboard/profile', label: 'Profile', emoji: '◎', desc: 'Your spiritual profile' },
  { href: '/dashboard/profile-card', label: 'Profile Card', emoji: '🪪', desc: 'Shareable numerology profile card' },
  { href: '/dashboard/settings', label: 'Settings', emoji: '⚙️', desc: 'App settings and preferences' },
  { href: '/dashboard/upgrade', label: 'Upgrade', emoji: '⭐', desc: 'Premium features and plans' },
];

const ANGEL_COLORS: Record<string, string> = {
  '111': '#f59e0b', '1111': '#f59e0b', '222': '#22c55e', '333': '#f97316',
  '444': '#22c55e', '555': '#8b5cf6', '777': '#c9a84c', '888': '#c9a84c',
  '999': '#6366f1', '1212': '#60a5fa',
};

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [logs, setLogs] = useState<AngelLog[]>([]);
  const [dreams, setDreams] = useState<DreamEntry[]>([]);

  useEffect(() => {
    try {
      setLogs(JSON.parse(localStorage.getItem('angel_logs') || '[]'));
      setDreams(JSON.parse(localStorage.getItem('synchrosoul_dreams') || '[]'));
    } catch {}
  }, []);

  const q = query.toLowerCase().trim();

  const matchedPages = q ? ALL_PAGES.filter(p =>
    p.label.toLowerCase().includes(q) || p.desc.toLowerCase().includes(q)
  ) : [];

  const matchedLogs = q ? logs.filter(l =>
    l.number.includes(q) || (l.thought || '').toLowerCase().includes(q)
  ).slice(0, 5) : [];

  const matchedDreams = q ? dreams.filter(d =>
    d.title.toLowerCase().includes(q) || d.content.toLowerCase().includes(q) ||
    d.numbers.some(n => n.includes(q))
  ).slice(0, 3) : [];

  const hasResults = matchedPages.length > 0 || matchedLogs.length > 0 || matchedDreams.length > 0;

  return (
    <div style={{ minHeight: '100vh', padding: '2rem 1rem', maxWidth: '700px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 700, color: '#a78bfa', fontFamily: 'Cormorant Garamond, serif' }}>Search</h1>
        <p style={{ color: 'rgba(255,255,255,0.4)', marginTop: '0.25rem' }}>Find anything in your cosmic journey</p>
      </div>

      <div style={{ position: 'relative', marginBottom: '1.5rem' }}>
        <span style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.3)', fontSize: '1rem' }}>🔍</span>
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search pages, numbers, journal entries..."
          autoFocus
          style={{ width: '100%', boxSizing: 'border-box', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '999px', padding: '0.875rem 1.25rem 0.875rem 2.75rem', color: '#fff', fontSize: '1rem', outline: 'none' }}
        />
      </div>

      {!q && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.5rem' }}>
          {ALL_PAGES.slice(0, 8).map(p => (
            <Link key={p.href} href={p.href} style={{ textDecoration: 'none' }}>
              <div style={{ background: 'rgba(8,6,28,0.88)', borderRadius: '1rem', border: '1px solid rgba(255,255,255,0.07)', padding: '0.875rem', backdropFilter: 'blur(12px)', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                <span style={{ fontSize: '1.2rem' }}>{p.emoji}</span>
                <span style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', fontWeight: 600 }}>{p.label}</span>
              </div>
            </Link>
          ))}
        </div>
      )}

      {q && !hasResults && (
        <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'rgba(255,255,255,0.3)' }}>
          <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>🔍</div>
          <p>No results for &ldquo;{query}&rdquo;</p>
        </div>
      )}

      {matchedPages.length > 0 && (
        <div style={{ marginBottom: '1.5rem' }}>
          <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.75rem' }}>Pages</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            {matchedPages.map(p => (
              <Link key={p.href} href={p.href} style={{ textDecoration: 'none' }}>
                <div style={{ background: 'rgba(8,6,28,0.88)', borderRadius: '1rem', border: '1px solid rgba(255,255,255,0.07)', padding: '0.875rem 1rem', backdropFilter: 'blur(12px)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <span style={{ fontSize: '1.2rem' }}>{p.emoji}</span>
                  <div>
                    <p style={{ color: '#fff', fontWeight: 600, fontSize: '0.9rem' }}>{p.label}</p>
                    <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.75rem' }}>{p.desc}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {matchedLogs.length > 0 && (
        <div style={{ marginBottom: '1.5rem' }}>
          <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.75rem' }}>Journal Entries</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            {matchedLogs.map(l => {
              const color = ANGEL_COLORS[l.number] || '#a78bfa';
              return (
                <Link key={l.id} href="/dashboard/journal" style={{ textDecoration: 'none' }}>
                  <div style={{ background: 'rgba(8,6,28,0.88)', borderRadius: '1rem', border: '1px solid rgba(255,255,255,0.07)', padding: '0.875rem 1rem', backdropFilter: 'blur(12px)', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span style={{ color, fontWeight: 800, fontFamily: 'Cormorant Garamond, serif', fontSize: '1rem', minWidth: '40px' }}>{l.number}</span>
                    <div style={{ flex: 1 }}>
                      <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.82rem' }}>{l.thought || 'No thought recorded'}</p>
                      <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: '0.7rem', marginTop: '0.15rem' }}>{new Date(l.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {matchedDreams.length > 0 && (
        <div>
          <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.75rem' }}>Dream Journal</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            {matchedDreams.map(d => (
              <Link key={d.id} href="/dashboard/dreams" style={{ textDecoration: 'none' }}>
                <div style={{ background: 'rgba(8,6,28,0.88)', borderRadius: '1rem', border: '1px solid rgba(255,255,255,0.07)', padding: '0.875rem 1rem', backdropFilter: 'blur(12px)' }}>
                  <p style={{ color: '#fff', fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.2rem' }}>{d.title}</p>
                  <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.78rem' }}>{d.content.slice(0, 80)}...</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}