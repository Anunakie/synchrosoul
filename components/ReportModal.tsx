'use client';
import { useState } from 'react';

interface ReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetType: 'post' | 'user' | 'healer' | 'message';
  targetId: string;
  targetName?: string;
}

const REASONS = [
  'Spam',
  'Harassment or bullying',
  'Inappropriate content',
  'Fake profile',
  'Scam or fraud',
  'Hate speech',
  'Other'
];

export default function ReportModal({ isOpen, onClose, targetType, targetId, targetName }: ReportModalProps) {
  const [reason, setReason] = useState('');
  const [details, setDetails] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (!reason) { setError('Please select a reason'); return; }
    setSubmitting(true);
    setError('');
    try {
      const res = await fetch('/api/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetType, targetId, reason, details })
      });
      if (!res.ok) throw new Error('Failed to submit');
      setSubmitted(true);
    } catch {
      setError('Failed to submit report. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    setReason('');
    setDetails('');
    setSubmitted(false);
    setError('');
    onClose();
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 9999,
      background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem'
    }}>
      <div style={{
        background: 'rgba(8,6,28,0.97)', border: '1px solid rgba(167,139,250,0.3)',
        borderRadius: '1rem', padding: '2rem', maxWidth: '420px', width: '100%',
        boxShadow: '0 0 40px rgba(167,139,250,0.2)'
      }}>
        {submitted ? (
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✅</div>
            <h3 style={{ color: '#a78bfa', fontSize: '1.2rem', marginBottom: '0.5rem' }}>Report Submitted</h3>
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
              Thank you for helping keep SynchroSoul safe. We will review this report.
            </p>
            <button onClick={handleClose} style={{
              background: 'rgba(167,139,250,0.2)', border: '1px solid rgba(167,139,250,0.4)',
              color: '#a78bfa', padding: '0.6rem 1.5rem', borderRadius: '0.5rem', cursor: 'pointer'
            }}>Close</button>
          </div>
        ) : (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ color: '#fff', fontSize: '1.1rem', margin: 0 }}>
                🚩 Report {targetType === 'post' ? 'Post' : targetType === 'user' ? 'User' : targetType === 'healer' ? 'Healer' : 'Message'}
              </h3>
              <button onClick={handleClose} style={{
                background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)',
                fontSize: '1.5rem', cursor: 'pointer', lineHeight: 1
              }}>×</button>
            </div>
            {targetName && (
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem', marginBottom: '1rem' }}>
                Reporting: <span style={{ color: 'rgba(255,255,255,0.8)' }}>{targetName}</span>
              </p>
            )}
            <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.85rem', marginBottom: '1rem' }}>Select a reason:</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1rem' }}>
              {REASONS.map(r => (
                <label key={r} style={{
                  display: 'flex', alignItems: 'center', gap: '0.75rem',
                  padding: '0.6rem 0.75rem', borderRadius: '0.5rem', cursor: 'pointer',
                  background: reason === r ? 'rgba(167,139,250,0.15)' : 'rgba(255,255,255,0.03)',
                  border: `1px solid ${reason === r ? 'rgba(167,139,250,0.5)' : 'rgba(255,255,255,0.08)'}`,
                  transition: 'all 0.2s'
                }}>
                  <input type="radio" name="reason" value={r} checked={reason === r}
                    onChange={() => setReason(r)}
                    style={{ accentColor: '#a78bfa' }} />
                  <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem' }}>{r}</span>
                </label>
              ))}
            </div>
            <textarea
              placeholder="Additional details (optional)..."
              value={details}
              onChange={e => setDetails(e.target.value)}
              rows={3}
              style={{
                width: '100%', background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)', borderRadius: '0.5rem',
                color: '#fff', padding: '0.75rem', fontSize: '0.9rem',
                resize: 'vertical', boxSizing: 'border-box', marginBottom: '1rem',
                outline: 'none', fontFamily: 'inherit'
              }}
            />
            {error && <p style={{ color: '#f87171', fontSize: '0.85rem', marginBottom: '0.75rem' }}>{error}</p>}
            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button onClick={handleClose} style={{
                flex: 1, background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.6)',
                padding: '0.7rem', borderRadius: '0.5rem', cursor: 'pointer', fontSize: '0.9rem'
              }}>Cancel</button>
              <button onClick={handleSubmit} disabled={submitting} style={{
                flex: 1, background: submitting ? 'rgba(239,68,68,0.3)' : 'rgba(239,68,68,0.8)',
                border: 'none', color: '#fff', padding: '0.7rem', borderRadius: '0.5rem',
                cursor: submitting ? 'not-allowed' : 'pointer', fontSize: '0.9rem', fontWeight: 600
              }}>{submitting ? 'Submitting...' : 'Submit Report'}</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
