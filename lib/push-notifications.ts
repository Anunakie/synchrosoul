'use client';

export interface NotificationSchedule {
  hour: number;
  minute: number;
  label: string;
}

export const DAILY_MESSAGES = [
  { title: 'SynchroSoul ✦', body: 'What angel numbers are calling to you today?' },
  { title: 'Cosmic Check-in ✨', body: 'Log your numbers and see who shares your frequency' },
  { title: 'Your guides are speaking 🌟', body: 'Open SynchroSoul to capture today\u2019s signs' },
  { title: 'Angel Number Alert 🔢', body: 'Have you seen any repeating numbers today?' },
  { title: 'Soul Sync Time ✦', body: 'Your cosmic matches are waiting for you' },
  { title: 'Daily Numerology 🌙', body: 'Check your personal guidance for today' },
  { title: 'The universe is signaling 💫', body: 'Log your angel numbers before you forget' },
];

export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (!('Notification' in window)) return 'denied';
  if (Notification.permission === 'granted') return 'granted';
  if (Notification.permission === 'denied') return 'denied';
  return await Notification.requestPermission();
}

export function getNotificationPermission(): NotificationPermission {
  if (!('Notification' in window)) return 'denied';
  return Notification.permission;
}

export async function registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  if (!('serviceWorker' in navigator)) return null;
  try {
    const reg = await navigator.serviceWorker.register('/sw.js');
    return reg;
  } catch (e) {
    console.error('SW registration failed:', e);
    return null;
  }
}

export async function scheduleLocalNotification(delayMs: number, title: string, body: string, url = '/dashboard') {
  const reg = await navigator.serviceWorker.ready;
  if (!reg.active) return;
  reg.active.postMessage({
    type: 'SCHEDULE_NOTIFICATION',
    title,
    body,
    delay: delayMs,
    tag: 'daily-reminder',
    url,
  });
}

export function savePushSettings(settings: { enabled: boolean; hour: number; minute: number }) {
  localStorage.setItem('synchrosoul_push_settings', JSON.stringify(settings));
}

export function getPushSettings(): { enabled: boolean; hour: number; minute: number } {
  try {
    const s = localStorage.getItem('synchrosoul_push_settings');
    if (s) return JSON.parse(s);
  } catch {}
  return { enabled: false, hour: 9, minute: 0 };
}

export function scheduleDailyReminder(hour: number, minute: number) {
  const now = new Date();
  const next = new Date();
  next.setHours(hour, minute, 0, 0);
  if (next <= now) next.setDate(next.getDate() + 1);
  const delay = next.getTime() - now.getTime();
  const msg = DAILY_MESSAGES[Math.floor(Math.random() * DAILY_MESSAGES.length)];
  scheduleLocalNotification(delay, msg.title, msg.body);
  // Store next scheduled time
  localStorage.setItem('synchrosoul_next_reminder', next.toISOString());
}

export function sendTestNotification() {
  if (Notification.permission !== 'granted') return;
  new Notification('SynchroSoul ✦', {
    body: 'Notifications are working! Your cosmic reminders are set.',
    icon: '/icon-192.png',
    badge: '/icon-192.png',
  });
}
