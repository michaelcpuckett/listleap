import React from 'react';
import { Database, AnyProperty } from 'shared/types';
import { AutoSaveTextElement } from 'components/elements/AutoSaveTextElement';

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
      <AutoSaveTextElement
        id={props.property.id}
        label="Name"
        name="name"
        value={props.property.name}
      />
      <button
        className="button"
        type="submit"
      >
        Save
      </button>
    </form>
  );
}
