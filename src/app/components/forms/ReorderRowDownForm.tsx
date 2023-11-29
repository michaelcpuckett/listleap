import { ButtonElement } from 'components/elements/ButtonElement';
import React from 'react';
import { AnyRow } from 'shared/types';

export function ReorderRowDownForm(
  props: React.PropsWithoutRef<{
    row: AnyRow;
    nextRow?: AnyRow;
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
      {props.nextRow ? (
        <input
          type="hidden"
          name="position"
          value={props.nextRow.position}
        />
      ) : null}
      <ButtonElement
        type={props.isDisabled ? 'button' : 'submit'}
        disabled={props.isDisabled}
      >
        Move Down
      </ButtonElement>
    </form>
  );
}
