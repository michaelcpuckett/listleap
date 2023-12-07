import { AutoSaveTextElement } from 'components/elements/AutoSaveTextElement';
import { RowActionsFlyoutMenu } from 'components/menus/RowActionsFlyoutMenu';
import React from 'react';
import { AnyTable, AnyTableRow } from 'shared/types';
// import {DateContentEditable} from 'components/elements/DateContentEditable';
import { AutoSaveCheckboxElement } from 'components/elements/AutoSaveCheckboxElement';
import {
  CellElement,
  ColumnHeaderElement,
  GridElement,
  RowElement,
  RowGroupElement,
} from 'components/elements/GridElement';
import { SelectAllCheckboxElement } from 'components/elements/SelectAllCheckboxElement';
import { AddPropertyForm } from 'components/forms/AddPropertyForm';
import { PropertyActionsFlyoutMenu } from 'components/menus/PropertyActionsFlyoutMenu';

export function TableView(
  props: React.PropsWithoutRef<{
    database: AnyTable;
    query: Record<string, string>;
    url: string;
    queriedRows: AnyTableRow[];
  }>,
) {
  const rows = props.database.rows;
  const properties = props.database.properties;
  const gridColumnsCss = `auto ${
    properties.length ? `repeat(${properties.length}, minmax(235px, 1fr))` : ''
  } auto`;

  return (
    <GridElement
      type="table"
      rowCount={rows.length}
      gridColumnsCss={gridColumnsCss}
    >
      <RowGroupElement>
        <RowElement label="Properties">
          <ColumnHeaderElement className="align-center">
            <SelectAllCheckboxElement>
              <input
                form="select-multiple-rows-form"
                className="input"
                tabIndex={0}
                type="checkbox"
                aria-label="Select all rows"
                name="row[]"
                value={rows.map((row) => row.id).join(',')}
              />
            </SelectAllCheckboxElement>
          </ColumnHeaderElement>
          {properties.map((property, index) => (
            <ColumnHeaderElement label={property.name}>
              <form
                id={`edit-property-form--${property.id}`}
                autoComplete="off"
                action={`/databases/${property.databaseId}/properties/${property.id}`}
                method="POST"
                role="none"
              >
                <input
                  type="hidden"
                  name="_method"
                  value="PATCH"
                />
                <AutoSaveTextElement
                  inline
                  id={property.id}
                  query={props.query}
                  name="name"
                  label={property.name}
                  value={property.name}
                />
                <button
                  type="submit"
                  hidden
                >
                  Submit
                </button>
              </form>
              <PropertyActionsFlyoutMenu
                property={property}
                previousProperty={properties[index - 1]}
                nextProperty={properties[index + 1]}
                query={props.query}
                url={props.url}
              />
            </ColumnHeaderElement>
          ))}
          <ColumnHeaderElement
            className="align-center"
            label="Actions"
          >
            <AddPropertyForm database={props.database} />
          </ColumnHeaderElement>
        </RowElement>{' '}
      </RowGroupElement>
      <RowGroupElement>
        {rows.map((row) => {
          const filteredIndex = props.queriedRows.findIndex(
            (t) => t.id === row.id,
          );

          if (filteredIndex === -1) {
            return null;
          }

          const formId = `edit-row-inline-form--${row.id}`;

          return (
            <RowElement>
              <CellElement className="align-center">
                <input
                  form="select-multiple-rows-form"
                  className="input"
                  type="checkbox"
                  tabIndex={0}
                  aria-label="Select row"
                  name="row[]"
                  checked={row.selected}
                  value={row.id}
                />
              </CellElement>
              {properties.map((property, index) => (
                <CellElement
                  rowId={row.id}
                  propertyId={property.id}
                  role={index === 0 ? 'rowheader' : undefined}
                  selectable
                >
                  {property.type === String ? (
                    <AutoSaveTextElement
                      inline
                      form={formId}
                      id={row.id}
                      label={property.name}
                      query={props.query}
                      name={property.id}
                      value={row[property.id]}
                    />
                  ) : property.type === Boolean ? (
                    <AutoSaveCheckboxElement
                      form={formId}
                      id={row.id}
                      label={property.name}
                      name={property.id}
                      checked={row[property.id]}
                    />
                  ) : property.type === Number ? (
                    <AutoSaveTextElement
                      form={formId}
                      query={props.query}
                      id={row.id}
                      label={property.name}
                      name={property.id}
                      value={row[property.id]}
                    />
                  ) : null}
                </CellElement>
              ))}
              <CellElement
                className="align-center"
                aria-label="Actions"
              >
                <RowActionsFlyoutMenu
                  row={row}
                  previousRow={props.queriedRows[filteredIndex - 1]}
                  nextRow={props.queriedRows[filteredIndex + 1]}
                  query={props.query}
                  url={props.url}
                />
                <form
                  noValidate
                  autoComplete="off"
                  action={`/databases/${props.database.id}/rows/${row.id}`}
                  method="POST"
                  id={formId}
                  role="none"
                >
                  <input
                    type="hidden"
                    name="_method"
                    value="PUT"
                  />
                  <input
                    type="hidden"
                    name="position"
                    value={row.position}
                  />
                  <button
                    type="submit"
                    hidden
                  >
                    Update
                  </button>
                </form>
              </CellElement>
            </RowElement>
          );
        })}
      </RowGroupElement>
    </GridElement>
  );
}
