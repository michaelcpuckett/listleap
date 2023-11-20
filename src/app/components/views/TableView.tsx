import React from 'react';
import { AnyTable, AnyTableRow, Referrer } from 'shared/types';
import { RowActionsFlyoutMenu } from 'components/menus/RowActionsFlyoutMenu';
import { AutoSaveTextElement } from 'components/elements/AutoSaveTextElement';
// import {DateContentEditable} from 'components/elements/DateContentEditable';
import { AutoSaveCheckboxElement } from 'components/elements/AutoSaveCheckboxElement';
import { PropertyActionsFlyoutMenu } from 'components/menus/PropertyActionsFlyoutMenu';
import { SelectAllCheckboxElement } from 'components/elements/SelectAllCheckboxElement';
import { AddPropertyForm } from 'components/forms/AddPropertyForm';
import { GridKeyboardNavigationElement } from 'components/elements/GridKeyboardNavigationElement';

export function TableView(
  props: React.PropsWithoutRef<{
    database: AnyTable;
    referrer: Referrer;
    queriedRows: AnyTableRow[];
  }>,
) {
  const rows = props.database.rows;
  const properties = props.database.properties;
  const rowIds = rows
    .filter((row) => {
      const filteredIndex = props.queriedRows.findIndex((t) => t.id === row.id);
      return filteredIndex > -1;
    })
    .map((row) => row.id);

  const gridColumnsCss = `auto ${
    properties.length ? `repeat(${properties.length}, minmax(0, 1fr))` : ''
  } auto`;

  return (
    <GridKeyboardNavigationElement>
      <div
        role="grid"
        aria-rowcount={rows.length}
        className="view view--table"
        style={{
          '--grid-columns': gridColumnsCss,
        }}
      >
        <RowGroupElement>
          <RowElement label="Properties">
            <ColumnHeaderElement
              className="align-center"
              label="Select"
            >
              <SelectAllCheckboxElement>
                <AutoSaveCheckboxElement
                  form="select-multiple-rows-form"
                  id="select-all-rows"
                  value={rowIds.join(',')}
                  name="row[]"
                  label="Select all rows"
                  checked={false}
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
                  referrer={props.referrer}
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
                  <AutoSaveCheckboxElement
                    form="select-multiple-rows-form"
                    id={row.id}
                    value={row.id}
                    name="row[]"
                    label="Select row"
                    checked={false}
                  />
                </CellElement>
                {properties.map((property, index) => (
                  <CellElement role={index === 0 ? 'rowheader' : undefined}>
                    {property.type === String ? (
                      <AutoSaveTextElement
                        inline
                        form={formId}
                        id={row.id}
                        label={property.name}
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
                    referrer={props.referrer}
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
      </div>
    </GridKeyboardNavigationElement>
  );
}

/**
 * Column Header Element
 *
 * Uses shadowrootdelegatesfocus to focus the first focusable element when
 * #focus() is called.
 **/
function ColumnHeaderElement(
  props: React.PropsWithChildren<{ className?: string; label?: string }>,
) {
  return (
    <div
      role="columnheader"
      className={props.className}
      aria-label={props.label}
    >
      <template
        shadowrootmode="open"
        shadowrootdelegatesfocus="true"
      >
        <slot></slot>
      </template>
      {props.children}
    </div>
  );
}

/**
 * Cell (td, th) Element
 *
 * Uses shadowrootdelegatesfocus to focus the first focusable element when
 * #focus() is called.
 **/
function CellElement(
  props: React.PropsWithChildren<{
    role?: string;
    className?: string;
    label?: string;
  }>,
) {
  return (
    <div
      role={props.role || 'gridcell'}
      className={props.className}
      aria-label={props.label}
    >
      <template
        shadowrootmode="open"
        shadowrootdelegatesfocus="true"
      >
        <slot></slot>
      </template>
      {props.children}
    </div>
  );
}

/**
 * Row (tr) Element
 */
function RowElement(props: React.PropsWithChildren<{ label?: string }>) {
  return (
    <div
      role="row"
      aria-label={props.label}
    >
      {props.children}
    </div>
  );
}

/**
 * Row Group (thead, tbody) Element
 */
function RowGroupElement(props: React.PropsWithChildren<{ label?: string }>) {
  return (
    <div
      role="rowgroup"
      aria-label={props.label}
    >
      {props.children}
    </div>
  );
}
