import { Icon } from 'components/icons/Icon';
import React from 'react';
import { getUniqueId } from 'shared/getUniqueId';
import { DisclosureWidgetElement } from './DisclosureWidgetElement';

export function FlyoutMenuItem(props: React.PropsWithChildren<{}>) {
  return (
    <flyout-menu-item
      role="menuitem"
      tabindex="-1"
    >
      <template
        shadowrootmode="open"
        shadowrootdelegatesfocus="true"
      >
        <link
          rel="stylesheet"
          href="/host.css"
        />
        <slot></slot>
      </template>
      {props.children}
    </flyout-menu-item>
  );
}

export function FlyoutMenu(
  props: React.PropsWithChildren<{
    id: string;
    label: string;
  }>,
) {
  return (
    <flyout-menu id={getUniqueId()}>
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
      <DisclosureWidgetElement role="none">
        <summary
          part="button"
          id={`rows-actions-menu-trigger--${props.id}`}
          aria-controls={`rows-actions-menu--${props.id}`}
          role="button"
          aria-label={`Actions for ${props.label}`}
          aria-haspopup="true"
        >
          <Icon name="dots-vertical" />
        </summary>
        <div
          role="menu"
          id={`rows-actions-menu--${props.id}`}
          aria-labelledby={`rows-actions-menu-trigger--${props.id}`}
        >
          {props.children}
        </div>
      </DisclosureWidgetElement>
    </flyout-menu>
  );
}
