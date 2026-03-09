'use client'
import { useState, useEffect } from 'react'

const KEY = 'synchrosoul_rituals_log'

const RITUALS = [
  {
    id: 'morning-alignment',
    name: 'Morning Alignment',
    emoji: '🌅',
    duration: '10 min',
    category: 'morning',
    color: '#f59e0b',
    description: 'Set the energetic tone for your entire day with this sacred morning practice.',
    steps: [
      'Sit upright in bed before checking your phone. Place hands on heart.',
      'Take 3 deep breaths. With each exhale, release any tension from sleep.',
      'Set one intention for the day. Make it a feeling, not a task.',
      'Speak your angel number affirmation aloud 3 times.',
      'Visualize your day unfolding in perfect divine order for 2 minutes.',
      'Write down any dreams or angel numbers that came to you overnight.',
    ],
    angelNumbers: ['111', '333', '777'],
    benefits: ['Mental clarity', 'Energetic protection', 'Intentional living'],
  },
  {
    id: 'number-activation',
    name: 'Angel Number Activation',
    emoji: '✨',
    duration: '5 min',
    category: 'anytime',
    color: '#a78bfa',
    description: 'Activate the energy of any angel number you have been seeing repeatedly.',
    steps: [
      'Find a quiet space. Hold a crystal or place hands on heart.',
      'Write the angel number you keep seeing on paper.',
      'Close your eyes and visualize the number glowing in golden light.',
      'Ask aloud: What message do you have for me?',
      'Sit in silence for 2 minutes and receive whatever comes.',
      'Journal any thoughts, feelings, or images that arose.',
    ],
    angelNumbers: ['1111', '555', '444'],
    benefits: ['Deeper number connection', 'Intuitive downloads', 'Spiritual clarity'],
  },
  {
    id: 'full-moon-release',
    name: 'Full Moon Release',
    emoji: '🌕',
    duration: '20 min',
    category: 'lunar',
    color: '#e879f9',
    description: 'Harness the powerful releasing energy of the full moon to let go of what no longer serves you.',
    steps: [
      'Go outside or sit by a window where you can see or feel the moon.',
      'Light a white or silver candle if available.',
      'Write down everything you wish to release on paper.',
      'Read each item aloud and say: I release this with love and gratitude.',
      'Safely burn the paper or tear it into tiny pieces.',
      'Sit in the moonlight for 5 minutes, feeling lighter and free.',
      'Close with: I am complete. I am whole. I am free.',
    ],
    angelNumbers: ['999', '333', '777'],
    benefits: ['Emotional release', 'Energetic clearing', 'Cycle completion'],
  },
  {
    id: 'new-moon-manifestation',
    name: 'New Moon Manifestation',
    emoji: '🌑',
    duration: '20 min',
    category: 'lunar',
    color: '#60a5fa',
    description: 'Plant seeds of intention during the potent new moon energy for powerful manifestation.',
    steps: [
      'Create a sacred space. Dim lights, light a candle, play soft music.',
      'Ground yourself with 5 deep breaths.',
      'Write 10 intentions as if they have already happened. Use I am or I have.',
      'For each intention, feel the emotion of it being real right now.',
      'Fold the paper and place it under a crystal or in a special box.',
      'Say: These seeds are planted. The universe conspires in my favor.',
      'Leave the paper undisturbed until the full moon.',
    ],
    angelNumbers: ['111', '222', '888'],
    benefits: ['Manifestation power', 'Clarity of desire', 'Cosmic alignment'],
  },
  {
    id: 'evening-gratitude',
    name: 'Evening Gratitude Ritual',
    emoji: '🌟',
    duration: '8 min',
    category: 'evening',
    color: '#34d399',
    description: 'Close your day with a heart-opening gratitude practice that programs your subconscious for abundance.',
    steps: [
      'Lie down or sit comfortably. Place hands on heart.',
      'Recall 3 specific moments from today that you are grateful for.',
      'For each one, feel the gratitude in your body — not just think it.',
      'Thank any angel numbers you saw today for their guidance.',
      'Set an intention for your dreams tonight.',
      'Breathe deeply 5 times, feeling completely at peace.',
    ],
    angelNumbers: ['444', '222', '999'],
    benefits: ['Better sleep', 'Abundance mindset', 'Emotional healing'],
  },
  {
    id: 'chakra-clearing',
    name: 'Chakra Clearing Breath',
    emoji: '🌀',
    duration: '12 min',
    category: 'healing',
    color: '#f472b6',
    description: 'Clear and activate all seven chakras using breath, visualization, and sound.',
    steps: [
      'Sit with spine straight. Close eyes and relax your jaw.',
      'Root: Breathe red light into the base of your spine. Hum the sound LAM.',
      'Sacral: Breathe orange light into your lower belly. Hum VAM.',
      'Solar Plexus: Breathe yellow light into your upper belly. Hum RAM.',
      'Heart: Breathe green light into your chest. Hum YAM.',
      'Throat: Breathe blue light into your throat. Hum HAM.',
      'Third Eye: Breathe indigo light between your brows. Hum OM.',
      'Crown: Breathe violet light into the top of your head. Sit in silence.',
      'Visualize all chakras spinning in harmony as one unified field of light.',
    ],
    angelNumbers: ['777', '333', '1111'],
    benefits: ['Energy alignment', 'Emotional balance', 'Spiritual activation'],
  },
  {
    id: 'mirror-work',
    name: 'Mirror Affirmation Work',
    emoji: '🪞',
    duration: '5 min',
    category: 'healing',
    color: '#c9a84c',
    description: 'The most powerful self-love practice. Look into your own eyes and speak truth.',
    steps: [
      'Stand before a mirror in private. Look directly into your own eyes.',
      'Take 3 slow breaths and soften your gaze.',
      'Say your name and speak: I love you. I really, truly love you.',
      'Speak 5 affirmations that feel challenging but true.',
      'Notice any resistance — that is exactly where healing is needed.',
      'End with: I am enough. I have always been enough.',
    ],
    angelNumbers: ['222', '444', '666'],
    benefits: ['Self-love', 'Confidence', 'Inner child healing'],
  },
  {
    id: 'synchronicity-walk',
    name: 'Synchronicity Walk',
    emoji: '🚶',
    duration: '20 min',
    category: 'anytime',
    color: '#fb923c',
    description: 'A mindful walk where you actively invite and notice signs from the universe.',
    steps: [
      'Before leaving, set an intention: Show me a sign about [your question].',
      'Walk slowly and mindfully. Leave your phone in your pocket.',
      'Notice numbers on buildings, license plates, clocks, receipts.',
      'Pay attention to animals, overheard conversations, and songs.',
      'Trust that everything you notice is meaningful.',
      'When you return, journal every synchronicity you experienced.',
    ],
    angelNumbers: ['555', '1111', '777'],
    benefits: ['Heightened awareness', 'Divine connection', 'Playful spirituality'],
  },
]

