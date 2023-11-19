import React from 'react';
import { AnyProperty, AnyRow, Database, Referrer } from 'shared/types';
import { FlyoutMenu } from 'components/elements/FlyoutMenu';
import { ReorderRowUpForm } from 'components/forms/ReorderRowUpForm';
import { ReorderRowDownForm } from 'components/forms/ReorderRowDownForm';
import { TriggerEditRowForm } from 'components/forms/TriggerEditRowForm';
import { TriggerDeleteRowForm } from 'components/forms/TriggerDeleteRowForm';
import { TriggerNewRowBelowForm } from 'components/forms/TriggerNewRowBelowForm';
import { DeleteRowForm } from 'components/forms/DeleteRowForm';

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
      <TriggerNewRowBelowForm
        row={props.row}
        prevPosition={props.row.position}
        nextPosition={props.nextRow ? props.nextRow.position : undefined}
        role="menuitem"
      />
      <TriggerEditRowForm
        row={props.row}
        referrer={props.referrer}
        role="menuitem"
      />
      <DeleteRowForm
        row={props.row}
        role="menuitem"
      />
    </FlyoutMenu>
  );
}
