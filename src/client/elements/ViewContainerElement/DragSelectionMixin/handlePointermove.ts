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

  if (!(event.target instanceof Element)) {
    return;
  }

  event.target.releasePointerCapture(event.pointerId);

  if (!this.isPointerDown) {
    return;
  }

  if (!this.dragOriginCellElement) {
    return;
  }

  if (!this.dragHighlightElement) {
    return;
  }

  const closestCellElement = this.getClosestCellElementFromPoint(event);

  if (
    !closestCellElement ||
    !closestCellElement.matches(SELECTABLE_CELL_ELEMENT_SELECTOR)
  ) {
    if (!(this.lastSelectedCellElement instanceof HTMLElement)) {
      return;
    }

    // const allCells = Array.from(
    //   this.gridElement.querySelectorAll(SELECTABLE_CELL_ELEMENT_SELECTOR),
    // );

    // for (const cell of allCells) {
    //   if (cell.hasAttribute('aria-selected')) {
    //     cell.setAttribute('data-selected', '');
    //   } else {
    //     cell.removeAttribute('data-selected');
    //   }
    // }

    const lastSelectedRowElement =
      this.lastSelectedCellElement?.closest('[role="row"]');

    if (!(lastSelectedRowElement instanceof HTMLElement)) {
      return;
    }

    const gridRect = this.gridElement.getBoundingClientRect();

    const isAboveGrid = event.clientY < gridRect.top;
    const isBelowGrid = event.clientY > gridRect.bottom;
    const isOutOfGridYBounds = isAboveGrid || isBelowGrid;

    const isLeftOfGrid = event.clientX < gridRect.left;
    const isRightOfGrid = event.clientX > gridRect.right;
    const isOutOfGridXBounds = isLeftOfGrid || isRightOfGrid;

    const lastSelectedCellRect =
      this.lastSelectedCellElement.getBoundingClientRect();
    const isAboveCell = event.clientY < lastSelectedCellRect.top;
    const isBelowCell = event.clientY > lastSelectedCellRect.bottom;
    const isOutOfCellYBounds = isAboveCell || isBelowCell;

    const isLeftOfCell = event.clientX < lastSelectedCellRect.left;
    const isRightOfCell = event.clientX > lastSelectedCellRect.right;
    const isOutOfCellXBounds = isLeftOfCell || isRightOfCell;

    const lastSelectedColumnIndex = Array.from(
      lastSelectedRowElement.querySelectorAll(ANY_CELL_ELEMENT_SELECTOR),
    ).indexOf(this.lastSelectedCellElement);

    const rowElements = Array.from(
      this.gridElement.querySelectorAll(
        `[role="row"]:has(${SELECTABLE_CELL_ELEMENT_SELECTOR})`,
      ),
    );

    const selectedCellRowElement =
      this.lastSelectedCellElement.closest('[role="row"]');

    if (!(selectedCellRowElement instanceof HTMLElement)) {
      return;
    }

    const selectedCellRowIndex = rowElements.indexOf(selectedCellRowElement);

    const targetRowIndex = isOutOfGridXBounds
      ? isAboveGrid
        ? 0
        : rowElements.length - 1
      : selectedCellRowIndex;

    const targetRowElement = rowElements[targetRowIndex];

    const targetColumnIndex = isOutOfGridYBounds
      ? lastSelectedColumnIndex
      : isLeftOfGrid
        ? 0
        : lastSelectedRowElement.querySelectorAll(ANY_CELL_ELEMENT_SELECTOR)
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
      this.dragOriginCellElement || this.lastSelectedCellElement,
    );

    this.updateSelectedCells(this.dragHighlightElement);

    return;
  }

  this.isDragging = true;

  this.updateHighlightElement(
    this.dragHighlightElement,
    closestCellElement,
    this.dragOriginCellElement,
  );

  this.lastSelectedCellElement = closestCellElement;

  this.updateSelectedCells(this.dragHighlightElement);
}
