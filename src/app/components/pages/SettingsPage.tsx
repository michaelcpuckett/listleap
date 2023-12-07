import React from 'react';
import { Settings, Referrer } from 'shared/types';
import { PageShell } from './PageShell';
import { EditSettingsForm } from 'components/forms/EditSettingsForm';

export function SettingsPage(
  props: React.PropsWithChildren<{
    settings: Settings;
    version: number;
  }>,
) {
  return (
    <PageShell
      version={props.version}
      pageTitle="Settings"
      settings={props.settings}
    >
      <div className="container">
        <nav>
          <a href="/">Home</a>
        </nav>
        <main>
          <h1>Settings</h1>
          <EditSettingsForm settings={props.settings} />
        </main>
      </div>
    </PageShell>
  );
}
