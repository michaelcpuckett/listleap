import {
  getCacheVersionFromIndexedDb,
  getIdb,
  saveCacheVersionToIndexedDb,
} from './idb';
import { URLS_TO_CACHE } from './urlsToCache';

export async function fetchCacheVersion(): Promise<[number, boolean]> {
  return await fetch('/version.txt', {
    cache: 'no-cache',
  })
    .then((r) => r.text())
    .then(async (latestCacheVersion) => {
      const idb = await getIdb();
      const savedCacheVersion = await getCacheVersionFromIndexedDb(idb);
      idb.close();

      if (Number(latestCacheVersion) !== savedCacheVersion) {
        const idb = await getIdb();

        await saveCacheVersionToIndexedDb(Number(latestCacheVersion), idb);

        idb.close();

        const urlsToCache = URLS_TO_CACHE.map((url) => {
          return new Request(new URL(url, self.location.origin).href, {
            cache: 'no-cache',
            headers: {
              'Cache-Control': 'max-age=0, no-cache',
            },
          });
        });
        const cache = await caches.open(`v${latestCacheVersion}`);
        await cache.addAll(urlsToCache);
        await caches.delete(`v${savedCacheVersion}`);

        const broadcastChannel = new BroadcastChannel('sw-messages');

        const reloadedPromise = new Promise((resolve) => {
          broadcastChannel.addEventListener(
            'message',
            (event) => {
              if (event.data === 'reload') {
                resolve(void 0);
              }
            },
            {
              once: true,
            },
          );
        });

        broadcastChannel.postMessage('unregister');

        await reloadedPromise;

        const returnValue: [number, boolean] = [
          Number(latestCacheVersion),
          true,
        ];

        return returnValue;
      }

      const returnValue: [number, boolean] = [
        Number(latestCacheVersion),
        false,
      ];

      return returnValue;
    })
    .catch(async () => {
      console.log('OFFLINE.');
      const idb = await getIdb();
      const savedCacheVersion = await getCacheVersionFromIndexedDb(idb);
      idb.close();

      const returnValue: [number, boolean] = [savedCacheVersion, false];

      return returnValue;
    });
}
