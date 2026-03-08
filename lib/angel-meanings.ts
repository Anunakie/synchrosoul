export interface AngelMeaning {
  number: string
  title: string
  message: string
  keywords: string[]
  color: string
}

export const ANGEL_MEANINGS: Record<string, AngelMeaning> = {
  '000': { number: '000', title: 'Infinite Potential', message: 'You are at the beginning of a spiritual cycle. The universe is resetting and offering you a blank canvas. Embrace the void — it holds everything.', keywords: ['infinity', 'reset', 'potential', 'wholeness'], color: '#a0a0ff' },
  '111': { number: '111', title: 'Manifestation Portal', message: 'Your thoughts are seeds being planted in the cosmic field right now. What you focus on is rapidly taking form. Think only of what you truly desire.', keywords: ['manifestation', 'new beginnings', 'alignment', 'intention'], color: '#ffd700' },
  '222': { number: '222', title: 'Divine Balance', message: 'Trust the process. Everything is unfolding in perfect divine timing. Your partnerships and relationships are being blessed and balanced.', keywords: ['balance', 'harmony', 'trust', 'partnership'], color: '#88ddff' },
  '333': { number: '333', title: 'Ascended Masters', message: 'The ascended masters are near, offering guidance and love. You are being supported by powerful spiritual forces. Speak your truth boldly.', keywords: ['guidance', 'creativity', 'expression', 'masters'], color: '#ffaa44' },
  '444': { number: '444', title: 'Angelic Protection', message: 'You are completely surrounded and protected by angels. They are working behind the scenes on your behalf. You are safe. You are loved.', keywords: ['protection', 'stability', 'angels', 'foundation'], color: '#44ffaa' },
  '555': { number: '555', title: 'Sacred Change', message: 'A major transformation is sweeping through your life. Release what no longer serves you. The change coming is divinely orchestrated for your highest good.', keywords: ['change', 'transformation', 'freedom', 'adventure'], color: '#ff88cc' },
  '666': { number: '666', title: 'Realign Your Focus', message: 'Gently redirect your thoughts from fear and material worry back to love and spirit. You are more than your circumstances. Reconnect with your higher self.', keywords: ['balance', 'realignment', 'love', 'healing'], color: '#cc88ff' },
  '777': { number: '777', title: 'Divine Magic', message: 'You are in perfect alignment with the universe. Miracles are flowing to you. This is the luckiest of all signs — the cosmos is conspiring in your favor.', keywords: ['luck', 'magic', 'wisdom', 'spiritual awakening'], color: '#ffdd44' },
  '888': { number: '888', title: 'Infinite Abundance', message: 'The flow of abundance is opening to you on all levels — financial, spiritual, emotional. You are in the stream of infinite prosperity. Receive it fully.', keywords: ['abundance', 'prosperity', 'infinity', 'success'], color: '#44ddff' },
  '999': { number: '999', title: 'Sacred Completion', message: 'A significant chapter of your life is completing. Honor what has been, release it with gratitude, and prepare for the magnificent new beginning that awaits.', keywords: ['completion', 'release', 'endings', 'lightworker'], color: '#ff6688' },
  '1010': { number: '1010', title: 'Awakening Code', message: 'You are awakening to your true spiritual nature. Pay attention to your thoughts and intuitions — they are direct messages from your higher self and the divine.', keywords: ['awakening', 'intuition', 'higher self', 'divine'], color: '#aaffdd' },
  '1111': { number: '1111', title: 'Cosmic Gateway', message: 'A powerful portal is open. The veil between worlds is thin. Make a wish, set an intention, and know that the universe heard you. This is the most powerful sign.', keywords: ['portal', 'wish', 'synchronicity', 'awakening'], color: '#ffffff' },
  '1212': { number: '1212', title: 'Spiritual Growth', message: 'You are on the right path. Keep your thoughts positive and your vision clear. Your spiritual growth is accelerating and your soul mission is becoming clearer.', keywords: ['growth', 'path', 'mission', 'positivity'], color: '#ffccaa' },
  '1234': { number: '1234', title: 'Step by Step', message: 'You are progressing perfectly, one step at a time. Trust the journey. Each step you take is guided and purposeful. Keep moving forward with faith.', keywords: ['progress', 'steps', 'journey', 'trust'], color: '#aaccff' },
  '2222': { number: '2222', title: 'Master Builder', message: 'You are building something of great spiritual significance. Your patience and faith are creating a foundation that will stand for lifetimes. Keep going.', keywords: ['building', 'patience', 'faith', 'master'], color: '#88ffcc' },
  '3333': { number: '3333', title: 'Trinity Power', message: 'Mind, body, and spirit are aligning in perfect trinity. The holy trinity of creation is active in your life. You are a powerful co-creator with the divine.', keywords: ['trinity', 'creation', 'alignment', 'power'], color: '#ffaa88' },
  '4444': { number: '4444', title: 'Angelic Army', message: 'An entire legion of angels surrounds you right now. You have more spiritual support than you can imagine. You are never alone on this journey.', keywords: ['angels', 'support', 'protection', 'legion'], color: '#88ffaa' },
  '5555': { number: '5555', title: 'Quantum Shift', message: 'A quantum leap in your consciousness and life circumstances is occurring. This is not a small change — this is a complete dimensional shift. Embrace it.', keywords: ['quantum', 'shift', 'leap', 'transformation'], color: '#ff88ff' },
}

export function getAngelMeaning(number: string): AngelMeaning {
  const clean = number.replace(/\s/g, '')
  if (ANGEL_MEANINGS[clean]) return ANGEL_MEANINGS[clean]
  // Generate a generic reading for unknown numbers
  const digits = clean.split('').map(Number)
  const sum = digits.reduce((a, b) => a + b, 0)
  const reduced = sum > 9 ? sum.toString().split('').map(Number).reduce((a, b) => a + b, 0) : sum
  const base = ANGEL_MEANINGS[reduced.toString().repeat(3)] || ANGEL_MEANINGS['1111']
  return {
    number: clean,
    title: `Frequency ${clean}`,
    message: `The number ${clean} carries a unique vibrational frequency meant specifically for you in this moment. Its energy resonates with ${base.title.toLowerCase()} — trust what you felt when you saw it.`,
    keywords: base.keywords,
    color: base.color,
  }
}

export const QUICK_NUMBERS = ['111','222','333','444','555','777','888','999','1111','1212','1234','2222']
