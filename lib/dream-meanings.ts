export interface DreamSymbol {
  emoji: string
  label: string
  meaning: string
  angelConnection: string
  color: string
}

export const DREAM_SYMBOLS: Record<string, DreamSymbol> = {
  flying: {
    emoji: '🕊️',
    label: 'Flying',
    meaning: 'Liberation from earthly constraints. Your soul is expanding beyond current limitations.',
    angelConnection: 'Angels are lifting you toward your highest potential.',
    color: '#a78bfa',
  },
  water: {
    emoji: '🌊',
    label: 'Water',
    meaning: 'Emotional depth and spiritual flow. Clarity is coming through feeling.',
    angelConnection: 'The divine feminine is cleansing your energy field.',
    color: '#38bdf8',
  },
  light: {
    emoji: '✨',
    label: 'Light',
    meaning: 'Divine presence and awakening. You are being illuminated from within.',
    angelConnection: 'Direct angelic contact. A message is being delivered.',
    color: '#fde68a',
  },
  falling: {
    emoji: '🍂',
    label: 'Falling',
    meaning: 'Releasing control. The universe is asking you to surrender and trust.',
    angelConnection: 'Angels are catching you. Let go of what no longer serves.',
    color: '#fb923c',
  },
  animals: {
    emoji: '🦋',
    label: 'Animals',
    meaning: 'Spirit guides in animal form. Pay attention to which animal appeared.',
    angelConnection: 'Your spirit animal is delivering a message from the cosmos.',
    color: '#4ade80',
  },
  numbers: {
    emoji: '🔢',
    label: 'Numbers',
    meaning: 'Sacred geometry and divine codes. The universe speaks in mathematics.',
    angelConnection: 'Angel numbers in dreams carry triple the waking power.',
    color: '#c084fc',
  },
  people: {
    emoji: '👥',
    label: 'People',
    meaning: 'Aspects of yourself or soul contracts being revealed.',
    angelConnection: 'Souls you are meant to meet or heal connections with.',
    color: '#f472b6',
  },
  death: {
    emoji: '🌑',
    label: 'Death / Endings',
    meaning: 'Transformation and rebirth. Something old is completing its cycle.',
    angelConnection: 'The angels of transition are guiding a powerful shift in your life.',
    color: '#94a3b8',
  },
  house: {
    emoji: '🏛️',
    label: 'House / Building',
    meaning: 'Your inner self and psyche. Each room represents a different aspect of you.',
    angelConnection: 'You are being shown the architecture of your soul.',
    color: '#c9a84c',
  },
  chase: {
    emoji: '🌀',
    label: 'Being Chased',
    meaning: 'Avoiding something in waking life. Time to face what you are running from.',
    angelConnection: 'Angels urge you to turn around and confront your shadow.',
    color: '#f87171',
  },
  stars: {
    emoji: '⭐',
    label: 'Stars / Space',
    meaning: 'Cosmic connection and your place in the universe. You are stardust remembering itself.',
    angelConnection: 'You are receiving transmissions from higher dimensions.',
    color: '#e0e7ff',
  },
  mirror: {
    emoji: '🪞',
    label: 'Mirror / Reflection',
    meaning: 'Self-examination and truth. What you see reflects your inner reality.',
    angelConnection: 'The angels are showing you who you truly are beneath the surface.',
    color: '#67e8f9',
  },
}

export const MOOD_TAGS = [
  { label: 'Peaceful', emoji: '☮️', color: '#4ade80' },
  { label: 'Vivid', emoji: '🌈', color: '#f472b6' },
  { label: 'Lucid', emoji: '👁️', color: '#a78bfa' },
  { label: 'Prophetic', emoji: '🔮', color: '#c084fc' },
  { label: 'Recurring', emoji: '🔄', color: '#38bdf8' },
  { label: 'Unsettling', emoji: '🌑', color: '#94a3b8' },
  { label: 'Joyful', emoji: '✨', color: '#fde68a' },
  { label: 'Mysterious', emoji: '🌙', color: '#818cf8' },
]

export function getDreamReading(symbols: string[], angelNumbers: string[]): string {
  if (symbols.length === 0 && angelNumbers.length === 0) {
    return 'Your dream carries a personal message. Sit quietly and let its meaning surface naturally.'
  }
  const symbolMeanings = symbols.slice(0, 2).map(s => DREAM_SYMBOLS[s]?.meaning || '').filter(Boolean)
  const numberMsg = angelNumbers.length > 0
    ? ` The presence of ${angelNumbers.join(', ')} amplifies this dream's significance — the universe is speaking directly to you.`
    : ''
  if (symbolMeanings.length > 0) {
    return symbolMeanings[0] + numberMsg
  }
  return 'A sacred dream. The symbols you encountered are weaving a message meant only for you.' + numberMsg
}
