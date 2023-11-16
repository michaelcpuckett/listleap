import React from 'react';
import { Database, AnyProperty, Row } from 'shared/types';

export function DeleteRowForm(
  props: React.PropsWithoutRef<{
    row: Row<Database<AnyProperty[]>>;
    database: Database<AnyProperty[]>;
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
      <button
        className="button"
        type="submit"
      >
        Delete
      </button>
    </form>
  );
}
