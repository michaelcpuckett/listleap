import { DeleteDatabaseModalDialog } from 'components/dialogs/DeleteDatabaseModalDialog';
import { ButtonElement } from 'components/elements/ButtonElement';
import { DisclosureWidgetElement } from 'components/elements/DisclosureWidgetElement';
import { HyperLinkElement } from 'components/elements/HyperLinkElement';
import { ViewContainerElement } from 'components/elements/ViewContainerElement';
import { AddDatabaseForm } from 'components/forms/AddDatabaseForm';
import { Icon } from 'components/icons/Icon';
import { PageShell } from 'components/pages/PageShell';
import React from 'react';
import { PartialDatabase, Settings } from 'shared/types';
import { TableView } from './TableView';

export function HomePage(
  props: React.PropsWithChildren<{
    databases: PartialDatabase[];
    settings: Settings;
    version: number;
    query: Record<string, string>;
    url: string;
  }>,
) {
  const database = props.databases.find(
    (database) => database.id === props.query.id,
  );
  const hasError = !!props.query.error;
  const isDeletingDatabase =
    !hasError && props.query.mode === 'DELETE_DATABASE' && !!database;
  const isShowingModal = hasError || isDeletingDatabase;
  const closeUrlPathname = `/`;
  const closeUrl = new URL(props.url);
  const closeUrlSearchParams = new URLSearchParams(closeUrl.search);
  closeUrlSearchParams.delete('mode');
  closeUrlSearchParams.delete('error');
  closeUrl.pathname = closeUrlPathname;
  closeUrl.search = closeUrlSearchParams.toString();
  const closeUrlHref = closeUrl.href.replace(closeUrl.origin, '');

  return (
    <PageShell
      version={props.version}
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
        <main>
          <p>
            <HyperLinkElement href="https://github.com/michaelcpuckett/listleap">
              Fork me on Github!
            </HyperLinkElement>
          </p>
          <h1>ListLeap</h1>
          <h2>A data management tool.</h2>
          <ViewContainerElement>
            <aside aria-label="Actions">
              <DisclosureWidgetElement>
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
                  <div style={{ display: 'flex' }}>
                    <select
                      name="bulkAction"
                      className="button--full-width"
                    >
                      <option value="DELETE">Delete Selected Rows</option>
                    </select>
                    <ButtonElement>Submit</ButtonElement>
                  </div>
                </form>
              </DisclosureWidgetElement>
            </aside>
            <TableView
              databases={props.databases}
              query={props.query}
              url={props.url}
            />
            <AddDatabaseForm />
          </ViewContainerElement>
        </main>
      </div>
    </PageShell>
  );
}
