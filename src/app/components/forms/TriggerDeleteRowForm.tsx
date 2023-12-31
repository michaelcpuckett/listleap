import { HyperLinkElement } from 'components/elements/HyperLinkElement';
import React from 'react';
import { AnyRow } from 'shared/types';

export function TriggerDeleteRowForm(
  props: React.PropsWithChildren<{
    row: AnyRow;
    query: Record<string, string>;
    url: string;
  }>,
) {
  const urlPathname = `/databases/${props.row.databaseId}/rows/${props.row.id}`;
  const url = new URL(props.url);
  url.pathname = urlPathname;
  const urlSearchParams = new URLSearchParams(url.search);
  urlSearchParams.set('mode', 'DELETE_ROW');
  url.search = urlSearchParams.toString();
  const href = url.href.replace(url.origin, '');

  return (
    <HyperLinkElement
      href={href}
      button
      role="button"
    >
      Delete
    </HyperLinkElement>
  );
}
