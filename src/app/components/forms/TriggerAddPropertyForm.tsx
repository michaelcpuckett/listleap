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
      className="text-color--CanvasText button--full-width expand-touch-target"
      tabIndex={props.tabindex}
      role={props.role || 'button'}
      aria-label="Add Property"
    >
      <svg
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        fill="currentColor"
        viewBox="125 175 250 250"
      >
        <use
          xmlnsXlink="http://www.w3.org/1999/xlink"
          xlinkHref="/icons.svg#plus"
        ></use>
      </svg>
    </a>
  );
}
