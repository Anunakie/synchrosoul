'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  getHealers,
  searchHealers,
  calculateCosmicAlignment,
  MODALITIES,
  type HealerProfile,
} from '@/lib/healers-storage';
import { getNumerologyProfile } from '@/lib/storage';
import { createBooking } from '@/lib/healer-bookings';
import ReportModal from '@/components/ReportModal';

const MODALITY_EMOJIS: Record<string, string> = {
  'Reiki': '✋',
  'Sound Healing': '🎵',
  'Crystal Healing': '💎',
  'Naturopathic Medicine': '🌿',
  'Acupuncture': '🪡',
  'Shamanic Healing': '🪶',
  'Breathwork': '💨',
  'Chakra Balancing': '🌈',
  'Quantum Healing': '⚛️',
  'Herbalism': '🌱',
  'Astrology': '⭐',
  'Human Design': '🧬',
  'Somatic Therapy': '🫀',
  'Meditation Coaching': '🧘',
  'Numerology': '🔢',
  'Tarot & Oracle': '🃏',
  'Past Life Regression': '🌀',
  'EFT / Tapping': '🤲',
  'Ayurveda': '🪷',
  'Hypnotherapy': '🌙',
};

function TruthBadge({ score, verified }: { score: number; verified: boolean }) {
  if (verified) return (
    <span style={{ background: 'rgba(34,197,94,0.15)', border: '1px solid rgba(34,197,94,0.3)', borderRadius: '999px', padding: '0.15rem 0.5rem', fontSize: '0.62rem', color: '#4ade80', fontWeight: 700 }}>✓ Verified</span>
  );
  if (score >= 70) return (
    <span style={{ background: 'rgba(201,168,76,0.15)', border: '1px solid rgba(201,168,76,0.3)', borderRadius: '999px', padding: '0.15rem 0.5rem', fontSize: '0.62rem', color: '#c9a84c', fontWeight: 700 }}>✶ Angel Approved</span>
  );
  return (
    <span style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '999px', padding: '0.15rem 0.5rem', fontSize: '0.62rem', color: 'rgba(255,255,255,0.4)', fontWeight: 700 }}>Unverified</span>
  );
}

