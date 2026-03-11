'use client';
import { createClient } from '@/lib/supabase/client';

export interface HealerBooking {
  id: string;
  healerId: string;
  healerName: string;
  healerModality: string;
  userId: string;
  userName: string;
  userEmail: string;
  sessionType: 'virtual' | 'in-person';
  preferredDate: string;
  preferredTime: string;
  message: string;
  status: 'pending' | 'confirmed' | 'declined' | 'completed';
  createdAt: string;
}

const KEY = 'synchrosoul_healer_bookings';

export function getLocalBookings(): HealerBooking[] {
  try { return JSON.parse(localStorage.getItem(KEY) || '[]'); } catch { return []; }
}

export function saveLocalBooking(booking: HealerBooking): void {
  const bookings = getLocalBookings();
  bookings.unshift(booking);
  localStorage.setItem(KEY, JSON.stringify(bookings));
}

export async function createBooking(data: Omit<HealerBooking, 'id' | 'userId' | 'status' | 'createdAt'>): Promise<HealerBooking> {
  const booking: HealerBooking = {
    ...data,
    id: crypto.randomUUID(),
    userId: 'local',
    status: 'pending',
    createdAt: new Date().toISOString(),
  };

  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      booking.userId = user.id;
      const { data: saved, error } = await supabase.from('healer_bookings').insert({
        id: booking.id,
        healer_id: booking.healerId,
        healer_name: booking.healerName,
        healer_modality: booking.healerModality,
        user_id: user.id,
        user_name: booking.userName,
        user_email: booking.userEmail,
        session_type: booking.sessionType,
        preferred_date: booking.preferredDate,
        preferred_time: booking.preferredTime,
        message: booking.message,
        status: 'pending',
      }).select().single();
      if (!error && saved) {
        saveLocalBooking(booking);
        return booking;
      }
    }
  } catch (e) {
    console.error('Booking save error:', e);
  }

  saveLocalBooking(booking);
  return booking;
}

export async function getUserBookings(): Promise<HealerBooking[]> {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data } = await supabase
        .from('healer_bookings')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });
      if (data && data.length > 0) {
        return data.map(b => ({
          id: b.id, healerId: b.healer_id, healerName: b.healer_name,
          healerModality: b.healer_modality, userId: b.user_id,
          userName: b.user_name, userEmail: b.user_email,
          sessionType: b.session_type, preferredDate: b.preferred_date,
          preferredTime: b.preferred_time, message: b.message,
          status: b.status, createdAt: b.created_at,
        }));
      }
    }
  } catch {}
  return getLocalBookings();
}
