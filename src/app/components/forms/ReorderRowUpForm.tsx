import { ButtonElement } from 'components/elements/ButtonElement';
import React from 'react';
import { AnyRow } from 'shared/types';

export function ReorderRowUpForm(
  props: React.PropsWithChildren<{
    row: AnyRow;
    prevRow?: AnyRow;
    isDisabled?: boolean;
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
      <ButtonElement
        type={props.isDisabled ? 'button' : 'submit'}
        disabled={props.isDisabled}
      >
        Move Up
      </ButtonElement>
    </form>
  );
}
