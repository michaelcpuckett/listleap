import {
  ExpressWorkerHandler,
  ExpressWorkerRequest,
} from '@express-worker/app';
import { Referrer } from 'shared/types';

export const QueryParamsMiddleware: ExpressWorkerHandler = async function (
  req,
) {
  const url = new URL(req.url);
  const id = url.searchParams.get('id') ?? '';
  const index = Number(url.searchParams.get('index') ?? -1);
  const mode = url.searchParams.get('mode') || '';
  const filter = url.searchParams.get('filter') || '';
  const query = url.searchParams.get('query') || '';
  const error = url.searchParams.get('error') || '';
  const autofocus = url.searchParams.get('autofocus') || '';
  const referrer: Referrer = {
    version: 0,
    filter,
    query,
    mode,
    index,
    error,
    autofocus,
    id,
    url: req.url,
  };

  (req as ExpressWorkerRequest & { query: Referrer }).query = referrer;
};
