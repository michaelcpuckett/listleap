import { FlyoutMenu, FlyoutMenuItem } from 'components/elements/FlyoutMenu';
import { TriggerDeleteDatabaseForm } from 'components/forms/TriggerDeleteDatabaseForm';
import React from 'react';
import { PartialDatabase } from 'shared/types';

export function DatabaseActionsFlyoutMenu(
  props: React.PropsWithChildren<{
    database: PartialDatabase;
    query: Record<string, string>;
    url: string;
  }>,
) {
  return (
    <FlyoutMenu
      id={props.database.id}
      label={props.database.name}
    >
      <FlyoutMenuItem>
        <TriggerDeleteDatabaseForm
          query={props.query}
          database={props.database}
          url={props.url}
        />
      </FlyoutMenuItem>
    </FlyoutMenu>
  );
}
