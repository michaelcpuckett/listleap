import { DragSelectionMixin, IDragSelectionMixin } from '.';
import { SelectionMixinBaseClass } from '../SelectionMixinBaseClass';
import { SELECTABLE_CELL_ELEMENT_SELECTOR } from '../constants';

export function handlePointerup(
  this: SelectionMixinBaseClass & IDragSelectionMixin,
  event: Event,
) {
  if (!(event instanceof PointerEvent)) {
    return;
  }

  if (!this.dragHighlightElement) {
    return;
  }

  window.document.body.classList.remove('prevent-scroll');
  this.isPointerDown = false;

  const closestCellElement = this.getClosestCellElementFromPoint(event);

  if (!(closestCellElement instanceof HTMLElement)) {
    event.stopImmediatePropagation();
    event.stopPropagation();

    this.dragHighlightElement.remove();
    this.dragHighlightElement = null;
    this.dragOriginCellElement = null;
    this.lastSelectedCellElement?.focus();
    this.lastSelectedCellElement = null;
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

  if (
    this.isDragShiftKeyPressed ||
    (this.isDragging && this.dragOriginCellElement !== closestCellElement)
  ) {
    event.stopImmediatePropagation();
    event.stopPropagation();
  }

  this.isDragging = false;

  if (!this.dragOriginCellElement) {
    return;
  }

  this.updateHighlightElement(
    this.dragHighlightElement,
    closestCellElement,
    this.dragOriginCellElement,
  );

  this.lastSelectedCellElement = closestCellElement;

  this.updateSelectedCells(
    this.dragHighlightElement,
    this.isInvertingDragSelection,
  );

  this.dragHighlightElement.remove();
  this.dragHighlightElement = null;
  this.dragOriginCellElement = null;
  this.lastSelectedCellElement = null;
  closestCellElement.focus();
}
