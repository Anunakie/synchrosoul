'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface HealerData {
  id: string;
  name: string;
  title: string;
  bio: string;
  city: string;
  state: string;
  location: string;
  modalities: string[];
  angel_numbers: string[];
  session_types: string[];
  price_range: string;
  photo?: string;
  website?: string;
  email?: string;
  instagram?: string;
  phone?: string;
  truth_score: number;
  verified: boolean;
  stripe_account_id?: string;
  created_at: string;
}

interface StripeStatus {
  connected: boolean;
  chargesEnabled: boolean;
  payoutsEnabled: boolean;
  detailsSubmitted: boolean;
}

export default function MyListingPage() {
  const router = useRouter();
  const [healer, setHealer] = useState<HealerData | null>(null);
  const [stripeStatus, setStripeStatus] = useState<StripeStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [stripeLoading, setStripeLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    loadMyListing();
  }, []);

  const loadMyListing = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/healer');
      const data = await res.json();
      if (data.healer) {
        setHealer(data.healer);
        if (data.healer.stripe_account_id) {
          checkStripe(data.healer.id);
        }
      }
    } catch (err) {
      setError('Failed to load listing');
    } finally {
      setLoading(false);
    }
  };

  const checkStripe = async (healerId: string) => {
    try {
      const res = await fetch(`/api/stripe/account-status?healerId=${healerId}`);
      const data = await res.json();
      setStripeStatus(data);
    } catch { /* ignore */ }
  };

  const handleStripeConnect = async () => {
    if (!healer) return;
    setStripeLoading(true);
    setError('');
    try {
      const returnUrl = `${window.location.origin}/dashboard/healers/my-listing?stripe=success`;
      const res = await fetch('/api/stripe/connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ healerId: healer.id, returnUrl }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed');
      window.location.href = data.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to connect Stripe');
    } finally {
      setStripeLoading(false);
    }
  };

  const card: React.CSSProperties = { background: 'rgba(8,6,28,0.88)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '1.25rem', padding: '1.5rem', marginBottom: '1rem', backdropFilter: 'blur(12px)' };
  const badge = (color: string, bg: string, border: string): React.CSSProperties => ({ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', padding: '0.25rem 0.75rem', borderRadius: '999px', fontSize: '0.72rem', fontWeight: 700, color, background: bg, border: `1px solid ${border}` });

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ width: '40px', height: '40px', border: '2px solid rgba(201,168,76,0.3)', borderTop: '2px solid #c9a84c', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
      <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem' }}>Loading your listing...</p>
    </div>
  );

  if (!healer) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '1.5rem', padding: '2rem', textAlign: 'center' }}>
      <div style={{ fontSize: '4rem' }}>🌿</div>
      <h2 style={{ color: '#c9a84c', fontFamily: 'Cormorant Garamond, serif', fontSize: '1.75rem' }}>No Listing Yet</h2>
      <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.9rem', maxWidth: '320px' }}>You have not created a healer listing yet. Register your practice to start receiving bookings.</p>
      <button onClick={() => router.push('/dashboard/healers/register')} style={{ padding: '0.875rem 2rem', background: 'linear-gradient(135deg, rgba(201,168,76,0.25), rgba(167,139,250,0.15))', border: '1px solid rgba(201,168,76,0.4)', borderRadius: '999px', color: '#c9a84c', fontSize: '0.9rem', fontWeight: 700, cursor: 'pointer' }}>
        Create My Listing
      </button>
    </div>
  );

  const truthScore = healer.truth_score || 0;
  const scoreColor = truthScore >= 80 ? '#4ade80' : truthScore >= 60 ? '#c9a84c' : '#f87171';

  return (
    <div style={{ minHeight: '100vh', padding: '1.5rem 1rem', maxWidth: '680px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#c9a84c', fontFamily: 'Cormorant Garamond, serif', marginBottom: '0.25rem' }}>My Healer Listing</h1>
          <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.8rem' }}>Manage your practice profile and payments</p>
        </div>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button onClick={() => router.push('/dashboard/healers/register')} style={{ padding: '0.5rem 1rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '999px', color: 'rgba(255,255,255,0.6)', fontSize: '0.78rem', cursor: 'pointer' }}>Edit Listing</button>
          <button onClick={() => router.push('/dashboard/healers')} style={{ padding: '0.5rem 1rem', background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.25)', borderRadius: '999px', color: '#c9a84c', fontSize: '0.78rem', cursor: 'pointer' }}>View Directory</button>
        </div>
      </div>

      {error && <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '0.875rem', padding: '0.75rem 1rem', marginBottom: '1rem', color: '#f87171', fontSize: '0.82rem' }}>{error}</div>}

      {/* Profile Card */}
      <div style={card}>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
          <div style={{ width: '72px', height: '72px', borderRadius: '50%', background: healer.photo ? 'transparent' : 'rgba(201,168,76,0.1)', border: '2px solid rgba(201,168,76,0.2)', overflow: 'hidden', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {healer.photo ? <img src={healer.photo} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <span style={{ fontSize: '1.75rem' }}>🌿</span>}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.25rem' }}>
              <h2 style={{ color: '#fff', fontFamily: 'Cormorant Garamond, serif', fontSize: '1.2rem', fontWeight: 700 }}>{healer.name}</h2>
              {healer.verified && <span style={badge('#4ade80', 'rgba(74,222,128,0.1)', 'rgba(74,222,128,0.25)')}>✓ Verified</span>}
            </div>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.82rem', marginBottom: '0.5rem' }}>{healer.title}</p>
            <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.75rem' }}>📍 {healer.location || healer.city}</p>
          </div>
        </div>

        <div style={{ height: '1px', background: 'rgba(255,255,255,0.06)', margin: '1rem 0' }} />

        {/* Stats row */}
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ color: scoreColor, fontWeight: 800, fontSize: '1.4rem', fontFamily: 'Cormorant Garamond, serif' }}>{truthScore}%</div>
            <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Truth Score</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ color: '#a78bfa', fontWeight: 800, fontSize: '1.4rem', fontFamily: 'Cormorant Garamond, serif' }}>{(healer.modalities || []).length}</div>
            <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Modalities</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ color: '#c9a84c', fontWeight: 800, fontSize: '1.4rem', fontFamily: 'Cormorant Garamond, serif' }}>{(healer.angel_numbers || []).length}</div>
            <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Angel Nums</div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ color: '#22d3ee', fontWeight: 800, fontSize: '1.1rem', fontFamily: 'Cormorant Garamond, serif' }}>{healer.price_range || '—'}</div>
            <div style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Price Range</div>
          </div>
        </div>
      </div>

      {/* Stripe Connect Card */}
      <div style={{ ...card, border: stripeStatus?.chargesEnabled ? '1px solid rgba(74,222,128,0.2)' : '1px solid rgba(201,168,76,0.2)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div>
            <h3 style={{ color: '#fff', fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.2rem' }}>💳 Payment Setup</h3>
            <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.75rem' }}>Connect your bank to receive booking payments</p>
          </div>
          {stripeStatus?.chargesEnabled
            ? <span style={badge('#4ade80', 'rgba(74,222,128,0.1)', 'rgba(74,222,128,0.25)')}>✓ Active</span>
            : healer.stripe_account_id
            ? <span style={badge('#fbbf24', 'rgba(251,191,36,0.1)', 'rgba(251,191,36,0.25)')}>⏳ Pending</span>
            : <span style={badge('rgba(255,255,255,0.4)', 'rgba(255,255,255,0.04)', 'rgba(255,255,255,0.1)')}>Not Connected</span>
          }
        </div>

        {stripeStatus && (
          <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
            {[
              { label: 'Account linked', done: stripeStatus.connected },
              { label: 'Details submitted', done: stripeStatus.detailsSubmitted },
              { label: 'Charges enabled', done: stripeStatus.chargesEnabled },
              { label: 'Payouts enabled', done: stripeStatus.payoutsEnabled },
            ].map(item => (
              <span key={item.label} style={{ padding: '0.2rem 0.6rem', borderRadius: '999px', fontSize: '0.68rem', background: item.done ? 'rgba(74,222,128,0.1)' : 'rgba(255,255,255,0.04)', border: item.done ? '1px solid rgba(74,222,128,0.2)' : '1px solid rgba(255,255,255,0.08)', color: item.done ? '#4ade80' : 'rgba(255,255,255,0.3)' }}>
                {item.done ? '✓' : '○'} {item.label}
              </span>
            ))}
          </div>
        )}

        {/* Fee breakdown */}
        <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '0.75rem', padding: '0.875rem', marginBottom: '1rem' }}>
          <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.5rem' }}>Your earnings per booking</p>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}><span style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.8rem' }}>Client pays</span><span style={{ color: '#fff', fontSize: '0.8rem' }}>$100</span></div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}><span style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.8rem' }}>Platform fee (12%)</span><span style={{ color: 'rgba(239,68,68,0.6)', fontSize: '0.8rem' }}>-$12</span></div>
          <div style={{ height: '1px', background: 'rgba(255,255,255,0.06)', margin: '0.4rem 0' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: '#4ade80', fontWeight: 700, fontSize: '0.85rem' }}>You receive</span><span style={{ color: '#4ade80', fontWeight: 800, fontSize: '0.85rem' }}>$88</span></div>
        </div>

        <button onClick={handleStripeConnect} disabled={stripeLoading} style={{ width: '100%', padding: '0.875rem', background: stripeStatus?.chargesEnabled ? 'rgba(74,222,128,0.1)' : 'linear-gradient(135deg, rgba(201,168,76,0.2), rgba(167,139,250,0.1))', border: stripeStatus?.chargesEnabled ? '1px solid rgba(74,222,128,0.3)' : '1px solid rgba(201,168,76,0.35)', borderRadius: '999px', color: stripeStatus?.chargesEnabled ? '#4ade80' : '#c9a84c', fontSize: '0.88rem', fontWeight: 700, cursor: 'pointer', opacity: stripeLoading ? 0.7 : 1 }}>
          {stripeLoading ? 'Connecting...' : stripeStatus?.chargesEnabled ? '✓ Manage Bank Account' : healer.stripe_account_id ? '⏳ Complete Stripe Setup' : '🏦 Connect Bank Account'}
        </button>
        <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.68rem', textAlign: 'center', marginTop: '0.5rem' }}>Powered by Stripe — your banking info is never stored on our servers</p>
      </div>

      {/* Listing Details */}
      <div style={card}>
        <h3 style={{ color: '#fff', fontWeight: 700, fontSize: '0.95rem', marginBottom: '1rem' }}>📋 Listing Details</h3>

        {healer.bio && (
          <div style={{ marginBottom: '1rem' }}>
            <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.35rem' }}>Bio</p>
            <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.82rem', lineHeight: 1.6 }}>{healer.bio}</p>
          </div>
        )}

        {(healer.modalities || []).length > 0 && (
          <div style={{ marginBottom: '1rem' }}>
            <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.5rem' }}>Modalities</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
              {healer.modalities.map(m => <span key={m} style={{ padding: '0.2rem 0.6rem', borderRadius: '999px', fontSize: '0.72rem', background: 'rgba(167,139,250,0.1)', border: '1px solid rgba(167,139,250,0.2)', color: '#a78bfa' }}>{m}</span>)}
            </div>
          </div>
        )}

        {(healer.angel_numbers || []).length > 0 && (
          <div style={{ marginBottom: '1rem' }}>
            <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: '0.5rem' }}>Angel Numbers</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.35rem' }}>
              {healer.angel_numbers.map(n => <span key={n} style={{ padding: '0.2rem 0.6rem', borderRadius: '999px', fontSize: '0.78rem', fontWeight: 700, fontFamily: 'Cormorant Garamond, serif', background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.2)', color: '#c9a84c' }}>{n}</span>)}
            </div>
          </div>
        )}

        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          {healer.website && <a href={healer.website} target="_blank" rel="noopener noreferrer" style={{ color: '#22d3ee', fontSize: '0.78rem', textDecoration: 'none' }}>🌐 Website</a>}
          {healer.instagram && <span style={{ color: '#a78bfa', fontSize: '0.78rem' }}>📸 {healer.instagram}</span>}
          {healer.email && <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.78rem' }}>✉️ {healer.email}</span>}
        </div>
      </div>

      {/* Truth Score Improvement Tips */}
      {truthScore < 90 && (
        <div style={{ ...card, border: '1px solid rgba(201,168,76,0.15)' }}>
          <h3 style={{ color: '#c9a84c', fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.75rem' }}>✦ Boost Your Truth Score</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {[
              { done: !!(healer.photo), tip: 'Add a profile photo (+15 points)' },
              { done: !!(healer.bio && healer.bio.length > 100), tip: 'Write a bio over 100 characters (+15 points)' },
              { done: !!(healer.website), tip: 'Add your website (+10 points)' },
              { done: !!(healer.email), tip: 'Add contact email (+5 points)' },
              { done: !!(healer.instagram), tip: 'Add Instagram handle (+5 points)' },
              { done: stripeStatus?.chargesEnabled, tip: 'Connect Stripe to accept bookings' },
            ].filter(item => !item.done).map(item => (
              <div key={item.tip} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ color: 'rgba(201,168,76,0.5)', fontSize: '0.8rem' }}>○</span>
                <span style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.78rem' }}>{item.tip}</span>
              </div>
            ))}
          </div>
          <button onClick={() => router.push('/dashboard/healers/register')} style={{ marginTop: '1rem', width: '100%', padding: '0.75rem', background: 'rgba(201,168,76,0.08)', border: '1px solid rgba(201,168,76,0.2)', borderRadius: '999px', color: '#c9a84c', fontSize: '0.82rem', fontWeight: 600, cursor: 'pointer' }}>Edit Listing to Improve Score</button>
        </div>
      )}

      {/* Bookings link */}
      <div style={{ ...card, cursor: 'pointer' }} onClick={() => router.push('/dashboard/my-bookings')}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h3 style={{ color: '#fff', fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.2rem' }}>📅 My Bookings</h3>
            <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.75rem' }}>View and manage client booking requests</p>
          </div>
          <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '1.2rem' }}>→</span>
        </div>
      </div>
    </div>
  );
}
