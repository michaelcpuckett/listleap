import React from 'react';
import { PartialDatabase, Referrer, Settings, Property } from 'shared/types';
import { PageShell } from 'components/pages/PageShell';
import { AddDatabaseForm } from 'components/forms/AddDatabaseForm';
import { DatabaseActionsFlyoutMenu } from 'components/menus/DatabaseActionsFlyoutMenu';
import { DeleteDatabaseModalDialog } from 'components/dialogs/DeleteDatabaseModalDialog';
import {
  CellElement,
  ColumnHeaderElement,
  RowElement,
  RowGroupElement,
} from 'components/views/TableView';
import { ViewContainerElement } from 'components/elements/ViewContainerElement';

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
          <ViewContainerElement>
            <div className="view-scroll-container">
              <div
                role="grid"
                aria-rowcount={props.databases.length}
                className="view view--table"
                style={{
                  '--grid-columns': gridColumnsCss,
                }}
              >
                <RowGroupElement>
                  <RowElement>
                    <ColumnHeaderElement>Database</ColumnHeaderElement>
                    <ColumnHeaderElement>Actions</ColumnHeaderElement>
                  </RowElement>
                </RowGroupElement>
                <RowGroupElement>
                  {props.databases.map((database) => (
                    <RowElement key={database.id}>
                      <CellElement role="rowheader">
                        <a href={`/databases/${database.id}`}>
                          {database.name}
                        </a>
                      </CellElement>
                      <CellElement>
                        <DatabaseActionsFlyoutMenu
                          database={database}
                          referrer={props.referrer}
                        />
                      </CellElement>
                    </RowElement>
                  ))}
                </RowGroupElement>
              </div>
            </div>
          </ViewContainerElement>
          <AddDatabaseForm />
        </main>
      </div>
    </PageShell>
  );
}
