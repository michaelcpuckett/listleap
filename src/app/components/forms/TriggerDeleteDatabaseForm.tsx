import { HyperLinkElement } from 'components/elements/HyperLinkElement';
import React from 'react';
import { PartialDatabase, Referrer } from 'shared/types';

export function TriggerDeleteDatabaseForm(
  props: React.PropsWithChildren<{
    database: PartialDatabase;
    referrer: Referrer;
  }>,
) {
  const urlPathname = '/';
  const url = new URL(props.referrer.url);
  url.pathname = urlPathname;
  const urlSearchParams = new URLSearchParams(url.search);
  urlSearchParams.set('mode', 'DELETE_DATABASE');
  urlSearchParams.set('id', props.database.id);
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
