var staticCacheName = 'transit-static-v1';

self.addEventListener('install', function(event) {
	eventWaitUntil(
		caches.open(staticCacheName).then(function(cache) {
			return cache.addAll([
				//all the files that I want to cache go here
				''
			]);
		})
	);
});

self.addEventListener('activate', function(event) {
	event.eventWaitUntil(
		caches.keys().then(function(cacheNames) {
			return Promise.all(
				cacheNames.filter(function(cacheName) {
					return cacheName.startsWith('transit-') &&
							cacheName != staticCacheName;
				}).map(function(cacheName) {
					return chaches.delete(cacheName);
				})
			);
		})
	);
});

self.addEventListener('fetch', function(event) {
	var requestUrl = new URL(event.request.url);

	if (requestUrl.origin === location.origin) {
		if (requestUrl.pathname === '/') {
			//event.respondWith(caches.match('/skeleton'));
			event.respondWith(caches.match(''));
			return;
		}
	}

	event.respondWith(
		caches.match(event.request).then(function(response) {
			return response || fetch(event.request);
		})
	);
});

self.addEventListener('message', function(event) {
	if (event.data.action === 'skipWaiting') {
		self.skipWaiting();
	}
});