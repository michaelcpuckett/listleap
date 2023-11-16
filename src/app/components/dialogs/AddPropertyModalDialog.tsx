import React from 'react';
import { AnyDatabase, Database, Property } from 'shared/types';
import { ModalDialog } from 'components/dialogs/ModalDialog';
import { AddPropertyForm } from 'components/forms/AddPropertyForm';
import { EditPropertyForm } from 'components/forms/EditPropertyForm';

export function AddPropertyModalDialog(
  props: React.PropsWithChildren<{ database: AnyDatabase; closeUrl: string }>,
) {
  const properties = props.database.properties || [];

  return (
    <ModalDialog
      heading={<>Add Property</>}
      open
      closeUrl={props.closeUrl}
    >
      <AddPropertyForm database={props.database} />
    </ModalDialog>
  );
}
