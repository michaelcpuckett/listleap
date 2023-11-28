import { DragSelectionMixin, IDragSelectionMixin } from '.';
import { SelectionMixinBaseClass } from '../SelectionMixinBaseClass';
import {
  ANY_CELL_ELEMENT_SELECTOR,
  SELECTABLE_CELL_ELEMENT_SELECTOR,
} from '../constants';

export function handlePointermove(
  this: SelectionMixinBaseClass & IDragSelectionMixin,
  event: Event,
) {
  if (!(event instanceof PointerEvent)) {
    return;
  }

  if (!this.isPointerDown) {
    return;
  }

  window.document.body.classList.add('prevent-scroll');
  event.preventDefault();
  event.stopImmediatePropagation();
  event.stopPropagation();

  const closestCellElement = this.getClosestCellElementFromPoint(event);

  if (
    !closestCellElement ||
    !closestCellElement.matches(SELECTABLE_CELL_ELEMENT_SELECTOR)
  ) {
    return;
  }

  if (!(this.dragOriginCellElement instanceof HTMLElement)) {
    return;
  }

  this.isDragging = true;
  this.updateHighlightElement(
    this.dragHighlightElement,
    closestCellElement,
    this.dragOriginCellElement,
  );

  this.lastDragSelectedCellElement = closestCellElement;

  this.updateSelectedCells(this.dragHighlightElement);
}
