const CACHE_NAME = 'eureka-vault-v3';
const ASSETS = [
  './',
  './index.html',
  './style.css',
  './vault.data.js',
  './vault-gate.js',
  './logo.jpg',
  './img_lcl.png',
  './img_fcl.png',
  './img_history.png',
  './img_support.png',
  './img_pdf_preview.png'
];

// Install Service Worker and cache essential assets
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[Service Worker] Caching static assets');
      return cache.addAll(ASSETS);
    }).then(() => self.skipWaiting())
  );
});

// Activate Service Worker and clean up old caches
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('[Service Worker] Removing old cache:', key);
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch events: Network first, fallback to cache
self.addEventListener('fetch', (e) => {
  // Only cache GET requests (ignore POST API requests to Google Sheets)
  if (e.request.method !== 'GET') return;

  e.respondWith(
    fetch(e.request)
      .then((response) => {
        // If valid network response, clone and cache it
        if (response.ok) {
          const resClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(e.request, resClone);
          });
        }
        return response;
      })
      .catch(() => {
        // Offline: serve from cache
        return caches.match(e.request);
      })
  );
});

// Listen for Push Notifications from Server
self.addEventListener('push', (e) => {
  let data = {
    title: 'Eureka Logistics',
    body: 'Có thông tin cập nhật mới từ hệ thống!',
    icon: './logo.jpg',
    badge: './logo.jpg'
  };

  if (e.data) {
    try {
      const parsed = e.data.json();
      data = Object.assign(data, parsed);
    } catch (err) {
      data.body = e.data.text();
    }
  }

  const options = {
    body: data.body,
    icon: data.icon,
    badge: data.badge,
    data: {
      url: data.url || './index.html'
    },
    vibrate: [100, 50, 100],
    actions: [
      { action: 'open', title: 'Xem chi tiết' },
      { action: 'close', title: 'Đóng' }
    ]
  };

  e.waitUntil(
    self.registration.showNotification(data.title, options)
  );
});

// Handle notification click (open or focus tab)
self.addEventListener('notificationclick', (e) => {
  e.notification.close();

  const urlToOpen = new URL(e.notification.data.url, self.location.origin).href;

  e.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      // If a window client is already open, focus it
      for (let client of windowClients) {
        if (client.url === urlToOpen && 'focus' in client) {
          return client.focus();
        }
      }
      // Otherwise open a new window
      if (self.clients.openWindow) {
        return self.clients.openWindow(urlToOpen);
      }
    })
  );
});
