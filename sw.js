/* Packet Path — service worker.
   Bump VERSION on every deploy; old caches are dropped on activate. */
const VERSION = 'pp-v1';
const SHELL   = `${VERSION}-shell`;
const FONTS   = `${VERSION}-fonts`;

/* Relative, because the site is served from /Network1/, not a domain root. */
const PRECACHE = [
  './',
  './index.html',
  './course.html',
  './manifest.webmanifest',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/maskable-512.png',
  './icons/apple-touch-icon.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(SHELL);
    // Individually, so one bad entry can't fail the whole install.
    await Promise.all(PRECACHE.map((url) =>
      cache.add(new Request(url, { cache: 'reload' })).catch(() => {})
    ));
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(
      keys.filter((k) => k !== SHELL && k !== FONTS).map((k) => caches.delete(k))
    );
    await self.clients.claim();
  })());
});

const isFont = (url) =>
  url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com';

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);

  /* Fonts: serve immediately from cache, refresh in the background.
     Opaque cross-origin responses are fine to store here. */
  if (isFont(url)) {
    event.respondWith((async () => {
      const cache = await caches.open(FONTS);
      const hit = await cache.match(req);
      const net = fetch(req).then((res) => {
        if (res && (res.ok || res.type === 'opaque')) cache.put(req, res.clone());
        return res;
      }).catch(() => null);
      return hit || (await net) || Response.error();
    })());
    return;
  }

  if (url.origin !== self.location.origin) return;

  /* Pages: network first, so a fresh deploy is picked up while online;
     fall back to cache when offline. */
  if (req.mode === 'navigate' || req.destination === 'document') {
    event.respondWith((async () => {
      try {
        const res = await fetch(req);
        const cache = await caches.open(SHELL);
        cache.put(req, res.clone());
        return res;
      } catch (err) {
        const cache = await caches.open(SHELL);
        return (await cache.match(req)) ||
               (await cache.match('./index.html')) ||
               Response.error();
      }
    })());
    return;
  }

  /* Everything else same-origin (icons, manifest): cache first. */
  event.respondWith((async () => {
    const cache = await caches.open(SHELL);
    const hit = await cache.match(req);
    if (hit) return hit;
    try {
      const res = await fetch(req);
      if (res && res.ok) cache.put(req, res.clone());
      return res;
    } catch (err) {
      return Response.error();
    }
  })());
});
