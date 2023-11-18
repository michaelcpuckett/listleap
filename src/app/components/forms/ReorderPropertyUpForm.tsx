import React from 'react';
import { AnyProperty } from 'shared/types';

export function ReorderPropertyUpForm(
  props: React.PropsWithChildren<{
    property: AnyProperty;
    prevProperty?: AnyProperty;
    isDisabled?: boolean;
    autofocus?: boolean;
    role?: string;
    tabindex?: number;
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
      <button
        className="button"
        tabIndex={props.tabindex}
        role={props.role}
        type={props.isDisabled ? 'button' : 'submit'}
        data-auto-focus={props.autofocus}
        aria-disabled={props.isDisabled}
      >
        Move Left
      </button>
    </form>
  );
}
