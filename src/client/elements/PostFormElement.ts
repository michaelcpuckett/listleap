import { DIRTY_ELEMENTS_KEY } from 'elements/UnloadHandlerElement';

export class PostFormElement extends HTMLElement {
  private formElement?: HTMLFormElement;
  private boundSubmitHandler = this.handleFormSubmit.bind(this);

  connectedCallback() {
    const formElement = this.querySelector('form');

    if (!(formElement instanceof HTMLFormElement)) {
      throw new Error('PostFormElement must contain a form element');
    }

    this.formElement = formElement;
    this.formElement.addEventListener('submit', this.boundSubmitHandler);
  }

  disconnectedCallback() {
    if (!this.formElement) {
      return;
    }

    this.formElement.removeEventListener('submit', this.boundSubmitHandler);
  }

  handleFormSubmit(event: Event) {
    event.preventDefault();

    if (!this.formElement) {
      return;
    }

    const unloadHandler = window.document.querySelector('unload-handler');

    if (!unloadHandler) {
      return;
    }

    const prev = unloadHandler.getAttribute(DIRTY_ELEMENTS_KEY) || '';
    const dirtyElementsArray = !prev ? [] : prev.split(',');

    const formElements = Array.from(this.formElement.elements);

    const dirtyElementsString = dirtyElementsArray
      .filter((id) => {
        const formElement = window.document.getElementById(id);
        return formElement && !formElements.includes(formElement);
      })
      .join(',');

    unloadHandler.setAttribute(DIRTY_ELEMENTS_KEY, dirtyElementsString);

    this.formElement.submit();
  }
}

window.customElements.define('post-form', PostFormElement);
