declare var self: ServiceWorkerGlobalScope;

import { ExpressWorker } from '@express-worker/app';
import useAppRouter from '@express-worker/next/AppRouter';
import { FormDataMiddleware } from '@express-worker/next/FormDataMiddleware';
import { handleInstall } from '@express-worker/next/install';
import { QueryParamsMiddleware } from '@express-worker/next/QueryParamsMiddleware';
import useStaticFiles from '@express-worker/next/StaticFiles';

export default (function useNextArchitecture() {
  // Populates the cache on install.
  self.addEventListener('install', handleInstall);

  // Immediately takes control of the page on activation.
  self.addEventListener('activate', () => {
    self.clients.claim();
  });

  const app = new ExpressWorker();

  // Parses query params as `req.query`.
  app.use(QueryParamsMiddleware);

  // Parses form data as `req.data`.
  app.use(FormDataMiddleware);

  // Serve HTML pages via the App Router.
  useAppRouter(app);

  // Serve static files.
  useStaticFiles(app);

  return app;
})();
