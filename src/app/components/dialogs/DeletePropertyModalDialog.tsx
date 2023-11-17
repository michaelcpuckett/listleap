import React from 'react';
import { AnyProperty, Database } from 'shared/types';
import { ModalDialog } from 'components/dialogs/ModalDialog';
import { DeletePropertyForm } from 'components/forms/DeletePropertyForm';

export function DeletePropertyModalDialog(
  props: React.PropsWithChildren<{
    property: AnyProperty;
    closeUrl: string;
  }>,
) {
  return (
    <ModalDialog
      open
      heading={<>Delete Property</>}
      closeUrl={props.closeUrl}
    >
      <p>Are you sure you want to delete this property?</p>
      <blockquote>{props.property.name}</blockquote>
      <p>Data will be deleted from all rows.</p>
      <DeletePropertyForm property={props.property} />
      <a
        href={props.closeUrl}
        role="button"
        className="button"
      >
        Cancel
      </a>
    </ModalDialog>
  );
}
