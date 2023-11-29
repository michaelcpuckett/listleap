import { ButtonElement } from 'components/elements/ButtonElement';
import React from 'react';
import { AnyProperty } from 'shared/types';

export function ReorderPropertyUpForm(
  props: React.PropsWithChildren<{
    property: AnyProperty;
    prevProperty?: AnyProperty;
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
      {props.prevProperty ? (
        <input
          type="hidden"
          name="position"
          value={props.prevProperty.position}
        />
      ) : null}
      <ButtonElement
        type={props.isDisabled ? 'button' : 'submit'}
        disabled={props.isDisabled}
      >
        Move Left
      </ButtonElement>
    </form>
  );
}
