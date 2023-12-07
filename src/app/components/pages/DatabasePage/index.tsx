import { DeletePropertyModalDialog } from 'components/dialogs/DeletePropertyModalDialog';
import { DeleteRowModalDialog } from 'components/dialogs/DeleteRowModalDialog';
import { EditPropertyModalDialog } from 'components/dialogs/EditPropertyModalDialog';
import { EditRowModalDialog } from 'components/dialogs/EditRowModalDialog';
import { ButtonElement } from 'components/elements/ButtonElement';
import { DisclosureWidgetElement } from 'components/elements/DisclosureWidgetElement';
import { HyperLinkElement } from 'components/elements/HyperLinkElement';
import { ModalDialogElement } from 'components/elements/ModalDialogElement';
import { PostFormElement } from 'components/elements/PostFormElement';
import { ViewContainerElement } from 'components/elements/ViewContainerElement';
import { EditDatabaseForm } from 'components/forms/EditDatabaseForm';
import { SearchRowsForm } from 'components/forms/SearchRowsForm';
import { Icon } from 'components/icons/Icon';
import { PageShell } from 'components/pages/PageShell';
import React from 'react';
import { guardIsTable } from 'shared/assertions';
import {
  AnyProperty,
  AnyRow,
  Database,
  Property,
  Settings,
} from 'shared/types';
import { ERROR_MESSAGES } from 'utilities/errors';
import { TableView } from './TableView';

export function DatabasePage(
  props: React.PropsWithChildren<{
    database: Database<AnyProperty[]>;
    settings: Settings;
    query: Record<string, string>;
    version: number;
    url: string;
  }>,
) {
  const row = props.database.rows.find((row) => row.id === props.query.id);
  const property = props.database.properties.find(
    (property) => property.id === props.query.id,
  );
  const hasError = !!props.query.error;
  const isEditingRow = !hasError && props.query.mode === 'EDIT_ROW' && !!row;
  const isDeletingRow = !hasError && props.query.mode === 'DELETE_ROW' && !!row;
  const isEditingProperty =
    !hasError && props.query.mode === 'EDIT_PROPERTY' && !!property;
  const isDeletingProperty =
    !hasError && props.query.mode === 'DELETE_PROPERTY' && !!property;
  const isShowingModal =
    hasError ||
    isEditingRow ||
    isDeletingRow ||
    isEditingProperty ||
    isDeletingProperty;
  const closeUrlPathname = `/databases/${props.database.id}`;
  const closeUrl = new URL(props.url);
  const closeUrlSearchParams = new URLSearchParams(closeUrl.search);
  closeUrlSearchParams.delete('mode');
  closeUrlSearchParams.delete('error');
  closeUrl.pathname = closeUrlPathname;
  closeUrl.search = closeUrlSearchParams.toString();
  const closeUrlHref = closeUrl.href.replace(closeUrl.origin, '');

  const clearSearchUrl = new URL(props.url);
  const clearSearchSearchParams = new URLSearchParams(clearSearchUrl.search);
  clearSearchSearchParams.delete('query');
  clearSearchUrl.search = clearSearchSearchParams.toString();

  const queriedRows: AnyRow[] = props.database.rows.filter((row: AnyRow) => {
    if (!props.query.query) {
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
        if (!props.query.query) {
          return false;
        }

        return ((row[stringPropertyId] as string) || '')
          .toLowerCase()
          .startsWith(props.query.query.toLowerCase());
      },
    );
  });

  return (
    <PageShell
      version={props.version}
      pageTitle={props.database.name}
      settings={props.settings}
    >
      {props.query.error ? (
        <ModalDialogElement
          open
          heading={<>Error</>}
          closeUrl={closeUrlHref}
        >
          <p>{ERROR_MESSAGES[props.query.error]}</p>
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
          <HyperLinkElement href="/">Home</HyperLinkElement>
          <SearchRowsForm
            query={props.query}
            url={props.url}
          />
          <HyperLinkElement href="/settings">Settings</HyperLinkElement>
        </nav>
        <main>
          <header>
            <EditDatabaseForm database={props.database} />
          </header>
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
                      required
                    >
                      <option value="">Actions...</option>
                      <option value="DELETE">Delete Selected Rows</option>
                    </select>
                    <ButtonElement>Submit</ButtonElement>
                  </div>
                </form>
              </DisclosureWidgetElement>
            </aside>
            {guardIsTable(props.database) ? (
              <>
                <TableView
                  database={props.database}
                  query={props.query}
                  queriedRows={queriedRows}
                  url={props.url}
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
                  <ButtonElement
                    id="add-new-row-button"
                    button={false}
                    full-width
                    bordered
                  >
                    Add New Row
                  </ButtonElement>
                </PostFormElement>
                {props.database.rows.length - queriedRows.length > 0 ? (
                  <p className="notice">
                    Not showing{' '}
                    {props.database.rows.length - queriedRows.length} rows due
                    to search filter.{' '}
                    <HyperLinkElement
                      currentColor
                      href={clearSearchUrl.href}
                    >
                      Clear
                    </HyperLinkElement>
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
