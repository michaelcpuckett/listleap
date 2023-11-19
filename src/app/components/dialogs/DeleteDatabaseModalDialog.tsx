import React from 'react';
import { AnyProperty, Database, PartialDatabase } from 'shared/types';
import { ModalDialogElement } from 'components/elements/ModalDialogElement';
import { DeleteDatabaseForm } from 'components/forms/DeleteDatabaseForm';

export function DeleteDatabaseModalDialog(
  props: React.PropsWithChildren<{
    database: PartialDatabase;
    closeUrl: string;
  }>,
) {
  return (
    <ModalDialogElement
      open
      heading={<>Delete Database</>}
      closeUrl={props.closeUrl}
    >
      <p>Are you sure you want to delete this database?</p>
      <blockquote>{props.database.name}</blockquote>
      <p>All data will be deleted.</p>
      <DeleteDatabaseForm database={props.database} />
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
