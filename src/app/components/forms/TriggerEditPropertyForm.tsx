import { HyperLinkElement } from 'components/elements/HyperLinkElement';
import React from 'react';
import { AnyProperty } from 'shared/types';

export function TriggerEditPropertyForm(
  props: React.PropsWithChildren<{
    property: AnyProperty;
    query: Record<string, string>;
    url: string;
  }>,
) {
  const urlPathname = `/databases/${props.property.databaseId}/properties/${props.property.id}`;
  const url = new URL(props.url);
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
