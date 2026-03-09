export interface Meditation {
  number: string
  title: string
  duration: string
  theme: string
  color: string
  breathPattern: string
  intro: string
  body: string
  closing: string
}

export const MEDITATIONS: Record<string, Meditation> = {
  '111': {
    number: '111', title: 'New Beginnings Portal', duration: '4 min',
    theme: 'manifestation', color: '#a78bfa',
    breathPattern: 'Inhale 4 counts, hold 1, exhale 4 counts',
    intro: 'You have been seeing 111 — the universe green light. This meditation activates your manifestation portal.',
    body: 'Close your eyes. Feel the space between your thoughts. 111 is a gateway — three ones standing like pillars of light. Breathe in possibility. With each exhale, release what no longer serves your highest vision. You are a creator. The universe is listening. What you hold in your mind with feeling becomes your reality. See your desire clearly. Feel it as already done. The angels who sent you 111 are standing at the threshold with you.',
    closing: 'When you open your eyes, you carry this portal with you. Every 111 you see today is a confirmation: you are on the right path.',
  },
  '222': {
    number: '222', title: 'Divine Balance and Trust', duration: '4 min',
    theme: 'patience', color: '#34d399',
    breathPattern: 'Inhale 4 counts, hold 2, exhale 6 counts',
    intro: '222 is the universe asking you to trust the process. This meditation cultivates deep patience and faith.',
    body: 'Settle into stillness. 222 carries the energy of duality finding harmony — two becoming one, tension becoming peace. Breathe in trust. Breathe out urgency. Everything you have planted is growing beneath the surface, even when you cannot see it. The universe works in perfect timing, not your timing. Feel your body relax into this truth. You do not need to force anything. The right doors are opening. The right people are arriving.',
    closing: 'Carry this peace into your day. When doubt arises, remember: 222 means your angels are working on your behalf.',
  },
  '333': {
    number: '333', title: 'Creative Awakening', duration: '5 min',
    theme: 'creativity', color: '#fbbf24',
    breathPattern: 'Inhale 3 counts, hold 3, exhale 3 counts',
    intro: '333 is the frequency of the ascended masters and pure creative energy. This meditation unlocks your creative channel.',
    body: 'Three is the number of creation — mind, body, spirit in perfect trinity. Breathe in golden light. Feel it fill your throat, your heart, your hands. You are a creative being by nature. Every thought you think is an act of creation. 333 is your reminder that you have divine support in your creative endeavors. The masters who walked this earth before you left their energy in this number. You are connected to that lineage. Let your creativity flow without judgment.',
    closing: 'Your creative gifts are needed in this world. 333 is your permission slip to express them fully.',
  },
  '444': {
    number: '444', title: 'Angelic Foundation', duration: '4 min',
    theme: 'protection', color: '#60a5fa',
    breathPattern: 'Inhale 4 counts, hold 4, exhale 4 counts',
    intro: '444 is the most protective number sequence. Your angels are surrounding you right now.',
    body: 'Feel the ground beneath you. 444 is earth energy — solid, stable, protected. Breathe in safety. You are held. Imagine four pillars of light surrounding you — one at each corner of your being. These are your guardian angels, and they have been with you since before you were born. They sent you 444 as a reminder: you are never alone. Whatever challenge you face, you face it with an invisible army of love beside you. Feel their presence now. Let it dissolve any fear.',
    closing: 'You are protected. You are guided. You are loved. 444 is your angels signature.',
  },
  '555': {
    number: '555', title: 'Sacred Change', duration: '5 min',
    theme: 'transformation', color: '#f97316',
    breathPattern: 'Inhale 5 counts, exhale 5 counts, no hold',
    intro: '555 signals massive transformation. This meditation helps you surrender to change with grace.',
    body: 'Change is the only constant in the universe, and 555 is its herald. Breathe in the energy of transformation. Feel any resistance in your body — the tightness, the fear, the clinging to what was. Now breathe it out. The caterpillar does not resist becoming the butterfly. It surrenders completely to the process. You are in your cocoon right now. The discomfort you feel is not destruction — it is metamorphosis. 555 means the universe has outgrown the container of your old life. A new, expanded version of you is emerging.',
    closing: 'Welcome the change. It is taking you somewhere your old self could not have imagined.',
  },
  '777': {
    number: '777', title: 'Divine Download', duration: '5 min',
    theme: 'wisdom', color: '#8b5cf6',
    breathPattern: 'Inhale 7 counts, hold 7, exhale 7 counts',
    intro: '777 is the rarest and most spiritually significant sequence. You are receiving a direct transmission from the divine.',
    body: 'You are extraordinarily aligned to see 777. This number carries the frequency of divine wisdom, spiritual awakening, and cosmic alignment. Breathe in this rare energy. Feel the crown of your head open like a lotus flower. Information, insight, and wisdom are flowing into you right now — not as words, but as knowing. Trust what arises in this silence. The universe has been preparing you for this moment of clarity. 777 means you are in perfect alignment with your soul purpose.',
    closing: 'You are a channel for divine wisdom. What you received in this meditation is meant to be shared.',
  },
  '888': {
    number: '888', title: 'Infinite Abundance', duration: '4 min',
    theme: 'abundance', color: '#fcd34d',
    breathPattern: 'Inhale 8 counts, exhale 8 counts',
    intro: '888 is the number of infinite abundance and karmic reward. This meditation opens your receiving channel.',
    body: 'The figure eight is infinity turned on its side — endless flow, endless return. Breathe in abundance. Feel any scarcity beliefs in your body. The tightness around money, love, time, opportunity. Now breathe them out. You live in an abundant universe. There is enough. There has always been enough. 888 is the universe receipt — your good karma is being returned to you now. Open your hands, open your heart, open your mind to receive. Abundance flows to those who believe they deserve it.',
    closing: 'You are a magnet for abundance. 888 is your confirmation that prosperity is flowing toward you.',
  },
  '999': {
    number: '999', title: 'Sacred Completion', duration: '5 min',
    theme: 'release', color: '#f43f5e',
    breathPattern: 'Long exhales — inhale 4, exhale 8',
    intro: '999 marks the end of a major cycle. This meditation helps you release the old with gratitude.',
    body: 'Something in your life is completing. A chapter, a relationship, a version of yourself. 999 is not loss — it is graduation. Breathe in gratitude for everything this cycle taught you. The pain, the joy, the lessons, the growth. All of it was necessary. All of it was perfect. Now breathe out attachment to how things were. The universe cannot give you the new while you cling to the old. Release with love. Thank the people, the experiences, the old version of you. They served their purpose beautifully.',
    closing: 'You are complete. You are ready. The next chapter begins now.',
  },
  '1111': {
    number: '1111', title: 'The Master Portal', duration: '6 min',
    theme: 'awakening', color: '#e879f9',
    breathPattern: 'Inhale 4, hold 4, exhale 4, hold 4 (box breathing)',
    intro: '1111 is the master awakening code. Seeing it means you are fully awake and your manifestation power is at its peak.',
    body: 'Four ones. Four pillars of pure potential. 1111 is the universe way of saying: you are awake, you are powerful, and you are watched over. Breathe in this master frequency. Feel every cell in your body vibrate at a higher level. You are not ordinary. You never were. You chose to be here at this exact moment in history, with these exact gifts, for a specific purpose. 1111 is the reminder of that contract. Your thoughts right now are seeds being planted in the quantum field. Choose them wisely. Choose them boldly.',
    closing: 'You are a master manifestor. Every 1111 is a reminder of your extraordinary power.',
  },
}

export function getMeditationForNumber(number: string): Meditation {
  return MEDITATIONS[number] || {
    number,
    title: `${number} Frequency Meditation`,
    duration: '4 min',
    theme: 'alignment',
    color: '#c9a84c',
    breathPattern: 'Inhale 4 counts, hold 2, exhale 6 counts',
    intro: `You have been seeing ${number}. This meditation attunes you to its unique cosmic frequency.`,
    body: `The number ${number} carries a specific vibration that your soul recognizes. Breathe in its energy. Feel it resonate in your chest, your mind, your spirit. You did not see this number by accident. The universe speaks in the language of numbers, and ${number} is a message crafted specifically for you at this moment in your journey. Sit with it. Let its meaning reveal itself not through analysis, but through feeling.`,
    closing: `Carry the frequency of ${number} with you today. Notice how it shows up again.`,
  }
}
