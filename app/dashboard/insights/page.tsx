'use client';
import { useState, useEffect } from 'react';

function getWeekNumber(d: Date) {
  const onejan = new Date(d.getFullYear(), 0, 1);
  return Math.ceil((((d.getTime() - onejan.getTime()) / 86400000) + onejan.getDay() + 1) / 7);
}

const angelMeanings: Record<string, { title: string; color: string; keywords: string[] }> = {
  '111': { title: 'Manifestation Portal', color: '#ffd700', keywords: ['creation', 'intention', 'new beginnings'] },
  '222': { title: 'Divine Balance', color: '#48bb78', keywords: ['patience', 'harmony', 'trust'] },
  '333': { title: 'Ascended Masters', color: '#ed8936', keywords: ['creativity', 'expression', 'guidance'] },
  '444': { title: 'Angelic Protection', color: '#4299e1', keywords: ['stability', 'foundation', 'safety'] },
  '555': { title: 'Major Change', color: '#9b59b6', keywords: ['transformation', 'freedom', 'adventure'] },
  '666': { title: 'Rebalance', color: '#e53e3e', keywords: ['home', 'family', 'compassion'] },
  '777': { title: 'Divine Magic', color: '#c9a84c', keywords: ['luck', 'spirituality', 'wisdom'] },
  '888': { title: 'Infinite Abundance', color: '#f6ad55', keywords: ['abundance', 'success', 'power'] },
  '999': { title: 'Completion', color: '#fc8181', keywords: ['endings', 'release', 'service'] },
  '1111': { title: 'Master Portal', color: '#ffd700', keywords: ['awakening', 'alignment', 'purpose'] },
  '000': { title: 'Divine Wholeness', color: '#b794f4', keywords: ['infinity', 'oneness', 'potential'] },
  '1212': { title: 'Cosmic Alignment', color: '#76e4f7', keywords: ['growth', 'positivity', 'manifestation'] },
};

