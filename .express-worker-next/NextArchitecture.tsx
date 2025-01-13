declare var self: ServiceWorkerGlobalScope;

import { ExpressWorker } from '@express-worker/app';
import useAppRouter from './AppRouter';
import { FormDataMiddleware } from './FormDataMiddleware';
import { handleInstall } from './install';
import { QueryParamsMiddleware } from './QueryParamsMiddleware';
import useStaticFiles from './StaticFiles';

export default function useNextArchitecture() {
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
}
