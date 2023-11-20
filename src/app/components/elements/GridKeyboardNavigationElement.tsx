import React from 'react';

export function GridKeyboardNavigationElement(
  props: React.PropsWithChildren<{}>,
) {
  return (
    <grid-keyboard-navigation>
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
      {props.children}
    </grid-keyboard-navigation>
  );
}
