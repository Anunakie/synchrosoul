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
    <span style={{ background: 'rgba(201,168,76,0.15)', border: '1px solid rgba(201,168,76,0.3)', borderRadius: '999px', padding: '0.15rem 0.5rem', fontSize: '0.62rem', color: '#c9a84c', fontWeight: 700 }}>✦ Angel Approved</span>
  );
  return (
    <span style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '999px', padding: '0.15rem 0.5rem', fontSize: '0.62rem', color: 'rgba(255,255,255,0.4)', fontWeight: 700 }}>Unverified</span>
  );
}

function AlignmentRing({ score }: { score: number }) {
  const color = score >= 80 ? '#c9a84c' : score >= 60 ? '#a78bfa' : '#22d3ee';
  return (
    <div style={{ textAlign: 'center', flexShrink: 0 }}>
      <div style={{ width: '48px', height: '48px', borderRadius: '50%', border: `2px solid ${color}40`, background: `${color}10`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column' }}>
        <span style={{ color, fontSize: '0.75rem', fontWeight: 800, lineHeight: 1 }}>{score}%</span>
      </div>
      <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.55rem', marginTop: '0.2rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Cosmic</p>
    </div>
  );
}

function HealerCard({ healer, userLifePath }: { healer: HealerProfile; userLifePath: number }) {
  const [expanded, setExpanded] = useState(false);
  const alignment = calculateCosmicAlignment(userLifePath, healer.lifePathNumber);
  const initials = healer.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();
  const avatarColor = ['#c9a84c', '#a78bfa', '#22d3ee', '#f472b6', '#4ade80'][healer.name.charCodeAt(0) % 5];

  return (
    <div style={{ background: 'rgba(8,6,28,0.92)', borderRadius: '1.5rem', border: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(16px)', overflow: 'hidden', marginBottom: '0.75rem' }}>
      {/* Header */}
      <div style={{ padding: '1.25rem', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
        {/* Avatar */}
        <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: healer.photo ? 'transparent' : `${avatarColor}20`, border: `2px solid ${avatarColor}30`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, overflow: 'hidden' }}>
          {healer.photo
            ? <img src={healer.photo} alt={healer.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            : <span style={{ color: avatarColor, fontWeight: 800, fontSize: '1.1rem', fontFamily: 'Cormorant Garamond, serif' }}>{initials}</span>
          }
        </div>

        {/* Info */}
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

        {/* Alignment */}
        <AlignmentRing score={alignment} />
      </div>

      {/* Angel numbers */}
      <div style={{ paddingLeft: '1.25rem', paddingRight: '1.25rem', paddingBottom: '0.75rem', display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
        {healer.angelNumbers.map(n => (
          <span key={n} style={{ background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.2)', borderRadius: '999px', padding: '0.15rem 0.5rem', fontSize: '0.68rem', color: '#c9a84c', fontWeight: 700, fontFamily: 'Cormorant Garamond, serif' }}>{n}</span>
        ))}
        {healer.modalities.slice(0, 3).map(m => (
          <span key={m} style={{ background: 'rgba(167,139,250,0.08)', border: '1px solid rgba(167,139,250,0.15)', borderRadius: '999px', padding: '0.15rem 0.5rem', fontSize: '0.68rem', color: 'rgba(167,139,250,0.8)' }}>{MODALITY_EMOJIS[m] || '✦'} {m}</span>
        ))}
        {healer.modalities.length > 3 && (
          <span style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '999px', padding: '0.15rem 0.5rem', fontSize: '0.68rem', color: 'rgba(255,255,255,0.3)' }}>+{healer.modalities.length - 3} more</span>
        )}
      </div>

      {/* Expand toggle */}
      <button onClick={() => setExpanded(!expanded)} style={{ width: '100%', padding: '0.6rem', background: 'rgba(255,255,255,0.03)', border: 'none', borderTop: '1px solid rgba(255,255,255,0.05)', cursor: 'pointer', color: 'rgba(255,255,255,0.4)', fontSize: '0.75rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.35rem' }}>
        {expanded ? '▲ Less' : '▼ View Profile'}
      </button>

      {/* Expanded content */}
      {expanded && (
        <div style={{ padding: '1.25rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.85rem', lineHeight: 1.7, marginBottom: '1.25rem', fontStyle: 'italic', fontFamily: 'Cormorant Garamond, serif' }}>&ldquo;{healer.bio}&rdquo;</p>

          {/* All modalities */}
          <div style={{ marginBottom: '1rem' }}>
            <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem' }}>Specialties</p>
            <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap' }}>
              {healer.modalities.map(m => (
                <span key={m} style={{ background: 'rgba(167,139,250,0.08)', border: '1px solid rgba(167,139,250,0.15)', borderRadius: '999px', padding: '0.2rem 0.6rem', fontSize: '0.72rem', color: 'rgba(167,139,250,0.8)' }}>{MODALITY_EMOJIS[m] || '✦'} {m}</span>
              ))}
            </div>
          </div>

          {/* Cosmic alignment detail */}
          <div style={{ background: 'rgba(201,168,76,0.06)', border: '1px solid rgba(201,168,76,0.12)', borderRadius: '1rem', padding: '0.875rem', marginBottom: '1rem' }}>
            <p style={{ color: '#c9a84c', fontSize: '0.75rem', fontWeight: 700, marginBottom: '0.25rem' }}>✦ Cosmic Alignment: {alignment}%</p>
            <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.75rem' }}>
              {alignment >= 80 ? 'Highly compatible — your energies are in deep resonance.' : alignment >= 60 ? 'Good compatibility — complementary healing energies.' : 'Neutral alignment — all healers can serve your journey.'}
            </p>
          </div>

          {/* Contact buttons */}
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            {healer.email && (
              <a href={`mailto:${healer.email}`} style={{ flex: 1, minWidth: '120px', padding: '0.6rem 1rem', background: 'rgba(34,211,238,0.1)', border: '1px solid rgba(34,211,238,0.25)', borderRadius: '999px', color: '#22d3ee', fontSize: '0.78rem', fontWeight: 700, textAlign: 'center', textDecoration: 'none', cursor: 'pointer' }}>✉ Email</a>
            )}
            {healer.website && (
              <a href={healer.website} target="_blank" rel="noopener noreferrer" style={{ flex: 1, minWidth: '120px', padding: '0.6rem 1rem', background: 'rgba(167,139,250,0.1)', border: '1px solid rgba(167,139,250,0.25)', borderRadius: '999px', color: '#a78bfa', fontSize: '0.78rem', fontWeight: 700, textAlign: 'center', textDecoration: 'none' }}>🌐 Website</a>
            )}
            {healer.instagram && (
              <a href={`https://instagram.com/${healer.instagram.replace('@','')}`} target="_blank" rel="noopener noreferrer" style={{ flex: 1, minWidth: '120px', padding: '0.6rem 1rem', background: 'rgba(244,114,182,0.1)', border: '1px solid rgba(244,114,182,0.25)', borderRadius: '999px', color: '#f472b6', fontSize: '0.78rem', fontWeight: 700, textAlign: 'center', textDecoration: 'none' }}>📸 Instagram</a>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function HealersPage() {
  const [healers, setHealers] = useState<HealerProfile[]>([]);
  const [filtered, setFiltered] = useState<HealerProfile[]>([]);
  const [query, setQuery] = useState('');
  const [modality, setModality] = useState('');
  const [sessionType, setSessionType] = useState('');
  const [userLifePath, setUserLifePath] = useState(1);
  const [sortBy, setSortBy] = useState<'alignment' | 'recent' | 'verified'>('alignment');

  useEffect(() => {
    const all = getHealers();
    setHealers(all);
    setFiltered(all);
    (async () => {
      const profile = await getNumerologyProfile();
      if (profile?.lifePath) setUserLifePath(profile.lifePath);
    })();
  }, []);

  useEffect(() => {
    let results = searchHealers(healers, query, modality, sessionType);
    if (sortBy === 'alignment') {
      results = [...results].sort((a, b) => calculateCosmicAlignment(userLifePath, b.lifePathNumber) - calculateCosmicAlignment(userLifePath, a.lifePathNumber));
    } else if (sortBy === 'verified') {
      results = [...results].sort((a, b) => (b.verified ? 1 : 0) - (a.verified ? 1 : 0) || b.truthScore - a.truthScore);
    } else {
      results = [...results].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    }
    setFiltered(results);
  }, [query, modality, sessionType, sortBy, healers, userLifePath]);

  return (
    <div style={{ minHeight: '100vh', padding: '2rem 1rem', maxWidth: '700px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 700, color: '#c9a84c', fontFamily: 'Cormorant Garamond, serif', marginBottom: '0.25rem' }}>🌿 Local Healers</h1>
        <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.85rem' }}>Connect with energy healers, naturopathic physicians & spiritual guides</p>
      </div>

      {/* CTA to register */}
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

      {/* Search */}
      <div style={{ marginBottom: '0.75rem' }}>
        <input
          type="text"
          placeholder="Search by name, location, modality, angel number..."
          value={query}
          onChange={e => setQuery(e.target.value)}
          style={{ width: '100%', padding: '0.75rem 1rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '999px', color: '#fff', fontSize: '0.85rem', outline: 'none', boxSizing: 'border-box' }}
        />
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem', overflowX: 'auto', paddingBottom: '0.25rem' }}>
        <select value={modality} onChange={e => setModality(e.target.value)} style={{ flexShrink: 0, padding: '0.4rem 0.75rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '999px', color: modality ? '#a78bfa' : 'rgba(255,255,255,0.4)', fontSize: '0.75rem', cursor: 'pointer', outline: 'none' }}>
          <option value="">All Modalities</option>
          {MODALITIES.map(m => <option key={m} value={m}>{m}</option>)}
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

      {/* Results count */}
      <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.72rem', marginBottom: '1rem' }}>{filtered.length} healer{filtered.length !== 1 ? 's' : ''} found</p>

      {/* Healer cards */}
      {filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'rgba(255,255,255,0.3)' }}>
          <p style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🌿</p>
          <p>No healers found matching your search.</p>
          <p style={{ fontSize: '0.8rem', marginTop: '0.5rem' }}>Try adjusting your filters or <Link href="/dashboard/healers/register" style={{ color: '#c9a84c' }}>list yourself</Link>.</p>
        </div>
      ) : (
        filtered.map(h => <HealerCard key={h.id} healer={h} userLifePath={userLifePath} />)
      )}
    </div>
  );
}
