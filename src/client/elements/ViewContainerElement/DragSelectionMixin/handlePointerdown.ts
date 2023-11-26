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

  this.isPointerDown = true;

  if (!closestCellElement.matches(SELECTABLE_CELL_ELEMENT_SELECTOR)) {
    return;
  }

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

  window.document.body.classList.add('prevent-scroll');

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

  this.lastSelectedCellElement = closestCellElement;

  this.updateSelectedCells(this.dragHighlightElement);
}
