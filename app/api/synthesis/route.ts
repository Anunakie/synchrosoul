
import { NextRequest, NextResponse } from 'next/server';
import { groqChatWithRetry } from '@/lib/groq-retry'
import Groq from 'groq-sdk';

function getGroq() { return new Groq({ apiKey: process.env.GROQ_API_KEY }); }

const ANGEL_MEANINGS: Record<string, { title: string; theme: string }> = {
  '111':  { title: 'Manifestation Portal', theme: 'creation and new beginnings' },
  '222':  { title: 'Divine Balance',       theme: 'patience and harmony' },
  '333':  { title: 'Ascended Masters',     theme: 'creativity and divine guidance' },
  '444':  { title: 'Angelic Protection',   theme: 'stability and foundation' },
  '555':  { title: 'Major Change',         theme: 'transformation and freedom' },
  '666':  { title: 'Rebalance',            theme: 'harmony and compassion' },
  '777':  { title: 'Divine Magic',         theme: 'luck, spirituality and wisdom' },
  '888':  { title: 'Infinite Abundance',   theme: 'abundance and material success' },
  '999':  { title: 'Completion',           theme: 'endings, release and service' },
  '000':  { title: 'Divine Wholeness',     theme: 'infinity and pure potential' },
  '1111': { title: 'Master Portal',        theme: 'awakening and soul alignment' },
  '1212': { title: 'Cosmic Alignment',     theme: 'growth and positive manifestation' },
  '1234': { title: 'Ascending Steps',      theme: 'progress and forward movement' },
  '2222': { title: 'Deep Harmony',         theme: 'divine timing and trust' },
  '3333': { title: 'Trinity Power',        theme: 'mind body spirit alignment' },
  '4444': { title: 'Fortress of Light',    theme: 'ultimate protection and stability' },
  '5555': { title: 'Quantum Shift',        theme: 'massive transformation incoming' },
};

export async function POST(req: NextRequest) {
  try {
    const { logs, profile, period } = await req.json();

    if (!logs || logs.length === 0) {
      return NextResponse.json({
        title: 'The Universe Awaits Your First Log',
        narrative: 'Your cosmic story is just beginning. Start logging the angel numbers you see throughout your day, and the universe will begin weaving a personalized synthesis just for you. Every number you notice is a breadcrumb on your spiritual path.',
        themes: ['Awakening', 'Potential', 'New Beginnings'],
        affirmation: 'I am open to receiving divine messages in every moment.',
        guidance: 'Begin by noticing numbers that appear repeatedly today. Trust your intuition — if a number catches your eye, it is meant for you.',
        dominantNumber: null,
        dominantMeaning: null,
        patternInsight: 'No patterns yet — your journey begins with the first log.',
        energyForecast: 'Pure potential surrounds you.',
      });
    }

    // Build frequency map
    const freq: Record<string, number> = {};
    logs.forEach((l: any) => { freq[l.number] = (freq[l.number] || 0) + 1; });
    const sorted = Object.entries(freq).sort((a: any, b: any) => b[1] - a[1]);
    const dominant = sorted[0][0];
    const dominantData = ANGEL_MEANINGS[dominant];

    // Collect thoughts
    const thoughts = logs
      .filter((l: any) => l.thought)
      .slice(0, 8)
      .map((l: any) => `- ${l.thought}`);

    const lifePath = profile?.lifePathNumber || profile?.lifePath || 'unknown';
    const soulUrge = profile?.soulUrgeNumber || profile?.soulUrge || 'unknown';
    const destiny  = profile?.destinyNumber  || profile?.destiny  || 'unknown';
    const name     = profile?.name || 'Seeker';

    const numberLines = sorted
      .map(([n, c]) => {
        const m = ANGEL_MEANINGS[n];
        return `- ${n} (seen ${c} time${Number(c) > 1 ? 's' : ''}): ${
          m ? m.title + ' — ' + m.theme : 'Sacred sequence'
        }`;
      })
      .join('\n');

    const thoughtsSection = thoughts.length > 0
      ? `Thoughts captured during sightings:\n${thoughts.join('\n')}`
      : '';

    const prompt = `You are a mystical spiritual guide and numerologist writing a personalized Weekly Cosmic Synthesis report.

User Profile:
- Name: ${name}
- Life Path Number: ${lifePath}
- Soul Urge Number: ${soulUrge}
- Destiny Number: ${destiny}

Angel Numbers Logged This ${period === 'month' ? 'Month' : 'Week'}:
${numberLines}

Total sightings: ${logs.length}
Dominant number: ${dominant}${dominantData ? ' (' + dominantData.title + ')' : ''}

${thoughtsSection}

Write a deeply personal, mystical, and poetic Weekly Cosmic Synthesis report. Be specific to their numbers and thoughts. Use spiritual but accessible language. Do NOT be generic.

Respond with ONLY valid JSON in this exact format:
{
  "title": "evocative 4-6 word title for this week energy",
  "narrative": "3-4 sentence deeply personal narrative about what the universe is communicating through their specific numbers this week. Reference their actual numbers and thoughts if provided.",
  "themes": ["Theme 1", "Theme 2", "Theme 3"],
  "affirmation": "one powerful personalized affirmation for this week",
  "guidance": "2-3 sentences of specific actionable spiritual guidance for the week ahead based on their numbers",
  "dominantNumber": "${dominant}",
  "dominantMeaning": "${dominantData?.title || 'Sacred Sequence'}",
  "patternInsight": "1-2 sentences about the pattern or story their numbers are telling together",
  "energyForecast": "1 sentence poetic energy forecast for the coming days"
}`;

    const completion = await getGroq().chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.85,
      max_tokens: 800,
    });

    const raw = completion.choices[0]?.message?.content || '{}';
    const jsonMatch = raw.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('No JSON in response');
    const result = JSON.parse(jsonMatch[0]);
    return NextResponse.json(result);

  } catch (err: any) {
    console.error('Synthesis API error:', err);
    return NextResponse.json({
      title: 'Cosmic Currents Are Flowing',
      narrative: 'The universe has been speaking to you through sacred sequences this week. Each number you noticed was a deliberate message from the divine, carefully placed in your path to guide your soul\'s journey.',
      themes: ['Awareness', 'Synchronicity', 'Growth'],
      affirmation: 'I trust the divine timing of my spiritual journey.',
      guidance: 'Reflect on the moments when you noticed these numbers. What were you feeling? The universe speaks through emotion as much as through numbers.',
      dominantNumber: null,
      dominantMeaning: null,
      patternInsight: 'Your numbers form a unique cosmic signature this week.',
      energyForecast: 'Powerful synchronicities are aligning in your favor.',
    });
  }
}
