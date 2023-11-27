import { DragSelectionMixin, IDragSelectionMixin } from '.';
import {
  Constructor,
  SelectionMixinBaseClass,
} from '../SelectionMixinBaseClass';
import { SELECTABLE_CELL_ELEMENT_SELECTOR } from '../constants';

export function handlePointerdown(
  this: SelectionMixinBaseClass & IDragSelectionMixin,
  event: Event,
) {
  if (!(event instanceof PointerEvent)) {
    return;
  }

  const closestCellElement = this.getClosestCellElementFromComposedPath(event);

  if (!closestCellElement) {
    return;
  }

  this.focusCellElement(closestCellElement);

  if (!closestCellElement.matches(SELECTABLE_CELL_ELEMENT_SELECTOR)) {
    return;
  }

  const selectMultipleRowsCheckbox = this.querySelector(
    'select-all-checkbox input[type="checkbox"]',
  ) as HTMLInputElement;

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

  if (rowSelectionFormData['row[]'] !== undefined) {
    const formElements = Array.from(selectMultipleRowsForm.elements);

    function isRowSelectionCheckbox(
      formElement: Element,
    ): formElement is HTMLInputElement {
      return (
        formElement instanceof HTMLInputElement &&
        formElement.type === 'checkbox' &&
        formElement.name === 'row[]'
      );
    }

    const rowCheckboxElements = formElements.filter(isRowSelectionCheckbox);

    for (const rowCheckboxElement of rowCheckboxElements) {
      rowCheckboxElement.checked = false;
    }
  }

  this.isPointerDown = true;

  window.document.body.classList.add('prevent-scroll');

  const result = this.removeHighlightElement(
    this.dragHighlightElement,
    this.dragOriginCellElement,
  );
  Object.assign(this, result);

  this.dragHighlightElement = this.initializeHighlightElement(
    this.dragHighlightElement,
    closestCellElement,
  );
  this.dragOriginCellElement = closestCellElement;

  if (!this.isDragShiftKeyPressed) {
    return;
  }

  this.updateHighlightElement(
    this.dragHighlightElement,
    closestCellElement,
    closestCellElement,
  );

  this.lastDragSelectedCellElement = closestCellElement;

  this.updateSelectedCells(this.dragHighlightElement);

  event.stopImmediatePropagation();
  event.stopPropagation();
}
