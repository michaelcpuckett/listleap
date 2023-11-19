import React from 'react';
import { AnyDatabase, AnyProperty, Database, Property } from 'shared/types';
import { ModalDialogElement } from 'components/elements/ModalDialogElement';
import { EditPropertyForm } from 'components/forms/EditPropertyForm';

export function EditPropertyModalDialog(
  props: React.PropsWithChildren<{ property: AnyProperty; closeUrl: string }>,
) {
  return (
    <ModalDialogElement
      heading={<>Edit Property</>}
      open
      closeUrl={props.closeUrl}
    >
      <EditPropertyForm property={props.property} />
    </ModalDialogElement>
  );
}
