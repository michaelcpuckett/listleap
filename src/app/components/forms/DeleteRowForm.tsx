import { ButtonElement } from 'components/elements/ButtonElement';
import React from 'react';
import { Database, AnyProperty, Row } from 'shared/types';

export function DeleteRowForm(
  props: React.PropsWithoutRef<{
    row: Row<Database<AnyProperty[]>>;
  }>,
) {
  return (
    <form
      action={`/databases/${props.row.databaseId}/rows/${props.row.id}`}
      method="POST"
      role="none"
    >
      <input
        type="hidden"
        name="_method"
        value="DELETE"
      />
      <ButtonElement>Delete</ButtonElement>
    </form>
  );
}
