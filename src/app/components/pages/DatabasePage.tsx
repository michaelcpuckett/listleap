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
import { TriggerEditPropertiesForm } from 'components/forms/TriggerEditPropertiesForm';
import { PropertiesModalDialog } from 'components/dialogs/PropertiesModalDialog';
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
  const hasError = !!props.referrer.error;
  const isEditingRow = !hasError && props.referrer.mode === 'EDIT_ROW' && !!row;
  const isDeletingRow =
    !hasError && props.referrer.mode === 'DELETE_ROW' && !!row;
  const isEditingProperties =
    !hasError && props.referrer.mode === 'EDIT_PROPERTIES';
  const isShowingModal =
    hasError || isEditingRow || isDeletingRow || isEditingProperties;
  const closeUrlPathname = `/databases/${props.database.id}`;
  const closeUrl = new URL(props.referrer.url);
  const closeUrlSearchParams = new URLSearchParams(closeUrl.search);
  closeUrlSearchParams.delete('mode');
  closeUrlSearchParams.delete('error');
  closeUrl.pathname = closeUrlPathname;
  closeUrl.search = closeUrlSearchParams.toString();
  const closeUrlHref = closeUrl.href.replace(closeUrl.origin, '');

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
      {isEditingProperties ? (
        <PropertiesModalDialog
          database={props.database}
          closeUrl={closeUrlHref}
        />
      ) : null}
      <div
        className="container"
        inert={isShowingModal ? '' : undefined}
      >
        <nav>
          <a href="/">Home</a>
          <a href="/settings">Settings</a>
        </nav>
        <main>
          <header>
            <EditDatabaseForm database={props.database} />
            <em>{props.database.type}</em>
            <TriggerEditPropertiesForm
              database={props.database}
              referrer={props.referrer}
            />
          </header>
          <aside aria-label="Actions">
            <SearchRowsForm referrer={props.referrer} />
          </aside>

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
                  rows due to search filter.
                </p>
              ) : null}
            </>
          ) : null}
        </main>
      </div>
    </PageShell>
  );
}
