'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

interface SearchResult {
  type: string;
  title: string;
  subtitle: string;
  href: string;
  emoji: string;
  color: string;
  match: string;
}

const STATIC_PAGES = [
  { title: 'Angel Number Logger', subtitle: 'Log angel numbers you see', href: '/dashboard', emoji: '✦', color: '#c9a84c', tags: ['log', 'number', 'angel', 'logger'] },
  { title: 'Thought Anchor Journal', subtitle: 'Your private angel number journal', href: '/dashboard/journal', emoji: '📖', color: '#a78bfa', tags: ['journal', 'thoughts', 'write', 'diary'] },
  { title: 'Dream Journal', subtitle: 'Record and decode your dreams', href: '/dashboard/dreams', emoji: '🌙', color: '#60a5fa', tags: ['dreams', 'sleep', 'visions', 'decode'] },
  { title: 'Angel Oracle', subtitle: 'Ask your guides a question', href: '/dashboard/oracle', emoji: '◈', color: '#c9a84c', tags: ['oracle', 'guidance', 'ask', 'reading', 'guides'] },
  { title: 'Cosmic Tarot', subtitle: 'Major Arcana readings', href: '/dashboard/tarot', emoji: '🃏', color: '#f472b6', tags: ['tarot', 'cards', 'reading', 'arcana'] },
  { title: 'Deep Numerology', subtitle: 'Your complete soul blueprint', href: '/dashboard/numerology-deep', emoji: '🧮', color: '#a78bfa', tags: ['numerology', 'life path', 'soul urge', 'destiny', 'numbers'] },
  { title: 'Compatibility', subtitle: 'Numerology match score', href: '/dashboard/compatibility', emoji: '💞', color: '#f472b6', tags: ['compatibility', 'match', 'partner', 'relationship'] },
  { title: 'Soul Connections', subtitle: 'Track your soul bonds', href: '/dashboard/relationships', emoji: '💞', color: '#f472b6', tags: ['relationships', 'connections', 'soul', 'bonds', 'partner'] },
  { title: 'Live Sync Matching', subtitle: 'Find souls on your frequency', href: '/dashboard/sync', emoji: '⟳', color: '#60a5fa', tags: ['sync', 'match', 'connect', 'frequency', 'live'] },
  { title: 'Soul Twin Radar', subtitle: 'Find your number matches', href: '/dashboard/soul-twin', emoji: '🧬', color: '#f472b6', tags: ['soul twin', 'twin flame', 'match', 'radar'] },
  { title: 'Cosmic Weather', subtitle: 'Daily energetic forecast', href: '/dashboard/cosmic-weather', emoji: '🌌', color: '#60a5fa', tags: ['weather', 'forecast', 'energy', 'daily', 'moon'] },
  { title: 'Moon Phases', subtitle: 'Lunar calendar and rituals', href: '/dashboard/moon', emoji: '🌙', color: '#94a3b8', tags: ['moon', 'lunar', 'phases', 'calendar'] },
  { title: 'Cosmic Calendar', subtitle: 'Numerology calendar view', href: '/dashboard/calendar', emoji: '🗓️', color: '#60a5fa', tags: ['calendar', 'dates', 'numerology', 'schedule'] },
  { title: 'Chakra Alignment', subtitle: 'Balance your energy centers', href: '/dashboard/chakras', emoji: '🌈', color: '#f97316', tags: ['chakra', 'energy', 'balance', 'healing'] },
  { title: 'Crystal Guide', subtitle: 'Crystals for your frequency', href: '/dashboard/crystals', emoji: '💎', color: '#818cf8', tags: ['crystals', 'gems', 'healing', 'stones'] },
  { title: 'Solfeggio Frequencies', subtitle: '396Hz to 963Hz healing tones', href: '/dashboard/solfeggio', emoji: '🎵', color: '#c9a84c', tags: ['solfeggio', 'frequency', 'sound', 'healing', 'hz'] },
  { title: 'Sacred Breathwork', subtitle: 'Breathing exercises for the soul', href: '/dashboard/breathwork', emoji: '💨', color: '#67e8f9', tags: ['breathwork', 'breathing', 'meditation', 'calm'] },
  { title: 'Guided Meditations', subtitle: 'Angel number activations', href: '/dashboard/meditations', emoji: '🧘', color: '#a78bfa', tags: ['meditation', 'guided', 'mindfulness', 'calm'] },
  { title: 'Sacred Rituals', subtitle: 'Moon and number ceremonies', href: '/dashboard/rituals', emoji: '🕯️', color: '#c9a84c', tags: ['rituals', 'ceremony', 'practice', 'sacred'] },
  { title: 'Affirmations', subtitle: 'Numerology-aligned affirmations', href: '/dashboard/affirmations', emoji: '💫', color: '#60a5fa', tags: ['affirmations', 'positive', 'mindset', 'daily'] },
  { title: 'Gratitude Practice', subtitle: 'Daily gratitude journal', href: '/dashboard/gratitude', emoji: '🙏', color: '#4ade80', tags: ['gratitude', 'thankful', 'journal', 'daily'] },
  { title: 'Vision Board', subtitle: 'Your cosmic dream board', href: '/dashboard/vision-board', emoji: '🖼️', color: '#818cf8', tags: ['vision board', 'dreams', 'goals', 'manifest'] },
  { title: 'Manifestations', subtitle: 'Track what you are calling in', href: '/dashboard/manifestations', emoji: '🌱', color: '#4ade80', tags: ['manifestations', 'goals', 'law of attraction', 'calling in'] },
  { title: 'Karmic Debt', subtitle: 'Understand your soul lessons', href: '/dashboard/karmic-debt', emoji: '⚖️', color: '#f97316', tags: ['karmic', 'karma', 'debt', 'lessons', 'soul'] },
  { title: 'Personal Year', subtitle: 'Your 9-year cycle forecast', href: '/dashboard/personal-year', emoji: '📅', color: '#34d399', tags: ['personal year', 'cycle', 'forecast', 'numerology'] },
  { title: 'Cosmic Soul Report', subtitle: 'Your complete numerology blueprint', href: '/dashboard/cosmic-report', emoji: '📜', color: '#c9a84c', tags: ['report', 'blueprint', 'numerology', 'soul', 'complete'] },
  { title: 'Healing Hub', subtitle: 'All healing tools in one place', href: '/dashboard/healing-hub', emoji: '🌿', color: '#4ade80', tags: ['healing', 'hub', 'tools', 'wellness'] },
  { title: 'Insights & Analytics', subtitle: 'Your number pattern analysis', href: '/dashboard/insights', emoji: '📊', color: '#60a5fa', tags: ['insights', 'analytics', 'patterns', 'stats'] },
  { title: 'Streak Tracker', subtitle: 'Your logging streak', href: '/dashboard/streak', emoji: '🔥', color: '#f97316', tags: ['streak', 'consistency', 'daily', 'tracker'] },
  { title: 'Badges & Achievements', subtitle: 'Your spiritual milestones', href: '/dashboard/badges', emoji: '🏅', color: '#c9a84c', tags: ['badges', 'achievements', 'milestones', 'rewards'] },
  { title: 'Angel Circles', subtitle: 'Community groups', href: '/dashboard/circles', emoji: '⭕', color: '#f97316', tags: ['circles', 'community', 'groups', 'social'] },
  { title: 'Cosmic Feed', subtitle: 'Posts from matched souls', href: '/dashboard/feed', emoji: '✧', color: '#a78bfa', tags: ['feed', 'social', 'posts', 'community'] },
  { title: 'Profile Card', subtitle: 'Your shareable cosmic card', href: '/dashboard/profile-card', emoji: '🪪', color: '#60a5fa', tags: ['profile card', 'share', 'card', 'cosmic'] },
  { title: 'Upgrade to Premium', subtitle: 'Unlock all cosmic features', href: '/dashboard/upgrade', emoji: '⭐', color: '#c9a84c', tags: ['upgrade', 'premium', 'unlock', 'features'] },
  { title: 'Settings', subtitle: 'App preferences and account', href: '/dashboard/settings', emoji: '⚙️', color: '#818cf8', tags: ['settings', 'preferences', 'account', 'profile'] },
  { title: 'Number Dictionary', subtitle: '000-9999 angel sequences decoded', href: '/dashboard/dictionary', emoji: '📚', color: '#a78bfa', tags: ['dictionary', 'meanings', 'numbers', 'decode', 'reference'] },
  { title: 'Weekly Synthesis', subtitle: 'Your weekly pattern report', href: '/dashboard/synthesis', emoji: '✺', color: '#c9a84c', tags: ['synthesis', 'weekly', 'report', 'patterns'] },
];

