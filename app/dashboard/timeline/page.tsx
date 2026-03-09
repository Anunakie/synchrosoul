'use client';
import { useState, useEffect } from 'react';

const angelMeanings: Record<string, { title: string; color: string; emoji: string }> = {
  '111': { title: 'Manifestation Portal', color: '#ffd700', emoji: '🌟' },
  '222': { title: 'Divine Balance', color: '#48bb78', emoji: '☯️' },
  '333': { title: 'Ascended Masters', color: '#ed8936', emoji: '🔺' },
  '444': { title: 'Angelic Protection', color: '#4299e1', emoji: '🛡️' },
  '555': { title: 'Major Change', color: '#9b59b6', emoji: '🌀' },
  '666': { title: 'Rebalance', color: '#e53e3e', emoji: '⚖️' },
  '777': { title: 'Divine Magic', color: '#c9a84c', emoji: '✨' },
  '888': { title: 'Infinite Abundance', color: '#f6ad55', emoji: '♾️' },
  '999': { title: 'Completion', color: '#fc8181', emoji: '🔄' },
  '1111': { title: 'Master Portal', color: '#ffd700', emoji: '🌠' },
  '000': { title: 'Divine Wholeness', color: '#b794f4', emoji: '⭕' },
  '1212': { title: 'Cosmic Alignment', color: '#76e4f7', emoji: '🎯' },
};

function getMeaning(num: string) {
  return angelMeanings[num] || { title: 'Sacred Message', color: '#c9a84c', emoji: '🔢' };
}

function groupByMonth(logs: any[]) {
  const groups: Record<string, any[]> = {};
  logs.forEach(log => {
    const d = new Date(log.createdAt || log.timestamp);
    const key = d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
    if (!groups[key]) groups[key] = [];
    groups[key].push(log);
  });
  return groups;
}

