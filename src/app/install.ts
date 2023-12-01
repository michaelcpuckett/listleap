import { getIdb, saveCacheVersionToIndexedDb } from 'utilities/idb';
import { URLS_TO_CACHE } from 'utilities/urlsToCache';

export function handleInstall(event: Event) {
  if (!(event instanceof ExtendableEvent)) {
    return;
  }

  event.waitUntil(
    (async () => {
      console.log('install; open idb');
      const idb = await getIdb();
      const cacheVersion = await fetch('/version.txt').then((r) => r.text());
      await saveCacheVersionToIndexedDb(Number(cacheVersion), idb);
      idb.close();

      const hasCache = await caches.has(`v${cacheVersion}`);

      if (hasCache) {
        console.log(event);
        return;
      }

      return caches
        .open(`v${cacheVersion}`)
        .then(function (cache) {
          return cache.addAll(URLS_TO_CACHE);
        })
        .catch(function (error) {
          console.error(error);
        });
    })(),
  );
}
