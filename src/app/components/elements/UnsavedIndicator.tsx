import React from 'react';

export function UnsavedIndicator() {
  return (
    <svg
      className="unsaved-indicator"
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      width="32"
      height="32"
      fill="black"
      viewBox="-2.5 0 19 19"
    >
      <use
        xmlnsXlink="http://www.w3.org/1999/xlink"
        xlinkHref="/icons.svg#floppy-disk"
      ></use>
    </svg>
  );
}