export default function InsightsPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [period, setPeriod] = useState<'week'|'month'|'all'>('week');

  useEffect(() => {
    const l = localStorage.getItem('synchrosoul_logs');
    if (l) setLogs(JSON.parse(l));
  }, []);

  const now = new Date();
  const filtered = logs.filter((l: any) => {
    const d = new Date(l.createdAt || l.timestamp);
    if (period === 'week') return now.getTime() - d.getTime() < 7 * 86400000;
    if (period === 'month') return now.getTime() - d.getTime() < 30 * 86400000;
    return true;
  });

  // Frequency map
  const freq: Record<string, number> = {};
  filtered.forEach((l: any) => { freq[l.number] = (freq[l.number] || 0) + 1; });
  const sorted = Object.entries(freq).sort((a, b) => b[1] - a[1]);
  const dominant = sorted[0]?.[0];
  const dominantData = dominant ? angelMeanings[dominant] : null;

  // Keyword cloud from all logged numbers
  const keywordFreq: Record<string, number> = {};
  filtered.forEach((l: any) => {
    const m = angelMeanings[l.number];
    if (m) m.keywords.forEach(k => { keywordFreq[k] = (keywordFreq[k] || 0) + 1; });
  });
  const topKeywords = Object.entries(keywordFreq).sort((a, b) => b[1] - a[1]).slice(0, 12);
  const maxKw = topKeywords[0]?.[1] || 1;

  // Thought themes (simple word frequency from thought entries)
  const thoughtWords: Record<string, number> = {};
  const stopWords = new Set(['the','a','an','and','or','but','in','on','at','to','for','of','with','i','my','me','was','is','are','it','this','that','be','have','had','do','did','not','so','as','if','by','from','up','about','into','then','than','when','what','how','all','just','can','will','would','could','should','been','has','its','we','they','their','there','were','he','she','his','her','you','your','our','us','him','them','who','which','also','more','some','any','no','out','get','got','see','saw','feel','felt','know','knew','think','thought','want','wanted','need','needed','go','went','come','came','make','made','take','took','look','looked','like','love','time','day','today','now','back','still','even','much','very','really','just','only','over','after','before','again','never','always','every','each','both','few','many','most','other','same','new','old','good','great','little','own','right','well','way','place','thing','things','something','nothing','everything','anything','someone','anyone','everyone','no one']);
  filtered.forEach((l: any) => {
    if (l.thought) {
      l.thought.toLowerCase().split(/\W+/).forEach((w: string) => {
        if (w.length > 3 && !stopWords.has(w)) thoughtWords[w] = (thoughtWords[w] || 0) + 1;
      });
    }
  });
  const topThoughts = Object.entries(thoughtWords).sort((a, b) => b[1] - a[1]).slice(0, 10);

  // Time pattern
  const hourBuckets = Array(24).fill(0);
  filtered.forEach((l: any) => { hourBuckets[new Date(l.createdAt || l.timestamp).getHours()]++; });
  const peakHour = hourBuckets.indexOf(Math.max(...hourBuckets));
  const peakLabel = peakHour < 12 ? peakHour + ':00 AM' : peakHour === 12 ? '12:00 PM' : (peakHour - 12) + ':00 PM';

  // Weekly trend (last 4 weeks)
  const weeklyData = [0,1,2,3].map(weeksAgo => {
    const start = new Date(now.getTime() - (weeksAgo + 1) * 7 * 86400000);
    const end = new Date(now.getTime() - weeksAgo * 7 * 86400000);
    const count = logs.filter((l: any) => {
      const d = new Date(l.createdAt || l.timestamp);
      return d >= start && d < end;
    }).length;
    return { label: weeksAgo === 0 ? 'This week' : weeksAgo === 1 ? 'Last week' : weeksAgo + 'w ago', count };
  }).reverse();
  const maxWeek = Math.max(...weeklyData.map(w => w.count)) || 1;

  // Verified ratio
  const verifiedCount = filtered.filter((l: any) => l.screenshotUrl).length;
  const verifiedPct = filtered.length > 0 ? Math.round((verifiedCount / filtered.length) * 100) : 0;

  return (
    <div style={{ minHeight: '100vh', padding: '2rem 1rem', maxWidth: '700px', margin: '0 auto' }}>
      <h1 style={{ textAlign: 'center', fontSize: '1.8rem', fontWeight: 700, color: '#e8d5b7', marginBottom: '0.5rem' }}>🔍 Soul Insights</h1>
      <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.5)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>Patterns and wisdom from your angel number journey</p>

      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', marginBottom: '1.5rem' }}>
        {(['week','month','all'] as const).map(p => (
          <button key={p} onClick={() => setPeriod(p)} style={{ padding: '0.4rem 1.1rem', borderRadius: '999px', background: period === p ? 'rgba(201,168,76,0.2)' : 'rgba(255,255,255,0.05)', border: period === p ? '1px solid rgba(201,168,76,0.4)' : '1px solid rgba(255,255,255,0.08)', color: period === p ? '#c9a84c' : 'rgba(255,255,255,0.5)', cursor: 'pointer', fontSize: '0.82rem', textTransform: 'capitalize' }}>{p === 'all' ? 'All Time' : 'This ' + p}</button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.4)', padding: '4rem 2rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🌌</div>
          <p>No logs found for this period. Start logging angel numbers to see your insights.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>

          {dominantData && (
            <div style={{ background: 'rgba(8,6,28,0.9)', border: '1px solid ' + dominantData.color + '44', borderRadius: '1.5rem', padding: '1.75rem', backdropFilter: 'blur(12px)', textAlign: 'center' }}>
              <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>Dominant Energy</div>
              <div style={{ fontSize: '2.5rem', fontWeight: 800, color: dominantData.color, marginBottom: '0.25rem' }}>{dominant}</div>
              <div style={{ color: '#e8d5b7', fontWeight: 600, fontSize: '1rem', marginBottom: '0.5rem' }}>{dominantData.title}</div>
              <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                {dominantData.keywords.map(k => (
                  <span key={k} style={{ padding: '0.2rem 0.6rem', background: dominantData.color + '22', border: '1px solid ' + dominantData.color + '44', borderRadius: '999px', color: dominantData.color, fontSize: '0.75rem' }}>{k}</span>
                ))}
              </div>
            </div>
          )}

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
            <div style={{ background: 'rgba(8,6,28,0.85)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '1.25rem', padding: '1rem', backdropFilter: 'blur(8px)', textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem' }}>🔢</div>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#c9a84c' }}>{filtered.length}</div>
              <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.72rem' }}>Total Logs</div>
            </div>
            <div style={{ background: 'rgba(8,6,28,0.85)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '1.25rem', padding: '1rem', backdropFilter: 'blur(8px)', textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem' }}>🕐</div>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#9b59b6' }}>{filtered.length > 0 ? peakLabel : '—'}</div>
              <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.72rem' }}>Peak Time</div>
            </div>
            <div style={{ background: 'rgba(8,6,28,0.85)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '1.25rem', padding: '1rem', backdropFilter: 'blur(8px)', textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem' }}>✅</div>
              <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#48bb78' }}>{verifiedPct}%</div>
              <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.72rem' }}>Verified</div>
            </div>
          </div>

          {topKeywords.length > 0 && (
            <div style={{ background: 'rgba(8,6,28,0.85)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '1.25rem', padding: '1.5rem', backdropFilter: 'blur(8px)' }}>
              <h3 style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1rem' }}>✨ Your Energy Keywords</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {topKeywords.map(([kw, count]) => {
                  const size = 0.75 + (count / maxKw) * 0.5;
                  const opacity = 0.4 + (count / maxKw) * 0.6;
                  return (
                    <span key={kw} style={{ padding: '0.3rem 0.75rem', background: 'rgba(201,168,76,' + (opacity * 0.15) + ')', border: '1px solid rgba(201,168,76,' + (opacity * 0.3) + ')', borderRadius: '999px', color: 'rgba(201,168,76,' + opacity + ')', fontSize: size + 'rem', fontWeight: count === maxKw ? 700 : 400 }}>{kw}</span>
                  );
                })}
              </div>
            </div>
          )}

          {topThoughts.length > 0 && (
            <div style={{ background: 'rgba(8,6,28,0.85)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '1.25rem', padding: '1.5rem', backdropFilter: 'blur(8px)' }}>
              <h3 style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1rem' }}>💭 Thought Themes</h3>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {topThoughts.map(([word, count]) => (
                  <span key={word} style={{ padding: '0.25rem 0.65rem', background: 'rgba(155,89,182,0.12)', border: '1px solid rgba(155,89,182,0.25)', borderRadius: '999px', color: 'rgba(183,148,244,0.8)', fontSize: '0.82rem' }}>{word} <span style={{ opacity: 0.5, fontSize: '0.7rem' }}>×{count}</span></span>
                ))}
              </div>
            </div>
          )}

          <div style={{ background: 'rgba(8,6,28,0.85)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '1.25rem', padding: '1.5rem', backdropFilter: 'blur(8px)' }}>
            <h3 style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1rem' }}>📈 Weekly Trend</h3>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '0.75rem', height: '80px' }}>
              {weeklyData.map((w, i) => (
                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem' }}>
                  <div style={{ width: '100%', background: i === 3 ? 'linear-gradient(to top, #c9a84c, #c9a84c88)' : 'rgba(255,255,255,0.08)', borderRadius: '4px 4px 0 0', height: Math.max(4, (w.count / maxWeek) * 60) + 'px', border: i === 3 ? '1px solid rgba(201,168,76,0.4)' : '1px solid rgba(255,255,255,0.06)', transition: 'height 0.5s ease' }} />
                  <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.62rem', textAlign: 'center', lineHeight: 1.2 }}>{w.label}</span>
                </div>
              ))}
            </div>
          </div>

          {sorted.length > 1 && (
            <div style={{ background: 'rgba(8,6,28,0.85)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '1.25rem', padding: '1.5rem', backdropFilter: 'blur(8px)' }}>
              <h3 style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1rem' }}>🔢 Number Breakdown</h3>
              {sorted.slice(0, 6).map(([num, count], i) => {
                const m = angelMeanings[num];
                const pct = Math.round((count / filtered.length) * 100);
                return (
                  <div key={num} style={{ marginBottom: '0.75rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                      <span style={{ color: m?.color || '#c9a84c', fontWeight: 600, fontSize: '0.88rem' }}>{num} {m ? '— ' + m.title : ''}</span>
                      <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.78rem' }}>{count}x · {pct}%</span>
                    </div>
                    <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: '999px', height: '5px', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: pct + '%', background: m?.color || '#c9a84c', borderRadius: '999px', opacity: 0.7, transition: 'width 0.8s ease' }} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
