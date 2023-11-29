import { ButtonElement } from 'components/elements/ButtonElement';
import React from 'react';
import { Database, AnyProperty, Row } from 'shared/types';

export function EditRowForm(
  props: React.PropsWithoutRef<{
    row: Row<Database<AnyProperty[]>>;
    database: Database<AnyProperty[]>;
  }>,
) {
  return (
    <form
      noValidate
      action={`/databases/${props.row.databaseId}/rows/${props.row.id}`}
      method="POST"
      role="none"
    >
      <input
        type="hidden"
        name="_method"
        value="PUT"
      />
      {props.database.properties.map((property) => {
        return (
          <label key={property.id}>
            <span>{property.name}</span>
            <input
              className="input"
              id={'edit-' + props.row.id + '-' + property.id}
              name={property.id}
              aria-label={property.name}
              value={`${props.row[property.id] || ''}`}
            />
          </label>
        );
      })}
      <ButtonElement>Save</ButtonElement>
    </form>
  );
}
