import React from 'react';
import { AnyDatabase, AnyProperty, Database, Property } from 'shared/types';
import { ModalDialog } from 'components/dialogs/ModalDialog';
import { EditPropertyForm } from 'components/forms/EditPropertyForm';

export function EditPropertyModalDialog(
  props: React.PropsWithChildren<{ property: AnyProperty; closeUrl: string }>,
) {
  return (
    <ModalDialog
      heading={<>Edit Property</>}
      open
      closeUrl={props.closeUrl}
    >
      <EditPropertyForm property={props.property} />
    </ModalDialog>
  );
}
