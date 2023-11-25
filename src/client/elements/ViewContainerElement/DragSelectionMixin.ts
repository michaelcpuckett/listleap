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
      isDragging = false;
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

        if (!this.dragOriginCellElement) {
          return;
        }

        if (!this.dragHighlightElement) {
          return;
        }

        const closestCellElement = this.getClosestCellElementFromPoint(event);

        if (!closestCellElement) {
          return;
        }

        this.isDragging = true;

        this.updateHighlightElement(
          this.dragHighlightElement,
          closestCellElement,
          this.dragOriginCellElement,
        );

        this.updateSelectedCells(
          this.dragHighlightElement,
          this.isInvertingDragSelection,
          this.isDragShiftKeyPressed,
        );
      }

      handlePointerup(event: Event) {
        if (!this.dragHighlightElement) {
          return;
        }

        window.document.body.classList.remove('prevent-scroll');

        const closestCellElement = this.getClosestCellElementFromPoint(event);

        if (!(closestCellElement instanceof HTMLElement)) {
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

        this.updateSelectedCells(
          this.dragHighlightElement,
          this.isInvertingDragSelection,
          this.isDragShiftKeyPressed,
        );

        this.dragHighlightElement.remove();
        this.dragHighlightElement = null;
        this.dragOriginCellElement = null;

        closestCellElement.focus();
      }
    };
  };
}
