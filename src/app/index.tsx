import { Referrer } from "shared/types";
import { pathToRegexp } from "path-to-regexp";
import { URLS_TO_CACHE } from "utilities/urlsToCache";

import { GetIndex } from "endpoints/get/index";
import { GetDatabaseRows } from "endpoints/get/databases/rows";
import { GetDatabaseRow } from "endpoints/get/databases/row";
import { GetDatabaseProperties } from "endpoints/get/databases/properties";
import { PostDatabase } from "endpoints/post/databases/index";
import { PatchDatabase } from "endpoints/patch/databases/index";
import { PostDatabaseRows } from "endpoints/post/databases/rows";
import { DeleteDatabaseRow } from "endpoints/delete/databases/row";
import { PatchDatabaseRow } from "endpoints/patch/databases/row";
import { PutDatabaseRow } from "endpoints/put/databases/row";
import { PostDatabaseProperties } from "endpoints/post/databases/properties";

self.addEventListener("install", function (event: Event) {
  if (!(event instanceof ExtendableEvent)) {
    return;
  }

  event.waitUntil(
    caches
      .open("v1")
      .then(function (cache) {
        return cache.addAll(URLS_TO_CACHE);
      })
      .catch(function (error) {
        console.error(error);
      })
  );
});

self.addEventListener("fetch", function (event: Event) {
  if (!(event instanceof FetchEvent)) {
    return;
  }
  
  const url = new URL(event.request.url);
  const pathname = url.pathname;
  const id = url.searchParams.get('id') ?? '';
  const index = Number(url.searchParams.get('index') ?? -1);
  const mode = url.searchParams.get('mode') || '';
  const filter = url.searchParams.get('filter') || '';
  const query = url.searchParams.get('query') || '';
  const referrer: Referrer = {
    filter,
    query,
    mode,
    index,
    id,
    url: event.request.url,
  };

  const matchesHome = pathToRegexp("/").exec(pathname);
  const matchesDatabases = pathToRegexp("/databases").exec(pathname);
  const matchesDatabase = pathToRegexp("/databases/:id").exec(pathname);
  const matchesDatabaseRows = pathToRegexp("/databases/:databaseId/rows").exec(pathname);
  const matchesDatabaseRow = pathToRegexp("/databases/:databaseId/rows/:id").exec(pathname);
  const matchesDatabaseProperties = pathToRegexp("/databases/:databaseId/properties").exec(pathname);

  if (event.request.method === "GET") {
    return event.respondWith(
      (async () => {
        if (URLS_TO_CACHE.includes(pathname)) {
          const cache = await caches.open("v1");
          const cachedResponse = await cache.match(event.request);

          if (cachedResponse) {
            return cachedResponse;
          }
        }

        switch (true) {
          case !!matchesHome: {
            return await GetIndex(event, matchesHome, referrer);
          }
          case !!matchesDatabase: {
            return await GetDatabaseRows(event, matchesDatabase, referrer);
          }
          case !!matchesDatabaseRow: {
            return await GetDatabaseRow(event, matchesDatabaseRow, referrer);
          }
          case !!matchesDatabaseProperties: {
            return await GetDatabaseProperties(event, matchesDatabaseProperties, referrer);
          }
        }

        return new Response("Not found", {
          status: 404,
        });
      })()
    );
  }
  
  return event.respondWith((async () => {
    const rawFormData = await event.request.formData();
    const formData = Object.fromEntries(Array.from(rawFormData.entries()).map(([key, value]) => [key, value.toString()]));
    
    switch (true) {
      case !!matchesDatabases: {
        switch (formData._method) {
          case 'POST': {
            return PostDatabase(event, matchesDatabases, formData, referrer);
          }
        }
      }
      case !!matchesDatabase: {
        switch (formData._method) {
          case 'PATCH': {
            return PatchDatabase(event, matchesDatabases, formData, referrer);
          }
        }
      }
      case !!matchesDatabaseRows: {
        switch (formData._method) {
          case 'POST': {
            return PostDatabaseRows(event, matchesDatabase, formData, referrer);
          }
        }
      }
      case !!matchesDatabaseRow: {
        switch (formData._method) {
          case 'DELETE': {
            return DeleteDatabaseRow(event, matchesDatabaseRow, formData, referrer);
          }
          case 'PATCH': {
            return PatchDatabaseRow(event, matchesDatabaseRow, formData, referrer);
          }
          case 'PUT': {
            return PutDatabaseRow(event, matchesDatabaseRow, formData, referrer);
          }
        }
      }
      case !!matchesDatabaseProperties: {
        switch (formData._method) {
          case 'POST': {
            return PostDatabaseProperties(event, matchesDatabaseProperties, formData, referrer);
          }
        }
      }
    }

    return new Response("Not found", {
      status: 404,
    });
  })());
});

declare module "react" {
  interface HTMLAttributes<T>
    extends React.AriaAttributes,
      React.DOMAttributes<T> {
    shadowrootmode?: string;
    shadowrootdelegatesfocus?: boolean;
    inert?: string;
  }

  interface CSSProperties {
    [key: `--${string}`]: string | number;
  }
}

type CustomElement = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLElement>,
  HTMLElement
>;

declare global {
  namespace JSX {
    interface IntrinsicElements {
      "auto-save-text": CustomElement;
      "auto-save-checkbox": CustomElement;
      "flyout-menu": CustomElement;
      "unload-handler": CustomElement;
      "post-form": CustomElement;
    }
  }
}