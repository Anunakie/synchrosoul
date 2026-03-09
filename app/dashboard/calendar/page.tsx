'use client';
import { useState, useEffect } from 'react';

interface AngelLog {
  id: string;
  number: string;
  thought?: string;
  createdAt: string;
}

const ANGEL_COLORS: Record<string, string> = {
  '111': '#f59e0b', '1111': '#f59e0b', '222': '#22c55e', '2222': '#22c55e',
  '333': '#f97316', '3333': '#f97316', '444': '#22c55e', '4444': '#22c55e',
  '555': '#8b5cf6', '5555': '#8b5cf6', '666': '#ef4444', '777': '#c9a84c',
  '7777': '#c9a84c', '888': '#c9a84c', '8888': '#c9a84c', '999': '#6366f1',
  '9999': '#6366f1', '1212': '#60a5fa', '1234': '#10b981',
};

const getColor = (num: string) => ANGEL_COLORS[num] || '#a78bfa';

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const DAYS = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

export default function CalendarPage() {
  const [logs, setLogs] = useState<AngelLog[]>([]);
  const [today] = useState(new Date());
  const [viewDate, setViewDate] = useState(new Date());
  const [selectedDay, setSelectedDay] = useState<number | null>(null);

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('angel_logs') || '[]');
      setLogs(saved);
    } catch {}
  }, []);

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const logsForDay = (day: number) => {
    return logs.filter(l => {
      const d = new Date(l.createdAt);
      return d.getFullYear() === year && d.getMonth() === month && d.getDate() === day;
    });
  };

  const prevMonth = () => setViewDate(new Date(year, month - 1, 1));
  const nextMonth = () => setViewDate(new Date(year, month + 1, 1));

  const selectedLogs = selectedDay ? logsForDay(selectedDay) : [];

  // Numerology day number
  const dayNum = (day: number) => {
    const d = new Date(year, month, day);
    const str = `${d.getMonth()+1}${d.getDate()}${d.getFullYear()}`;
    let sum = str.split('').reduce((a, c) => a + parseInt(c), 0);
    while (sum > 9 && sum !== 11 && sum !== 22 && sum !== 33) {
      sum = sum.toString().split('').reduce((a, c) => a + parseInt(c), 0);
    }
    return sum;
  };

  const numColors: Record<number, string> = {
    1: '#f59e0b', 2: '#22c55e', 3: '#f97316', 4: '#22c55e',
    5: '#8b5cf6', 6: '#ec4899', 7: '#c9a84c', 8: '#c9a84c',
    9: '#6366f1', 11: '#60a5fa', 22: '#10b981', 33: '#a78bfa'
  };

  return (
    <div style={{ minHeight: '100vh', padding: '2rem 1rem', maxWidth: '700px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 700, color: '#c9a84c', fontFamily: 'Cormorant Garamond, serif' }}>Angel Calendar</h1>
        <p style={{ color: 'rgba(255,255,255,0.4)', marginTop: '0.25rem' }}>Your angel number sightings mapped in time</p>
      </div>

      {/* Month navigation */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', background: 'rgba(8,6,28,0.88)', borderRadius: '1.25rem', border: '1px solid rgba(255,255,255,0.08)', padding: '0.875rem 1.25rem', backdropFilter: 'blur(12px)' }}>
        <button onClick={prevMonth} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '50%', width: '2rem', height: '2rem', cursor: 'pointer', color: 'rgba(255,255,255,0.6)', fontSize: '1rem' }}>‹</button>
        <div style={{ textAlign: 'center' }}>
          <p style={{ color: '#fff', fontWeight: 700, fontSize: '1.1rem', fontFamily: 'Cormorant Garamond, serif' }}>{MONTHS[month]} {year}</p>
          <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.72rem' }}>{logs.filter(l => { const d = new Date(l.createdAt); return d.getFullYear() === year && d.getMonth() === month; }).length} sightings this month</p>
        </div>
        <button onClick={nextMonth} style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '50%', width: '2rem', height: '2rem', cursor: 'pointer', color: 'rgba(255,255,255,0.6)', fontSize: '1rem' }}>›</button>
      </div>

      {/* Day headers */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0.25rem', marginBottom: '0.25rem' }}>
        {DAYS.map(d => (
          <div key={d} style={{ textAlign: 'center', color: 'rgba(255,255,255,0.25)', fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.08em', padding: '0.25rem 0' }}>{d}</div>
        ))}
      </div>

      {/* Calendar grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '0.25rem', marginBottom: '1.25rem' }}>
        {Array.from({ length: firstDay }).map((_, i) => (
          <div key={`empty-${i}`} />
        ))}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const dayLogs = logsForDay(day);
          const isToday = today.getFullYear() === year && today.getMonth() === month && today.getDate() === day;
          const isSelected = selectedDay === day;
          const dn = dayNum(day);
          const dnColor = numColors[dn] || '#a78bfa';

          return (
            <div key={day} onClick={() => setSelectedDay(isSelected ? null : day)} style={{
              borderRadius: '0.75rem', padding: '0.4rem 0.25rem',
              background: isSelected ? 'rgba(201,168,76,0.15)' : isToday ? 'rgba(255,255,255,0.06)' : 'rgba(8,6,28,0.7)',
              border: isSelected ? '1px solid rgba(201,168,76,0.4)' : isToday ? '1px solid rgba(255,255,255,0.15)' : '1px solid rgba(255,255,255,0.04)',
              cursor: 'pointer', minHeight: '60px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.2rem',
              backdropFilter: 'blur(8px)'
            }}>
              <span style={{ fontSize: '0.75rem', fontWeight: isToday ? 700 : 400, color: isToday ? '#c9a84c' : 'rgba(255,255,255,0.6)' }}>{day}</span>
              <span style={{ fontSize: '0.55rem', color: dnColor, opacity: 0.7 }}>{dn}</span>
              {dayLogs.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1px', justifyContent: 'center' }}>
                  {dayLogs.slice(0, 3).map((l, idx) => (
                    <div key={idx} style={{ width: '6px', height: '6px', borderRadius: '50%', background: getColor(l.number) }} />
                  ))}
                  {dayLogs.length > 3 && <span style={{ fontSize: '0.5rem', color: 'rgba(255,255,255,0.3)' }}>+{dayLogs.length - 3}</span>}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', marginBottom: '1.25rem', padding: '0.75rem 1rem', background: 'rgba(255,255,255,0.03)', borderRadius: '0.875rem', border: '1px solid rgba(255,255,255,0.05)' }}>
        <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.7rem' }}>● colored dots = angel sightings</span>
        <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.7rem' }}>small number = numerology day energy</span>
      </div>

      {/* Selected day detail */}
      {selectedDay && (
        <div style={{ background: 'rgba(8,6,28,0.92)', borderRadius: '1.5rem', border: '1px solid rgba(201,168,76,0.2)', padding: '1.25rem', backdropFilter: 'blur(12px)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <h3 style={{ color: '#c9a84c', fontFamily: 'Cormorant Garamond, serif', fontSize: '1.1rem' }}>{MONTHS[month]} {selectedDay}, {year}</h3>
            <div style={{ background: 'rgba(201,168,76,0.1)', border: '1px solid rgba(201,168,76,0.2)', borderRadius: '999px', padding: '0.2rem 0.6rem', fontSize: '0.72rem', color: '#c9a84c' }}>Day {dayNum(selectedDay)} energy</div>
          </div>
          {selectedLogs.length === 0 ? (
            <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.85rem', textAlign: 'center', padding: '1rem' }}>No angel numbers logged this day</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {selectedLogs.map(l => (
                <div key={l.id} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.875rem', padding: '0.75rem', background: 'rgba(255,255,255,0.03)', borderRadius: '0.875rem', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <div style={{ background: `${getColor(l.number)}15`, border: `1px solid ${getColor(l.number)}25`, borderRadius: '0.5rem', padding: '0.3rem 0.6rem', fontWeight: 800, color: getColor(l.number), fontFamily: 'Cormorant Garamond, serif', fontSize: '1rem', flexShrink: 0 }}>{l.number}</div>
                  <div style={{ flex: 1 }}>
                    {l.thought && <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.82rem', lineHeight: 1.5 }}>{l.thought}</p>}
                    <p style={{ color: 'rgba(255,255,255,0.25)', fontSize: '0.7rem', marginTop: '0.25rem' }}>{new Date(l.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}