import React from 'react';
import { Database, Property, AnyProperty } from 'shared/types';
import { PostFormElement } from 'components/elements/PostFormElement';
import { LexoRank } from 'lexorank';

export function AddNewPropertyBelowForm(
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
    : prevPosition.genNext().toString();

  return (
    <PostFormElement
      action={`/databases/${props.property.databaseId}/properties`}
      id={`trigger-new-property-below-${props.property.id}-form`}
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
        Add Property to Right
      </button>
    </PostFormElement>
  );
}
