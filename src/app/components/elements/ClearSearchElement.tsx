import React from 'react';
import { ButtonElement } from './ButtonElement';

export function ClearSearchElement(props: React.PropsWithChildren<{}>) {
  return (
    <clear-search>
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
      <ButtonElement type="reset">Clear</ButtonElement>
    </clear-search>
  );
}
