import React from 'react';

export function ViewContainerElement(props: React.PropsWithChildren<{}>) {
  return (
    <view-container>
      <template shadowrootmode="open">
        <link
          rel="stylesheet"
          href="/host.css"
        />
        <slot></slot>
      </template>
      {props.children}
    </view-container>
  );
}
