const CACHE_NAME = 'toque-plus-v2';

// Force SW to activate immediately and skip caching for now to avoid the "white screen" reported by user
self.addEventListener('install', (event) => {
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    return caches.delete(cacheName);
                })
            );
        })
    );
    self.clients.claim();
});

// Pass through to network for everything
self.addEventListener('fetch', (event) => {
    event.respondWith(fetch(event.request));
});
