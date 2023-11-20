import React from 'react';
import { getUniqueId } from 'shared/getUniqueId';

export function FlyoutMenu(
  props: React.PropsWithChildren<{
    id: string;
    label: string;
    tabindex?: number;
  }>,
) {
  return (
    <flyout-menu
      id={getUniqueId()}
      tabIndex={props.tabindex ?? 0}
    >
      <template
        shadowrootmode="open"
        shadowrootdelegatesfocus=""
      >
        <link
          rel="stylesheet"
          href="/host.css"
        />
        <slot></slot>
      </template>
      <details role="none">
        <summary
          part="button"
          id={`rows-actions-menu-trigger--${props.id}`}
          aria-controls={`rows-actions-menu--${props.id}`}
          role="button"
          aria-label={`Actions for ${props.label}`}
          aria-haspopup="true"
        >
          <svg
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            width="22"
            height="22"
            fill="currentColor"
          >
            <use
              xmlnsXlink="http://www.w3.org/1999/xlink"
              xlinkHref="#dots-vertical"
            ></use>
          </svg>
        </summary>
        <div
          role="menu"
          id={`rows-actions-menu--${props.id}`}
          aria-labelledby={`rows-actions-menu-trigger--${props.id}`}
        >
          {props.children}
        </div>
      </details>
    </flyout-menu>
  );
}
