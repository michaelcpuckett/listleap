import React from 'react';
import { AnyDatabase, Database, Property } from 'shared/types';
import { ModalDialogElement } from 'components/elements/ModalDialogElement';
import { AddPropertyForm } from 'components/forms/AddPropertyForm';
import { EditPropertyForm } from 'components/forms/EditPropertyForm';

export function AddPropertyModalDialog(
  props: React.PropsWithChildren<{ database: AnyDatabase; closeUrl: string }>,
) {
  const properties = props.database.properties || [];

  return (
    <ModalDialogElement
      heading={<>Add Property</>}
      open
      closeUrl={props.closeUrl}
    >
      <AddPropertyForm database={props.database} />
    </ModalDialogElement>
  );
}
