declare var self: ServiceWorkerGlobalScope;

import {
  ExpressWorker,
  ExpressWorkerRequest,
  ExpressWorkerResponse,
} from '@express-worker/app';
import URLS_TO_CACHE from 'dist/static.json';
import { renderToString } from 'react-dom/server';
import { PageShell } from '../components/PageShell';
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

for (const url of URLS_TO_CACHE) {
  app.get(
    url,
    async (req: ExpressWorkerRequest, res: ExpressWorkerResponse) => {
      const cache = await caches.open('v1');
      const cachedResponse = await cache.match(url);

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

function convertPath(path: string) {
  return path.replace(/\[([^\]]+)\]/g, ':$1');
}

for (const [path, { Component, getInitialProps, metadata }] of Object.entries<{
  Component: React.ComponentType<any>;
  getInitialProps: (
    params: Record<string, string>,
  ) => Promise<Record<string, any>>;
  metadata: {
    title: string;
    description?: string;
  };
}>(Routes)) {
  console.log(path, convertPath(path));
  app.get(
    convertPath(path),
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
  console.log(req.body);
  res.status(404).send('Not found.');
});
