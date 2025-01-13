declare var self: ServiceWorkerGlobalScope;

import { ExpressWorker } from '@express-worker/app';
import useAppRouter from './AppRouter';
import { handleInstall } from './install';
import useMiddleware from './Middleware';
import useStaticFiles from './StaticFiles';

export default function useNextArchitecture() {
  // Populates the cache on install.
  self.addEventListener('install', handleInstall);

  // Immediately takes control of the page on activation.
  self.addEventListener('activate', () => {
    self.clients.claim();
  });

  const app = new ExpressWorker();

  // Apply `.data` and `.query` to the request object.
  useMiddleware(app);

  // Serve HTML pages via the App Router.
  useAppRouter(app);

  // Serve static files.
  useStaticFiles(app);

  return app;
}
