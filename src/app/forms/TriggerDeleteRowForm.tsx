import React from 'react';
import { AnyRow, Referrer } from '../../shared/types';

export function TriggerDeleteRowForm(props: React.PropsWithChildren<{ row: AnyRow; referrer: Referrer; autofocus?: boolean; role?: string; tabindex?: number; }>) {
  const url = new URL(props.referrer.url);
  url.pathname = `/databases/${props.row.databaseId}/rows/${props.row.id}`;
  url.searchParams.set('mode', 'DELETE_ROW');

  return (
    <a
      href={url.href}
      className="button"
      tabIndex={props.tabindex}
      role={props.role || 'button'}
      data-auto-focus={props.autofocus}>
      Delete
    </a>
  )
}