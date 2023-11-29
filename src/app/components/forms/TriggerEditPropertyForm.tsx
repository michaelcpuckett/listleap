import { LinkElement } from 'components/elements/LinkElement';
import React from 'react';
import { Referrer, AnyProperty } from 'shared/types';

export function TriggerEditPropertyForm(
  props: React.PropsWithChildren<{
    property: AnyProperty;
    referrer: Referrer;
  }>,
) {
  const urlPathname = `/databases/${props.property.databaseId}/properties/${props.property.id}`;
  const url = new URL(props.referrer.url);
  const urlSearchParams = new URLSearchParams(url.search);
  urlSearchParams.delete('mode');
  url.pathname = urlPathname;
  url.search = urlSearchParams.toString();
  const href = url.href.replace(url.origin, '');

  return (
    <LinkElement
      href={href}
      button
      role="button"
    >
      Edit
    </LinkElement>
  );
}