function AlignmentRing({ score }: { score: number }) {
  const color = score >= 80 ? '#c9a84c' : score >= 60 ? '#a78bfa' : '#22d3ee';
  return (
    <div style={{ textAlign: 'center', flexShrink: 0 }}>
      <div style={{ width: '48px', height: '48px', borderRadius: '50%', border: '2px solid ' + color + '40', background: color + '10', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
        <span style={{ color, fontSize: '0.75rem', fontWeight: 800, lineHeight: 1 }}>{score}%</span>
      </div>
      <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.55rem', marginTop: '0.2rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Cosmic</p>
    </div>
  );
}

function BookingModal({ healer, onClose }: { healer: HealerProfile; onClose: () => void }) {
  const [sessionType, setSessionType] = useState<'virtual' | 'in-person'>('virtual');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [message, setMessage] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    try {
      const p = JSON.parse(localStorage.getItem('synchrosoul_social_profile') || '{}');
      if (p.displayName) setName(p.displayName);
    } catch {}
    // Set min date to tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    setDate(tomorrow.toISOString().split('T')[0]);
  }, []);

  // Parse price from healer priceRange string e.g. "$60-120/hr" -> avg
  const parsePrice = (priceRange: string): number => {
    const nums = (priceRange || '').match(/\d+/g);
    if (!nums) return 80;
    if (nums.length >= 2) return Math.round((parseInt(nums[0]) + parseInt(nums[1])) / 2);
    return parseInt(nums[0]) || 80;
  };
  const sessionPrice = parsePrice(healer.priceRange || '$80/hr');
  const platformFee = Math.round(sessionPrice * 0.12 * 100) / 100;
  const healerReceives = Math.round((sessionPrice - platformFee) * 100) / 100;

  const handleSubmit = async () => {
    if (!date || !time || !name || !email) return;
    setSubmitting(true);
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          healerId: healer.id,
          healerName: healer.name,
          sessionType,
          preferredDate: date,
          preferredTime: time,
          message,
          priceUSD: sessionPrice,
        }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else if (data.error === 'Healer has not connected Stripe yet') {
        // Fallback: save booking without payment
        await createBooking({
          healerId: healer.id,
          healerName: healer.name,
          healerModality: healer.modalities[0] || 'Healing',
          userName: name,
          userEmail: email,
          sessionType,
          preferredDate: date,
          preferredTime: time,
          message,
        });
        setSuccess(true);
      } else {
        throw new Error(data.error || 'Checkout failed');
      }
    } catch (e) {
      console.error(e);
      alert('Something went wrong. Please try again.');
    }
    setSubmitting(false);
  };

  const inputStyle = { width: '100%', padding: '0.75rem 1rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(200,180,255,0.15)', borderRadius: '0.75rem', color: 'rgba(220,200,255,0.9)', fontSize: '0.875rem', outline: 'none', boxSizing: 'border-box' as const };
  const labelStyle = { display: 'block', fontSize: '0.65rem', color: 'rgba(180,160,255,0.5)', textTransform: 'uppercase' as const, letterSpacing: '0.08em', marginBottom: '0.4rem' };

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 1000, display: 'flex', alignItems: 'flex-end', justifyContent: 'center', background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)', paddingBottom: '70px' }} onClick={onClose}>
      <div style={{ width: '100%', maxWidth: '480px', background: 'rgba(8,6,28,0.98)', border: '1px solid rgba(200,180,255,0.15)', borderRadius: '1.5rem 1.5rem 0 0', padding: '1.5rem 1.25rem 1.5rem', maxHeight: '85vh', overflowY: 'auto', overflowX: 'hidden' }} onClick={e => e.stopPropagation()}>

        {success ? (
          <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
            <div style={{ fontSize: '3.5rem', marginBottom: '1rem' }}>✨</div>
            <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.6rem', fontWeight: 300, color: 'rgba(220,200,255,0.95)', marginBottom: '0.5rem' }}>Request Sent!</h2>
            <p style={{ color: 'rgba(180,160,255,0.6)', fontSize: '0.875rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
              Your booking request has been sent to <strong style={{ color: 'rgba(220,200,255,0.8)' }}>{healer.name}</strong>. They will confirm your session shortly.
            </p>
            <div style={{ background: 'rgba(74,222,128,0.08)', border: '1px solid rgba(74,222,128,0.2)', borderRadius: '1rem', padding: '1rem', marginBottom: '1.5rem' }}>
              <p style={{ color: 'rgba(134,239,172,0.8)', fontSize: '0.8rem' }}>📅 {new Date(date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })} at {time}</p>
              <p style={{ color: 'rgba(134,239,172,0.6)', fontSize: '0.75rem', marginTop: '0.25rem', textTransform: 'capitalize' }}>{sessionType} session</p>
            </div>
            <Link href="/dashboard/my-bookings" onClick={onClose} style={{ display: 'block', background: 'linear-gradient(135deg, #7c3aed, #a78bfa)', borderRadius: '0.875rem', color: 'white', fontSize: '0.875rem', fontWeight: 500, padding: '0.875rem', textDecoration: 'none', textAlign: 'center', marginBottom: '0.75rem' }}>View My Bookings</Link>
            <button onClick={onClose} style={{ width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(200,180,255,0.1)', borderRadius: '0.875rem', color: 'rgba(180,160,255,0.6)', fontSize: '0.875rem', padding: '0.875rem', cursor: 'pointer' }}>Close</button>
          </div>
        ) : (
          <>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <div>
                <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.4rem', fontWeight: 300, color: 'rgba(220,200,255,0.95)', marginBottom: '0.15rem' }}>Book a Session</h2>
                <p style={{ color: 'rgba(180,160,255,0.5)', fontSize: '0.78rem' }}>with {healer.name}</p>
              </div>
              <button onClick={onClose} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(200,180,255,0.1)', borderRadius: '50%', width: '2rem', height: '2rem', color: 'rgba(180,160,255,0.6)', fontSize: '1rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>
            </div>

            {/* Session type */}
            <div style={{ marginBottom: '1rem' }}>
              <label style={labelStyle}>Session Type</label>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                {(['virtual', 'in-person'] as const).map(t => (
                  <button key={t} onClick={() => setSessionType(t)} style={{ flex: 1, padding: '0.625rem', borderRadius: '0.75rem', cursor: 'pointer', background: sessionType === t ? 'rgba(167,139,250,0.2)' : 'rgba(255,255,255,0.04)', color: sessionType === t ? 'rgba(220,200,255,0.9)' : 'rgba(180,160,255,0.45)', fontSize: '0.82rem', fontWeight: sessionType === t ? 600 : 400, textTransform: 'capitalize', border: sessionType === t ? '1px solid rgba(167,139,250,0.3)' : '1px solid rgba(255,255,255,0.06)' }}>
                    {t === 'virtual' ? '💻 Virtual' : '📍 In-person'}
                  </button>
                ))}
              </div>
            </div>

            {/* Date & Time */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
              <div>
                <label style={labelStyle}>Preferred Date</label>
                <input type="date" value={date} onChange={e => setDate(e.target.value)} min={new Date(Date.now() + 86400000).toISOString().split('T')[0]} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Preferred Time</label>
                <input type="time" value={time} onChange={e => setTime(e.target.value)} style={inputStyle} />
              </div>
            </div>

            {/* Name & Email */}
            <div style={{ marginBottom: '1rem' }}>
              <label style={labelStyle}>Your Name</label>
              <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="Your name" style={inputStyle} />
            </div>
            <div style={{ marginBottom: '1rem' }}>
              <label style={labelStyle}>Your Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" style={inputStyle} />
            </div>

            {/* Message */}
            <div style={{ marginBottom: '1.25rem' }}>
              <label style={labelStyle}>Message to Healer (optional)</label>
              <textarea value={message} onChange={e => setMessage(e.target.value)} placeholder="Share what you're seeking healing for, any angel numbers you've been seeing, or questions you have..." rows={3} style={{ ...inputStyle, resize: 'none', lineHeight: 1.5 }} />
            </div>

            {/* Price breakdown */}
            <div style={{ background: 'rgba(201,168,76,0.06)', border: '1px solid rgba(201,168,76,0.2)', borderRadius: '0.75rem', padding: '0.875rem 1rem', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.78rem' }}>Session fee</span>
                <span style={{ color: '#fff', fontSize: '0.9rem', fontWeight: 700 }}>${sessionPrice}.00</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '0.5rem', borderBottom: '1px solid rgba(201,168,76,0.15)', marginBottom: '0.5rem' }}>
                <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.72rem' }}>Platform fee (12%)</span>
                <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.72rem' }}>-${platformFee.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: '#c9a84c', fontSize: '0.78rem', fontWeight: 600 }}>Healer receives</span>
                <span style={{ color: '#c9a84c', fontSize: '0.9rem', fontWeight: 700 }}>${healerReceives.toFixed(2)}</span>
              </div>
              <p style={{ color: 'rgba(180,160,255,0.4)', fontSize: '0.65rem', marginTop: '0.5rem' }}>🔒 Secure payment via Stripe. You will be redirected to complete payment.</p>
            </div>

            <button
              onClick={handleSubmit}
              disabled={submitting || !date || !time || !name || !email}
              style={{ width: '100%', background: (!date || !time || !name || !email) ? 'rgba(167,139,250,0.15)' : 'linear-gradient(135deg, #5469d4, #7c3aed)', border: 'none', borderRadius: '0.875rem', color: (!date || !time || !name || !email) ? 'rgba(180,160,255,0.4)' : 'white', fontSize: '0.9rem', fontWeight: 600, padding: '0.875rem', cursor: (!date || !time || !name || !email) ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
            >
              {submitting ? '⏳ Redirecting to payment...' : `💳 Book & Pay $${sessionPrice}.00`}
            </button>
          </>
        )}
      </div>
    </div>
  );
}

function HealerCard({ healer, userLifePath }: { healer: HealerProfile; userLifePath: number }) {
  const [expanded, setExpanded] = useState(false);
  const [showBooking, setShowBooking] = useState(false);
  const [showReport, setShowReport] = useState(false);
  const alignment = calculateCosmicAlignment(userLifePath, healer.lifePathNumber);
  const initials = healer.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2).toUpperCase();
  const avatarColor = ['#c9a84c', '#a78bfa', '#22d3ee', '#f472b6', '#4ade80'][healer.name.charCodeAt(0) % 5];

  return (
    <>
      {showBooking && <BookingModal healer={healer} onClose={() => setShowBooking(false)} />}
      {showReport && (
        <ReportModal
          isOpen={showReport}
          onClose={() => setShowReport(false)}
          targetType="healer"
          targetId={healer.id}
          targetName={healer.name}
        />
      )}
      <div style={{ background: 'rgba(8,6,28,0.92)', borderRadius: '1.5rem', border: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(16px)', overflow: 'hidden', marginBottom: '0.75rem' }}>
        {/* Header */}
        <div style={{ padding: '1.25rem', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: healer.photo ? 'transparent' : avatarColor + '20', border: '2px solid ' + avatarColor + '30', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, overflow: 'hidden' }}>
            {healer.photo
              ? <img src={healer.photo} alt={healer.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              : <span style={{ color: avatarColor, fontWeight: 800, fontSize: '1.1rem', fontFamily: 'Cormorant Garamond, serif' }}>{initials}</span>
            }
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.2rem' }}>
              <h3 style={{ color: '#fff', fontWeight: 700, fontSize: '1rem', fontFamily: 'Cormorant Garamond, serif' }}>{healer.name}</h3>
              <TruthBadge score={healer.truthScore} verified={healer.verified} />
            </div>
            <p style={{ color: avatarColor, fontSize: '0.78rem', fontWeight: 600, marginBottom: '0.3rem' }}>{healer.title}</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
              <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.72rem' }}>📍 {healer.location}</span>
              <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.72rem' }}>
                {healer.sessionTypes.includes('both') ? '🌐 In-person & Virtual' : healer.sessionTypes.includes('virtual') ? '💻 Virtual' : '📍 In-person'}
              </span>
              <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.72rem' }}>💰 {healer.priceRange}</span>
            </div>
          </div>
          <AlignmentRing score={alignment} />
        </div>

        {/* Angel numbers & modalities */}
        <div style={{ paddingLeft: '1.25rem', paddingRight: '1.25rem', paddingBottom: '0.75rem', display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
          {healer.angelNumbers.map((n: string) => (
            <span key={n} style={{ background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.2)', borderRadius: '999px', padding: '0.15rem 0.5rem', fontSize: '0.68rem', color: '#c9a84c', fontWeight: 700, fontFamily: 'Cormorant Garamond, serif' }}>{n}</span>
          ))}
          {healer.modalities.slice(0, 3).map((m: string) => (
            <span key={m} style={{ background: 'rgba(167,139,250,0.08)', border: '1px solid rgba(167,139,250,0.15)', borderRadius: '999px', padding: '0.15rem 0.5rem', fontSize: '0.68rem', color: 'rgba(167,139,250,0.8)' }}>{MODALITY_EMOJIS[m] || '✶'} {m}</span>
          ))}
          {healer.modalities.length > 3 && (
            <span style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '999px', padding: '0.15rem 0.5rem', fontSize: '0.68rem', color: 'rgba(255,255,255,0.3)' }}>+{healer.modalities.length - 3} more</span>
          )}
        </div>

        {/* Book button - always visible */}
        <div style={{ paddingLeft: '1.25rem', paddingRight: '1.25rem', paddingBottom: '0.875rem' }}>
          <button
            onClick={() => setShowBooking(true)}
            style={{ width: '100%', background: 'linear-gradient(135deg, rgba(84,105,212,0.6), rgba(124,58,237,0.5))', border: '1px solid rgba(167,139,250,0.3)', borderRadius: '0.875rem', color: 'rgba(220,200,255,0.95)', fontSize: '0.875rem', fontWeight: 600, padding: '0.75rem', cursor: 'pointer', letterSpacing: '0.02em', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}
          >
            💳 Book &amp; Pay · {healer.priceRange}
          </button>
        </div>

        {/* Expand toggle + Report */}
        <div style={{ display: 'flex', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <button onClick={() => setExpanded(!expanded)} style={{ flex: 1, padding: '0.6rem', background: 'rgba(255,255,255,0.03)', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem' }}>
            {expanded ? '▲ Less' : '▼ View Profile'}
          </button>
          <button onClick={() => setShowReport(true)} title="Report this healer"
            style={{ padding: '0.6rem 0.75rem', background: 'none', border: 'none',
              borderLeft: '1px solid rgba(255,255,255,0.05)',
              cursor: 'pointer', color: 'rgba(255,255,255,0.2)', fontSize: '0.8rem' }}
            onMouseEnter={e => (e.currentTarget.style.color = 'rgba(239,68,68,0.7)')}
            onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.2)')}
          >&#9873;</button>
        </div>

        {/* Expanded content */}
        {expanded && (
          <div style={{ padding: '1.25rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
            <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.85rem', lineHeight: 1.7, marginBottom: '1.25rem', fontStyle: 'italic', fontFamily: 'Cormorant Garamond, serif' }}>&ldquo;{healer.bio}&rdquo;</p>
            <div style={{ marginBottom: '1rem' }}>
              <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>Specialties</p>
              <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
                {healer.modalities.map((m: string) => (
                  <span key={m} style={{ background: 'rgba(167,139,250,0.08)', border: '1px solid rgba(167,139,250,0.15)', borderRadius: '999px', padding: '0.2rem 0.6rem', fontSize: '0.72rem', color: 'rgba(167,139,250,0.8)' }}>{MODALITY_EMOJIS[m] || '✶'} {m}</span>
                ))}
              </div>
            </div>
            <div style={{ background: 'rgba(201,168,76,0.06)', border: '1px solid rgba(201,168,76,0.12)', borderRadius: '1rem', padding: '0.875rem', marginBottom: '1rem' }}>
              <p style={{ color: '#c9a84c', fontSize: '0.75rem', fontWeight: 700, marginBottom: '0.25rem' }}>✶ Cosmic Alignment: {alignment}%</p>
              <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.75rem' }}>
                {alignment >= 80 ? 'Highly compatible — your energies are in deep resonance.' : alignment >= 60 ? 'Good compatibility — complementary healing energies.' : 'Neutral alignment — all healers can serve your journey.'}
              </p>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {healer.email && (
                <a href={'mailto:' + healer.email} style={{ flex: 1, minWidth: '120px', padding: '0.6rem 1rem', background: 'rgba(34,211,238,0.1)', border: '1px solid rgba(34,211,238,0.25)', borderRadius: '999px', color: '#22d3ee', fontSize: '0.78rem', fontWeight: 700, textAlign: 'center', textDecoration: 'none' }}>✉ Email</a>
              )}
              {healer.website && (
                <a href={healer.website} target="_blank" rel="noopener noreferrer" style={{ flex: 1, minWidth: '120px', padding: '0.6rem 1rem', background: 'rgba(167,139,250,0.1)', border: '1px solid rgba(167,139,250,0.25)', borderRadius: '999px', color: '#a78bfa', fontSize: '0.78rem', fontWeight: 700, textAlign: 'center', textDecoration: 'none' }}>🌐 Website</a>
              )}
              {healer.instagram && (
                <a href={'https://instagram.com/' + healer.instagram.replace('@','')} target="_blank" rel="noopener noreferrer" style={{ flex: 1, minWidth: '120px', padding: '0.6rem 1rem', background: 'rgba(244,114,182,0.1)', border: '1px solid rgba(244,114,182,0.25)', borderRadius: '999px', color: '#f472b6', fontSize: '0.78rem', fontWeight: 700, textAlign: 'center', textDecoration: 'none' }}>📸 Instagram</a>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default function HealersPage() {
  const [healers, setHealers] = useState<HealerProfile[]>([]);
  const [filtered, setFiltered] = useState<HealerProfile[]>([]);
  const [query, setQuery] = useState('');
  const [modality, setModality] = useState('');
  const [sessionType, setSessionType] = useState('');
  const [sortBy, setSortBy] = useState<'alignment' | 'recent' | 'verified'>('alignment');
  const [userLifePath, setUserLifePath] = useState(7);

  useEffect(() => {
    const allHealers = getHealers();
    setHealers(allHealers);
    setFiltered(allHealers);
    getNumerologyProfile().then(p => { if (p?.lifePath) setUserLifePath(p.lifePath); });
  }, []);

  useEffect(() => {
    let results = query || modality || sessionType
      ? searchHealers(healers, query, modality, sessionType)
      : [...healers];
    if (sortBy === 'alignment') results.sort((a, b) => calculateCosmicAlignment(userLifePath, b.lifePathNumber) - calculateCosmicAlignment(userLifePath, a.lifePathNumber));
    else if (sortBy === 'verified') results.sort((a, b) => (b.verified ? 1 : 0) - (a.verified ? 1 : 0));
    else results.sort((a, b) => b.id.localeCompare(a.id));
    setFiltered(results);
  }, [query, modality, sessionType, sortBy, healers, userLifePath]);

  return (
    <div style={{ maxWidth: '480px', margin: '0 auto', padding: '1.5rem 1rem 2rem' }}>
      <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
        <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>🌿</div>
        <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.8rem', fontWeight: 300, color: 'rgba(220,200,255,0.95)', marginBottom: '0.25rem' }}>Find a Local Healer</h1>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem' }}>Connect with energy healers, naturopathic physicians & spiritual guides</p>
      </div>

      <Link href="/dashboard/healers/register" style={{ textDecoration: 'none', display: 'block', marginBottom: '1.25rem' }}>
        <div style={{ background: 'linear-gradient(135deg, rgba(201,168,76,0.12), rgba(167,139,250,0.08))', border: '1px solid rgba(201,168,76,0.25)', borderRadius: '1.25rem', padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <span style={{ fontSize: '1.75rem' }}>✨</span>
          <div style={{ flex: 1 }}>
            <p style={{ color: '#c9a84c', fontWeight: 700, fontSize: '0.9rem', marginBottom: '0.15rem' }}>Are you a healer or practitioner?</p>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem' }}>List your practice and connect with spiritually-aligned clients</p>
          </div>
          <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '1.2rem' }}>›</span>
        </div>
      </Link>

      <div style={{ marginBottom: '0.75rem' }}>
        <input type="text" placeholder="Search by name, location, modality, angel number..." value={query} onChange={e => setQuery(e.target.value)} style={{ width: '100%', padding: '0.75rem 1rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '999px', color: '#fff', fontSize: '0.85rem', outline: 'none', boxSizing: 'border-box' }} />
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem', overflowX: 'auto', paddingBottom: '0.25rem' }}>
        <select value={modality} onChange={e => setModality(e.target.value)} style={{ flexShrink: 0, padding: '0.4rem 0.75rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '999px', color: modality ? '#a78bfa' : 'rgba(255,255,255,0.4)', fontSize: '0.75rem', cursor: 'pointer', outline: 'none' }}>
          <option value="">All Modalities</option>
          {MODALITIES.map((m: string) => <option key={m} value={m}>{m}</option>)}
        </select>
        <select value={sessionType} onChange={e => setSessionType(e.target.value)} style={{ flexShrink: 0, padding: '0.4rem 0.75rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '999px', color: sessionType ? '#22d3ee' : 'rgba(255,255,255,0.4)', fontSize: '0.75rem', cursor: 'pointer', outline: 'none' }}>
          <option value="">In-person & Virtual</option>
          <option value="in-person">In-person Only</option>
          <option value="virtual">Virtual Only</option>
        </select>
        <select value={sortBy} onChange={e => setSortBy(e.target.value as 'alignment' | 'recent' | 'verified')} style={{ flexShrink: 0, padding: '0.4rem 0.75rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '999px', color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem', cursor: 'pointer', outline: 'none' }}>
          <option value="alignment">Sort: Cosmic Alignment</option>
          <option value="verified">Sort: Verified First</option>
          <option value="recent">Sort: Newest</option>
        </select>
      </div>

      <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.72rem', marginBottom: '1rem' }}>{filtered.length} healer{filtered.length !== 1 ? 's' : ''} found</p>

      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'rgba(255,255,255,0.3)' }}>
          <p style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🌿</p>
          <p>No healers found matching your search.</p>
          <p style={{ fontSize: '0.8rem', marginTop: '0.5rem' }}>Try adjusting your filters or <Link href="/dashboard/healers/register" style={{ color: '#c9a84c' }}>list yourself</Link>.</p>
        </div>
      ) : (
        filtered.map((h: HealerProfile) => <HealerCard key={h.id} healer={h} userLifePath={userLifePath} />)
      )}
    </div>
  );
}
