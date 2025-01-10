import {
  ExpressWorkerRequest,
  ExpressWorkerResponse,
} from '@express-worker/app';
import { fetchCacheVersion } from 'utilities/fetchCacheVersion';

export async function GetStaticFile(
  req: ExpressWorkerRequest,
  res: ExpressWorkerResponse,
) {
  await fetchCacheVersion().then(async ([cacheVersion]) => {
    const cache = await caches.open(`v${cacheVersion}`);
    const cachedResponse = await cache.match(new URL(req.url).pathname);

    if (cachedResponse) {
      res.status(cachedResponse.status);

      for (const [key, value] of cachedResponse.headers.entries()) {
        res.set(key, value);
      }

      const body = await cachedResponse.text();

      res.send(body);
    } else {
      res.status(404).text('Not found in cache.').end();
    }

    res.end();
  });
}
