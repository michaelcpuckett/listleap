import React from 'react';
import { AnyRow, Referrer } from '../../shared/types';
import { FlyoutMenu } from './FlyoutMenu';
import { ReorderRowUpForm } from '../forms/ReorderRowUpForm';
import { ReorderRowDownForm } from '../forms/ReorderRowDownForm';
import {TriggerEditRowForm} from '../forms/TriggerEditRowForm';
import {TriggerDeleteRowForm} from '../forms/TriggerDeleteRowForm';

export function RowActionsFlyoutMenu(props: React.PropsWithChildren<{ row: AnyRow; rows: AnyRow[]; filteredRows: AnyRow[]; filteredIndex: number; index: number; referrer: Referrer; }>) {
  return (
    <flyout-menu>
      <template shadowrootmode="open">
        <link rel="stylesheet" href="/flyout-menu.css" />
        <FlyoutMenu
          id={`${props.row.id}`}
          label={props.row.title}
        />
      </template>

      <ReorderRowUpForm
        row={props.row}
        index={props.row.index - 1}
        role="menuitem"
        tabindex={0}
      />
      <ReorderRowDownForm
        row={props.row}
        index={props.row.index + 1}
        role="menuitem"
        tabindex={-1}
      />
      <TriggerEditRowForm
        row={props.row}
        referrer={props.referrer}
        role="menuitem"
        tabindex={-1}
      />
      <TriggerDeleteRowForm
        row={props.row}
        index={props.index}
        referrer={props.referrer}
        role="menuitem"
        tabindex={-1}
      />
    </flyout-menu>
  );
}