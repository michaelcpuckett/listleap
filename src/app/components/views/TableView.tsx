import React from 'react';
import {
  AnyTable,
  AnyTableRow,
  Property,
  Referrer,
  Table,
  TableRow,
} from 'shared/types';
import { RowActionsFlyoutMenu } from 'components/menus/RowActionsFlyoutMenu';
import { AutoSaveTextElement } from 'components/elements/AutoSaveTextElement';
// import {DateContentEditable} from 'components/elements/DateContentEditable';
import { AutoSaveCheckboxElement } from 'components/elements/AutoSaveCheckboxElement';
import { PostFormElement } from 'components/elements/PostFormElement';
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
        <div role="rowgroup">
          <div
            role="row"
            aria-label="Properties"
          >
            <div
              role="columnheader"
              className="align-center"
              aria-label="Select"
            >
              <template
                shadowrootmode="open"
                shadowrootdelegatesfocus="true"
              >
                <slot></slot>
              </template>
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
            </div>
            {properties.map((property, index) => (
              <div
                role="columnheader"
                aria-label={property.name}
              >
                <template
                  shadowrootmode="open"
                  shadowrootdelegatesfocus="true"
                >
                  <slot></slot>
                </template>
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
              </div>
            ))}
            <div
              role="columnheader"
              className="align-center"
              aria-label="Actions"
            >
              <template
                shadowrootmode="open"
                shadowrootdelegatesfocus="true"
              >
                <slot></slot>
              </template>
              <AddPropertyForm database={props.database} />
            </div>
          </div>
        </div>
        <div role="rowgroup">
          {rows.map((row) => {
            const filteredIndex = props.queriedRows.findIndex(
              (t) => t.id === row.id,
            );

            if (filteredIndex === -1) {
              return null;
            }

            const formId = `edit-row-inline-form--${row.id}`;

            return (
              <div
                role="row"
                aria-rowindex={rows.indexOf(row) + 1}
              >
                <div
                  role="gridcell"
                  className="align-center"
                >
                  <template
                    shadowrootmode="open"
                    shadowrootdelegatesfocus="true"
                  >
                    <slot></slot>
                  </template>
                  <AutoSaveCheckboxElement
                    form="select-multiple-rows-form"
                    id={row.id}
                    value={row.id}
                    name="row[]"
                    label="Select row"
                    checked={false}
                  />
                </div>
                {properties.map((property, index) => (
                  <div role={index === 0 ? 'rowheader' : 'gridcell'}>
                    <template
                      shadowrootmode="open"
                      shadowrootdelegatesfocus="true"
                    >
                      <slot></slot>
                    </template>
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
                  </div>
                ))}
                <div
                  role="gridcell"
                  className="align-center"
                  aria-label="Actions"
                >
                  <template
                    shadowrootmode="open"
                    shadowrootdelegatesfocus="true"
                  >
                    <slot></slot>
                  </template>
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
                </div>
              </div>
            );
          })}
          <div role="row">
            <div
              role="gridcell"
              style={{
                gridColumn: '1 / -1',
              }}
            >
              <template
                shadowrootmode="open"
                shadowrootdelegatesfocus="true"
              >
                <slot></slot>
              </template>
              <PostFormElement
                action={`/databases/${props.database.id}/rows`}
                id="add-row-form"
              >
                <button
                  className="button--full-width"
                  id="add-new-row-button"
                  type="submit"
                >
                  Add New Row
                </button>
              </PostFormElement>
            </div>
          </div>
        </div>
      </div>
    </GridKeyboardNavigationElement>
  );
}
