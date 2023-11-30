import React from 'react';
import { AnyProperty, AnyRow, Database, Referrer } from 'shared/types';
import { FlyoutMenu, FlyoutMenuItem } from 'components/elements/FlyoutMenu';
import { ReorderRowUpForm } from 'components/forms/ReorderRowUpForm';
import { ReorderRowDownForm } from 'components/forms/ReorderRowDownForm';
import { TriggerEditRowForm } from 'components/forms/TriggerEditRowForm';
import { TriggerDeleteRowForm } from 'components/forms/TriggerDeleteRowForm';
import { AddNewRowBelowForm } from 'components/forms/AddNewRowBelowForm';
import { DeleteRowForm } from 'components/forms/DeleteRowForm';
import { AddNewRowAboveForm } from 'components/forms/AddNewRowAboveForm';

export function RowActionsFlyoutMenu(
  props: React.PropsWithChildren<{
    row: AnyRow;
    previousRow?: AnyRow;
    nextRow?: AnyRow;
    referrer: Referrer;
  }>,
) {
  return (
    <FlyoutMenu
      id={props.row.id}
      label="Row"
    >
      <FlyoutMenuItem>
        <ReorderRowUpForm
          row={props.row}
          prevRow={props.previousRow}
          isDisabled={!props.previousRow}
        />
      </FlyoutMenuItem>

      <FlyoutMenuItem>
        <ReorderRowDownForm
          row={props.row}
          nextRow={props.nextRow}
          isDisabled={!props.nextRow}
        />
      </FlyoutMenuItem>

      <FlyoutMenuItem>
        <AddNewRowAboveForm
          row={props.row}
          prevPosition={props.row.position}
          nextPosition={
            props.previousRow ? props.previousRow.position : undefined
          }
        />
      </FlyoutMenuItem>

      <FlyoutMenuItem>
        <AddNewRowBelowForm
          row={props.row}
          prevPosition={props.row.position}
          nextPosition={props.nextRow ? props.nextRow.position : undefined}
        />
      </FlyoutMenuItem>

      <FlyoutMenuItem>
        <TriggerEditRowForm
          row={props.row}
          referrer={props.referrer}
        />
      </FlyoutMenuItem>

      <FlyoutMenuItem>
        <DeleteRowForm row={props.row} />
      </FlyoutMenuItem>
    </FlyoutMenu>
  );
}
