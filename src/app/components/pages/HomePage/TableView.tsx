import {
  CellElement,
  ColumnHeaderElement,
  GridElement,
  RowElement,
  RowGroupElement,
} from 'components/elements/GridElement';
import { HyperLinkElement } from 'components/elements/HyperLinkElement';
import { SelectAllCheckboxElement } from 'components/elements/SelectAllCheckboxElement';
import { DatabaseActionsFlyoutMenu } from 'components/menus/DatabaseActionsFlyoutMenu';
import { PartialDatabase, Referrer } from 'shared/types';

export function TableView(
  props: React.PropsWithChildren<{
    databases: PartialDatabase[];
    referrer: Referrer;
  }>,
) {
  const gridColumnsCss = `auto minmax(0, 1fr) auto`;

  return (
    <GridElement
      type="table"
      rowCount={props.databases.length}
      gridColumnsCss={gridColumnsCss}
    >
      <RowGroupElement>
        <RowElement>
          <ColumnHeaderElement className="align-center">
            <SelectAllCheckboxElement>
              <input
                form="select-multiple-rows-form"
                className="input"
                tabIndex={0}
                type="checkbox"
                aria-label="Select all databases"
                name="row[]"
                value={props.databases.map((db) => db.id).join(',')}
              />
            </SelectAllCheckboxElement>
          </ColumnHeaderElement>
          <ColumnHeaderElement>Database</ColumnHeaderElement>
          <ColumnHeaderElement label="Actions"></ColumnHeaderElement>
        </RowElement>
      </RowGroupElement>
      <RowGroupElement>
        {props.databases.map((database) => (
          <RowElement key={database.id}>
            <CellElement className="align-center">
              <input
                form="select-multiple-rows-form"
                className="input"
                type="checkbox"
                tabIndex={0}
                aria-label="Select database"
                name="row[]"
                value={database.id}
              />
            </CellElement>
            <CellElement role="rowheader">
              <HyperLinkElement
                href={`/databases/${database.id}`}
                full-width
              >
                {database.name}
              </HyperLinkElement>
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
    </GridElement>
  );
}
