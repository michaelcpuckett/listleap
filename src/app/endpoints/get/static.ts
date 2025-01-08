import {
  ExpressWorkerRequest,
  ExpressWorkerResponse,
} from '@express-worker/app';

export async function GetStaticFile(
  req: ExpressWorkerRequest,
  res: ExpressWorkerResponse,
) {
  const cache = await caches.open('v1');
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
}
