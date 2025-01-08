import { PageShell } from 'components/pages/PageShell';
import React from 'react';

export function HomePage(
  props: React.PropsWithChildren<{
    version: number;
    query: Record<string, string>;
    url: string;
  }>,
) {
  return (
    <PageShell
      version={props.version}
      pageTitle="Home"
    >
      <main>
        <h1>Hello world!</h1>
      </main>
    </PageShell>
  );
}
