import React from 'react';
import {
  Referrer,
  Settings,
  Row,
  Property,
  Database,
  PartialChecklistRow,
  ChecklistRow,
  Checklist,
} from 'shared/types';
import { guardIsChecklist, guardIsTable } from 'shared/assertions';
import { PageShell } from 'components/pages/PageShell';
import { ChecklistView } from 'components/views/ChecklistView';
import { SearchRowsForm } from 'components/forms/SearchRowsForm';
import { FilterRowsForm } from 'components/forms/FilterRowsForm';
import { EditDatabaseForm } from 'components/forms/EditDatabaseForm';
import { EditRowModalDialog } from 'components/dialogs/EditRowModalDialog';
import { DeleteRowModalDialog } from 'components/dialogs/DeleteRowModalDialog';
import { TriggerEditPropertiesForm } from 'components/forms/TriggerEditPropertiesForm';
import { PropertiesModalDialog } from 'components/dialogs/PropertiesModalDialog';
import { ModalDialog } from 'components/dialogs/ModalDialog';
import { ERROR_MESSAGES } from 'utilities/errors';

export function DatabasePage(
  props: React.PropsWithChildren<{
    database: Database<Property[]>;
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

  return (
    <PageShell
      pageTitle={props.database.name}
      settings={props.settings}
    >
      {props.referrer.error ? (
        <ModalDialog
          open
          heading={<>Error</>}
          closeUrl={closeUrl.href}
        >
          <p>{ERROR_MESSAGES[props.referrer.error]}</p>
        </ModalDialog>
      ) : null}
      {isEditingRow ? (
        <EditRowModalDialog
          row={row}
          database={props.database}
          closeUrl={closeUrl.href}
        />
      ) : null}
      {isDeletingRow ? (
        <DeleteRowModalDialog
          row={row}
          database={props.database}
          closeUrl={closeUrl.href}
        />
      ) : null}
      {isEditingProperties ? (
        <PropertiesModalDialog
          database={props.database}
          closeUrl={closeUrl.href}
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
            {guardIsChecklist(props.database) ? (
              <FilterRowsForm
                rows={props.database.rows}
                referrer={props.referrer}
              />
            ) : null}
          </aside>
          {guardIsChecklist(props.database) ? (
            <ChecklistView
              database={props.database}
              referrer={props.referrer}
            />
          ) : null}
        </main>
      </div>
    </PageShell>
  );
}
