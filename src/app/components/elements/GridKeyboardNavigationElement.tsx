import React from 'react';

export function GridKeyboardNavigationElement(
  props: React.PropsWithChildren<{}>,
) {
  return (
    <grid-keyboard-navigation>
      <template shadowrootmode="open">
        <link
          rel="stylesheet"
          href="/grid-keyboard-navigation.css"
        />
        <slot></slot>
      </template>
      {props.children}
    </grid-keyboard-navigation>
  );
}
