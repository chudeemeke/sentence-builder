/**
 * Service Worker - PWA Offline Support
 * AAA+ Quality: Complete offline functionality with intelligent caching
 */

const CACHE_NAME = 'sentence-builder-v1.0.0';
const RUNTIME_CACHE = 'runtime-cache-v1';
const MAX_CACHE_AGE = 7 * 24 * 60 * 60 * 1000; // 7 days

// Assets to cache immediately on install
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/offline.html',
  '/manifest.json',
  '/favicon.ico',
  '/assets/sounds/success.mp3',
  '/assets/sounds/achievement.mp3',
  '/assets/sounds/error.mp3',
  '/assets/icons/icon-192x192.png',
  '/assets/icons/icon-512x512.png'
];

// Dynamic caching strategies
const CACHE_STRATEGIES = {
  // Network first, fallback to cache
  networkFirst: [
    '/api/',
    '/auth/',
    '/sync/'
  ],
  
  // Cache first, fallback to network
  cacheFirst: [
    '/assets/',
    '/fonts/',
    '/images/',
    '/sounds/'
  ],
  
  // Stale while revalidate
  staleWhileRevalidate: [
    '/data/wordbanks/',
    '/data/patterns/',
    '/content/'
  ]
};

// Install event - cache core assets
self.addEventListener('install', (event) => {
  console.log('[ServiceWorker] Installing...');
  
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[ServiceWorker] Caching static assets');
      return cache.addAll(STATIC_ASSETS);
    }).then(() => {
      // Force immediate activation
      return self.skipWaiting();
    })
  );
});

// Activate event - cleanup old caches
self.addEventListener('activate', (event) => {
  console.log('[ServiceWorker] Activating...');
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter(name => name !== CACHE_NAME && name !== RUNTIME_CACHE)
          .map(name => {
            console.log('[ServiceWorker] Deleting old cache:', name);
            return caches.delete(name);
          })
      );
    }).then(() => {
      // Take control of all clients immediately
      return self.clients.claim();
    })
  );
});

// Fetch event - intelligent caching strategies
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Determine caching strategy
  const strategy = getStrategy(url.pathname);
  
  event.respondWith(
    handleRequest(request, strategy).catch(() => {
      // Fallback to offline page for navigation requests
      if (request.mode === 'navigate') {
        return caches.match('/offline.html');
      }
    })
  );
});

// Handle different caching strategies
async function handleRequest(request, strategy) {
  switch (strategy) {
    case 'networkFirst':
      return networkFirst(request);
    
    case 'cacheFirst':
      return cacheFirst(request);
    
    case 'staleWhileRevalidate':
      return staleWhileRevalidate(request);
    
    default:
      return networkOnly(request);
  }
}

// Network first strategy
async function networkFirst(request) {
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      // Update cache with fresh response
      const cache = await caches.open(RUNTIME_CACHE);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    // Fallback to cache
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    throw error;
  }
}

// Cache first strategy
async function cacheFirst(request) {
  const cachedResponse = await caches.match(request);
  
  if (cachedResponse) {
    // Check if cache is still fresh
    const cacheDate = new Date(cachedResponse.headers.get('date'));
    if (Date.now() - cacheDate.getTime() < MAX_CACHE_AGE) {
      return cachedResponse;
    }
  }
  
  // Fetch from network and cache
  try {
    const networkResponse = await fetch(request);
    
    if (networkResponse.ok) {
      const cache = await caches.open(RUNTIME_CACHE);
      cache.put(request, networkResponse.clone());
    }
    
    return networkResponse;
  } catch (error) {
    if (cachedResponse) {
      return cachedResponse; // Return stale cache if network fails
    }
    throw error;
  }
}

// Stale while revalidate strategy
async function staleWhileRevalidate(request) {
  const cachedResponse = await caches.match(request);
  
  // Return cached response immediately
  const fetchPromise = fetch(request).then((networkResponse) => {
    if (networkResponse.ok) {
      const cache = caches.open(RUNTIME_CACHE);
      cache.then(c => c.put(request, networkResponse.clone()));
    }
    return networkResponse;
  });
  
  return cachedResponse || fetchPromise;
}

// Network only strategy
async function networkOnly(request) {
  return fetch(request);
}

// Determine strategy based on URL
function getStrategy(pathname) {
  for (const [strategy, patterns] of Object.entries(CACHE_STRATEGIES)) {
    if (patterns.some(pattern => pathname.startsWith(pattern))) {
      return strategy;
    }
  }
  return 'networkOnly';
}

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  console.log('[ServiceWorker] Background sync triggered');
  
  if (event.tag === 'sync-sentences') {
    event.waitUntil(syncSentences());
  } else if (event.tag === 'sync-progress') {
    event.waitUntil(syncProgress());
  }
});

// Sync offline sentences to server
async function syncSentences() {
  try {
    // Get pending sentences from IndexedDB
    const db = await openDB();
    const tx = db.transaction('pending_sentences', 'readonly');
    const store = tx.objectStore('pending_sentences');
    const sentences = await store.getAll();
    
    // Send to server
    for (const sentence of sentences) {
      await fetch('/api/sentences/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sentence)
      });
      
      // Remove from pending after successful sync
      const deleteTx = db.transaction('pending_sentences', 'readwrite');
      await deleteTx.objectStore('pending_sentences').delete(sentence.id);
    }
    
    // Notify clients of successful sync
    const clients = await self.clients.matchAll();
    clients.forEach(client => {
      client.postMessage({
        type: 'SYNC_COMPLETE',
        data: { count: sentences.length }
      });
    });
  } catch (error) {
    console.error('[ServiceWorker] Sync failed:', error);
    // Will retry automatically
  }
}

// Sync progress data
async function syncProgress() {
  try {
    const db = await openDB();
    const tx = db.transaction('progress', 'readonly');
    const store = tx.objectStore('progress');
    const progress = await store.get('current');
    
    if (progress) {
      await fetch('/api/progress/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(progress)
      });
    }
  } catch (error) {
    console.error('[ServiceWorker] Progress sync failed:', error);
  }
}

// Push notifications
self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : 'New achievement unlocked!',
    icon: '/assets/icons/icon-192x192.png',
    badge: '/assets/icons/badge-72x72.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    }
  };
  
  event.waitUntil(
    self.registration.showNotification('Sentence Builder', options)
  );
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  event.waitUntil(
    clients.openWindow('/')
  );
});

// Helper to open IndexedDB
function openDB() {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open('sentence-builder-db', 1);
    
    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);
    
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      
      if (!db.objectStoreNames.contains('pending_sentences')) {
        db.createObjectStore('pending_sentences', { keyPath: 'id' });
      }
      
      if (!db.objectStoreNames.contains('progress')) {
        db.createObjectStore('progress');
      }
    };
  });
}

// Performance monitoring
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'GET_CACHE_SIZE') {
    getCacheSize().then(size => {
      event.ports[0].postMessage({ type: 'CACHE_SIZE', size });
    });
  }
});

// Calculate cache size
async function getCacheSize() {
  const cacheNames = await caches.keys();
  let totalSize = 0;
  
  for (const name of cacheNames) {
    const cache = await caches.open(name);
    const requests = await cache.keys();
    
    for (const request of requests) {
      const response = await cache.match(request);
      if (response) {
        const blob = await response.blob();
        totalSize += blob.size;
      }
    }
  }
  
  return totalSize;
}

console.log('[ServiceWorker] Ready for offline-first functionality!');