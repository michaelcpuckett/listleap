import React from 'react';
import {Database, Property, Row} from 'shared/types';

export function DeleteRowForm(props: React.PropsWithoutRef<{ row: Row<Property[]>; database: Database<Property[]>; }>) {
  return (
    <form action={`/databases/${props.row.databaseId}/rows/${props.row.id}`} method="POST" role="none">
      <input type="hidden" name="_method" value="DELETE" />
      <button className="button" type="submit">
        Delete
      </button>
    </form>
  );
}