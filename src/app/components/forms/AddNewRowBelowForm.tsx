import React from 'react';
import { Database, Property, AnyRow } from 'shared/types';
import { PostFormElement } from 'components/elements/PostFormElement';
import { LexoRank } from 'lexorank';

export function AddNewRowBelowForm(
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
    : prevPosition.genNext().toString();

  return (
    <PostFormElement
      action={`/databases/${props.row.databaseId}/rows`}
      id={`trigger-new-row-below-${props.row.id}-form`}
    >
      <input
        type="hidden"
        name="position"
        value={position}
      />
      <button
        type="submit"
        className="button"
      >
        Add Row Below
      </button>
    </PostFormElement>
  );
}
