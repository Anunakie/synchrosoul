'use client'
import { useTheme } from '@/lib/theme-context';
import { useState, useEffect } from 'react';
import { getLogs } from '@/lib/storage';
import { getDreams } from '@/lib/dream-storage';

const allBadges = [
  { id: 'first_log', emoji: '👁️', name: 'First Sighting', desc: 'Logged your first angel number', category: 'Beginner', color: '#c9a84c', requirement: 'Log 1 angel number' },
  { id: 'logs_10', emoji: '📖', name: 'Seeker', desc: 'Logged 10 angel numbers', category: 'Logger', color: '#4299e1', requirement: 'Log 10 numbers' },
  { id: 'logs_50', emoji: '🔮', name: 'Oracle', desc: 'Logged 50 angel numbers', category: 'Logger', color: '#9b59b6', requirement: 'Log 50 numbers' },
  { id: 'logs_100', emoji: '💫', name: 'Starseed', desc: 'Logged 100 angel numbers', category: 'Logger', color: '#b794f4', requirement: 'Log 100 numbers' },
  { id: 'logs_365', emoji: '🌌', name: 'Cosmic Being', desc: 'Logged 365 angel numbers', category: 'Logger', color: '#805ad5', requirement: 'Log 365 numbers' },
  { id: 'streak_3', emoji: '🔥', name: 'Trinity Streak', desc: '3-day logging streak', category: 'Streak', color: '#f87171', requirement: '3 days in a row' },
  { id: 'streak_7', emoji: '⚡', name: 'Sacred Week', desc: '7-day logging streak', category: 'Streak', color: '#ecc94b', requirement: '7 days in a row' },
  { id: 'streak_30', emoji: '🌕', name: 'Moon Cycle', desc: '30-day logging streak', category: 'Streak', color: '#c9a84c', requirement: '30 days in a row' },
  { id: 'streak_100', emoji: '👑', name: 'Cosmic Crown', desc: '100-day logging streak', category: 'Streak', color: '#ffd700', requirement: '100 days in a row' },
  { id: 'truth_first', emoji: '📸', name: 'Truth Seeker', desc: 'First Angel Approved entry', simName: 'Signal Seeker', simDesc: 'First Signal Verified entry', category: 'Truth', color: '#34d399', requirement: 'Upload first screenshot' },
  { id: 'truth_10', emoji: '✅', name: 'Verified Mystic', desc: '10 Angel Approved entries', simName: 'Verified Node', simDesc: '10 Signal Verified entries', category: 'Truth', color: '#48bb78', requirement: '10 verified entries' },
  { id: 'truth_50', emoji: '🏆', name: 'Angel Champion', desc: '50 Angel Approved entries', simName: 'System Champion', simDesc: '50 Signal Verified entries', category: 'Truth', color: '#c9a84c', requirement: '50 verified entries' },
  { id: 'number_1111', emoji: '🌠', name: '1111 Portal', desc: 'Logged 1111 five times', category: 'Numbers', color: '#ffd700', requirement: 'Log 1111 x 5' },
  { id: 'number_777', emoji: '🍀', name: 'Lucky Seven', desc: 'Logged 777 three times', category: 'Numbers', color: '#c9a84c', requirement: 'Log 777 x 3' },
  { id: 'number_all', emoji: '🎯', name: 'Number Master', desc: 'Logged all 12 common numbers', category: 'Numbers', color: '#ed8936', requirement: 'Log all 12 numbers' },
  { id: 'journal_10', emoji: '✍️', name: 'Thought Anchor', desc: 'Added thoughts to 10 entries', category: 'Journal', color: '#76e4f7', requirement: '10 entries with thoughts' },
  { id: 'dream_first', emoji: '🌙', name: 'Dream Walker', desc: 'Logged your first dream', category: 'Dreams', color: '#9b59b6', requirement: 'Log 1 dream' },
  { id: 'dream_10', emoji: '🌌', name: 'Dream Weaver', desc: 'Logged 10 dreams', category: 'Dreams', color: '#805ad5', requirement: 'Log 10 dreams' },
  { id: 'early_adopter', emoji: '🚀', name: 'Early Adopter', desc: 'Joined in the first wave', category: 'Special', color: '#ffd700', requirement: 'Special — auto awarded' },
];

function calcStreak(logs: any[]): number {
  if (!logs.length) return 0;
  const dates = [...new Set(logs.map((l: any) => new Date(l.createdAt).toDateString()))].sort(
    (a, b) => new Date(a).getTime() - new Date(b).getTime()
  );
  let max = 1, cur = 1;
  for (let i = 1; i < dates.length; i++) {
    const diff = (new Date(dates[i]).getTime() - new Date(dates[i - 1]).getTime()) / 86400000;
    if (diff === 1) { cur++; max = Math.max(max, cur); } else cur = 1;
  }
  return max;
}

