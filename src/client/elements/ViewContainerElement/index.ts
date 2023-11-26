import {
  SELECTABLE_CELL_ELEMENT_SELECTOR,
  isHtmlElement,
  INPUT_SELECTOR,
} from './constants';
import { SelectionMixinBaseClass } from './SelectionMixinBaseClass';
import { DragSelectionMixin } from './DragSelectionMixin';
import { KeyboardSelectionMixin } from './KeyboardSelectionMixin';

@DragSelectionMixin()
@KeyboardSelectionMixin()
export class ViewContainerElement extends SelectionMixinBaseClass {
  private boundHandleAutoSaveTextSave = this.handleAutoSaveTextSave.bind(this);
  private boundClearCellsHandler = this.handleClearCells.bind(this);
  private boundHandleAutoSaveTextToggleEditMode =
    this.handleAutoSaveTextToggleEditMode.bind(this);

  connectedCallback() {
    this.addEventListener(
      'view-container:clear-cells',
      this.boundClearCellsHandler,
      {
        capture: true,
      },
    );

    this.addEventListener(
      'auto-save-text:save',
      this.boundHandleAutoSaveTextSave,
    );

    this.addEventListener(
      'auto-save-text:toggle-edit-mode',
      this.boundHandleAutoSaveTextToggleEditMode,
    );
  }

  disconnectedCallback() {
    this.removeEventListener(
      'view-container:clear-cells',
      this.boundClearCellsHandler,
      {
        capture: true,
      },
    );

    this.removeEventListener(
      'auto-save-text:save',
      this.boundHandleAutoSaveTextSave,
    );

    this.removeEventListener(
      'auto-save-text:toggle-edit-mode',
      this.boundHandleAutoSaveTextToggleEditMode,
    );
  }

  handleAutoSaveTextSave(event: Event) {
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

    const gridRows = Array.from(
      this.gridElement.querySelectorAll('[role="row"]'),
    );

    const rowIndex = gridRows.indexOf(rowElement);

    if (Number(rowIndex) !== gridRows.length - 1) {
      return;
    }

    const addRowButtonElement = this.querySelector('#add-new-row-button');

    if (!(addRowButtonElement instanceof HTMLButtonElement)) {
      throw new Error('Could not find add new row button element');
    }

    const addRowFormElement = addRowButtonElement.form;

    if (!(addRowFormElement instanceof HTMLFormElement)) {
      throw new Error('Could not find add new row form element');
    }

    addRowFormElement.submit();
  }

  handleClearCells(event: Event) {
    if (!(event instanceof CustomEvent)) {
      return;
    }

    if (!Array.isArray(event.detail)) {
      return;
    }

    const cellElements = event.detail.filter(isHtmlElement);

    for (const cellElement of cellElements) {
      const autoSaveTextElement = cellElement.querySelector(INPUT_SELECTOR);

      if (!(autoSaveTextElement instanceof HTMLInputElement)) {
        continue;
      }

      autoSaveTextElement.value = '';
    }

    const clearCellsButtonElement = this.querySelector('#clear-cells-button');

    if (!(clearCellsButtonElement instanceof HTMLButtonElement)) {
      throw new Error('Could not find clear cells button element');
    }

    const clearCellsFormElement = clearCellsButtonElement.form;

    if (!(clearCellsFormElement instanceof HTMLFormElement)) {
      throw new Error('Could not find add new row form element');
    }

    const hiddenInputElement = clearCellsFormElement.querySelector(
      'input[type="hidden"][name="cell[]"]',
    );

    if (!(hiddenInputElement instanceof HTMLInputElement)) {
      throw new Error('Could not find hidden input element');
    }

    const cellsValue = cellElements
      .map((cellElement) => {
        const rowId = cellElement.getAttribute('data-row-id');

        if (!rowId) {
          throw new Error('Could not find id attribute');
        }

        const propertyId = cellElement.getAttribute('data-property-id');

        if (!propertyId) {
          throw new Error('Could not find id attribute');
        }

        return rowId + ':' + propertyId;
      })
      .join(',');

    hiddenInputElement.setAttribute('value', cellsValue);

    fetch(clearCellsFormElement.action, {
      method: clearCellsFormElement.method,
      body: new FormData(clearCellsFormElement),
    });
  }

  handleAutoSaveTextToggleEditMode(event: Event) {
    if (!(event instanceof CustomEvent)) {
      return;
    }

    if (!(event.target instanceof HTMLElement)) {
      return;
    }

    const cellElement = event.target.closest(SELECTABLE_CELL_ELEMENT_SELECTOR);

    if (!(cellElement instanceof HTMLElement)) {
      return;
    }

    const rowElement = cellElement.closest('[role="row"]');

    if (!(rowElement instanceof HTMLElement)) {
      return;
    }

    const cellIndex = Array.from(rowElement.children).indexOf(cellElement);

    const nextRowElement = rowElement.nextElementSibling;

    if (!(nextRowElement instanceof HTMLElement)) {
      return;
    }

    const nextCellElement = nextRowElement.children[cellIndex];

    if (!(nextCellElement instanceof HTMLElement)) {
      return;
    }

    nextCellElement.focus();
  }
}

window.customElements.define('view-container', ViewContainerElement);
