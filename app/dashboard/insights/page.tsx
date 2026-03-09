'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

function reduce(n: number): number {
  while (n > 9 && n !== 11 && n !== 22 && n !== 33) {
    n = String(n).split('').reduce((a, d) => a + parseInt(d), 0);
  }
  return n;
}

const MEANINGS: Record<string, string> = {
  '111': 'Manifestation & new beginnings',
  '222': 'Trust & divine timing',
  '333': 'Ascended masters & creativity',
  '444': 'Angelic protection & stability',
  '555': 'Change & transformation',
  '666': 'Balance & rebalancing',
  '777': 'Spiritual luck & wisdom',
  '888': 'Abundance & infinity',
  '999': 'Completion & release',
  '1111': 'Master manifestation portal',
  '1212': 'Soul mission alignment',
};

interface Insight {
  title: string;
  body: string;
  color: string;
  emoji: string;
  type: 'pattern' | 'guidance' | 'milestone' | 'warning';
}

function generateInsights(logs: any[], profile: any): Insight[] {
  const insights: Insight[] = [];
  if (!logs.length) return insights;

  const freq: Record<string, number> = {};
  logs.forEach((l: any) => { freq[l.number] = (freq[l.number] || 0) + 1; });
  const sorted = Object.entries(freq).sort((a, b) => b[1] - a[1]);
  const top = sorted[0];
  const total = logs.length;

  // Top number insight
  if (top) {
    const pct = Math.round((top[1] / total) * 100);
    insights.push({
      title: `${top[0]} is Your Signature Number`,
      body: `You have seen ${top[0]} ${top[1]} times (${pct}% of all logs). ${MEANINGS[top[0]] || 'This number carries a special message for you'}. Your guides are consistently sending this frequency.`,
      color: '#c9a84c', emoji: '✦', type: 'pattern'
    });
  }

  // Diversity insight
  const uniqueNumbers = Object.keys(freq).length;
  if (uniqueNumbers >= 5) {
    insights.push({
      title: 'Broad Spiritual Awareness',
      body: `You are noticing ${uniqueNumbers} different angel numbers. This breadth of awareness suggests you are highly attuned to multiple channels of divine communication.`,
      color: '#a78bfa', emoji: '🌐', type: 'guidance'
    });
  } else if (uniqueNumbers <= 2 && total >= 5) {
    insights.push({
      title: 'Focused Message',
      body: `Your guides are sending a very focused message through just ${uniqueNumbers} number(s). This concentration suggests an urgent or important theme in your life right now.`,
      color: '#f97316', emoji: '🎯', type: 'guidance'
    });
  }

  // Time pattern
  const hours = logs.map((l: any) => new Date(l.createdAt).getHours());
  const morningLogs = hours.filter(h => h >= 5 && h < 12).length;
  const eveningLogs = hours.filter(h => h >= 18 && h < 24).length;
  const nightLogs = hours.filter(h => h >= 0 && h < 5).length;
  if (morningLogs > total * 0.5) {
    insights.push({ title: 'Morning Seer', body: 'Most of your angel number sightings happen in the morning. Your awareness peaks at the start of the day — a sign of a clear, receptive mind.', color: '#f59e0b', emoji: '🌅', type: 'pattern' });
  } else if (eveningLogs > total * 0.5) {
    insights.push({ title: 'Evening Channel', body: 'You most often receive angel messages in the evening. This suggests your intuitive channel opens as the day winds down and your mind quiets.', color: '#6366f1', emoji: '🌆', type: 'pattern' });
  } else if (nightLogs > total * 0.3) {
    insights.push({ title: 'Night Oracle', body: 'You receive significant angel messages late at night. Your connection to the spiritual realm is strongest in the quiet hours — a rare and powerful gift.', color: '#1e1b4b', emoji: '🌙', type: 'pattern' });
  }

  // Streak insight
  const dates = [...new Set(logs.map((l: any) => new Date(l.createdAt).toDateString()))];
  if (dates.length >= 7) {
    insights.push({ title: 'Consistent Spiritual Practice', body: `You have logged angel numbers on ${dates.length} different days. Consistency is the key to deepening your connection with your guides.`, color: '#4ade80', emoji: '🔥', type: 'milestone' });
  }

  // Verified insight
  const verified = logs.filter((l: any) => l.screenshotUrl).length;
  if (verified > 0) {
    const verifiedPct = Math.round((verified / total) * 100);
    insights.push({ title: `${verifiedPct}% Angel Approved`, body: `${verified} of your ${total} logs have screenshot proof. Verified sightings carry extra weight in your Truth Score and sync matching.`, color: '#4ade80', emoji: '✓', type: 'milestone' });
  }

  // Numerology alignment
  if (profile?.lifePath) {
    const lp = String(profile.lifePath);
    const lpNum = lp.padStart(3, '0');
    const relatedNums = Object.keys(freq).filter(n => n.includes(lp) || reduce(parseInt(n)) === parseInt(lp));
    if (relatedNums.length > 0) {
      insights.push({
        title: `Life Path ${lp} Alignment`,
        body: `You are seeing numbers that resonate with your Life Path ${lp}: ${relatedNums.join(', ')}. Your guides are reinforcing your soul mission through these sequences.`,
        color: '#f472b6', emoji: '🧬', type: 'guidance'
      });
    }
  }

  // Recent surge
  const lastWeek = logs.filter((l: any) => new Date(l.createdAt) > new Date(Date.now() - 7 * 86400000)).length;
  const prevWeek = logs.filter((l: any) => {
    const d = new Date(l.createdAt);
    return d > new Date(Date.now() - 14 * 86400000) && d <= new Date(Date.now() - 7 * 86400000);
  }).length;
  if (lastWeek > prevWeek * 1.5 && lastWeek >= 3) {
    insights.push({ title: 'Spiritual Surge This Week', body: `Your angel number sightings increased ${Math.round(((lastWeek - prevWeek) / Math.max(prevWeek, 1)) * 100)}% this week compared to last. The universe is accelerating its communication with you.`, color: '#60a5fa', emoji: '📈', type: 'guidance' });
  }

  return insights.slice(0, 8);
}

