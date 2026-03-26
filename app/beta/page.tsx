'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function BetaPage() {
  const [form, setForm] = useState({ email: '', name: '', device: 'android', reason: '' });
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const [count, setCount] = useState<number | null>(null);

  useEffect(() => {
    fetch('/api/beta/signup')
      .then(r => r.json())
      .then(d => setCount(d.count))
      .catch(() => {});
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    try {
      const res = await fetch('/api/beta/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (!res.ok) {
        setStatus('error');
        setMessage(data.error || 'Something went wrong');
      } else {
        setStatus('success');
        setCount(c => (c || 0) + 1);
      }
    } catch {
      setStatus('error');
      setMessage('Network error. Please try again.');
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0d0a2e 0%, #1a0a3e 40%, #0d1a3e 100%)',
      color: '#e2d9f3',
      fontFamily: 'Georgia, serif',
      padding: '0',
      margin: '0'
    }}>
      {/* Stars background */}
      <div style={{ position: 'fixed', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
        {Array.from({ length: 60 }).map((_, i) => (
          <div key={i} style={{
            position: 'absolute',
            width: Math.random() * 3 + 1 + 'px',
            height: Math.random() * 3 + 1 + 'px',
            background: 'white',
            borderRadius: '50%',
            top: Math.random() * 100 + '%',
            left: Math.random() * 100 + '%',
            opacity: Math.random() * 0.7 + 0.3,
            animation: `twinkle ${Math.random() * 3 + 2}s ease-in-out infinite alternate`
          }} />
        ))}
      </div>

      <style>{`
        @keyframes twinkle { from { opacity: 0.3; } to { opacity: 1; } }
        @keyframes float { 0%,100% { transform: translateY(0); } 50% { transform: translateY(-10px); } }
        @keyframes pulse-gold { 0%,100% { box-shadow: 0 0 20px rgba(240,192,64,0.3); } 50% { box-shadow: 0 0 40px rgba(240,192,64,0.6); } }
      `}</style>

      <div style={{ position: 'relative', zIndex: 1, maxWidth: '680px', margin: '0 auto', padding: '40px 20px 80px' }}>
        
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <div style={{ fontSize: '56px', marginBottom: '12px', animation: 'float 4s ease-in-out infinite' }}>✨</div>
          <h1 style={{ color: '#f0c040', fontSize: '36px', margin: '0 0 8px', letterSpacing: '4px', fontWeight: 'normal' }}>SYNCHROSOUL</h1>
          <p style={{ color: '#a78bfa', margin: '0 0 16px', fontSize: '13px', letterSpacing: '4px' }}>BETA ACCESS</p>
          <h2 style={{ color: '#e2d9f3', fontSize: '22px', fontWeight: 'normal', margin: '0 0 16px', lineHeight: '1.4' }}>
            Be the first to experience<br />angel number synchronization
          </h2>
          {count !== null && (
            <div style={{
              display: 'inline-block',
              background: 'rgba(167,139,250,0.15)',
              border: '1px solid rgba(167,139,250,0.4)',
              borderRadius: '50px',
              padding: '6px 20px',
              fontSize: '13px',
              color: '#c4b5fd'
            }}>
              {count} seekers already joined
            </div>
          )}
        </div>

        {/* Features */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '12px',
          marginBottom: '40px'
        }}>
          {[
            { icon: '1111', label: 'Angel Number Logger', desc: 'Log sightings with thought anchors' },
            { icon: '🔮', label: 'AI Oracle Readings', desc: 'Personalized cosmic guidance' },
            { icon: '✨', label: 'Soul Sync Matching', desc: 'Find others seeing your numbers' },
            { icon: '🌙', label: 'Dream Journal', desc: 'Night mode for 3am insights' },
            { icon: '🔢', label: 'Numerology Blueprint', desc: 'Life Path, Soul Urge, Destiny' },
            { icon: '🎁', label: 'Free Mystic Access', desc: '$6.99/mo value, yours free' },
          ].map((f, i) => (
            <div key={i} style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(167,139,250,0.2)',
              borderRadius: '12px',
              padding: '16px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '24px', marginBottom: '8px' }}>{f.icon}</div>
              <div style={{ color: '#f0c040', fontSize: '12px', fontWeight: 'bold', marginBottom: '4px', letterSpacing: '0.5px' }}>{f.label}</div>
              <div style={{ color: '#9ca3af', fontSize: '11px', lineHeight: '1.4' }}>{f.desc}</div>
            </div>
          ))}
        </div>

        {/* Form */}
        {status === 'success' ? (
          <div style={{
            background: 'rgba(240,192,64,0.1)',
            border: '2px solid rgba(240,192,64,0.5)',
            borderRadius: '20px',
            padding: '48px 32px',
            textAlign: 'center',
            animation: 'pulse-gold 2s ease-in-out infinite'
          }}>
            <div style={{ fontSize: '56px', marginBottom: '16px' }}>🌟</div>
            <h3 style={{ color: '#f0c040', fontSize: '24px', margin: '0 0 12px', fontWeight: 'normal' }}>You're on the list!</h3>
            <p style={{ color: '#c4b5fd', lineHeight: '1.7', margin: '0 0 24px' }}>
              The universe has received your signal. Check your inbox for a confirmation email.
              When your access is approved, you'll receive a personal invitation with free Mystic tier access.
            </p>
            <Link href="/" style={{
              display: 'inline-block',
              background: 'linear-gradient(135deg, #7c3aed, #a855f7)',
              color: 'white',
              textDecoration: 'none',
              padding: '12px 28px',
              borderRadius: '50px',
              fontSize: '14px'
            }}>Explore the App ✨</Link>
          </div>
        ) : (
          <div style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(167,139,250,0.3)',
            borderRadius: '20px',
            padding: '36px 32px'
          }}>
            <h3 style={{ color: '#e2d9f3', fontSize: '20px', margin: '0 0 8px', fontWeight: 'normal', textAlign: 'center' }}>
              Join the Beta
            </h3>
            <p style={{ color: '#9ca3af', fontSize: '13px', textAlign: 'center', margin: '0 0 28px' }}>
              Get free Mystic tier access + help shape the app
            </p>

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', color: '#c4b5fd', fontSize: '12px', letterSpacing: '1px', marginBottom: '6px' }}>EMAIL *</label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
                  placeholder="your@email.com"
                  style={{
                    width: '100%',
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(167,139,250,0.3)',
                    borderRadius: '10px',
                    padding: '12px 16px',
                    color: '#e2d9f3',
                    fontSize: '15px',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', color: '#c4b5fd', fontSize: '12px', letterSpacing: '1px', marginBottom: '6px' }}>NAME (optional)</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                  placeholder="Your name or spiritual name"
                  style={{
                    width: '100%',
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(167,139,250,0.3)',
                    borderRadius: '10px',
                    padding: '12px 16px',
                    color: '#e2d9f3',
                    fontSize: '15px',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', color: '#c4b5fd', fontSize: '12px', letterSpacing: '1px', marginBottom: '6px' }}>YOUR DEVICE</label>
                <select
                  value={form.device}
                  onChange={e => setForm(f => ({ ...f, device: e.target.value }))}
                  style={{
                    width: '100%',
                    background: '#1a0a3e',
                    border: '1px solid rgba(167,139,250,0.3)',
                    borderRadius: '10px',
                    padding: '12px 16px',
                    color: '#e2d9f3',
                    fontSize: '15px',
                    outline: 'none',
                    boxSizing: 'border-box'
                  }}
                >
                  <option value="android">Android Phone</option>
                  <option value="iphone">iPhone / iOS</option>
                  <option value="both">Both Android & iPhone</option>
                  <option value="web">Web Browser Only</option>
                </select>
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', color: '#c4b5fd', fontSize: '12px', letterSpacing: '1px', marginBottom: '6px' }}>WHY DO YOU WANT ACCESS? (optional)</label>
                <textarea
                  value={form.reason}
                  onChange={e => setForm(f => ({ ...f, reason: e.target.value }))}
                  placeholder="Tell us about your angel number journey..."
                  rows={3}
                  style={{
                    width: '100%',
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(167,139,250,0.3)',
                    borderRadius: '10px',
                    padding: '12px 16px',
                    color: '#e2d9f3',
                    fontSize: '15px',
                    outline: 'none',
                    resize: 'vertical',
                    boxSizing: 'border-box',
                    fontFamily: 'Georgia, serif'
                  }}
                />
              </div>

              {status === 'error' && (
                <div style={{
                  background: 'rgba(239,68,68,0.1)',
                  border: '1px solid rgba(239,68,68,0.3)',
                  borderRadius: '10px',
                  padding: '12px 16px',
                  color: '#fca5a5',
                  fontSize: '14px',
                  marginBottom: '16px'
                }}>{message}</div>
              )}

              <button
                type="submit"
                disabled={status === 'loading'}
                style={{
                  width: '100%',
                  background: status === 'loading'
                    ? 'rgba(124,58,237,0.5)'
                    : 'linear-gradient(135deg, #7c3aed, #a855f7)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '50px',
                  padding: '16px',
                  fontSize: '16px',
                  letterSpacing: '1px',
                  cursor: status === 'loading' ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                {status === 'loading' ? 'Sending signal to the universe...' : 'Request Beta Access ✨'}
              </button>
            </form>

            <p style={{ color: '#6b7280', fontSize: '11px', textAlign: 'center', margin: '16px 0 0' }}>
              No spam. Just your beta invite when ready. Unsubscribe anytime.
            </p>
          </div>
        )}

        {/* Footer */}
        <div style={{ textAlign: 'center', marginTop: '40px' }}>
          <Link href="/" style={{ color: '#7c3aed', fontSize: '13px', textDecoration: 'none' }}>
            Already have an account? Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
