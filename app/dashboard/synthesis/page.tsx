
'use client';
import FeatureGate from '@/components/FeatureGate';
import { getLogs } from '@/lib/storage';
import { getProfile } from '@/lib/supabase-db';
import { useState, useEffect, useCallback } from 'react';

const ANGEL_COLORS: Record<string, string> = {
  '111': '#ffd700', '222': '#48bb78', '333': '#ed8936', '444': '#4299e1',
  '555': '#9b59b6', '666': '#68d391', '777': '#c9a84c', '888': '#f6ad55',
  '999': '#fc8181', '000': '#b794f4', '1111': '#ffd700', '1212': '#76e4f7',
  '1234': '#f9a8d4', '2222': '#6ee7b7', '3333': '#fbbf24', '4444': '#60a5fa',
  '5555': '#c084fc',
};
function getColor(num: string) { return ANGEL_COLORS[num] || '#c9a84c'; }

function LoadingOrb() {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: '1.5rem' }}>
      <div style={{ position: 'relative', width: '80px', height: '80px' }}>
        <div style={{ position: 'absolute', inset: 0, borderRadius: '50%', background: 'radial-gradient(circle, rgba(201,168,76,0.4), transparent)', animation: 'orb1 2s ease-in-out infinite' }} />
        <div style={{ position: 'absolute', inset: '10px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(201,168,76,0.6), rgba(155,89,182,0.3))', animation: 'orb1 2s ease-in-out infinite 0.5s' }} />
        <div style={{ position: 'absolute', inset: '25px', borderRadius: '50%', background: '#c9a84c', opacity: 0.9, animation: 'orb1 1.5s ease-in-out infinite 0.25s' }} />
      </div>
      <div style={{ textAlign: 'center' }}>
        <p style={{ color: '#c9a84c', fontSize: '1rem', fontWeight: 600, marginBottom: '0.25rem' }}>Channeling your cosmic data...</p>
        <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.82rem' }}>The universe is composing your report</p>
      </div>
      <style>{`@keyframes orb1 { 0%,100%{transform:scale(1);opacity:0.7} 50%{transform:scale(1.15);opacity:1} }`}</style>
    </div>
  );
}

