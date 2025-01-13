declare var self: ServiceWorkerGlobalScope;

import { ExpressWorker } from '@express-worker/app';
import use404Handler from 'middleware/404Handler';
import useAppRouter from 'middleware/AppRouter';
import useMiddleware from 'middleware/Middleware';
import useStaticFiles from 'middleware/StaticFiles';
import { handleInstall } from './install';

// Populates the cache on install.
self.addEventListener('install', handleInstall);

// Immediately takes control of the page on activation.
self.addEventListener('activate', () => {
  self.clients.claim();
});

// The ExpressWorker instance handles all requests.
const app = new ExpressWorker();

// Apply `.data` and `.query` to the request object.
useMiddleware(app);

// Serve HTML pages via the App Router.
useAppRouter(app);

// Serve static files.
useStaticFiles(app);

// Catch-all 404 handler.
use404Handler(app);
