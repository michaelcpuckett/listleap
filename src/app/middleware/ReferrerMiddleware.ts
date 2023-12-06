import {
  ExpressWorkerHandler,
  ExpressWorkerRequest,
} from '@express-worker/app';
import { Referrer } from 'shared/types';
import { fetchCacheVersion } from 'utilities/fetchCacheVersion';

export const ReferrerMiddleware: ExpressWorkerHandler = async function (
  req,
  res,
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

  const [version, hasNewVersion] = await fetchCacheVersion();

  if (hasNewVersion) {
    res.body = `<meta http-equiv="refresh" content="0">`;
    res.status = 200;
    res.headers.set('Content-Type', 'text/html');
    res.end();
    return;
  }

  referrer.version = version;

  (req as ExpressWorkerRequest & { ref: Referrer }).ref = referrer;
};
