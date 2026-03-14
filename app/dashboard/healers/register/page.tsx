'use client';
import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { MODALITIES } from '@/lib/healers-storage';

const SESSION_TYPES = [
  { value: 'in-person', label: 'In-Person', emoji: '📍' },
  { value: 'virtual', label: 'Virtual', emoji: '💻' },
  { value: 'both', label: 'Both', emoji: '🌐' },
];

const ANGEL_NUMBER_OPTIONS = ['111','222','333','444','555','666','777','888','999','1111','1212','1234','2222','3333'];

function calcTruthScore(form: Record<string, unknown>): number {
  let score = 40;
  if (form.bio && (form.bio as string).length > 100) score += 15;
  if (form.photo) score += 15;
  if (form.website) score += 10;
  if (form.email) score += 5;
  if (form.instagram) score += 5;
  if ((form.modalities as string[])?.length >= 2) score += 5;
  if ((form.angelNumbers as string[])?.length >= 1) score += 5;
  return Math.min(score, 100);
}

function HealerRegisterInner() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [step, setStep] = useState(1);
  const [saving, setSaving] = useState(false);
  const [healerId, setHealerId] = useState<string | null>(null);
  const [stripeStatus, setStripeStatus] = useState<{connected: boolean; chargesEnabled: boolean; detailsSubmitted: boolean} | null>(null);
  const [stripeLoading, setStripeLoading] = useState(false);
  const [error, setError] = useState('');

  const [form, setForm] = useState({
    name: '', title: '', bio: '', city: '', state: '', country: 'US',
    modalities: [] as string[], angelNumbers: [] as string[],
    lifePathNumber: undefined as number | undefined,
    photo: '', website: '', email: '', phone: '', instagram: '',
    sessionTypes: [] as ('in-person' | 'virtual' | 'both')[],
    priceRange: '',
  });

  useEffect(() => {
    const stripeParam = searchParams.get('stripe');
    const hId = searchParams.get('healerId');
    if (stripeParam === 'success' && hId) {
      setHealerId(hId);
      setStep(4);
      checkStripeStatus(hId);
    }
  }, [searchParams]);

  const update = (key: string, value: unknown) => setForm(f => ({ ...f, [key]: value }));

  const toggleArray = (key: 'modalities' | 'angelNumbers' | 'sessionTypes', val: string) => {
    setForm(f => {
      const arr = f[key] as string[];
      return { ...f, [key]: arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val] };
    });
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => update('photo', ev.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleSaveProfile = async () => {
    setSaving(true);
    setError('');
    try {
      const res = await fetch('/api/healer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, truthScore: calcTruthScore(form as unknown as Record<string, unknown>) }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to save');
      setHealerId(data.healer.id);
      setStep(4);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save profile');
    } finally {
      setSaving(false);
    }
  };

  const checkStripeStatus = async (hId: string) => {
    try {
      const res = await fetch(`/api/stripe/account-status?healerId=${hId}`);
      const data = await res.json();
      setStripeStatus(data);
    } catch { /* ignore */ }
  };

  const handleStripeConnect = async () => {
    if (!healerId) return;
    setStripeLoading(true);
    setError('');
    try {
      const returnUrl = `${window.location.origin}/dashboard/healers/register?stripe=success&healerId=${healerId}`;
      const res = await fetch('/api/stripe/connect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ healerId, returnUrl }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to create Stripe link');
      window.location.href = data.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to connect Stripe');
    } finally {
      setStripeLoading(false);
    }
  };

  const inp: React.CSSProperties = { width: '100%', padding: '0.75rem 1rem', background: 'rgba(8,6,28,0.95)', border: '1px solid rgba(200,180,255,0.2)', borderRadius: '0.875rem', color: 'rgba(220,200,255,0.9)', fontSize: '0.85rem', outline: 'none', boxSizing: 'border-box', marginBottom: '0.75rem' };
  const lbl: React.CSSProperties = { color: 'rgba(255,255,255,0.5)', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.35rem', display: 'block' };
  const btnGold: React.CSSProperties = { width: '100%', padding: '0.875rem', background: 'linear-gradient(135deg, rgba(201,168,76,0.25), rgba(167,139,250,0.15))', border: '1px solid rgba(201,168,76,0.4)', borderRadius: '999px', color: '#c9a84c', fontSize: '0.9rem', fontWeight: 700, cursor: 'pointer' };
  const btnGhost: React.CSSProperties = { padding: '0.875rem', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '999px', color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem', cursor: 'pointer' };

  const STEPS = ['About You', 'Specialties', 'Contact', 'Get Paid'];

  return (
    <div style={{ minHeight: '100vh', padding: '2rem 1rem', maxWidth: '600px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🌿</div>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#c9a84c', fontFamily: 'Cormorant Garamond, serif', marginBottom: '0.25rem' }}>List Your Practice</h1>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem' }}>Connect with spiritually-aligned clients on SynchroSoul</p>
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
        {STEPS.map((label, i) => (
          <div key={i} style={{ flex: 1, textAlign: 'center' }}>
            <div style={{ height: '3px', borderRadius: '999px', marginBottom: '0.35rem', background: i + 1 <= step ? '#c9a84c' : 'rgba(255,255,255,0.1)', transition: 'background 0.3s' }} />
            <span style={{ fontSize: '0.6rem', color: i + 1 <= step ? '#c9a84c' : 'rgba(255,255,255,0.25)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</span>
          </div>
        ))}
      </div>

      {error && <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '0.875rem', padding: '0.75rem 1rem', marginBottom: '1rem', color: '#f87171', fontSize: '0.82rem' }}>{error}</div>}

      {step === 1 && (
        <div>
          <h2 style={{ color: '#fff', fontFamily: 'Cormorant Garamond, serif', fontSize: '1.2rem', marginBottom: '1.25rem' }}>Step 1 — About You</h2>
          <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
            <label htmlFor="photo-upload" style={{ cursor: 'pointer', display: 'inline-block' }}>
              <div style={{ width: '90px', height: '90px', borderRadius: '50%', background: form.photo ? 'transparent' : 'rgba(201,168,76,0.08)', border: '2px dashed rgba(201,168,76,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.5rem', overflow: 'hidden' }}>
                {form.photo ? <img src={form.photo} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <span style={{ fontSize: '2rem' }}>📷</span>}
              </div>
              <p style={{ color: '#c9a84c', fontSize: '0.75rem' }}>Upload photo</p>
            </label>
            <input id="photo-upload" type="file" accept="image/*" onChange={handlePhotoUpload} style={{ display: 'none' }} />
          </div>
          <label style={lbl}>Full Name *</label>
          <input style={inp} placeholder="e.g. Luna Starweaver" value={form.name} onChange={e => update('name', e.target.value)} />
          <label style={lbl}>Professional Title *</label>
          <input style={inp} placeholder="e.g. Reiki Master & Sound Healer" value={form.title} onChange={e => update('title', e.target.value)} />
          <label style={lbl}>Bio * (min 100 characters)</label>
          <textarea style={{ ...inp, minHeight: '120px', resize: 'vertical' }} placeholder="Tell clients about your healing journey, training, and approach..." value={form.bio} onChange={e => update('bio', e.target.value)} />
          <p style={{ color: form.bio.length >= 100 ? '#4ade80' : 'rgba(255,255,255,0.25)', fontSize: '0.7rem', marginTop: '-0.5rem', marginBottom: '0.75rem' }}>{form.bio.length}/100 {form.bio.length >= 100 ? '✓ Great!' : 'characters'}</p>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <div style={{ flex: 1 }}><label style={lbl}>City *</label><input style={inp} placeholder="Los Angeles" value={form.city} onChange={e => update('city', e.target.value)} /></div>
            <div style={{ flex: 1 }}><label style={lbl}>State</label><input style={inp} placeholder="CA" value={form.state} onChange={e => update('state', e.target.value)} /></div>
          </div>
          <label style={lbl}>Life Path Number (optional)</label>
          <select style={{ ...inp, cursor: 'pointer', background: 'rgba(8,6,28,0.95)', WebkitAppearance: 'none', appearance: 'none', color: 'rgba(220,200,255,0.9)' }} value={form.lifePathNumber || ''} onChange={e => update('lifePathNumber', e.target.value ? parseInt(e.target.value) : undefined)}>
            <option value="">Select your Life Path number</option>
            {[1,2,3,4,5,6,7,8,9,11,22,33].map(n => <option key={n} value={n}>{n}</option>)}
          </select>
          <button onClick={() => { if (form.name && form.title && form.bio.length >= 50 && form.city) setStep(2); }} style={btnGold}>Continue →</button>
        </div>
      )}

      {step === 2 && (
        <div>
          <h2 style={{ color: '#fff', fontFamily: 'Cormorant Garamond, serif', fontSize: '1.2rem', marginBottom: '1.25rem' }}>Step 2 — Your Specialties</h2>
          <label style={lbl}>Healing Modalities * (select all that apply)</label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '1.25rem' }}>
            {MODALITIES.map(m => { const sel = form.modalities.includes(m); return <button key={m} onClick={() => toggleArray('modalities', m)} style={{ padding: '0.35rem 0.75rem', borderRadius: '999px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 600, background: sel ? 'rgba(167,139,250,0.2)' : 'rgba(255,255,255,0.04)', border: sel ? '1px solid rgba(167,139,250,0.4)' : '1px solid rgba(255,255,255,0.08)', color: sel ? '#a78bfa' : 'rgba(255,255,255,0.5)' }}>{m}</button>; })}
          </div>
          <label style={lbl}>Angel Numbers You Work With</label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '1.25rem' }}>
            {ANGEL_NUMBER_OPTIONS.map(n => { const sel = form.angelNumbers.includes(n); return <button key={n} onClick={() => toggleArray('angelNumbers', n)} style={{ padding: '0.35rem 0.75rem', borderRadius: '999px', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 700, fontFamily: 'Cormorant Garamond, serif', background: sel ? 'rgba(201,168,76,0.2)' : 'rgba(255,255,255,0.04)', border: sel ? '1px solid rgba(201,168,76,0.4)' : '1px solid rgba(255,255,255,0.08)', color: sel ? '#c9a84c' : 'rgba(255,255,255,0.5)' }}>{n}</button>; })}
          </div>
          <label style={lbl}>Session Type *</label>
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem' }}>
            {SESSION_TYPES.map(s => { const sel = form.sessionTypes.includes(s.value as 'in-person' | 'virtual' | 'both'); return <button key={s.value} onClick={() => toggleArray('sessionTypes', s.value)} style={{ flex: 1, padding: '0.6rem', borderRadius: '0.875rem', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 600, background: sel ? 'rgba(34,211,238,0.15)' : 'rgba(255,255,255,0.04)', border: sel ? '1px solid rgba(34,211,238,0.3)' : '1px solid rgba(255,255,255,0.08)', color: sel ? '#22d3ee' : 'rgba(255,255,255,0.5)', textAlign: 'center' }}>{s.emoji}<br />{s.label}</button>; })}
          </div>
          <label style={lbl}>Price Range</label>
          <select style={{ ...inp, cursor: 'pointer', background: 'rgba(8,6,28,0.95)', WebkitAppearance: 'none', appearance: 'none', color: 'rgba(220,200,255,0.9)' }} value={form.priceRange} onChange={e => update('priceRange', e.target.value)}>
            <option value="">Select price range</option>
            <option value="Free / Donation">Free / Donation-based</option>
            <option value="$30 - $60">$30 - $60 per session</option>
            <option value="$60 - $100">$60 - $100 per session</option>
            <option value="$100 - $150">$100 - $150 per session</option>
            <option value="$150 - $250">$150 - $250 per session</option>
            <option value="$250+">$250+ per session</option>
          </select>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button onClick={() => setStep(1)} style={{ ...btnGhost, flex: 1 }}>← Back</button>
            <button onClick={() => { if (form.modalities.length > 0 && form.sessionTypes.length > 0) setStep(3); }} style={{ ...btnGold, flex: 2, width: 'auto' }}>Continue →</button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div>
          <h2 style={{ color: '#fff', fontFamily: 'Cormorant Garamond, serif', fontSize: '1.2rem', marginBottom: '0.5rem' }}>Step 3 — Contact & Links</h2>
          <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.78rem', marginBottom: '1.25rem' }}>Add at least one contact method so clients can reach you.</p>
          <label style={lbl}>Email</label>
          <input style={inp} type="email" placeholder="your@email.com" value={form.email} onChange={e => update('email', e.target.value)} />
          <label style={lbl}>Website</label>
          <input style={inp} placeholder="https://yourwebsite.com" value={form.website} onChange={e => update('website', e.target.value)} />
          <label style={lbl}>Instagram Handle</label>
          <input style={inp} placeholder="@yourhandle" value={form.instagram} onChange={e => update('instagram', e.target.value)} />
          <label style={lbl}>Phone (optional)</label>
          <input style={inp} type="tel" placeholder="+1 (555) 000-0000" value={form.phone} onChange={e => update('phone', e.target.value)} />
          <div style={{ background: 'rgba(201,168,76,0.06)', border: '1px solid rgba(201,168,76,0.15)', borderRadius: '1rem', padding: '1rem', marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <p style={{ color: '#c9a84c', fontSize: '0.78rem', fontWeight: 700 }}>✦ Truth Score Preview</p>
              <span style={{ color: '#c9a84c', fontWeight: 800, fontSize: '1.1rem', fontFamily: 'Cormorant Garamond, serif' }}>{calcTruthScore(form as unknown as Record<string, unknown>)}%</span>
            </div>
            <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
              {[
                { label: 'Profile filled', done: !!(form.name && form.title && form.bio.length > 100) },
                { label: 'Photo added', done: !!form.photo },
                { label: 'Website linked', done: !!form.website },
                { label: 'Contact info', done: !!(form.email || form.phone) },
                { label: 'Instagram', done: !!form.instagram },
              ].map(item => (
                <span key={item.label} style={{ padding: '0.2rem 0.6rem', borderRadius: '999px', fontSize: '0.68rem', background: item.done ? 'rgba(74,222,128,0.1)' : 'rgba(255,255,255,0.04)', border: item.done ? '1px solid rgba(74,222,128,0.2)' : '1px solid rgba(255,255,255,0.08)', color: item.done ? '#4ade80' : 'rgba(255,255,255,0.3)' }}>
                  {item.done ? '✓' : '○'} {item.label}
                </span>
              ))}
            </div>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button onClick={() => setStep(2)} style={{ ...btnGhost, flex: 1 }}>← Back</button>
            <button onClick={handleSaveProfile} disabled={saving || !(form.email || form.website || form.instagram)} style={{ ...btnGold, flex: 2, width: 'auto', opacity: saving || !(form.email || form.website || form.instagram) ? 0.5 : 1 }}>
              {saving ? 'Saving...' : 'Save & Continue →'}
            </button>
          </div>
        </div>
      )}

      {step === 4 && (
        <div>
          <h2 style={{ color: '#fff', fontFamily: 'Cormorant Garamond, serif', fontSize: '1.2rem', marginBottom: '0.5rem' }}>Step 4 — Connect Your Bank</h2>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.82rem', marginBottom: '1.5rem' }}>Receive payments directly to your bank. SynchroSoul takes 12% — you keep 88%.</p>

          <div style={{ background: 'rgba(167,139,250,0.06)', border: '1px solid rgba(167,139,250,0.15)', borderRadius: '1rem', padding: '1.25rem', marginBottom: '1.25rem' }}>
            <p style={{ color: '#a78bfa', fontSize: '0.78rem', fontWeight: 700, marginBottom: '0.75rem' }}>💜 How Payments Work</p>
            {[
              { icon: '💳', text: 'Client books and pays through SynchroSoul' },
              { icon: '⚡', text: 'Stripe instantly splits the payment' },
              { icon: '🏦', text: 'You receive 88% directly to your bank' },
              { icon: '🔒', text: 'Secure, encrypted — no manual invoicing' },
            ].map(item => (
              <div key={item.icon} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.4rem' }}>
                <span style={{ fontSize: '1.1rem' }}>{item.icon}</span>
                <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.8rem' }}>{item.text}</span>
              </div>
            ))}
          </div>

          {stripeStatus && (
            <div style={{ background: stripeStatus.chargesEnabled ? 'rgba(74,222,128,0.08)' : 'rgba(251,191,36,0.08)', border: `1px solid ${stripeStatus.chargesEnabled ? 'rgba(74,222,128,0.25)' : 'rgba(251,191,36,0.25)'}`, borderRadius: '1rem', padding: '1rem', marginBottom: '1.25rem' }}>
              <p style={{ color: stripeStatus.chargesEnabled ? '#4ade80' : '#fbbf24', fontWeight: 700, fontSize: '0.85rem', marginBottom: '0.5rem' }}>
                {stripeStatus.chargesEnabled ? '✓ Stripe Connected & Active!' : '⏳ Stripe Account Pending'}
              </p>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {[
                  { label: 'Account linked', done: stripeStatus.connected },
                  { label: 'Details submitted', done: stripeStatus.detailsSubmitted },
                  { label: 'Charges enabled', done: stripeStatus.chargesEnabled },
                ].map(item => (
                  <span key={item.label} style={{ padding: '0.2rem 0.6rem', borderRadius: '999px', fontSize: '0.68rem', background: item.done ? 'rgba(74,222,128,0.1)' : 'rgba(255,255,255,0.04)', border: item.done ? '1px solid rgba(74,222,128,0.2)' : '1px solid rgba(255,255,255,0.08)', color: item.done ? '#4ade80' : 'rgba(255,255,255,0.3)' }}>
                    {item.done ? '✓' : '○'} {item.label}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '1rem', padding: '1rem', marginBottom: '1.5rem' }}>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.75rem' }}>Example: $100 session</p>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}><span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.82rem' }}>Client pays</span><span style={{ color: '#fff', fontWeight: 600, fontSize: '0.82rem' }}>$100.00</span></div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}><span style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.82rem' }}>Platform fee (12%)</span><span style={{ color: 'rgba(239,68,68,0.7)', fontSize: '0.82rem' }}>-$12.00</span></div>
            <div style={{ height: '1px', background: 'rgba(255,255,255,0.08)', margin: '0.4rem 0' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between' }}><span style={{ color: '#4ade80', fontWeight: 700, fontSize: '0.9rem' }}>You receive</span><span style={{ color: '#4ade80', fontWeight: 800, fontSize: '0.9rem' }}>$88.00</span></div>
          </div>

          <button onClick={handleStripeConnect} disabled={stripeLoading} style={{ ...btnGold, marginBottom: '0.75rem', opacity: stripeLoading ? 0.7 : 1 }}>
            {stripeLoading ? 'Connecting...' : stripeStatus?.chargesEnabled ? '✓ Update Bank Account' : '🏦 Connect Bank Account via Stripe'}
          </button>

          {stripeStatus?.chargesEnabled ? (
            <button onClick={() => router.push('/dashboard/healers/my-listing')} style={{ ...btnGold, background: 'rgba(74,222,128,0.15)', borderColor: 'rgba(74,222,128,0.3)', color: '#4ade80' }}>
              ✨ View My Listing
            </button>
          ) : (
            <button onClick={() => router.push('/dashboard/healers/my-listing')} style={{ ...btnGold, background: 'rgba(255,255,255,0.04)', borderColor: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.4)', fontSize: '0.82rem' }}>
              Skip for now — connect bank later
            </button>
          )}

          <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: '0.7rem', textAlign: 'center', marginTop: '1rem' }}>Powered by Stripe. Your banking info is never stored on SynchroSoul servers.</p>
        </div>
      )}
    </div>
  );
}

export default function HealerRegisterPage() {
  return (
    <Suspense fallback={<div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><span style={{ color: '#c9a84c' }}>Loading...</span></div>}>
      <HealerRegisterInner />
    </Suspense>
  );
}
