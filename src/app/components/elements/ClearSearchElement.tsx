import React from 'react';

export function ClearSearchElement(props: React.PropsWithChildren<{}>) {
  return (
    <clear-search>
      <button
        type="reset"
        className="button"
      >
        Clear
      </button>
    </clear-search>
  );
}
