import React from 'react';
import { PartialDatabase } from 'shared/types';

export function DeleteDatabaseForm(
  props: React.PropsWithoutRef<{
    database: PartialDatabase;
    role?: string;
    tabindex?: number;
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
      <button
        className="button"
        type="submit"
        role={props.role}
        tabIndex={props.tabindex}
      >
        Delete
      </button>
    </form>
  );
}
