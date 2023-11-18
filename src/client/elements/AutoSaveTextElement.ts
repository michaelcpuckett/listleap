import { BaseAutoSaveElement } from 'elements/BaseAutoSaveElement';

export class AutoSaveTextElement extends BaseAutoSaveElement {
  private boundKeyupHandler: (event: Event) => void;

  constructor() {
    super();

    this.boundKeyupHandler = this.handleKeyup.bind(this);
  }

  connectedCallback() {
    this.inputElement.addEventListener('change', this.boundChangeHandler);
    this.inputElement.addEventListener('keyup', this.boundKeyupHandler);
  }

  disconnectedCallback() {
    this.inputElement.removeEventListener('change', this.boundChangeHandler);
    this.inputElement.removeEventListener('keyup', this.boundKeyupHandler);
  }

  handleKeyup(event: Event) {
    if (!(event instanceof KeyboardEvent)) {
      return;
    }

    if (event.key === 'Escape') {
      this.inputElement.value = this.inputElement.getAttribute('value') || '';
    }
  }

  override handleChange() {
    const value = this.inputElement.value;
    const formElement = this.inputElement.form;

    if (!formElement) {
      this.markDirty();
      return;
    }

    const formAction = formElement.getAttribute('action');

    if (!formAction) {
      return;
    }

    const method = new FormData(formElement).get('_method')?.toString() || '';

    if (['PUT', 'PATCH'].includes(method)) {
      this.patch(formAction, value)
        .then(() => {
          this.inputElement.setAttribute('value', value);
        })
        .catch(() => {
          this.markDirty();
        });
    } else {
      this.markDirty();
    }
  }
}

window.customElements.define('auto-save-text', AutoSaveTextElement);
