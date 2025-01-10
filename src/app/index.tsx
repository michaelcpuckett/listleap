declare var self: ServiceWorkerGlobalScope;

import { ExpressWorker } from '@express-worker/app';
import { URLS_TO_CACHE } from 'config/urlsToCache';
import * as Endpoints from 'endpoints/index';
import { handleInstall } from './install';
import { FormDataMiddleware } from './middleware/FormDataMiddleware';
import { QueryParamsMiddleware } from './middleware/QueryParamsMiddleware';

// Populates the cache on install.
self.addEventListener('install', handleInstall);

// Immediately takes control of the page on activation.
self.addEventListener('activate', () => {
  self.clients.claim();
});

// Creates a new ExpressWorker instance, which handles all requests.
const app = new ExpressWorker();

// Parses query params as `req.query`.
app.use(QueryParamsMiddleware);

// Parses form data as `req.data`.
app.use(FormDataMiddleware);

// Static files get served from cache.

for (const url of URLS_TO_CACHE) {
  app.get(url, Endpoints.GetStaticFile);
}

// Dynamically-generated HTML routes.

app.get('/', Endpoints.GetHome);
app.get('/notes/:id', Endpoints.GetNote);

// RESTful API endpoints.

app.delete('/notes/:id', Endpoints.DeleteNote);
