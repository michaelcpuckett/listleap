import { SelectionMixinBaseClass } from '../SelectionMixinBaseClass';
import { IKeyboardSelectionMixin } from '.';
import {
  SELECTABLE_CELL_ELEMENT_SELECTOR,
  ANY_CELL_ELEMENT_SELECTOR,
} from '../constants';

export function handleEnd(
  this: SelectionMixinBaseClass & IKeyboardSelectionMixin,
  event: KeyboardEvent,
  cellElement: HTMLElement,
) {
  event.preventDefault();

  const gridElement = cellElement.closest('[role="grid"]');

  if (!(gridElement instanceof HTMLElement)) {
    return;
  }

  const rowElements = Array.from(gridElement.querySelectorAll('[role="row"]'));

  const targetRowElement = rowElements[rowElements.length - 1];

  if (!(targetRowElement instanceof HTMLElement)) {
    return;
  }

  const targetRowElementCells = Array.from(targetRowElement.children);

  const targetCellElement =
    targetRowElementCells[targetRowElementCells.length - 1];

  if (!(targetCellElement instanceof HTMLElement)) {
    return;
  }
  targetCellElement.focus();

  if (!cellElement.matches(SELECTABLE_CELL_ELEMENT_SELECTOR)) {
    return;
  }

  const selectionResult = this.selectCellElement({
    targetCellElement,
    relativeCellElement: cellElement,
    originCellElement: this.keyboardOriginCellElement,
    highlightElement: this.keyboardHighlightElement,
    isShiftKeyPressed: this.isKeyboardShiftKeyPressed,
    isInvertingSelection: this.isInvertingKeyboardSelection,
  });

  if (selectionResult) {
    this.keyboardHighlightElement = selectionResult.highlightElement;
    this.keyboardOriginCellElement = selectionResult.originCellElement;
    this.isInvertingKeyboardSelection = selectionResult.isInvertingSelection;
  }
}
