'use client';

import { createClient } from '@/lib/supabase/client';

export interface HealerProfile {
  id: string;
  name: string;
  title: string;
  bio: string;
  location: string;
  city: string;
  state: string;
  country: string;
  modalities: string[];
  angelNumbers: string[];
  lifePathNumber?: number;
  photo?: string;
  website?: string;
  email?: string;
  phone?: string;
  instagram?: string;
  sessionTypes: ('in-person' | 'virtual' | 'both')[];
  priceRange: string;
  verified: boolean;
  truthScore: number;
  createdAt: string;
  userId?: string;
  isDemo?: boolean;
}

export const MODALITIES = [
  'Reiki',
  'Sound Healing',
  'Crystal Healing',
  'Naturopathic Medicine',
  'Acupuncture',
  'Shamanic Healing',
  'Breathwork',
  'Chakra Balancing',
  'Quantum Healing',
  'Herbalism',
  'Astrology',
  'Human Design',
  'Somatic Therapy',
  'Meditation Coaching',
  'Numerology',
  'Tarot & Oracle',
  'Past Life Regression',
  'EFT / Tapping',
  'Ayurveda',
  'Hypnotherapy',
];

function mapDbToProfile(row: Record<string, unknown>): HealerProfile {
  return {
    id: row.id as string,
    name: row.name as string,
    title: row.title as string || '',
    bio: row.bio as string || '',
    location: `${row.city || ''}, ${row.state || ''}`.replace(/^,\s*|,\s*$/g, ''),
    city: row.city as string || '',
    state: row.state as string || '',
    country: row.country as string || '',
    modalities: (row.modalities as string[]) || [],
    angelNumbers: (row.angel_numbers as string[]) || [],
    lifePathNumber: row.life_path_number as number | undefined,
    photo: row.photo as string | undefined,
    website: row.website as string | undefined,
    email: row.email as string | undefined,
    phone: row.phone as string | undefined,
    instagram: row.instagram as string | undefined,
    sessionTypes: (row.session_types as ('in-person' | 'virtual' | 'both')[]) || [],
    priceRange: row.price_range as string || '',
    verified: row.is_verified as boolean || false,
    truthScore: row.truth_score as number || 50,
    createdAt: row.created_at as string || new Date().toISOString(),
    userId: row.user_id as string | undefined,
    isDemo: false,
  };
}

export async function getHealers(): Promise<HealerProfile[]> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('healers')
      .select('*')
      .order('created_at', { ascending: false });
    if (error || !data) return [];
    return data.map(mapDbToProfile);
  } catch {
    return [];
  }
}

export async function saveHealerProfile(
  profile: Omit<HealerProfile, 'id' | 'createdAt' | 'verified' | 'truthScore'>
): Promise<HealerProfile | null> {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const insertData = {
      user_id: user.id,
      name: profile.name,
      title: profile.title,
      bio: profile.bio,
      city: profile.city,
      state: profile.state,
      country: profile.country,
      modalities: profile.modalities,
      angel_numbers: profile.angelNumbers,
      life_path_number: profile.lifePathNumber || null,
      photo: profile.photo || null,
      website: profile.website || null,
      email: profile.email || null,
      phone: profile.phone || null,
      instagram: profile.instagram || null,
      session_types: profile.sessionTypes,
      price_range: profile.priceRange,
      truth_score: calculateHealerTruthScore(profile),
    };

    const { data, error } = await supabase
      .from('healers')
      .insert(insertData)
      .select()
      .single();

    if (error || !data) { console.error('Save healer error:', error); return null; }
    return mapDbToProfile(data);
  } catch (err) {
    console.error('Save healer failed:', err);
    return null;
  }
}

export async function getMyHealerProfile(): Promise<HealerProfile | null> {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from('healers')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (error || !data) return null;
    return mapDbToProfile(data);
  } catch {
    return null;
  }
}

export async function updateMyHealerProfile(updates: Partial<HealerProfile>): Promise<void> {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const updateData: Record<string, unknown> = {};
    if (updates.name !== undefined) updateData.name = updates.name;
    if (updates.title !== undefined) updateData.title = updates.title;
    if (updates.bio !== undefined) updateData.bio = updates.bio;
    if (updates.city !== undefined) updateData.city = updates.city;
    if (updates.state !== undefined) updateData.state = updates.state;
    if (updates.country !== undefined) updateData.country = updates.country;
    if (updates.modalities !== undefined) updateData.modalities = updates.modalities;
    if (updates.angelNumbers !== undefined) updateData.angel_numbers = updates.angelNumbers;
    if (updates.lifePathNumber !== undefined) updateData.life_path_number = updates.lifePathNumber;
    if (updates.photo !== undefined) updateData.photo = updates.photo;
    if (updates.website !== undefined) updateData.website = updates.website;
    if (updates.email !== undefined) updateData.email = updates.email;
    if (updates.phone !== undefined) updateData.phone = updates.phone;
    if (updates.instagram !== undefined) updateData.instagram = updates.instagram;
    if (updates.sessionTypes !== undefined) updateData.session_types = updates.sessionTypes;
    if (updates.priceRange !== undefined) updateData.price_range = updates.priceRange;

    await supabase
      .from('healers')
      .update(updateData)
      .eq('user_id', user.id);
  } catch (err) {
    console.error('Update healer failed:', err);
  }
}

export function calculateHealerTruthScore(
  profile: Partial<HealerProfile>
): number {
  let score = 30;
  if (profile.bio && profile.bio.length > 50) score += 15;
  if (profile.photo) score += 10;
  if (profile.website) score += 10;
  if (profile.modalities && profile.modalities.length > 0) score += 10;
  if (profile.angelNumbers && profile.angelNumbers.length > 0) score += 10;
  if (profile.sessionTypes && profile.sessionTypes.length > 0) score += 5;
  if (profile.priceRange) score += 5;
  if (profile.instagram) score += 5;
  return Math.min(score, 100);
}

export function searchHealers(
  healers: HealerProfile[],
  query: string,
  modality?: string,
  sessionType?: string,
  location?: string
): HealerProfile[] {
  let results = [...healers];
  if (query) {
    const q = query.toLowerCase();
    results = results.filter(
      (h) =>
        h.name.toLowerCase().includes(q) ||
        h.title.toLowerCase().includes(q) ||
        h.bio.toLowerCase().includes(q) ||
        h.modalities.some((m) => m.toLowerCase().includes(q)) ||
        h.location.toLowerCase().includes(q)
    );
  }
  if (modality) {
    results = results.filter((h) => h.modalities.includes(modality));
  }
  if (sessionType) {
    results = results.filter((h) => h.sessionTypes.includes(sessionType as 'in-person' | 'virtual' | 'both'));
  }
  if (location) {
    const loc = location.toLowerCase();
    results = results.filter(
      (h) =>
        h.city.toLowerCase().includes(loc) ||
        h.state.toLowerCase().includes(loc) ||
        h.country.toLowerCase().includes(loc)
    );
  }
  return results;
}

export function calculateCosmicAlignment(userLifePath: number, healerLifePath?: number): number {
  if (!healerLifePath) return 50;
  if (userLifePath === healerLifePath) return 100;
  const compatible: Record<number, number[]> = {
    1: [3, 5, 7], 2: [4, 6, 8], 3: [1, 5, 9],
    4: [2, 6, 8], 5: [1, 3, 7], 6: [2, 4, 9],
    7: [1, 5, 9], 8: [2, 4, 6], 9: [3, 6, 7],
  };
  if (compatible[userLifePath]?.includes(healerLifePath)) return 85;
  return 60;
}
