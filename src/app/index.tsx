import { ExpressWorker } from '@express-worker/app';
import * as Endpoints from 'endpoints/index';
import { handleInstall } from './install';
import { FormDataMiddleware } from './middleware/FormDataMiddleware';
import { VersionMiddleware } from './middleware/VersionMiddleware';
import { QueryParamsMiddleware } from './middleware/QueryParamsMiddleware';
import { URLS_TO_CACHE } from 'utilities/urlsToCache';

// Populates the cache on install.
self.addEventListener('install', handleInstall);

// Creates a new ExpressWorker instance, which handles all requests.
const app = new ExpressWorker();

// Fetches the current version as `req.version` for cache-busting.
app.use(VersionMiddleware);

// Parses query params as `req.query`.
app.use(QueryParamsMiddleware);

// Parses form data as `req.data`.
app.use(FormDataMiddleware);

// Static files are served from the cache.
for (const url of URLS_TO_CACHE) {
  app.get(url, Endpoints.GetStaticFile);
}

// GET Requests

app.get('/', Endpoints.GetHome);
app.get('/settings', Endpoints.GetSettings);
app.get('/databases/:databaseId', Endpoints.GetDatabaseRows);
app.get('/databases/:databaseId/rows/:id', Endpoints.GetDatabaseRow);
app.get('/databases/:databaseId/properties/:id', Endpoints.GetDatabaseProperty);

// POST Requests

app.post('/databases', Endpoints.PostDatabase);
app.post('/databases/:databaseId/rows', Endpoints.PostDatabaseRows);
app.post('/databases/:databaseId/properties', Endpoints.PostDatabaseProperties);

// DELETE Requests

app.post('/databases/:databaseId', Endpoints.DeleteDatabase);
app.post('/databases/:databaseId/rows/:id', Endpoints.DeleteDatabaseRow);
app.post(
  '/databases/:databaseId/properties/:id',
  Endpoints.DeleteDatabaseProperty,
);

// PUT Requests

app.post('/databases/:databaseId/rows/:id', Endpoints.PutDatabaseRow);
app.post(
  '/databases/:databaseId/properties/:id',
  Endpoints.PutDatabaseProperty,
);

// PATCH Requests

app.post('/settings', Endpoints.PatchSettings);
app.post('/databases/:databaseId', Endpoints.PatchDatabase);
app.post('/databases/:databaseId/rows/:id', Endpoints.PatchDatabaseRow);
app.post(
  '/databases/:databaseId/properties/:id',
  Endpoints.PatchDatabaseProperty,
);
