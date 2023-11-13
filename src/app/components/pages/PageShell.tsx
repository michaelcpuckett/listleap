import React from "react";
import { Settings } from "shared/types";

export function PageShell(props: React.PropsWithChildren<{ pageTitle: string; settings: Settings }>) {
  return (
    <html lang="en" className={`theme--${props.settings.theme || 'dark'}`}>
      <head>
        <title>{props.pageTitle}</title>
        <script src="/bfcache.js"></script>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="stylesheet" href="/style.css" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body>
        {props.children}
        <unload-handler></unload-handler>
        <script src="/client.js"></script>
      </body>
    </html>
  );
}