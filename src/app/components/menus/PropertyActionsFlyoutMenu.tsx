import React from 'react';
import { AnyRow, AnyProperty, Referrer } from 'shared/types';
import { FlyoutMenu, FlyoutMenuItem } from 'components/elements/FlyoutMenu';
import { TriggerEditPropertyForm } from 'components/forms/TriggerEditPropertyForm';
import { TriggerDeletePropertyForm } from 'components/forms/TriggerDeletePropertyForm';
import { ReorderPropertyUpForm } from 'components/forms/ReorderPropertyUpForm';
import { ReorderPropertyDownForm } from 'components/forms/ReorderPropertyDownForm';
import { AddNewPropertyAboveForm } from 'components/forms/AddNewPropertyAboveForm';
import { AddNewPropertyBelowForm } from 'components/forms/AddNewPropertyBelowForm';

export function PropertyActionsFlyoutMenu(
  props: React.PropsWithChildren<{
    property: AnyProperty;
    previousProperty?: AnyProperty;
    nextProperty?: AnyProperty;
    referrer: Referrer;
    tabindex?: number;
  }>,
) {
  return (
    <FlyoutMenu
      id={props.property.id}
      label={props.property.name}
      tabindex={props.tabindex}
    >
      <FlyoutMenuItem>
        <ReorderPropertyUpForm
          property={props.property}
          prevProperty={props.previousProperty}
          isDisabled={!props.previousProperty}
        />
      </FlyoutMenuItem>
      <FlyoutMenuItem>
        <ReorderPropertyDownForm
          property={props.property}
          nextProperty={props.nextProperty}
          isDisabled={!props.nextProperty}
        />
      </FlyoutMenuItem>
      <FlyoutMenuItem>
        <AddNewPropertyAboveForm
          property={props.property}
          prevPosition={props.property.position}
          nextPosition={
            props.previousProperty ? props.previousProperty.position : undefined
          }
        />
      </FlyoutMenuItem>
      <FlyoutMenuItem>
        <AddNewPropertyBelowForm
          property={props.property}
          prevPosition={props.property.position}
          nextPosition={
            props.nextProperty ? props.nextProperty.position : undefined
          }
        />
      </FlyoutMenuItem>
      <FlyoutMenuItem>
        <TriggerEditPropertyForm
          property={props.property}
          referrer={props.referrer}
        />
      </FlyoutMenuItem>
      <FlyoutMenuItem>
        <TriggerDeletePropertyForm
          property={props.property}
          referrer={props.referrer}
        />
      </FlyoutMenuItem>
    </FlyoutMenu>
  );
}
