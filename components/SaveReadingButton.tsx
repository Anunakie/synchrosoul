'use client';
import { useState, useEffect } from 'react';
import { saveReading, deleteReading, isReadingSaved, SavedReading } from '@/lib/saved-readings';

interface SaveReadingButtonProps {
  type: SavedReading['type'];
  title: string;
  subtitle?: string;
  content: string;
  metadata?: Record<string, any>;
  emoji?: string;
  style?: React.CSSProperties;
}

export default function SaveReadingButton({ type, title, subtitle, content, metadata, emoji, style }: SaveReadingButtonProps) {
  const [savedId, setSavedId] = useState<string | null>(null);
  const [flash, setFlash] = useState<'saved' | 'deleted' | null>(null);

  useEffect(() => {
    setSavedId(isReadingSaved(title, type));
  }, [title, type]);

  const handleToggle = () => {
    if (savedId) {
      deleteReading(savedId);
      setSavedId(null);
      setFlash('deleted');
    } else {
      const r = saveReading({ type, title, subtitle, content, metadata, emoji });
      setSavedId(r.id);
      setFlash('saved');
    }
    setTimeout(() => setFlash(null), 1800);
  };

  const isSaved = !!savedId;

  return (
    <button
      onClick={handleToggle}
      title={isSaved ? 'Remove from saved readings' : 'Save this reading'}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.4rem',
        padding: '0.45rem 1rem',
        borderRadius: '999px',
        border: isSaved ? '1px solid rgba(201,168,76,0.5)' : '1px solid rgba(255,255,255,0.15)',
        background: isSaved ? 'rgba(201,168,76,0.15)' : 'rgba(255,255,255,0.06)',
        color: isSaved ? '#c9a84c' : 'rgba(255,255,255,0.55)',
        fontSize: '0.8rem',
        fontWeight: 600,
        cursor: 'pointer',
        transition: 'all 0.2s',
        whiteSpace: 'nowrap',
        ...style,
      }}
    >
      <span style={{ fontSize: '0.9rem' }}>{flash === 'saved' ? '✦' : flash === 'deleted' ? '✕' : isSaved ? '✦' : '✧'}</span>
      <span>
        {flash === 'saved' ? 'Saved!' : flash === 'deleted' ? 'Removed' : isSaved ? 'Saved' : 'Save Reading'}
      </span>
    </button>
  );
}
