export class HyperLinkElement extends HTMLElement {
  private boundClickHandler = this.handleClick.bind(this);
  private boundKeydownHandler = this.handleKeydown.bind(this);

  connectedCallback() {
    this.addEventListener('click', this.boundClickHandler);
    this.addEventListener('keydown', this.boundKeydownHandler);
  }

  disconnectedCallback() {
    this.removeEventListener('click', this.boundClickHandler);
    this.removeEventListener('keydown', this.boundKeydownHandler);
  }

  handleClick() {
    const href = this.getAttribute('data-href');

    if (href === null) {
      return;
    }

    window.location.href = href;
  }

  handleKeydown(event: Event) {
    if (!(event instanceof KeyboardEvent)) {
      return;
    }

    if (event.key !== 'Enter') {
      return;
    }

    event.preventDefault();
    this.handleClick();
  }
}

window.customElements.define('hyper-link', HyperLinkElement);