export default function SearchPage() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [journalResults, setJournalResults] = useState<any[]>([]);
  const [dreamResults, setDreamResults] = useState<any[]>([]);
  const [logResults, setLogResults] = useState<any[]>([]);

  useEffect(() => {
    if (!query.trim()) {
      setResults([]); setJournalResults([]); setDreamResults([]); setLogResults([]);
      return;
    }
    const q = query.toLowerCase();

    // Search static pages
    const pageResults: SearchResult[] = STATIC_PAGES
      .filter(p => p.title.toLowerCase().includes(q) || p.subtitle.toLowerCase().includes(q) || p.tags.some(t => t.includes(q)))
      .map(p => ({ type: 'page', title: p.title, subtitle: p.subtitle, href: p.href, emoji: p.emoji, color: p.color, match: 'Feature' }));
    setResults(pageResults);

    // Search journal entries
    try {
      const logs = JSON.parse(localStorage.getItem('synchrosoul_logs') || '[]');
      const jResults = logs.filter((l: any) =>
        l.number?.includes(q) || l.thought?.toLowerCase().includes(q)
      ).slice(0, 5);
      setLogResults(jResults);
    } catch {}

    // Search dreams
    try {
      const dreams = JSON.parse(localStorage.getItem('synchrosoul_dreams') || '[]');
      const dResults = dreams.filter((d: any) =>
        d.title?.toLowerCase().includes(q) || d.content?.toLowerCase().includes(q) || d.numbers?.some((n: string) => n.includes(q))
      ).slice(0, 3);
      setDreamResults(dResults);
    } catch {}
  }, [query]);

  const totalResults = results.length + logResults.length + dreamResults.length;

  return (
    <div style={{ minHeight: '100vh', padding: '2rem 1rem', maxWidth: '700px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 700, color: '#fff', fontFamily: 'Cormorant Garamond, serif' }}>Search</h1>
        <p style={{ color: 'rgba(255,255,255,0.4)', marginTop: '0.25rem' }}>Find features, journal entries, and more</p>
      </div>

      {/* Search Input */}
      <div style={{
        background: 'rgba(8,6,28,0.88)', borderRadius: '1.5rem',
        border: '1px solid rgba(255,255,255,0.12)', padding: '0.25rem 0.25rem 0.25rem 1.25rem',
        backdropFilter: 'blur(12px)', marginBottom: '1.5rem',
        display: 'flex', alignItems: 'center', gap: '0.75rem'
      }}>
        <span style={{ fontSize: '1.1rem', opacity: 0.5 }}>🔍</span>
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search features, numbers, journal entries..."
          autoFocus
          style={{
            flex: 1, background: 'transparent', border: 'none', outline: 'none',
            color: '#fff', fontSize: '1rem', padding: '0.75rem 0'
          }}
        />
        {query && (
          <button onClick={() => setQuery('')} style={{
            background: 'rgba(255,255,255,0.08)', border: 'none', borderRadius: '999px',
            width: '2rem', height: '2rem', cursor: 'pointer', color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem'
          }}>✕</button>
        )}
      </div>

      {/* No query - show quick links */}
      {!query && (
        <div>
          <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '0.75rem' }}>Quick Access</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '0.5rem' }}>
            {STATIC_PAGES.slice(0, 9).map(p => (
              <Link key={p.href} href={p.href} style={{
                background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: '1rem', padding: '0.875rem 0.5rem', textDecoration: 'none',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.35rem'
              }}>
                <span style={{ fontSize: '1.4rem' }}>{p.emoji}</span>
                <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.72rem', textAlign: 'center', lineHeight: 1.3 }}>{p.title}</span>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Results */}
      {query && (
        <div>
          {totalResults === 0 && (
            <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'rgba(255,255,255,0.3)' }}>
              <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>🔍</div>
              <p>No results for &ldquo;{query}&rdquo;</p>
              <p style={{ fontSize: '0.82rem', marginTop: '0.4rem' }}>Try searching for a feature name or number</p>
            </div>
          )}

          {results.length > 0 && (
            <div style={{ marginBottom: '1.5rem' }}>
              <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '0.75rem' }}>Features ({results.length})</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                {results.map(r => (
                  <Link key={r.href} href={r.href} style={{
                    background: 'rgba(8,6,28,0.88)', borderRadius: '1rem',
                    border: `1px solid ${r.color}20`, padding: '0.875rem 1rem',
                    textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.875rem'
                  }}>
                    <span style={{
                      width: '38px', height: '38px', borderRadius: '50%', flexShrink: 0,
                      background: `${r.color}15`, border: `1px solid ${r.color}25`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem'
                    }}>{r.emoji}</span>
                    <div>
                      <p style={{ color: '#fff', fontSize: '0.9rem', fontWeight: 600 }}>{r.title}</p>
                      <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.78rem' }}>{r.subtitle}</p>
                    </div>
                    <span style={{ marginLeft: 'auto', color: 'rgba(255,255,255,0.2)' }}>›</span>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {logResults.length > 0 && (
            <div style={{ marginBottom: '1.5rem' }}>
              <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '0.75rem' }}>Journal Entries ({logResults.length})</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                {logResults.map((l: any, i: number) => (
                  <Link key={i} href="/dashboard/journal" style={{
                    background: 'rgba(8,6,28,0.88)', borderRadius: '1rem',
                    border: '1px solid rgba(201,168,76,0.2)', padding: '0.875rem 1rem',
                    textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.875rem'
                  }}>
                    <span style={{
                      width: '38px', height: '38px', borderRadius: '50%', flexShrink: 0,
                      background: 'rgba(201,168,76,0.15)', border: '1px solid rgba(201,168,76,0.3)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: '#c9a84c', fontWeight: 800, fontSize: '0.85rem', fontFamily: 'Cormorant Garamond, serif'
                    }}>{l.number}</span>
                    <div>
                      <p style={{ color: '#fff', fontSize: '0.9rem', fontWeight: 600 }}>Angel Number {l.number}</p>
                      {l.thought && <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.78rem' }}>{l.thought.substring(0, 60)}...</p>}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {dreamResults.length > 0 && (
            <div>
              <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '0.75rem' }}>Dreams ({dreamResults.length})</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                {dreamResults.map((d: any, i: number) => (
                  <Link key={i} href="/dashboard/dreams" style={{
                    background: 'rgba(8,6,28,0.88)', borderRadius: '1rem',
                    border: '1px solid rgba(96,165,250,0.2)', padding: '0.875rem 1rem',
                    textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.875rem'
                  }}>
                    <span style={{ fontSize: '1.5rem' }}>🌙</span>
                    <div>
                      <p style={{ color: '#fff', fontSize: '0.9rem', fontWeight: 600 }}>{d.title || 'Dream Entry'}</p>
                      {d.content && <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.78rem' }}>{d.content.substring(0, 60)}...</p>}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}