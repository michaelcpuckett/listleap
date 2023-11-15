import React from 'react';
import { AnyRow, Property, Referrer } from 'shared/types';
import { FlyoutMenu } from 'components/elements/FlyoutMenu';

export function PropertyActionsFlyoutMenu(
  props: React.PropsWithChildren<{
    property: Property;
  }>,
) {
  return (
    <FlyoutMenu
      id={props.property.id}
      label={props.property.name}
    ></FlyoutMenu>
  );
}
