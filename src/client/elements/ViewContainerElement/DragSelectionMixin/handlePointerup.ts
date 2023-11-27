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

  const isSelecting =
    this.isDragShiftKeyPressed || this.lastDragSelectedCellElement;

  if (!isSelecting) {
    const result = this.removeHighlightElement(
      this.dragHighlightElement,
      this.dragOriginCellElement,
    );
    Object.assign(this, result);
  }
}
