import {
  SELECTABLE_CELL_ELEMENT_SELECTOR,
  isHtmlElement,
  INPUT_SELECTOR,
  ANY_CELL_ELEMENT_SELECTOR,
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
  private boundHandleDeleteRows = this.handleDeleteRows.bind(this);
  private boundChangeHandler = this.handleChange.bind(this);

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

    this.addEventListener(
      'view-container:delete-rows',
      this.boundHandleDeleteRows,
    );

    this.addEventListener('change', this.boundChangeHandler);

    this.addEventListener('column-selector:select', (event: Event) => {
      if (!(event instanceof CustomEvent)) {
        return;
      }

      const { detail: propertyName } = event;

      if (!propertyName) {
        return;
      }

      const closestCellElement =
        this.getClosestCellElementFromComposedPath(event);

      if (!(closestCellElement instanceof HTMLElement)) {
        return;
      }

      const closestRowElement = closestCellElement.closest('[role="row"]');

      if (!(closestRowElement instanceof HTMLElement)) {
        return;
      }

      const columnIndex = Array.from(
        closestRowElement.querySelectorAll(ANY_CELL_ELEMENT_SELECTOR),
      ).indexOf(closestCellElement);

      const rowElements = Array.from(
        this.querySelectorAll('[role="row"]:not(:has([role="columnheader"]))'),
      ).filter(isHtmlElement);

      const firstRowElement = rowElements[0];
      const lastRowElement = rowElements[rowElements.length - 1];

      const firstRowTargetCellElement = Array.from(
        firstRowElement.querySelectorAll(ANY_CELL_ELEMENT_SELECTOR),
      )[columnIndex];

      if (!(firstRowTargetCellElement instanceof HTMLElement)) {
        return;
      }

      const lastRowTargetCellElement = Array.from(
        lastRowElement.querySelectorAll(ANY_CELL_ELEMENT_SELECTOR),
      )[columnIndex];

      if (!(lastRowTargetCellElement instanceof HTMLElement)) {
        return;
      }

      const currentlySelectedCells = Array.from(
        this.querySelectorAll(
          `[aria-selected]:is(${SELECTABLE_CELL_ELEMENT_SELECTOR})`,
        ),
      ).filter(isHtmlElement);

      this.clearRowSelection();
      this.clearCellSelection();

      if (
        'keyboardHighlightElement' in this &&
        'keyboardOriginCellElement' in this
      ) {
        const selectionResult = this.selectCellElement({
          targetCellElement: lastRowTargetCellElement,
          relativeCellElement: firstRowTargetCellElement,
          originCellElement: firstRowTargetCellElement,
          highlightElement: null,
        });

        this.keyboardOriginCellElement = firstRowTargetCellElement;

        if (selectionResult) {
          this.keyboardHighlightElement = selectionResult.highlightElement;
          this.keyboardOriginCellElement = selectionResult.originCellElement;
        }

        const newlySelectedCells = Array.from(
          this.querySelectorAll(
            `[aria-selected]:is(${SELECTABLE_CELL_ELEMENT_SELECTOR})`,
          ),
        ).filter(isHtmlElement);

        if (
          isHtmlElement(this.keyboardHighlightElement) &&
          isHtmlElement(this.keyboardOriginCellElement)
        ) {
          this.removeHighlightElement(
            this.keyboardHighlightElement,
            this.keyboardOriginCellElement,
          );
        }

        for (const cellElement of [
          ...currentlySelectedCells,
          ...newlySelectedCells,
        ]) {
          cellElement.setAttribute('aria-selected', 'true');
        }
      }
    });
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

    this.removeEventListener(
      'view-container:delete-rows',
      this.boundHandleDeleteRows,
    );

    this.removeEventListener('change', this.boundChangeHandler);
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

    const cellElement = event.target.closest(ANY_CELL_ELEMENT_SELECTOR);

    if (!(cellElement instanceof HTMLElement)) {
      return;
    }

    const rowElement = cellElement.closest('[role="row"]');

    if (!(rowElement instanceof HTMLElement)) {
      return;
    }

    const cellIndex = Array.from(rowElement.children).indexOf(cellElement);

    const rowElements = Array.from(
      this.gridElement.querySelectorAll('[role="row"]'),
    );

    const rowIndex = rowElements.indexOf(rowElement);

    const nextRowElement = rowElements[rowIndex + 1];

    if (!(nextRowElement instanceof HTMLElement)) {
      return;
    }

    const nextCellElement = nextRowElement.children[cellIndex];

    if (!(nextCellElement instanceof HTMLElement)) {
      return;
    }

    this.focusCellElement(nextCellElement);
  }

  handleDeleteRows() {
    const selectMultipleRowsCheckbox = this.querySelector(
      'select-all-checkbox input[type="checkbox"]',
    );

    if (!(selectMultipleRowsCheckbox instanceof HTMLInputElement)) {
      return;
    }

    const selectMultipleRowsForm = selectMultipleRowsCheckbox.form;

    if (!(selectMultipleRowsForm instanceof HTMLFormElement)) {
      return;
    }

    const rawRowSelectionFormData = new FormData(selectMultipleRowsForm);
    const rowSelectionFormData = Object.fromEntries(
      rawRowSelectionFormData.entries(),
    );

    if (rowSelectionFormData['row[]'] === undefined) {
      return;
    }

    const bulkActionsFormElement = this.querySelector(
      '#select-multiple-rows-form',
    );

    if (!(bulkActionsFormElement instanceof HTMLFormElement)) {
      return;
    }

    const bulkActionSelectElement = bulkActionsFormElement.querySelector(
      '[name="bulkAction"]',
    );

    if (!(bulkActionSelectElement instanceof HTMLSelectElement)) {
      return;
    }

    bulkActionSelectElement.value = 'DELETE';

    bulkActionsFormElement.submit();
  }

  handleChange(event: Event) {
    const cellElement = this.getClosestCellElementFromComposedPath(event);

    if (!(cellElement instanceof HTMLElement)) {
      return;
    }

    const hasRowSelctionCheckbox = cellElement.matches(
      ':has(input[name="row[]"])',
    );

    if (!hasRowSelctionCheckbox) {
      return;
    }

    const rowSelectionCheckbox = cellElement.querySelector(
      'input[name="row[]"]',
    );

    if (!(rowSelectionCheckbox instanceof HTMLInputElement)) {
      return;
    }

    this.clearCellSelection();
  }
}

window.customElements.define('view-container', ViewContainerElement);
