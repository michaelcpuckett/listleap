import React from 'react';
import { Row, Referrer, AnyProperty, Database } from 'shared/types';
import { ModalDialogElement } from 'components/elements/ModalDialogElement';
import { DeleteRowForm } from 'components/forms/DeleteRowForm';

export function DeleteRowModalDialog(
  props: React.PropsWithChildren<{
    row: Row<Database<AnyProperty[]>>;
    database: Database<AnyProperty[]>;
    closeUrl: string;
  }>,
) {
  return (
    <ModalDialogElement
      open
      heading={<>Delete Row</>}
      closeUrl={props.closeUrl}
    >
      <p>Are you sure you want to delete this row?</p>
      <dl>
        {props.database.properties.map((property) => (
          <React.Fragment key={property.id}>
            <dt>{property.name}</dt>
            <dd>{props.row[property.id]}</dd>
          </React.Fragment>
        ))}
      </dl>
      <DeleteRowForm row={props.row} />
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
