export const metadata = {
  title: 'Privacy Policy | SynchroSoul',
  description: 'Privacy Policy for SynchroSoul - Angel Number Soul Synching & Healing App',
}

export default function PrivacyPage() {
  const sectionStyle: React.CSSProperties = {
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(167,139,250,0.2)',
    borderRadius: '1rem',
    padding: '2rem',
    marginBottom: '1.5rem',
  }
  const h2Style: React.CSSProperties = { color: '#a78bfa', fontSize: '1.3rem', marginBottom: '1rem' }
  const h3Style: React.CSSProperties = { color: '#f59e0b', fontSize: '1.05rem', marginBottom: '0.5rem', marginTop: '1.25rem' }
  const pStyle: React.CSSProperties = { lineHeight: '1.8', color: '#d1d5db', marginBottom: '0.75rem' }
  const liStyle: React.CSSProperties = { lineHeight: '2', color: '#d1d5db' }

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #050510 0%, #0d0a2e 50%, #1a0533 100%)', color: '#e2d9f3', fontFamily: 'Georgia, serif', padding: '2rem 1rem' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>

        <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>✨</div>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 'bold', background: 'linear-gradient(135deg, #a78bfa, #f59e0b)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '0.5rem' }}>Privacy Policy</h1>
          <p style={{ color: '#9ca3af', fontSize: '0.9rem' }}>SynchroSoul &mdash; Angel Number Soul Synching & Healing App</p>
          <p style={{ color: '#6b7280', fontSize: '0.85rem', marginTop: '0.5rem' }}>Last updated: March 14, 2026</p>
        </div>

        <div style={sectionStyle}>
          <h2 style={h2Style}>1. Introduction</h2>
          <p style={pStyle}>Welcome to SynchroSoul (&quot;we,&quot; &quot;our,&quot; or &quot;us&quot;). We are committed to protecting your personal information and your right to privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our application at synchrosoul.app.</p>
          <p style={pStyle}>Please read this policy carefully. If you disagree with its terms, please discontinue use of the app.</p>
        </div>

        <div style={sectionStyle}>
          <h2 style={h2Style}>2. Information We Collect</h2>
          <h3 style={h3Style}>Personal Information</h3>
          <ul style={{ paddingLeft: '1.5rem' }}>
            <li style={liStyle}><strong>Name:</strong> Display name you choose for your profile</li>
            <li style={liStyle}><strong>Email address:</strong> Used for account creation, login, and communications</li>
            <li style={liStyle}><strong>Birthdate:</strong> Used to calculate your numerology profile (Life Path, Soul Urge, Destiny numbers)</li>
            <li style={liStyle}><strong>Profile photo:</strong> Optional image you upload to personalize your profile</li>
            <li style={liStyle}><strong>User ID:</strong> Unique identifier assigned to your account</li>
          </ul>
          <h3 style={h3Style}>User-Generated Content</h3>
          <ul style={{ paddingLeft: '1.5rem' }}>
            <li style={liStyle}><strong>Angel number logs:</strong> Numbers you log and associated thoughts</li>
            <li style={liStyle}><strong>Dream journal entries:</strong> Dreams and reflections you record</li>
            <li style={liStyle}><strong>Social posts:</strong> Content you share on the Cosmic Feed</li>
            <li style={liStyle}><strong>Voice journal transcripts:</strong> Text transcribed from voice recordings (audio is never stored on our servers)</li>
            <li style={liStyle}><strong>Screenshots:</strong> Images uploaded for Truth Score verification</li>
            <li style={liStyle}><strong>Vision boards and manifestations:</strong> Personal goals and intentions you create</li>
          </ul>
          <h3 style={h3Style}>Messages</h3>
          <ul style={{ paddingLeft: '1.5rem' }}>
            <li style={liStyle}><strong>Direct messages:</strong> Private conversations between matched Soul Twin users</li>
          </ul>
          <h3 style={h3Style}>Financial Information</h3>
          <ul style={{ paddingLeft: '1.5rem' }}>
            <li style={liStyle}><strong>Payment information:</strong> Processed directly by Stripe &mdash; we do not store card details</li>
            <li style={liStyle}><strong>Purchase history:</strong> Subscription tier and transaction records</li>
            <li style={liStyle}><strong>Stripe customer ID:</strong> Reference ID linking your account to Stripe</li>
          </ul>
          <h3 style={h3Style}>Technical Data</h3>
          <ul style={{ paddingLeft: '1.5rem' }}>
            <li style={liStyle}><strong>Push notification tokens:</strong> Device tokens for delivering notifications (optional)</li>
            <li style={liStyle}><strong>App interactions:</strong> Pages visited and features used, logged via Google Analytics 4</li>
            <li style={liStyle}><strong>Crash logs:</strong> Error reports collected by Vercel for debugging</li>
            <li style={liStyle}><strong>Device identifiers:</strong> Browser/device IDs used by Google Analytics</li>
          </ul>
          <h3 style={h3Style}>Voice Data</h3>
          <ul style={{ paddingLeft: '1.5rem' }}>
            <li style={liStyle}><strong>Voice recordings:</strong> Audio is processed ephemerally by your device&apos;s speech recognition (Chrome/OS) for transcription only. Audio is never stored on our servers.</li>
          </ul>
        </div>

        <div style={sectionStyle}>
          <h2 style={h2Style}>3. How We Use Your Information</h2>
          <ul style={{ paddingLeft: '1.5rem' }}>
            <li style={liStyle}>Provide and maintain the SynchroSoul app and its features</li>
            <li style={liStyle}>Calculate your numerology profile (Life Path, Soul Urge, Destiny numbers)</li>
            <li style={liStyle}>Match you with Soul Twins who log similar angel numbers</li>
            <li style={liStyle}>Send welcome emails, Soul Sync alerts, and weekly cosmic digests</li>
            <li style={liStyle}>Process subscription payments and healer bookings via Stripe</li>
            <li style={liStyle}>Deliver push notifications when you have a Soul Twin match</li>
            <li style={liStyle}>Generate personalized AI oracle readings via Groq</li>
            <li style={liStyle}>Improve app performance and fix bugs</li>
            <li style={liStyle}>Analyze usage patterns via Google Analytics 4</li>
            <li style={liStyle}>Prevent fraud and ensure platform security</li>
          </ul>
        </div>

        <div style={sectionStyle}>
          <h2 style={h2Style}>4. How We Share Your Information</h2>
          <p style={pStyle}>We do not sell your personal information. We share data only with the following service providers:</p>
          <ul style={{ paddingLeft: '1.5rem' }}>
            <li style={liStyle}><strong>Supabase:</strong> Database hosting, authentication, and file storage</li>
            <li style={liStyle}><strong>Stripe:</strong> Payment processing and subscription management</li>
            <li style={liStyle}><strong>Resend:</strong> Email delivery (receives your name and email)</li>
            <li style={liStyle}><strong>Groq:</strong> AI-powered oracle readings (receives anonymized context)</li>
            <li style={liStyle}><strong>Vercel:</strong> App hosting and crash log collection</li>
            <li style={liStyle}><strong>Google Analytics 4:</strong> Usage analytics and app interaction tracking</li>
            <li style={liStyle}><strong>Browser Push Services:</strong> Google FCM, Apple, Mozilla (receive push tokens for notification delivery)</li>
          </ul>
          <p style={{ ...pStyle, marginTop: '1rem' }}>All third-party providers are bound by their own privacy policies and data processing agreements.</p>
        </div>

        <div style={sectionStyle}>
          <h2 style={h2Style}>5. Data Security</h2>
          <p style={pStyle}>All data is transmitted using HTTPS/TLS encryption. Our infrastructure (Vercel, Supabase, Cloudflare) enforces encrypted connections. We implement Row Level Security (RLS) in our database so users can only access their own data. Payment data is handled exclusively by Stripe with PCI-DSS compliance.</p>
        </div>

        <div style={sectionStyle}>
          <h2 style={h2Style}>6. Your Rights &amp; Choices</h2>
          <ul style={{ paddingLeft: '1.5rem' }}>
            <li style={liStyle}><strong>Access:</strong> Request a copy of your personal data by contacting us</li>
            <li style={liStyle}><strong>Correction:</strong> Update your profile information at any time in Settings</li>
            <li style={liStyle}><strong>Partial deletion:</strong> Delete specific data types at <a href='https://synchrosoul.app/account/delete-data' style={{ color: '#a78bfa' }}>synchrosoul.app/account/delete-data</a></li>
            <li style={liStyle}><strong>Full account deletion:</strong> Permanently delete your account and all data at <a href='https://synchrosoul.app/account/delete' style={{ color: '#a78bfa' }}>synchrosoul.app/account/delete</a></li>
            <li style={liStyle}><strong>Email preferences:</strong> Opt out of marketing emails in Settings &gt; Notifications</li>
            <li style={liStyle}><strong>Push notifications:</strong> Disable at any time in Settings or your device settings</li>
            <li style={liStyle}><strong>Privacy mode:</strong> Enable in Settings to hide your profile from matching and the Cosmic Feed</li>
          </ul>
        </div>

        <div style={sectionStyle}>
          <h2 style={h2Style}>7. Data Retention</h2>
          <p style={pStyle}>We retain your data for as long as your account is active. When you delete your account, all personal data is permanently removed from our systems within 30 days. Some anonymized, aggregated data may be retained for analytics purposes.</p>
        </div>

        <div style={sectionStyle}>
          <h2 style={h2Style}>8. Children&apos;s Privacy</h2>
          <p style={pStyle}>SynchroSoul is not intended for users under the age of 13. We do not knowingly collect personal information from children under 13. If you believe a child has provided us with personal information, please contact us immediately at hello@synchrosoul.app.</p>
        </div>

        <div style={sectionStyle}>
          <h2 style={h2Style}>9. Cookies &amp; Tracking</h2>
          <p style={pStyle}>We use essential cookies for authentication (Supabase session cookies) and analytics cookies via Google Analytics 4. You can control cookie preferences through your browser settings. Disabling cookies may affect app functionality.</p>
        </div>

        <div style={sectionStyle}>
          <h2 style={h2Style}>10. International Data Transfers</h2>
          <p style={pStyle}>Your data may be processed in the United States and other countries where our service providers operate. By using SynchroSoul, you consent to the transfer of your information to these countries, which may have different data protection laws than your country of residence.</p>
        </div>

        <div style={sectionStyle}>
          <h2 style={h2Style}>11. Changes to This Policy</h2>
          <p style={pStyle}>We may update this Privacy Policy from time to time. We will notify you of significant changes via email or an in-app notification. The date at the top of this page indicates when the policy was last revised. Continued use of the app after changes constitutes acceptance of the updated policy.</p>
        </div>

        <div style={{ background: 'rgba(167,139,250,0.1)', border: '1px solid rgba(167,139,250,0.3)', borderRadius: '1rem', padding: '2rem', marginBottom: '3rem', textAlign: 'center' }}>
          <h2 style={h2Style}>12. Contact Us</h2>
          <p style={pStyle}>If you have questions about this Privacy Policy or wish to exercise your data rights, please contact us:</p>
          <p style={{ marginTop: '1rem', color: '#f59e0b', fontSize: '1.1rem' }}>
            <strong>Email:</strong> <a href='mailto:hello@synchrosoul.app' style={{ color: '#f59e0b' }}>hello@synchrosoul.app</a>
          </p>
          <p style={{ color: '#9ca3af', marginTop: '0.5rem' }}>Website: <a href='https://synchrosoul.app' style={{ color: '#a78bfa' }}>synchrosoul.app</a></p>
        </div>

        <div style={{ textAlign: 'center', paddingBottom: '3rem' }}>
          <a href='/' style={{ display: 'inline-block', padding: '0.75rem 2rem', background: 'linear-gradient(135deg, #7c3aed, #a78bfa)', color: 'white', borderRadius: '2rem', textDecoration: 'none', fontWeight: 'bold' }}>Return to SynchroSoul</a>
        </div>

      </div>
    </div>
  )
}