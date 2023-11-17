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
import { TriggerAddPropertyForm } from 'components/forms/TriggerAddPropertyForm';
import { AddPropertyModalDialog } from 'components/dialogs/AddPropertyModalDialog';
import { EditPropertyModalDialog } from 'components/dialogs/EditPropertyModalDialog';
import { ModalDialog } from 'components/dialogs/ModalDialog';
import { ERROR_MESSAGES } from 'utilities/errors';

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
  const isAddingProperty = !hasError && props.referrer.mode === 'ADD_PROPERTY';
  const isEditingProperty =
    !hasError && props.referrer.mode === 'EDIT_PROPERTY' && !!property;
  const isShowingModal =
    hasError ||
    isEditingRow ||
    isDeletingRow ||
    isAddingProperty ||
    isEditingProperty;
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
        <ModalDialog
          open
          heading={<>Error</>}
          closeUrl={closeUrlHref}
        >
          <p>{ERROR_MESSAGES[props.referrer.error]}</p>
        </ModalDialog>
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
      {isAddingProperty ? (
        <AddPropertyModalDialog
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
      <div
        className="container"
        inert={isShowingModal ? '' : undefined}
      >
        <nav className="layout--split">
          <a href="/">Home</a>
          <a href="/settings">Settings</a>
        </nav>
        <main>
          <header>
            <EditDatabaseForm database={props.database} />
          </header>
          <SearchRowsForm referrer={props.referrer} />
          <aside aria-label="Actions">
            <details>
              <summary className="button">Bulk Actions</summary>
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
                <select name="bulkAction">
                  <option value="DELETE">Delete Selected Rows</option>
                </select>
                <button
                  type="submit"
                  className="button"
                >
                  Submit
                </button>
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
              {props.database.rows.length - queriedRows.length > 0 ? (
                <p className="notice">
                  Not showing {props.database.rows.length - queriedRows.length}{' '}
                  rows due to search filter.{' '}
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
        </main>
      </div>
    </PageShell>
  );
}
