import { SelectionMixinBaseClass } from '../SelectionMixinBaseClass';
import { IKeyboardSelectionMixin } from '.';
import {
  SELECTABLE_CELL_ELEMENT_SELECTOR,
  ANY_CELL_ELEMENT_SELECTOR,
  INPUT_SELECTOR,
  isInFlyoutMenu,
} from '../constants';

export function handleSpacebar(
  this: SelectionMixinBaseClass & IKeyboardSelectionMixin,
  event: KeyboardEvent,
  cellElement: HTMLElement,
) {
  if (!this.isKeyboardShiftKeyPressed) {
    return;
  }

  const inputElement = cellElement.querySelector(INPUT_SELECTOR);

  if (!(inputElement instanceof HTMLInputElement)) {
    return;
  }

  event.preventDefault();
  event.stopImmediatePropagation();
  event.stopPropagation();

  this.sealKeyboardSelectedCells();

  const selectionResult = this.selectCellElement({
    targetCellElement: cellElement,
    relativeCellElement: cellElement,
    originCellElement: this.keyboardOriginCellElement,
    highlightElement: this.keyboardHighlightElement,
    isShiftKeyPressed: this.isKeyboardShiftKeyPressed,
    isInvertingSelection: cellElement.hasAttribute('aria-selected'),
  });

  if (selectionResult) {
    this.keyboardHighlightElement = selectionResult.highlightElement;
    this.keyboardOriginCellElement = selectionResult.originCellElement;
    this.isInvertingKeyboardSelection = selectionResult.isInvertingSelection;
  }

  this.clearKeyboardHighlight();
}
