import {
  ExpressWorker,
  ExpressWorkerRequest,
  ExpressWorkerResponse,
} from '@express-worker/app';
import { fetchCacheVersion } from 'utilities/fetchCacheVersion';
import { URLS_TO_CACHE } from 'utilities/urlsToCache';

export async function GetStaticFile(
  req: ExpressWorkerRequest,
  res: ExpressWorkerResponse,
) {
  await fetchCacheVersion().then(async ([cacheVersion]) => {
    const cache = await caches.open(`v${cacheVersion}`);
    const cachedResponse = await cache.match(new URL(req.url).pathname);

    if (cachedResponse) {
      res.status = cachedResponse.status;

      for (const [key, value] of cachedResponse.headers.entries()) {
        res.headers.set(key, value);
      }

      const body = await cachedResponse.text();

      res.send(body);
    } else {
      res.status = 404;
      res.send('Not found in cache.');
    }

    res.end();
  });
}
