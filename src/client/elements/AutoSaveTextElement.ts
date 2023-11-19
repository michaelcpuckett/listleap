import { BaseAutoSaveElement } from 'elements/BaseAutoSaveElement';

export class AutoSaveTextElement extends BaseAutoSaveElement {
  private boundKeydownHandler = this.handleKeydown.bind(this);
  private boundClickHandler = this.handleClick.bind(this);
  private boundBlurHandler = this.handleBlur.bind(this);

  connectedCallback() {
    this.inputElement.addEventListener('click', this.boundClickHandler);
    this.inputElement.addEventListener('change', this.boundChangeHandler);
    this.inputElement.addEventListener('keydown', this.boundKeydownHandler);
    this.inputElement.addEventListener('blur', this.boundBlurHandler);
  }

  disconnectedCallback() {
    this.inputElement.removeEventListener('click', this.boundClickHandler);
    this.inputElement.removeEventListener('change', this.boundChangeHandler);
    this.inputElement.removeEventListener('keydown', this.boundKeydownHandler);
    this.inputElement.removeEventListener('blur', this.boundBlurHandler);
  }

  handleClick() {
    if (this.inputElement.readOnly) {
      this.toggleEditMode();
    }
  }

  handleBlur() {
    if (!this.inputElement.readOnly) {
      this.toggleEditMode();
    }
  }

  handleKeydown(event: Event) {
    if (!(event instanceof KeyboardEvent)) {
      return;
    }

    if (event.key === 'Escape') {
      if (this.inputElement.readOnly) {
        this.toggleEditMode();
      } else {
        this.inputElement.value = this.inputElement.getAttribute('value') || '';
      }
    }

    if (event.key === 'Enter') {
      event.preventDefault();
      this.toggleEditMode();

      if (!this.inputElement.readOnly) {
        this.inputElement.selectionStart = this.inputElement.selectionEnd =
          this.inputElement.value.length;
      }
    }
  }

  toggleEditMode() {
    this.inputElement.readOnly = !this.inputElement.readOnly;
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
