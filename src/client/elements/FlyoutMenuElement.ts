export class FlyoutMenuElement extends HTMLElement {
  private detailsElement: HTMLDetailsElement;
  private boundKeydownHandler = this.handleKeydown.bind(this);

  constructor() {
    super();

    const detailsElement = this.querySelector('details');

    if (!(detailsElement instanceof HTMLDetailsElement)) {
      throw new Error('Could not find details element');
    }

    this.detailsElement = detailsElement;
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
      this.detailsElement.open = false;
    }
  }
}

window.customElements.define('flyout-menu', FlyoutMenuElement);
