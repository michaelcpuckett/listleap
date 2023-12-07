import {
  ExpressWorkerHandler,
  ExpressWorkerRequest,
} from '@express-worker/app';
import { fetchCacheVersion } from 'utilities/fetchCacheVersion';

export const VersionMiddleware: ExpressWorkerHandler = async function (
  req,
  res,
) {
  const [version, hasNewVersion] = await fetchCacheVersion();

  if (hasNewVersion) {
    res.status = 200;
    res.send(`<meta http-equiv="refresh" content="0">`);
    return;
  }

  (req as ExpressWorkerRequest & { version: number }).version = version;
};
