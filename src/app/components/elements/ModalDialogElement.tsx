import React from 'react';

export function ModalDialogElement(
  props: React.PropsWithChildren<{
    heading: React.ReactElement;
    open?: boolean;
    closeUrl: string;
  }>,
) {
  return (
    <modal-dialog>
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
            autoFocus
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
    </modal-dialog>
  );
}
