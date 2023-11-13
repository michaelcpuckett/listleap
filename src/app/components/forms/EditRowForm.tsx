import React from 'react';
import {Database, Property, Row} from 'shared/types';
import {guardIsChecklistRow} from 'shared/assertions';

export function EditRowForm(props: React.PropsWithoutRef<{ row: Row<Property[]>; database: Database<Property[]>; }>) {
  return (
    <form action={`/databases/${props.row.databaseId}/rows/${props.row.id}`} method="POST" role="none">
      <input type="hidden" name="_method" value="PUT" />
      {guardIsChecklistRow(props.row, props.database) ? (
        <input
          id={`edit-row-inline-form-field--${props.row.id}--completed`}
          name="completed"
          type="checkbox"
          className="input"
          checked={props.row.completed}
        />
      ) : null}
      <label>
        <span>Title</span>
        <input
          autoComplete="off"
          data-auto-focus="true"
          required
          type="text"
          name="title"
          placeholder="Title"
          className="input"
          value={props.row.title}
        />
      </label>
      {props.database.properties.map((property) => {
        return (
          <label>
            <span>{property.name}</span>
            <input
              key={property.id}
              type="text"
              className="input"
              name={`${property.id}`}
              placeholder={property.name}
              value={`${props.row[property.id] || ''}`}
            />
          </label>
        );
      })}
      <button className="button" type="submit">
        Save
      </button>
    </form>
  );
}