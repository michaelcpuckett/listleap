import React from 'react';
import { Row, Referrer, Property, Database } from 'shared/types';
import { ModalDialog } from 'components/dialogs/ModalDialog';
import { DeleteRowForm } from 'components/forms/DeleteRowForm';

export function DeleteRowModalDialog(
  props: React.PropsWithChildren<{
    row: Row<Property[]>;
    database: Database<Property[]>;
    closeUrl: string;
  }>,
) {
  return (
    <ModalDialog
      open
      heading={<>Edit Row</>}
      closeUrl={props.closeUrl}
    >
      <DeleteRowForm
        row={props.row}
        database={props.database}
      />
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
