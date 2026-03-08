'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import AngelLogger from '@/components/AngelLogger'
import JournalEntry from '@/components/JournalEntry'
import StarField from '@/components/StarField'
import { getLogs, getStats, AngelLog } from '@/lib/storage'

export default function DashboardPage() {
  const [logs, setLogs] = useState<AngelLog[]>([])
  const [stats, setStats] = useState({ total: 0, topNumber: null as string | null, topCount: 0, withProof: 0, streak: 0 })
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    setLogs(getLogs())
    setStats(getStats())
  }, [])

  function handleLogged(log: AngelLog) {
    setLogs(getLogs())
    setStats(getStats())
  }

  function handleDelete(id: string) {
    setLogs(getLogs())
    setStats(getStats())
  }

  function handleToggleShare(id: string) {
    setLogs(getLogs())
  }

  const recentLogs = logs.slice(0, 3)

  return (
    <div className="min-h-screen relative">
      <StarField />

      <div className="relative" style={{ zIndex: 2 }}>
        {/* Top nav */}
        <nav className="flex items-center justify-between px-6 py-5" style={{ borderBottom: '1px solid rgba(200,180,255,0.08)' }}>
          <Link href="/" className="flex items-center gap-2">
            <span style={{ color: 'rgba(201,168,76,0.8)', fontSize: '1.1rem' }}>✦</span>
            <span className="serif text-lg" style={{ color: 'rgba(220,200,255,0.8)' }}>SynchroSoul</span>
          </Link>
          <div className="flex items-center gap-3">
            <Link href="/dashboard/journal"
              className="text-xs uppercase tracking-widest px-4 py-2 rounded-full transition-all"
              style={{ color: 'rgba(200,180,255,0.5)', border: '1px solid rgba(200,180,255,0.15)' }}
            >
              Journal
            </Link>
            <Link href="/auth/signout"
              className="text-xs uppercase tracking-widest"
              style={{ color: 'rgba(200,180,255,0.3)' }}
            >
              Sign Out
            </Link>
          </div>
        </nav>

        <div className="max-w-2xl mx-auto px-6 py-10">

          {/* Welcome */}
          <div className="mb-10 text-center">
            <h1 className="serif text-4xl mb-2" style={{ color: 'rgba(220,200,255,0.9)', fontWeight: 300 }}>Your Cosmic Log</h1>
            <p className="text-sm" style={{ color: 'rgba(200,180,255,0.35)', letterSpacing: '0.1em' }}>The universe is always speaking</p>
          </div>

          {/* Stats row */}
          {mounted && stats.total > 0 && (
            <div className="grid grid-cols-3 gap-3 mb-10">
              {[
                { label: 'Total Logs', value: stats.total, icon: '◈' },
                { label: 'Day Streak', value: stats.streak, icon: '◉' },
                { label: 'Angel Approved', value: stats.withProof, icon: '✓' },
              ].map(s => (
                <div key={s.label} className="glass-card p-4 text-center">
                  <div className="text-lg mb-1" style={{ color: 'rgba(201,168,76,0.7)' }}>{s.icon}</div>
                  <div className="serif text-2xl mb-1" style={{ color: 'rgba(220,200,255,0.9)' }}>{s.value}</div>
                  <div className="text-xs uppercase tracking-widest" style={{ color: 'rgba(200,180,255,0.35)' }}>{s.label}</div>
                </div>
              ))}
            </div>
          )}

          {/* Top number banner */}
          {mounted && stats.topNumber && (
            <div className="mb-8 p-4 rounded-2xl text-center" style={{
              background: 'rgba(201,168,76,0.06)',
              border: '1px solid rgba(201,168,76,0.2)',
            }}>
              <p className="text-xs uppercase tracking-widest mb-1" style={{ color: 'rgba(201,168,76,0.5)' }}>Your Most Seen Number</p>
              <p className="serif text-3xl" style={{ color: 'rgba(201,168,76,0.9)' }}>{stats.topNumber}</p>
              <p className="text-xs mt-1" style={{ color: 'rgba(200,180,255,0.3)' }}>seen {stats.topCount} time{stats.topCount !== 1 ? 's' : ''}</p>
            </div>
          )}

          {/* Logger */}
          <div className="mb-10">
            <AngelLogger onLogged={handleLogged} />
          </div>

          {/* Recent logs */}
          {mounted && recentLogs.length > 0 && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="serif text-xl" style={{ color: 'rgba(220,200,255,0.7)' }}>Recent Sightings</h2>
                <Link href="/dashboard/journal"
                  className="text-xs uppercase tracking-widest"
                  style={{ color: 'rgba(200,180,255,0.4)' }}
                >
                  View All →
                </Link>
              </div>
              <div className="flex flex-col gap-3">
                {recentLogs.map(log => (
                  <JournalEntry
                    key={log.id}
                    log={log}
                    onDelete={handleDelete}
                    onToggleShare={handleToggleShare}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Empty state */}
          {mounted && logs.length === 0 && (
            <div className="text-center py-16">
              <div className="text-4xl mb-4" style={{ color: 'rgba(200,180,255,0.2)' }}>✦</div>
              <p className="serif text-xl mb-2" style={{ color: 'rgba(200,180,255,0.4)' }}>No logs yet</p>
              <p className="text-sm" style={{ color: 'rgba(200,180,255,0.25)' }}>The universe is waiting for you to start noticing</p>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}
