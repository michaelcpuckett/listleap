import { ButtonElement } from 'components/elements/ButtonElement';
import React from 'react';
import { PartialDatabase } from 'shared/types';

export function DeleteDatabaseForm(
  props: React.PropsWithoutRef<{
    database: PartialDatabase;
  }>,
) {
  return (
    <form
      action={`/databases/${props.database.id}`}
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
