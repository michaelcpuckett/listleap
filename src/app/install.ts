import { getIdb, saveCacheVersionToIndexedDb } from 'utilities/idb';
import { URLS_TO_CACHE } from 'utilities/urlsToCache';

export function handleInstall(event: Event) {
  if (!(event instanceof ExtendableEvent)) {
    return;
  }

  event.waitUntil(
    (async () => {
      return fetch('/version.txt', {
        cache: 'no-cache',
      })
        .then((r) => r.text())
        .then(async (latestCacheVersion) => {
          const idb = await getIdb();

          await saveCacheVersionToIndexedDb(Number(latestCacheVersion), idb);

          idb.close();

          // const hasCache = await caches.has(`v${latestCacheVersion}`);

          // if (hasCache) {
          //   return;
          // }

          const urlsToCache = ['/', ...URLS_TO_CACHE].map((url) => {
            return new Request(new URL(url, self.location.origin).href, {
              cache: 'no-cache',
              headers: {
                'Cache-Control': 'max-age=0, no-cache',
              },
            });
          });
          const cache = await caches.open(`v${latestCacheVersion}`);
          await cache.addAll(urlsToCache);
        });
    })(),
  );
}
