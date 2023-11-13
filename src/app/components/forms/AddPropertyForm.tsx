import React from 'react';
import { Database, Property } from 'shared/types';
import { AutoSaveTextElement } from 'components/elements/AutoSaveTextElement';
import { PostFormElement } from 'components/elements/PostFormElement';

export function AddPropertyForm(
  props: React.PropsWithChildren<{ database: Database<Property[]> }>,
) {
  return (
    <PostFormElement
      action={`/databases/${props.database.id}/properties`}
      id="add-row-inline-form"
    >
      <input
        type="hidden"
        name="type"
        value="String"
      />
      <label>
        <span>Name</span>
        <AutoSaveTextElement
          id={props.database.id + '-new-property'}
          label="Name"
          name="name"
          value=""
        />
      </label>
      <button
        className="button"
        type="submit"
      >
        Add
      </button>
    </PostFormElement>
  );
}
