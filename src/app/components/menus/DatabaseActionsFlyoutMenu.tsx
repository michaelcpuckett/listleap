import React from 'react';
import { Referrer, AnyDatabase, PartialDatabase } from 'shared/types';
import { FlyoutMenu, FlyoutMenuItem } from 'components/elements/FlyoutMenu';
import { TriggerDeleteDatabaseForm } from 'components/forms/TriggerDeleteDatabaseForm';

export function DatabaseActionsFlyoutMenu(
  props: React.PropsWithChildren<{
    database: PartialDatabase;
    referrer: Referrer;
    tabindex?: number;
  }>,
) {
  return (
    <FlyoutMenu
      id={props.database.id}
      label={props.database.name}
      tabindex={props.tabindex}
    >
      <FlyoutMenuItem>
        <TriggerDeleteDatabaseForm
          referrer={props.referrer}
          database={props.database}
        />
      </FlyoutMenuItem>
    </FlyoutMenu>
  );
}
