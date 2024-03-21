// Service Worker Logic

// Define the cache name
var cacheName = 'my-web-app-cache-v1';

// List of files to cache
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
  event.waitUntil(
    caches.open(cacheName).then(function(cache) {
      return cache.addAll(filesToCache);
    })
  );
});

// Fetch event
self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request).then(function(response) {
      return response || fetch(event.request);
    })
  );
});
