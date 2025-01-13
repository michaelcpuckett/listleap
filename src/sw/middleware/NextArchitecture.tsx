import { ExpressWorker } from '@express-worker/app';
import { handleInstall } from '../install';
import use404Handler from './404Handler';
import useAppRouter from './AppRouter';
import useMiddleware from './Middleware';
import useStaticFiles from './StaticFiles';

export default function useNextArchitecture(self: ServiceWorkerGlobalScope) {
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

  // Catch-all 404 handler.
  use404Handler(app);

  return app;
}
