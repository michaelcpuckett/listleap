import React from 'react';
import { Database, Property, AnyRow, AnyProperty } from 'shared/types';
import { PostFormElement } from 'components/elements/PostFormElement';
import { LexoRank } from 'lexorank';

export function AddNewPropertyAboveForm(
  props: React.PropsWithChildren<{
    prevPosition: string;
    nextPosition?: string;
    property: AnyProperty;
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
      action={`/databases/${props.property.databaseId}/properties`}
      id={`trigger-new-property-above-${props.property.id}-form`}
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
        Add Property to Left
      </button>
    </PostFormElement>
  );
}
