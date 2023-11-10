import React from "react";
import { Referrer, Settings, Row, Property, Database, PartialChecklistRow, ChecklistRow, Checklist } from '../../shared/types';
import { PageShell } from './PageShell';
import { ChecklistView } from '../views/ChecklistView';
import { TableView } from '../views/TableView';
import {SearchRowsForm} from '../forms/SearchRowsForm';
import {FilterRowsForm} from '../forms/FilterRowsForm';
import {EditDatabaseForm} from '../forms/EditDatabaseForm';
import { guardIsChecklist, guardIsTable } from "../../shared/assertions";
import { EditRowModalDialog } from "../dialogs/EditRowModalDialog";
import { DeleteRowModalDialog } from "../dialogs/DeleteRowModalDialog";

export function DatabasePage(props: React.PropsWithChildren<{ database: Database<Property[]>; referrer: Referrer; settings: Settings; }>) {
  const row = props.database.rows.find((row) => row.id === props.referrer.id);
  const isEditingRow = props.referrer.mode === 'EDIT_ROW' && !!row;
  const isDeletingRow = props.referrer.mode === 'DELETE_ROW' && !!row;
  const isShowingModal = isEditingRow || isDeletingRow;

  return (
    <PageShell pageTitle={props.database.name} settings={props.settings}>
      {isEditingRow ? (
        <EditRowModalDialog
          row={row}
          database={props.database}
          closeUrl={`/databases/${props.database.id}`}
        />
      ) : null}
      {isDeletingRow ? (
        <DeleteRowModalDialog
          row={row}
          database={props.database}
          closeUrl={`/databases/${props.database.id}`}
        />
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
          {guardIsTable(props.database) ? (
            <TableView database={props.database} referrer={props.referrer} />
          ) : null}
        </main>
      </div>
    </PageShell>
  );
}