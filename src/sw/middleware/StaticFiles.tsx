import {
  ExpressWorker,
  ExpressWorkerRequest,
  ExpressWorkerResponse,
} from '@express-worker/app';
import URLS_TO_CACHE from 'dist/static.json';

export default function useStaticFiles(app: ExpressWorker) {
  for (const url of URLS_TO_CACHE) {
    app.get(
      url,
      async (req: ExpressWorkerRequest, res: ExpressWorkerResponse) => {
        const cache = await caches.open('v1');
        const cachedResponse = await cache.match(url);

        if (cachedResponse) {
          res.status(cachedResponse.status);

          for (const [key, value] of cachedResponse.headers.entries()) {
            res.set(key, value);
          }

          const body = await cachedResponse.text();

          res.send(body);
        } else {
          res.status(404).send('Not found in cache.');
        }
      },
    );
  }
}
