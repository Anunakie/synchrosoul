'use client';
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';

interface Booking {
  id: string;
  healer_name: string;
  healer_modality: string;
  session_type: string;
  preferred_date: string;
  preferred_time: string;
  message: string;
  status: string;
  payment_status: string;
  price_usd: number;
  platform_fee_usd: number;
  created_at: string;
}

const statusColors: Record<string, string> = {
  pending: '#c9a84c',
  confirmed: '#4caf50',
  declined: '#f44336',
  completed: '#9c27b0',
};

const paymentColors: Record<string, string> = {
  unpaid: '#888',
  paid: '#4caf50',
  failed: '#f44336',
  refunded: '#c9a84c',
};

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [paymentMsg, setPaymentMsg] = useState('');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('payment') === 'success') setPaymentMsg('Payment successful! Your session is confirmed. ✨');
    if (params.get('payment') === 'cancelled') setPaymentMsg('Payment was cancelled.');
    loadBookings();
  }, []);

  async function loadBookings() {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { setLoading(false); return; }
    const { data } = await supabase
      .from('healer_bookings')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });
    setBookings(data || []);
    setLoading(false);
  }

  return (
    <div style={{ maxWidth: 700, margin: '0 auto', padding: '2rem 1rem' }}>
      <h1 style={{ color: '#c9a84c', fontFamily: 'Cormorant Garamond, serif', fontSize: '2rem', marginBottom: '0.5rem' }}>
        ✨ My Healing Sessions
      </h1>
      <p style={{ color: 'rgba(255,255,255,0.5)', marginBottom: '2rem' }}>Your booked sessions with healers</p>

      {paymentMsg && (
        <div style={{
          background: paymentMsg.includes('successful') ? 'rgba(76,175,80,0.15)' : 'rgba(244,67,54,0.15)',
          border: '1px solid ' + (paymentMsg.includes('successful') ? '#4caf50' : '#f44336'),
          borderRadius: 12, padding: '1rem', marginBottom: '1.5rem', color: '#fff'
        }}>
          {paymentMsg}
        </div>
      )}

      {loading && <p style={{ color: 'rgba(255,255,255,0.5)' }}>Loading your sessions...</p>}

      {!loading && bookings.length === 0 && (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'rgba(255,255,255,0.4)' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🌿</div>
          <p>No healing sessions booked yet.</p>
          <a href="/dashboard/healers" style={{ color: '#c9a84c', textDecoration: 'none' }}>Find a Healer &rarr;</a>
        </div>
      )}

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {bookings.map((bk) => (
          <div key={bk.id} style={{
            background: 'rgba(8,6,28,0.88)', border: '1px solid rgba(201,168,76,0.2)',
            borderRadius: 16, padding: '1.5rem', backdropFilter: 'blur(12px)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div>
                <h3 style={{ color: '#fff', margin: 0, fontSize: '1.1rem' }}>{bk.healer_name}</h3>
                <p style={{ color: 'rgba(255,255,255,0.5)', margin: '0.25rem 0 0', fontSize: '0.85rem' }}>{bk.healer_modality}</p>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                <span style={{
                  background: (statusColors[bk.status] || '#888') + '22',
                  color: statusColors[bk.status] || '#888',
                  border: '1px solid ' + (statusColors[bk.status] || '#888') + '44',
                  borderRadius: 20, padding: '0.2rem 0.75rem', fontSize: '0.75rem', fontWeight: 600
                }}>{bk.status.toUpperCase()}</span>
                <span style={{
                  background: (paymentColors[bk.payment_status || 'unpaid'] || '#888') + '22',
                  color: paymentColors[bk.payment_status || 'unpaid'] || '#888',
                  border: '1px solid ' + (paymentColors[bk.payment_status || 'unpaid'] || '#888') + '44',
                  borderRadius: 20, padding: '0.2rem 0.75rem', fontSize: '0.75rem', fontWeight: 600
                }}>{(bk.payment_status || 'unpaid').toUpperCase()}</span>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.75rem', marginTop: '1rem' }}>
              <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 8, padding: '0.5rem 0.75rem' }}>
                <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.7rem', marginBottom: '0.2rem' }}>SESSION TYPE</div>
                <div style={{ color: '#fff', fontSize: '0.9rem' }}>{bk.session_type === 'virtual' ? '💻 Virtual' : '🌿 In-Person'}</div>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 8, padding: '0.5rem 0.75rem' }}>
                <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.7rem', marginBottom: '0.2rem' }}>DATE</div>
                <div style={{ color: '#fff', fontSize: '0.9rem' }}>{bk.preferred_date}</div>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: 8, padding: '0.5rem 0.75rem' }}>
                <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.7rem', marginBottom: '0.2rem' }}>TIME</div>
                <div style={{ color: '#fff', fontSize: '0.9rem' }}>{bk.preferred_time}</div>
              </div>
              {bk.price_usd && (
                <div style={{ background: 'rgba(201,168,76,0.08)', borderRadius: 8, padding: '0.5rem 0.75rem', border: '1px solid rgba(201,168,76,0.2)' }}>
                  <div style={{ color: 'rgba(201,168,76,0.6)', fontSize: '0.7rem', marginBottom: '0.2rem' }}>AMOUNT PAID</div>
                  <div style={{ color: '#c9a84c', fontSize: '0.9rem', fontWeight: 700 }}>${bk.price_usd?.toFixed(2)}</div>
                </div>
              )}
            </div>

            {bk.message && (
              <div style={{ marginTop: '0.75rem', color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', fontStyle: 'italic' }}>
                &ldquo;{bk.message}&rdquo;
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
