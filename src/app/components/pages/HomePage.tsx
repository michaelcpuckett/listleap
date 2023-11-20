import React from 'react';
import { PartialDatabase, Referrer, Settings, Property } from 'shared/types';
import { PageShell } from 'components/pages/PageShell';
import { AddDatabaseForm } from 'components/forms/AddDatabaseForm';
import { DatabaseActionsFlyoutMenu } from 'components/menus/DatabaseActionsFlyoutMenu';
import { DeleteDatabaseModalDialog } from 'components/dialogs/DeleteDatabaseModalDialog';

export function HomePage(
  props: React.PropsWithChildren<{
    databases: PartialDatabase[];
    settings: Settings;
    referrer: Referrer;
  }>,
) {
  const database = props.databases.find(
    (database) => database.id === props.referrer.id,
  );
  const hasError = !!props.referrer.error;
  const isDeletingDatabase =
    !hasError && props.referrer.mode === 'DELETE_DATABASE' && !!database;
  const isShowingModal = hasError || isDeletingDatabase;
  const closeUrlPathname = `/`;
  const closeUrl = new URL(props.referrer.url);
  const closeUrlSearchParams = new URLSearchParams(closeUrl.search);
  closeUrlSearchParams.delete('mode');
  closeUrlSearchParams.delete('error');
  closeUrl.pathname = closeUrlPathname;
  closeUrl.search = closeUrlSearchParams.toString();
  const closeUrlHref = closeUrl.href.replace(closeUrl.origin, '');

  const gridColumnsCss = `minmax(0, 1fr) auto`;

  return (
    <PageShell
      pageTitle="Home"
      settings={props.settings}
    >
      {isDeletingDatabase ? (
        <DeleteDatabaseModalDialog
          database={database}
          closeUrl={closeUrlHref}
        />
      ) : null}
      <div
        className="container"
        inert={isShowingModal ? '' : undefined}
      >
        <nav className="layout--split">
          <a href="/settings">Settings</a>
        </nav>
        <main>
          <h1>ListLeap</h1>
          <div
            role="grid"
            className="view"
            style={{
              '--grid-columns': gridColumnsCss,
            }}
          >
            <div role="rowgroup">
              <div role="row">
                <div role="columnheader">Database</div>
                <div role="columnheader">Actions</div>
              </div>
            </div>
            <div role="rowgroup">
              {props.databases.map((database) => (
                <div
                  role="row"
                  key={database.id}
                >
                  <div role="columnheader">
                    <a href={`/databases/${database.id}`}>{database.name}</a>
                  </div>
                  <div role="gridcell">
                    <DatabaseActionsFlyoutMenu
                      database={database}
                      referrer={props.referrer}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <AddDatabaseForm />
        </main>
      </div>
    </PageShell>
  );
}
