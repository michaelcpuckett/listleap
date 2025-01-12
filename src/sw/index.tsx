declare var self: ServiceWorkerGlobalScope;

import {
  ExpressWorker,
  ExpressWorkerRequest,
  ExpressWorkerResponse,
} from '@express-worker/app';
import { PageShell } from 'components/PageShell';
import URLS_TO_CACHE from 'dist/static.json';
import { renderToString } from 'react-dom/server';
import { handleInstall } from './install';
import { FormDataMiddleware } from './middleware/FormDataMiddleware';
import { QueryParamsMiddleware } from './middleware/QueryParamsMiddleware';
import Routes from './routes';

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

// useStaticFiles(app);
for (const url of URLS_TO_CACHE) {
  app.get(
    url,
    async (req: ExpressWorkerRequest, res: ExpressWorkerResponse) => {
      const cache = await caches.open('v1');
      const cachedResponse = await cache.match(new URL(req.url).pathname);

      if (cachedResponse) {
        res.status(cachedResponse.status);

        for (const [key, value] of cachedResponse.headers.entries()) {
          res.set(key, value);
        }

        const body = await cachedResponse.text();

        res.send(body);
      } else {
        res.status(404).send('Not found in cache.');
      }
    },
  );
}

// Dynamically-generated HTML routes.

// useAppRouter(app);
for (const [path, { Component, getInitialProps, metadata }] of Object.entries(
  Routes,
)) {
  app.get(
    path,
    async (req: ExpressWorkerRequest, res: ExpressWorkerResponse) => {
      const initialProps = await getInitialProps(req.params);

      const renderResult = renderToString(
        <PageShell
          {...metadata}
          initialData={initialProps}
        >
          <Component {...initialProps} />
        </PageShell>,
      );

      res.send(renderResult);
    },
  );
}

app.get('*', async (req: ExpressWorkerRequest, res: ExpressWorkerResponse) => {
  res.status(404).send('Not found.');
});

// app.get('/notes/:id', Endpoints.GetNote);

// RESTful API endpoints.
