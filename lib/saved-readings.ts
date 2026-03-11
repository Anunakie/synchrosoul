export interface SavedReading {
  id: string;
  type: 'numerology' | 'tarot' | 'oracle' | 'compatibility' | 'karmic-debt' | 'personal-year' | 'relationships' | 'synthesis' | 'cosmic-report' | 'affirmation' | 'other';
  title: string;
  subtitle?: string;
  content: string;
  metadata?: Record<string, any>;
  savedAt: string;
  emoji?: string;
}

const KEY = 'synchrosoul_saved_readings';

export function getSavedReadings(): SavedReading[] {
  if (typeof window === 'undefined') return [];
  try {
    return JSON.parse(localStorage.getItem(KEY) || '[]');
  } catch { return []; }
}

export function saveReading(reading: Omit<SavedReading, 'id' | 'savedAt'>): SavedReading {
  const all = getSavedReadings();
  const newReading: SavedReading = {
    ...reading,
    id: Date.now().toString(36) + Math.random().toString(36).slice(2),
    savedAt: new Date().toISOString(),
  };
  localStorage.setItem(KEY, JSON.stringify([newReading, ...all]));
  return newReading;
}

export function deleteReading(id: string): void {
  const all = getSavedReadings().filter(r => r.id !== id);
  localStorage.setItem(KEY, JSON.stringify(all));
}

export function isReadingSaved(title: string, type: string): string | null {
  const all = getSavedReadings();
  const found = all.find(r => r.title === title && r.type === type);
  return found ? found.id : null;
}
