self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open("converto-v1").then((cache) => {
            return cache.addAll([
                "/converto/",
                "/converto/index.html",
                "/converto/script.js",
                "/converto/style.css",
                "/converto/manifest.json",
                "/converto/converto.png",
                "/converto/offline.html"
            ]);
        })
    );
});

self.addEventListener("fetch", (event) => {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        return cachedResponse || fetch(event.request).catch(() => {
          // fallback to offline.html or a custom offline response
          return caches.match("/converto/offline.html");
        });
      })
    );
  });
