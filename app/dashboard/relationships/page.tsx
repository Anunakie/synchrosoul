'use client';
import { useState, useEffect } from 'react';

const CONNECTION_TYPES = [
  { id: 'twin-flame', label: 'Twin Flame', emoji: '🔥', color: '#ef4444', description: 'The mirror of your soul. Intense, transformative, often challenging. Designed to accelerate your spiritual growth.' },
  { id: 'soulmate', label: 'Soulmate', emoji: '💞', color: '#ec4899', description: 'A soul you have loved across many lifetimes. Comfortable, deep, nurturing. They feel like home.' },
  { id: 'karmic', label: 'Karmic Bond', emoji: '⚖️', color: '#f97316', description: 'A connection to resolve past-life karma. Intense lessons, often painful, but necessary for soul growth.' },
  { id: 'soul-family', label: 'Soul Family', emoji: '🌟', color: '#c9a84c', description: 'Souls from your spiritual family. Friends, mentors, or family members who feel instantly familiar.' },
  { id: 'catalyst', label: 'Catalyst Soul', emoji: '⚡', color: '#8b5cf6', description: 'Someone who enters briefly but changes everything. A divine appointment to shift your path.' },
];

const ANGEL_SIGNS = [
  { number: '111', meaning: 'New soul connection incoming. Stay open and aware.' },
  { number: '222', meaning: 'Your connection is divinely timed. Trust the process.' },
  { number: '333', meaning: 'Ascended Masters are guiding this relationship.' },
  { number: '444', meaning: 'This connection is protected and blessed by angels.' },
  { number: '555', meaning: 'A major change in your love life is coming.' },
  { number: '777', meaning: 'This is a spiritually significant soul connection.' },
  { number: '1111', meaning: 'Twin flame or soulmate energy is very near.' },
  { number: '1212', meaning: 'You are aligned with your soul mission partner.' },
  { number: '2222', meaning: 'Divine partnership is being built. Be patient.' },
];

interface Connection {
  id: string;
  name: string;
  type: string;
  numbers: string;
  notes: string;
  createdAt: string;
}

