import React from 'react';
import { Property, Referrer, Checklist, ChecklistRow } from 'shared/types';
import { RowActionsFlyoutMenu } from 'components/menus/RowActionsFlyoutMenu';
import { AutoSaveTextElement } from 'components/elements/AutoSaveTextElement';
import { NumericalContentEditable } from 'components/elements/NumericalContentEditable';
// import {DateContentEditable} from 'components/elements/DateContentEditable';
import { AutoSaveCheckboxElement } from 'components/elements/AutoSaveCheckboxElement';
import { PostFormElement } from 'components/elements/PostFormElement';

export function ChecklistView(
  props: React.PropsWithoutRef<{
    database: Checklist<Property[]>;
    referrer: Referrer;
    filteredRows: ChecklistRow<Property[]>[];
  }>,
) {
  const rows = props.database.rows;
  const properties = props.database.properties;

  const newRow = {
    id: 'new-row',
    databaseId: props.database.id,
    completed: false,
    title: '',
    ...Object.fromEntries(
      props.database.properties.map((property: Property) => [
        property.id,
        property.type === Number ? 0 : property.type === Boolean ? false : '',
      ]),
    ),
  } as ChecklistRow<Property[]>;

  rows.push(newRow);

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
          <th className="align-center">Done</th>
          <th>Title</th>
          {properties.map((property) => (
            <th>{property.name}</th>
          ))}
          <th className="align-center">Actions</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row, index, { length }) => {
          const filteredIndex = props.filteredRows.findIndex(
            (t) => t.id === row.id,
          );
          const isBlankRow = index === length - 1;
          const formId = isBlankRow
            ? 'add-row-inline-form'
            : `edit-row-inline-form--${row.id}`;

          if (!isBlankRow && filteredIndex === -1) {
            return null;
          }

          return (
            <tr
              aria-label={row.title || 'New Row'}
              aria-rowindex={rows.indexOf(row) + 1}
            >
              <td className="align-center">
                <AutoSaveCheckboxElement
                  form={formId}
                  id={row.id}
                  label="Done"
                  name="completed"
                  checked={row.completed}
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
              {isBlankRow ? (
                <td className="align-center">
                  <PostFormElement
                    action={`/databases/${props.database.id}`}
                    id="add-row-inline-form"
                  >
                    <button
                      className="button"
                      type="submit"
                    >
                      Add
                    </button>
                  </PostFormElement>
                </td>
              ) : (
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
                    <button
                      type="submit"
                      hidden
                    >
                      Update
                    </button>
                  </form>
                  <RowActionsFlyoutMenu
                    row={row}
                    previousRow={props.filteredRows[filteredIndex - 1]}
                    nextRow={props.filteredRows[filteredIndex + 1]}
                    referrer={props.referrer}
                  />
                </td>
              )}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
