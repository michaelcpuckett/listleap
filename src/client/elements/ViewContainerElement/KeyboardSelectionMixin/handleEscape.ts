import { SelectionMixinBaseClass } from '../SelectionMixinBaseClass';
import { IKeyboardSelectionMixin } from '.';
import {
  SELECTABLE_CELL_ELEMENT_SELECTOR,
  ANY_CELL_ELEMENT_SELECTOR,
} from '../constants';

export function handleEscape(
  this: SelectionMixinBaseClass & IKeyboardSelectionMixin,
  event: KeyboardEvent,
) {
  event.preventDefault();
  event.stopImmediatePropagation();
  event.stopPropagation();

  const selectedCells = Array.from(
    this.gridElement.querySelectorAll(
      `[aria-selected="true"]:is(${SELECTABLE_CELL_ELEMENT_SELECTOR})`,
    ),
  );

  for (const selectedCell of selectedCells) {
    selectedCell.removeAttribute('aria-selected');
    selectedCell.removeAttribute('data-selected');
  }

  if (this.keyboardHighlightElement) {
    this.keyboardHighlightElement.remove();
    this.keyboardHighlightElement = null;
  }
}
