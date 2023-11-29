import React from 'react';
import { PartialDatabase, Referrer, Settings, Property } from 'shared/types';
import { PageShell } from 'components/pages/PageShell';
import { AddDatabaseForm } from 'components/forms/AddDatabaseForm';
import { DatabaseActionsFlyoutMenu } from 'components/menus/DatabaseActionsFlyoutMenu';
import { DeleteDatabaseModalDialog } from 'components/dialogs/DeleteDatabaseModalDialog';
import {
  CellElement,
  ColumnHeaderElement,
  GridElement,
  RowElement,
  RowGroupElement,
} from 'components/elements/GridElement';
import { TableView } from './TableView';
import { ViewContainerElement } from 'components/elements/ViewContainerElement';
import { HyperLinkElement } from 'components/elements/HyperLinkElement';
import { ButtonElement } from 'components/elements/ButtonElement';
import { Icon } from 'components/icons/Icon';

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
          <HyperLinkElement href="/settings">Settings</HyperLinkElement>
        </nav>
        <main>
          <h1>ListLeap</h1>
          <ViewContainerElement>
            <aside aria-label="Actions">
              <details>
                <summary className="summary button--full-width">
                  <Icon
                    name="arrow-down"
                    height={16}
                    width={16}
                  />
                  Actions
                </summary>
                <form
                  role="none"
                  method="POST"
                  action="/databases"
                  id="select-multiple-rows-form"
                >
                  <input
                    type="hidden"
                    name="_method"
                    value="POST"
                  />
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <select
                      name="bulkAction"
                      className="button--full-width"
                    >
                      <option value="DELETE">Delete Selected Rows</option>
                    </select>
                    <ButtonElement>Submit</ButtonElement>
                  </div>
                </form>
              </details>
            </aside>
            <TableView
              databases={props.databases}
              referrer={props.referrer}
            />
            <AddDatabaseForm />
          </ViewContainerElement>
        </main>
      </div>
    </PageShell>
  );
}
