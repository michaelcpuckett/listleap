import {
  ANY_CELL_ELEMENT_SELECTOR,
  SELECTABLE_CELL_ELEMENT_SELECTOR,
  isHtmlElement,
} from './constants';

export class SelectionMixinBaseClass extends HTMLElement {
  gridElement: HTMLElement;

  constructor() {
    super();

    const gridElement = this.querySelector('[role="grid"]');

    if (!(gridElement instanceof HTMLElement)) {
      throw new Error('Could not find grid element');
    }

    this.gridElement = gridElement;
  }

  getClosestCellElementFromPoint(event: Event) {
    if (event instanceof PointerEvent) {
      let closestCellElement: HTMLElement | null = null;

      const touchTarget = window.document.elementFromPoint(
        event.clientX,
        event.clientY,
      );

      if (touchTarget instanceof HTMLElement) {
        closestCellElement = touchTarget.closest(ANY_CELL_ELEMENT_SELECTOR);
      }

      return closestCellElement;
    } else {
      return this.getClosestCellElementFromComposedPath(event);
    }
  }

  getClosestCellElementFromComposedPath(event: Event) {
    const composedPath = event.composedPath();

    const closestCellElement = composedPath.find((element) => {
      if (!(element instanceof HTMLElement)) {
        return false;
      }

      return element.matches(ANY_CELL_ELEMENT_SELECTOR);
    });

    if (!(closestCellElement instanceof HTMLElement)) {
      return null;
    }

    return closestCellElement;
  }

  updateHighlightElement(
    highlightElement: HTMLElement | null,
    cellElement: HTMLElement,
    draggedCellElement: HTMLElement,
  ) {
    if (!highlightElement) {
      return;
    }

    const closestRowElement = cellElement.closest('[role="row"]');

    if (!(closestRowElement instanceof HTMLElement)) {
      return;
    }

    const draggedRow = draggedCellElement.closest('[role="row"]');

    if (!(draggedRow instanceof HTMLElement)) {
      return;
    }

    const closestCellColumnIndex = Array.from(
      closestRowElement.querySelectorAll(ANY_CELL_ELEMENT_SELECTOR),
    ).indexOf(cellElement);
    const draggedCellColumnIndex = Array.from(
      draggedRow.querySelectorAll(ANY_CELL_ELEMENT_SELECTOR),
    ).indexOf(draggedCellElement);

    const closestCellLeft = cellElement.getBoundingClientRect().left;
    const closestCellRight = cellElement.getBoundingClientRect().right;

    const draggedCellLeft = draggedCellElement.getBoundingClientRect().left;
    const draggedCellRight = draggedCellElement.getBoundingClientRect().right;

    const closestCellTop = cellElement.getBoundingClientRect().top;
    const closestCellBottom = cellElement.getBoundingClientRect().bottom;

    const draggedCellTop = draggedCellElement.getBoundingClientRect().top;
    const draggedCellBottom = draggedCellElement.getBoundingClientRect().bottom;

    const isSameCell = cellElement === draggedCellElement;
    const isDraggedCellBeforeClosestCell =
      draggedCellColumnIndex < closestCellColumnIndex && !isSameCell;
    const isDraggedCellAfterClosestCell =
      draggedCellColumnIndex > closestCellColumnIndex && !isSameCell;
    const isDraggedCellAboveClosestCell =
      draggedCellTop < closestCellTop && !isSameCell;
    const isDraggedCellBelowClosestCell =
      draggedCellBottom > closestCellBottom && !isSameCell;

    const left = isSameCell
      ? draggedCellLeft
      : isDraggedCellBeforeClosestCell
        ? draggedCellLeft
        : closestCellLeft;

    const right = isSameCell
      ? draggedCellRight
      : isDraggedCellAfterClosestCell
        ? draggedCellRight
        : closestCellRight;

    const top = isSameCell
      ? draggedCellTop
      : isDraggedCellAboveClosestCell
        ? draggedCellTop
        : closestCellTop;

    const bottom = isSameCell
      ? draggedCellBottom
      : isDraggedCellBelowClosestCell
        ? draggedCellBottom
        : closestCellBottom;

    highlightElement.style.left = `${left}px`;
    highlightElement.style.top = `${top}px`;
    highlightElement.style.width = `${right - left}px`;
    highlightElement.style.height = `${bottom - top}px`;

    if (right - left === 0 || bottom - top === 0) {
      console.log('zero width or height', {
        draggedCellElement,
        cellElement,
      });
    }

    highlightElement.style.border = '3px solid var(--swatch-interactive)';
  }

  initializeHighlightElement(
    highlightElement: HTMLElement | null,
    cellElement: HTMLElement,
  ) {
    if (highlightElement) {
      return null;
    }

    highlightElement = window.document.createElement('div');
    highlightElement.classList.add('highlight');
    const { left, top } = cellElement.getBoundingClientRect();
    highlightElement.style.top = `${top}px`;
    highlightElement.style.left = `${left}px`;

    this.appendChild(highlightElement);

    return highlightElement;
  }

  updateSelectedCells(highlightElement: HTMLElement | null) {
    if (!highlightElement) {
      return;
    }

    const { top, left, bottom, right } =
      highlightElement.getBoundingClientRect();

    const allCellElements = Array.from(
      this.gridElement.querySelectorAll(ANY_CELL_ELEMENT_SELECTOR),
    ).filter(isHtmlElement);

    const markCellSelected = (cellElement: HTMLElement) => {
      cellElement.setAttribute('aria-selected', 'true');
    };

    const markCellUnselected = (cellElement: HTMLElement) => {
      cellElement.removeAttribute('aria-selected');
    };

    for (const cellElement of allCellElements) {
      const cellBounds = cellElement.getBoundingClientRect();
      const isTopWithinBounds = Math.ceil(cellBounds.top) >= Math.ceil(top);
      const isBottomWithinBounds =
        Math.ceil(cellBounds.bottom) <= Math.ceil(bottom);
      const isLeftWithinBounds = Math.ceil(cellBounds.left) >= Math.ceil(left);
      const isRightWithinBounds =
        Math.ceil(cellBounds.right) <= Math.ceil(right);
      const isWithinBounds =
        isTopWithinBounds &&
        isBottomWithinBounds &&
        isLeftWithinBounds &&
        isRightWithinBounds;

      if (isWithinBounds) {
        markCellSelected(cellElement);
      } else {
        markCellUnselected(cellElement);
      }
    }
  }

  selectCellElement(options: {
    relativeCellElement: HTMLElement;
    targetCellElement: HTMLElement;
    originCellElement: HTMLElement | null;
    isShiftKeyPressed: boolean;
    highlightElement: HTMLElement | null;
  }) {
    const {
      relativeCellElement,
      targetCellElement,
      originCellElement,
      isShiftKeyPressed,
      highlightElement,
    } = options;

    if (!isShiftKeyPressed) {
      return;
    }

    let newHighlightElement = highlightElement;
    let newOriginCellElement = originCellElement;

    if (!highlightElement) {
      newHighlightElement = this.initializeHighlightElement(
        highlightElement,
        relativeCellElement,
      );
      newOriginCellElement = relativeCellElement;
    }

    this.updateHighlightElement(
      newHighlightElement,
      targetCellElement,
      newOriginCellElement || relativeCellElement,
    );

    this.updateSelectedCells(newHighlightElement);

    return {
      highlightElement: newHighlightElement,
      originCellElement: newOriginCellElement,
    };
  }
}

export type Constructor = { new (...args: any[]): SelectionMixinBaseClass };