export default function TimelinePage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [dreams, setDreams] = useState<any[]>([]);
  const [manifests, setManifests] = useState<any[]>([]);
  const [filter, setFilter] = useState<'all'|'numbers'|'dreams'|'manifestations'>('all');
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    const l = localStorage.getItem('synchrosoul_logs');
    const d = localStorage.getItem('synchrosoul_dreams');
    const m = localStorage.getItem('synchrosoul_manifestations');
    if (l) setLogs(JSON.parse(l));
    if (d) setDreams(JSON.parse(d));
    if (m) setManifests(JSON.parse(m));
  }, []);

  const allEvents = [
    ...logs.map(l => ({ ...l, _type: 'number', _date: new Date(l.createdAt || l.timestamp) })),
    ...dreams.map(d => ({ ...d, _type: 'dream', _date: new Date(d.createdAt || d.timestamp) })),
    ...manifests.map(m => ({ ...m, _type: 'manifestation', _date: new Date(m.createdAt || m.updatedAt) })),
  ].sort((a, b) => b._date.getTime() - a._date.getTime());

  const filtered = filter === 'all' ? allEvents : allEvents.filter(e => {
    if (filter === 'numbers') return e._type === 'number';
    if (filter === 'dreams') return e._type === 'dream';
    if (filter === 'manifestations') return e._type === 'manifestation';
    return true;
  });

  const grouped = groupByMonth(filtered.map(e => ({ ...e, createdAt: e._date.toISOString() })));

  const typeIcon = { number: '🔢', dream: '🌙', manifestation: '🌱' };
  const typeColor = { number: '#c9a84c', dream: '#9b59b6', manifestation: '#48bb78' };

  return (
    <div style={{ minHeight: '100vh', padding: '2rem 1rem', maxWidth: '700px', margin: '0 auto' }}>
      <h1 style={{ textAlign: 'center', fontSize: '1.8rem', fontWeight: 700, color: '#e8d5b7', marginBottom: '0.5rem' }}>📅 Soul Timeline</h1>
      <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.5)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>Your complete spiritual journey in one view</p>

      <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', marginBottom: '2rem', flexWrap: 'wrap' }}>
        {(['all','numbers','dreams','manifestations'] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{ padding: '0.4rem 1rem', borderRadius: '999px', background: filter === f ? 'rgba(201,168,76,0.2)' : 'rgba(255,255,255,0.05)', border: filter === f ? '1px solid rgba(201,168,76,0.4)' : '1px solid rgba(255,255,255,0.08)', color: filter === f ? '#c9a84c' : 'rgba(255,255,255,0.5)', cursor: 'pointer', fontSize: '0.82rem', textTransform: 'capitalize' }}>
            {f === 'numbers' ? '🔢' : f === 'dreams' ? '🌙' : f === 'manifestations' ? '🌱' : '✨'} {f}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.4)', padding: '4rem 2rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🌌</div>
          <p>Your timeline is empty. Start logging angel numbers, dreams, and manifestations to see your journey unfold.</p>
        </div>
      ) : (
        Object.entries(grouped).map(([month, events]) => (
          <div key={month} style={{ marginBottom: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <div style={{ height: '1px', flex: 1, background: 'rgba(255,255,255,0.08)' }} />
              <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.1em', whiteSpace: 'nowrap' }}>{month}</span>
              <div style={{ height: '1px', flex: 1, background: 'rgba(255,255,255,0.08)' }} />
            </div>
            <div style={{ position: 'relative', paddingLeft: '2rem' }}>
              <div style={{ position: 'absolute', left: '0.6rem', top: 0, bottom: 0, width: '2px', background: 'linear-gradient(to bottom, rgba(201,168,76,0.4), rgba(201,168,76,0.05))' }} />
              {events.map((event: any, i: number) => {
                const id = event.id || i;
                const isOpen = expanded === String(id);
                const m = event._type === 'number' ? getMeaning(event.number) : null;
                const color = typeColor[event._type as keyof typeof typeColor];
                return (
                  <div key={i} style={{ position: 'relative', marginBottom: '0.75rem' }}>
                    <div style={{ position: 'absolute', left: '-1.65rem', top: '0.9rem', width: '10px', height: '10px', borderRadius: '50%', background: color, boxShadow: '0 0 8px ' + color + '88' }} />
                    <div onClick={() => setExpanded(isOpen ? null : String(id))} style={{ background: 'rgba(8,6,28,0.85)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '0.9rem', padding: '0.9rem 1rem', cursor: 'pointer', backdropFilter: 'blur(8px)' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <span style={{ fontSize: '1.2rem' }}>{event._type === 'number' ? (m?.emoji || '🔢') : event._type === 'dream' ? '🌙' : '🌱'}</span>
                        <div style={{ flex: 1 }}>
                          <div style={{ color: color, fontWeight: 600, fontSize: '0.9rem' }}>
                            {event._type === 'number' ? event.number + ' — ' + (m?.title || 'Angel Number') : event._type === 'dream' ? (event.title || 'Dream Entry') : (event.title || 'Manifestation')}
                          </div>
                          <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.75rem' }}>{event._date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</div>
                        </div>
                        {event.screenshotUrl && <span style={{ fontSize: '0.7rem', background: 'rgba(72,187,120,0.2)', color: '#48bb78', padding: '0.15rem 0.5rem', borderRadius: '999px', border: '1px solid rgba(72,187,120,0.3)' }}>✓ Verified</span>}
                        <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.8rem' }}>{isOpen ? '▲' : '▼'}</span>
                      </div>
                      {isOpen && event.thought && (
                        <div style={{ marginTop: '0.75rem', padding: '0.75rem', background: 'rgba(255,255,255,0.04)', borderRadius: '0.6rem', borderLeft: '2px solid ' + color }}>
                          <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.85rem', margin: 0, lineHeight: 1.6, fontStyle: 'italic' }}>“{event.thought}”</p>
                        </div>
                      )}
                      {isOpen && event.description && (
                        <div style={{ marginTop: '0.75rem', padding: '0.75rem', background: 'rgba(255,255,255,0.04)', borderRadius: '0.6rem' }}>
                          <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.85rem', margin: 0, lineHeight: 1.6 }}>{event.description}</p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))
      )}
    </div>
  );
}
