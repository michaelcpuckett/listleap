import { HyperLinkElement } from 'components/elements/HyperLinkElement';
import React from 'react';
import { AnyProperty, Referrer } from 'shared/types';

export function TriggerDeletePropertyForm(
  props: React.PropsWithChildren<{
    property: AnyProperty;
    referrer: Referrer;
  }>,
) {
  const urlPathname = `/databases/${props.property.databaseId}/properties/${props.property.id}`;
  const url = new URL(props.referrer.url);
  url.pathname = urlPathname;
  const urlSearchParams = new URLSearchParams(url.search);
  urlSearchParams.set('mode', 'DELETE_PROPERTY');
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
