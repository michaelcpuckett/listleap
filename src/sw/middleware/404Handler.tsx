import {
  ExpressWorker,
  ExpressWorkerRequest,
  ExpressWorkerResponse,
} from '@express-worker/app';

export default function use404Handler(app: ExpressWorker) {
  app.get(
    '*',
    async (req: ExpressWorkerRequest, res: ExpressWorkerResponse) => {
      res.status(404).send('Not found.');
    },
  );
}
