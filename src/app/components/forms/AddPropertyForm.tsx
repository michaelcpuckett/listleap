import React from 'react';
import { Database, AnyProperty } from 'shared/types';
import { AutoSaveTextElement } from 'components/elements/AutoSaveTextElement';
import { PostFormElement } from 'components/elements/PostFormElement';

export function AddPropertyForm(
  props: React.PropsWithChildren<{ database: Database<AnyProperty[]> }>,
) {
  return (
    <PostFormElement
      action={`/databases/${props.database.id}/properties`}
      id="add-row-form"
    >
      <input
        type="hidden"
        name="type"
        value="String"
      />
      <label>
        <span>Property</span>
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
