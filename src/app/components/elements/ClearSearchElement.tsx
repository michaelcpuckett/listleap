import React from 'react';

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
      <button
        type="reset"
        className="button"
      >
        Clear
      </button>
    </clear-search>
  );
}
