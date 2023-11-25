import { Constructor } from './SelectionMixinBaseClass';
import {
  ANY_CELL_ELEMENT_SELECTOR,
  SELECTABLE_CELL_ELEMENT_SELECTOR,
} from './constants';

export function DragSelectionMixin() {
  return function <T extends Constructor>(constructor: T) {
    return class extends constructor {
      isDragShiftKeyPressed = false;
      isInvertingDragSelection = false;
      isPointerDown = false;
      isDragging = false;
      lastSelectedCellElement: HTMLElement | null = null;
      dragOriginCellElement: HTMLElement | null = null;
      dragHighlightElement: HTMLElement | null = null;
      pointerId = 0;
      boundPointerdownHandler = this.handlePointerdown.bind(this);
      boundPointermoveHandler = this.handlePointermove.bind(this);
      boundPointerupHandler = this.handlePointerup.bind(this);
      boundDragKeydownHandler = this.handleDragKeydown.bind(this);
      boundDragKeyupHandler = this.handleDragKeyup.bind(this);

      handleDragKeydown(event: Event) {
        if (!(event instanceof KeyboardEvent)) {
          return;
        }

        if (!this.isDragShiftKeyPressed) {
          this.isDragShiftKeyPressed = event.key === 'Shift' || event.shiftKey;
        }
      }

      handleDragKeyup(event: Event) {
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

      connectedCallback() {
        if (constructor.prototype.connectedCallback) {
          constructor.prototype.connectedCallback.call(this);
        }

        this.addEventListener('pointerdown', this.boundPointerdownHandler);
        this.addEventListener('pointermove', this.boundPointermoveHandler);
        this.addEventListener('pointerup', this.boundPointerupHandler, {
          capture: true,
        });
        this.addEventListener('pointercancel', this.boundPointerupHandler, {
          capture: true,
        });
        this.addEventListener('keydown', this.boundDragKeydownHandler);
        this.addEventListener('keyup', this.boundDragKeyupHandler);
      }

      disconnectedCallback() {
        if (constructor.prototype.disconnectedCallback) {
          constructor.prototype.disconnectedCallback.call(this);
        }

        this.removeEventListener('pointerdown', this.boundPointerdownHandler);
        this.removeEventListener('pointermove', this.boundPointermoveHandler);
        this.removeEventListener('pointerup', this.boundPointerupHandler, {
          capture: true,
        });
        this.removeEventListener('pointercancel', this.boundPointerupHandler, {
          capture: true,
        });

        this.removeEventListener('keydown', this.boundDragKeydownHandler);
        this.removeEventListener('keyup', this.boundDragKeyupHandler);
      }

      handlePointerdown(event: Event) {
        if (!(event instanceof PointerEvent)) {
          return;
        }

        const closestCellElement =
          this.getClosestCellElementFromComposedPath(event);

        if (!closestCellElement) {
          return;
        }

        this.isPointerDown = true;

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

        this.isInvertingDragSelection =
          this.isDragShiftKeyPressed &&
          closestCellElement.hasAttribute('aria-selected');

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

        this.updateSelectedCells(
          this.dragHighlightElement,
          this.isInvertingDragSelection,
          this.isDragShiftKeyPressed,
        );
      }

      handlePointermove(event: Event) {
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

          const selectedCellRowIndex = rowElements.indexOf(
            selectedCellRowElement,
          );

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
              : lastSelectedRowElement.querySelectorAll(
                  ANY_CELL_ELEMENT_SELECTOR,
                ).length - 1;

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

          this.updateSelectedCells(
            this.dragHighlightElement,
            this.isInvertingDragSelection,
            this.isDragShiftKeyPressed,
          );

          return;
        }

        this.isDragging = true;

        this.updateHighlightElement(
          this.dragHighlightElement,
          closestCellElement,
          this.dragOriginCellElement,
        );

        this.lastSelectedCellElement = closestCellElement;

        this.updateSelectedCells(
          this.dragHighlightElement,
          this.isInvertingDragSelection,
          this.isDragShiftKeyPressed,
        );
      }

      handlePointerup(event: Event) {
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
          this.isDragShiftKeyPressed,
        );

        this.dragHighlightElement.remove();
        this.dragHighlightElement = null;
        this.dragOriginCellElement = null;
        this.lastSelectedCellElement = null;
        closestCellElement.focus();
      }
    };
  };
}
