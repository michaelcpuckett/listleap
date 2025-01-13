import { ExpressWorker } from '@express-worker/app';
import { FormDataMiddleware } from './FormDataMiddleware';
import { QueryParamsMiddleware } from './QueryParamsMiddleware';

export default function useMiddleware(app: ExpressWorker) {
  // Parses query params as `req.query`.
  app.use(QueryParamsMiddleware);

  // Parses form data as `req.data`.
  app.use(FormDataMiddleware);
}
