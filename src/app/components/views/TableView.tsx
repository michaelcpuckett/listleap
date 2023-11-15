import React from 'react';
import { Property, Referrer, Table, TableRow } from 'shared/types';
import { RowActionsFlyoutMenu } from 'components/menus/RowActionsFlyoutMenu';
import { AutoSaveTextElement } from 'components/elements/AutoSaveTextElement';
import { NumericalContentEditable } from 'components/elements/NumericalContentEditable';
// import {DateContentEditable} from 'components/elements/DateContentEditable';
import { AutoSaveCheckboxElement } from 'components/elements/AutoSaveCheckboxElement';
import { PostFormElement } from 'components/elements/PostFormElement';

export function TableView(
  props: React.PropsWithoutRef<{
    database: Table<Property[]>;
    referrer: Referrer;
    queriedRows: TableRow<Property[]>[];
  }>,
) {
  const rows = props.database.rows;
  const properties = props.database.properties;

  const gridColumnsCss = `auto minmax(0, 1fr) ${
    properties.length ? `repeat(${properties.length}, minmax(0, 1fr))` : ''
  } auto`;

  return (
    <table
      aria-rowcount={rows.length}
      className="view view--checklist"
      style={{
        '--grid-columns': gridColumnsCss,
      }}
    >
      <thead>
        <tr>
          <th className="align-center">Select</th>
          <th>Title</th>
          {properties.map((property) => (
            <th>{property.name}</th>
          ))}
          <th className="align-center">Actions</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row, index, { length }) => {
          const filteredIndex = props.queriedRows.findIndex(
            (t) => t.id === row.id,
          );

          if (filteredIndex === -1) {
            return null;
          }

          const formId = `edit-row-inline-form--${row.id}`;

          return (
            <tr
              aria-label={row.title}
              aria-rowindex={rows.indexOf(row) + 1}
            >
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
              <td>
                <AutoSaveTextElement
                  inline
                  form={formId}
                  id={row.id}
                  label="Title"
                  name="title"
                  value={row.title}
                />
              </td>
              {properties.map((property) => {
                return (
                  <td>
                    {property.type === String ? (
                      <AutoSaveTextElement
                        inline
                        form={formId}
                        id={row.id}
                        label={property.name}
                        name={property.id}
                        value={row[property.id] as string}
                      />
                    ) : null}
                    {property.type === Boolean ? (
                      <AutoSaveCheckboxElement
                        form={formId}
                        id={row.id}
                        label={property.name}
                        name={property.id}
                        checked={row[property.id] as boolean}
                      />
                    ) : null}
                    {property.type === Number ? (
                      <NumericalContentEditable
                        form={formId}
                        id={row.id}
                        label={property.name}
                        name={property.id}
                        value={row[property.id] as number}
                      />
                    ) : null}
                  </td>
                );
              })}
              <td
                className="align-center"
                aria-label={`Actions for ${row.title}`}
              >
                <form
                  noValidate
                  action={`/databases/${props.database.id}/rows/${row.id}`}
                  method="POST"
                  id={`edit-row-inline-form--${row.id}`}
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
                <RowActionsFlyoutMenu
                  row={row}
                  previousRow={props.queriedRows[filteredIndex - 1]}
                  nextRow={props.queriedRows[filteredIndex + 1]}
                  referrer={props.referrer}
                />
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
              <button type="submit">Add New Row</button>
            </PostFormElement>
          </td>
        </tr>
      </tbody>
    </table>
  );
}
