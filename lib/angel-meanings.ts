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
  '11111': { number: '11111', title: 'Master Manifestation Portal', message: 'Five ones amplify the manifestation gateway to its highest power. Every thought you hold right now is being instantly co-created with the universe. You are a living portal of creation — choose your focus with sacred intention.', keywords: ['manifestation', 'portal', 'creation', 'mastery'], color: '#ffffff' },
  '22222': { number: '22222', title: 'Divine Architecture', message: 'The master builder energy is at its peak. You are being called to construct something of profound spiritual significance. The universe is your co-architect — trust the blueprint being revealed to you.', keywords: ['building', 'mastery', 'divine plan', 'architecture'], color: '#88ffcc' },
  '33333': { number: '33333', title: 'Ascended Master Convergence', message: 'All ascended masters are converging around you simultaneously. This is an extraordinarily rare alignment of spiritual guidance. Your creative power and spiritual gifts are being fully activated right now.', keywords: ['masters', 'convergence', 'activation', 'gifts'], color: '#ffaa44' },
  '44444': { number: '44444', title: 'Celestial Fortress', message: 'You are surrounded by the most powerful angelic protection possible. An entire celestial army stands with you. No darkness can touch you. You are completely, absolutely safe in divine love.', keywords: ['protection', 'angels', 'fortress', 'safety'], color: '#44ffaa' },
  '55555': { number: '55555', title: 'Quintuple Transformation', message: 'Five waves of transformation are washing through every dimension of your life simultaneously — physical, emotional, mental, spiritual, and cosmic. This is a once-in-a-lifetime shift. Surrender to the magnitude of what is changing and trust that every transformation serves your highest destiny.', keywords: ['transformation', 'quantum', 'dimensional shift', 'destiny'], color: '#ff88ff' },
  '66666': { number: '66666', title: 'Sacred Realignment', message: 'A deep realignment of your entire being is occurring. Release all fear-based thinking and return to the frequency of unconditional love. Your soul is recalibrating to its highest vibration.', keywords: ['realignment', 'love', 'healing', 'recalibration'], color: '#cc88ff' },
  '77777': { number: '77777', title: 'Cosmic Miracle Field', message: 'You have entered the miracle field. The universe is conspiring in your favor at the highest possible level. Magic is not just possible — it is inevitable. Expect the extraordinary.', keywords: ['miracles', 'magic', 'luck', 'cosmic alignment'], color: '#ffdd44' },
  '88888': { number: '88888', title: 'Infinite Abundance Cascade', message: 'Abundance is cascading into your life from every direction at once — financial, spiritual, relational, and cosmic. The infinite flow of the universe is fully open to you. Receive without limit.', keywords: ['abundance', 'infinity', 'prosperity', 'cascade'], color: '#44ddff' },
  '99999': { number: '99999', title: 'Grand Cosmic Completion', message: 'A grand cycle spanning multiple lifetimes is completing. You are at the culmination of an ancient soul journey. Honor the magnitude of this completion — it is sacred. A new cosmic chapter of unimaginable beauty awaits.', keywords: ['completion', 'cosmic cycle', 'soul journey', 'new beginning'], color: '#ff6688' },
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
