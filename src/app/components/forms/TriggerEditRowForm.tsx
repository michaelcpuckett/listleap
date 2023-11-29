import { HyperLinkElement } from 'components/elements/HyperLinkElement';
import React from 'react';
import { Referrer, AnyRow } from 'shared/types';

export function TriggerEditRowForm(
  props: React.PropsWithChildren<{
    row: AnyRow;
    referrer: Referrer;
  }>,
) {
  const urlPathname = `/databases/${props.row.databaseId}/rows/${props.row.id}`;
  const url = new URL(props.referrer.url);
  const urlSearchParams = new URLSearchParams(url.search);
  urlSearchParams.delete('mode');
  url.pathname = urlPathname;
  url.search = urlSearchParams.toString();
  const href = url.href.replace(url.origin, '');

  return (
    <HyperLinkElement
      href={href}
      button
      role="button"
    >
      Edit
    </HyperLinkElement>
  );
}
