'use client';
import { useState, useEffect } from 'react';

const angelMeanings: Record<string, { title: string; color: string; theme: string }> = {
  '111': { title: 'Manifestation Portal', color: '#ffd700', theme: 'creation and new beginnings' },
  '222': { title: 'Divine Balance', color: '#48bb78', theme: 'patience and harmony' },
  '333': { title: 'Ascended Masters', color: '#ed8936', theme: 'creativity and divine guidance' },
  '444': { title: 'Angelic Protection', color: '#4299e1', theme: 'stability and foundation' },
  '555': { title: 'Major Change', color: '#9b59b6', theme: 'transformation and freedom' },
  '777': { title: 'Divine Magic', color: '#c9a84c', theme: 'luck, spirituality and wisdom' },
  '888': { title: 'Infinite Abundance', color: '#f6ad55', theme: 'abundance and material success' },
  '999': { title: 'Completion', color: '#fc8181', theme: 'endings, release and service' },
  '1111': { title: 'Master Portal', color: '#ffd700', theme: 'awakening and soul alignment' },
  '000': { title: 'Divine Wholeness', color: '#b794f4', theme: 'infinity and pure potential' },
  '1212': { title: 'Cosmic Alignment', color: '#76e4f7', theme: 'growth and positive manifestation' },
};

function generateSynthesis(logs: any[], profile: any) {
  if (logs.length === 0) return {
    title: 'Begin Your Journey',
    body: 'Start logging angel numbers to receive your weekly cosmic synthesis. The universe is waiting to speak to you.',
    numbers: [] as string[],
    color: '#c9a84c'
  };
  const freq: Record<string, number> = {};
  logs.forEach((l: any) => { freq[l.number] = (freq[l.number] || 0) + 1; });
  const sorted = Object.entries(freq).sort((a, b) => b[1] - a[1]);
  const top3 = sorted.slice(0, 3).map(([n]) => n);
  const dominant = top3[0];
  const dominantData = angelMeanings[dominant] || { title: 'Sacred Number', color: '#c9a84c', theme: 'divine guidance' };
  const totalLogs = logs.length;
  const lifePath = profile?.lifePathNumber || profile?.lifePath || null;
  let body = `This week, the universe has been speaking to you through ${totalLogs} sacred sighting${totalLogs !== 1 ? 's' : ''}. `;
  if (top3.length >= 2) {
    body += `Your dominant sequence has been ${dominant} (${dominantData.title}), weaving the energy of ${dominantData.theme} through your days. `;
    const second = angelMeanings[top3[1]];
    if (second) body += `Alongside this, ${top3[1]} has appeared to reinforce themes of ${second.theme}. `;
  } else {
    body += `The number ${dominant} has been your primary messenger, carrying the energy of ${dominantData.theme}. `;
  }
  if (lifePath) body += `As a Life Path ${lifePath}, this energy is particularly significant for your soul's current chapter. `;
  body += `Trust what is unfolding. The pattern you are living is not random — it is a carefully orchestrated symphony of synchronicity designed specifically for your soul's evolution.`;
  return { title: dominantData.title + ' Week', body, numbers: top3, color: dominantData.color };
}

