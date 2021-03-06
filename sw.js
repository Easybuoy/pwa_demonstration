var CACHE_NAME = "my-site-cache-v1";
var urlsToCache = [
  "./",
  "./index.html",
  "./manifest.json",
  "./style.css",
  "./main.js",
  "https://fonts.googleapis.com/css2?family=Roboto:wght@400;500&display=swap",
  "./assets/favicon.png",
  "./assets/icon-152x152.png",
  "./assets/icon-310x310.png",
];

self.addEventListener("install", function (event) {
  // Perform install steps
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then(function (cache) {
        console.log("caching files");
        return cache.addAll(urlsToCache);
      })
      .catch(function (e) {
        console.log(e, "ee");
      })
  );
});

self.addEventListener("activate", function (e) {
  console.log("service worker activated");
});

self.addEventListener("fetch", function (event) {
  event.respondWith(
    caches.match(event.request).then(function (response) {
      // Cache hit - return response
      if (response) {
        return response;
      }

      // IMPORTANT: Clone the request. A request is a stream and
      // can only be consumed once. Since we are consuming this
      // once by cache and once by the browser for fetch, we need
      // to clone the response.
      var fetchRequest = event.request.clone();

      return fetch(fetchRequest).then(function (response) {
        // Check if we received a valid response
        if (!response || response.status !== 200 || response.type !== "basic") {
          return response;
        }

        // IMPORTANT: Clone the response. A response is a stream
        // and because we want the browser to consume the response
        // as well as the cache consuming the response, we need
        // to clone it so we have two streams.
        var responseToCache = response.clone();

        caches.open(CACHE_NAME).then(function (cache) {
          cache.put(event.request, responseToCache);
        });

        return response;
      });
    })
  );
});
