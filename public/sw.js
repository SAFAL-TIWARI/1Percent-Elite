const CACHE_NAME = 'one-percent-elite-v1';
const ASSETS_TO_CACHE = [
    './',
    './index.html',
    './styles.css',
    './scripts.js',
    './env.js',
    './manifest.json',
    './assets/icon-192x192.png',
    './assets/icon-512x512.png',
    'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600&display=swap',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
];

// Install event: Cache core assets
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('[Service Worker] Caching all: app shell and content');
                return cache.addAll(ASSETS_TO_CACHE);
            })
    );
});

// Activate event: Clean up old caches
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('[Service Worker] Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

// Fetch event: Hybrid Strategy
self.addEventListener('fetch', (event) => {
    const url = new URL(event.request.url);

    // Strategy 1: Network First for API calls (Google Drive) to get fresh data
    if (url.hostname.includes('googleapis.com') || url.hostname.includes('script.google.com')) {
        event.respondWith(
            fetch(event.request)
                .then((response) => {
                    // Update cache with new data
                    const responseToCache = response.clone();
                    caches.open(CACHE_NAME).then((cache) => {
                        cache.put(event.request, responseToCache);
                    });
                    return response;
                })
                .catch(() => {
                    // Fallback to cache if offline
                    return caches.match(event.request);
                })
        );
    }
    // Strategy 2: Cache First for Static Assets (App Shell) for speed
    else {
        event.respondWith(
            caches.match(event.request)
                .then((response) => {
                    // Return cached response if found
                    if (response) {
                        return response;
                    }
                    // Otherwise fetch from network
                    return fetch(event.request).then((response) => {
                        // Cache new static assets (like new icons)
                        if (!response || response.status !== 200 || response.type !== 'basic') {
                            return response;
                        }
                        const responseToCache = response.clone();
                        caches.open(CACHE_NAME).then((cache) => {
                            cache.put(event.request, responseToCache);
                        });
                        return response;
                    });
                })
        );
    }
});
