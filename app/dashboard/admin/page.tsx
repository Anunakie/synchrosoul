'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

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
  tierCounts: Record<string, number>
  recentSignups: { id: string; email: string; created_at: string; display_name?: string; subscription_tier: string }[]
  recentLogs: { number: string; created_at: string; user_id: string }[]
}

interface RevenueData {
  mrr: number
  totalRevenue: number
  platformRevenue: number
  activeSubscribers: number
  canceledSubscribers: number
  churnRate: number
  tierCounts: Record<string, number>
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
  const [betaTier, setBetaTier] = useState<string>('mystic')
  const [betaNote, setBetaNote] = useState('')
  const [betaLoading, setBetaLoading] = useState(false)
  const [betaResult, setBetaResult] = useState<{success?: boolean; message?: string; error?: string} | null>(null)
  const [betaGranted, setBetaGranted] = useState<{email: string; tier: string; time: string}[]>([])
  const [betaUsers, setBetaUsers] = useState<{id: string; email: string; display_name: string; subscription_tier: string; beta_note: string; beta_granted_at: string; created_at: string}[]>([])
  const [betaUsersLoading, setBetaUsersLoading] = useState(false)
  const [selectedBetaIds, setSelectedBetaIds] = useState<Set<string>>(new Set())
  const [betaSignups, setBetaSignups] = useState<{id: string; email: string; name: string | null; device: string; reason: string | null; status: string; created_at: string; notes: string | null}[]>([])
  const [betaSignupsLoading, setBetaSignupsLoading] = useState(false)
  const [betaSignupsFilter, setBetaSignupsFilter] = useState('all')
  const [betaSubTab, setBetaSubTab] = useState<'grant' | 'signups' | 'users' | 'activity'>('activity')
  const [togglingId, setTogglingId] = useState<string | null>(null)
  const [bulkRevoking, setBulkRevoking] = useState(false)
  const [betaActivity, setBetaActivity] = useState<{id: string; email: string; display_name: string; subscription_tier: string; signed_up: string; avatar_url: string | null; angel_logs: number; posts: number; dreams: number; last_activity: string | null; last_number: string | null; last_thought: string | null; recent_logs: {number: string; created_at: string; thought: string | null}[]}[]>([])
  const [betaActivityLoading, setBetaActivityLoading] = useState(false)
  const [expandedUserId, setExpandedUserId] = useState<string | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [authToken, setAuthToken] = useState<string | null>(null)
  const [adminChecking, setAdminChecking] = useState(true)
  const router = useRouter()

    // ── Admin guard ──────────────────────────────────────────────────────────
  useEffect(() => {
    const checkAdmin = async () => {
      const supabase = createClient()
      // Refresh session to ensure we have a valid, non-expired token
      const { data: { session }, error } = await supabase.auth.refreshSession()
      if (!session || error) {
        // Fall back to getSession if refresh fails
        const { data: { session: fallbackSession } } = await supabase.auth.getSession()
        if (!fallbackSession) {
          router.replace('/auth/login')
          return
        }
        const email = fallbackSession.user.email?.toLowerCase()
        if (email !== 'dezekiel@live.com') {
          router.replace('/dashboard')
          return
        }
        setAuthToken(fallbackSession.access_token)
        setIsAdmin(true)
        setAdminChecking(false)
        return
      }
      const email = session.user.email?.toLowerCase()
      if (email !== 'dezekiel@live.com') {
        router.replace('/dashboard')
        return
      }
      setAuthToken(session.access_token)
      setIsAdmin(true)
      setAdminChecking(false)
    }
    checkAdmin()
  }, [])

  useEffect(() => {
    if (!authToken) return
    fetch('/api/admin/stats', { headers: { Authorization: `Bearer ${authToken}` } })
      .then(r => r.json())
      .then(data => {
        if (data.error) setError(data.error)
        else setStats(data)
      })
      .catch(() => setError('Failed to load stats'))
      .finally(() => setLoading(false))
  }, [authToken])

