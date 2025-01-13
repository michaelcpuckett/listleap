declare var self: ServiceWorkerGlobalScope;

import URLS_TO_CACHE from './static.json';

export function handleInstall(event: Event) {
  if (!(event instanceof ExtendableEvent)) {
    return;
  }

  self.skipWaiting();

  event.waitUntil(
    (async () => {
      const urlsToCache = URLS_TO_CACHE.map((url) => {
        return new Request(new URL(url, self.location.origin).href, {
          cache: 'no-cache',
          headers: {
            'Cache-Control': 'max-age=0, no-cache',
          },
        });
      });
      const cache = await caches.open(`v1`);
      await cache.addAll(urlsToCache);
    })(),
  );
}
