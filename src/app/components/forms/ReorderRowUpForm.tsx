import React from 'react';
import { AnyRow } from 'shared/types';

export function ReorderRowUpForm(
  props: React.PropsWithChildren<{
    row: AnyRow;
    prevRow?: AnyRow;
    isDisabled?: boolean;
    autofocus?: boolean;
    role?: string;
    tabindex?: number;
  }>,
) {
  return (
    <form
      action={`/databases/${props.row.databaseId}/rows/${props.row.id}`}
      method="POST"
      role="none"
    >
      <input
        type="hidden"
        name="_method"
        value="PATCH"
      />
      {props.prevRow ? (
        <input
          type="hidden"
          name="position"
          value={props.prevRow.position}
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
        Move Up
      </button>
    </form>
  );
}
