'use client'

import { useState, useEffect, useMemo } from 'react'
import Link from 'next/link'
import StarField from '@/components/StarField'
import JournalEntry from '@/components/JournalEntry'
import { getLogs, searchLogs, getStats, AngelLog } from '@/lib/storage'

export default function JournalPage() {
  const [logs, setLogs] = useState<AngelLog[]>([])
  const [query, setQuery] = useState('')
  const [filterNumber, setFilterNumber] = useState('')
  const [mounted, setMounted] = useState(false)
  const [stats, setStats] = useState({ total: 0, topNumber: null as string | null, topCount: 0, withProof: 0, streak: 0 })

  useEffect(() => {
    setMounted(true)
    setLogs(getLogs())
    setStats(getStats())
  }, [])

  const filtered = useMemo(() => {
    let result = query ? searchLogs(query) : logs
    if (filterNumber) result = result.filter(l => l.number === filterNumber)
    return result
  }, [logs, query, filterNumber])

  // Get unique numbers for filter chips
  const uniqueNumbers = useMemo(() => {
    const counts: Record<string, number> = {}
    logs.forEach(l => { counts[l.number] = (counts[l.number] || 0) + 1 })
    return Object.entries(counts).sort((a, b) => b[1] - a[1]).slice(0, 8)
  }, [logs])

  function handleDelete(id: string) {
    setLogs(getLogs())
    setStats(getStats())
  }

  function handleToggleShare(id: string) {
    setLogs(getLogs())
  }

  // Group logs by date
  const grouped = useMemo(() => {
    const groups: Record<string, AngelLog[]> = {}
    filtered.forEach(log => {
      const date = new Date(log.createdAt)
      const today = new Date()
      const yesterday = new Date(today)
      yesterday.setDate(yesterday.getDate() - 1)
      let label: string
      if (date.toDateString() === today.toDateString()) label = 'Today'
      else if (date.toDateString() === yesterday.toDateString()) label = 'Yesterday'
      else label = date.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
      if (!groups[label]) groups[label] = []
      groups[label].push(log)
    })
    return groups
  }, [filtered])

  return (
    <div className="min-h-screen relative">
      <StarField />

      <div className="relative" style={{ zIndex: 2 }}>
        {/* Nav */}
        <nav className="flex items-center justify-between px-6 py-5" style={{ borderBottom: '1px solid rgba(200,180,255,0.08)' }}>
          <Link href="/dashboard" className="flex items-center gap-2">
            <span style={{ color: 'rgba(200,180,255,0.4)', fontSize: '1.1rem' }}>←</span>
            <span className="serif text-lg" style={{ color: 'rgba(220,200,255,0.8)' }}>SynchroSoul</span>
          </Link>
          <span className="text-xs uppercase tracking-widest" style={{ color: 'rgba(200,180,255,0.4)' }}>Thought Anchor Journal</span>
        </nav>

        <div className="max-w-2xl mx-auto px-6 py-10">

          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="serif text-4xl mb-2" style={{ color: 'rgba(220,200,255,0.9)', fontWeight: 300 }}>Your Journal</h1>
            <p className="text-sm" style={{ color: 'rgba(200,180,255,0.35)', letterSpacing: '0.1em' }}>
              {mounted ? `${stats.total} cosmic sighting${stats.total !== 1 ? 's' : ''} recorded` : 'Loading...'}
            </p>
          </div>

          {/* Stats strip */}
          {mounted && stats.total > 0 && (
            <div className="flex gap-4 justify-center mb-8 flex-wrap">
              {[
                { label: 'Total', value: stats.total },
                { label: 'Streak', value: `${stats.streak}d` },
                { label: 'Verified', value: stats.withProof },
                ...(stats.topNumber ? [{ label: 'Top Number', value: stats.topNumber }] : []),
              ].map(s => (
                <div key={s.label} className="text-center px-4 py-2 rounded-full"
                  style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(200,180,255,0.1)' }}>
                  <span className="text-sm font-bold" style={{ color: 'rgba(220,200,255,0.8)' }}>{s.value}</span>
                  <span className="text-xs ml-2" style={{ color: 'rgba(200,180,255,0.35)' }}>{s.label}</span>
                </div>
              ))}
            </div>
          )}

          {/* Search */}
          <div className="mb-4">
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm" style={{ color: 'rgba(200,180,255,0.3)' }}>✦</span>
              <input
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                placeholder="Search by number, thought, or keyword..."
                className="w-full rounded-2xl pl-10 pr-4 py-3 text-sm outline-none transition-all"
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(200,180,255,0.15)',
                  color: 'rgba(255,255,255,0.8)',
                }}
                onFocus={e => e.target.style.borderColor = 'rgba(200,180,255,0.35)'}
                onBlur={e => e.target.style.borderColor = 'rgba(200,180,255,0.15)'}
              />
              {query && (
                <button onClick={() => setQuery('')}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-sm"
                  style={{ color: 'rgba(200,180,255,0.4)' }}>×</button>
              )}
            </div>
          </div>

          {/* Number filter chips */}
          {mounted && uniqueNumbers.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-8">
              <button
                onClick={() => setFilterNumber('')}
                className="px-3 py-1 rounded-full text-xs font-medium transition-all"
                style={{
                  background: !filterNumber ? 'rgba(200,150,255,0.2)' : 'rgba(255,255,255,0.04)',
                  border: `1px solid ${!filterNumber ? 'rgba(200,150,255,0.5)' : 'rgba(200,180,255,0.12)'}`,
                  color: !filterNumber ? 'rgba(220,180,255,0.9)' : 'rgba(200,180,255,0.4)',
                }}
              >
                All
              </button>
              {uniqueNumbers.map(([num, count]) => (
                <button
                  key={num}
                  onClick={() => setFilterNumber(filterNumber === num ? '' : num)}
                  className="px-3 py-1 rounded-full text-xs font-medium transition-all"
                  style={{
                    background: filterNumber === num ? 'rgba(200,150,255,0.2)' : 'rgba(255,255,255,0.04)',
                    border: `1px solid ${filterNumber === num ? 'rgba(200,150,255,0.5)' : 'rgba(200,180,255,0.12)'}`,
                    color: filterNumber === num ? 'rgba(220,180,255,0.9)' : 'rgba(200,180,255,0.4)',
                  }}
                >
                  {num} <span style={{ opacity: 0.5 }}>×{count}</span>
                </button>
              ))}
            </div>
          )}

          {/* Timeline */}
          {mounted && Object.keys(grouped).length > 0 ? (
            <div className="space-y-8">
              {Object.entries(grouped).map(([date, dateLogs]) => (
                <div key={date}>
                  {/* Date header */}
                  <div className="flex items-center gap-3 mb-4">
                    <div className="h-px flex-1" style={{ background: 'rgba(200,180,255,0.1)' }} />
                    <span className="text-xs uppercase tracking-widest px-3" style={{ color: 'rgba(200,180,255,0.35)' }}>{date}</span>
                    <div className="h-px flex-1" style={{ background: 'rgba(200,180,255,0.1)' }} />
                  </div>
                  {/* Entries */}
                  <div className="space-y-3">
                    {dateLogs.map(log => (
                      <JournalEntry
                        key={log.id}
                        log={log}
                        onDelete={handleDelete}
                        onToggleShare={handleToggleShare}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : mounted ? (
            <div className="text-center py-20">
              <div className="text-5xl mb-6" style={{ color: 'rgba(200,180,255,0.15)' }}>✦</div>
              {query || filterNumber ? (
                <>
                  <p className="serif text-xl mb-2" style={{ color: 'rgba(200,180,255,0.4)' }}>No results found</p>
                  <p className="text-sm mb-6" style={{ color: 'rgba(200,180,255,0.25)' }}>Try a different search or clear the filter</p>
                  <button onClick={() => { setQuery(''); setFilterNumber('') }}
                    className="btn-ghost" style={{ fontSize: '0.85rem', padding: '0.6rem 1.5rem' }}>
                    Clear Search
                  </button>
                </>
              ) : (
                <>
                  <p className="serif text-xl mb-2" style={{ color: 'rgba(200,180,255,0.4)' }}>Your journal is empty</p>
                  <p className="text-sm mb-6" style={{ color: 'rgba(200,180,255,0.25)' }}>Start logging the numbers you see and they will appear here</p>
                  <Link href="/dashboard" className="btn-primary" style={{ fontSize: '0.85rem', padding: '0.6rem 1.5rem' }}>
                    Log Your First Number
                  </Link>
                </>
              )}
            </div>
          ) : null}

        </div>
      </div>
    </div>
  )
}
