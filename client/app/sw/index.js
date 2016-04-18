var staticCacheName = 'transit-static-v1';

self.addEventListener('install', function(event) {
	event.waitUntil(
    caches.open(staticCacheName).then(function(cache) {
      return cache.addAll([
        '/app.js',
        '../../assets/JSON/train_lines.json'
        /*'/skeleton',
        'js/main.js',
        'css/main.css',
        'imgs/icon.png',
        'https://fonts.gstatic.com/s/roboto/v15/2UX7WLTfW3W8TclTUvlFyQ.woff',
        'https://fonts.gstatic.com/s/roboto/v15/d-6IYplOFocCacKzxwXSOD8E0i7KZn-EPnyo3HZu7kw.woff'
      	*/
      ]);
    })
  );
});

self.addEventListener('activate', function(event) {
  console.log('service worker activated');
  console.log(self);
});


self.addEventListener('fetch', function(event) {
  console.log('fetch event triggered')
});

