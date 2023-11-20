import { BaseAutoSaveElement } from 'elements/BaseAutoSaveElement';

export class AutoSaveTextElement extends BaseAutoSaveElement {
  private boundKeydownHandler = this.handleKeydown.bind(this);
  private boundClickHandler = this.handleClick.bind(this);
  private boundBlurHandler = this.handleBlur.bind(this);

  connectedCallback() {
    this.inputElement.addEventListener('pointerdown', this.boundClickHandler);
    this.inputElement.addEventListener('change', this.boundChangeHandler);
    this.inputElement.addEventListener('input', this.boundInputHandler);
    this.inputElement.addEventListener('keydown', this.boundKeydownHandler);
    this.inputElement.addEventListener('blur', this.boundBlurHandler);
  }

  disconnectedCallback() {
    this.inputElement.removeEventListener(
      'pointerdown',
      this.boundClickHandler,
    );
    this.inputElement.removeEventListener('change', this.boundChangeHandler);
    this.inputElement.removeEventListener('input', this.boundInputHandler);
    this.inputElement.removeEventListener('keydown', this.boundKeydownHandler);
    this.inputElement.removeEventListener('blur', this.boundBlurHandler);
  }

  handleInput() {
    if (this.inputElement.readOnly) {
      return;
    }

    const value = this.inputElement.value;

    if (value === this.inputElement.getAttribute('value')) {
      this.markClean();
    } else {
      this.markDirty();
    }
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
      if (!this.inputElement.readOnly) {
        const currentValue = this.inputElement.value;
        const savedValue = this.inputElement.getAttribute('value') || '';

        if (currentValue === savedValue) {
          this.toggleEditMode();
        } else {
          this.inputElement.value =
            this.inputElement.getAttribute('value') || '';
        }
      }
    }

    if (event.key === 'Enter') {
      this.toggleEditMode();

      event.preventDefault();

      if (this.inputElement.readOnly) {
        this.dispatchEvent(
          new CustomEvent('auto-save-text:toggle-edit-mode', {
            composed: true,
            bubbles: true,
          }),
        );
      } else {
        this.inputElement.selectionStart = this.inputElement.selectionEnd =
          this.inputElement.value.length;
      }
    }

    if (event.key.length === 1 && /[a-zA-Z0-9-_ ]/.test(event.key)) {
      if (this.inputElement.readOnly) {
        this.toggleEditMode();
        this.inputElement.value = '';
        this.inputElement.selectionStart = this.inputElement.selectionEnd =
          this.inputElement.value.length;
      }
    }
  }

  toggleEditMode() {
    this.inputElement.readOnly = !this.inputElement.readOnly;

    if (!this.inputElement.readOnly) {
      this.handleChange();
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
          this.markClean();
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
