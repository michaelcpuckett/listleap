import { SelectionMixinBaseClass } from '../SelectionMixinBaseClass';
import { IKeyboardSelectionMixin } from '.';
import {
  SELECTABLE_CELL_ELEMENT_SELECTOR,
  ANY_CELL_ELEMENT_SELECTOR,
} from '../constants';

export function handleArrowDown(
  this: SelectionMixinBaseClass & IKeyboardSelectionMixin,
  event: KeyboardEvent,
  cellElement: HTMLElement,
) {
  event.preventDefault();

  const rowElement = cellElement.closest('[role="row"]');

  if (!rowElement) {
    return;
  }

  const cellIndex = Array.from(rowElement.children).indexOf(cellElement);

  const gridElement = rowElement.closest('[role="grid"]');

  if (!(gridElement instanceof HTMLElement)) {
    return;
  }

  const rowElements = Array.from(gridElement.querySelectorAll('[role="row"]'));

  const rowIndex = rowElements.indexOf(rowElement);

  const targetRowElement = rowElements[rowIndex + 1];

  if (!(targetRowElement instanceof HTMLElement)) {
    return;
  }

  const targetRowElementCells = Array.from(targetRowElement.children);

  const targetCellElement =
    targetRowElementCells[
      Math.min(targetRowElementCells.length - 1, cellIndex)
    ];

  if (!(targetCellElement instanceof HTMLElement)) {
    return;
  }

  if (
    this.isKeyboardShiftKeyPressed &&
    !targetCellElement.matches(SELECTABLE_CELL_ELEMENT_SELECTOR)
  ) {
    return;
  }

  this.focusCellElement(targetCellElement);

  if (!this.isKeyboardShiftKeyPressed) {
    return;
  }

  if (!cellElement.matches(SELECTABLE_CELL_ELEMENT_SELECTOR)) {
    return;
  }

  if (!targetCellElement.matches(SELECTABLE_CELL_ELEMENT_SELECTOR)) {
    return;
  }

  this.clearRowSelection();

  const selectionResult = this.selectCellElement({
    targetCellElement,
    relativeCellElement: cellElement,
    originCellElement: this.keyboardOriginCellElement,
    highlightElement: this.keyboardHighlightElement,
  });

  if (selectionResult) {
    this.keyboardHighlightElement = selectionResult.highlightElement;
    this.keyboardOriginCellElement = selectionResult.originCellElement;
  }
}
