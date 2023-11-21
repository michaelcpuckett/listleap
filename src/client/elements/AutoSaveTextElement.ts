import { BaseAutoSaveElement } from 'elements/BaseAutoSaveElement';

export class AutoSaveTextElement extends BaseAutoSaveElement {
  private boundKeydownHandler = this.handleKeydown.bind(this);
  private boundEnterEditModeHandler = this.enterEditMode.bind(this);
  private boundExitEditModeHandler = this.exitEditMode.bind(this);

  connectedCallback() {
    this.inputElement.addEventListener('click', this.boundEnterEditModeHandler);
    this.inputElement.addEventListener('change', this.boundChangeHandler);
    this.inputElement.addEventListener('keydown', this.boundKeydownHandler);
    this.inputElement.addEventListener('blur', this.boundExitEditModeHandler);
  }

  disconnectedCallback() {
    this.inputElement.removeEventListener(
      'click',
      this.boundEnterEditModeHandler,
    );
    this.inputElement.removeEventListener('change', this.boundChangeHandler);
    this.inputElement.removeEventListener('keydown', this.boundKeydownHandler);
    this.inputElement.removeEventListener(
      'blur',
      this.boundExitEditModeHandler,
    );
  }

  enterEditMode() {
    const isWebKit =
      RegExp(' AppleWebKit/').test(navigator.userAgent) &&
      !('chrome' in window);

    if (isWebKit) {
      this.inputElement.blur();
      this.inputElement.readOnly = false;
      new Promise(window.requestAnimationFrame).then(() => {
        this.inputElement.focus();
      });
    } else {
      this.inputElement.readOnly = false;
    }
  }

  exitEditMode() {
    this.inputElement.readOnly = true;

    this.submitData().then(() => {
      this.markClean();
    });
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
      event.preventDefault();
      this.toggleEditMode();

      if (this.inputElement.readOnly) {
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
