import React from 'react';
import { AnyProperty, Database, Row } from 'shared/types';
import { ModalDialogElement } from 'components/elements/ModalDialogElement';
import { EditRowForm } from 'components/forms/EditRowForm';

export function EditRowModalDialog(
  props: React.PropsWithChildren<{
    row: Row<Database<AnyProperty[]>>;
    database: Database<AnyProperty[]>;
    closeUrl: string;
  }>,
) {
  return (
    <ModalDialogElement
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
    </ModalDialogElement>
  );
}
