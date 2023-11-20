import { Symbols } from 'components/icons/Symbols';
import React from 'react';
import { Settings } from 'shared/types';
import { URLS_TO_CACHE } from 'utilities/urlsToCache';

export function PageShell(
  props: React.PropsWithChildren<{ pageTitle: string; settings: Settings }>,
) {
  const cssUrls = URLS_TO_CACHE.filter((url) => url.endsWith('.css'));

  return (
    <html
      lang="en"
      className={`theme--${props.settings.theme || 'dark'}`}
    >
      <head>
        <meta charSet="utf-8" />
        <title>{props.pageTitle}</title>
        <meta
          name="theme-color"
          content={props.settings.theme === 'light' ? '#ffffff' : '#000000'}
        />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1"
        />
        <script src="/bfcache.js"></script>
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
      </head>
      <body>
        <Symbols />
        {props.children}
        <unload-handler></unload-handler>
        <script src="/client.js"></script>
      </body>
    </html>
  );
}
