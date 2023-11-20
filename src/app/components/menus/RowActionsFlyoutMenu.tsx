import React from 'react';
import { AnyProperty, AnyRow, Database, Referrer } from 'shared/types';
import { FlyoutMenu } from 'components/elements/FlyoutMenu';
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
    tabindex?: number;
  }>,
) {
  return (
    <FlyoutMenu
      id={props.row.id}
      label="Row"
      tabindex={props.tabindex}
    >
      <ReorderRowUpForm
        row={props.row}
        prevRow={props.previousRow}
        isDisabled={!props.previousRow}
        role="menuitem"
      />
      <ReorderRowDownForm
        row={props.row}
        nextRow={props.nextRow}
        isDisabled={!props.nextRow}
        role="menuitem"
      />
      <AddNewRowAboveForm
        row={props.row}
        prevPosition={props.row.position}
        nextPosition={
          props.previousRow ? props.previousRow.position : undefined
        }
      />
      <AddNewRowBelowForm
        row={props.row}
        prevPosition={props.row.position}
        nextPosition={props.nextRow ? props.nextRow.position : undefined}
      />
      <TriggerEditRowForm
        row={props.row}
        referrer={props.referrer}
      />
      <DeleteRowForm row={props.row} />
    </FlyoutMenu>
  );
}
