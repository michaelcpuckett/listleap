export class ClearSearchElement extends HTMLElement {
  private buttonElement?: HTMLButtonElement;
  private formElement?: HTMLFormElement;
  private searchInputElement?: HTMLInputElement & {
    type: 'search';
  };
  private boundClickHandler = this.handleClick.bind(this);

  connectedCallback() {
    const buttonElement = this.querySelector('button');

    if (!(buttonElement instanceof HTMLButtonElement)) {
      throw new Error('No button element provided');
    }

    const formElement = buttonElement.form;

    if (!(formElement instanceof HTMLFormElement)) {
      throw new Error('No form element provided');
    }

    function guardIsHTMLSearchInputElement(
      node: Node,
    ): node is HTMLInputElement & {
      type: 'search';
    } {
      return node instanceof HTMLInputElement && node.type === 'search';
    }

    const searchInputElement = Array.from(formElement.elements).find(
      guardIsHTMLSearchInputElement,
    );

    if (!searchInputElement) {
      throw new Error('No search input element provided');
    }

    this.buttonElement = buttonElement;
    this.formElement = formElement;
    this.searchInputElement = searchInputElement;

    this.buttonElement.addEventListener('click', this.boundClickHandler);
  }

  disconnectedCallback() {
    if (this.buttonElement) {
      this.buttonElement.removeEventListener('click', this.boundClickHandler);
    }
  }

  handleClick() {
    if (!this.searchInputElement) {
      throw new Error('No search input element provided');
    }

    if (!this.formElement) {
      throw new Error('No form element provided');
    }

    this.searchInputElement.removeAttribute('name');
    this.formElement.submit();
  }
}

window.customElements.define('clear-search', ClearSearchElement);
