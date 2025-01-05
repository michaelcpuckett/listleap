import { Symbols } from 'components/icons/Symbols';
import React from 'react';
import { Settings } from 'shared/types';
import { URLS_TO_CACHE } from 'utilities/urlsToCache';

export function PageShell(
  props: React.PropsWithChildren<{
    version: number;
    pageTitle: string;
    settings: Settings;
  }>,
) {
  const cssUrls = URLS_TO_CACHE.filter((url) => url.endsWith('.css'));

  return (
    <html
      lang="en"
      className={`theme--${props.settings.theme || 'dark'}`}
    >
      <head>
        <meta charSet="utf-8" />
        <meta
          http-equiv="Cache-Control"
          content="no-store"
        />
        <title>{props.pageTitle}</title>
        <meta
          name="theme-color"
          content="#ffffff"
        />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1"
        />
        <script src={`/head.js?v=${props.version}`}></script>
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
        <Symbols />
        {props.children}
        <unload-handler></unload-handler>
        <script src={`/client.js?v=${props.version}`}></script>
      </body>
    </html>
  );
}
