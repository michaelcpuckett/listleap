import React from 'react';
import {
  Referrer,
  Settings,
  Property,
  Database,
  AnyRow,
  AnyProperty,
} from 'shared/types';
import { guardIsTable } from 'shared/assertions';
import { PageShell } from 'components/pages/PageShell';
import { TableView } from 'components/views/TableView';
import { SearchRowsForm } from 'components/forms/SearchRowsForm';
import { EditDatabaseForm } from 'components/forms/EditDatabaseForm';
import { EditRowModalDialog } from 'components/dialogs/EditRowModalDialog';
import { DeleteRowModalDialog } from 'components/dialogs/DeleteRowModalDialog';
import { AddPropertyModalDialog } from 'components/dialogs/AddPropertyModalDialog';
import { EditPropertyModalDialog } from 'components/dialogs/EditPropertyModalDialog';
import { DeletePropertyModalDialog } from 'components/dialogs/DeletePropertyModalDialog';
import { ModalDialogElement } from 'components/elements/ModalDialogElement';
import { ERROR_MESSAGES } from 'utilities/errors';
import { PostFormElement } from 'components/elements/PostFormElement';
import { Icon } from 'components/icons/Icon';
import { ViewContainerElement } from 'components/elements/ViewContainerElement';

export function DatabasePage(
  props: React.PropsWithChildren<{
    database: Database<AnyProperty[]>;
    referrer: Referrer;
    settings: Settings;
  }>,
) {
  const row = props.database.rows.find((row) => row.id === props.referrer.id);
  const property = props.database.properties.find(
    (property) => property.id === props.referrer.id,
  );
  const hasError = !!props.referrer.error;
  const isEditingRow = !hasError && props.referrer.mode === 'EDIT_ROW' && !!row;
  const isDeletingRow =
    !hasError && props.referrer.mode === 'DELETE_ROW' && !!row;
  const isEditingProperty =
    !hasError && props.referrer.mode === 'EDIT_PROPERTY' && !!property;
  const isDeletingProperty =
    !hasError && props.referrer.mode === 'DELETE_PROPERTY' && !!property;
  const isShowingModal =
    hasError ||
    isEditingRow ||
    isDeletingRow ||
    isEditingProperty ||
    isDeletingProperty;
  const closeUrlPathname = `/databases/${props.database.id}`;
  const closeUrl = new URL(props.referrer.url);
  const closeUrlSearchParams = new URLSearchParams(closeUrl.search);
  closeUrlSearchParams.delete('mode');
  closeUrlSearchParams.delete('error');
  closeUrl.pathname = closeUrlPathname;
  closeUrl.search = closeUrlSearchParams.toString();
  const closeUrlHref = closeUrl.href.replace(closeUrl.origin, '');

  const clearSearchUrl = new URL(props.referrer.url);
  const clearSearchSearchParams = new URLSearchParams(clearSearchUrl.search);
  clearSearchSearchParams.delete('query');
  clearSearchUrl.search = clearSearchSearchParams.toString();

  const queriedRows: AnyRow[] = props.database.rows.filter((row: AnyRow) => {
    if (!props.referrer.query) {
      return true;
    }

    const guardIsStringProperty = (
      property: AnyProperty,
    ): property is Property<StringConstructor> => {
      return property.type === String;
    };

    const getPropertyId = (property: AnyProperty) => property.id;

    const allStringProperties = [
      ...props.database.properties
        .filter(guardIsStringProperty)
        .map(getPropertyId),
    ] as Array<Property<StringConstructor>['id']>;

    return !!allStringProperties.find(
      (stringPropertyId: Property<StringConstructor>['id']) => {
        if (!props.referrer.query) {
          return false;
        }

        return ((row[stringPropertyId] as string) || '')
          .toLowerCase()
          .startsWith(props.referrer.query.toLowerCase());
      },
    );
  });

  return (
    <PageShell
      pageTitle={props.database.name}
      settings={props.settings}
    >
      {props.referrer.error ? (
        <ModalDialogElement
          open
          heading={<>Error</>}
          closeUrl={closeUrlHref}
        >
          <p>{ERROR_MESSAGES[props.referrer.error]}</p>
        </ModalDialogElement>
      ) : null}
      {isEditingRow ? (
        <EditRowModalDialog
          row={row}
          database={props.database}
          closeUrl={closeUrlHref}
        />
      ) : null}
      {isDeletingRow ? (
        <DeleteRowModalDialog
          row={row}
          database={props.database}
          closeUrl={closeUrlHref}
        />
      ) : null}
      {isEditingProperty ? (
        <EditPropertyModalDialog
          property={property}
          closeUrl={closeUrlHref}
        />
      ) : null}
      {isDeletingProperty ? (
        <DeletePropertyModalDialog
          property={property}
          closeUrl={closeUrlHref}
        />
      ) : null}
      <div
        className="container"
        inert={isShowingModal ? '' : undefined}
      >
        <nav className="layout--split">
          <a href="/">Home</a>
          <SearchRowsForm referrer={props.referrer} />
          <a href="/settings">Settings</a>
        </nav>
        <main>
          <header>
            <EditDatabaseForm database={props.database} />
          </header>
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
                  action={`/databases/${props.database.id}/rows`}
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
                    <button
                      type="submit"
                      className="button"
                    >
                      Submit
                    </button>
                  </div>
                </form>
              </details>
            </aside>
            {guardIsTable(props.database) ? (
              <>
                <TableView
                  database={props.database}
                  referrer={props.referrer}
                  queriedRows={queriedRows}
                />
                <PostFormElement
                  action={`/databases/${props.database.id}/rows`}
                  id="clear-cells-form"
                >
                  <input
                    type="hidden"
                    name="_method"
                    value="POST"
                  />

                  <input
                    type="hidden"
                    name="bulkAction"
                    value="CLEAR"
                  />
                  <input
                    type="hidden"
                    name="cell[]"
                    value=""
                  />
                  <button
                    hidden
                    id="clear-cells-button"
                    type="submit"
                  >
                    Clear Selected Cells
                  </button>
                </PostFormElement>

                <PostFormElement
                  action={`/databases/${props.database.id}/rows`}
                  id="add-row-form"
                >
                  <button
                    className="button--full-width button--bordered"
                    id="add-new-row-button"
                    type="submit"
                  >
                    Add New Row
                  </button>
                </PostFormElement>
                {props.database.rows.length - queriedRows.length > 0 ? (
                  <p className="notice">
                    Not showing{' '}
                    {props.database.rows.length - queriedRows.length} rows due
                    to search filter.{' '}
                    <a
                      className="text-color--currentColor"
                      href={clearSearchUrl.href}
                    >
                      Clear
                    </a>
                  </p>
                ) : null}
              </>
            ) : null}
          </ViewContainerElement>
        </main>
      </div>
    </PageShell>
  );
}
