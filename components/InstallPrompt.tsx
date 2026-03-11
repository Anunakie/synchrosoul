'use client';
import { useState, useEffect } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export default function InstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showBanner, setShowBanner] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      return;
    }
    // Check if dismissed before
    const dismissed = localStorage.getItem('synchrosoul_install_dismissed');
    if (dismissed) return;

    // iOS detection
    const ios = /iphone|ipad|ipod/i.test(navigator.userAgent) && !(window.navigator as any).standalone;
    setIsIOS(ios);
    if (ios) {
      setTimeout(() => setShowBanner(true), 3000);
      return;
    }

    // Android/Chrome install prompt
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setTimeout(() => setShowBanner(true), 3000);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') setIsInstalled(true);
      setDeferredPrompt(null);
    }
    setShowBanner(false);
  };

  const handleDismiss = () => {
    setShowBanner(false);
    localStorage.setItem('synchrosoul_install_dismissed', '1');
  };

  if (!showBanner || isInstalled) return null;

  return (
    <div style={{
      position: 'fixed', bottom: '5.5rem', left: '1rem', right: '1rem', zIndex: 200,
      background: 'linear-gradient(135deg, rgba(20,10,50,0.97) 0%, rgba(10,5,30,0.97) 100%)',
      border: '1px solid rgba(167,139,250,0.3)',
      borderRadius: '1.25rem',
      padding: '1rem 1.25rem',
      backdropFilter: 'blur(20px)',
      boxShadow: '0 8px 32px rgba(0,0,0,0.5), 0 0 0 1px rgba(167,139,250,0.1)',
      display: 'flex', alignItems: 'center', gap: '1rem',
      animation: 'slideUp 0.4s cubic-bezier(0.4,0,0.2,1)',
    }}>
      <div style={{ fontSize: '2.5rem', flexShrink: 0 }}>✦</div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1rem', color: 'rgba(220,200,255,0.95)', marginBottom: '0.2rem' }}>
          Install SynchroSoul
        </div>
        {isIOS ? (
          <div style={{ fontSize: '0.72rem', color: 'rgba(180,160,255,0.6)', lineHeight: 1.4 }}>
            Tap <strong style={{ color: 'rgba(200,180,255,0.8)' }}>Share</strong> then <strong style={{ color: 'rgba(200,180,255,0.8)' }}>Add to Home Screen</strong>
          </div>
        ) : (
          <div style={{ fontSize: '0.72rem', color: 'rgba(180,160,255,0.6)', lineHeight: 1.4 }}>
            Add to your home screen for the full cosmic experience
          </div>
        )}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', flexShrink: 0 }}>
        {!isIOS && (
          <button
            onClick={handleInstall}
            style={{
              background: 'linear-gradient(135deg, #7c3aed, #a78bfa)',
              border: 'none', borderRadius: '0.6rem',
              color: 'white', fontSize: '0.72rem', fontWeight: 600,
              padding: '0.4rem 0.875rem', cursor: 'pointer',
              letterSpacing: '0.05em', textTransform: 'uppercase',
            }}
          >Install</button>
        )}
        <button
          onClick={handleDismiss}
          style={{
            background: 'transparent',
            border: '1px solid rgba(200,180,255,0.15)', borderRadius: '0.6rem',
            color: 'rgba(180,160,255,0.5)', fontSize: '0.65rem',
            padding: '0.35rem 0.875rem', cursor: 'pointer',
          }}
        >Not now</button>
      </div>
    </div>
  );
}
