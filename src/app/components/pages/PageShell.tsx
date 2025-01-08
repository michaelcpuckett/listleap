import { URLS_TO_CACHE } from 'config/urlsToCache';
import React from 'react';

export function PageShell(
  props: React.PropsWithChildren<{
    version: number;
    title: string;
    description?: string;
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
        <title>{props.title}</title>
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
            href={`${url}?v=${props.version}`}
          />
        ))}
        <link
          rel="manifest"
          href="/manifest.json"
        />
      </head>
      <body tabIndex={-1}>
        <div id="root">{props.children}</div>
        <script src={`/client.js?v=${props.version}`}></script>
      </body>
    </html>
  );
}
