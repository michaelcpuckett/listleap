import React from 'react';
import { Database, Property } from '../../shared/types';
import { AutoSaveTextElement } from '../elements/AutoSaveTextElement';

export function AddPropertyForm(props: React.PropsWithChildren<{database: Database<Property[]>}>) {
  return (
    <form noValidate action={`/databases/${props.database.id}/properties`} method="POST">
      <input type="hidden" name="_method" value="POST" />
      <input type="hidden" name="type" value="String" />
      <label>
        <span>Name</span>
        <AutoSaveTextElement
          id={props.database.id + '-new-property'}
          label="Name"
          name="name"
          value=""
        />
      </label>
      <button className="button" type="submit">Add</button>
    </form>
  );
}