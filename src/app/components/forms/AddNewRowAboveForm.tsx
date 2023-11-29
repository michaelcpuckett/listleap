import React from 'react';
import { Database, Property, AnyRow } from 'shared/types';
import { PostFormElement } from 'components/elements/PostFormElement';
import { LexoRank } from 'lexorank';
import { ButtonElement } from 'components/elements/ButtonElement';

export function AddNewRowAboveForm(
  props: React.PropsWithChildren<{
    prevPosition: string;
    nextPosition?: string;
    row: AnyRow;
  }>,
) {
  const prevPosition = LexoRank.parse(props.prevPosition);
  const nextPosition = props.nextPosition
    ? LexoRank.parse(props.nextPosition)
    : null;
  const position = nextPosition
    ? nextPosition.between(prevPosition).toString()
    : prevPosition.between(LexoRank.min()).toString();

  return (
    <PostFormElement
      action={`/databases/${props.row.databaseId}/rows`}
      id={`trigger-new-row-above-${props.row.id}-form`}
    >
      <input
        type="hidden"
        name="position"
        value={position}
      />
      <ButtonElement>Add Row Above</ButtonElement>
    </PostFormElement>
  );
}
