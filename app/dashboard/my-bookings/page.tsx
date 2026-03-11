'use client';
import { useState, useEffect } from 'react';
import { getUserBookings, HealerBooking } from '@/lib/healer-bookings';
import Link from 'next/link';

const STATUS_CONFIG = {
  pending:   { label: 'Pending',   color: '#f59e0b', bg: 'rgba(245,158,11,0.1)',   border: 'rgba(245,158,11,0.25)' },
  confirmed: { label: 'Confirmed', color: '#4ade80', bg: 'rgba(74,222,128,0.1)',   border: 'rgba(74,222,128,0.25)' },
  declined:  { label: 'Declined',  color: '#f87171', bg: 'rgba(248,113,113,0.1)',  border: 'rgba(248,113,113,0.25)' },
  completed: { label: 'Completed', color: '#a78bfa', bg: 'rgba(167,139,250,0.1)', border: 'rgba(167,139,250,0.25)' },
};

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState<HealerBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'confirmed' | 'completed'>('all');

  useEffect(() => {
    getUserBookings().then(b => { setBookings(b); setLoading(false); });
  }, []);

  const filtered = filter === 'all' ? bookings : bookings.filter(b => b.status === filter);

  return (
    <div style={{ maxWidth: '480px', margin: '0 auto', padding: '1.5rem 1rem 2rem' }}>
      <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
        <div style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>📅</div>
        <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.8rem', fontWeight: 300, color: 'rgba(220,200,255,0.95)', marginBottom: '0.25rem' }}>My Bookings</h1>
        <p style={{ color: 'rgba(180,160,255,0.5)', fontSize: '0.8rem' }}>Your healing session requests</p>
      </div>

      {/* Filter chips */}
      <div style={{ display: 'flex', gap: '0.4rem', marginBottom: '1.25rem', overflowX: 'auto', paddingBottom: '0.25rem' }}>
        {(['all', 'pending', 'confirmed', 'completed'] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)} style={{ flexShrink: 0, padding: '0.35rem 0.875rem', borderRadius: '9999px', border: 'none', cursor: 'pointer', background: filter === f ? 'rgba(167,139,250,0.2)' : 'rgba(255,255,255,0.04)', color: filter === f ? 'rgba(220,200,255,0.9)' : 'rgba(180,160,255,0.45)', fontSize: '0.75rem', fontWeight: filter === f ? 600 : 400, textTransform: 'capitalize' }}>{f}</button>
        ))}
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'rgba(180,160,255,0.4)', fontSize: '0.85rem' }}>Loading bookings...</div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem 1rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🌿</div>
          <p style={{ color: 'rgba(180,160,255,0.5)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>No bookings yet. Find a healer aligned with your energy.</p>
          <Link href="/dashboard/healers" style={{ display: 'inline-block', background: 'linear-gradient(135deg, #7c3aed, #a78bfa)', borderRadius: '0.875rem', color: 'white', fontSize: '0.875rem', fontWeight: 500, padding: '0.75rem 1.5rem', textDecoration: 'none' }}>Find a Healer ✨</Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {filtered.map(booking => {
            const sc = STATUS_CONFIG[booking.status];
            return (
              <div key={booking.id} style={{ background: 'rgba(8,6,28,0.88)', border: '1px solid rgba(200,180,255,0.1)', borderRadius: '1.25rem', padding: '1.25rem', overflow: 'hidden' }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '0.875rem' }}>
                  <div>
                    <div style={{ color: 'rgba(220,200,255,0.9)', fontSize: '1rem', fontWeight: 500, marginBottom: '0.2rem' }}>{booking.healerName}</div>
                    <div style={{ color: 'rgba(180,160,255,0.5)', fontSize: '0.78rem' }}>{booking.healerModality}</div>
                  </div>
                  <span style={{ fontSize: '0.7rem', background: sc.bg, border: '1px solid ' + sc.border, borderRadius: '9999px', padding: '0.2rem 0.625rem', color: sc.color, flexShrink: 0 }}>{sc.label}</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', marginBottom: '0.875rem' }}>
                  <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '0.625rem', padding: '0.5rem 0.75rem' }}>
                    <div style={{ fontSize: '0.6rem', color: 'rgba(180,160,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.2rem' }}>Date</div>
                    <div style={{ fontSize: '0.82rem', color: 'rgba(210,190,255,0.8)' }}>{new Date(booking.preferredDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</div>
                  </div>
                  <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '0.625rem', padding: '0.5rem 0.75rem' }}>
                    <div style={{ fontSize: '0.6rem', color: 'rgba(180,160,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.2rem' }}>Time</div>
                    <div style={{ fontSize: '0.82rem', color: 'rgba(210,190,255,0.8)' }}>{booking.preferredTime}</div>
                  </div>
                  <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '0.625rem', padding: '0.5rem 0.75rem' }}>
                    <div style={{ fontSize: '0.6rem', color: 'rgba(180,160,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.2rem' }}>Session</div>
                    <div style={{ fontSize: '0.82rem', color: 'rgba(210,190,255,0.8)', textTransform: 'capitalize' }}>{booking.sessionType}</div>
                  </div>
                  <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: '0.625rem', padding: '0.5rem 0.75rem' }}>
                    <div style={{ fontSize: '0.6rem', color: 'rgba(180,160,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.2rem' }}>Booked</div>
                    <div style={{ fontSize: '0.82rem', color: 'rgba(210,190,255,0.8)' }}>{new Date(booking.createdAt).toLocaleDateString()}</div>
                  </div>
                </div>
                {booking.message && (
                  <div style={{ background: 'rgba(167,139,250,0.05)', border: '1px solid rgba(167,139,250,0.1)', borderRadius: '0.625rem', padding: '0.625rem 0.875rem' }}>
                    <div style={{ fontSize: '0.6rem', color: 'rgba(180,160,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.3rem' }}>Your message</div>
                    <p style={{ color: 'rgba(200,180,255,0.7)', fontSize: '0.8rem', lineHeight: 1.5, margin: 0 }}>{booking.message}</p>
                  </div>
                )}
                {booking.status === 'pending' && (
                  <p style={{ color: 'rgba(245,158,11,0.6)', fontSize: '0.72rem', marginTop: '0.75rem', textAlign: 'center' }}>⏳ Awaiting healer confirmation</p>
                )}
                {booking.status === 'confirmed' && (
                  <p style={{ color: 'rgba(74,222,128,0.7)', fontSize: '0.72rem', marginTop: '0.75rem', textAlign: 'center' }}>✨ Your session is confirmed! Check your email for details.</p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
