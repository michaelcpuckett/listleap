import { ButtonElement } from 'components/elements/ButtonElement';
import React from 'react';
import { AnyProperty, AnyRow } from 'shared/types';

export function ReorderPropertyDownForm(
  props: React.PropsWithoutRef<{
    property: AnyProperty;
    nextProperty?: AnyProperty;
    isDisabled?: boolean;
  }>,
) {
  return (
    <form
      action={`/databases/${props.property.databaseId}/properties/${props.property.id}`}
      method="POST"
      role="none"
    >
      <input
        type="hidden"
        name="_method"
        value="PATCH"
      />
      {props.nextProperty ? (
        <input
          type="hidden"
          name="position"
          value={props.nextProperty.position}
        />
      ) : null}
      <ButtonElement
        type={props.isDisabled ? 'button' : 'submit'}
        disabled={props.isDisabled}
      >
        Move Right
      </ButtonElement>
    </form>
  );
}
