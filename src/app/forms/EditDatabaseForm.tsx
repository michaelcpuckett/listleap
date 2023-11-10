import React from 'react';
import { AnyDatabase } from '../../shared/types';
import { AutoSaveTextElement } from '../elements/AutoSaveTextElement';

export function EditDatabaseForm(props: React.PropsWithChildren<{ database: AnyDatabase; }>) {
  return (
    <form action={`/databases/${props.database.id}`} method="POST" role="none">
      <input type="hidden" name="_method" value="PATCH" />
      <h1>
        <AutoSaveTextElement
          name="name"
          label="Name"
          value={props.database.name}
          id={props.database.id}
        />
      </h1>
      <button type="button" hidden>
        Edit
      </button>
    </form>
  );
}