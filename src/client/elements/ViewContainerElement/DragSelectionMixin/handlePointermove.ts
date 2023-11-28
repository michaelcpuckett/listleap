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
    if (!(this.lastDragSelectedCellElement instanceof HTMLElement)) {
      return;
    }

    const lastSelectedRowElement =
      this.lastDragSelectedCellElement?.closest('[role="row"]');

    if (!(lastSelectedRowElement instanceof HTMLElement)) {
      return;
    }

    const rowElements = Array.from(
      this.gridElement.querySelectorAll(
        `[role="row"]:has(${SELECTABLE_CELL_ELEMENT_SELECTOR})`,
      ),
    );

    const selectedCellRowElement =
      this.lastDragSelectedCellElement.closest('[role="row"]');

    if (!(selectedCellRowElement instanceof HTMLElement)) {
      return;
    }

    const targetRowIndex = rowElements.indexOf(selectedCellRowElement);

    const targetRowElement = rowElements[targetRowIndex];

    const targetColumnIndex =
      lastSelectedRowElement.querySelectorAll(ANY_CELL_ELEMENT_SELECTOR)
        .length - 1;

    const target = Array.from(
      targetRowElement.querySelectorAll(SELECTABLE_CELL_ELEMENT_SELECTOR),
    )[targetColumnIndex];

    if (!(target instanceof HTMLElement)) {
      return;
    }

    const targetCellElement = target;

    if (!(targetCellElement instanceof HTMLElement)) {
      return;
    }

    this.updateHighlightElement(
      this.dragHighlightElement,
      targetCellElement,
      this.dragOriginCellElement || this.lastDragSelectedCellElement,
    );

    this.updateSelectedCells(this.dragHighlightElement);

    return;
  }

  if (!(this.dragOriginCellElement instanceof HTMLElement)) {
    return;
  }

  if (this.dragOriginCellElement === closestCellElement) {
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
