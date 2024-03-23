// Service Worker Logic

var cacheName = 'my-web-app-cache-v1';
var filesToCache = [
  '/',
  '/index.html',
  '/indexCascadingStylingSheets.css',
  '/indexJavaScript.js',
  '/assets/Fonts/SF-Sports-Night-NS.ttf',
  '/assets/Fonts/SF-Sports-Night.ttf',
  '/assets/Pictures/4063_Logo.png',
  '/assets/Pictures/Crescendo_Logo.png',
  '/QR-CodeGen.js',
  '/icon-192.png',
  '/icon-512.png',
  '/manifest.json',
  '/service-worker.js'
];

// Install event
self.addEventListener('install', function(event) {
  // Precache the app shell
  event.waitUntil(
    caches.open(cacheName).then(function(cache) {
      return cache.addAll(filesToCache);
    })
  );
});

// Activate event
self.addEventListener('activate', function(event) {
  // Clean up old caches if any
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.filter(function(name) {
          return name !== cacheName;
        }).map(function(name) {
          return caches.delete(name);
        })
      );
    })
  );
});

// Fetch event
self.addEventListener('fetch', function(event) {
  // Serve from cache if available, otherwise fetch from network
  event.respondWith(
    caches.match(event.request).then(function(response) {
      return response || fetch(event.request);
    })
  );
});

// Listen for beforeinstallprompt event
self.addEventListener('beforeinstallprompt', function(event) {
  // Cache the app when the user decides to install it
  event.userChoice.then(function(choiceResult) {
    if (choiceResult.outcome === 'accepted') {
      console.log('User accepted the installation');
    }
  });
});

