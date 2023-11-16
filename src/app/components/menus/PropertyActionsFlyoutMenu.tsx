import React from 'react';
import { AnyRow, AnyProperty, Referrer } from 'shared/types';
import { FlyoutMenu } from 'components/elements/FlyoutMenu';
import { TriggerEditPropertyForm } from 'components/forms/TriggerEditPropertyForm';

export function PropertyActionsFlyoutMenu(
  props: React.PropsWithChildren<{
    property: AnyProperty;
    referrer: Referrer;
  }>,
) {
  return (
    <FlyoutMenu
      id={props.property.id}
      label={props.property.name}
    >
      <TriggerEditPropertyForm
        property={props.property}
        referrer={props.referrer}
        role="menuitem"
      />
    </FlyoutMenu>
  );
}
