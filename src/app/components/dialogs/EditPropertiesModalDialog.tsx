import React from 'react';
import { AnyDatabase, Database, Property } from 'shared/types';
import { ModalDialog } from 'components/dialogs/ModalDialog';
import { AddPropertyForm } from 'components/forms/AddPropertyForm';
import { EditPropertyForm } from 'components/forms/EditPropertyForm';

export function EditPropertiesModalDialog(props: React.PropsWithChildren<{ database: AnyDatabase; closeUrl: string; }>) {
  const properties = props.database.properties || [];

  return (
    <ModalDialog heading={<>Edit Properties</>} open closeUrl={props.closeUrl}>
      {properties.map((property) => <>
        <EditPropertyForm database={props.database} property={property} />
        <hr role="none" />
      </>)}
      <AddPropertyForm database={props.database} />
    </ModalDialog>
  );
}
