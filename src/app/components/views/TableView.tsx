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
import { NumericalContentEditable } from 'components/elements/NumericalContentEditable';
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
      <table
        aria-rowcount={rows.length}
        className="view view--table"
        style={{
          '--grid-columns': gridColumnsCss,
        }}
      >
        <thead>
          <tr aria-label="Properties">
            <th
              className="align-center"
              aria-label="Select"
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
            </th>
            {properties.map((property, index) => (
              <th aria-label={property.name}>
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
              </th>
            ))}
            <th
              className="align-center"
              aria-label="Actions"
            >
              <AddPropertyForm database={props.database} />
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            const filteredIndex = props.queriedRows.findIndex(
              (t) => t.id === row.id,
            );

            if (filteredIndex === -1) {
              return null;
            }

            const formId = `edit-row-inline-form--${row.id}`;

            return (
              <tr aria-rowindex={rows.indexOf(row) + 1}>
                <td className="align-center">
                  <AutoSaveCheckboxElement
                    form="select-multiple-rows-form"
                    id={row.id}
                    value={row.id}
                    name="row[]"
                    label="Select row"
                    checked={false}
                  />
                </td>
                {properties.map((property, index) => {
                  const tagName = index === 0 ? 'th' : 'td';

                  return React.createElement(tagName, {}, [
                    ...(property.type === String
                      ? [
                          <AutoSaveTextElement
                            inline
                            form={formId}
                            id={row.id}
                            label={property.name}
                            name={property.id}
                            value={row[property.id]}
                          />,
                        ]
                      : []),
                    ...(property.type === Boolean
                      ? [
                          <AutoSaveCheckboxElement
                            form={formId}
                            id={row.id}
                            label={property.name}
                            name={property.id}
                            checked={row[property.id]}
                          />,
                        ]
                      : []),
                    ...(property.type === Number
                      ? [
                          <NumericalContentEditable
                            form={formId}
                            id={row.id}
                            label={property.name}
                            name={property.id}
                            value={row[property.id]}
                          />,
                        ]
                      : []),
                  ]);
                })}
                <td
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
                </td>
              </tr>
            );
          })}
          <tr>
            <td
              colSpan={properties.length + 4}
              style={{
                gridColumn: '1 / -1',
              }}
            >
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
            </td>
          </tr>
        </tbody>
      </table>
    </GridKeyboardNavigationElement>
  );
}
