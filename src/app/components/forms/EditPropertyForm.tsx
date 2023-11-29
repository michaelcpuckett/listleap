import React from 'react';
import { Database, AnyProperty } from 'shared/types';
import { AutoSaveTextElement } from 'components/elements/AutoSaveTextElement';
import { ButtonElement } from 'components/elements/ButtonElement';

export function EditPropertyForm(
  props: React.PropsWithChildren<{
    property: AnyProperty;
  }>,
) {
  return (
    <form
      noValidate
      autoComplete="off"
      action={`/databases/${props.property.databaseId}/properties/${props.property.id}`}
      method="POST"
    >
      <input
        type="hidden"
        name="_method"
        value="PATCH"
      />
      <input
        id={props.property.id}
        aria-label="Name"
        name="name"
        value={props.property.name}
      />
      <ButtonElement>Save</ButtonElement>
    </form>
  );
}
