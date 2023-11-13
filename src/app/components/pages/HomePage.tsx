import React from 'react';
import { PartialDatabase, Referrer, Settings, Property } from 'shared/types';
import { PageShell } from 'components/pages/PageShell';
import { AddDatabaseForm } from 'components/forms/AddDatabaseForm';

export function HomePage(props: React.PropsWithChildren<{
  databases: PartialDatabase[];
  settings: Settings;
  referrer: Referrer;
}>) {
  return (
    <PageShell pageTitle="Home" settings={props.settings}>
      <div className="container">
        <nav>
          <a href="/settings">Settings</a>
        </nav>
        <main>
          <h1>
            Home
          </h1>
          <ul>
            {props.databases.map((database) => (
              <li key={database.id}>
                <a href={`/databases/${database.id}`}>
                  {database.name}
                </a>
              </li>
            ))}
          </ul>
          <AddDatabaseForm />
        </main>
      </div>
    </PageShell>
  );
}
