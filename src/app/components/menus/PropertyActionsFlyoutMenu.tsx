import { FlyoutMenu, FlyoutMenuItem } from 'components/elements/FlyoutMenu';
import { AddNewPropertyAboveForm } from 'components/forms/AddNewPropertyAboveForm';
import { AddNewPropertyBelowForm } from 'components/forms/AddNewPropertyBelowForm';
import { ReorderPropertyDownForm } from 'components/forms/ReorderPropertyDownForm';
import { ReorderPropertyUpForm } from 'components/forms/ReorderPropertyUpForm';
import { SelectColumnForm } from 'components/forms/SelectColumnForm';
import { TriggerDeletePropertyForm } from 'components/forms/TriggerDeletePropertyForm';
import { TriggerEditPropertyForm } from 'components/forms/TriggerEditPropertyForm';
import React from 'react';
import { AnyProperty } from 'shared/types';

export function PropertyActionsFlyoutMenu(
  props: React.PropsWithChildren<{
    property: AnyProperty;
    previousProperty?: AnyProperty;
    nextProperty?: AnyProperty;
    query: Record<string, string>;
    url: string;
  }>,
) {
  return (
    <FlyoutMenu
      id={props.property.id}
      label={props.property.name}
    >
      <FlyoutMenuItem>
        <SelectColumnForm property={props.property} />
      </FlyoutMenuItem>
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
          query={props.query}
          url={props.url}
        />
      </FlyoutMenuItem>

      <FlyoutMenuItem>
        <TriggerDeletePropertyForm
          property={props.property}
          query={props.query}
          url={props.url}
        />
      </FlyoutMenuItem>
    </FlyoutMenu>
  );
}
