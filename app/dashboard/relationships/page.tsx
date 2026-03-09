'use client';
import { useState, useEffect } from 'react';
import { calcLifePath, calcSoulUrge, calcDestiny } from '@/lib/numerology';

interface Connection {
  id: string;
  name: string;
  birthdate: string;
  relationship: string;
  notes: string;
  lifePath: number;
  soulUrge: number;
  destiny: number;
  syncScore: number;
  addedAt: string;
}

const RELATIONSHIP_TYPES = ['Partner', 'Twin Flame', 'Soul Mate', 'Friend', 'Family', 'Mentor', 'Colleague'];

const COMPATIBILITY: Record<string, number> = {
  '1-1':70,'1-2':85,'1-3':90,'1-4':65,'1-5':88,'1-6':72,'1-7':78,'1-8':82,'1-9':75,
  '2-2':80,'2-3':85,'2-4':90,'2-5':70,'2-6':95,'2-7':82,'2-8':68,'2-9':88,
  '3-3':75,'3-4':70,'3-5':92,'3-6':85,'3-7':78,'3-8':72,'3-9':88,
  '4-4':85,'4-5':65,'4-6':90,'4-7':88,'4-8':95,'4-9':70,
  '5-5':72,'5-6':78,'5-7':85,'5-8':80,'5-9':82,
  '6-6':90,'6-7':75,'6-8':85,'6-9':92,
  '7-7':80,'7-8':78,'7-9':88,
  '8-8':75,'8-9':72,
  '9-9':85,
};

function getCompatibility(a: number, b: number): number {
  const key = [Math.min(a,b), Math.max(a,b)].join('-');
  return COMPATIBILITY[key] || 75;
}

const SYNC_LABELS = [
  { min: 90, label: 'Twin Flame', color: '#f472b6', emoji: '🔥' },
  { min: 80, label: 'Soul Mate', color: '#c9a84c', emoji: '✨' },
  { min: 70, label: 'Karmic Bond', color: '#a78bfa', emoji: '⚡' },
  { min: 0, label: 'Soul Contract', color: '#60a5fa', emoji: '🌊' },
];

function getSyncLabel(score: number) {
  return SYNC_LABELS.find(s => score >= s.min) || SYNC_LABELS[SYNC_LABELS.length - 1];
}

const KEY = 'synchrosoul_connections';

