// SynchroSoul Service Worker v3 - Soul Twin Push Alerts
const CACHE_NAME = 'synchrosoul-v3';
const STATIC_ASSETS = [
  '/',
  '/dashboard',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png',
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(STATIC_ASSETS).catch(() => {}))
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    ).then(() => clients.claim())
  );
});

// Network first, cache fallback
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  if (event.request.url.includes('/api/') || event.request.url.includes('supabase')) return;
  event.respondWith(
    fetch(event.request)
      .then(res => {
        if (res.ok) {
          const clone = res.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        }
        return res;
      })
      .catch(() => caches.match(event.request))
  );
});

// Handle Web Push notifications from server
self.addEventListener('push', (event) => {
  let data = {};
  try {
    data = event.data ? event.data.json() : {};
  } catch (e) {
    data = { title: 'SynchroSoul', body: event.data ? event.data.text() : '' };
  }

  const isSoulTwin = data.tag && data.tag.startsWith('soul-twin-');
  const number = data.number || '';

  const title = data.title || (isSoulTwin ? '✨ Soul Twin Alert!' : 'SynchroSoul ✦');
  const options = {
    body: data.body || 'Your cosmic energy is calling...',
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    tag: data.tag || 'synchrosoul',
    data: { url: data.url || '/dashboard/sync', number },
    vibrate: isSoulTwin ? [300, 100, 300, 100, 300] : [200, 100, 200],
    requireInteraction: isSoulTwin,
    actions: isSoulTwin
      ? [
          { action: 'view-match', title: '✨ View Match' },
          { action: 'log-number', title: '🔢 Log ' + number },
        ]
      : [
          { action: 'open', title: 'Open App' },
          { action: 'dismiss', title: 'Dismiss' },
        ],
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

// Handle notification click
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  let url = '/dashboard';
  if (event.action === 'view-match') url = '/dashboard/sync';
  else if (event.action === 'log-number') url = '/dashboard';
  else url = event.notification.data?.url || '/dashboard';

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          client.navigate(url);
          return client.focus();
        }
      }
      if (clients.openWindow) return clients.openWindow(url);
    })
  );
});

// Message from app to schedule local notification
self.addEventListener('message', (event) => {
  if (event.data?.type === 'SCHEDULE_NOTIFICATION') {
    const { title, body, delay, tag, url } = event.data;
    setTimeout(() => {
      self.registration.showNotification(title, {
        body,
        icon: '/icon-192.png',
        badge: '/icon-192.png',
        tag: tag || 'daily-reminder',
        data: { url: url || '/dashboard' },
        vibrate: [200, 100, 200],
      });
    }, delay || 0);
  }
});
