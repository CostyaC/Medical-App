// ======================================================
// CALCULADORA PEDIÁTRICA
// PWA SERVICE WORKER
// ======================================================


// ------------------------------------------------------
// CACHE VERSION
//
// When we update the deployed application later,
// we can change v2 to v3, v4, etc.
// ------------------------------------------------------

const CACHE_NAME = "calculadora-pediatrica-v2";


// ------------------------------------------------------
// FILES AVAILABLE OFFLINE
// ------------------------------------------------------

const FILES_TO_CACHE = [

    "./",

    "./index.html",

    "./style.css",

    "./App.js",

    "./manifest.json",

    "./icons/icon-192.png",

    "./icons/icon-512.png"

];


// ======================================================
// INSTALL
// Save the application files in the browser cache.
// ======================================================

self.addEventListener(
    "install",
    function (event) {

        event.waitUntil(

            caches
                .open(CACHE_NAME)

                .then(function (cache) {

                    return cache.addAll(
                        FILES_TO_CACHE
                    );

                })

        );

    }
);


// ======================================================
// ACTIVATE
// Delete previous versions of the application cache.
// ======================================================

self.addEventListener(
    "activate",
    function (event) {

        event.waitUntil(

            caches
                .keys()

                .then(function (cacheNames) {

                    return Promise.all(

                        cacheNames.map(
                            function (cacheName) {

                                if (
                                    cacheName !== CACHE_NAME
                                ) {

                                    return caches.delete(
                                        cacheName
                                    );

                                }

                            }
                        )

                    );

                })

        );

    }
);


// ======================================================
// FETCH
//
// When the application requests a file:
//
// 1. Look for it in the cache.
// 2. If found, return the cached version.
// 3. Otherwise request it from the network.
// ======================================================

self.addEventListener(
    "fetch",
    function (event) {

        if (
            event.request.method !== "GET"
        ) {

            return;

        }


        event.respondWith(

            caches
                .match(event.request)

                .then(function (cachedResponse) {

                    if (cachedResponse) {

                        return cachedResponse;

                    }


                    return fetch(
                        event.request
                    );

                })

        );

    }
);