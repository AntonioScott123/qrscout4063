// Service Worker Logic

var cacheName = 'my-web-app-cache-v2'; // Increment version to ensure old cache is deleted
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
  // Delete old cache and precache the app shell
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.filter(function(name) {
          return name.startsWith('my-web-app-cache-') && name !== cacheName;
        }).map(function(name) {
          return caches.delete(name);
        })
      );
    }).then(function() {
      return caches.open(cacheName).then(function(cache) {
        return cache.addAll(filesToCache);
      });
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
          return name.startsWith('my-web-app-cache-') && name !== cacheName;
        }).map(function(name) {
          return caches.delete(name);
        })
      );
    })
  );
});

// Fetch event
self.addEventListener('fetch', function(event) {
  // Try fetching from network first, fallback to cache if network fails
  event.respondWith(
    fetch(event.request).then(function(response) {
      // If successful, cache the response and return it
      return caches.open(cacheName).then(function(cache) {
        cache.put(event.request, response.clone());
        return response;
      });
    }).catch(function() {
      // If network fails, serve from cache
      return caches.match(event.request).then(function(response) {
        return response || fetch(event.request);
      });
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
