'use client';
import FeatureGate from '@/components/FeatureGate'
import { useState, useEffect } from 'react';
import SaveReadingButton from '@/components/SaveReadingButton';
import { askOracle, getOracleHistory, saveOracleReading, OracleReading } from '@/lib/oracle';
import SongRecommendationCard, { type SongRecommendationData } from '@/components/SongRecommendationCard';

const SUGGESTED_QUESTIONS = [
  { text: 'What is my soul calling me toward right now?', category: 'default' },
  { text: 'What do my angel numbers say about my love life?', category: 'love' },
  { text: 'Should I make this career change?', category: 'career' },
  { text: 'What decision is the universe guiding me toward?', category: 'decision' },
  { text: 'How can I heal and restore my energy?', category: 'health' },
  { text: 'What is blocking my manifestations?', category: 'default' },
  { text: 'Am I on the right path?', category: 'default' },
  { text: 'What does my twin flame journey look like?', category: 'love' },
];

const SIM_SUGGESTED_QUESTIONS = [
  { text: 'What anomaly codes are repeating in my data stream?', category: 'default' },
  { text: 'Decode the pattern in my recent signal intercepts', category: 'love' },
  { text: 'Is this career fork a planned branch or a glitch?', category: 'career' },
  { text: 'Run decision tree analysis on my current node', category: 'decision' },
  { text: 'Diagnose corrupted sectors in my energy matrix', category: 'health' },
  { text: 'Identify blockers in my manifestation protocol', category: 'default' },
  { text: 'Verify if my current path matches the source code', category: 'default' },
  { text: 'What does the signal match algorithm predict?', category: 'love' },
];

const CATEGORY_ICONS: Record<string, string> = {
  career: '💼', love: '💕', decision: '⚖️', health: '🌿', default: '✨'
};

const SIM_CATEGORY_ICONS: Record<string, string> = {
  career: '📊', love: '📡', decision: '⚙️', health: '🔧', default: '⚡'
};

