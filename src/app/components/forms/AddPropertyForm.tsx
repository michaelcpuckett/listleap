import React from 'react';
import { Database, AnyProperty } from 'shared/types';
import { AutoSaveTextElement } from 'components/elements/AutoSaveTextElement';
import { PostFormElement } from 'components/elements/PostFormElement';
import { Icon } from 'components/icons/Icon';

export function AddPropertyForm(
  props: React.PropsWithChildren<{ database: Database<AnyProperty[]> }>,
) {
  return (
    <PostFormElement
      action={`/databases/${props.database.id}/properties`}
      id="add-property-form"
    >
      <input
        type="hidden"
        name="type"
        value="String"
      />
      <button
        type="submit"
        className="text-color--currentColor button--full-width"
        id="add-property-button"
        aria-label="Add Property"
      >
        <Icon name="plus" />
      </button>
    </PostFormElement>
  );
}
