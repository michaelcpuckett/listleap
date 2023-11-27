import { SelectionMixinBaseClass } from '../SelectionMixinBaseClass';
import { IKeyboardSelectionMixin } from '.';
import {
  SELECTABLE_CELL_ELEMENT_SELECTOR,
  ANY_CELL_ELEMENT_SELECTOR,
} from '../constants';

export function handleArrowLeft(
  this: SelectionMixinBaseClass & IKeyboardSelectionMixin,
  event: KeyboardEvent,
  cellElement: HTMLElement,
) {
  event.preventDefault();

  const targetCellElement = cellElement.previousElementSibling;

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

  this.clearSelectedRows();

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
