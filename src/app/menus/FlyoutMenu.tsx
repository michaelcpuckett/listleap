import React from 'react';

export function FlyoutMenu(props: React.PropsWithChildren<{ id: string; label: string; autofocus?: boolean; }>) {
  return (
    <details role="none">
      <summary
        id={`rows-actions-menu-trigger--${props.id}`}
        aria-controls={`rows-actions-menu--${props.id}`}
        role="button"
        aria-label={`Actions for ${props.label}`}
        aria-haspopup="true"
        autoFocus={props.autofocus}>
        <svg aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="black" viewBox="0 0 16 16">
          <use xmlnsXlink='http://www.w3.org/1999/xlink' xlinkHref='/icons.svg#dots-vertical'></use>
        </svg>
      </summary>
      <div
        role="menu"
        id={`rows-actions-menu--${props.id}`}
        aria-labelledby={`rows-actions-menu-trigger--${props.id}`}>
        <slot></slot>
      </div>
    </details>
  );
}