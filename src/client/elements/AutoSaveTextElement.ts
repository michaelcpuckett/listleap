import { BaseAutoSaveElement } from 'elements/BaseAutoSaveElement';

export class AutoSaveTextElement extends BaseAutoSaveElement {
  private boundKeydownHandler = this.handleKeydown.bind(this);
  private boundClickHandler = this.handleClick.bind(this);
  private boundBlurHandler = this.handleBlur.bind(this);

  connectedCallback() {
    this.inputElement.addEventListener('change', this.boundChangeHandler);
    this.inputElement.addEventListener('keydown', this.boundKeydownHandler);
    this.inputElement.addEventListener('blur', this.boundBlurHandler);
    this.inputElement.addEventListener('mouseup', this.boundClickHandler);
    this.inputElement.addEventListener('touchend', this.boundClickHandler);
  }

  disconnectedCallback() {
    this.inputElement.removeEventListener('change', this.boundChangeHandler);
    this.inputElement.removeEventListener('keydown', this.boundKeydownHandler);
    this.inputElement.removeEventListener('blur', this.boundBlurHandler);
    this.inputElement.removeEventListener('mouseup', this.boundClickHandler);
    this.inputElement.removeEventListener('touchend', this.boundClickHandler);
  }

  enterEditMode() {
    this.inputElement.removeAttribute('data-read-only');
  }

  exitEditMode() {
    this.inputElement.setAttribute('data-read-only', '');

    this.submitData().then(() => {
      this.markClean();
    });
  }

  toggleEditMode() {
    if (this.inputElement.dataset.readOnly === '') {
      this.enterEditMode();
    } else {
      this.exitEditMode();
    }
  }

  handleClick() {
    this.enterEditMode();
  }

  handleBlur() {
    this.exitEditMode();
  }

  handleKeydown(event: Event) {
    if (!(event instanceof KeyboardEvent)) {
      return;
    }

    if (event.key === 'Escape') {
      if (this.inputElement.dataset.readOnly !== '') {
        this.exitEditMode();
      }
    }

    if (event.key === 'Enter') {
      event.preventDefault();
      this.toggleEditMode();

      if (this.inputElement.dataset.readOnly === '') {
        this.dispatchEvent(
          new CustomEvent('auto-save-text:toggle-edit-mode', {
            composed: true,
            bubbles: true,
          }),
        );

        this.submitData().then(() => {
          this.dispatchEvent(
            new CustomEvent('auto-save-text:save', {
              composed: true,
              bubbles: true,
            }),
          );
        });
      } else {
        this.inputElement.selectionStart = this.inputElement.selectionEnd =
          this.inputElement.value.length;
      }
    }

    if (event.key.length === 1 && /[a-zA-Z0-9-_ ]/.test(event.key)) {
      if (this.inputElement.dataset.readOnly === '') {
        this.toggleEditMode();
        this.inputElement.value = '';
        this.inputElement.selectionStart = this.inputElement.selectionEnd =
          this.inputElement.value.length;
      }
    }
  }

  async submitData() {
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
      return this.patch(formAction, value)
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