const CATEGORIES = [
  { id: 'all', label: 'All', emoji: '✦' },
  { id: 'morning', label: 'Morning', emoji: '🌅' },
  { id: 'evening', label: 'Evening', emoji: '🌟' },
  { id: 'lunar', label: 'Lunar', emoji: '🌕' },
  { id: 'healing', label: 'Healing', emoji: '💚' },
  { id: 'anytime', label: 'Anytime', emoji: '✨' },
]

interface RitualLog {
  id: number
  ritualId: string
  notes: string
  completedAt: string
}

export default function RitualsPage() {
  const [logs, setLogs] = useState<RitualLog[]>([])
  const [category, setCategory] = useState('all')
  const [expanded, setExpanded] = useState<string | null>(null)
  const [completing, setCompleting] = useState<string | null>(null)
  const [notes, setNotes] = useState('')

  useEffect(() => {
    const s = localStorage.getItem(KEY)
    if (s) setLogs(JSON.parse(s))
  }, [])

  function completeRitual(ritualId: string) {
    const log: RitualLog = { id: Date.now(), ritualId, notes, completedAt: new Date().toISOString() }
    const next = [log, ...logs]
    setLogs(next)
    localStorage.setItem(KEY, JSON.stringify(next))
    setCompleting(null)
    setNotes('')
  }

  function getCompletionCount(ritualId: string) {
    return logs.filter(l => l.ritualId === ritualId).length
  }

  function getLastCompleted(ritualId: string) {
    const last = logs.find(l => l.ritualId === ritualId)
    if (!last) return null
    const d = new Date(last.completedAt)
    const today = new Date(); today.setHours(0,0,0,0)
    const diff = Math.floor((today.getTime() - d.setHours(0,0,0,0)) / 86400000)
    if (diff === 0) return 'Today'
    if (diff === 1) return 'Yesterday'
    return `${diff}d ago`
  }

  const filtered = category === 'all' ? RITUALS : RITUALS.filter(r => r.category === category)
  const card = { background: 'rgba(8,6,28,0.88)', border: '1px solid rgba(200,180,255,0.12)', borderRadius: '1.25rem', backdropFilter: 'blur(12px)' } as React.CSSProperties

  return (
    <div style={{ maxWidth: '680px', margin: '0 auto', padding: '1.5rem 1rem 2rem' }}>
      <div style={{ marginBottom: '1.25rem' }}>
        <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.8rem', color: 'rgba(220,200,255,0.95)', margin: '0 0 0.25rem', fontWeight: 400 }}>Sacred Rituals</h1>
        <p style={{ color: 'rgba(180,160,255,0.5)', fontSize: '0.8rem', margin: 0 }}>{logs.length} rituals completed · {RITUALS.length} practices available</p>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.5rem', marginBottom: '1.25rem' }}>
        {[
          { label: 'Completed', value: logs.length, emoji: '✦', color: '#c9a84c' },
          { label: 'This Week', value: logs.filter(l => new Date(l.completedAt) > new Date(Date.now() - 7*86400000)).length, emoji: '🔥', color: '#f59e0b' },
          { label: 'Unique', value: new Set(logs.map(l => l.ritualId)).size, emoji: '🌸', color: '#f472b6' },
        ].map(s => (
          <div key={s.label} style={{ ...card, padding: '0.875rem', textAlign: 'center' }}>
            <div style={{ fontSize: '1.1rem', marginBottom: '0.2rem' }}>{s.emoji}</div>
            <div style={{ color: s.color, fontSize: '1.2rem', fontWeight: 700 }}>{s.value}</div>
            <div style={{ color: 'rgba(180,160,255,0.4)', fontSize: '0.6rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Category filter */}
      <div style={{ display: 'flex', gap: '0.4rem', overflowX: 'auto', paddingBottom: '0.25rem', marginBottom: '1.25rem' }}>
        {CATEGORIES.map(c => (
          <button key={c.id} onClick={() => setCategory(c.id)} style={{ flexShrink: 0, padding: '0.35rem 0.75rem', borderRadius: '2rem', border: category === c.id ? '1px solid rgba(167,139,250,0.5)' : '1px solid rgba(200,180,255,0.1)', background: category === c.id ? 'rgba(167,139,250,0.15)' : 'rgba(8,6,28,0.7)', color: category === c.id ? '#a78bfa' : 'rgba(180,160,255,0.45)', fontSize: '0.72rem', cursor: 'pointer', whiteSpace: 'nowrap' }}>{c.emoji} {c.label}</button>
        ))}
      </div>

      {/* Rituals */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {filtered.map(ritual => {
          const count = getCompletionCount(ritual.id)
          const last = getLastCompleted(ritual.id)
          const isExpanded = expanded === ritual.id
          const isCompleting = completing === ritual.id
          return (
            <div key={ritual.id} style={{ ...card, borderColor: isExpanded ? `${ritual.color}33` : 'rgba(200,180,255,0.12)' }}>
              <div onClick={() => setExpanded(isExpanded ? null : ritual.id)} style={{ padding: '1rem 1.25rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
                <div style={{ width: '2.75rem', height: '2.75rem', borderRadius: '0.875rem', background: `${ritual.color}18`, border: `1px solid ${ritual.color}33`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem', flexShrink: 0 }}>{ritual.emoji}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ color: 'rgba(220,200,255,0.9)', fontSize: '0.9rem', fontWeight: 600, marginBottom: '0.2rem' }}>{ritual.name}</div>
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <span style={{ color: 'rgba(180,160,255,0.4)', fontSize: '0.7rem' }}>⏱ {ritual.duration}</span>
                    {count > 0 && <span style={{ color: ritual.color, fontSize: '0.7rem' }}>✦ {count}x {last && `· ${last}`}</span>}
                  </div>
                </div>
                <span style={{ color: 'rgba(180,160,255,0.3)', fontSize: '0.8rem', transform: isExpanded ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>⌄</span>
              </div>

              {isExpanded && (
                <div style={{ padding: '0 1.25rem 1.25rem', borderTop: '1px solid rgba(200,180,255,0.06)' }}>
                  <p style={{ color: 'rgba(200,180,255,0.7)', fontSize: '0.85rem', margin: '0.875rem 0', lineHeight: 1.6 }}>{ritual.description}</p>

                  <div style={{ color: 'rgba(180,160,255,0.4)', fontSize: '0.62rem', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.625rem' }}>Steps</div>
                  {ritual.steps.map((step, i) => (
                    <div key={i} style={{ display: 'flex', gap: '0.75rem', marginBottom: '0.5rem', alignItems: 'flex-start' }}>
                      <div style={{ width: '1.4rem', height: '1.4rem', borderRadius: '50%', background: `${ritual.color}18`, border: `1px solid ${ritual.color}33`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: ritual.color, fontSize: '0.65rem', fontWeight: 700, flexShrink: 0, marginTop: '0.05rem' }}>{i+1}</div>
                      <p style={{ color: 'rgba(200,180,255,0.7)', fontSize: '0.82rem', margin: 0, lineHeight: 1.5 }}>{step}</p>
                    </div>
                  ))}

                  <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', margin: '0.875rem 0' }}>
                    {ritual.benefits.map(b => <span key={b} style={{ padding: '0.2rem 0.5rem', borderRadius: '2rem', background: `${ritual.color}10`, border: `1px solid ${ritual.color}22`, color: ritual.color, fontSize: '0.7rem' }}>{b}</span>)}
                  </div>

                  {!isCompleting ? (
                    <button onClick={() => setCompleting(ritual.id)} style={{ width: '100%', padding: '0.65rem', borderRadius: '0.875rem', background: `linear-gradient(135deg, ${ritual.color}88, ${ritual.color})`, border: 'none', color: 'white', fontSize: '0.85rem', cursor: 'pointer', fontWeight: 600 }}>✦ Mark Complete</button>
                  ) : (
                    <div>
                      <textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="How did this ritual feel? Any insights?" rows={2} style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(200,180,255,0.15)', borderRadius: '0.75rem', padding: '0.65rem 0.875rem', color: 'rgba(220,200,255,0.9)', fontSize: '0.85rem', outline: 'none', boxSizing: 'border-box', resize: 'none', marginBottom: '0.5rem' }} />
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button onClick={() => completeRitual(ritual.id)} style={{ flex: 1, padding: '0.65rem', borderRadius: '0.75rem', background: `linear-gradient(135deg, ${ritual.color}88, ${ritual.color})`, border: 'none', color: 'white', fontSize: '0.85rem', cursor: 'pointer', fontWeight: 600 }}>Save ✦</button>
                        <button onClick={() => setCompleting(null)} style={{ padding: '0.65rem 1rem', borderRadius: '0.75rem', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(200,180,255,0.12)', color: 'rgba(180,160,255,0.5)', fontSize: '0.85rem', cursor: 'pointer' }}>Cancel</button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
