import debounce from 'debounce';
import { BaseAutoSaveElement } from 'elements/BaseAutoSaveElement';

export class AutoSaveSearchElement extends BaseAutoSaveElement {
  private debouncedInputHandler = debounce(this.boundInputHandler, 350);

  connectedCallback() {
    this.inputElement.addEventListener('input', this.debouncedInputHandler);
  }

  disconnectedCallback() {
    this.inputElement.removeEventListener('input', this.debouncedInputHandler);
  }

  override handleInput() {
    const formElement = this.inputElement.form;

    if (!formElement) {
      return;
    }

    formElement.submit();
  }
}

window.customElements.define('auto-save-search', AutoSaveSearchElement);
