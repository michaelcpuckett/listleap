import URLS_TO_CACHE from '@express-worker/next/static.json';
import React from 'react';

export function PageShell(
  props: React.PropsWithChildren<{
    title?: string;
    description?: string;
    initialData?: Record<string, unknown>;
  }>,
) {
  const cssUrls = URLS_TO_CACHE.filter((url) => url.endsWith('.css'));

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta
          http-equiv="Cache-Control"
          content="no-store"
        />
        {props.title && <title>{props.title}</title>}
        {props.description && (
          <meta
            name="description"
            content={props.description}
          />
        )}
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1"
        />
        {cssUrls.map((url) => (
          <link
            rel="stylesheet"
            href={url}
          />
        ))}
        <link
          rel="manifest"
          href="/manifest.json"
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `window.__INITIAL_DATA__ = ${JSON.stringify(
              props.initialData,
            )}`,
          }}
        />
        <script src="/client.js"></script>
      </head>
      <body>{props.children}</body>
    </html>
  );
}
