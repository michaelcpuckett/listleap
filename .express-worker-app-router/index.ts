declare var self: ServiceWorkerGlobalScope;

import { ExpressWorker } from '@express-worker/app';
import { FormDataMiddleware } from '@express-worker/app-router/FormDataMiddleware';
import { handleInstall } from '@express-worker/app-router/install';
import { QueryParamsMiddleware } from '@express-worker/app-router/QueryParamsMiddleware';
import useRouter from '@express-worker/app-router/Router';
import useStaticFiles from '@express-worker/app-router/StaticFiles';

export default (function useAppRouterArchitecture() {
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
  useRouter(app);

  // Serve static files.
  useStaticFiles(app);

  return app;
})();
