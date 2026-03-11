'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { saveHealerProfile, MODALITIES } from '@/lib/healers-storage';

const SESSION_TYPES = [
  { value: 'in-person', label: 'In-Person', emoji: '📍' },
  { value: 'virtual', label: 'Virtual', emoji: '💻' },
  { value: 'both', label: 'Both', emoji: '🌐' },
];

const ANGEL_NUMBER_OPTIONS = ['111','222','333','444','555','666','777','888','999','1111','1212','1234','2222','3333'];

export default function HealerRegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const [form, setForm] = useState({
    name: '',
    title: '',
    bio: '',
    city: '',
    state: '',
    country: 'US',
    modalities: [] as string[],
    angelNumbers: [] as string[],
    lifePathNumber: undefined as number | undefined,
    photo: '',
    website: '',
    email: '',
    phone: '',
    instagram: '',
    sessionTypes: [] as ('in-person' | 'virtual' | 'both')[],
    priceRange: '',
  });

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

  const handleSubmit = async () => {
    if (!form.name || !form.title || !form.bio || !form.city) return;
    setSaving(true);
    try {
      saveHealerProfile({
        ...form,
        location: [form.city, form.state, form.country].filter(Boolean).join(', '),
      });
      setSaved(true);
      setTimeout(() => router.push('/dashboard/healers'), 2000);
    } finally {
      setSaving(false);
    }
  };

  const inputStyle = { width: '100%', padding: '0.75rem 1rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.875rem', color: '#fff', fontSize: '0.85rem', outline: 'none', boxSizing: 'border-box' as const, marginBottom: '0.75rem' };
  const labelStyle = { color: 'rgba(255,255,255,0.5)', fontSize: '0.72rem', textTransform: 'uppercase' as const, letterSpacing: '0.08em', marginBottom: '0.35rem', display: 'block' };

  if (saved) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '1rem', padding: '2rem' }}>
      <div style={{ fontSize: '4rem' }}>✨</div>
      <h2 style={{ color: '#c9a84c', fontFamily: 'Cormorant Garamond, serif', fontSize: '1.75rem', textAlign: 'center' }}>Your listing is live!</h2>
      <p style={{ color: 'rgba(255,255,255,0.5)', textAlign: 'center' }}>Redirecting you to the healer directory...</p>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', padding: '2rem 1rem', maxWidth: '600px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 700, color: '#c9a84c', fontFamily: 'Cormorant Garamond, serif', marginBottom: '0.25rem' }}>List Your Practice</h1>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem' }}>Connect with spiritually-aligned clients on SynchroSoul</p>
      </div>

      {/* Step indicator */}
      <div style={{ display: 'flex', gap: '0.35rem', marginBottom: '2rem' }}>
        {[1,2,3].map(s => (
          <div key={s} style={{ flex: 1, height: '3px', borderRadius: '999px', background: s <= step ? '#c9a84c' : 'rgba(255,255,255,0.1)', transition: 'background 0.3s' }} />
        ))}
      </div>

      {/* Step 1: Basic Info */}
      {step === 1 && (
        <div>
          <h2 style={{ color: '#fff', fontFamily: 'Cormorant Garamond, serif', fontSize: '1.2rem', marginBottom: '1.25rem' }}>Step 1 — About You</h2>

          {/* Photo upload */}
          <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
            <label htmlFor="photo-upload" style={{ cursor: 'pointer', display: 'inline-block' }}>
              <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: form.photo ? 'transparent' : 'rgba(201,168,76,0.1)', border: '2px dashed rgba(201,168,76,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 0.5rem', overflow: 'hidden' }}>
                {form.photo
                  ? <img src={form.photo} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  : <span style={{ fontSize: '1.75rem' }}>📷</span>
                }
              </div>
              <p style={{ color: '#c9a84c', fontSize: '0.75rem' }}>Upload photo</p>
            </label>
            <input id="photo-upload" type="file" accept="image/*" onChange={handlePhotoUpload} style={{ display: 'none' }} />
          </div>

          <label style={labelStyle}>Full Name *</label>
          <input style={inputStyle} placeholder="e.g. Luna Starweaver" value={form.name} onChange={e => update('name', e.target.value)} />

          <label style={labelStyle}>Professional Title *</label>
          <input style={inputStyle} placeholder="e.g. Reiki Master & Sound Healer" value={form.title} onChange={e => update('title', e.target.value)} />

          <label style={labelStyle}>Bio * (min 100 characters for Angel Approved badge)</label>
          <textarea style={{ ...inputStyle, minHeight: '120px', resize: 'vertical' as const }} placeholder="Tell clients about your healing journey, training, and approach..." value={form.bio} onChange={e => update('bio', e.target.value)} />
          <p style={{ color: form.bio.length >= 100 ? '#4ade80' : 'rgba(255,255,255,0.25)', fontSize: '0.7rem', marginTop: '-0.5rem', marginBottom: '0.75rem' }}>{form.bio.length}/100 characters {form.bio.length >= 100 ? '✓' : ''}</p>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>City *</label>
              <input style={inputStyle} placeholder="Los Angeles" value={form.city} onChange={e => update('city', e.target.value)} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={labelStyle}>State / Province</label>
              <input style={inputStyle} placeholder="CA" value={form.state} onChange={e => update('state', e.target.value)} />
            </div>
          </div>

          <label style={labelStyle}>Life Path Number (optional)</label>
          <select style={{ ...inputStyle, cursor: 'pointer' }} value={form.lifePathNumber || ''} onChange={e => update('lifePathNumber', e.target.value ? parseInt(e.target.value) : undefined)}>
            <option value="">Select your Life Path number</option>
            {[1,2,3,4,5,6,7,8,9,11,22,33].map(n => <option key={n} value={n}>{n}</option>)}
          </select>

          <button onClick={() => { if (form.name && form.title && form.bio && form.city) setStep(2); }} style={{ width: '100%', padding: '0.875rem', background: form.name && form.title && form.bio.length >= 50 && form.city ? 'rgba(201,168,76,0.2)' : 'rgba(255,255,255,0.05)', border: '1px solid rgba(201,168,76,0.3)', borderRadius: '999px', color: '#c9a84c', fontSize: '0.9rem', fontWeight: 700, cursor: 'pointer' }}>Continue →</button>
        </div>
      )}

      {/* Step 2: Modalities & Specialties */}
      {step === 2 && (
        <div>
          <h2 style={{ color: '#fff', fontFamily: 'Cormorant Garamond, serif', fontSize: '1.2rem', marginBottom: '1.25rem' }}>Step 2 — Your Specialties</h2>

          <label style={labelStyle}>Healing Modalities * (select all that apply)</label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '1.25rem' }}>
            {MODALITIES.map(m => {
              const selected = form.modalities.includes(m);
              return (
                <button key={m} onClick={() => toggleArray('modalities', m)} style={{ padding: '0.35rem 0.75rem', borderRadius: '999px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 600, background: selected ? 'rgba(167,139,250,0.2)' : 'rgba(255,255,255,0.04)', border: selected ? '1px solid rgba(167,139,250,0.4)' : '1px solid rgba(255,255,255,0.08)', color: selected ? '#a78bfa' : 'rgba(255,255,255,0.5)' }}>{m}</button>
              );
            })}
          </div>

          <label style={labelStyle}>Angel Numbers You Work With</label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginBottom: '1.25rem' }}>
            {ANGEL_NUMBER_OPTIONS.map(n => {
              const selected = form.angelNumbers.includes(n);
              return (
                <button key={n} onClick={() => toggleArray('angelNumbers', n)} style={{ padding: '0.35rem 0.75rem', borderRadius: '999px', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 700, fontFamily: 'Cormorant Garamond, serif', background: selected ? 'rgba(201,168,76,0.2)' : 'rgba(255,255,255,0.04)', border: selected ? '1px solid rgba(201,168,76,0.4)' : '1px solid rgba(255,255,255,0.08)', color: selected ? '#c9a84c' : 'rgba(255,255,255,0.5)' }}>{n}</button>
              );
            })}
          </div>

          <label style={labelStyle}>Session Type *</label>
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem' }}>
            {SESSION_TYPES.map(s => {
              const selected = form.sessionTypes.includes(s.value as 'in-person' | 'virtual' | 'both');
              return (
                <button key={s.value} onClick={() => toggleArray('sessionTypes', s.value)} style={{ flex: 1, padding: '0.6rem', borderRadius: '0.875rem', cursor: 'pointer', fontSize: '0.78rem', fontWeight: 600, background: selected ? 'rgba(34,211,238,0.15)' : 'rgba(255,255,255,0.04)', border: selected ? '1px solid rgba(34,211,238,0.3)' : '1px solid rgba(255,255,255,0.08)', color: selected ? '#22d3ee' : 'rgba(255,255,255,0.5)', textAlign: 'center' as const }}>{s.emoji}<br />{s.label}</button>
              );
            })}
          </div>

          <label style={labelStyle}>Price Range</label>
          <select style={{ ...inputStyle, cursor: 'pointer' }} value={form.priceRange} onChange={e => update('priceRange', e.target.value)}>
            <option value="">Select price range</option>
            <option value="Free - Donation">Free / Donation-based</option>
            <option value="$30 - $60">$30 - $60 per session</option>
            <option value="$60 - $100">$60 - $100 per session</option>
            <option value="$100 - $150">$100 - $150 per session</option>
            <option value="$150 - $250">$150 - $250 per session</option>
            <option value="$250+">$250+ per session</option>
          </select>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button onClick={() => setStep(1)} style={{ flex: 1, padding: '0.875rem', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '999px', color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem', cursor: 'pointer' }}>← Back</button>
            <button onClick={() => { if (form.modalities.length > 0 && form.sessionTypes.length > 0) setStep(3); }} style={{ flex: 2, padding: '0.875rem', background: 'rgba(201,168,76,0.2)', border: '1px solid rgba(201,168,76,0.3)', borderRadius: '999px', color: '#c9a84c', fontSize: '0.9rem', fontWeight: 700, cursor: 'pointer' }}>Continue →</button>
          </div>
        </div>
      )}

      {/* Step 3: Contact Info */}
      {step === 3 && (
        <div>
          <h2 style={{ color: '#fff', fontFamily: 'Cormorant Garamond, serif', fontSize: '1.2rem', marginBottom: '0.5rem' }}>Step 3 — Contact & Links</h2>
          <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.78rem', marginBottom: '1.25rem' }}>Add at least one contact method so clients can reach you.</p>

          <label style={labelStyle}>Email</label>
          <input style={inputStyle} type="email" placeholder="your@email.com" value={form.email} onChange={e => update('email', e.target.value)} />

          <label style={labelStyle}>Website</label>
          <input style={inputStyle} placeholder="https://yourwebsite.com" value={form.website} onChange={e => update('website', e.target.value)} />

          <label style={labelStyle}>Instagram Handle</label>
          <input style={inputStyle} placeholder="@yourhandle" value={form.instagram} onChange={e => update('instagram', e.target.value)} />

          <label style={labelStyle}>Phone (optional)</label>
          <input style={inputStyle} type="tel" placeholder="+1 (555) 000-0000" value={form.phone} onChange={e => update('phone', e.target.value)} />

          {/* Preview truth score */}
          <div style={{ background: 'rgba(201,168,76,0.06)', border: '1px solid rgba(201,168,76,0.15)', borderRadius: '1rem', padding: '1rem', marginBottom: '1.25rem' }}>
            <p style={{ color: '#c9a84c', fontSize: '0.78rem', fontWeight: 700, marginBottom: '0.5rem' }}>✦ Your Truth Score Preview</p>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {[
                { label: 'Profile filled', done: !!(form.name && form.title && form.bio.length > 100) },
                { label: 'Photo added', done: !!form.photo },
                { label: 'Website linked', done: !!form.website },
                { label: 'Contact info', done: !!(form.email || form.phone) },
                { label: 'Instagram', done: !!form.instagram },
              ].map(item => (
                <span key={item.label} style={{ padding: '0.2rem 0.6rem', borderRadius: '999px', fontSize: '0.68rem', background: item.done ? 'rgba(74,222,128,0.1)' : 'rgba(255,255,255,0.04)', border: item.done ? '1px solid rgba(74,222,128,0.2)' : '1px solid rgba(255,255,255,0.08)', color: item.done ? '#4ade80' : 'rgba(255,255,255,0.3)' }}>{item.done ? '✓' : '○'} {item.label}</span>
              ))}
            </div>
          </div>

          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button onClick={() => setStep(2)} style={{ flex: 1, padding: '0.875rem', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '999px', color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem', cursor: 'pointer' }}>← Back</button>
            <button onClick={handleSubmit} disabled={saving || !(form.email || form.website || form.instagram)} style={{ flex: 2, padding: '0.875rem', background: 'linear-gradient(135deg, rgba(201,168,76,0.25), rgba(167,139,250,0.15))', border: '1px solid rgba(201,168,76,0.4)', borderRadius: '999px', color: '#c9a84c', fontSize: '0.9rem', fontWeight: 700, cursor: 'pointer' }}>{saving ? 'Publishing...' : '✨ Publish My Listing'}</button>
          </div>
        </div>
      )}
    </div>
  );
}