  useEffect(() => {
    if (!authToken) return
    if (tab === 'revenue' && !revenue && !revLoading) {
      setRevLoading(true)
      fetch('/api/admin/revenue', { headers: { Authorization: `Bearer ${authToken}` } })
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
    if (tab === 'beta') {
      loadBetaUsers()
      loadBetaSignups()
      loadBetaActivity()
    }
  }, [tab, revenue, revLoading, healers.length, healersLoading, authToken])

  async function loadReports() {
    setReportsLoading(true)
    setReportsError('')
    try {
      const res = await fetch('/api/admin/reports', { headers: { Authorization: `Bearer ${authToken}` } })
      const data = await res.json()
      if (data.error) setReportsError(data.error)
      else setReports(data.reports || [])
    } catch {
      setReportsError('Failed to load reports')
    } finally {
      setReportsLoading(false)
    }
  }

  const loadBetaUsers = async () => {
    setBetaUsersLoading(true)
    try {
      const res = await fetch('/api/admin/beta-users', {
        headers: { Authorization: `Bearer ${authToken}` }
      })
      const data = await res.json()
      if (data.users) setBetaUsers(data.users || [])
    } catch (e) {
      console.error('Failed to load beta users', e)
    } finally {
      setBetaUsersLoading(false)
    }
  }

  const loadBetaSignups = async (filter = 'all') => {
    setBetaSignupsLoading(true)
    try {
      const supabaseClient = createClient()
      const { data: { session } } = await supabaseClient.auth.getSession()
      const token = session?.access_token
      const res = await fetch(`/api/admin/beta-signups?status=${filter}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await res.json()
      if (data.signups) setBetaSignups(data.signups)
    } catch (e) { console.error('Failed to load beta signups', e) }
    setBetaSignupsLoading(false)
  }
  const loadBetaActivity = async () => {
    setBetaActivityLoading(true)
    try {
      const res = await fetch('/api/admin/beta-activity', {
        headers: { Authorization: `Bearer ${authToken}` }
      })
      const data = await res.json()
      if (data.activity) setBetaActivity(data.activity)
    } catch (e) {
      console.error('Failed to load beta activity', e)
    } finally {
      setBetaActivityLoading(false)
    }
  }


  const updateSignupStatus = async (id: string, status: string) => {
    try {
      const supabaseClient = createClient()
      const { data: { session } } = await supabaseClient.auth.getSession()
      const token = session?.access_token
      await fetch('/api/admin/beta-signups', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ id, status })
      })
      setBetaSignups(prev => prev.map(s => s.id === id ? { ...s, status } : s))
    } catch (e) { console.error('Failed to update signup', e) }
  }

  const deleteSignup = async (id: string) => {
    if (!confirm('Delete this signup?')) return
    try {
      const supabaseClient = createClient()
      const { data: { session } } = await supabaseClient.auth.getSession()
      const token = session?.access_token
      await fetch('/api/admin/beta-signups', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ id })
      })
      setBetaSignups(prev => prev.filter(s => s.id !== id))
    } catch (e) { console.error('Failed to delete signup', e) }
  }

  const grantSignupAccess = async (email: string, signupId: string) => {
    try {
      const supabaseClient = createClient()
      const { data: { session } } = await supabaseClient.auth.getSession()
      const token = session?.access_token
      const res = await fetch('/api/admin/grant-access', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ email, tier: 'mystic', note: 'Beta signup via /beta page' })
      })
      const data = await res.json()
      if (data.success) {
        await updateSignupStatus(signupId, 'approved')
        alert('Access granted to ' + email)
      } else {
        alert(data.error || 'User must sign up at synchrosoul.app first')
      }
    } catch (e) { console.error('Failed to grant access', e) }
  }

  const toggleBetaUser = async (userId: string, currentTier: string) => {
    setTogglingId(userId)
    const action = currentTier === 'free' ? 'grant' : 'revoke'
    try {
      const res = await fetch('/api/admin/beta-users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${authToken}` },
        body: JSON.stringify({ userId, action, tier: 'twin-flame' })
      })
      const data = await res.json()
      if (data.success) {
        setBetaUsers(prev => prev.map(u =>
          u.id === userId ? { ...u, subscription_tier: action === 'revoke' ? 'free' : 'mystic' } : u
        ))
        if (action === 'revoke') {
          setSelectedBetaIds(prev => { const n = new Set(prev); n.delete(userId); return n })
        }
      }
    } catch (e) {
      console.error('Toggle failed', e)
    } finally {
      setTogglingId(null)
    }
  }

  const bulkRevoke = async () => {
    if (selectedBetaIds.size === 0) return
    setBulkRevoking(true)
    try {
      const res = await fetch('/api/admin/beta-users', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${authToken}` },
        body: JSON.stringify({ userIds: Array.from(selectedBetaIds) })
      })
      const data = await res.json()
      if (data.success) {
        setBetaUsers(prev => prev.map(u =>
          selectedBetaIds.has(u.id) ? { ...u, subscription_tier: 'free' } : u
        ))
        setSelectedBetaIds(new Set())
      }
    } catch (e) {
      console.error('Bulk revoke failed', e)
    } finally {
      setBulkRevoking(false)
    }
  }

  async function updateReportStatus(id: string, status: string) {
    setUpdatingReportId(id)
    try {
      await fetch('/api/admin/reports', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${authToken}` },
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
      const res = await fetch('/api/admin/healers', { headers: { Authorization: `Bearer ${authToken}` } })
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
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${authToken}` },
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

  // ── Admin guard render ───────────────────────────────────────────────────
  if (adminChecking) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <p style={{ color: '#a78bfa', fontSize: '1.2rem' }}>Verifying access...</p>
      </div>
    )
  }

  if (!isAdmin) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '1rem' }}>
        <p style={{ color: '#ef4444', fontSize: '1.5rem', fontWeight: 700 }}>Access Denied</p>
        <p style={{ color: '#a78bfa' }}>You do not have permission to view this page.</p>
      </div>
    )
  }

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
                {statCard('Paying', (stats.tierCounts?.mystic || 0) + (stats.tierCounts?.['twin-flame'] || 0), '👑', '#4ade80')}
              </div>

              <div style={card}>
                <h3 style={{ color: '#c9a84c', marginBottom: '1rem', fontSize: '1rem' }}>Subscription Breakdown</h3>
                {(['free', 'mystic', 'twin-flame'] as const).map(tier => {
                  const count = stats.tierCounts[tier]
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
                  {stats.recentSignups.slice(0, 8).map((u, i) => {
                    const tc = u.subscription_tier === 'twin-flame' ? '#f472b6' : u.subscription_tier === 'mystic' ? '#a78bfa' : 'rgba(255,255,255,0.2)'
                    const tl = u.subscription_tier === 'twin-flame' ? 'Twin Flame' : u.subscription_tier === 'mystic' ? 'Mystic' : 'Free'
                    return (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', padding: '0.4rem 0', borderBottom: '1px solid rgba(255,255,255,0.04)', fontSize: '0.75rem' }}>
                        <div style={{ flex: 1, minWidth: 0, overflow: 'hidden' }}>
                          <div style={{ color: 'rgba(255,255,255,0.85)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontWeight: 500 }}>
                            {u.display_name || '(no name)'}
                          </div>
                          <div style={{ color: 'rgba(180,160,255,0.55)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', fontSize: '0.65rem', marginTop: '0.1rem' }}>
                            {u.email}
                          </div>
                        </div>
                        <span style={{ color: tc, background: tc + '22', border: '1px solid ' + tc + '55', borderRadius: '999px', padding: '0.1rem 0.45rem', fontSize: '0.62rem', whiteSpace: 'nowrap', flexShrink: 0 }}>
                          {tl}
                        </span>
                        <span style={{ color: 'rgba(180,160,255,0.35)', whiteSpace: 'nowrap', flexShrink: 0 }}>{new Date(u.created_at).toLocaleDateString()}</span>
                      </div>
                    )
                  })}
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

          {/* Sub-tab buttons */}
          <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {(['activity', 'signups', 'grant', 'users'] as const).map(t => (
              <button key={t} onClick={() => setBetaSubTab(t)} style={{
                padding: '8px 18px', borderRadius: '50px', border: 'none', cursor: 'pointer',
                fontSize: '13px', fontWeight: 600,
                background: betaSubTab === t ? 'linear-gradient(135deg,#c9a84c,#a78bfa)' : 'rgba(255,255,255,0.06)',
                color: betaSubTab === t ? '#fff' : 'rgba(180,160,255,0.7)'
              }}>
                {t === 'activity' ? `📊 Tester Activity (${betaActivity.length})` : t === 'signups' ? `Beta Signups (${betaSignups.length})` : t === 'grant' ? 'Grant Access' : `Active Testers (${betaUsers.length})`}
              </button>
            ))}
          </div>

          {/* ACTIVITY TAB */}
          {betaSubTab === 'activity' && (
            <div style={{ ...card }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '8px' }}>
                <div>
                  <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#c9a84c', margin: 0 }}>📊 Tester Activity Monitor</h2>
                  <p style={{ color: 'rgba(180,160,255,0.5)', fontSize: '0.8rem', margin: '4px 0 0' }}>See what testers are doing in real-time</p>
                </div>
                <button onClick={loadBetaActivity} style={{ padding: '6px 14px', borderRadius: '8px', border: '1px solid rgba(167,139,250,0.3)', background: 'rgba(167,139,250,0.1)', color: '#a78bfa', fontSize: '0.8rem', cursor: 'pointer' }}>
                  🔄 Refresh
                </button>
              </div>

              {betaActivityLoading && <p style={{ color: 'rgba(180,160,255,0.5)', textAlign: 'center', padding: '2rem 0' }}>Loading activity...</p>}

              {!betaActivityLoading && betaActivity.length === 0 && (
                <p style={{ color: 'rgba(180,160,255,0.4)', textAlign: 'center', padding: '2rem 0' }}>No users found.</p>
              )}

              {!betaActivityLoading && betaActivity.length > 0 && (
                <div>
                  {/* Summary Stats */}
                  <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
                    <div style={{ background: 'rgba(167,139,250,0.08)', border: '1px solid rgba(167,139,250,0.2)', borderRadius: '12px', padding: '0.75rem 1rem', flex: '1', minWidth: '120px' }}>
                      <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#a78bfa' }}>{betaActivity.length}</div>
                      <div style={{ fontSize: '0.7rem', color: 'rgba(180,160,255,0.5)' }}>Total Users</div>
                    </div>
                    <div style={{ background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)', borderRadius: '12px', padding: '0.75rem 1rem', flex: '1', minWidth: '120px' }}>
                      <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#22c55e' }}>{betaActivity.filter(u => u.angel_logs > 0).length}</div>
                      <div style={{ fontSize: '0.7rem', color: 'rgba(180,160,255,0.5)' }}>Active (logged numbers)</div>
                    </div>
                    <div style={{ background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.2)', borderRadius: '12px', padding: '0.75rem 1rem', flex: '1', minWidth: '120px' }}>
                      <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#f87171' }}>{betaActivity.filter(u => u.angel_logs === 0).length}</div>
                      <div style={{ fontSize: '0.7rem', color: 'rgba(180,160,255,0.5)' }}>Inactive (no logs)</div>
                    </div>
                    <div style={{ background: 'rgba(201,168,76,0.08)', border: '1px solid rgba(201,168,76,0.2)', borderRadius: '12px', padding: '0.75rem 1rem', flex: '1', minWidth: '120px' }}>
                      <div style={{ fontSize: '1.5rem', fontWeight: 700, color: '#c9a84c' }}>{betaActivity.reduce((sum, u) => sum + u.angel_logs, 0)}</div>
                      <div style={{ fontSize: '0.7rem', color: 'rgba(180,160,255,0.5)' }}>Total Logs</div>
                    </div>
                  </div>

                  {/* User Activity List */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {betaActivity.map(user => {
                      const isExpanded = expandedUserId === user.id
                      const isActive = user.angel_logs > 0
                      return (
                        <div key={user.id} style={{
                          background: isActive ? 'rgba(34,197,94,0.04)' : 'rgba(248,113,113,0.04)',
                          border: `1px solid ${isActive ? 'rgba(34,197,94,0.15)' : 'rgba(248,113,113,0.15)'}`,
                          borderRadius: '12px', padding: '1rem', cursor: 'pointer'
                        }} onClick={() => setExpandedUserId(isExpanded ? null : user.id)}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                            <div style={{ width: '36px', height: '36px', borderRadius: '50%', overflow: 'hidden', flexShrink: 0, background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              {user.avatar_url ? <img src={user.avatar_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <span style={{ fontSize: '0.9rem' }}>✨</span>}
                            </div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                                <span style={{ color: '#e2d9f3', fontWeight: 600, fontSize: '0.9rem' }}>{user.display_name || '(no name)'}</span>
                                <span style={{ fontSize: '0.7rem', color: 'rgba(180,160,255,0.4)' }}>{user.email}</span>
                              </div>
                              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.25rem', flexWrap: 'wrap' }}>
                                <span style={{ fontSize: '0.75rem', color: isActive ? '#22c55e' : '#f87171' }}>🔢 {user.angel_logs} logs</span>
                                <span style={{ fontSize: '0.75rem', color: 'rgba(180,160,255,0.5)' }}>💬 {user.posts} posts</span>
                                <span style={{ fontSize: '0.75rem', color: 'rgba(180,160,255,0.5)' }}>🌙 {user.dreams} dreams</span>
                                <span style={{ fontSize: '0.75rem', color: 'rgba(180,160,255,0.4)' }}>
                                  {user.last_activity ? `Last: ${new Date(user.last_activity).toLocaleDateString()} ${new Date(user.last_activity).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}` : 'Never active'}
                                </span>
                              </div>
                            </div>
                            <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                              <span style={{ padding: '0.15rem 0.5rem', borderRadius: '999px', fontSize: '0.65rem', fontWeight: 600, background: isActive ? 'rgba(34,197,94,0.15)' : 'rgba(248,113,113,0.1)', color: isActive ? '#22c55e' : '#f87171' }}>
                                {isActive ? '● Active' : '○ Inactive'}
                              </span>
                              <span style={{ fontSize: '0.8rem', color: 'rgba(180,160,255,0.4)', transform: isExpanded ? 'rotate(180deg)' : 'none', transition: 'transform 0.2s' }}>▼</span>
                            </div>
                          </div>

                          {/* Expanded Details */}
                          {isExpanded && (
                            <div style={{ marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                              <div style={{ display: 'flex', gap: '1rem', marginBottom: '0.5rem', flexWrap: 'wrap', fontSize: '0.75rem', color: 'rgba(180,160,255,0.5)' }}>
                                <span>📅 Signed up: {new Date(user.signed_up).toLocaleDateString()}</span>
                                <span>💎 Tier: {user.subscription_tier}</span>
                                {user.last_number && <span>🔢 Last number: {user.last_number}</span>}
                              </div>
                              {user.last_thought && (
                                <div style={{ fontSize: '0.8rem', color: 'rgba(200,180,255,0.6)', fontStyle: 'italic', marginBottom: '0.5rem' }}>
                                  "{user.last_thought}"
                                </div>
                              )}
                              {user.recent_logs.length > 0 && (
                                <div>
                                  <div style={{ fontSize: '0.7rem', color: 'rgba(180,160,255,0.4)', marginBottom: '0.3rem', fontWeight: 600 }}>Recent Angel Logs:</div>
                                  {user.recent_logs.map((log, i) => (
                                    <div key={i} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', fontSize: '0.75rem', padding: '0.2rem 0', color: 'rgba(200,180,255,0.5)' }}>
                                      <span style={{ fontWeight: 700, color: '#a78bfa' }}>{log.number}</span>
                                      <span style={{ color: 'rgba(180,160,255,0.3)' }}>•</span>
                                      <span>{new Date(log.created_at).toLocaleDateString()} {new Date(log.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                                      {log.thought && <span style={{ color: 'rgba(180,160,255,0.4)', fontStyle: 'italic' }}>— {log.thought.slice(0, 50)}{log.thought.length > 50 ? '...' : ''}</span>}
                                    </div>
                                  ))}
                                </div>
                              )}
                              {user.recent_logs.length === 0 && (
                                <p style={{ fontSize: '0.75rem', color: 'rgba(180,160,255,0.3)', fontStyle: 'italic' }}>No activity yet — this tester hasn&apos;t logged any angel numbers.</p>
                              )}
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
          )}


          {/* SIGNUPS TAB */}
          {betaSubTab === 'signups' && (
            <div style={{ ...card }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '8px' }}>
                <div>
                  <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#c9a84c', margin: 0 }}>Beta Signup Requests</h2>
                  <p style={{ color: 'rgba(180,160,255,0.5)', fontSize: '0.8rem', margin: '4px 0 0' }}>People who signed up at synchrosoul.app/beta</p>
                </div>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <select value={betaSignupsFilter} onChange={e => { setBetaSignupsFilter(e.target.value); loadBetaSignups(e.target.value) }}
                    style={{ background: '#1a0a3e', border: '1px solid rgba(167,139,250,0.3)', borderRadius: '8px', padding: '6px 10px', color: '#e2d9f3', fontSize: '12px' }}>
                    <option value="all">All</option>
                    <option value="pending">Pending</option>
                    <option value="approved">Approved</option>
                    <option value="rejected">Rejected</option>
                  </select>
                  <button onClick={() => loadBetaSignups(betaSignupsFilter)} disabled={betaSignupsLoading}
                    style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(167,139,250,0.2)', borderRadius: '8px', padding: '6px 12px', color: '#c4b5fd', fontSize: '12px', cursor: 'pointer' }}>
                    {betaSignupsLoading ? '...' : 'Refresh'}
                  </button>
                </div>
              </div>

              {betaSignupsLoading && betaSignups.length === 0 ? (
                <div style={{ textAlign: 'center', color: 'rgba(180,160,255,0.4)', padding: '2rem' }}>Loading signups...</div>
              ) : betaSignups.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '2.5rem' }}>
                  <div style={{ fontSize: '40px', marginBottom: '12px' }}>📭</div>
                  <div style={{ color: 'rgba(180,160,255,0.5)', fontSize: '0.9rem', marginBottom: '12px' }}>No signups yet.</div>
                  <div style={{ color: 'rgba(180,160,255,0.4)', fontSize: '0.8rem', marginBottom: '16px' }}>Share this link to start collecting beta testers:</div>
                  <code style={{ background: 'rgba(255,255,255,0.06)', padding: '8px 16px', borderRadius: '8px', color: '#c4b5fd', fontSize: '14px' }}>synchrosoul.app/beta</code>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {betaSignups.map(signup => (
                    <div key={signup.id} style={{
                      background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(167,139,250,0.15)',
                      borderRadius: '12px', padding: '14px 16px'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px' }}>
                        <div style={{ flex: 1, minWidth: '200px' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', flexWrap: 'wrap' }}>
                            <span style={{ color: '#e2d9f3', fontWeight: 600, fontSize: '14px' }}>{signup.name || '(no name)'}</span>
                            <span style={{ color: '#9ca3af', fontSize: '13px' }}>{signup.email}</span>
                            <span style={{
                              padding: '2px 8px', borderRadius: '50px', fontSize: '11px', fontWeight: 600,
                              background: signup.status === 'approved' ? 'rgba(74,222,128,0.15)' : signup.status === 'rejected' ? 'rgba(248,113,113,0.15)' : 'rgba(251,191,36,0.15)',
                              color: signup.status === 'approved' ? '#4ade80' : signup.status === 'rejected' ? '#f87171' : '#fbbf24'
                            }}>{signup.status}</span>
                            <span style={{ color: '#6b7280', fontSize: '11px', background: 'rgba(255,255,255,0.05)', padding: '2px 6px', borderRadius: '4px' }}>{signup.device}</span>
                          </div>
                          {signup.reason && (
                            <div style={{ color: '#9ca3af', fontSize: '12px', fontStyle: 'italic', marginBottom: '4px' }}>&ldquo;{signup.reason}&rdquo;</div>
                          )}
                          <div style={{ color: '#6b7280', fontSize: '11px' }}>{new Date(signup.created_at).toLocaleDateString()} at {new Date(signup.created_at).toLocaleTimeString()}</div>
                        </div>
                        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', flexShrink: 0 }}>
                          {signup.status === 'pending' && (
                            <button onClick={() => grantSignupAccess(signup.email, signup.id)} style={{
                              background: 'linear-gradient(135deg,#c9a84c,#a78bfa)', color: '#fff', border: 'none',
                              borderRadius: '8px', padding: '6px 12px', fontSize: '12px', cursor: 'pointer', fontWeight: 600
                            }}>Grant Access</button>
                          )}
                          {signup.status === 'pending' && (
                            <button onClick={() => updateSignupStatus(signup.id, 'rejected')} style={{
                              background: 'rgba(248,113,113,0.1)', color: '#f87171', border: '1px solid rgba(248,113,113,0.3)',
                              borderRadius: '8px', padding: '6px 12px', fontSize: '12px', cursor: 'pointer'
                            }}>Reject</button>
                          )}
                          {signup.status !== 'pending' && (
                            <button onClick={() => updateSignupStatus(signup.id, 'pending')} style={{
                              background: 'rgba(251,191,36,0.1)', color: '#fbbf24', border: '1px solid rgba(251,191,36,0.3)',
                              borderRadius: '8px', padding: '6px 10px', fontSize: '12px', cursor: 'pointer'
                            }}>Reset</button>
                          )}
                          <button onClick={() => deleteSignup(signup.id)} style={{
                            background: 'rgba(255,255,255,0.04)', color: '#6b7280', border: '1px solid rgba(255,255,255,0.08)',
                            borderRadius: '8px', padding: '6px 10px', fontSize: '12px', cursor: 'pointer'
                          }}>Delete</button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* GRANT ACCESS TAB */}
          {betaSubTab === 'grant' && (
          <div style={{ ...card }}>
            <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#c9a84c', marginBottom: '0.25rem' }}>Grant Beta Access</h2>
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
                  onChange={e => setBetaTier(e.target.value)}
                  style={{
                    width: '100%', padding: '0.75rem 1rem', borderRadius: '0.75rem',
                    background: 'rgba(30,20,60,0.95)', border: '1px solid rgba(255,255,255,0.1)',
                    color: '#fff', fontSize: '0.95rem'
                  }}
                >
                  <option value="mystic">Mystic ($6.99/mo value)</option>
                  <option value="twin-flame">Twin Flame ($9.99/mo value)</option>
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
                    const { data: { session } } = await createClient().auth.refreshSession()
                    const token = session?.access_token
                    const res = await fetch('/api/admin/grant-access', {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                      body: JSON.stringify({ email: betaEmail.trim(), tier: betaTier, note: betaNote })
                    })
                    const data = await res.json()
                    setBetaResult(data)
                    if (data.success) {
                      setBetaGranted(prev => [{ email: betaEmail.trim(), tier: betaTier, time: new Date().toLocaleTimeString() }, ...prev])
                      loadBetaUsers()
                      setBetaEmail('')
                      setBetaNote('')
                      loadBetaUsers()
                    }
                  } catch (e: unknown) {
                    setBetaResult({ error: e instanceof Error ? e.message : 'Unknown error' })
                  } finally {
                    setBetaLoading(false)
                  }
                }}
                disabled={betaLoading || !betaEmail.trim()}
                style={{
                  padding: '0.85rem 1.5rem', borderRadius: '0.75rem', border: 'none', fontWeight: 700, fontSize: '1rem',
                  cursor: betaLoading ? 'not-allowed' : 'pointer',
                  background: betaLoading ? 'rgba(201,168,76,0.3)' : 'linear-gradient(135deg, #c9a84c, #a78bfa)',
                  color: '#fff'
                }}
              >
                {betaLoading ? 'Granting...' : 'Grant Access'}
              </button>
              {betaResult && (
                <div style={{
                  padding: '0.75rem 1rem', borderRadius: '0.75rem',
                  background: betaResult.success ? 'rgba(74,222,128,0.1)' : 'rgba(248,113,113,0.1)',
                  border: `1px solid ${betaResult.success ? 'rgba(74,222,128,0.3)' : 'rgba(248,113,113,0.3)'}`,
                  color: betaResult.success ? '#4ade80' : '#f87171', fontSize: '0.9rem'
                }}>
                  {betaResult.success ? 'Access granted!' : betaResult.error}
                </div>
              )}
            </div>
          </div>
          )}

          {/* ACTIVE TESTERS TAB */}
          {betaSubTab === 'users' && (
          <div style={{ ...card }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <div>
                    <h3 style={{ fontSize: '1rem', fontWeight: 700, color: '#c9a84c', margin: 0 }}>Admin-Granted Beta Testers</h3>
                    <p style={{ color: 'rgba(180,160,255,0.4)', fontSize: '0.75rem', margin: '4px 0 0' }}>
                      {betaUsers.length} tester{betaUsers.length !== 1 ? 's' : '' } manually granted (excludes paid subscribers)
                    </p>
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <button
                      onClick={() => {
                        if (selectedBetaIds.size === betaUsers.length && betaUsers.length > 0) {
                          setSelectedBetaIds(new Set())
                        } else {
                          setSelectedBetaIds(new Set(betaUsers.map(u => u.id)))
                        }
                      }}
                      style={{ padding: '0.35rem 0.75rem', borderRadius: '0.5rem', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: 'rgba(180,160,255,0.7)', fontSize: '0.78rem', cursor: 'pointer' }}
                    >
                      {selectedBetaIds.size === betaUsers.length && betaUsers.length > 0 ? 'Deselect All' : 'Select All'}
                    </button>
                    {selectedBetaIds.size > 0 && (
                      <button
                        onClick={async () => {
                          if (!confirm(`Revoke beta access for ${selectedBetaIds.size} user(s)?`)) return
                          const { data: { session } } = await createClient().auth.refreshSession()
                          const token = session?.access_token
                          const res = await fetch('/api/admin/beta-users', {
                            method: 'DELETE',
                            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                            body: JSON.stringify({ userIds: Array.from(selectedBetaIds) })
                          })
                          if (res.ok) {
                            setBetaUsers(prev => prev.map(u =>
                              selectedBetaIds.has(u.id) ? { ...u, subscription_tier: 'free' } : u
                            ))
                            setSelectedBetaIds(new Set())
                          }
                        }}
                        style={{ padding: '0.35rem 0.75rem', borderRadius: '0.5rem', border: '1px solid rgba(248,113,113,0.3)', background: 'rgba(248,113,113,0.1)', color: '#f87171', fontSize: '0.78rem', cursor: 'pointer' }}
                      >
                        Revoke {selectedBetaIds.size} Selected
                      </button>
                    )}
                    <button
                      onClick={loadBetaUsers}
                      disabled={betaUsersLoading}
                      style={{ padding: '0.35rem 0.75rem', borderRadius: '0.5rem', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.05)', color: 'rgba(180,160,255,0.7)', fontSize: '0.78rem', cursor: 'pointer' }}
                    >
                      {betaUsersLoading ? '...' : 'Refresh'}
                    </button>
                  </div>
                </div>
            {betaUsersLoading && betaUsers.length === 0 ? (
              <div style={{ textAlign: 'center', color: 'rgba(180,160,255,0.4)', padding: '2rem', fontSize: '0.9rem' }}>Loading beta users...</div>
            ) : betaUsers.length === 0 ? (
              <div style={{ textAlign: 'center', color: 'rgba(180,160,255,0.3)', padding: '2rem', fontSize: '0.9rem' }}>No beta users yet. Grant access in the Grant Access tab.</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {betaUsers.map(user => {
                  const isSelected = selectedBetaIds.has(user.id)
                  const isActive = user.subscription_tier !== 'free'
                  return (
                    <div key={user.id} style={{
                      display: 'flex', alignItems: 'center', gap: '0.75rem',
                      background: isSelected ? 'rgba(201,168,76,0.08)' : 'rgba(255,255,255,0.03)',
                      border: `1px solid ${isSelected ? 'rgba(201,168,76,0.3)' : 'rgba(255,255,255,0.07)'}`,
                      borderRadius: '0.75rem', padding: '0.75rem 1rem', flexWrap: 'wrap'
                    }}>
                      <input type="checkbox" checked={isSelected}
                        onChange={() => setSelectedBetaIds(prev => {
                          const n = new Set(prev)
                          if (n.has(user.id)) n.delete(user.id); else n.add(user.id)
                          return n
                        })}
                        style={{ width: '16px', height: '16px', cursor: 'pointer', flexShrink: 0 }}
                      />
                      <div style={{ flex: 1, minWidth: '150px' }}>
                        <div style={{ color: '#e2d9f3', fontWeight: 600, fontSize: '0.9rem' }}>{user.display_name || '(no name)'}</div>
                        <div style={{ color: 'rgba(180,160,255,0.5)', fontSize: '0.75rem' }}>{user.email}</div>
                        {user.beta_note && (
                          <div style={{ color: 'rgba(180,160,255,0.4)', fontSize: '0.7rem', marginTop: '2px' }}>Note: {user.beta_note}</div>
                        )}
                        <div style={{ color: 'rgba(180,160,255,0.3)', fontSize: '0.7rem' }}>
                          Granted: {user.beta_granted_at ? new Date(user.beta_granted_at).toLocaleDateString() : new Date(user.created_at).toLocaleDateString()}
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
                        <span style={{
                          padding: '0.15rem 0.5rem', borderRadius: '999px', fontSize: '0.7rem', fontWeight: 700,
                          background: user.subscription_tier === 'twin-flame' ? 'rgba(239,68,68,0.15)' : 'rgba(167,139,250,0.15)',
                          color: user.subscription_tier === 'twin-flame' ? '#f87171' : '#a78bfa'
                        }}>{user.subscription_tier}</span>
                        <button
                          onClick={() => toggleBetaUser(user.id, user.subscription_tier)}
                          style={{
                            position: 'relative', width: '44px', height: '24px', borderRadius: '12px', border: 'none', cursor: 'pointer',
                            background: isActive ? 'linear-gradient(135deg,#c9a84c,#a78bfa)' : 'rgba(255,255,255,0.1)',
                            transition: 'background 0.3s', flexShrink: 0
                          }}
                        >
                          <div style={{
                            position: 'absolute', top: '3px', left: isActive ? '23px' : '3px',
                            width: '18px', height: '18px', borderRadius: '50%',
                            background: '#fff', transition: 'left 0.3s',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.3)'
                          }} />
                        </button>
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </div>
          )}

        </div>
      )}

    </div>
  )
}
