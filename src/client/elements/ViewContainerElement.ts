export class ViewContainerElement extends HTMLElement {
  constructor() {
    super();

    const addRowButtonElement = this.querySelector('#add-new-row-button');

    if (!(addRowButtonElement instanceof HTMLButtonElement)) {
      throw new Error('Could not find add new row button element');
    }

    const addRowFormElement = addRowButtonElement.form;

    if (!(addRowFormElement instanceof HTMLFormElement)) {
      throw new Error('Could not find add new row form element');
    }

    const gridElement = this.querySelector('[role="grid"]');

    if (!(gridElement instanceof HTMLElement)) {
      throw new Error('Could not find grid element');
    }

    const gridRows = Array.from(gridElement.querySelectorAll('[role="row"]'));

    this.addEventListener('auto-save-text:save', (event: Event) => {
      if (!(event instanceof CustomEvent)) {
        return;
      }

      const { target } = event;

      if (!(target instanceof HTMLElement)) {
        return;
      }

      const rowElement = target.closest('[role="row"]');

      if (!(rowElement instanceof HTMLElement)) {
        return;
      }

      const rowIndex = gridRows.indexOf(rowElement);

      if (Number(rowIndex) !== gridRows.length - 1) {
        return;
      }

      addRowFormElement.submit();
    });
  }
}

window.customElements.define('view-container', ViewContainerElement);
