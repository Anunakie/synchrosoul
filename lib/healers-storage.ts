'use client';

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

const HEALERS_KEY = 'synchrosoul_healers';
const MY_HEALER_KEY = 'synchrosoul_my_healer_profile';

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

export const DEMO_HEALERS: HealerProfile[] = [
  {
    id: 'demo-1',
    name: 'Luna Starweaver',
    title: 'Reiki Master & Sound Healer',
    bio: 'I have been walking the path of energy healing for over 12 years. My sessions combine Usui Reiki with 432Hz crystal singing bowls to clear energetic blockages and restore your natural flow. I specialize in angel number activations and helping clients decode the messages their guides are sending.',
    location: 'Los Angeles, CA',
    city: 'Los Angeles',
    state: 'CA',
    country: 'US',
    modalities: ['Reiki', 'Sound Healing', 'Crystal Healing', 'Chakra Balancing'],
    angelNumbers: ['1111', '444', '777'],
    lifePathNumber: 7,
    photo: '',
    website: 'https://example.com',
    email: 'luna@example.com',
    instagram: '@lunastarweaver',
    sessionTypes: ['both'],
    priceRange: '$80 - $150',
    verified: true,
    truthScore: 92,
    createdAt: new Date(Date.now() - 86400000 * 30).toISOString(),
    isDemo: true,
  },
  {
    id: 'demo-2',
    name: 'Dr. Sage Moonfield',
    title: 'Naturopathic Physician & Numerologist',
    bio: 'Board-certified naturopathic doctor with a deep passion for the intersection of science and spirituality. I use numerology to create personalized wellness protocols, combining herbal medicine, nutrition, and energy work. My practice is guided by the belief that your angel numbers hold the key to your healing path.',
    location: 'Portland, OR',
    city: 'Portland',
    state: 'OR',
    country: 'US',
    modalities: ['Naturopathic Medicine', 'Numerology', 'Herbalism', 'Ayurveda'],
    angelNumbers: ['333', '888', '222'],
    lifePathNumber: 11,
    photo: '',
    website: 'https://example.com',
    email: 'sage@example.com',
    sessionTypes: ['both'],
    priceRange: '$120 - $200',
    verified: true,
    truthScore: 98,
    createdAt: new Date(Date.now() - 86400000 * 60).toISOString(),
    isDemo: true,
  },
  {
    id: 'demo-3',
    name: 'River Celestine',
    title: 'Shamanic Healer & Breathwork Facilitator',
    bio: 'Trained in traditional Peruvian shamanic practices and modern breathwork modalities. I guide clients through transformational journeys to release trauma, connect with spirit guides, and align with their soul purpose. Each session is uniquely tailored to the angel numbers you have been receiving.',
    location: 'Sedona, AZ',
    city: 'Sedona',
    state: 'AZ',
    country: 'US',
    modalities: ['Shamanic Healing', 'Breathwork', 'Past Life Regression', 'Meditation Coaching'],
    angelNumbers: ['555', '999', '1212'],
    lifePathNumber: 9,
    photo: '',
    website: 'https://example.com',
    email: 'river@example.com',
    instagram: '@rivercelestine',
    sessionTypes: ['in-person'],
    priceRange: '$150 - $300',
    verified: true,
    truthScore: 88,
    createdAt: new Date(Date.now() - 86400000 * 14).toISOString(),
    isDemo: true,
  },
  {
    id: 'demo-4',
    name: 'Aria Goldensun',
    title: 'Crystal Healer & Tarot Reader',
    bio: 'Certified crystal healer and intuitive tarot reader with 8 years of experience. I create custom crystal grids aligned to your numerology profile and angel number patterns. My readings combine traditional tarot with angel oracle cards for deeply personalized guidance.',
    location: 'Austin, TX',
    city: 'Austin',
    state: 'TX',
    country: 'US',
    modalities: ['Crystal Healing', 'Tarot & Oracle', 'Numerology', 'Chakra Balancing'],
    angelNumbers: ['222', '444', '888'],
    lifePathNumber: 6,
    photo: '',
    email: 'aria@example.com',
    instagram: '@ariagoldensun',
    sessionTypes: ['virtual'],
    priceRange: '$60 - $120',
    verified: false,
    truthScore: 75,
    createdAt: new Date(Date.now() - 86400000 * 7).toISOString(),
    isDemo: true,
  },
  {
    id: 'demo-5',
    name: 'Zephyr Nightbloom',
    title: 'Quantum Healer & Human Design Analyst',
    bio: 'I combine quantum healing techniques with Human Design to help you understand your energetic blueprint. My sessions reveal how your angel numbers interact with your Human Design type and authority, creating a roadmap for aligned living and accelerated spiritual growth.',
    location: 'New York, NY',
    city: 'New York',
    state: 'NY',
    country: 'US',
    modalities: ['Quantum Healing', 'Human Design', 'EFT / Tapping', 'Somatic Therapy'],
    angelNumbers: ['1111', '1212', '777'],
    lifePathNumber: 3,
    photo: '',
    website: 'https://example.com',
    email: 'zephyr@example.com',
    sessionTypes: ['virtual'],
    priceRange: '$100 - $180',
    verified: true,
    truthScore: 85,
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    isDemo: true,
  },
];

