import {
  ExpressWorkerHandler,
  ExpressWorkerRequest,
} from '@express-worker/app';

export const QueryParamsMiddleware: ExpressWorkerHandler = async function (
  req,
) {
  const url = new URL(req.url);
  const query = Object.fromEntries(Array.from(url.searchParams.entries()));

  (req as ExpressWorkerRequest & { query: Record<string, string> }).query =
    query;
};
