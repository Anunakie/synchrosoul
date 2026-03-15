'use client'

import { useEffect, useState } from 'react'

const card = {
  background: 'rgba(8,6,28,0.88)',
  borderRadius: '1.5rem',
  border: '1px solid rgba(255,255,255,0.07)',
  backdropFilter: 'blur(12px)',
  padding: '1.5rem',
}

interface AdminStats {
  totalUsers: number
  totalLogs: number
  totalPosts: number
  payingSubscribers: number
  subBreakdown: { free: number; mystic: number; twin_flame: number }
  recentSignups: { email: string; created_at: string }[]
  recentLogs: { number: string; created_at: string; user_id: string }[]
}

interface RevenueData {
  mrr: number
  totalRevenue: number
  platformRevenue: number
  activeSubscribers: number
  canceledSubscribers: number
  churnRate: number
  tierCounts: { mystic: number; twin_flame: number; other: number }
  monthlyRevenue: { month: string; revenue: number; count: number }[]
  recentCharges: {
    id: string
    amount: number
    currency: string
    status: string
    email: string
    created: string
    description: string
  }[]
}

interface HealerRow {
  id: string
  name: string
  email: string
  modalities: string[]
  verified: boolean
  truth_score: number
  created_at: string
  verification_notes?: string
  stripe_account_id?: string
  stripe_account_status?: string
}

