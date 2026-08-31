const CACHE_NAME = 'ale-brokering-v1';
const urlsToCache = [
  './',
  './index.html',
  './properties.html',
  './wanted.html',
  './projects.html',
  './experts.html',
  './post.html',
  './login.html',
  './register.html',
  './dashboard.html',
  './css/styles.css',
  './js/app.js',
  './js/data.js',
  './js/i18n.js'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});
