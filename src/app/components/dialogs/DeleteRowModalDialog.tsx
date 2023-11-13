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
      heading={<>Delete Row</>}
      closeUrl={props.closeUrl}
    >
      <p>Are you sure you want to delete this row?</p>
      <dl>
        <React.Fragment key="title">
          <dt>Title</dt>
          <dd>{props.row.title}</dd>
        </React.Fragment>
        {props.database.properties.map((property) => (
          <React.Fragment key={property.id}>
            <dt>{property.name}</dt>
            <dd>{props.row[property.id]}</dd>
          </React.Fragment>
        ))}
      </dl>
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