function OraclePageInner() {
  const isSim = typeof window !== 'undefined' && localStorage.getItem('synchrosoul_simulation') === 'true';
  const [question, setQuestion] = useState('');
  const [reading, setReading] = useState<OracleReading | null>(null);
  const [history, setHistory] = useState<OracleReading[]>([]);
  const [loading, setLoading] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [songRec, setSongRec] = useState<SongRecommendationData | null>(null);
  const [songRecLoading, setSongRecLoading] = useState(false);

  useEffect(() => {
    setHistory(getOracleHistory());
  }, []);

  const handleAsk = async () => {
    if (!question.trim()) return;
    setLoading(true);
    setRevealed(false);
    setTimeout(async () => {
      const result = await askOracle(question);
      saveOracleReading(result);
      setReading(result);
      setHistory(getOracleHistory());
      setLoading(false);
      setSongRec(null);
      setTimeout(() => setRevealed(true), 100);

      // Fetch song recommendation (non-blocking)
      setSongRecLoading(true);
      try {
        const recRes = await fetch('/api/musical-healers/recommend', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            number: result.guidingNumber,
            thought: question,
            reading: result.response,
            readingType: 'oracle',
            mode: 'spiritual',
          }),
        });
        const recData = await recRes.json();
        if (recData.recommendation) {
          setSongRec(recData.recommendation);
        }
      } catch {
        // Non-critical - reading still shows fine
      } finally {
        setSongRecLoading(false);
      }
    }, 2000);
  };

  const handleSuggestion = (q: string) => {
    setQuestion(q);
    setReading(null);
    setSongRec(null);
  };

  return (
    <div style={{ minHeight: '100vh', padding: '2rem 1rem', maxWidth: '700px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
        <div style={{
          width: '80px', height: '80px', borderRadius: '50%', margin: '0 auto 1rem',
          background: isSim ? 'radial-gradient(circle, rgba(0,204,51,0.3) 0%, rgba(0,100,0,0.2) 60%, transparent 100%)' : 'radial-gradient(circle, rgba(201,168,76,0.3) 0%, rgba(139,92,246,0.2) 60%, transparent 100%)',
          border: isSim ? '1px solid rgba(0,204,51,0.4)' : '1px solid rgba(201,168,76,0.4)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '2.5rem',
          boxShadow: isSim ? '0 0 40px rgba(0,204,51,0.2)' : '0 0 40px rgba(201,168,76,0.2)'
        }}>{isSim ? '◈' : '◈'}</div>
        <h1 style={{ fontSize: '2rem', fontWeight: 700, color: isSim ? '#00cc33' : '#c9a84c', fontFamily: isSim ? 'monospace' : 'Cormorant Garamond, serif' }}>{isSim ? 'Signal Decoder' : 'Angel Oracle'}</h1>
        <p style={{ color: isSim ? 'rgba(0,204,51,0.6)' : 'rgba(255,255,255,0.5)', marginTop: '0.5rem' }}>{isSim ? 'Submit your query. The system will decode the signal from your anomaly codes.' : 'Ask your question. The angels will answer through your numbers.'}</p>
      </div>

      {/* Question Input */}
      <div style={{
        background: 'rgba(8,6,28,0.88)', borderRadius: '1.5rem',
        border: '1px solid rgba(201,168,76,0.25)', padding: '1.5rem',
        backdropFilter: 'blur(12px)', marginBottom: '1.5rem'
      }}>
        <p style={{ color: isSim ? 'rgba(0,204,51,0.5)' : 'rgba(255,255,255,0.4)', fontSize: '0.7rem', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>{isSim ? 'Your Transmission' : 'Your Question'}</p>
        <textarea
          value={question}
          onChange={e => setQuestion(e.target.value)}
          placeholder={isSim ? "What signal requires decoding?" : "What guidance do you seek from the angels today?"}
          rows={3}
          style={{
            width: '100%', background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.1)', borderRadius: '1rem',
            padding: '0.875rem', color: '#fff', fontSize: '0.95rem',
            resize: 'none', outline: 'none', boxSizing: 'border-box',
            fontFamily: 'Cormorant Garamond, serif', lineHeight: 1.6
          }}
        />
        <button
          onClick={handleAsk}
          disabled={!question.trim() || loading}
          style={{
            width: '100%', marginTop: '0.75rem', padding: '0.875rem',
            borderRadius: '999px', cursor: question.trim() && !loading ? 'pointer' : 'not-allowed',
            background: question.trim() && !loading
              ? 'linear-gradient(135deg, #c9a84c, #8b5cf6)'
              : 'rgba(255,255,255,0.06)',
            color: question.trim() && !loading ? '#fff' : 'rgba(255,255,255,0.3)',
            border: 'none', fontSize: '0.95rem', fontWeight: 700,
            letterSpacing: '0.05em', transition: 'all 0.3s'
          }}
        >
          {loading ? (isSim ? '/// DECODING SIGNAL...' : '✦ Consulting the Angels...') : (isSim ? '⚡ Decode Signal' : '◈ Receive Your Reading')}
        </button>
      </div>

      {/* Suggested Questions */}
      {!reading && !loading && (
        <div style={{ marginBottom: '1.5rem' }}>
          <p style={{ color: isSim ? 'rgba(0,204,51,0.4)' : 'rgba(255,255,255,0.35)', fontSize: '0.7rem', letterSpacing: '0.12em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>{isSim ? 'Query Templates' : 'Suggested Questions'}</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
            {(isSim ? SIM_SUGGESTED_QUESTIONS : SUGGESTED_QUESTIONS).map((q, i) => (
              <button key={i} onClick={() => handleSuggestion(q.text)} style={{
                background: isSim ? 'rgba(0,204,51,0.03)' : 'rgba(255,255,255,0.03)', border: isSim ? '1px solid rgba(0,204,51,0.15)' : '1px solid rgba(255,255,255,0.08)',
                borderRadius: '0.875rem', padding: '0.65rem 1rem',
                cursor: 'pointer', textAlign: 'left', display: 'flex', alignItems: 'center', gap: '0.75rem'
              }}>
                <span style={{ fontSize: '1rem' }}>{(isSim ? SIM_CATEGORY_ICONS : CATEGORY_ICONS)[q.category]}</span>
                <span style={{ color: isSim ? 'rgba(0,204,51,0.7)' : 'rgba(255,255,255,0.6)', fontSize: '0.85rem' }}>{q.text}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Loading Animation */}
      {loading && (
        <div style={{
          background: 'rgba(8,6,28,0.88)', borderRadius: '1.5rem',
          border: '1px solid rgba(201,168,76,0.25)', padding: '3rem',
          backdropFilter: 'blur(12px)', textAlign: 'center', marginBottom: '1.5rem'
        }}>
          <div style={{
            width: '60px', height: '60px', borderRadius: '50%', margin: '0 auto 1.5rem',
            border: '2px solid rgba(201,168,76,0.3)',
            borderTop: '2px solid #c9a84c',
            animation: 'spin 1.5s linear infinite'
          }} />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontFamily: 'Cormorant Garamond, serif', fontSize: '1.1rem', fontStyle: 'italic' }}>The angels are reading your energy...</p>
          <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.8rem', marginTop: '0.5rem' }}>Consulting your angel number history</p>
        </div>
      )}

      {/* Reading Result */}
      {reading && !loading && (
        <div style={{
          background: 'rgba(8,6,28,0.92)', borderRadius: '1.5rem',
          border: `1px solid ${reading.guidingColor}50`,
          padding: '1.75rem', backdropFilter: 'blur(12px)',
          marginBottom: '1.5rem',
          opacity: revealed ? 1 : 0,
          transform: revealed ? 'translateY(0)' : 'translateY(20px)',
          transition: 'all 0.6s ease'
        }}>
          {/* Guiding Number */}
          <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
            <div style={{
              display: 'inline-flex', flexDirection: 'column', alignItems: 'center',
              background: `${reading.guidingColor}15`,
              border: `1px solid ${reading.guidingColor}40`,
              borderRadius: '1rem', padding: '1rem 2rem'
            }}>
              <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.65rem', letterSpacing: '0.15em', textTransform: 'uppercase' }}>Your Guiding Number</span>
              <span style={{ color: reading.guidingColor, fontSize: '2.5rem', fontWeight: 800, fontFamily: 'Cormorant Garamond, serif', lineHeight: 1.1 }}>{reading.guidingNumber}</span>
              <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.8rem', marginTop: '0.25rem' }}>{reading.guidingMeaning}</span>
            </div>
          </div>

          {/* Category badge */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <span style={{ fontSize: '1rem' }}>{CATEGORY_ICONS[reading.category]}</span>
            <span style={{
              background: `${reading.guidingColor}20`, border: `1px solid ${reading.guidingColor}40`,
              borderRadius: '999px', padding: '0.2rem 0.75rem',
              color: reading.guidingColor, fontSize: '0.75rem', fontWeight: 600,
              textTransform: 'capitalize'
            }}>{reading.category} Reading</span>
          </div>

          {/* Question */}
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem', fontStyle: 'italic', marginBottom: '1rem', borderLeft: `2px solid ${reading.guidingColor}40`, paddingLeft: '0.75rem' }}>
            &ldquo;{reading.question}&rdquo;
          </p>

          {/* Response */}
          <p style={{
            color: 'rgba(255,255,255,0.9)', fontSize: '1.05rem', lineHeight: 1.8,
            fontFamily: 'Cormorant Garamond, serif', marginBottom: '1.25rem'
          }}>{reading.response}</p>

          {/* Numerology Note */}
          <div style={{
            background: `${reading.guidingColor}08`,
            borderRadius: '0.875rem', padding: '0.875rem',
            borderLeft: `3px solid ${reading.guidingColor}60`
          }}>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.65rem', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '0.25rem' }}>Numerology Note</p>
            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', lineHeight: 1.6 }}>{reading.numerologyNote}</p>
          </div>

          {/* Song Recommendation */}
          {songRecLoading && (
            <p style={{ color: 'rgba(201,168,76,0.5)', fontSize: '0.8rem', textAlign: 'center', marginTop: '1rem' }}>🎵 Finding your healing music...</p>
          )}
          {songRec && !songRecLoading && (
            <div style={{ marginTop: '1rem' }}>
              <SongRecommendationCard recommendation={songRec} mode="spiritual" />
            </div>
          )}

          {/* Ask another */}
          <button onClick={() => { setReading(null); setQuestion(''); setSongRec(null); }} style={{
            width: '100%', marginTop: '1.25rem', padding: '0.65rem',
            borderRadius: '999px', cursor: 'pointer',
            background: 'rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.5)',
            border: '1px solid rgba(255,255,255,0.1)', fontSize: '0.85rem'
          }}>Ask Another Question</button>
        </div>
      )}

      {/* History */}
      {history.length > 0 && (
        <div>
          <button onClick={() => setShowHistory(h => !h)} style={{
            width: '100%', padding: '0.65rem', borderRadius: '999px',
            background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
            color: 'rgba(255,255,255,0.4)', cursor: 'pointer', fontSize: '0.8rem',
            marginBottom: showHistory ? '0.75rem' : 0
          }}>{showHistory ? '▲ Hide' : '▼ Show'} Reading History ({history.length})</button>

          {showHistory && history.map((h, i) => (
            <div key={i} style={{
              background: 'rgba(8,6,28,0.7)', borderRadius: '1rem',
              border: `1px solid ${h.guidingColor}25`, padding: '1rem',
              backdropFilter: 'blur(8px)', marginBottom: '0.5rem'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                <span style={{ color: h.guidingColor, fontWeight: 700, fontSize: '0.9rem' }}>{h.guidingNumber}</span>
                <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.7rem' }}>{new Date(h.timestamp).toLocaleDateString()}</span>
              </div>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.78rem', fontStyle: 'italic', marginBottom: '0.4rem' }}>&ldquo;{h.question}&rdquo;</p>
              <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.82rem', lineHeight: 1.5 }}>{h.response.substring(0, 120)}...</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default function OraclePage() {
  return (
    <FeatureGate feature="oracle-unlimited" requiredTier="mystic">
      <OraclePageInner />
    </FeatureGate>
  )
}