export default function BadgesPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [dreamCount, setDreamCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState('All');
  const categories = ['All', ...Array.from(new Set(allBadges.map(b => b.category)))]
  const { theme } = useTheme();
  const isSim = theme === 'simulation';

  useEffect(() => {
    async function load() {
      try {
        const [fetchedLogs, fetchedDreams] = await Promise.all([getLogs(), getDreams()]);
        setLogs(fetchedLogs);
        setDreamCount(fetchedDreams.length);
      } catch (e) {
        console.error('Badge load error:', e);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const isEarned = (id: string): boolean => {
    const count = logs.length;
    const streak = calcStreak(logs);
    const nums = logs.map((l: any) => l.number);
    const withThoughts = logs.filter((l: any) => l.thought && l.thought.trim()).length;
    const verified = logs.filter((l: any) => l.screenshotUrl).length;
    const uniqueNums = new Set(nums).size;
    switch (id) {
      case 'first_log': return count >= 1;
      case 'logs_10': return count >= 10;
      case 'logs_50': return count >= 50;
      case 'logs_100': return count >= 100;
      case 'logs_365': return count >= 365;
      case 'streak_3': return streak >= 3;
      case 'streak_7': return streak >= 7;
      case 'streak_30': return streak >= 30;
      case 'streak_100': return streak >= 100;
      case 'truth_first': return verified >= 1;
      case 'truth_10': return verified >= 10;
      case 'truth_50': return verified >= 50;
      case 'number_1111': return nums.filter((n: string) => n === '1111').length >= 5;
      case 'number_777': return nums.filter((n: string) => n === '777').length >= 3;
      case 'number_all': return uniqueNums >= 12;
      case 'journal_10': return withThoughts >= 10;
      case 'dream_first': return dreamCount >= 1;
      case 'dream_10': return dreamCount >= 10;
      case 'early_adopter': return count >= 1;
      default: return false;
    }
  };

  const earned = allBadges.filter(b => isEarned(b.id));
  const filtered = (category === 'All' ? allBadges : allBadges.filter(b => b.category === category));

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.5)' }}>
          <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>✨</div>
          <div>Loading your cosmic achievements...</div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', padding: '2rem 1rem', maxWidth: '700px', margin: '0 auto' }}>
      <h1 style={{ textAlign: 'center', fontSize: '1.8rem', fontWeight: 700, color: '#e8d5b7', marginBottom: '0.5rem' }}>🏆 Cosmic Badges</h1>
      <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.5)', marginBottom: '0.75rem', fontSize: '0.9rem' }}>Achievements on your spiritual journey</p>
      <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
        <span style={{ background: 'rgba(201,168,76,0.15)', color: '#c9a84c', padding: '0.4rem 1.25rem', borderRadius: '999px', fontSize: '0.9rem', border: '1px solid rgba(201,168,76,0.3)' }}>
          {earned.length} / {allBadges.length} earned
        </span>
      </div>
      <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', justifyContent: 'center', marginBottom: '1.5rem' }}>
        {categories.map(cat => (
          <button key={cat} onClick={() => setCategory(cat)} style={{ padding: '0.35rem 0.85rem', borderRadius: '999px', background: category === cat ? 'rgba(201,168,76,0.2)' : 'rgba(255,255,255,0.05)', border: category === cat ? '1px solid rgba(201,168,76,0.4)' : '1px solid rgba(255,255,255,0.08)', color: category === cat ? '#c9a84c' : 'rgba(255,255,255,0.5)', cursor: 'pointer', fontSize: '0.78rem' }}>{cat}</button>
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
        {filtered.map(badge => {
          const isUnlocked = isEarned(badge.id);
          return (
            <div key={badge.id} style={{ background: isUnlocked ? 'rgba(8,6,28,0.9)' : 'rgba(8,6,28,0.5)', border: isUnlocked ? '1px solid ' + badge.color + '55' : '1px solid rgba(255,255,255,0.06)', borderRadius: '1rem', padding: '1.1rem 0.75rem', textAlign: 'center', opacity: isUnlocked ? 1 : 0.45, transition: 'all 0.2s' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.4rem', filter: isUnlocked ? 'drop-shadow(0 0 8px ' + badge.color + '88)' : 'grayscale(1)' }}>{badge.emoji}</div>
              <div style={{ color: isUnlocked ? badge.color : 'rgba(255,255,255,0.4)', fontSize: '0.78rem', fontWeight: 600, marginBottom: '0.25rem' }}>{isSim && (badge as any).simName ? (badge as any).simName : badge.name}</div>
              <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.65rem', lineHeight: 1.3 }}>{isUnlocked ? badge.desc : badge.requirement}</div>
              {isUnlocked && <div style={{ marginTop: '0.4rem', fontSize: '0.6rem', color: badge.color }}>✓ Earned</div>}
            </div>
          );
        })}
      </div>
    </div>
  );
}
