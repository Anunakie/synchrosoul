// SynchroSoul Service Worker v1
const CACHE_NAME = 'synchrosoul-v1';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(clients.claim());
});

// Handle push notifications
self.addEventListener('push', (event) => {
  const data = event.data ? event.data.json() : {};
  const title = data.title || 'SynchroSoul';
  const options = {
    body: data.body || 'You have a new cosmic message',
    icon: '/icon-192.png',
    badge: '/icon-192.png',
    tag: data.tag || 'synchrosoul',
    data: { url: data.url || '/dashboard' },
    vibrate: [200, 100, 200],
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

// Handle notification click
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = event.notification.data?.url || '/dashboard';
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if (client.url.includes(url) && 'focus' in client) return client.focus();
      }
      if (clients.openWindow) return clients.openWindow(url);
    })
  );
});

// Background sync for angel number logging
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-logs') {
    event.waitUntil(syncPendingLogs());
  }
});

async function syncPendingLogs() {
  // Sync any pending logs when back online
  console.log('SynchroSoul: syncing pending logs...');
}
