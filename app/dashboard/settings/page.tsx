'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

interface Settings {
  displayName: string;
  theme: string;
  dailyReminder: boolean;
  reminderTime: string;
  showStreak: boolean;
  privateJournal: boolean;
  soundEnabled: boolean;
  hapticEnabled: boolean;
  language: string;
  timezone: string;
}

const DEFAULT_SETTINGS: Settings = {
  displayName: '',
  theme: 'cosmos',
  dailyReminder: true,
  reminderTime: '09:00',
  showStreak: true,
  privateJournal: true,
  soundEnabled: true,
  hapticEnabled: true,
  language: 'en',
  timezone: 'auto',
};

const KEY = 'synchrosoul_settings';

export default function SettingsPage() {
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [saved, setSaved] = useState(false);
  const [dataStats, setDataStats] = useState({ logs: 0, dreams: 0, posts: 0 });
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  useEffect(() => {
    try {
      const s = JSON.parse(localStorage.getItem(KEY) || 'null');
      if (s) setSettings({ ...DEFAULT_SETTINGS, ...s });
      setDataStats({
        logs: JSON.parse(localStorage.getItem('synchrosoul_logs') || '[]').length,
        dreams: JSON.parse(localStorage.getItem('synchrosoul_dreams') || '[]').length,
        posts: JSON.parse(localStorage.getItem('synchrosoul_posts') || '[]').length,
      });
    } catch {}
  }, []);

  const update = (key: keyof Settings, value: any) => {
    setSettings(s => ({ ...s, [key]: value }));
  };

  const save = () => {
    try { localStorage.setItem(KEY, JSON.stringify(settings)); } catch {}
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const clearData = (type: string) => {
    const keys: Record<string, string> = {
      logs: 'synchrosoul_logs',
      dreams: 'synchrosoul_dreams',
      posts: 'synchrosoul_posts',
      all: ''
    };
    if (type === 'all') {
      ['synchrosoul_logs','synchrosoul_dreams','synchrosoul_posts','synchrosoul_numerology_profile','synchrosoul_connections','synchrosoul_manifestations','synchrosoul_vision_board','synchrosoul_gratitude'].forEach(k => localStorage.removeItem(k));
    } else {
      localStorage.removeItem(keys[type]);
    }
    setDataStats({
      logs: JSON.parse(localStorage.getItem('synchrosoul_logs') || '[]').length,
      dreams: JSON.parse(localStorage.getItem('synchrosoul_dreams') || '[]').length,
      posts: JSON.parse(localStorage.getItem('synchrosoul_posts') || '[]').length,
    });
    setShowClearConfirm(false);
  };

  const Toggle = ({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) => (
    <button onClick={() => onChange(!value)} style={{
      width: '44px', height: '24px', borderRadius: '999px', border: 'none', cursor: 'pointer',
      background: value ? '#c9a84c' : 'rgba(255,255,255,0.12)',
      position: 'relative', transition: 'background 0.2s', flexShrink: 0
    }}>
      <div style={{
        position: 'absolute', top: '2px', left: value ? '22px' : '2px',
        width: '20px', height: '20px', borderRadius: '50%', background: '#fff',
        transition: 'left 0.2s', boxShadow: '0 1px 3px rgba(0,0,0,0.3)'
      }} />
    </button>
  );

  const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
    <div style={{ background: 'rgba(8,6,28,0.88)', borderRadius: '1.5rem', border: '1px solid rgba(255,255,255,0.08)', padding: '1.25rem', backdropFilter: 'blur(12px)', marginBottom: '1rem' }}>
      <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.12em', marginBottom: '1rem' }}>{title}</p>
      {children}
    </div>
  );

  const Row = ({ label, sub, children }: { label: string; sub?: string; children: React.ReactNode }) => (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.6rem 0', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
      <div>
        <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem' }}>{label}</p>
        {sub && <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.75rem', marginTop: '0.1rem' }}>{sub}</p>}
      </div>
      {children}
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', padding: '2rem 1rem', maxWidth: '600px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 700, color: '#fff', fontFamily: 'Cormorant Garamond, serif' }}>Settings</h1>
      </div>

      <Section title="Profile">
        <Row label="Display Name" sub="Shown on your profile and posts">
          <input value={settings.displayName} onChange={e => update('displayName', e.target.value)}
            placeholder="Your name"
            style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.5rem', padding: '0.4rem 0.75rem', color: '#fff', fontSize: '0.85rem', outline: 'none', width: '140px', textAlign: 'right' }} />
        </Row>
        <Row label="Numerology Profile">
          <Link href="/dashboard/onboarding" style={{ color: '#c9a84c', fontSize: '0.82rem', textDecoration: 'none' }}>Edit →</Link>
        </Row>
        <Row label="Profile Card">
          <Link href="/dashboard/profile-card" style={{ color: '#c9a84c', fontSize: '0.82rem', textDecoration: 'none' }}>View →</Link>
        </Row>
      </Section>

      <Section title="Notifications">
        <Row label="Daily Reminder" sub="Get reminded to log your numbers">
          <Toggle value={settings.dailyReminder} onChange={v => update('dailyReminder', v)} />
        </Row>
        {settings.dailyReminder && (
          <Row label="Reminder Time">
            <input type="time" value={settings.reminderTime} onChange={e => update('reminderTime', e.target.value)}
              style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.5rem', padding: '0.4rem 0.75rem', color: '#fff', fontSize: '0.85rem', outline: 'none', colorScheme: 'dark' }} />
          </Row>
        )}
      </Section>

      <Section title="Appearance">
        <Row label="Show Streak" sub="Display streak counter on dashboard">
          <Toggle value={settings.showStreak} onChange={v => update('showStreak', v)} />
        </Row>
        <Row label="Sound Effects">
          <Toggle value={settings.soundEnabled} onChange={v => update('soundEnabled', v)} />
        </Row>
        <Row label="Haptic Feedback">
          <Toggle value={settings.hapticEnabled} onChange={v => update('hapticEnabled', v)} />
        </Row>
      </Section>

      <Section title="Privacy">
        <Row label="Private Journal" sub="Journal entries are never shared">
          <Toggle value={settings.privateJournal} onChange={v => update('privateJournal', v)} />
        </Row>
      </Section>

      <Section title="Your Data">
        <Row label="Angel Number Logs" sub={`${dataStats.logs} entries`}>
          <button onClick={() => clearData('logs')} style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '999px', padding: '0.3rem 0.75rem', color: '#ef4444', fontSize: '0.75rem', cursor: 'pointer' }}>Clear</button>
        </Row>
        <Row label="Dream Journal" sub={`${dataStats.dreams} entries`}>
          <button onClick={() => clearData('dreams')} style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '999px', padding: '0.3rem 0.75rem', color: '#ef4444', fontSize: '0.75rem', cursor: 'pointer' }}>Clear</button>
        </Row>
        <Row label="Social Posts" sub={`${dataStats.posts} posts`}>
          <button onClick={() => clearData('posts')} style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '999px', padding: '0.3rem 0.75rem', color: '#ef4444', fontSize: '0.75rem', cursor: 'pointer' }}>Clear</button>
        </Row>
        {!showClearConfirm ? (
          <div style={{ marginTop: '0.75rem' }}>
            <button onClick={() => setShowClearConfirm(true)} style={{ width: '100%', padding: '0.6rem', borderRadius: '0.75rem', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.15)', color: 'rgba(239,68,68,0.7)', fontSize: '0.82rem', cursor: 'pointer' }}>Clear All Data</button>
          </div>
        ) : (
          <div style={{ marginTop: '0.75rem', background: 'rgba(239,68,68,0.08)', borderRadius: '0.875rem', padding: '0.875rem', border: '1px solid rgba(239,68,68,0.2)' }}>
            <p style={{ color: '#ef4444', fontSize: '0.85rem', marginBottom: '0.75rem', textAlign: 'center' }}>This will delete all your data permanently. Are you sure?</p>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button onClick={() => setShowClearConfirm(false)} style={{ flex: 1, padding: '0.5rem', borderRadius: '0.75rem', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.5)', fontSize: '0.82rem', cursor: 'pointer' }}>Cancel</button>
              <button onClick={() => clearData('all')} style={{ flex: 1, padding: '0.5rem', borderRadius: '0.75rem', background: 'rgba(239,68,68,0.2)', border: '1px solid rgba(239,68,68,0.3)', color: '#ef4444', fontSize: '0.82rem', cursor: 'pointer', fontWeight: 700 }}>Delete All</button>
            </div>
          </div>
        )}
      </Section>

      <Section title="About">
        <Row label="Version"><span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.82rem' }}>1.0.0</span></Row>
        <Row label="Upgrade to Premium">
          <Link href="/dashboard/upgrade" style={{ color: '#c9a84c', fontSize: '0.82rem', textDecoration: 'none' }}>View Plans →</Link>
        </Row>
      </Section>

      {/* Save Button */}
      <button onClick={save} style={{
        width: '100%', padding: '1rem', borderRadius: '999px', cursor: 'pointer',
        background: saved ? 'rgba(74,222,128,0.2)' : 'linear-gradient(135deg, #c9a84c, #8b5cf6)',
        color: saved ? '#4ade80' : '#fff', border: saved ? '1px solid rgba(74,222,128,0.3)' : 'none',
        fontSize: '1rem', fontWeight: 700, transition: 'all 0.3s', marginBottom: '2rem'
      }}>{saved ? '✓ Saved!' : 'Save Settings'}</button>
    </div>
  );
}