export class SelectAllCheckboxElement extends HTMLElement {
  private inputElement: HTMLInputElement;
  private formElement: HTMLFormElement;
  private checkboxElements: HTMLInputElement[];
  private boundChangeHandler = this.handleChange.bind(this);
  private boundControllableCheckboxChangeHandler =
    this.handleControllableCheckboxChange.bind(this);

  constructor() {
    super();

    if (!this.shadowRoot) {
      throw new Error('Declarative shadow root not supported');
    }

    const inputElement = this.querySelector('input');

    if (!(inputElement instanceof HTMLInputElement)) {
      throw new Error('No input element provided');
    }

    const formElement = inputElement.form;

    if (!formElement) {
      throw new Error('No form element provided');
    }

    const inputName = inputElement.getAttribute('name');
    inputElement.removeAttribute('name');

    function isControllableCheckboxElement(
      element: unknown,
    ): element is HTMLInputElement {
      return (
        element instanceof HTMLInputElement &&
        element.type === 'checkbox' &&
        element.name === inputName
      );
    }

    this.checkboxElements = Array.from(formElement.elements).filter(
      isControllableCheckboxElement,
    );

    this.inputElement = inputElement;
    this.formElement = formElement;
  }

  connectedCallback() {
    this.inputElement.addEventListener('change', this.boundChangeHandler);

    for (const checkboxFormElement of this.checkboxElements) {
      checkboxFormElement.addEventListener(
        'change',
        this.boundControllableCheckboxChangeHandler,
      );
    }
  }

  disconnectedCallback() {
    this.inputElement.removeEventListener('change', this.boundChangeHandler);

    for (const checkboxFormElement of this.checkboxElements) {
      checkboxFormElement.removeEventListener(
        'change',
        this.boundControllableCheckboxChangeHandler,
      );
    }
  }

  handleChange() {
    const isChecked = this.inputElement.checked;

    for (const checkboxFormElement of this.checkboxElements) {
      checkboxFormElement.checked = isChecked;
    }
  }

  handleControllableCheckboxChange() {
    const isAllChecked = this.checkboxElements.every(
      (checkboxFormElement) => checkboxFormElement.checked,
    );

    this.inputElement.checked = isAllChecked;
  }
}

window.customElements.define('select-all-checkbox', SelectAllCheckboxElement);
