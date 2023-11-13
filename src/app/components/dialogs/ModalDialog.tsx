import React from 'react';

export function ModalDialog(
  props: React.PropsWithChildren<{
    heading: React.ReactElement;
    open?: boolean;
    closeUrl: string;
  }>,
) {
  return (
    <dialog
      aria-labelledby="modal-dialog-header"
      aria-modal={true}
      open={props.open}
    >
      <div
        className="modal-dialog-body"
        role="none"
      >
        <a
          id="close-dialog-button"
          href={props.closeUrl}
          aria-label="Close dialog"
          role="button"
          className="button"
        >
          X
        </a>
        <h1 id="modal-dialog-header">{props.heading}</h1>
        <div
          className="modal-dialog-content"
          role="none"
        >
          {props.children}
        </div>
      </div>
    </dialog>
  );
}
