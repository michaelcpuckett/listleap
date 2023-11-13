import React from 'react';
import { AnyRow, Referrer } from 'shared/types';
import { FlyoutMenu } from 'components/elements/FlyoutMenu';
import { ReorderRowUpForm } from 'components/forms/ReorderRowUpForm';
import { ReorderRowDownForm } from 'components/forms/ReorderRowDownForm';
import { TriggerEditRowForm } from 'components/forms/TriggerEditRowForm';
import { TriggerDeleteRowForm } from 'components/forms/TriggerDeleteRowForm';

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
      label={props.row.title}
    >
      <ReorderRowUpForm
        row={props.row}
        index={props.previousRow ? props.previousRow.index : -1}
        isDisabled={!props.previousRow}
        role="menuitem"
      />
      <ReorderRowDownForm
        row={props.row}
        index={props.nextRow ? props.nextRow.index : -1}
        isDisabled={!props.nextRow}
        role="menuitem"
      />
      <TriggerEditRowForm
        row={props.row}
        referrer={props.referrer}
        role="menuitem"
      />
      <TriggerDeleteRowForm
        row={props.row}
        referrer={props.referrer}
        role="menuitem"
      />
    </FlyoutMenu>
  );
}
