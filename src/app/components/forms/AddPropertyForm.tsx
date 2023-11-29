import React from 'react';
import { Database, AnyProperty } from 'shared/types';
import { AutoSaveTextElement } from 'components/elements/AutoSaveTextElement';
import { PostFormElement } from 'components/elements/PostFormElement';
import { Icon } from 'components/icons/Icon';
import { ButtonElement } from 'components/elements/ButtonElement';

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
      <ButtonElement
        full-width
        currentColor
        button={false}
        id="add-property-button"
        label="Add Property"
      >
        <Icon name="plus" />
      </ButtonElement>
    </PostFormElement>
  );
}