export default function RelationshipsPage() {
  const [connections, setConnections] = useState<Connection[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', birthdate: '', relationship: 'Partner', notes: '' });
  const [myProfile, setMyProfile] = useState<any>(null);
  const [selected, setSelected] = useState<Connection | null>(null);

  useEffect(() => {
    try {
      setConnections(JSON.parse(localStorage.getItem(KEY) || '[]'));
      setMyProfile(JSON.parse(localStorage.getItem('synchrosoul_numerology_profile') || 'null'));
    } catch {}
  }, []);

  const addConnection = () => {
    if (!form.name || !form.birthdate) return;
    const lp = calcLifePath(form.birthdate);
    const su = calcSoulUrge(form.name);
    const de = calcDestiny(form.name);
    const myLp = myProfile ? calcLifePath(myProfile.birthdate) : 5;
    const syncScore = getCompatibility(myLp, lp);
    const conn: Connection = {
      id: Date.now().toString(),
      name: form.name, birthdate: form.birthdate,
      relationship: form.relationship, notes: form.notes,
      lifePath: lp, soulUrge: su, destiny: de,
      syncScore, addedAt: new Date().toISOString()
    };
    const updated = [conn, ...connections];
    setConnections(updated);
    localStorage.setItem(KEY, JSON.stringify(updated));
    setForm({ name: '', birthdate: '', relationship: 'Partner', notes: '' });
    setShowForm(false);
  };

  const removeConnection = (id: string) => {
    const updated = connections.filter(c => c.id !== id);
    setConnections(updated);
    localStorage.setItem(KEY, JSON.stringify(updated));
    if (selected?.id === id) setSelected(null);
  };

  return (
    <div style={{ minHeight: '100vh', padding: '2rem 1rem', maxWidth: '700px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 700, color: '#f472b6', fontFamily: 'Cormorant Garamond, serif' }}>Soul Connections</h1>
        <p style={{ color: 'rgba(255,255,255,0.5)', marginTop: '0.5rem' }}>Track the numerological bonds in your life</p>
      </div>

      {/* Add Button */}
      <button onClick={() => setShowForm(s => !s)} style={{
        width: '100%', padding: '0.875rem', borderRadius: '999px', cursor: 'pointer',
        background: showForm ? 'rgba(255,255,255,0.06)' : 'linear-gradient(135deg, #f472b6, #8b5cf6)',
        color: '#fff', border: 'none', fontSize: '0.95rem', fontWeight: 700, marginBottom: '1.25rem'
      }}>{showForm ? '✕ Cancel' : '+ Add Soul Connection'}</button>

      {/* Add Form */}
      {showForm && (
        <div style={{
          background: 'rgba(8,6,28,0.92)', borderRadius: '1.5rem',
          border: '1px solid rgba(244,114,182,0.25)', padding: '1.5rem',
          backdropFilter: 'blur(12px)', marginBottom: '1.25rem'
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
            <div>
              <label style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: '0.35rem' }}>Name</label>
              <input value={form.name} onChange={e => setForm(f => ({...f, name: e.target.value}))} placeholder="Their full name"
                style={{ width: '100%', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '0.75rem', padding: '0.6rem 0.875rem', color: '#fff', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box' }} />
            </div>
            <div>
              <label style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: '0.35rem' }}>Birthdate</label>
              <input type="date" value={form.birthdate} onChange={e => setForm(f => ({...f, birthdate: e.target.value}))}
                style={{ width: '100%', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '0.75rem', padding: '0.6rem 0.875rem', color: '#fff', fontSize: '0.9rem', outline: 'none', boxSizing: 'border-box', colorScheme: 'dark' }} />
            </div>
          </div>
          <div style={{ marginBottom: '0.75rem' }}>
            <label style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.1em', display: 'block', marginBottom: '0.35rem' }}>Relationship Type</label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
              {RELATIONSHIP_TYPES.map(t => (
                <button key={t} onClick={() => setForm(f => ({...f, relationship: t}))} style={{
                  padding: '0.3rem 0.75rem', borderRadius: '999px', cursor: 'pointer', fontSize: '0.78rem',
                  background: form.relationship === t ? 'rgba(244,114,182,0.2)' : 'rgba(255,255,255,0.05)',
                  border: form.relationship === t ? '1px solid rgba(244,114,182,0.5)' : '1px solid rgba(255,255,255,0.1)',
                  color: form.relationship === t ? '#f472b6' : 'rgba(255,255,255,0.5)'
                }}>{t}</button>
              ))}
            </div>
          </div>
          <textarea value={form.notes} onChange={e => setForm(f => ({...f, notes: e.target.value}))} placeholder="Notes about this connection (optional)" rows={2}
            style={{ width: '100%', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '0.75rem', padding: '0.6rem 0.875rem', color: '#fff', fontSize: '0.85rem', outline: 'none', resize: 'none', boxSizing: 'border-box', marginBottom: '0.75rem' }} />
          <button onClick={addConnection} disabled={!form.name || !form.birthdate} style={{
            width: '100%', padding: '0.75rem', borderRadius: '999px', cursor: 'pointer',
            background: form.name && form.birthdate ? 'linear-gradient(135deg, #f472b6, #8b5cf6)' : 'rgba(255,255,255,0.06)',
            color: form.name && form.birthdate ? '#fff' : 'rgba(255,255,255,0.3)',
            border: 'none', fontSize: '0.9rem', fontWeight: 700
          }}>Calculate Soul Bond</button>
        </div>
      )}

      {/* Connections List */}
      {connections.length === 0 && !showForm && (
        <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'rgba(255,255,255,0.3)' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>💞</div>
          <p style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.1rem' }}>No soul connections yet</p>
          <p style={{ fontSize: '0.85rem', marginTop: '0.5rem' }}>Add someone to discover your numerological bond</p>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
        {connections.map(conn => {
          const syncInfo = getSyncLabel(conn.syncScore);
          const isSelected = selected?.id === conn.id;
          return (
            <div key={conn.id} style={{
              background: 'rgba(8,6,28,0.88)', borderRadius: '1.5rem',
              border: `1px solid ${syncInfo.color}30`, padding: '1.25rem',
              backdropFilter: 'blur(12px)', cursor: 'pointer'
            }} onClick={() => setSelected(isSelected ? null : conn)}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
                <div style={{
                  width: '48px', height: '48px', borderRadius: '50%', flexShrink: 0,
                  background: `${syncInfo.color}20`, border: `1px solid ${syncInfo.color}40`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1.4rem', fontWeight: 800, color: syncInfo.color,
                  fontFamily: 'Cormorant Garamond, serif'
                }}>{conn.lifePath}</div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.2rem' }}>
                    <span style={{ color: '#fff', fontWeight: 700, fontSize: '1rem' }}>{conn.name}</span>
                    <span style={{ background: `${syncInfo.color}20`, border: `1px solid ${syncInfo.color}30`, borderRadius: '999px', padding: '0.1rem 0.5rem', fontSize: '0.65rem', color: syncInfo.color }}>{conn.relationship}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.78rem' }}>Life Path {conn.lifePath}</span>
                    <span style={{ color: syncInfo.color, fontSize: '0.78rem', fontWeight: 700 }}>{syncInfo.emoji} {syncInfo.label}</span>
                  </div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: syncInfo.color, fontFamily: 'Cormorant Garamond, serif', lineHeight: 1 }}>{conn.syncScore}%</div>
                  <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.65rem' }}>Sync</div>
                </div>
              </div>

              {isSelected && (
                <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '0.5rem', marginBottom: '0.875rem' }}>
                    {[{label:'Life Path', val:conn.lifePath},{label:'Soul Urge', val:conn.soulUrge},{label:'Destiny', val:conn.destiny}].map(n => (
                      <div key={n.label} style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '0.75rem', padding: '0.6rem', textAlign: 'center' }}>
                        <div style={{ color: syncInfo.color, fontSize: '1.25rem', fontWeight: 800, fontFamily: 'Cormorant Garamond, serif' }}>{n.val}</div>
                        <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{n.label}</div>
                      </div>
                    ))}
                  </div>
                  {conn.notes && <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.82rem', fontStyle: 'italic', marginBottom: '0.75rem' }}>{conn.notes}</p>}
                  <button onClick={e => { e.stopPropagation(); removeConnection(conn.id); }} style={{
                    padding: '0.4rem 1rem', borderRadius: '999px', cursor: 'pointer', fontSize: '0.75rem',
                    background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', color: '#ef4444'
                  }}>Remove Connection</button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}