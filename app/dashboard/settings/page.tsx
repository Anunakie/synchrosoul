'use client';
import { useState, useEffect } from 'react';

const DEFAULTS = {
  displayName: '',
  dailyReminder: true,
  reminderTime: '09:00',
  streakAlerts: true,
  matchAlerts: true,
  moonAlerts: false,
  soundEnabled: true,
  hapticEnabled: true,
  privateMode: false,
  shareJournal: false,
  theme: 'cosmos',
  language: 'en',
  exportFormat: 'json',
};

export default function SettingsPage() {
  const [s, setS] = useState(DEFAULTS);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('synchrosoul_settings') || '{}');
      setS({ ...DEFAULTS, ...stored });
    } catch {}
  }, []);

  const update = (key: string, val: any) => setS(prev => ({ ...prev, [key]: val }));

  const save = () => {
    localStorage.setItem('synchrosoul_settings', JSON.stringify(s));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const exportData = () => {
    const data = {
      logs: JSON.parse(localStorage.getItem('synchrosoul_logs') || '[]'),
      dreams: JSON.parse(localStorage.getItem('synchrosoul_dreams') || '[]'),
      profile: JSON.parse(localStorage.getItem('synchrosoul_profile') || '{}'),
      settings: s,
      exportedAt: new Date().toISOString(),
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'synchrosoul-export.json'; a.click();
    URL.revokeObjectURL(url);
  };

  const clearData = () => {
    if (confirm('Clear ALL your SynchroSoul data? This cannot be undone.')) {
      ['synchrosoul_logs','synchrosoul_dreams','synchrosoul_profile','synchrosoul_settings',
       'synchrosoul_social_profile','synchrosoul_posts','synchrosoul_avatar_image'].forEach(k => localStorage.removeItem(k));
      setS(DEFAULTS);
      alert('All data cleared.');
    }
  };

  const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div style={{ background: 'rgba(8,6,28,0.88)', borderRadius: '1.5rem', border: '1px solid rgba(255,255,255,0.07)', padding: '1.25rem', backdropFilter: 'blur(12px)', marginBottom: '0.75rem' }}>
      <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '1rem' }}>{title}</p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>{children}</div>
    </div>
  );

  const Toggle = ({ label, desc, val, onChange }: { label: string; desc?: string; val: boolean; onChange: (v: boolean) => void }) => (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
      <div>
        <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.88rem', fontWeight: 500 }}>{label}</p>
        {desc && <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.72rem', marginTop: '0.1rem' }}>{desc}</p>}
      </div>
      <button onClick={() => onChange(!val)} style={{ width: '44px', height: '24px', borderRadius: '999px', border: 'none', cursor: 'pointer', background: val ? 'rgba(201,168,76,0.6)' : 'rgba(255,255,255,0.1)', position: 'relative', flexShrink: 0, transition: 'background 0.2s' }}>
        <div style={{ position: 'absolute', top: '3px', left: val ? '23px' : '3px', width: '18px', height: '18px', borderRadius: '50%', background: val ? '#c9a84c' : 'rgba(255,255,255,0.4)', transition: 'left 0.2s' }} />
      </button>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', padding: '2rem 1rem', maxWidth: '700px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 700, color: '#c9a84c', fontFamily: 'Cormorant Garamond, serif' }}>Settings</h1>
        <p style={{ color: 'rgba(255,255,255,0.4)', marginTop: '0.25rem' }}>Customize your SynchroSoul experience</p>
      </div>

      <Section title="Profile">
        <div>
          <label style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.72rem', display: 'block', marginBottom: '0.35rem' }}>Display Name</label>
          <input value={s.displayName} onChange={e => update('displayName', e.target.value)} placeholder="Your spiritual name..." style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.75rem', padding: '0.625rem 0.875rem', color: '#fff', fontSize: '0.88rem', outline: 'none', boxSizing: 'border-box' }} />
        </div>
      </Section>

      <Section title="Notifications">
        <Toggle label="Daily Reminder" desc="Get a gentle nudge to log your numbers" val={s.dailyReminder} onChange={v => update('dailyReminder', v)} />
        {s.dailyReminder && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem' }}>Reminder Time</p>
            <input type="time" value={s.reminderTime} onChange={e => update('reminderTime', e.target.value)} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.5rem', padding: '0.35rem 0.625rem', color: '#fff', fontSize: '0.85rem', outline: 'none' }} />
          </div>
        )}
        <Toggle label="Streak Alerts" desc="Celebrate your logging streaks" val={s.streakAlerts} onChange={v => update('streakAlerts', v)} />
        <Toggle label="Sync Match Alerts" desc="Know when someone syncs with your numbers" val={s.matchAlerts} onChange={v => update('matchAlerts', v)} />
        <Toggle label="Moon Phase Alerts" desc="New and full moon reminders" val={s.moonAlerts} onChange={v => update('moonAlerts', v)} />
      </Section>

      <Section title="Experience">
        <Toggle label="Sound Effects" val={s.soundEnabled} onChange={v => update('soundEnabled', v)} />
        <Toggle label="Haptic Feedback" val={s.hapticEnabled} onChange={v => update('hapticEnabled', v)} />
      </Section>

      <Section title="Privacy">
        <Toggle label="Private Mode" desc="Hide your profile from sync matching" val={s.privateMode} onChange={v => update('privateMode', v)} />
        <Toggle label="Share Journal Entries" desc="Allow matched souls to see shared entries" val={s.shareJournal} onChange={v => update('shareJournal', v)} />
      </Section>

      <Section title="Data">
        <button onClick={exportData} style={{ width: '100%', padding: '0.75rem', background: 'rgba(34,211,238,0.1)', border: '1px solid rgba(34,211,238,0.2)', borderRadius: '0.875rem', color: '#22d3ee', cursor: 'pointer', fontSize: '0.88rem', fontWeight: 600 }}>Export My Data (JSON)</button>
        <button onClick={clearData} style={{ width: '100%', padding: '0.75rem', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.15)', borderRadius: '0.875rem', color: '#ef4444', cursor: 'pointer', fontSize: '0.88rem', fontWeight: 600 }}>Clear All Data</button>
      </Section>

      <button onClick={save} style={{ width: '100%', padding: '0.875rem', background: saved ? 'rgba(34,197,94,0.2)' : 'linear-gradient(135deg,rgba(201,168,76,0.3),rgba(167,139,250,0.3))', border: saved ? '1px solid rgba(34,197,94,0.4)' : '1px solid rgba(201,168,76,0.3)', borderRadius: '1rem', color: saved ? '#22c55e' : '#c9a84c', cursor: 'pointer', fontSize: '1rem', fontWeight: 700, fontFamily: 'Cormorant Garamond, serif', letterSpacing: '0.05em', marginBottom: '2rem' }}>
        {saved ? '✓ Saved!' : 'Save Settings'}
      </button>
    </div>
  );
}
