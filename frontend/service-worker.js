importScripts('/components/Services/pwa.config.js');
const VERSION = (self.PWA_CONFIG && self.PWA_CONFIG.version) || 'v1';
const STATIC_CACHE = `static-${VERSION}`;
const RUNTIME_CACHE = `runtime-${VERSION}`;
const PRECACHE_URLS = (self.PWA_CONFIG && self.PWA_CONFIG.precache) || [];
const API_PREFIX = (self.PWA_CONFIG && self.PWA_CONFIG.apiPrefix) || '/api/';
const IMAGE_EXTENSIONS = (self.PWA_CONFIG && self.PWA_CONFIG.imageExtensions) || ['.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => cache.addAll(PRECACHE_URLS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.map((key) => {
      if (key !== STATIC_CACHE && key !== RUNTIME_CACHE) {
        return caches.delete(key);
      }
    })))
  );
  self.clients.claim();
});

function isImageRequest(url) {
  const u = typeof url === 'string' ? new URL(url, self.location.origin) : url;
  const p = u.pathname.toLowerCase();
  return IMAGE_EXTENSIONS.some((ext) => p.endsWith(ext));
}

function networkFirst(request) {
  return fetch(request)
    .then((response) => {
      const copy = response.clone();
      caches.open(RUNTIME_CACHE).then((cache) => cache.put(request, copy));
      return response;
    })
    .catch(() => caches.match(request));
}

function cacheFirst(request) {
  return caches.match(request).then((cached) => {
    if (cached) return cached;
    return fetch(request).then((response) => {
      const copy = response.clone();
      caches.open(RUNTIME_CACHE).then((cache) => cache.put(request, copy));
      return response;
    });
  });
}

function staleWhileRevalidate(request) {
  return caches.match(request).then((cached) => {
    const fetchPromise = fetch(request).then((response) => {
      const copy = response.clone();
      caches.open(RUNTIME_CACHE).then((cache) => cache.put(request, copy));
      return response;
    });
    return cached || fetchPromise;
  });
}

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);

  if (url.pathname.startsWith(API_PREFIX)) {
    event.respondWith(networkFirst(request));
    return;
  }

  if (isImageRequest(url)) {
    event.respondWith(cacheFirst(request));
    return;
  }

  event.respondWith(staleWhileRevalidate(request));
});