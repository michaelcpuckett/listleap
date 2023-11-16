import React from 'react';
import { AnyProperty, Database, Row } from 'shared/types';
import { ModalDialog } from 'components/dialogs/ModalDialog';
import { EditRowForm } from 'components/forms/EditRowForm';

export function EditRowModalDialog(
  props: React.PropsWithChildren<{
    row: Row<Database<AnyProperty[]>>;
    database: Database<AnyProperty[]>;
    closeUrl: string;
  }>,
) {
  return (
    <ModalDialog
      open
      heading={<>Edit Row</>}
      closeUrl={props.closeUrl}
    >
      <EditRowForm
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