export default function AdminPage() {
  const [tab, setTab] = useState<'overview' | 'revenue' | 'healers' | 'reports' | 'beta'>('overview')
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [revenue, setRevenue] = useState<RevenueData | null>(null)
  const [healers, setHealers] = useState<HealerRow[]>([])
  const [loading, setLoading] = useState(true)
  const [revLoading, setRevLoading] = useState(false)
  const [healersLoading, setHealersLoading] = useState(false)
  const [error, setError] = useState('')
  const [revError, setRevError] = useState('')
  const [healersError, setHealersError] = useState('')
  const [digestSending, setDigestSending] = useState(false)
  const [digestResult, setDigestResult] = useState('')
  const [verifyingId, setVerifyingId] = useState<string | null>(null)
  const [noteInputs, setNoteInputs] = useState<Record<string, string>>({})
  const [reports, setReports] = useState<any[]>([])
  const [reportsLoading, setReportsLoading] = useState(false)
  const [reportsError, setReportsError] = useState('')
  const [updatingReportId, setUpdatingReportId] = useState<string | null>(null)
  const [betaEmail, setBetaEmail] = useState('')
  const [betaTier, setBetaTier] = useState<'mystic' | 'twin_flame'>('mystic')
  const [betaNote, setBetaNote] = useState('')
  const [betaLoading, setBetaLoading] = useState(false)
  const [betaResult, setBetaResult] = useState<{success?: boolean; message?: string; error?: string} | null>(null)
  const [betaGranted, setBetaGranted] = useState<{email: string; tier: string; time: string}[]>([])

  useEffect(() => {
    fetch('/api/admin/stats')
      .then(r => r.json())
      .then(data => {
        if (data.error) setError(data.error)
        else setStats(data)
      })
      .catch(() => setError('Failed to load stats'))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    if (tab === 'revenue' && !revenue && !revLoading) {
      setRevLoading(true)
      fetch('/api/admin/revenue')
        .then(r => r.json())
        .then(data => {
          if (data.error) setRevError(data.error)
          else setRevenue(data)
        })
        .catch(() => setRevError('Failed to load revenue data'))
        .finally(() => setRevLoading(false))
    }
    if (tab === 'healers' && healers.length === 0 && !healersLoading) {
      loadHealers()
    }
    if (tab === 'reports' && reports.length === 0 && !reportsLoading) {
      loadReports()
    }
  }, [tab, revenue, revLoading, healers.length, healersLoading])

  async function loadReports() {
    setReportsLoading(true)
    setReportsError('')
    try {
      const res = await fetch('/api/admin/reports')
      const data = await res.json()
      if (data.error) setReportsError(data.error)
      else setReports(data.reports || [])
    } catch {
      setReportsError('Failed to load reports')
    } finally {
      setReportsLoading(false)
    }
  }

  async function updateReportStatus(id: string, status: string) {
    setUpdatingReportId(id)
    try {
      await fetch('/api/admin/reports', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status })
      })
      setReports(prev => prev.map(r => r.id === id ? { ...r, status } : r))
    } finally {
      setUpdatingReportId(null)
    }
  }

  async function loadHealers() {
    setHealersLoading(true)
    setHealersError('')
    try {
      const res = await fetch('/api/admin/healers')
      const data = await res.json()
      if (data.error) setHealersError(data.error)
      else setHealers(data.healers || [])
    } catch {
      setHealersError('Failed to load healers')
    } finally {
      setHealersLoading(false)
    }
  }

  async function toggleVerify(healer: HealerRow) {
    setVerifyingId(healer.id)
    try {
      const res = await fetch('/api/admin/verify-healer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          healerId: healer.id,
          verified: !healer.verified,
          notes: noteInputs[healer.id] || '',
        }),
      })
      const data = await res.json()
      if (data.success) {
        setHealers(prev =>
          prev.map(h =>
            h.id === healer.id
              ? { ...h, verified: !healer.verified, truth_score: data.healer.truth_score }
              : h
          )
        )
      }
    } catch {
      // silent
    } finally {
      setVerifyingId(null)
    }
  }

  const sendDigest = async () => {
    setDigestSending(true)
    setDigestResult('')
    try {
      const res = await fetch('/api/cron/weekly-digest', { method: 'POST' })
      const data = await res.json()
      setDigestResult(data.message || 'Sent!')
    } catch {
      setDigestResult('Failed to send')
    } finally {
      setDigestSending(false)
    }
  }

  const tabBtn = (t: 'overview' | 'revenue' | 'healers' | 'reports' | 'beta', label: string, icon: string) => (
    <button
      onClick={() => setTab(t)}
      style={{
        padding: '0.5rem 1.2rem',
        borderRadius: '999px',
        background: tab === t ? 'rgba(201,168,76,0.15)' : 'transparent',
        border: tab === t ? '1px solid rgba(201,168,76,0.5)' : '1px solid rgba(255,255,255,0.07)',
        color: tab === t ? '#c9a84c' : 'rgba(180,160,255,0.5)',
        cursor: 'pointer',
        fontSize: '0.85rem',
        fontWeight: 600,
        transition: 'all 0.2s',
      }}
    >
      {icon} {label}
    </button>
  )

  const statCard = (label: string, value: string | number, icon: string, color = '#c9a84c') => (
    <div style={{ ...card, textAlign: 'center' }}>
      <div style={{ fontSize: '1.8rem', marginBottom: '0.25rem' }}>{icon}</div>
      <div style={{ fontSize: '2rem', fontWeight: 800, color }}>{value}</div>
      <div style={{ fontSize: '0.75rem', color: 'rgba(180,160,255,0.5)', marginTop: '0.25rem' }}>{label}</div>
    </div>
  )

  const maxRevenue = revenue ? Math.max(...revenue.monthlyRevenue.map(m => m.revenue), 1) : 1

  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#c9a84c' }}>
      Loading admin data...
    </div>
  )

  return (
    <div style={{ maxWidth: 900, margin: '0 auto', padding: '2rem 1rem' }}>
      <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: '#c9a84c', marginBottom: '0.25rem' }}>Admin Dashboard</h1>
      <p style={{ color: 'rgba(180,160,255,0.5)', marginBottom: '1.5rem', fontSize: '0.85rem' }}>Platform overview and controls</p>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
        {tabBtn('overview', 'Overview', '📊')}
        {tabBtn('revenue', 'Revenue', '💰')}
        {tabBtn('healers', 'Healers', '✨')}
        {tabBtn('beta', 'Beta Access', '🔑')}
      </div>

      {/* OVERVIEW TAB */}
      {tab === 'overview' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {error && <div style={{ color: '#f87171', padding: '1rem', background: 'rgba(248,113,113,0.1)', borderRadius: '0.75rem' }}>{error}</div>}
          {stats && (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem' }}>
                {statCard('Total Users', stats.totalUsers, '👥')}
                {statCard('Angel Logs', stats.totalLogs, '💫', '#a78bfa')}
                {statCard('Posts', stats.totalPosts, '📝', '#60a5fa')}
                {statCard('Paying', stats.payingSubscribers, '👑', '#4ade80')}
              </div>

              <div style={card}>
                <h3 style={{ color: '#c9a84c', marginBottom: '1rem', fontSize: '1rem' }}>Subscription Breakdown</h3>
                {(['free', 'mystic', 'twin_flame'] as const).map(tier => {
                  const count = stats.subBreakdown[tier]
                  const pct = stats.totalUsers > 0 ? Math.round((count / stats.totalUsers) * 100) : 0
                  const colors: Record<string, string> = { free: '#6b7280', mystic: '#a78bfa', twin_flame: '#c9a84c' }
                  return (
                    <div key={tier} style={{ marginBottom: '0.75rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem', fontSize: '0.8rem' }}>
                        <span style={{ color: 'rgba(255,255,255,0.7)', textTransform: 'capitalize' }}>{tier.replace('_', ' ')}</span>
                        <span style={{ color: colors[tier] }}>{count} ({pct}%)</span>
                      </div>
                      <div style={{ height: 6, background: 'rgba(255,255,255,0.05)', borderRadius: 3 }}>
                        <div style={{ height: '100%', width: `${pct}%`, background: colors[tier], borderRadius: 3, transition: 'width 0.5s' }} />
                      </div>
                    </div>
                  )
                })}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div style={card}>
                  <h3 style={{ color: '#c9a84c', marginBottom: '0.75rem', fontSize: '0.9rem' }}>Recent Signups</h3>
                  {stats.recentSignups.slice(0, 8).map((u, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.4rem 0', borderBottom: '1px solid rgba(255,255,255,0.04)', fontSize: '0.75rem' }}>
                      <span style={{ color: 'rgba(255,255,255,0.7)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', maxWidth: '60%' }}>{u.email}</span>
                      <span style={{ color: 'rgba(180,160,255,0.4)' }}>{new Date(u.created_at).toLocaleDateString()}</span>
                    </div>
                  ))}
                </div>
                <div style={card}>
                  <h3 style={{ color: '#c9a84c', marginBottom: '0.75rem', fontSize: '0.9rem' }}>Recent Logs</h3>
                  {stats.recentLogs.slice(0, 8).map((l, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.4rem 0', borderBottom: '1px solid rgba(255,255,255,0.04)', fontSize: '0.75rem' }}>
                      <span style={{ color: '#c9a84c', fontWeight: 700 }}>{l.number}</span>
                      <span style={{ color: 'rgba(180,160,255,0.4)' }}>{new Date(l.created_at).toLocaleDateString()}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div style={card}>
                <h3 style={{ color: '#c9a84c', marginBottom: '0.75rem', fontSize: '0.9rem' }}>Weekly Cosmic Digest</h3>
                <p style={{ color: 'rgba(180,160,255,0.5)', fontSize: '0.8rem', marginBottom: '1rem' }}>Manually trigger the weekly digest email to all users with email notifications enabled.</p>
                <button
                  onClick={sendDigest}
                  disabled={digestSending}
                  style={{ padding: '0.6rem 1.5rem', borderRadius: '999px', background: 'rgba(201,168,76,0.15)', border: '1px solid rgba(201,168,76,0.4)', color: '#c9a84c', cursor: 'pointer', fontWeight: 600, fontSize: '0.85rem' }}
                >
                  {digestSending ? 'Sending...' : 'Send Digest Now'}
                </button>
                {digestResult && <p style={{ color: '#4ade80', marginTop: '0.5rem', fontSize: '0.8rem' }}>{digestResult}</p>}
              </div>
            </>
          )}
        </div>
      )}

      {/* REVENUE TAB */}
      {tab === 'revenue' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {revError && <div style={{ color: '#f87171', padding: '1rem', background: 'rgba(248,113,113,0.1)', borderRadius: '0.75rem' }}>{revError}</div>}
          {revLoading && <div style={{ color: '#c9a84c', textAlign: 'center', padding: '2rem' }}>Loading revenue data...</div>}
          {revenue && (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '1rem' }}>
                {statCard('MRR', `$${revenue.mrr.toFixed(2)}`, '💵', '#4ade80')}
                {statCard('Total Revenue', `$${revenue.totalRevenue.toFixed(2)}`, '💳')}
                {statCard('Platform Cut', `$${revenue.platformRevenue.toFixed(2)}`, '🏦', '#60a5fa')}
                {statCard('Churn Rate', `${revenue.churnRate}%`, '📉', revenue.churnRate > 10 ? '#f87171' : '#4ade80')}
              </div>

              <div style={card}>
                <h3 style={{ color: '#c9a84c', marginBottom: '1rem', fontSize: '1rem' }}>Monthly Revenue (6 months)</h3>
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: '0.5rem', height: 120 }}>
                  {revenue.monthlyRevenue.map((m, i) => (
                    <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.25rem' }}>
                      <span style={{ fontSize: '0.6rem', color: '#4ade80' }}>${m.revenue.toFixed(0)}</span>
                      <div style={{ width: '100%', background: 'rgba(74,222,128,0.2)', borderRadius: '4px 4px 0 0', height: `${Math.max((m.revenue / maxRevenue) * 90, 4)}px`, border: '1px solid rgba(74,222,128,0.3)' }} />
                      <span style={{ fontSize: '0.6rem', color: 'rgba(180,160,255,0.4)' }}>{m.month}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div style={card}>
                <h3 style={{ color: '#c9a84c', marginBottom: '0.75rem', fontSize: '0.9rem' }}>Recent Charges</h3>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.75rem' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
                        {['Email', 'Amount', 'Status', 'Date'].map(h => (
                          <th key={h} style={{ padding: '0.5rem', textAlign: 'left', color: 'rgba(180,160,255,0.5)', fontWeight: 600 }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {revenue.recentCharges.map((c, i) => (
                        <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                          <td style={{ padding: '0.5rem', color: 'rgba(255,255,255,0.7)', maxWidth: 160, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.email}</td>
                          <td style={{ padding: '0.5rem', color: '#4ade80', fontWeight: 700 }}>${(c.amount / 100).toFixed(2)}</td>
                          <td style={{ padding: '0.5rem' }}>
                            <span style={{ background: c.status === 'succeeded' ? 'rgba(74,222,128,0.15)' : 'rgba(248,113,113,0.15)', color: c.status === 'succeeded' ? '#4ade80' : '#f87171', borderRadius: '999px', padding: '0.1rem 0.5rem', fontSize: '0.65rem', fontWeight: 700 }}>
                              {c.status}
                            </span>
                          </td>
                          <td style={{ padding: '0.5rem', color: 'rgba(180,160,255,0.4)' }}>{new Date(c.created).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* HEALERS TAB */}
      {tab === 'healers' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
            <div>
              <h2 style={{ color: '#c9a84c', fontSize: '1.1rem', fontWeight: 700 }}>Healer Verification</h2>
              <p style={{ color: 'rgba(180,160,255,0.5)', fontSize: '0.8rem' }}>{healers.length} registered healers</p>
            </div>
            <button
              onClick={loadHealers}
              style={{ padding: '0.4rem 1rem', borderRadius: '999px', background: 'rgba(167,139,250,0.1)', border: '1px solid rgba(167,139,250,0.3)', color: '#a78bfa', cursor: 'pointer', fontSize: '0.8rem' }}
            >
              Refresh
            </button>
          </div>

          {healersError && <div style={{ color: '#f87171', padding: '1rem', background: 'rgba(248,113,113,0.1)', borderRadius: '0.75rem' }}>{healersError}</div>}
          {healersLoading && <div style={{ color: '#c9a84c', textAlign: 'center', padding: '2rem' }}>Loading healers...</div>}

          {/* Stats row */}
          {healers.length > 0 && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
              {statCard('Total', healers.length, '🧑‍⚕️')}
              {statCard('Verified', healers.filter(h => h.verified).length, '✅', '#4ade80')}
              {statCard('Pending', healers.filter(h => !h.verified).length, '⏳', '#f59e0b')}
            </div>
          )}

          {/* Healer cards */}
          {healers.map(healer => (
            <div key={healer.id} style={{ ...card, padding: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.25rem' }}>
                    <span style={{ fontWeight: 700, color: 'rgba(255,255,255,0.9)', fontSize: '0.95rem' }}>{healer.name}</span>
                    {healer.verified ? (
                      <span style={{ background: 'rgba(74,222,128,0.15)', border: '1px solid rgba(74,222,128,0.3)', borderRadius: '999px', padding: '0.1rem 0.5rem', fontSize: '0.65rem', color: '#4ade80', fontWeight: 700 }}>✓ VERIFIED</span>
                    ) : (
                      <span style={{ background: 'rgba(245,158,11,0.15)', border: '1px solid rgba(245,158,11,0.3)', borderRadius: '999px', padding: '0.1rem 0.5rem', fontSize: '0.65rem', color: '#f59e0b', fontWeight: 700 }}>PENDING</span>
                    )}
                    {healer.stripe_account_id && (
                      <span style={{ background: 'rgba(96,165,250,0.15)', border: '1px solid rgba(96,165,250,0.3)', borderRadius: '999px', padding: '0.1rem 0.5rem', fontSize: '0.65rem', color: '#60a5fa', fontWeight: 700 }}>💳 Stripe Connected</span>
                    )}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'rgba(180,160,255,0.5)', marginBottom: '0.5rem' }}>{healer.email}</div>
                  <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '0.5rem' }}>
                    {(healer.modalities || []).slice(0, 4).map(m => (
                      <span key={m} style={{ background: 'rgba(167,139,250,0.1)', border: '1px solid rgba(167,139,250,0.2)', borderRadius: '999px', padding: '0.1rem 0.5rem', fontSize: '0.65rem', color: '#a78bfa' }}>{m}</span>
                    ))}
                  </div>
                  <div style={{ display: 'flex', gap: '1rem', fontSize: '0.75rem', color: 'rgba(180,160,255,0.4)' }}>
                    <span>Truth Score: <strong style={{ color: '#c9a84c' }}>{healer.truth_score}%</strong></span>
                    <span>Joined: {new Date(healer.created_at).toLocaleDateString()}</span>
                  </div>
                  {healer.verification_notes && (
                    <div style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: 'rgba(180,160,255,0.5)', fontStyle: 'italic' }}>Note: {healer.verification_notes}</div>
                  )}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', minWidth: 140 }}>
                  <input
                    type="text"
                    placeholder="Verification note..."
                    value={noteInputs[healer.id] || ''}
                    onChange={e => setNoteInputs(prev => ({ ...prev, [healer.id]: e.target.value }))}
                    style={{ padding: '0.4rem 0.6rem', borderRadius: '0.5rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.8)', fontSize: '0.72rem', outline: 'none', width: '100%', boxSizing: 'border-box' }}
                  />
                  <button
                    onClick={() => toggleVerify(healer)}
                    disabled={verifyingId === healer.id}
                    style={{
                      padding: '0.5rem 1rem',
                      borderRadius: '999px',
                      background: healer.verified ? 'rgba(248,113,113,0.15)' : 'rgba(74,222,128,0.15)',
                      border: healer.verified ? '1px solid rgba(248,113,113,0.4)' : '1px solid rgba(74,222,128,0.4)',
                      color: healer.verified ? '#f87171' : '#4ade80',
                      cursor: verifyingId === healer.id ? 'not-allowed' : 'pointer',
                      fontWeight: 700,
                      fontSize: '0.8rem',
                      opacity: verifyingId === healer.id ? 0.6 : 1,
                      transition: 'all 0.2s',
                    }}
                  >
                    {verifyingId === healer.id ? '...' : healer.verified ? 'Revoke' : 'Verify'}
                  </button>
                </div>
              </div>
            </div>
          ))}

          {!healersLoading && healers.length === 0 && (
            <div style={{ ...card, textAlign: 'center', padding: '3rem' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🧑‍⚕️</div>
              <div style={{ color: 'rgba(180,160,255,0.5)' }}>No healers registered yet</div>
            </div>
          )}
        </div>
      )}
      {tab === 'reports' && (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <h3 style={{ color: '#c9a84c', fontSize: '1rem', margin: 0 }}>User & Content Reports</h3>
            <button onClick={loadReports} style={{ background: 'rgba(167,139,250,0.1)', border: '1px solid rgba(167,139,250,0.3)', color: '#a78bfa', padding: '0.4rem 0.8rem', borderRadius: '0.5rem', cursor: 'pointer', fontSize: '0.8rem' }}>
              Refresh
            </button>
          </div>

          {reportsLoading && <div style={{ textAlign: 'center', color: 'rgba(255,255,255,0.4)', padding: '2rem' }}>Loading reports...</div>}
          {reportsError && <div style={{ color: '#f87171', padding: '1rem', background: 'rgba(239,68,68,0.1)', borderRadius: '0.5rem', marginBottom: '1rem' }}>{reportsError}</div>}

          {!reportsLoading && reports.length === 0 && (
            <div style={{ textAlign: 'center', padding: '3rem', color: 'rgba(255,255,255,0.4)' }}>
              <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>✅</div>
              <div>No reports yet. Community is clean!</div>
            </div>
          )}

          <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
            {['pending', 'reviewed', 'resolved', 'dismissed'].map(s => (
              <span key={s} style={{
                padding: '0.2rem 0.6rem', borderRadius: '999px', fontSize: '0.75rem',
                background: s === 'pending' ? 'rgba(251,191,36,0.15)' : s === 'resolved' ? 'rgba(34,197,94,0.15)' : s === 'dismissed' ? 'rgba(107,114,128,0.15)' : 'rgba(167,139,250,0.15)',
                color: s === 'pending' ? '#fbbf24' : s === 'resolved' ? '#22c55e' : s === 'dismissed' ? '#9ca3af' : '#a78bfa',
                border: '1px solid currentColor'
              }}>
                {reports.filter(r => r.status === s).length} {s}
              </span>
            ))}
          </div>

          {reports.map((report: any) => (
            <div key={report.id} style={{ background: 'rgba(8,6,28,0.8)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '0.75rem', padding: '1rem', marginBottom: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem', flexWrap: 'wrap' }}>
                    <span style={{ padding: '0.15rem 0.5rem', borderRadius: '999px', fontSize: '0.7rem', background: 'rgba(167,139,250,0.15)', color: '#a78bfa', border: '1px solid rgba(167,139,250,0.3)' }}>
                      {report.target_type}
                    </span>
                    <span style={{ padding: '0.15rem 0.5rem', borderRadius: '999px', fontSize: '0.7rem',
                      background: report.status === 'pending' ? 'rgba(251,191,36,0.15)' : report.status === 'resolved' ? 'rgba(34,197,94,0.15)' : 'rgba(107,114,128,0.15)',
                      color: report.status === 'pending' ? '#fbbf24' : report.status === 'resolved' ? '#22c55e' : '#9ca3af' }}>
                      {report.status}
                    </span>
                    <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.75rem' }}>
                      {new Date(report.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.9rem', marginBottom: '0.25rem' }}>
                    <strong>Reason:</strong> {report.reason}
                  </div>
                  {report.details && (
                    <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.8rem' }}>{report.details}</div>
                  )}
                  <div style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.75rem', marginTop: '0.25rem' }}>
                    Target ID: {report.target_id}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '0.4rem', flexShrink: 0, flexWrap: 'wrap' }}>
                  {report.status === 'pending' && (
                    <>
                      <button
                        onClick={() => updateReportStatus(report.id, 'reviewed')}
                        disabled={updatingReportId === report.id}
                        style={{ padding: '0.35rem 0.7rem', borderRadius: '0.4rem', border: 'none', cursor: 'pointer', fontSize: '0.75rem', background: 'rgba(167,139,250,0.2)', color: '#a78bfa' }}>
                        Review
                      </button>
                      <button
                        onClick={() => updateReportStatus(report.id, 'resolved')}
                        disabled={updatingReportId === report.id}
                        style={{ padding: '0.35rem 0.7rem', borderRadius: '0.4rem', border: 'none', cursor: 'pointer', fontSize: '0.75rem', background: 'rgba(34,197,94,0.2)', color: '#22c55e' }}>
                        Resolve
                      </button>
                      <button
                        onClick={() => updateReportStatus(report.id, 'dismissed')}
                        disabled={updatingReportId === report.id}
                        style={{ padding: '0.35rem 0.7rem', borderRadius: '0.4rem', border: 'none', cursor: 'pointer', fontSize: '0.75rem', background: 'rgba(107,114,128,0.2)', color: '#9ca3af' }}>
                        Dismiss
                      </button>
                    </>
                  )}
                  {report.status !== 'pending' && (
                    <button
                      onClick={() => updateReportStatus(report.id, 'pending')}
                      disabled={updatingReportId === report.id}
                      style={{ padding: '0.35rem 0.7rem', borderRadius: '0.4rem', border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer', fontSize: '0.75rem', background: 'transparent', color: 'rgba(255,255,255,0.4)' }}>
                      Reopen
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* BETA TESTERS TAB */}
      {tab === 'beta' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ ...card }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#c9a84c', marginBottom: '0.25rem' }}>🔑 Grant Beta Access</h2>
            <p style={{ color: 'rgba(180,160,255,0.5)', fontSize: '0.8rem', marginBottom: '1.5rem' }}>
              When a tester DMs you their email, enter it here to activate their free Mystic or Twin Flame tier.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ display: 'block', color: 'rgba(180,160,255,0.7)', fontSize: '0.8rem', marginBottom: '0.4rem' }}>Tester Email</label>
                <input
                  type="email"
                  value={betaEmail}
                  onChange={e => setBetaEmail(e.target.value)}
                  placeholder="tester@example.com"
                  style={{
                    width: '100%', padding: '0.75rem 1rem', borderRadius: '0.75rem',
                    background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                    color: '#fff', fontSize: '0.95rem', boxSizing: 'border-box'
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', color: 'rgba(180,160,255,0.7)', fontSize: '0.8rem', marginBottom: '0.4rem' }}>Tier to Grant</label>
                <select
                  value={betaTier}
                  onChange={e => setBetaTier(e.target.value as 'mystic' | 'twin_flame')}
                  style={{
                    width: '100%', padding: '0.75rem 1rem', borderRadius: '0.75rem',
                    background: 'rgba(30,20,60,0.95)', border: '1px solid rgba(255,255,255,0.1)',
                    color: '#fff', fontSize: '0.95rem'
                  }}
                >
                  <option value="mystic">✨ Mystic ($6.99/mo value)</option>
                  <option value="twin_flame">🔥 Twin Flame ($9.99/mo value)</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', color: 'rgba(180,160,255,0.7)', fontSize: '0.8rem', marginBottom: '0.4rem' }}>Note (optional)</label>
                <input
                  type="text"
                  value={betaNote}
                  onChange={e => setBetaNote(e.target.value)}
                  placeholder="e.g. Reddit beta tester, r/betatests"
                  style={{
                    width: '100%', padding: '0.75rem 1rem', borderRadius: '0.75rem',
                    background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                    color: '#fff', fontSize: '0.95rem', boxSizing: 'border-box'
                  }}
                />
              </div>
              <button
                onClick={async () => {
                  if (!betaEmail.trim()) return
                  setBetaLoading(true)
                  setBetaResult(null)
                  try {
                    const res = await fetch('/api/admin/grant-access', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ email: betaEmail.trim(), tier: betaTier, note: betaNote })
                    })
                    const data = await res.json()
                    setBetaResult(data)
                    if (data.success) {
                      setBetaGranted(prev => [{ email: betaEmail.trim(), tier: betaTier, time: new Date().toLocaleTimeString() }, ...prev])
                      setBetaEmail('')
                      setBetaNote('')
                    }
                  } catch (e: any) {
                    setBetaResult({ error: e.message })
                  } finally {
                    setBetaLoading(false)
                  }
                }}
                disabled={betaLoading || !betaEmail.trim()}
                style={{
                  padding: '0.85rem 2rem', borderRadius: '0.75rem', border: 'none',
                  background: betaLoading ? 'rgba(201,168,76,0.3)' : 'linear-gradient(135deg, #c9a84c, #a78bfa)',
                  color: '#fff', fontWeight: 700, fontSize: '1rem', cursor: betaLoading ? 'not-allowed' : 'pointer'
                }}
              >
                {betaLoading ? 'Granting...' : '🔑 Grant Access'}
              </button>
              {betaResult && (
                <div style={{
                  padding: '0.75rem 1rem', borderRadius: '0.75rem',
                  background: betaResult.success ? 'rgba(74,222,128,0.1)' : 'rgba(248,113,113,0.1)',
                  border: `1px solid ${betaResult.success ? 'rgba(74,222,128,0.3)' : 'rgba(248,113,113,0.3)'}`,
                  color: betaResult.success ? '#4ade80' : '#f87171', fontSize: '0.9rem'
                }}>
                  {betaResult.success ? '✓ ' : '✗ '}{betaResult.message || betaResult.error}
                </div>
              )}
            </div>
          </div>

          {betaGranted.length > 0 && (
            <div style={{ ...card }}>
              <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#c9a84c', marginBottom: '1rem' }}>📋 Granted This Session</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {betaGranted.map((g, i) => (
                  <div key={i} style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    padding: '0.6rem 0.75rem', borderRadius: '0.5rem',
                    background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)'
                  }}>
                    <span style={{ color: '#e2d9f3', fontSize: '0.85rem' }}>{g.email}</span>
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.75rem', color: '#c9a84c', background: 'rgba(201,168,76,0.1)', padding: '0.2rem 0.5rem', borderRadius: '999px' }}>
                        {g.tier === 'mystic' ? '✨ Mystic' : '🔥 Twin Flame'}
                      </span>
                      <span style={{ fontSize: '0.7rem', color: 'rgba(180,160,255,0.4)' }}>{g.time}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div style={{ ...card, background: 'rgba(201,168,76,0.05)', border: '1px solid rgba(201,168,76,0.15)' }}>
            <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#c9a84c', marginBottom: '0.75rem' }}>💬 How to handle DMs</h3>
            <ol style={{ color: 'rgba(180,160,255,0.7)', fontSize: '0.82rem', lineHeight: 1.8, paddingLeft: '1.2rem', margin: 0 }}>
              <li>Tester signs up at synchrosoul.app</li>
              <li>They DM you their account email</li>
              <li>Enter it above and click Grant Access</li>
              <li>They refresh the app — premium features unlock instantly</li>
              <li>To revoke later, use Supabase dashboard or contact you</li>
            </ol>
          </div>
        </div>
      )}
    </div>
  )
}
