import escapeStringRegexp from 'escape-string-regexp';
import { BaseAutoSaveElement } from 'elements/BaseAutoSaveElement';

export class AutoSaveCheckboxElement extends BaseAutoSaveElement {
  private formElement: HTMLFormElement | undefined;
  private boundMarkClean = this.markClean.bind(this);

  constructor() {
    super();

    const formElement = this.inputElement.form;

    if (!formElement) {
      return;
    }

    this.formElement = formElement;
  }

  connectedCallback() {
    this.inputElement.addEventListener('input', this.boundInputHandler);

    if (this.formElement) {
      this.formElement.addEventListener('submit', this.boundMarkClean);
    }
  }

  disconnectedCallback() {
    this.inputElement.removeEventListener('input', this.boundInputHandler);

    if (this.formElement) {
      this.formElement.removeEventListener('submit', this.boundMarkClean);
    }
  }

  override handleInput() {
    const isChecked = this.inputElement.checked;
    const value = isChecked ? this.inputElement.value : '';
    const formElement = this.inputElement.form;

    if (!formElement) {
      return;
    }

    const formAction = formElement.getAttribute('action');

    if (!formAction) {
      return;
    }

    const method = new FormData(formElement).get('_method')?.toString() || '';

    if (['PUT', 'PATCH'].includes(method)) {
      this.patch(formAction, value).then(() => {
        window.location.reload();
      });
    } else {
      if (this.inputElement.checked !== this.inputElement.defaultChecked) {
        this.markDirty();
      } else {
        this.markClean();
      }
    }
  }
}

window.customElements.define('auto-save-checkbox', AutoSaveCheckboxElement);
