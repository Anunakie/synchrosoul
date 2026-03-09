'use client';
import { useState } from 'react';

const NUMBERS = [
  { n:'000', color:'#6b7280', theme:'Infinite Potential', keywords:['Infinity','Void','Source','Completion'],
    meaning:'You are at the beginning of a spiritual journey. The universe is signaling that you are one with the infinite. A cycle has completed and a new one is about to begin.',
    love:'A relationship is coming full circle. Embrace new beginnings together.',
    career:'A chapter closes. Trust that something greater is being prepared for you.',
    action:'Meditate on what you wish to create in this new cycle.' },
  { n:'111', color:'#c9a84c', theme:'Manifestation Portal', keywords:['Manifestation','New Beginnings','Alignment','Thoughts'],
    meaning:'Your thoughts are manifesting rapidly. The universe has opened a portal of manifestation. Be very intentional about what you think and feel right now.',
    love:'A new romantic chapter is beginning. Your thoughts about love are manifesting.',
    career:'New opportunities are appearing. Your ideas have power right now.',
    action:'Write down your most important intention and repeat it 3 times.' },
  { n:'222', color:'#3b82f6', theme:'Divine Balance', keywords:['Balance','Partnership','Trust','Patience'],
    meaning:'Trust the process. Everything is unfolding in divine timing. You are being asked to have faith and maintain balance in all areas of your life.',
    love:'Your relationship is divinely guided. Trust the timing of love.',
    career:'Partnerships and collaborations are blessed. Trust your co-creators.',
    action:'Practice patience today. Trust that your seeds are growing.' },
  { n:'333', color:'#f97316', theme:'Ascended Masters', keywords:['Creativity','Growth','Ascended Masters','Expression'],
    meaning:'The Ascended Masters are near, offering guidance and support. Your creative energy is at its peak. Express yourself authentically.',
    love:'The masters bless your love life. Express your feelings openly.',
    career:'Creative projects are divinely supported. Share your gifts boldly.',
    action:'Create something today. Paint, write, sing, or dance.' },
  { n:'444', color:'#22c55e', theme:'Angelic Protection', keywords:['Protection','Foundation','Angels','Stability'],
    meaning:'Your angels surround you with love and protection. You are safe. Build strong foundations now. The universe is your solid ground.',
    love:'Your relationship has angelic protection. Build something lasting.',
    career:'Your hard work is noticed by the universe. Foundations are solid.',
    action:'Acknowledge your angels. Say thank you for their protection.' },
  { n:'555', color:'#8b5cf6', theme:'Major Change', keywords:['Change','Freedom','Adventure','Transformation'],
    meaning:'Major life changes are coming or already happening. Embrace the transformation. What is shifting is for your highest good, even if it feels uncertain.',
    love:'A significant shift in your love life is occurring. Embrace it.',
    career:'Career transformation is underway. Change leads to freedom.',
    action:'Release resistance to change. Write what you are ready to release.' },
  { n:'666', color:'#ec4899', theme:'Rebalance', keywords:['Balance','Healing','Home','Nurturing'],
    meaning:'Time to rebalance your thoughts between the material and spiritual. Nurture yourself and others. Home and family need your loving attention.',
    love:'Nurture your relationship. Balance giving and receiving love.',
    career:'Rebalance work and personal life. Nurture your creative projects.',
    action:'Do something nurturing for yourself or someone you love today.' },
  { n:'777', color:'#c9a84c', theme:'Divine Magic', keywords:['Magic','Luck','Spiritual Awakening','Wisdom'],
    meaning:'You are in perfect alignment with the universe. Magic is happening. Your spiritual practice is paying off. Miracles and synchronicities are flowing to you.',
    love:'Magical, fated connections are blessed. Love is truly magical now.',
    career:'Lucky breaks and magical opportunities are flowing to you.',
    action:'Celebrate your spiritual progress. You are on the right path.' },
  { n:'888', color:'#f59e0b', theme:'Infinite Abundance', keywords:['Abundance','Prosperity','Karma','Infinity'],
    meaning:'Infinite abundance is flowing to you. Financial blessings are on their way. The karmic cycle of giving and receiving is in perfect balance.',
    love:'Abundant love is yours. Give and receive love freely and fully.',
    career:'Financial abundance and career success are manifesting now.',
    action:'Open yourself to receive. Say yes to opportunities and gifts.' },
  { n:'999', color:'#ef4444', theme:'Divine Completion', keywords:['Completion','Endings','Lightworker','Purpose'],
    meaning:'A major cycle is completing. You are being called to your higher purpose as a lightworker. Release the old to make space for your divine mission.',
    love:'A relationship chapter is completing. Honor what was, welcome what comes.',
    career:'Your soul mission is calling. Align your work with your purpose.',
    action:'Let go of what no longer serves. Your higher purpose awaits.' },
  { n:'1010', color:'#06b6d4', theme:'Spiritual Awakening', keywords:['Awakening','Potential','Divine Support','Progress'],
    meaning:'You are on the path of spiritual awakening. The universe is cheering you on. Every step forward is divinely supported. Keep going.',
    love:'Your love life is spiritually guided. Growth and awakening together.',
    career:'You are progressing on your divine path. Keep taking inspired action.',
    action:'Take one step toward your spiritual goals today.' },
  { n:'1111', color:'#c9a84c', theme:'Master Manifestation', keywords:['Master Portal','Awakening','Alignment','Miracles'],
    meaning:'The most powerful manifestation portal. You are fully aligned with the universe. Your thoughts, words, and actions are creating your reality at lightning speed. Make a wish.',
    love:'Twin flame energy. Soul-level connections are activated.',
    career:'Your life purpose is activating. Miracles in your career are possible.',
    action:'Make a wish. Set your most sacred intention right now.' },
  { n:'1212', color:'#8b5cf6', theme:'Cosmic Alignment', keywords:['Alignment','Growth','Positive Thinking','Universe'],
    meaning:'You are in perfect cosmic alignment. The universe is asking you to stay positive and keep your thoughts elevated. Your spiritual growth is accelerating.',
    love:'Cosmic love alignment. Your relationship is divinely orchestrated.',
    career:'Stay positive about your career. Cosmic forces are aligning for you.',
    action:'Elevate your thoughts. Replace one negative thought with a positive one.' },
  { n:'1234', color:'#22c55e', theme:'Stepping Stones', keywords:['Progress','Steps','Building','Forward'],
    meaning:'You are taking the right steps in the right order. Life is progressing beautifully. Trust the sequential unfolding of your journey.',
    love:'Your relationship is progressing naturally and beautifully.',
    career:'Your career is building step by step. Trust the process.',
    action:'Identify your next step and take it with confidence.' },
  { n:'2222', color:'#3b82f6', theme:'Deep Trust', keywords:['Deep Trust','Miracles','Patience','Faith'],
    meaning:'Have deep faith. Miracles are being orchestrated behind the scenes. The universe is working on your behalf in ways you cannot yet see.',
    love:'Trust in the miracle of love. What is meant for you is coming.',
    career:'Behind-the-scenes forces are working in your favor. Trust.',
    action:'Write a letter of gratitude to the universe for miracles in progress.' },
  { n:'3333', color:'#f97316', theme:'Trinity Power', keywords:['Trinity','Mind Body Spirit','Masters','Power'],
    meaning:'The holy trinity of mind, body, and spirit is in perfect alignment. The Ascended Masters are amplifying your power. You are a co-creator with the divine.',
    love:'Mind, body, and soul connection in love. Deep spiritual partnership.',
    career:'Your mind, passion, and purpose are aligned. Powerful creation time.',
    action:'Align your thoughts, feelings, and actions toward one goal.' },
  { n:'4444', color:'#22c55e', theme:'Fortress of Angels', keywords:['Fortress','Protection','Stability','Angels'],
    meaning:'You are completely surrounded and protected by angels. A fortress of divine light encircles you. You are safe to build your dreams.',
    love:'Your love is protected by a fortress of angelic light.',
    career:'Your work is protected and supported by divine forces.',
    action:'Feel the angelic protection around you. Build boldly.' },
  { n:'5555', color:'#8b5cf6', theme:'Quantum Leap', keywords:['Quantum Leap','Massive Change','Freedom','Evolution'],
    meaning:'A quantum leap in your evolution is occurring. Massive, positive change is sweeping through your life. You are leveling up in every way.',
    love:'A quantum leap in your love life. Everything is changing for the better.',
    career:'A massive career leap is happening. Embrace the quantum shift.',
    action:'Embrace the change fully. Say yes to the new version of yourself.' },
  { n:'7777', color:'#c9a84c', theme:'Cosmic Jackpot', keywords:['Jackpot','Miracles','Luck','Spiritual Mastery'],
    meaning:'The cosmic jackpot. You have reached a level of spiritual mastery that is attracting miraculous luck and blessings. The universe is rewarding your spiritual work.',
    love:'Miraculous love blessings. Your spiritual work has opened your heart.',
    career:'Miraculous career luck. Your spiritual alignment is paying off.',
    action:'Celebrate. You have earned this cosmic reward.' },
  { n:'8888', color:'#f59e0b', theme:'Abundance Overflow', keywords:['Overflow','Wealth','Karma','Harvest'],
    meaning:'Abundance is overflowing in every area of your life. You are in the harvest season of your karmic cycle. Receive with gratitude and share generously.',
    love:'Overflowing love and joy in relationships. Share your love generously.',
    career:'Financial harvest time. Your investments of time and energy pay off.',
    action:'Receive graciously. Share your abundance with others.' },
  { n:'9999', color:'#ef4444', theme:'Grand Completion', keywords:['Grand Completion','Ascension','Purpose','New Earth'],
    meaning:'The grandest completion. You are ascending to a new level of consciousness. Your lightworker mission is fully activating. The old world falls away.',
    love:'Soul contracts completing. New soul-level love is entering.',
    career:'Your highest purpose career is fully activating. Answer the call.',
    action:'Surrender completely to your highest purpose. The universe has you.' },
];

