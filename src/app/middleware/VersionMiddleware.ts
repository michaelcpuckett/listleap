import {
  ExpressWorkerHandler,
  ExpressWorkerRequest,
} from '@express-worker/app';
import { fetchCacheVersion } from 'utilities/fetchCacheVersion';

export const VersionMiddleware: ExpressWorkerHandler = async function (
  req,
  res,
) {
  const [version] = await fetchCacheVersion();

  (req as ExpressWorkerRequest & { version: number }).version = version;
};
