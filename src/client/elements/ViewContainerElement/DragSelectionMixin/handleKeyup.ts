import { IDragSelectionMixin } from '.';
import { SelectionMixinBaseClass } from '../SelectionMixinBaseClass';
import {
  ANY_CELL_ELEMENT_SELECTOR,
  SELECTABLE_CELL_ELEMENT_SELECTOR,
} from '../constants';

export function handleKeyup(
  this: SelectionMixinBaseClass & IDragSelectionMixin,
  event: Event,
) {
  if (!(event instanceof KeyboardEvent)) {
    return;
  }

  this.isDragShiftKeyPressed = event.shiftKey;

  const allCells = Array.from(
    this.gridElement.querySelectorAll(SELECTABLE_CELL_ELEMENT_SELECTOR),
  );

  for (const cell of allCells) {
    if (cell.hasAttribute('aria-selected')) {
      cell.setAttribute('data-selected', '');
    } else {
      cell.removeAttribute('data-selected');
    }
  }

  if (!this.isDragShiftKeyPressed) {
    if (this.dragHighlightElement) {
      this.dragHighlightElement.remove();
    }
    this.dragHighlightElement = null;
    this.dragOriginCellElement = null;
    this.isDragging = false;

    const selectedCells = Array.from(
      this.gridElement.querySelectorAll(
        `[data-selected]:is(${ANY_CELL_ELEMENT_SELECTOR})`,
      ),
    );

    for (const selectedCell of selectedCells) {
      selectedCell.removeAttribute('data-selected');
    }
  }
}
