'use client';
import { useState } from 'react';

interface BlockUserButtonProps {
  userId: string;
  userName?: string;
  onBlocked?: () => void;
}

export default function BlockUserButton({ userId, userName, onBlocked }: BlockUserButtonProps) {
  const [blocked, setBlocked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleBlock = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/block', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ blockedUserId: userId, action: 'block' })
      });
      if (res.ok) {
        setBlocked(true);
        setShowConfirm(false);
        onBlocked?.();
      }
    } catch (err) {
      console.error('Block error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (blocked) {
    return (
      <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.3)', padding: '0.2rem 0.5rem' }}>
        Blocked
      </span>
    );
  }

  return (
    <>
      {showConfirm ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)' }}>Block {userName || 'user'}?</span>
          <button onClick={handleBlock} disabled={loading}
            style={{ padding: '0.2rem 0.5rem', borderRadius: '0.3rem', border: 'none',
              background: 'rgba(239,68,68,0.8)', color: '#fff', fontSize: '0.7rem', cursor: 'pointer' }}>
            {loading ? '...' : 'Yes'}
          </button>
          <button onClick={() => setShowConfirm(false)}
            style={{ padding: '0.2rem 0.5rem', borderRadius: '0.3rem', border: '1px solid rgba(255,255,255,0.1)',
              background: 'transparent', color: 'rgba(255,255,255,0.4)', fontSize: '0.7rem', cursor: 'pointer' }}>
            No
          </button>
        </div>
      ) : (
        <button onClick={() => setShowConfirm(true)}
          title={`Block ${userName || 'user'}`}
          style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.2)',
            cursor: 'pointer', fontSize: '0.8rem', padding: '0.3rem 0.4rem',
            borderRadius: '0.3rem', transition: 'color 0.2s' }}
          onMouseEnter={e => (e.currentTarget.style.color = 'rgba(239,68,68,0.6)')}
          onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.2)')}
        >
          &#x1F6AB;
        </button>
      )}
    </>
  );
}