function SynthesisPageInner() {
  const [logs, setLogs] = useState<any[]>([]);
  const [profile, setProfile] = useState<any>(null);
  const [period, setPeriod] = useState<'week' | 'month'>('week');
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<'report' | 'history'>('report');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    (async () => {
    try {
      const logs = await getLogs();
      if (logs.length > 0) setLogs(logs);
      else {
        const l = localStorage.getItem('synchrosoul_logs');
        if (l) setLogs(JSON.parse(l));
      }
    } catch {
      const l = localStorage.getItem('synchrosoul_logs');
      if (l) setLogs(JSON.parse(l));
    }
    try {
      const profile = await getProfile();
      if (profile) setProfile({ name: profile.display_name || '', birthdate: profile.birthdate || '' });
      else {
        const p = localStorage.getItem('synchrosoul_profile');
        if (p) setProfile(JSON.parse(p));
      }
    } catch {
      const p = localStorage.getItem('synchrosoul_profile');
      if (p) setProfile(JSON.parse(p));
    }
    })();
    const s = localStorage.getItem('synchrosoul_synthesis_saved');
    if (s) setSaved(JSON.parse(s));
  }, []);

  const filtered = logs.filter((l: any) => {
    const d = new Date(l.createdAt || l.timestamp);
    return Date.now() - d.getTime() < (period === 'week' ? 7 : 30) * 86400000;
  });

  const freq: Record<string, number> = {};
  filtered.forEach((l: any) => { freq[l.number] = (freq[l.number] || 0) + 1; });
  const breakdown = Object.entries(freq).sort((a: any, b: any) => b[1] - a[1]);

  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const dailyMap: Record<string, number> = {};
  filtered.forEach((l: any) => {
    const key = days[new Date(l.createdAt || l.timestamp).getDay()];
    dailyMap[key] = (dailyMap[key] || 0) + 1;
  });
  const dailyData = days.map(d => ({ day: d, count: dailyMap[d] || 0 }));
  const maxDay = Math.max(...dailyData.map(d => d.count), 1);

  const generateReport = useCallback(async () => {
    setLoading(true);
    setReport(null);
    try {
      const res = await fetch('/api/synthesis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ logs: filtered, profile, period }),
      });
      const data = await res.json();
      setReport(data);
    } catch {
      setReport({
        title: 'Cosmic Currents Are Flowing',
        narrative: 'The universe has been speaking to you through sacred sequences this week. Each number you noticed was a deliberate message from the divine.',
        themes: ['Awareness', 'Synchronicity', 'Growth'],
        affirmation: 'I trust the divine timing of my spiritual journey.',
        guidance: 'Reflect on the moments when you noticed these numbers. What were you feeling?',
        dominantNumber: breakdown[0]?.[0] || null,
        dominantMeaning: 'Sacred Sequence',
        patternInsight: 'Your numbers form a unique cosmic signature this week.',
        energyForecast: 'Powerful synchronicities are aligning in your favor.',
      });
    } finally {
      setLoading(false);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filtered.length, period]);

  const saveReport = () => {
    if (!report) return;
    const entry = { ...report, date: new Date().toISOString(), period, logCount: filtered.length };
    const updated = [entry, ...saved.slice(0, 11)];
    setSaved(updated);
    localStorage.setItem('synchrosoul_synthesis_saved', JSON.stringify(updated));
  };

  const copyAffirmation = () => {
    if (report?.affirmation) {
      navigator.clipboard.writeText(report.affirmation);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const dominantColor = report?.dominantNumber ? getColor(report.dominantNumber) : '#c9a84c';

  return (
    <div style={{ minHeight: '100vh', padding: '2rem 1rem', maxWidth: '720px', margin: '0 auto' }}>

      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>✺</div>
        <h1 style={{ fontSize: '1.9rem', fontWeight: 800, color: '#e8d5b7', marginBottom: '0.4rem' }}>Weekly Cosmic Synthesis</h1>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.88rem' }}>AI-powered spiritual report from your angel number journey</p>
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div style={{ display: 'flex', gap: '0.4rem' }}>
          {(['week', 'month'] as const).map(p => (
            <button key={p} onClick={() => { setPeriod(p); setReport(null); }} style={{
              padding: '0.35rem 1rem', borderRadius: '999px', cursor: 'pointer', fontSize: '0.8rem',
              background: period === p ? 'rgba(201,168,76,0.2)' : 'rgba(255,255,255,0.05)',
              border: period === p ? '1px solid rgba(201,168,76,0.4)' : '1px solid rgba(255,255,255,0.08)',
              color: period === p ? '#c9a84c' : 'rgba(255,255,255,0.4)',
            }}>This {p}</button>
          ))}
        </div>
        <div style={{ display: 'flex', gap: '0.4rem' }}>
          {(['report', 'history'] as const).map(t => (
            <button key={t} onClick={() => setActiveTab(t)} style={{
              padding: '0.35rem 1rem', borderRadius: '999px', cursor: 'pointer', fontSize: '0.8rem',
              background: activeTab === t ? 'rgba(155,89,182,0.2)' : 'rgba(255,255,255,0.05)',
              border: activeTab === t ? '1px solid rgba(155,89,182,0.4)' : '1px solid rgba(255,255,255,0.08)',
              color: activeTab === t ? '#b794f4' : 'rgba(255,255,255,0.4)',
            }}>{t === 'report' ? '✦ Report' : '📚 History'}</button>
          ))}
        </div>
      </div>

      {activeTab === 'report' && (
        <>
          {/* Stats bar */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem', marginBottom: '1.5rem' }}>
            {[
              { label: 'Sightings', value: filtered.length, icon: '👁' },
              { label: 'Unique Numbers', value: breakdown.length, icon: '🔢' },
              { label: 'Dominant', value: breakdown[0]?.[0] || '—', icon: '✦' },
            ].map(s => (
              <div key={s.label} style={{ background: 'rgba(8,6,28,0.85)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '1rem', padding: '1rem', textAlign: 'center', backdropFilter: 'blur(10px)' }}>
                <div style={{ fontSize: '1.2rem', marginBottom: '0.25rem' }}>{s.icon}</div>
                <div style={{ color: '#e8d5b7', fontWeight: 700, fontSize: '1.1rem' }}>{s.value}</div>
                <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.7rem' }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Generate button */}
          {!report && !loading && (
            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <button onClick={generateReport} style={{
                padding: '1rem 2.5rem', borderRadius: '999px', cursor: 'pointer',
                background: 'linear-gradient(135deg, #c9a84c, #9b59b6)',
                border: 'none', color: '#fff', fontWeight: 700, fontSize: '1rem',
                boxShadow: '0 0 30px rgba(201,168,76,0.3)',
              }}>✺ Generate My Cosmic Report</button>
              <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.78rem', marginTop: '0.75rem' }}>
                Powered by AI · Personalized to your {filtered.length} sighting{filtered.length !== 1 ? 's' : ''}
              </p>
            </div>
          )}

          {loading && <LoadingOrb />}

          {report && !loading && (
            <>
              {/* Main report card */}
              <div style={{
                background: 'rgba(8,6,28,0.92)',
                border: `1px solid ${dominantColor}44`,
                borderRadius: '1.5rem', padding: '2rem', backdropFilter: 'blur(16px)',
                marginBottom: '1rem',
                boxShadow: `0 0 60px ${dominantColor}18`,
              }}>
                {report.dominantNumber && (
                  <span style={{
                    display: 'inline-block', padding: '0.2rem 0.75rem',
                    background: `${dominantColor}22`, border: `1px solid ${dominantColor}44`,
                    borderRadius: '999px', color: dominantColor, fontSize: '0.78rem',
                    fontWeight: 700, marginBottom: '0.75rem',
                  }}>{report.dominantNumber} · {report.dominantMeaning}</span>
                )}
                <h2 style={{ color: dominantColor, fontSize: '1.4rem', fontWeight: 800, margin: '0 0 1rem' }}>✺ {report.title}</h2>

                <p style={{ color: 'rgba(255,255,255,0.82)', lineHeight: 1.9, fontSize: '0.95rem', fontStyle: 'italic', marginBottom: '1.5rem' }}>
                  {report.narrative}
                </p>

                {report.themes?.length > 0 && (
                  <div style={{ marginBottom: '1.25rem' }}>
                    <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>This Week&apos;s Themes</p>
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                      {report.themes.map((t: string, i: number) => (
                        <span key={i} style={{ padding: '0.3rem 0.85rem', borderRadius: '999px', background: 'rgba(155,89,182,0.15)', border: '1px solid rgba(155,89,182,0.3)', color: '#b794f4', fontSize: '0.8rem', fontWeight: 600 }}>{t}</span>
                      ))}
                    </div>
                  </div>
                )}

                {report.patternInsight && (
                  <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '0.75rem', padding: '0.85rem 1rem', marginBottom: '1.25rem', borderLeft: `3px solid ${dominantColor}66` }}>
                    <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem', lineHeight: 1.7, margin: 0 }}>🔮 {report.patternInsight}</p>
                  </div>
                )}

                {report.affirmation && (
                  <div style={{ background: `${dominantColor}11`, border: `1px solid ${dominantColor}33`, borderRadius: '1rem', padding: '1.25rem', marginBottom: '1.25rem', textAlign: 'center' }}>
                    <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.7rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>✦ Weekly Affirmation</p>
                    <p style={{ color: dominantColor, fontSize: '1rem', fontWeight: 600, fontStyle: 'italic', lineHeight: 1.6, margin: 0 }}>&ldquo;{report.affirmation}&rdquo;</p>
                    <button onClick={copyAffirmation} style={{ marginTop: '0.75rem', padding: '0.3rem 0.85rem', borderRadius: '999px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.4)', cursor: 'pointer', fontSize: '0.72rem' }}>
                      {copied ? '✓ Copied!' : '📋 Copy'}
                    </button>
                  </div>
                )}

                {report.guidance && (
                  <div style={{ marginBottom: '1.25rem' }}>
                    <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>Guidance for the Week Ahead</p>
                    <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem', lineHeight: 1.8, margin: 0 }}>{report.guidance}</p>
                  </div>
                )}

                {report.energyForecast && (
                  <div style={{ background: 'rgba(155,89,182,0.1)', borderRadius: '0.75rem', padding: '0.75rem 1rem', marginBottom: '1.25rem' }}>
                    <p style={{ color: '#b794f4', fontSize: '0.85rem', fontStyle: 'italic', margin: 0 }}>⚡ {report.energyForecast}</p>
                  </div>
                )}

                <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                  <button onClick={saveReport} style={{ padding: '0.5rem 1.25rem', borderRadius: '0.75rem', cursor: 'pointer', background: 'rgba(201,168,76,0.15)', border: '1px solid rgba(201,168,76,0.3)', color: '#c9a84c', fontSize: '0.82rem', fontWeight: 600 }}>💾 Save Report</button>
                  <button onClick={generateReport} style={{ padding: '0.5rem 1.25rem', borderRadius: '0.75rem', cursor: 'pointer', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.5)', fontSize: '0.82rem' }}>🔄 Regenerate</button>
                  <span style={{ marginLeft: 'auto', color: 'rgba(255,255,255,0.25)', fontSize: '0.72rem', alignSelf: 'center' }}>Based on {filtered.length} sighting{filtered.length !== 1 ? 's' : ''}</span>
                </div>
              </div>

              {/* Number breakdown */}
              {breakdown.length > 0 && (
                <div style={{ background: 'rgba(8,6,28,0.85)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '1.25rem', padding: '1.5rem', backdropFilter: 'blur(10px)', marginBottom: '1rem' }}>
                  <h3 style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1rem' }}>🔢 Number Breakdown</h3>
                  {breakdown.map(([num, count]) => {
                    const color = getColor(num);
                    const pct = Math.round((count / filtered.length) * 100);
                    return (
                      <div key={num} style={{ marginBottom: '0.65rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                          <span style={{ color, fontSize: '0.85rem', fontWeight: 600 }}>{num}</span>
                          <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.75rem' }}>{count}x · {pct}%</span>
                        </div>
                        <div style={{ background: 'rgba(255,255,255,0.06)', borderRadius: '999px', height: '5px', overflow: 'hidden' }}>
                          <div style={{ height: '100%', width: `${pct}%`, background: color, borderRadius: '999px', opacity: 0.7 }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Daily rhythm */}
              <div style={{ background: 'rgba(8,6,28,0.85)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '1.25rem', padding: '1.5rem', backdropFilter: 'blur(10px)' }}>
                <h3 style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1rem' }}>📅 Daily Rhythm</h3>
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: '0.4rem', height: '70px' }}>
                  {dailyData.map((d, i) => (
                    <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.3rem' }}>
                      <div style={{
                        width: '100%', borderRadius: '3px 3px 0 0',
                        height: `${Math.max(3, (d.count / maxDay) * 50)}px`,
                        background: d.count > 0 ? 'linear-gradient(to top, #9b59b6, #9b59b688)' : 'rgba(255,255,255,0.05)',
                        border: d.count > 0 ? '1px solid rgba(155,89,182,0.3)' : '1px solid rgba(255,255,255,0.05)',
                      }} />
                      <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.62rem' }}>{d.day}</span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </>
      )}

      {activeTab === 'history' && (
        <div>
          {saved.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'rgba(255,255,255,0.3)' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>📚</div>
              <p>No saved reports yet. Generate and save your first cosmic synthesis!</p>
            </div>
          ) : (
            saved.map((s, i) => (
              <div key={i} style={{
                background: 'rgba(8,6,28,0.88)',
                border: `1px solid ${getColor(s.dominantNumber || '')}33`,
                borderRadius: '1.25rem', padding: '1.5rem', marginBottom: '0.75rem', backdropFilter: 'blur(10px)',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
                  <div>
                    <h3 style={{ color: getColor(s.dominantNumber || ''), fontSize: '1rem', fontWeight: 700, margin: 0 }}>✺ {s.title}</h3>
                    <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.72rem', margin: '0.2rem 0 0' }}>
                      {new Date(s.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} · {s.logCount} sightings
                    </p>
                  </div>
                  <span style={{ padding: '0.2rem 0.6rem', borderRadius: '999px', fontSize: '0.68rem', background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.3)' }}>{s.period}</span>
                </div>
                <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.85rem', lineHeight: 1.7, margin: '0 0 0.75rem' }}>
                  {s.narrative?.slice(0, 180)}...
                </p>
                {s.affirmation && (
                  <p style={{ color: getColor(s.dominantNumber || ''), fontSize: '0.82rem', fontStyle: 'italic', margin: 0 }}>
                    &ldquo;{s.affirmation}&rdquo;
                  </p>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}

export default function SynthesisPage() {
  return (
    <FeatureGate feature="weekly-synthesis" requiredTier="mystic">
      <SynthesisPageInner />
    </FeatureGate>
  );
}
