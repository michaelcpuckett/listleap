import React from "react";
import { Referrer, Settings, Row, Property, Database, PartialChecklistRow, ChecklistRow, Checklist } from '../../shared/types';
import { PageShell } from './PageShell';
import { ChecklistView } from '../views/ChecklistView';
import {SearchRowsForm} from '../forms/SearchRowsForm';
import {FilterRowsForm} from '../forms/FilterRowsForm';
import {EditDatabaseForm} from '../forms/EditDatabaseForm';
import { guardIsChecklist, guardIsTable } from "../../shared/assertions";
import { EditRowModalDialog } from "../dialogs/EditRowModalDialog";
import { DeleteRowModalDialog } from "../dialogs/DeleteRowModalDialog";
import { TriggerEditPropertiesForm } from "../forms/TriggerEditPropertiesForm";
import { EditPropertiesModalDialog } from "../dialogs/EditPropertiesModalDialog";

export function DatabasePage(props: React.PropsWithChildren<{ database: Database<Property[]>; referrer: Referrer; settings: Settings; }>) {
  const row = props.database.rows.find((row) => row.id === props.referrer.id);
  const isEditingRow = props.referrer.mode === 'EDIT_ROW' && !!row;
  const isDeletingRow = props.referrer.mode === 'DELETE_ROW' && !!row;
  const isEditingProperties = props.referrer.mode === 'EDIT_PROPERTIES';
  const isShowingModal = isEditingRow || isDeletingRow || isEditingProperties;
  const closeUrlPathname = `/databases/${props.database.id}`;
  const closeUrl = new URL(props.referrer.url);
  const closeUrlSearchParams = new URLSearchParams(closeUrl.search);
  closeUrlSearchParams.delete('mode');
  closeUrl.pathname = closeUrlPathname;
  closeUrl.search = closeUrlSearchParams.toString();

  return (
    <PageShell pageTitle={props.database.name} settings={props.settings}>
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
        <EditPropertiesModalDialog database={props.database} closeUrl={closeUrl.href} />
      ) : null}
      <div className="container" inert={isShowingModal ? '' : undefined}>
        <nav>
          <a href="/">Home</a>
          <a href="/settings">Settings</a>
        </nav>
        <main>
          <header>
            <EditDatabaseForm database={props.database} />
            <em>{props.database.type}</em>
            <TriggerEditPropertiesForm database={props.database} referrer={props.referrer} />
          </header>
          <aside aria-label="Actions">
            <SearchRowsForm referrer={props.referrer} />
            {guardIsChecklist(props.database) ? (
              <FilterRowsForm rows={props.database.rows} referrer={props.referrer} />
            ) : null}
          </aside>
          {guardIsChecklist(props.database) ? (
            <ChecklistView database={props.database} referrer={props.referrer} />
          ) : null}
        </main>
      </div>
    </PageShell>
  );
}