export default function RelationshipsPage() {
  const [connections, setConnections] = useState<Connection[]>([]);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ name: '', type: 'soulmate', numbers: '', notes: '' });
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('synchrosoul_connections') || '[]');
      setConnections(saved);
    } catch {}
  }, []);

  const save = (conns: Connection[]) => {
    setConnections(conns);
    localStorage.setItem('synchrosoul_connections', JSON.stringify(conns));
  };

  const addConnection = () => {
    if (!form.name.trim()) return;
    const newConn: Connection = { ...form, id: Date.now().toString(), createdAt: new Date().toISOString() };
    save([...connections, newConn]);
    setForm({ name: '', type: 'soulmate', numbers: '', notes: '' });
    setShowAdd(false);
  };

  const deleteConnection = (id: string) => {
    save(connections.filter(c => c.id !== id));
    if (selected === id) setSelected(null);
  };

  const selectedConn = connections.find(c => c.id === selected);
  const selectedType = selectedConn ? CONNECTION_TYPES.find(t => t.id === selectedConn.type) : null;

  return (
    <div style={{ minHeight: '100vh', padding: '2rem 1rem', maxWidth: '700px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 700, color: '#ec4899', fontFamily: 'Cormorant Garamond, serif' }}>Soul Connections</h1>
        <p style={{ color: 'rgba(255,255,255,0.4)', marginTop: '0.25rem' }}>Map the sacred souls in your journey</p>
      </div>

      {/* Connection types guide */}
      <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
        {CONNECTION_TYPES.map(t => (
          <div key={t.id} style={{ background: `${t.color}10`, border: `1px solid ${t.color}20`, borderRadius: '999px', padding: '0.3rem 0.75rem', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <span style={{ fontSize: '0.9rem' }}>{t.emoji}</span>
            <span style={{ color: t.color, fontSize: '0.72rem', fontWeight: 600 }}>{t.label}</span>
          </div>
        ))}
      </div>

      {/* Add connection */}
      <button onClick={() => setShowAdd(!showAdd)} style={{
        width: '100%', padding: '0.875rem', borderRadius: '1.25rem',
        background: showAdd ? 'rgba(236,72,153,0.12)' : 'rgba(255,255,255,0.04)',
        border: showAdd ? '1px solid rgba(236,72,153,0.3)' : '1px solid rgba(255,255,255,0.1)',
        color: showAdd ? '#ec4899' : 'rgba(255,255,255,0.5)', cursor: 'pointer',
        fontSize: '0.9rem', fontWeight: 600, marginBottom: '1rem'
      }}>{showAdd ? '✕ Cancel' : '+ Add Soul Connection'}</button>

      {showAdd && (
        <div style={{ background: 'rgba(8,6,28,0.92)', borderRadius: '1.5rem', border: '1px solid rgba(236,72,153,0.2)', padding: '1.25rem', backdropFilter: 'blur(12px)', marginBottom: '1rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <input value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))}
              placeholder="Their name or initials..."
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.875rem', padding: '0.75rem 1rem', color: '#fff', fontSize: '0.9rem', outline: 'none', width: '100%', boxSizing: 'border-box' }} />
            <select value={form.type} onChange={e => setForm(f => ({...f, type: e.target.value}))}
              style={{ background: 'rgba(8,6,28,0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.875rem', padding: '0.75rem 1rem', color: '#fff', fontSize: '0.9rem', outline: 'none', width: '100%', boxSizing: 'border-box' }}>
              {CONNECTION_TYPES.map(t => <option key={t.id} value={t.id}>{t.emoji} {t.label}</option>)}
            </select>
            <input value={form.numbers} onChange={e => setForm(f => ({...f, numbers: e.target.value}))}
              placeholder="Angel numbers you see around them (e.g. 1111, 222)..."
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.875rem', padding: '0.75rem 1rem', color: '#fff', fontSize: '0.9rem', outline: 'none', width: '100%', boxSizing: 'border-box' }} />
            <textarea value={form.notes} onChange={e => setForm(f => ({...f, notes: e.target.value}))}
              placeholder="Notes about this connection..."
              rows={3}
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.875rem', padding: '0.75rem 1rem', color: '#fff', fontSize: '0.9rem', outline: 'none', width: '100%', boxSizing: 'border-box', resize: 'vertical' }} />
            <button onClick={addConnection} style={{ padding: '0.75rem', borderRadius: '999px', background: 'rgba(236,72,153,0.2)', border: '1px solid rgba(236,72,153,0.4)', color: '#ec4899', cursor: 'pointer', fontWeight: 700 }}>Save Connection 💞</button>
          </div>
        </div>
      )}

      {/* Connections list */}
      {connections.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'rgba(255,255,255,0.3)' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>💞</div>
          <p style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.1rem' }}>No soul connections mapped yet</p>
          <p style={{ fontSize: '0.82rem', marginTop: '0.5rem' }}>Add the sacred souls in your journey</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', marginBottom: '1.5rem' }}>
          {connections.map(conn => {
            const type = CONNECTION_TYPES.find(t => t.id === conn.type)!;
            return (
              <div key={conn.id} onClick={() => setSelected(selected === conn.id ? null : conn.id)} style={{
                background: selected === conn.id ? `${type.color}10` : 'rgba(8,6,28,0.88)',
                borderRadius: '1.25rem',
                border: selected === conn.id ? `1px solid ${type.color}30` : '1px solid rgba(255,255,255,0.07)',
                padding: '1rem 1.25rem', cursor: 'pointer', backdropFilter: 'blur(12px)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: `${type.color}15`, border: `1px solid ${type.color}25`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', flexShrink: 0 }}>{type.emoji}</div>
                  <div style={{ flex: 1 }}>
                    <p style={{ color: '#fff', fontWeight: 700, fontSize: '0.95rem' }}>{conn.name}</p>
                    <p style={{ color: type.color, fontSize: '0.75rem' }}>{type.label}</p>
                  </div>
                  {conn.numbers && <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap' }}>
                    {conn.numbers.split(',').slice(0,2).map(n => (
                      <span key={n} style={{ background: `${type.color}12`, border: `1px solid ${type.color}20`, borderRadius: '999px', padding: '0.15rem 0.4rem', fontSize: '0.65rem', color: type.color }}>{n.trim()}</span>
                    ))}
                  </div>}
                  <button onClick={e => { e.stopPropagation(); deleteConnection(conn.id); }} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.2)', cursor: 'pointer', fontSize: '0.9rem', padding: '0.25rem' }}>✕</button>
                </div>
                {selected === conn.id && conn.notes && (
                  <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.85rem', lineHeight: 1.6, marginTop: '0.875rem', paddingTop: '0.875rem', borderTop: '1px solid rgba(255,255,255,0.06)' }}>{conn.notes}</p>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Angel number signs for love */}
      <div style={{ background: 'rgba(8,6,28,0.88)', borderRadius: '1.5rem', border: '1px solid rgba(255,255,255,0.08)', padding: '1.25rem', backdropFilter: 'blur(12px)' }}>
        <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1rem' }}>Angel Signs in Love</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {ANGEL_SIGNS.map(s => (
            <div key={s.number} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.875rem', padding: '0.5rem 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
              <span style={{ color: '#ec4899', fontWeight: 800, fontFamily: 'Cormorant Garamond, serif', fontSize: '0.95rem', minWidth: '40px' }}>{s.number}</span>
              <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '0.82rem', lineHeight: 1.5 }}>{s.meaning}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}