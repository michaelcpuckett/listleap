import React from 'react';
import { AnyProperty, AnyRow } from 'shared/types';

export function ReorderPropertyDownForm(
  props: React.PropsWithoutRef<{
    property: AnyProperty;
    nextProperty?: AnyProperty;
    autofocus?: boolean;
    isDisabled?: boolean;
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
      {props.nextProperty ? (
        <input
          type="hidden"
          name="position"
          value={props.nextProperty.position}
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
        Move Right
      </button>
    </form>
  );
}
