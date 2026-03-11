// SynchroSoul Service Worker v2
const CACHE_NAME = 'synchrosoul-v2';
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

// Handle push notifications from server
self.addEventListener('push', (event) => {
  const data = event.data ? event.data.json() : {};
  const title = data.title || 'SynchroSoul ✦';
  const options = {
    body: data.body || 'Your cosmic energy is calling...',
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    tag: data.tag || 'synchrosoul',
    data: { url: data.url || '/dashboard' },
    vibrate: [200, 100, 200],
    actions: [
      { action: 'log', title: 'Log a Number' },
      { action: 'dismiss', title: 'Dismiss' },
    ],
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

// Handle notification click
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  let url = '/dashboard';
  if (event.action === 'log') url = '/dashboard';
  else url = event.notification.data?.url || '/dashboard';
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if ('focus' in client) return client.focus();
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
      self.registration.showNotification(title || 'SynchroSoul ✦', {
        body: body || 'Time to log your angel numbers',
        icon: '/icon-192.png',
        badge: '/icon-192.png',
        tag: tag || 'reminder',
        data: { url: url || '/dashboard' },
        vibrate: [200, 100, 200],
      });
    }, delay || 0);
  }
});

// Background sync
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-logs') {
    event.waitUntil(Promise.resolve());
  }
});
