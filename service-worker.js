// Service Worker Logic

// Define the cache name
var cacheName = 'my-web-app-cache-v1';

// List of files to cache
var filesToCache = [
  '/',
  '/index.html',
  '/indexCascadingStylingSheets.css',
  '/indexJavaScript.js',
  '/assets/',
  '/QR-CodeGen.js',
  '/icon-192.png',
  '/icon-512.png',
  '/manifest.json'
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
