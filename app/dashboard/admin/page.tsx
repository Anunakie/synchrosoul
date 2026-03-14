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

export default function AdminPage() {
  const [tab, setTab] = useState<'overview' | 'revenue'>('overview')
  const [stats, setStats] = useState<AdminStats | null>(null)
  const [revenue, setRevenue] = useState<RevenueData | null>(null)
  const [loading, setLoading] = useState(true)
  const [revLoading, setRevLoading] = useState(false)
  const [error, setError] = useState('')
  const [revError, setRevError] = useState('')
  const [digestSending, setDigestSending] = useState(false)
  const [digestResult, setDigestResult] = useState('')

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
  }, [tab, revenue, revLoading])

  const sendDigest = async () => {
    setDigestSending(true)
    setDigestResult('')
    try {
      const res = await fetch('/api/cron/weekly-digest', { method: 'POST' })
      const data = await res.json()
      setDigestResult('Sent: ' + (data.sent ?? 0) + ', Failed: ' + (data.failed ?? 0))
    } catch {
      setDigestResult('Failed to trigger digest')
    } finally {
      setDigestSending(false)
    }
  }

  const tabBtn = (t: 'overview' | 'revenue', label: string, icon: string) => (
    <button
      onClick={() => setTab(t)}
      style={{
        padding: '0.6rem 1.5rem',
        borderRadius: '9999px',
        background: tab === t ? 'rgba(201,168,76,0.15)' : 'transparent',
        border: tab === t ? '1px solid rgba(201,168,76,0.5)' : '1px solid rgba(255,255,255,0.07)',
        color: tab === t ? '#c9a84c' : 'rgba(180,160,255,0.5)',
        cursor: 'pointer',
        fontSize: '0.8rem',
        letterSpacing: '0.08em',
        textTransform: 'uppercase' as const,
        transition: 'all 0.2s',
      }}
    >
      {icon} {label}
    </button>
  )

  if (loading) return (
    <div style={{ padding: '2rem', textAlign: 'center', color: 'rgba(200,180,255,0.5)' }}>
      <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⚡</div>
      Loading admin data...
    </div>
  )

  if (error) return (
    <div style={{ padding: '2rem', textAlign: 'center', color: 'rgba(255,100,100,0.7)' }}>
      {error}
    </div>
  )

  if (!stats) return null

  const totalSubs = stats.subBreakdown.free + stats.subBreakdown.mystic + stats.subBreakdown.twin_flame
  const barMax = Math.max(stats.subBreakdown.free, stats.subBreakdown.mystic, stats.subBreakdown.twin_flame, 1)
  const maxRevenue = revenue ? Math.max(...revenue.monthlyRevenue.map(m => m.revenue), 1) : 1

  return (
    <div style={{ padding: '1.5rem', maxWidth: '960px', margin: '0 auto' }}>

      <div style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
          <span style={{ fontSize: '1.5rem' }}>⚡</span>
          <h1 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '2rem', color: 'rgba(220,200,255,0.95)', margin: 0 }}>Admin Dashboard</h1>
        </div>
        <p style={{ color: 'rgba(180,160,255,0.4)', fontSize: '0.8rem', letterSpacing: '0.1em', textTransform: 'uppercase', margin: 0 }}>Platform Overview</p>
      </div>

      <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1.5rem' }}>
        {tabBtn('overview', 'Overview', '📊')}
        {tabBtn('revenue', 'Revenue', '💰')}
      </div>

      {tab === 'overview' && (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
            {[
              { label: 'Total Users', value: stats.totalUsers, icon: '👥', color: '#a78bfa' },
              { label: 'Angel Logs', value: stats.totalLogs, icon: '✦', color: '#c9a84c' },
              { label: 'Total Posts', value: stats.totalPosts, icon: '✧', color: '#60a5fa' },
              { label: 'Paying Subscribers', value: stats.payingSubscribers, icon: '⭐', color: '#4ade80' },
            ].map(s => (
              <div key={s.label} style={{ ...card, textAlign: 'center' }}>
                <div style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>{s.icon}</div>
                <div style={{ fontSize: '2rem', fontWeight: 700, color: s.color, fontFamily: 'Cormorant Garamond, serif' }}>{s.value.toLocaleString()}</div>
                <div style={{ fontSize: '0.7rem', color: 'rgba(180,160,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: '0.25rem' }}>{s.label}</div>
              </div>
            ))}
          </div>

          <div style={{ ...card, marginBottom: '1.5rem' }}>
            <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.25rem', color: 'rgba(220,200,255,0.8)', margin: '0 0 1.25rem' }}>Subscription Breakdown</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {[
                { tier: 'Free', count: stats.subBreakdown.free, color: 'rgba(180,160,255,0.5)' },
                { tier: 'Mystic ($6.99)', count: stats.subBreakdown.mystic, color: '#a78bfa' },
                { tier: 'Twin Flame ($9.99)', count: stats.subBreakdown.twin_flame, color: '#c9a84c' },
              ].map(({ tier, count, color }) => (
                <div key={tier}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                    <span style={{ fontSize: '0.8rem', color: 'rgba(200,180,255,0.7)' }}>{tier}</span>
                    <span style={{ fontSize: '0.8rem', color, fontWeight: 600 }}>{count} ({totalSubs > 0 ? Math.round(count / totalSubs * 100) : 0}%)</span>
                  </div>
                  <div style={{ height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '9999px', overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: (count / barMax * 100) + '%', background: color, borderRadius: '9999px', transition: 'width 0.6s ease' }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ ...card, marginBottom: '1.5rem' }}>
            <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.25rem', color: 'rgba(220,200,255,0.8)', margin: '0 0 1rem' }}>Admin Actions</h2>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
              <button
                onClick={sendDigest}
                disabled={digestSending}
                style={{
                  padding: '0.65rem 1.5rem', borderRadius: '9999px',
                  background: digestSending ? 'rgba(201,168,76,0.1)' : 'rgba(201,168,76,0.15)',
                  border: '1px solid rgba(201,168,76,0.4)',
                  color: '#c9a84c', cursor: digestSending ? 'not-allowed' : 'pointer',
                  fontSize: '0.8rem', letterSpacing: '0.08em', textTransform: 'uppercase',
                }}
              >
                {digestSending ? 'Sending...' : '📧 Send Weekly Digest Now'}
              </button>
              {digestResult && (
                <span style={{ fontSize: '0.8rem', color: digestResult.startsWith('Sent') ? '#4ade80' : 'rgba(255,100,100,0.7)' }}>
                  {digestResult}
                </span>
              )}
            </div>
          </div>

          <div style={{ ...card, marginBottom: '1.5rem' }}>
            <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.25rem', color: 'rgba(220,200,255,0.8)', margin: '0 0 1rem' }}>Recent Signups</h2>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
                <thead>
                  <tr>
                    {['Email', 'Joined'].map(h => (
                      <th key={h} style={{ textAlign: 'left', padding: '0.5rem 0.75rem', color: 'rgba(180,160,255,0.4)', fontWeight: 400, textTransform: 'uppercase', letterSpacing: '0.08em', fontSize: '0.65rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {stats.recentSignups.map((u, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                      <td style={{ padding: '0.6rem 0.75rem', color: 'rgba(200,180,255,0.7)' }}>{u.email}</td>
                      <td style={{ padding: '0.6rem 0.75rem', color: 'rgba(180,160,255,0.4)' }}>{new Date(u.created_at).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div style={card}>
            <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.25rem', color: 'rgba(220,200,255,0.8)', margin: '0 0 1rem' }}>Recent Angel Logs</h2>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {stats.recentLogs.map((log, i) => (
                <div key={i} style={{
                  padding: '0.4rem 1rem', borderRadius: '9999px',
                  background: 'rgba(201,168,76,0.08)', border: '1px solid rgba(201,168,76,0.2)',
                  fontSize: '0.85rem', color: '#c9a84c', letterSpacing: '0.1em',
                }}>
                  {log.number}
                  <span style={{ fontSize: '0.65rem', color: 'rgba(180,160,255,0.35)', marginLeft: '0.5rem' }}>
                    {new Date(log.created_at).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {tab === 'revenue' && (
        <>
          {revLoading && (
            <div style={{ padding: '3rem', textAlign: 'center', color: 'rgba(200,180,255,0.5)' }}>
              <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>💰</div>
              Loading Stripe data...
            </div>
          )}
          {revError && (
            <div style={{ padding: '2rem', textAlign: 'center', color: 'rgba(255,100,100,0.7)' }}>
              {revError}
            </div>
          )}
          {revenue && (
            <>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
                {[
                  { label: 'MRR', value: '$' + revenue.mrr.toFixed(2), icon: '📈', color: '#4ade80', sub: 'Monthly Recurring' },
                  { label: 'Total Revenue', value: '$' + revenue.totalRevenue.toFixed(2), icon: '💵', color: '#c9a84c', sub: 'All time' },
                  { label: 'Platform Fees', value: '$' + revenue.platformRevenue.toFixed(2), icon: '🏦', color: '#60a5fa', sub: '12% cut' },
                  { label: 'Active Subs', value: revenue.activeSubscribers, icon: '⭐', color: '#a78bfa', sub: 'Paying now' },
                  { label: 'Churn Rate', value: revenue.churnRate + '%', icon: '📉', color: revenue.churnRate > 20 ? '#f87171' : '#4ade80', sub: 'Canceled / total' },
                ].map(s => (
                  <div key={s.label} style={{ ...card, textAlign: 'center' }}>
                    <div style={{ fontSize: '1.5rem', marginBottom: '0.4rem' }}>{s.icon}</div>
                    <div style={{ fontSize: '1.6rem', fontWeight: 700, color: s.color, fontFamily: 'Cormorant Garamond, serif' }}>{s.value}</div>
                    <div style={{ fontSize: '0.65rem', color: 'rgba(180,160,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.1em', marginTop: '0.2rem' }}>{s.sub}</div>
                  </div>
                ))}
              </div>

              <div style={{ ...card, marginBottom: '1.5rem' }}>
                <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.25rem', color: 'rgba(220,200,255,0.8)', margin: '0 0 1.5rem' }}>Revenue — Last 6 Months</h2>
                <div style={{ display: 'flex', alignItems: 'flex-end', gap: '0.75rem', height: '140px' }}>
                  {revenue.monthlyRevenue.map((m, i) => {
                    const pct = maxRevenue > 0 ? (m.revenue / maxRevenue) * 100 : 0
                    const isLatest = i === revenue.monthlyRevenue.length - 1
                    return (
                      <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem', height: '100%', justifyContent: 'flex-end' }}>
                        <div style={{ fontSize: '0.65rem', color: '#4ade80', fontWeight: 600 }}>
                          {m.revenue > 0 ? '$' + m.revenue.toFixed(0) : ''}
                        </div>
                        <div style={{
                          width: '100%',
                          height: Math.max(pct, 2) + '%',
                          background: isLatest
                            ? 'linear-gradient(to top, #c9a84c, #f0d080)'
                            : 'linear-gradient(to top, rgba(167,139,250,0.6), rgba(167,139,250,0.3))',
                          borderRadius: '6px 6px 0 0',
                          transition: 'height 0.6s ease',
                          minHeight: '4px',
                        }} />
                        <div style={{ fontSize: '0.6rem', color: 'rgba(180,160,255,0.4)', whiteSpace: 'nowrap' }}>{m.month}</div>
                      </div>
                    )
                  })}
                </div>
              </div>

              <div style={{ ...card, marginBottom: '1.5rem' }}>
                <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.25rem', color: 'rgba(220,200,255,0.8)', margin: '0 0 1.25rem' }}>Active Subscribers by Tier</h2>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {[
                    { tier: 'Mystic ($6.99/mo)', count: revenue.tierCounts.mystic, color: '#a78bfa', mrr: revenue.tierCounts.mystic * 6.99 },
                    { tier: 'Twin Flame ($9.99/mo)', count: revenue.tierCounts.twin_flame, color: '#c9a84c', mrr: revenue.tierCounts.twin_flame * 9.99 },
                  ].map(({ tier, count, color, mrr }) => {
                    const total = Math.max(revenue.activeSubscribers, 1)
                    return (
                      <div key={tier}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem' }}>
                          <span style={{ fontSize: '0.8rem', color: 'rgba(200,180,255,0.7)' }}>{tier}</span>
                          <span style={{ fontSize: '0.8rem', color, fontWeight: 600 }}>
                            {count} users &bull; ${mrr.toFixed(2)}/mo
                          </span>
                        </div>
                        <div style={{ height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '9999px', overflow: 'hidden' }}>
                          <div style={{ height: '100%', width: (count / total * 100) + '%', background: color, borderRadius: '9999px', transition: 'width 0.6s ease' }} />
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              <div style={card}>
                <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontSize: '1.25rem', color: 'rgba(220,200,255,0.8)', margin: '0 0 1rem' }}>Recent Charges</h2>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.78rem' }}>
                    <thead>
                      <tr>
                        {['Customer', 'Amount', 'Status', 'Date'].map(h => (
                          <th key={h} style={{ textAlign: 'left', padding: '0.5rem 0.75rem', color: 'rgba(180,160,255,0.4)', fontWeight: 400, textTransform: 'uppercase', letterSpacing: '0.08em', fontSize: '0.65rem', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {revenue.recentCharges.map((c, i) => (
                        <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                          <td style={{ padding: '0.6rem 0.75rem', color: 'rgba(200,180,255,0.7)' }}>{c.email}</td>
                          <td style={{ padding: '0.6rem 0.75rem', color: '#4ade80', fontWeight: 600 }}>${c.amount.toFixed(2)}</td>
                          <td style={{ padding: '0.6rem 0.75rem' }}>
                            <span style={{
                              padding: '0.2rem 0.6rem', borderRadius: '9999px', fontSize: '0.65rem',
                              background: c.status === 'succeeded' ? 'rgba(74,222,128,0.1)' : 'rgba(248,113,113,0.1)',
                              color: c.status === 'succeeded' ? '#4ade80' : '#f87171',
                              border: '1px solid ' + (c.status === 'succeeded' ? 'rgba(74,222,128,0.3)' : 'rgba(248,113,113,0.3)'),
                            }}>
                              {c.status}
                            </span>
                          </td>
                          <td style={{ padding: '0.6rem 0.75rem', color: 'rgba(180,160,255,0.4)' }}>{new Date(c.created).toLocaleDateString()}</td>
                        </tr>
                      ))}
                      {revenue.recentCharges.length === 0 && (
                        <tr>
                          <td colSpan={4} style={{ padding: '1.5rem', textAlign: 'center', color: 'rgba(180,160,255,0.3)' }}>
                            No charges yet
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </>
      )}
    </div>
  )
}
