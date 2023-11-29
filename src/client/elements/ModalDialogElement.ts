export class ModalDialogElement extends HTMLElement {
  private boundKeydownHandler = this.handleKeydown.bind(this);
  private dialogElement: HTMLDialogElement;

  constructor() {
    super();

    const dialogElement = this.querySelector('dialog');

    if (!(dialogElement instanceof HTMLDialogElement)) {
      throw new Error('Could not find dialog element');
    }

    this.dialogElement = dialogElement;
  }

  connectedCallback() {
    this.addEventListener('keydown', this.boundKeydownHandler);
  }

  disconnectedCallback() {
    this.removeEventListener('keydown', this.boundKeydownHandler);
  }

  handleKeydown(event: Event) {
    if (!(event instanceof KeyboardEvent)) {
      return;
    }

    if (event.key === 'Escape') {
      const closeDialogButtonElement = this.dialogElement.querySelector(
        '#close-dialog-button',
      );

      if (!(closeDialogButtonElement instanceof HTMLElement)) {
        return;
      }

      closeDialogButtonElement.click();
    }
  }
}

window.customElements.define('modal-dialog', ModalDialogElement);
