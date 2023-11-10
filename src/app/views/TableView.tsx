import React from "react";
import { Property, Referrer, Table, TableRow } from '../../shared/types';
import {RowActionsFlyoutMenu} from '../menus/RowActionsFlyoutMenu';

export function TableView(
  props: React.PropsWithoutRef<{ database: Table<Property[]>; referrer: Referrer; }>
) {
  const rows = props.database.rows;
  const properties = props.database.properties;

  const queriedRows: TableRow<Property[]>[] = rows.filter((row: TableRow<Property[]>) => {
    if (!props.referrer.query) {
      return true;
    }

    interface StringProperty extends Property {
      type: StringConstructor;
    };

    const guardIsStringProperty = (property: Property): property is StringProperty => {
      return property.type === String;
    };

    const getPropertyId = (property: StringProperty) => property.id;

    const allStringProperties = properties.filter(guardIsStringProperty).map(getPropertyId) as Array<StringProperty['id']>;

    return !!allStringProperties.find((stringProperty: StringProperty['id']) => {
      if (!props.referrer.query) {
        return false;
      }

      return (row[stringProperty] as string || '').toLowerCase().includes(props.referrer.query.toLowerCase());
    });
  });

  const gridColumnsCss = `minmax(0, 1fr) ${properties.length ? `repeat(${properties.length}, minmax(0, 1fr))` : ''} auto`;

  return (
    <table className="table-view" style={{
      '--grid-columns': gridColumnsCss,
    }}>
      <thead>
        <tr>
          <th>
            Title
          </th>
          {properties.map((property) => (
            <th>
              {property.name}
            </th>
          ))}
          <th className="align-center">
            Actions
          </th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row, index, { length }) => {
          const filteredIndex = queriedRows.findIndex((t) => t.id === row.id);

          if (filteredIndex === -1) {
            return null;
          }

          return (
            <tr
              aria-label={row.title}>
              <td>
                <input
                  form={`edit-row-inline-form--${row.id}`}
                  id={`edit-row-inline-form-field--${row.id}--title`}
                  autoComplete="off"
                  aria-label="Title"
                  type="text"
                  className="input"
                  name="title"
                  value={row.title}
                />
                <svg className="unsaved-indicator" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="black" viewBox="-2.5 0 19 19">
                  <use xmlnsXlink='http://www.w3.org/1999/xlink' xlinkHref='/icons.svg#floppy-disk'></use>
                </svg>
              </td>
              {properties.map((property) => {
                const value = 
                  (typeof row[property.id] === 'boolean' ? (row[property.id] ? 'Yes' : 'No') : '') ||
                  (typeof row[property.id] === 'string' && `${row[property.id]}`) ||
                  (typeof row[property.id] === 'number' && property.name !== 'id' && `${row[property.id]}`) || '';
                
                return (
                  <td>
                    <input
                      id={`edit-row-inline-form-field--${row.id}--${property.id}`}
                      autoComplete="off"
                      aria-label={property.name}
                      form={`edit-row-inline-form--${row.id}`}
                      type="text" name={`${property.id}`}
                      className="contenteditable"
                      value={value}
                    />
                    <svg className="unsaved-indicator" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="black" viewBox="-2.5 0 19 19">
                      <use xmlnsXlink='http://www.w3.org/1999/xlink' xlinkHref='/icons.svg#floppy-disk'></use>
                    </svg>
                  </td>
                );
              })}
              <td className="align-center" aria-label={`Actions for ${row.title}`}>
                <form method="POST" action={`/api/databases/${props.database.id}/rows/${row.id}`} id={`edit-row-inline-form--${row.id}`} role="none">
                  <input type="hidden" name="_method" value="PUT" />
                  <button type="submit" hidden>
                    Update
                  </button>
                </form>
                <RowActionsFlyoutMenu
                  row={row}
                  rows={rows}
                  index={index}
                  filteredIndex={filteredIndex}
                  filteredRows={queriedRows}
                  referrer={props.referrer}
                />
              </td>
            </tr>
          );
        })}
        <tr>
          <td>
            <input
              aria-label="Title"
              autoComplete="off"
              type="text"
              name="title"
              form="add-row-form"
              placeholder="Title"
              className="contenteditable"
              value=""
            />
            <svg className="unsaved-indicator" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="black" viewBox="-2.5 0 19 19">
              <use xmlnsXlink='http://www.w3.org/1999/xlink' xlinkHref='/icons.svg#floppy-disk'></use>
            </svg>
          </td>
          {properties.map((property) => {
            return (
              <td>
                <input
                  aria-label={property.name}
                  autoComplete="off"
                  className="contenteditable"
                  form="add-row-form"
                  key={property.id}
                  type="text"
                  name={`${property.id}`}
                  placeholder={property.name}
                  value=""
                />
                <svg className="unsaved-indicator" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="black" viewBox="-2.5 0 19 19">
                  <use xmlnsXlink='http://www.w3.org/1999/xlink' xlinkHref='/icons.svg#floppy-disk'></use>
                </svg>
              </td>
            );
          })}
          <td className="align-center">
            <form action={`/databases/${props.database.id}`} method="POST" role="none" id="add-row-form" data-auto-save="false">
              <input type="hidden" name="_method" value="POST" />
              <button type="submit" className="button">
                Add
              </button>
            </form>
          </td>
        </tr>
      </tbody>
    </table>
  );
}
