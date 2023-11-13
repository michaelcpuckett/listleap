import React from 'react';
import { Database, Property } from 'shared/types';
import { AutoSaveTextElement } from 'components/elements/AutoSaveTextElement';

export function EditPropertyForm(
  props: React.PropsWithChildren<{
    database: Database<Property[]>;
    property: Property;
  }>,
) {
  return (
    <form
      noValidate
      action={`/databases/${props.database.id}/properties/${props.property.id}`}
      method="POST"
    >
      <input
        type="hidden"
        name="_method"
        value="PATCH"
      />
      <AutoSaveTextElement
        id={props.property.id}
        label="Name"
        name="name"
        value={props.property.name}
      />
    </form>
  );
}