export default function DictionaryPage() {
  const [selected, setSelected] = useState(NUMBERS[11]);
  const [search, setSearch] = useState('');
  const [tab, setTab] = useState<'meaning'|'love'|'career'>('meaning');

  const filtered = NUMBERS.filter(n =>
    n.n.includes(search) ||
    n.theme.toLowerCase().includes(search.toLowerCase()) ||
    n.keywords.some(k => k.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div style={{ minHeight: '100vh', padding: '2rem 1rem', maxWidth: '900px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 700, color: '#c9a84c', fontFamily: 'Cormorant Garamond, serif' }}>Angel Number Dictionary</h1>
        <p style={{ color: 'rgba(255,255,255,0.6)', marginTop: '0.5rem' }}>Complete guide to angel number meanings</p>
      </div>

      {/* Search */}
      <div style={{ marginBottom: '1.5rem' }}>
        <input
          value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Search numbers, themes, keywords..."
          style={{
            width: '100%', padding: '0.75rem 1rem', borderRadius: '999px',
            background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)',
            color: '#fff', fontSize: '0.95rem', outline: 'none', boxSizing: 'border-box'
          }}
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '200px 1fr', gap: '1.5rem' }}>
        {/* Number List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', maxHeight: '70vh', overflowY: 'auto' }}>
          {filtered.map(num => (
            <button key={num.n} onClick={() => setSelected(num)} style={{
              background: selected.n === num.n ? `${num.color}20` : 'rgba(255,255,255,0.04)',
              border: `1px solid ${selected.n === num.n ? num.color + '60' : 'rgba(255,255,255,0.08)'}`,
              borderRadius: '0.75rem', padding: '0.6rem 0.75rem',
              cursor: 'pointer', textAlign: 'left', width: '100%'
            }}>
              <div style={{ color: num.color, fontWeight: 800, fontSize: '1.1rem', fontFamily: 'Cormorant Garamond, serif' }}>{num.n}</div>
              <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.7rem' }}>{num.theme}</div>
            </button>
          ))}
        </div>

        {/* Detail */}
        <div style={{
          background: 'rgba(8,6,28,0.88)', borderRadius: '1.5rem',
          border: `1px solid ${selected.color}40`, padding: '1.5rem',
          backdropFilter: 'blur(12px)'
        }}>
          {/* Header */}
          <div style={{ marginBottom: '1.5rem' }}>
            <div style={{ fontSize: '3rem', fontWeight: 800, color: selected.color, fontFamily: 'Cormorant Garamond, serif', lineHeight: 1 }}>{selected.n}</div>
            <div style={{ color: '#fff', fontSize: '1.2rem', fontWeight: 700, marginTop: '0.25rem', fontFamily: 'Cormorant Garamond, serif' }}>{selected.theme}</div>
            <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
              {selected.keywords.map(k => (
                <span key={k} style={{
                  background: `${selected.color}15`, border: `1px solid ${selected.color}30`,
                  borderRadius: '999px', padding: '0.2rem 0.6rem',
                  color: 'rgba(255,255,255,0.7)', fontSize: '0.75rem'
                }}>{k}</span>
              ))}
            </div>
          </div>

          {/* Tabs */}
          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem' }}>
            {(['meaning','love','career'] as const).map(t => (
              <button key={t} onClick={() => setTab(t)} style={{
                padding: '0.35rem 0.9rem', borderRadius: '999px', cursor: 'pointer',
                background: tab === t ? selected.color : 'rgba(255,255,255,0.08)',
                color: tab === t ? '#000' : 'rgba(255,255,255,0.6)',
                border: 'none', fontSize: '0.8rem', fontWeight: 600,
                textTransform: 'capitalize'
              }}>{t === 'meaning' ? '✨ Meaning' : t === 'love' ? '💕 Love' : '💼 Career'}</button>
            ))}
          </div>

          <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.95rem', lineHeight: 1.7 }}>
            {tab === 'meaning' ? selected.meaning : tab === 'love' ? selected.love : selected.career}
          </p>

          <div style={{
            marginTop: '1.5rem', background: `${selected.color}10`,
            borderRadius: '1rem', padding: '1rem',
            borderLeft: `3px solid ${selected.color}`
          }}>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.7rem', marginBottom: '0.25rem' }}>GUIDED ACTION</p>
            <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.9rem' }}>{selected.action}</p>
          </div>
        </div>
      </div>
    </div>
  );
}