export class ColumnSelectorElement extends HTMLElement {
  private buttonElement: HTMLElement;
  private boundClickHandler = this.handleClick.bind(this);

  constructor() {
    super();

    const buttonElement = this.querySelector('button');

    if (!(buttonElement instanceof HTMLElement)) {
      throw new Error('No button element provided');
    }

    this.buttonElement = buttonElement;
  }

  connectedCallback() {
    this.buttonElement.addEventListener('click', this.boundClickHandler);
  }

  disconnectedCallback() {
    this.buttonElement.removeEventListener('click', this.boundClickHandler);
  }

  handleClick() {
    const propertyName = this.getAttribute('data-property');

    if (!propertyName) {
      return;
    }

    this.dispatchEvent(
      new CustomEvent('column-selector:select', {
        bubbles: true,
        composed: true,
        detail: propertyName,
      }),
    );

    this.dispatchEvent(
      new KeyboardEvent('keydown', {
        bubbles: true,
        composed: true,
        key: 'Escape',
      }),
    );
  }
}

window.customElements.define('column-selector', ColumnSelectorElement);
