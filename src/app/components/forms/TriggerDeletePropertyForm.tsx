import React from 'react';
import { AnyProperty, Referrer } from 'shared/types';

export function TriggerDeletePropertyForm(
  props: React.PropsWithChildren<{
    property: AnyProperty;
    referrer: Referrer;
    role?: string;
    tabindex?: number;
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
    <a
      href={href}
      className="button"
      tabIndex={props.tabindex}
      role={props.role || 'button'}
    >
      Delete
    </a>
  );
}
