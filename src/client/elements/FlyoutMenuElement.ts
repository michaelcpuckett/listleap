export class FlyoutMenuElement extends HTMLElement {
  private detailsElement: HTMLDetailsElement;
  private boundKeydownHandler = this.handleKeydown.bind(this);
  private boundToggleHandler = this.handleToggle.bind(this);

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
    this.detailsElement.addEventListener('toggle', this.boundToggleHandler);
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

  handleToggle() {
    if (this.detailsElement.open) {
      const firstMenuItem = this.querySelector('[role="menuitem"]');

      if (!(firstMenuItem instanceof HTMLElement)) {
        return;
      }

      firstMenuItem.focus();
    }
  }
}

window.customElements.define('flyout-menu', FlyoutMenuElement);
