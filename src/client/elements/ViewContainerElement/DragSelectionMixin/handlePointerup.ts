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

  window.document.body.classList.remove('prevent-scroll');
  this.isPointerDown = false;
  this.isDragging = false;

  event.stopImmediatePropagation();
  event.stopPropagation();

  const closestCellElement = this.getClosestCellElementFromPoint(event);

  if (!closestCellElement) {
    return;
  }

  this.dragHighlightElement?.remove();
  this.dragHighlightElement = null;
  this.dragOriginCellElement = null;
  if (
    this.lastDragSelectedCellElement &&
    this.lastDragSelectedCellElement !== this.dragOriginCellElement
  ) {
    this.focusCellElement(this.lastDragSelectedCellElement);
  }
  this.lastDragSelectedCellElement = null;
}
