'use client'
import { useState } from 'react'

export default function JournalExport({ logs }: { logs: any[] }) {
  const [format, setFormat] = useState<'txt'|'csv'|'json'>('txt')
  const [exported, setExported] = useState(false)

  function doExport() {
    let content = ''
    const filename = 'synchrosoul-journal-' + new Date().toISOString().slice(0,10)

    if (format === 'json') {
      content = JSON.stringify(logs, null, 2)
    } else if (format === 'csv') {
      const headers = 'Date,Time,Number,Thought,Has Screenshot,Truth Score'
      const rows = logs.map(l => {
        const d = new Date(l.timestamp)
        return [
          d.toLocaleDateString(),
          d.toLocaleTimeString(),
          l.number,
          '"' + (l.thought || '').replace(/"/g, "''") + '"',
          l.hasScreenshot ? 'Yes' : 'No',
          l.truthScore || 0
        ].join(',')
      })
      content = [headers, ...rows].join('\n')
    } else {
      content = '=== SynchroSoul Angel Number Journal ===\n'
      content += 'Exported: ' + new Date().toLocaleString() + '\n'
      content += 'Total Entries: ' + logs.length + '\n\n'
      logs.forEach(l => {
        const d = new Date(l.timestamp)
        content += '---\n'
        content += 'Date: ' + d.toLocaleString() + '\n'
        content += 'Number: ' + l.number + '\n'
        if (l.thought) content += 'Thought: ' + l.thought + '\n'
        if (l.hasScreenshot) content += 'Screenshot: Yes (Angel Approved ✓)\n'
        content += '\n'
      })
    }

    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename + '.' + format
    a.click()
    URL.revokeObjectURL(url)
    setExported(true)
    setTimeout(() => setExported(false), 2000)
  }

  if (logs.length === 0) return null

  return (
    <div style={{ background: 'rgba(8,6,28,0.88)', border: '1px solid rgba(200,180,255,0.12)', borderRadius: '1.25rem', backdropFilter: 'blur(12px)', padding: '1.1rem 1.25rem', marginBottom: '1.25rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem', flexWrap: 'wrap' }}>
        <span style={{ fontSize: '1rem' }}>📤</span>
        <div style={{ flex: 1 }}>
          <div style={{ color: 'rgba(220,200,255,0.85)', fontSize: '0.85rem', fontWeight: 600 }}>Export Journal</div>
          <div style={{ color: 'rgba(180,160,255,0.4)', fontSize: '0.72rem' }}>{logs.length} entries</div>
        </div>
        <div style={{ display: 'flex', gap: '0.35rem' }}>
          {(['txt','csv','json'] as const).map(f => (
            <button key={f} onClick={() => setFormat(f)} style={{ padding: '0.25rem 0.6rem', borderRadius: '0.4rem', border: format===f ? '1px solid rgba(167,139,250,0.5)' : '1px solid rgba(200,180,255,0.1)', background: format===f ? 'rgba(167,139,250,0.2)' : 'transparent', color: format===f ? '#a78bfa' : 'rgba(180,160,255,0.4)', fontSize: '0.72rem', cursor: 'pointer', textTransform: 'uppercase' }}>{f}</button>
          ))}
        </div>
        <button onClick={doExport} style={{ padding: '0.4rem 0.875rem', borderRadius: '2rem', background: exported ? 'rgba(52,211,153,0.2)' : 'rgba(167,139,250,0.2)', border: exported ? '1px solid rgba(52,211,153,0.4)' : '1px solid rgba(167,139,250,0.3)', color: exported ? '#34d399' : '#a78bfa', fontSize: '0.78rem', cursor: 'pointer', fontWeight: 600, whiteSpace: 'nowrap' }}>
          {exported ? '✓ Done!' : 'Download'}
        </button>
      </div>
    </div>
  )
}