export default function SynthesisPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [profile, setProfile] = useState<any>(null);
  const [period, setPeriod] = useState<'week'|'month'>('week');
  const [saved, setSaved] = useState<any[]>([]);

  useEffect(() => {
    const l = localStorage.getItem('synchrosoul_logs'); if (l) setLogs(JSON.parse(l));
    const p = localStorage.getItem('synchrosoul_profile'); if (p) setProfile(JSON.parse(p));
    const s = localStorage.getItem('synchrosoul_synthesis_saved'); if (s) setSaved(JSON.parse(s));
  }, []);

  const now = new Date();
  const filtered = logs.filter((l: any) => {
    const d = new Date(l.createdAt || l.timestamp);
    return now.getTime() - d.getTime() < (period === 'week' ? 7 : 30) * 86400000;
  });
  const synthesis = generateSynthesis(filtered, profile);

  const saveSynthesis = () => {
    const entry = { ...synthesis, date: new Date().toISOString(), period, logCount: filtered.length };
    const updated = [entry, ...saved.slice(0, 11)];
    setSaved(updated);
    localStorage.setItem('synchrosoul_synthesis_saved', JSON.stringify(updated));
  };

  const freq: Record<string, number> = {};
  filtered.forEach((l: any) => { freq[l.number] = (freq[l.number] || 0) + 1; });
  const breakdown = Object.entries(freq).sort((a, b) => b[1] - a[1]);

  const dailyMap: Record<string, number> = {};
  filtered.forEach((l: any) => {
    const key = new Date(l.createdAt || l.timestamp).toLocaleDateString('en-US', { weekday: 'short' });
    dailyMap[key] = (dailyMap[key] || 0) + 1;
  });
  const days = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  const dailyData = days.map(d => ({ day: d, count: dailyMap[d] || 0 }));
  const maxDay = Math.max(...dailyData.map(d => d.count)) || 1;

  return (
    <div style={{ minHeight: '100vh', padding: '2rem 1rem', maxWidth: '700px', margin: '0 auto' }}>
      <h1 style={{ textAlign: 'center', fontSize: '1.8rem', fontWeight: 700, color: '#e8d5b7', marginBottom: '0.5rem' }}>🌟 Cosmic Synthesis</h1>
      <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.5)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>Your personalized spiritual report</p>

      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', marginBottom: '1.5rem' }}>
        {(['week','month'] as const).map(p => (
          <button key={p} onClick={() => setPeriod(p)} style={{ padding: '0.4rem 1.25rem', borderRadius: '999px', background: period === p ? 'rgba(201,168,76,0.2)' : 'rgba(255,255,255,0.05)', border: period === p ? '1px solid rgba(201,168,76,0.4)' : '1px solid rgba(255,255,255,0.08)', color: period === p ? '#c9a84c' : 'rgba(255,255,255,0.5)', cursor: 'pointer', fontSize: '0.82rem' }}>This {p}</button>
        ))}
      </div>

      <div style={{ background: 'rgba(8,6,28,0.92)', border: '1px solid ' + synthesis.color + '44', borderRadius: '1.5rem', padding: '2rem', backdropFilter: 'blur(14px)', marginBottom: '1.25rem', boxShadow: '0 0 50px ' + synthesis.color + '18' }}>
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
          {synthesis.numbers.map(n => {
            const m = angelMeanings[n];
            return <span key={n} style={{ padding: '0.25rem 0.75rem', background: (m?.color || '#c9a84c') + '22', border: '1px solid ' + (m?.color || '#c9a84c') + '44', borderRadius: '999px', color: m?.color || '#c9a84c', fontSize: '0.82rem', fontWeight: 700 }}>{n}</span>;
          })}
        </div>
        <h2 style={{ color: synthesis.color, fontSize: '1.3rem', fontWeight: 700, marginBottom: '1rem' }}>✨ {synthesis.title}</h2>
        <p style={{ color: 'rgba(255,255,255,0.8)', lineHeight: 1.9, fontSize: '0.95rem', fontStyle: 'italic', margin: 0 }}>{synthesis.body}</p>
        <div style={{ marginTop: '1.25rem', display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.75rem' }}>Based on {filtered.length} sighting{filtered.length !== 1 ? 's' : ''}</span>
          <button onClick={saveSynthesis} style={{ marginLeft: 'auto', padding: '0.4rem 1rem', borderRadius: '0.6rem', background: 'rgba(201,168,76,0.15)', border: '1px solid rgba(201,168,76,0.3)', color: '#c9a84c', cursor: 'pointer', fontSize: '0.8rem' }}>💾 Save Report</button>
        </div>
      </div>

      {breakdown.length > 0 && (
        <div style={{ background: 'rgba(8,6,28,0.85)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '1.25rem', padding: '1.5rem', backdropFilter: 'blur(10px)', marginBottom: '1rem' }}>
          <h3 style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1rem' }}>🔢 Number Breakdown</h3>
          {breakdown.map(([num, count]) => {
            const m = angelMeanings[num];
            const pct = Math.round((count / filtered.length) * 100);
            return (
              <div key={num} style={{ marginBottom: '0.65rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                  <span style={{ color: m?.color || '#c9a84c', fontSize: '0.85rem', fontWeight: 600 }}>{num}{m ? ' — ' + m.title : ''}</span>
                  <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.75rem' }}>{count}x · {pct}%</span>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: '999px', height: '5px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: pct + '%', background: m?.color || '#c9a84c', borderRadius: '999px', opacity: 0.7 }} />
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div style={{ background: 'rgba(8,6,28,0.85)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '1.25rem', padding: '1.5rem', backdropFilter: 'blur(10px)', marginBottom: '1rem' }}>
        <h3 style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1rem' }}>📅 Daily Rhythm</h3>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '0.4rem', height: '70px' }}>
          {dailyData.map((d, i) => (
            <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.3rem' }}>
              <div style={{ width: '100%', background: d.count > 0 ? 'linear-gradient(to top, #9b59b6, #9b59b688)' : 'rgba(255,255,255,0.05)', borderRadius: '3px 3px 0 0', height: Math.max(3, (d.count / maxDay) * 50) + 'px', border: d.count > 0 ? '1px solid rgba(155,89,182,0.3)' : '1px solid rgba(255,255,255,0.05)' }} />
              <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.62rem' }}>{d.day}</span>
            </div>
          ))}
        </div>
      </div>

      {saved.length > 0 && (
        <div style={{ background: 'rgba(8,6,28,0.75)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '1.25rem', padding: '1.5rem', backdropFilter: 'blur(8px)' }}>
          <h3 style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.75rem' }}>📚 Saved Reports</h3>
          {saved.slice(0, 4).map((s, i) => (
            <div key={i} style={{ padding: '0.75rem', borderRadius: '0.75rem', background: 'rgba(255,255,255,0.03)', marginBottom: '0.5rem', borderLeft: '2px solid ' + (s.color || '#c9a84c') + '66' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                <span style={{ color: s.color || '#c9a84c', fontSize: '0.85rem', fontWeight: 600 }}>{s.title}</span>
                <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.72rem' }}>{new Date(s.date).toLocaleDateString()}</span>
              </div>
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.78rem', margin: 0, lineHeight: 1.5 }}>{s.body.slice(0, 100)}...</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
