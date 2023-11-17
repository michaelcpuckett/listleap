import React from 'react';
import { AnyProperty } from 'shared/types';

export function DeletePropertyForm(
  props: React.PropsWithoutRef<{
    property: AnyProperty;
  }>,
) {
  return (
    <form
      action={`/databases/${props.property.databaseId}/properties/${props.property.id}`}
      method="POST"
      role="none"
    >
      <input
        type="hidden"
        name="_method"
        value="DELETE"
      />
      <button
        className="button"
        type="submit"
      >
        Delete
      </button>
    </form>
  );
}
