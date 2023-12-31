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

  this.focusCellElement(closestCellElement);

  if (!closestCellElement.matches(SELECTABLE_CELL_ELEMENT_SELECTOR)) {
    return;
  }

  this.clearRowSelection();

  const result = this.removeHighlightElement(
    this.dragHighlightElement,
    this.dragOriginCellElement,
  );
  Object.assign(this, result);

  this.dragHighlightElement = this.initializeHighlightElement(
    this.dragHighlightElement,
    closestCellElement,
  );
  this.dragOriginCellElement = closestCellElement;
}
