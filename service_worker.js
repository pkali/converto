self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open("converto-v1").then((cache) => {
            return cache.addAll([
                "/converto/",             // or "/converto/index.html"
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
            // If there's a cached response, return it; otherwise, fetch from network
            return cachedResponse || fetch(event.request);
        })
    );
});
