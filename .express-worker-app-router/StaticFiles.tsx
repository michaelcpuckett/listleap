import {
  ExpressWorker,
  ExpressWorkerRequest,
  ExpressWorkerResponse,
} from '@express-worker/app';

export default function useStaticFiles(app: ExpressWorker) {
  app.get(
    '*',
    async (req: ExpressWorkerRequest, res: ExpressWorkerResponse) => {
      const cachedResponse = await Promise.all(
        (await caches.keys()).map(async (cacheName) => {
          return await (await caches.open(cacheName)).match(req.url);
        }),
      ).then((responses) => responses.find((response) => response));

      if (cachedResponse) {
        res.wrap(cachedResponse);
      } else {
        res.status(404).send('Not found.');
      }
    },
  );
}
