declare var self: ServiceWorkerGlobalScope;

import {
  ExpressWorker,
  ExpressWorkerRequest,
  ExpressWorkerResponse,
} from '@express-worker/app';
import { PageShell } from 'app-router/PageShell';
import routesConfig from 'app-router/routes';
import staticFiles from 'app-router/static.json';
import { renderToString } from 'react-dom/server';

function convertPath(path: string) {
  return path.replace(/\[([^\]]+)\]/g, ':$1');
}

export default (function useAppRouterArchitecture() {
  // Populates the cache on install.
  self.addEventListener('install', function handleInstall(event: Event) {
    if (!(event instanceof ExtendableEvent)) {
      return;
    }

    self.skipWaiting();

    event.waitUntil(
      (async () => {
        const urlsToCache = staticFiles.map((url) => {
          return new Request(new URL(url, self.location.origin).href, {
            cache: 'no-cache',
            headers: {
              'Cache-Control': 'max-age=0, no-cache',
            },
          });
        });
        const cache = await caches.open(`v1`);
        await cache.addAll(urlsToCache);
      })(),
    );
  });

  // Immediately takes control of the page on activation.
  self.addEventListener('activate', () => {
    self.clients.claim();
  });

  const app = new ExpressWorker();

  // Serve static files.
  (function useStaticFiles() {
    app.get(
      '*',
      async (req: ExpressWorkerRequest, res: ExpressWorkerResponse) => {
        const cachedResponse = await Promise.all(
          (await caches.keys()).map(async (cacheName) => {
            return await (await caches.open(cacheName)).match(req.url);
          }),
        ).then((responses) => responses.find((response) => response));

        if (cachedResponse) {
          res.wrap(cachedResponse);
        } else {
          res.status(404).send('Not found.');
        }
      },
    );
  })();

  (function useAppRouter() {
    for (const [
      path,
      { Component, getStaticProps, metadata },
    ] of Object.entries<{
      Component: React.ComponentType<any>;
      getStaticProps?: (
        params: Record<string, string>,
      ) => Promise<Record<string, any>>;
      metadata?: {
        title: string;
        description?: string;
      };
    }>(routesConfig)) {
      app.get(convertPath(path), async (req, res) => {
        try {
          const initialProps = getStaticProps
            ? await getStaticProps(req.params)
            : {};

          const renderResult = renderToString(
            <PageShell
              {...(metadata || {})}
              initialData={initialProps}
            >
              <Component {...initialProps} />
            </PageShell>,
          );

          res.send(renderResult);
        } catch (error) {
          res.status(404).send('Not found');
        }
      });
    }
  })();

  return app;
})();
