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