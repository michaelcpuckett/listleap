import {
  ExpressWorkerRequest,
  ExpressWorkerResponse,
} from '@express-worker/app';
import { URLS_TO_CACHE } from '../utilities/urlsToCache';
import { fetchCacheVersion } from 'utilities/fetchCacheVersion';
import { applyMiddleware } from '.';

export async function GetStaticFile(
  req: ExpressWorkerRequest,
  res: ExpressWorkerResponse,
) {
  if (req.method === 'GET') {
    const url = new URL(req.url);
    const pathname = url.pathname;

    if (URLS_TO_CACHE.includes(pathname)) {
      await fetchCacheVersion().then(async ([cacheVersion]) => {
        const cache = await caches.open(`v${cacheVersion}`);
        const cachedResponse = await cache.match(pathname);

        if (cachedResponse) {
          res.body = await cachedResponse.text();
          res.status = cachedResponse.status;
          for (const [key, value] of cachedResponse.headers.entries()) {
            res.headers.set(key, value);
          }
        } else {
          res.body = `Not found in cache.`;
          res.status = 404;
        }

        res.end();
      });
    }
  }
}
