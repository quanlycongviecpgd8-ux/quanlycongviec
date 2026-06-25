// ============================================================
//  TaskFlow Service Worker — Offline Cache
//  Phiên bản: 1.0
// ============================================================

const CACHE_NAME = 'taskflow-v1';

// Các file cần cache để dùng offline
const ASSETS = [
  './quan-ly-cong-viec.html',
  './manifest.json',
];
// ============================================================
//  TaskFlow Service Worker — Offline Cache
//  Phiên bản: 1.0
// ============================================================

const CACHE_NAME = 'taskflow-v1';

// Các file cần cache để dùng offline
const ASSETS = [
  './quan-ly-cong-viec.html',
  './manifest.json',
];

// ── CÀI ĐẶT: cache tất cả assets ──
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(ASSETS))
      .then(() => self.skipWaiting())
  );
});

// ── ACTIVATE: xóa cache cũ ──
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// ── FETCH: trả về cache nếu offline, network nếu online ──
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // Với Google Apps Script API → luôn dùng network (cần internet để đồng bộ)
  if (url.hostname.includes('script.google.com')) {
    event.respondWith(
      fetch(event.request).catch(() =>
        new Response(JSON.stringify({ ok: false, error: 'Không có kết nối mạng. Dữ liệu sẽ đồng bộ khi có internet.' }), {
          headers: { 'Content-Type': 'application/json' }
        })
      )
    );
    return;
  }

  // Google Fonts → network first, fallback cache
  if (url.hostname.includes('fonts.googleapis.com') || url.hostname.includes('fonts.gstatic.com')) {
    event.respondWith(
      fetch(event.request)
        .then(res => {
          const clone = res.clone();
          caches.open(CACHE_NAME + '-fonts').then(c => c.put(event.request, clone));
          return res;
        })
        .catch(() => caches.match(event.request))
    );
    return;
  }

  // Assets cục bộ → cache first, fallback network
  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;
      return fetch(event.request).then(res => {
        if (!res || res.status !== 200) return res;
        const clone = res.clone();
        caches.open(CACHE_NAME).then(c => c.put(event.request, clone));
        return res;
      });
    })
  );
});

// ── PUSH NOTIFICATION (tương lai có thể dùng) ──
self.addEventListener('push', event => {
  const data = event.data?.json() || { title: 'TaskFlow', body: 'Bạn có thông báo mới' };
  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: './icon-192.png',
      badge: './icon-192.png',
      vibrate: [100, 50, 100],
      tag: 'taskflow-notification',
    })
  );
});

// ── CÀI ĐẶT: cache tất cả assets ──
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(ASSETS))
      .then(() => self.skipWaiting())
  );
});

// ── ACTIVATE: xóa cache cũ ──
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// ── FETCH: trả về cache nếu offline, network nếu online ──
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // Với Google Apps Script API → luôn dùng network (cần internet để đồng bộ)
  if (url.hostname.includes('script.google.com')) {
    event.respondWith(
      fetch(event.request).catch(() =>
        new Response(JSON.stringify({ ok: false, error: 'Không có kết nối mạng. Dữ liệu sẽ đồng bộ khi có internet.' }), {
          headers: { 'Content-Type': 'application/json' }
        })
      )
    );
    return;
  }

  // Google Fonts → network first, fallback cache
  if (url.hostname.includes('fonts.googleapis.com') || url.hostname.includes('fonts.gstatic.com')) {
    event.respondWith(
      fetch(event.request)
        .then(res => {
          const clone = res.clone();
          caches.open(CACHE_NAME + '-fonts').then(c => c.put(event.request, clone));
          return res;
        })
        .catch(() => caches.match(event.request))
    );
    return;
  }

  // Assets cục bộ → cache first, fallback network
  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;
      return fetch(event.request).then(res => {
        if (!res || res.status !== 200) return res;
        const clone = res.clone();
        caches.open(CACHE_NAME).then(c => c.put(event.request, clone));
        return res;
      });
    })
  );
});

// ── PUSH NOTIFICATION (tương lai có thể dùng) ──
self.addEventListener('push', event => {
  const data = event.data?.json() || { title: 'TaskFlow', body: 'Bạn có thông báo mới' };
  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: './icon-192.png',
      badge: './icon-192.png',
      vibrate: [100, 50, 100],
      tag: 'taskflow-notification',
    })
  );
});
