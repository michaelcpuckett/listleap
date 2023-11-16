import React from 'react';
import { Referrer, AnyRow, Database, AnyProperty } from 'shared/types';

export function TriggerAddPropertyForm(
  props: React.PropsWithChildren<{
    database: Database<AnyProperty[]>;
    referrer: Referrer;
    role?: string;
    tabindex?: number;
  }>,
) {
  const urlPathname = `/databases/${props.database.id}/properties`;
  const url = new URL(props.referrer.url);
  const urlSearchParams = new URLSearchParams(url.search);
  urlSearchParams.delete('mode');
  url.pathname = urlPathname;
  url.search = urlSearchParams.toString();
  const href = url.href.replace(url.origin, '');

  return (
    <a
      href={href}
      className="button"
      tabIndex={props.tabindex}
      role={props.role || 'button'}
    >
      Add Property
    </a>
  );
}