export function getHealers(): HealerProfile[] {
  if (typeof window === 'undefined') return DEMO_HEALERS;
  try {
    const stored = JSON.parse(localStorage.getItem(HEALERS_KEY) || '[]');
    return [...DEMO_HEALERS, ...stored];
  } catch {
    return DEMO_HEALERS;
  }
}

export function saveHealerProfile(profile: Omit<HealerProfile, 'id' | 'createdAt' | 'verified' | 'truthScore'>): HealerProfile {
  const newProfile: HealerProfile = {
    ...profile,
    id: 'healer-' + Date.now() + '-' + Math.random().toString(36).slice(2),
    createdAt: new Date().toISOString(),
    verified: false,
    truthScore: calculateHealerTruthScore(profile),
  };
  if (typeof window !== 'undefined') {
    const existing = JSON.parse(localStorage.getItem(HEALERS_KEY) || '[]');
    existing.push(newProfile);
    localStorage.setItem(HEALERS_KEY, JSON.stringify(existing));
    localStorage.setItem(MY_HEALER_KEY, JSON.stringify(newProfile));
  }
  return newProfile;
}

export function getMyHealerProfile(): HealerProfile | null {
  if (typeof window === 'undefined') return null;
  try {
    const stored = localStorage.getItem(MY_HEALER_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch {
    return null;
  }
}

export function updateMyHealerProfile(updates: Partial<HealerProfile>): void {
  if (typeof window === 'undefined') return;
  const current = getMyHealerProfile();
  if (!current) return;
  const updated = { ...current, ...updates };
  localStorage.setItem(MY_HEALER_KEY, JSON.stringify(updated));
  const all = JSON.parse(localStorage.getItem(HEALERS_KEY) || '[]');
  const idx = all.findIndex((h: HealerProfile) => h.id === current.id);
  if (idx >= 0) {
    all[idx] = updated;
    localStorage.setItem(HEALERS_KEY, JSON.stringify(all));
  }
}

function calculateHealerTruthScore(profile: Partial<HealerProfile>): number {
  let score = 40;
  if (profile.bio && profile.bio.length > 100) score += 15;
  if (profile.photo) score += 15;
  if (profile.website) score += 10;
  if (profile.email) score += 5;
  if (profile.instagram) score += 5;
  if (profile.modalities && profile.modalities.length >= 2) score += 5;
  if (profile.angelNumbers && profile.angelNumbers.length >= 1) score += 5;
  return Math.min(score, 100);
}

export function calculateCosmicAlignment(userLifePath: number, healerLifePath?: number): number {
  if (!healerLifePath) return 50;
  const compatible: Record<number, number[]> = {
    1: [1, 5, 7],
    2: [2, 4, 6, 8],
    3: [3, 6, 9],
    4: [2, 4, 8],
    5: [1, 5, 7],
    6: [2, 3, 6, 9],
    7: [1, 5, 7],
    8: [2, 4, 8],
    9: [3, 6, 9],
    11: [2, 11, 22],
    22: [4, 11, 22],
    33: [6, 33],
  };
  const matches = compatible[userLifePath] || [];
  if (userLifePath === healerLifePath) return 95;
  if (matches.includes(healerLifePath)) return Math.floor(75 + Math.random() * 15);
  return Math.floor(45 + Math.random() * 25);
}

export function searchHealers(healers: HealerProfile[], query: string, modality: string, sessionType: string): HealerProfile[] {
  return healers.filter(h => {
    const q = query.toLowerCase();
    const matchesQuery = !query ||
      h.name.toLowerCase().includes(q) ||
      h.bio.toLowerCase().includes(q) ||
      h.location.toLowerCase().includes(q) ||
      h.city.toLowerCase().includes(q) ||
      h.modalities.some(m => m.toLowerCase().includes(q)) ||
      h.angelNumbers.some(n => n.includes(q));
    const matchesModality = !modality || h.modalities.includes(modality);
    const matchesSession = !sessionType || h.sessionTypes.includes(sessionType as 'in-person' | 'virtual' | 'both') || h.sessionTypes.includes('both');
    return matchesQuery && matchesModality && matchesSession;
  });
}
