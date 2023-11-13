import React from 'react';
import { AnyRow, Referrer } from 'shared/types';

export function TriggerDeleteRowForm(props: React.PropsWithChildren<{ row: AnyRow; referrer: Referrer; autofocus?: boolean; role?: string; tabindex?: number; }>) {
  const urlPathname = `/databases/${props.row.databaseId}/rows/${props.row.id}`;
  const url = new URL(props.referrer.url);
  url.pathname = urlPathname;
  const urlSearchParams = new URLSearchParams(url.search);
  urlSearchParams.set('mode', 'DELETE_ROW');
  url.search = urlSearchParams.toString();
  const href = url.href.replace(url.origin, '');

  return (
    <a
      href={href}
      className="button"
      tabIndex={props.tabindex}
      role={props.role || 'button'}
      data-auto-focus={props.autofocus}>
      Delete
    </a>
  )
}