const TYPE_STYLES: Record<string, { bg: string; border: string; label: string }> = {
  pattern: { bg: 'rgba(201,168,76,0.08)', border: 'rgba(201,168,76,0.2)', label: 'Pattern' },
  guidance: { bg: 'rgba(96,165,250,0.08)', border: 'rgba(96,165,250,0.2)', label: 'Guidance' },
  milestone: { bg: 'rgba(74,222,128,0.08)', border: 'rgba(74,222,128,0.2)', label: 'Milestone' },
  warning: { bg: 'rgba(249,115,22,0.08)', border: 'rgba(249,115,22,0.2)', label: 'Note' },
};

export default function InsightsPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [profile, setProfile] = useState<any>(null);
  const [insights, setInsights] = useState<Insight[]>([]);

  useEffect(() => {
    try {
      const l = JSON.parse(localStorage.getItem('synchrosoul_logs') || '[]');
      const p = JSON.parse(localStorage.getItem('synchrosoul_numerology_profile') || 'null');
      setLogs(l); setProfile(p);
      setInsights(generateInsights(l, p));
    } catch {}
  }, []);

  const freq: Record<string, number> = {};
  logs.forEach((l: any) => { freq[l.number] = (freq[l.number] || 0) + 1; });
  const topNumbers = Object.entries(freq).sort((a, b) => b[1] - a[1]).slice(0, 5);

  return (
    <div style={{ minHeight: '100vh', padding: '2rem 1rem', maxWidth: '700px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 700, color: '#60a5fa', fontFamily: 'Cormorant Garamond, serif' }}>Cosmic Insights</h1>
        <p style={{ color: 'rgba(255,255,255,0.4)', marginTop: '0.25rem' }}>AI-powered patterns in your spiritual journey</p>
      </div>

      {logs.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem 1rem', color: 'rgba(255,255,255,0.3)' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔮</div>
          <p style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.2rem', marginBottom: '0.5rem' }}>No patterns yet</p>
          <p style={{ fontSize: '0.85rem' }}>Log angel numbers to unlock personalized insights</p>
          <Link href="/dashboard" style={{ display: 'inline-block', marginTop: '1.25rem', padding: '0.6rem 1.5rem', borderRadius: '999px', background: 'rgba(96,165,250,0.15)', border: '1px solid rgba(96,165,250,0.3)', color: '#60a5fa', textDecoration: 'none', fontSize: '0.85rem' }}>Start Logging ✦</Link>
        </div>
      ) : (
        <div>
          {/* Summary strip */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '0.6rem', marginBottom: '1.5rem' }}>
            {[
              { label: 'Total Logs', value: logs.length, color: '#c9a84c' },
              { label: 'Unique Numbers', value: Object.keys(freq).length, color: '#a78bfa' },
              { label: 'Insights Found', value: insights.length, color: '#60a5fa' },
            ].map(s => (
              <div key={s.label} style={{ background: 'rgba(8,6,28,0.88)', borderRadius: '1.25rem', border: `1px solid ${s.color}20`, padding: '1rem', backdropFilter: 'blur(12px)', textAlign: 'center' }}>
                <div style={{ fontSize: '1.75rem', fontWeight: 800, color: s.color, fontFamily: 'Cormorant Garamond, serif', lineHeight: 1 }}>{s.value}</div>
                <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.68rem', marginTop: '0.3rem' }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Top numbers */}
          {topNumbers.length > 0 && (
            <div style={{ background: 'rgba(8,6,28,0.88)', borderRadius: '1.5rem', border: '1px solid rgba(255,255,255,0.08)', padding: '1.25rem', backdropFilter: 'blur(12px)', marginBottom: '1.25rem' }}>
              <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '0.875rem' }}>Your Top Numbers</p>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {topNumbers.map(([n, c], i) => (
                  <div key={n} style={{
                    background: i === 0 ? 'rgba(201,168,76,0.15)' : 'rgba(255,255,255,0.05)',
                    border: i === 0 ? '1px solid rgba(201,168,76,0.35)' : '1px solid rgba(255,255,255,0.08)',
                    borderRadius: '999px', padding: '0.4rem 0.875rem',
                    display: 'flex', alignItems: 'center', gap: '0.4rem'
                  }}>
                    <span style={{ color: i === 0 ? '#c9a84c' : 'rgba(255,255,255,0.7)', fontWeight: 700, fontFamily: 'Cormorant Garamond, serif' }}>{n}</span>
                    <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.72rem' }}>×{c}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Insights */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {insights.map((ins, i) => {
              const ts = TYPE_STYLES[ins.type];
              return (
                <div key={i} style={{
                  background: ts.bg, borderRadius: '1.5rem',
                  border: `1px solid ${ts.border}`, padding: '1.25rem',
                  backdropFilter: 'blur(12px)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.875rem' }}>
                    <div style={{
                      width: '40px', height: '40px', borderRadius: '50%', flexShrink: 0,
                      background: `${ins.color}15`, border: `1px solid ${ins.color}25`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem'
                    }}>{ins.emoji}</div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.3rem' }}>
                        <p style={{ color: '#fff', fontWeight: 700, fontSize: '0.9rem' }}>{ins.title}</p>
                        <span style={{ background: `${ins.color}15`, border: `1px solid ${ins.color}25`, borderRadius: '999px', padding: '0.1rem 0.4rem', fontSize: '0.6rem', color: ins.color }}>{ts.label}</span>
                      </div>
                      <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem', lineHeight: 1.6 }}>{ins.body}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}