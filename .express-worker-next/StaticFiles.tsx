import {
  ExpressWorker,
  ExpressWorkerRequest,
  ExpressWorkerResponse,
} from '@express-worker/app';

export default function useStaticFiles(app: ExpressWorker) {
  app.get(
    '*',
    async (req: ExpressWorkerRequest, res: ExpressWorkerResponse) => {
      console.log(req.url);
      const cachedResponse =
        (await (await caches.open('v1')).match(req.url)) ||
        (await (await caches.open('uploads')).match(req.url));

      if (cachedResponse) {
        res.wrap(cachedResponse);
      } else {
        res.status(404).send('Not found in cache.');
      }
    },
  );
}
