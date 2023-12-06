import { handleInstall } from './install';
import { URLS_TO_CACHE } from 'utilities/urlsToCache';
import { ExpressWorker } from '@express-worker/app';
import { GetStaticFile } from './middleware/CacheMiddleware';
import { FormDataMiddleware } from './middleware/FormDataMiddleware';
import { ReferrerMiddleware } from './middleware/ReferrerMiddleware';
import { applyMiddleware } from './middleware';
import * as Endpoints from 'endpoints/index';

self.addEventListener('install', handleInstall);

const app = new ExpressWorker({
  debug: true,
});

for (const url of URLS_TO_CACHE) {
  app.get(url, GetStaticFile);
}

app.use(FormDataMiddleware);
app.use(ReferrerMiddleware);

// GET

app.get('/', applyMiddleware(Endpoints.GetHome));
app.get('/settings', applyMiddleware(Endpoints.GetSettings));
app.get('/databases/:databaseId', applyMiddleware(Endpoints.GetDatabaseRows));
app.get(
  '/databases/:databaseId/rows/:id',
  applyMiddleware(Endpoints.GetDatabaseRow),
);
app.get(
  '/databases/:databaseId/properties/:id',
  applyMiddleware(Endpoints.GetDatabaseProperty),
);

// POST

app.post('/databases', applyMiddleware(Endpoints.PostDatabase));
app.post(
  '/databases/:databaseId/rows',
  applyMiddleware(Endpoints.PostDatabaseRows),
);
app.post(
  '/databases/:databaseId/properties',
  applyMiddleware(Endpoints.PostDatabaseProperties),
);

// DELETE

app.post('/databases/:databaseId', applyMiddleware(Endpoints.DeleteDatabase));
app.post(
  '/databases/:databaseId/rows/:id',
  applyMiddleware(Endpoints.DeleteDatabaseRow),
);
app.post(
  '/databases/:databaseId/properties/:id',
  applyMiddleware(Endpoints.DeleteDatabaseProperty),
);

// PUT

app.post(
  '/databases/:databaseId/rows/:id',
  applyMiddleware(Endpoints.PutDatabaseRow),
);
app.post(
  '/databases/:databaseId/properties/:id',
  applyMiddleware(Endpoints.PutDatabaseProperty),
);

// PATCH

app.post('/settings', applyMiddleware(Endpoints.PatchSettings));
app.post('/databases/:databaseId', applyMiddleware(Endpoints.PatchDatabase));
app.post(
  '/databases/:databaseId/rows/:id',
  applyMiddleware(Endpoints.PatchDatabaseRow),
);
app.post(
  '/databases/:databaseId/properties/:id',
  applyMiddleware(Endpoints.PatchDatabaseProperty),
);
