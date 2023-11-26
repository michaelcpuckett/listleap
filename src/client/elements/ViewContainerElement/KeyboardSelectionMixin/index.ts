import {
  SELECTABLE_CELL_ELEMENT_SELECTOR,
  ANY_CELL_ELEMENT_SELECTOR,
  INPUT_SELECTOR,
  isInFlyoutMenu,
} from '../constants';
import { Constructor } from '../SelectionMixinBaseClass';

export function KeyboardSelectionMixin() {
  return function <T extends Constructor>(constructor: T) {
    return class extends constructor {
      isKeyboardShiftKeyPressed = false;
      isInvertingKeyboardSelection = false;
      boundKeydownHandler = this.handleKeydown.bind(this);
      boundKeyupHandler = this.handleKeyup.bind(this);
      keyboardOriginCellElement: HTMLElement | null = null;
      keyboardHighlightElement: HTMLElement | null = null;

      connectedCallback() {
        if (constructor.prototype.connectedCallback) {
          constructor.prototype.connectedCallback.call(this);
        }

        this.addEventListener('keydown', this.boundKeydownHandler, {
          capture: true,
        });
        this.addEventListener('keyup', this.boundKeyupHandler);
      }

      disconnectedCallback() {
        if (constructor.prototype.disconnectedCallback) {
          constructor.prototype.disconnectedCallback.call(this);
        }

        this.removeEventListener('keydown', this.boundKeydownHandler, {
          capture: true,
        });
        this.removeEventListener('keyup', this.boundKeyupHandler);
      }

      handleHome(cellElement: HTMLElement) {
        const gridElement = cellElement.closest('[role="grid"]');

        if (!(gridElement instanceof HTMLElement)) {
          return;
        }

        const rowElements = Array.from(
          gridElement.querySelectorAll('[role="row"]'),
        );

        const targetRowElement = rowElements[0];

        if (!(targetRowElement instanceof HTMLElement)) {
          return;
        }

        const targetRowElementCells = Array.from(targetRowElement.children);

        const targetCellElement = targetRowElementCells[0];

        if (!(targetCellElement instanceof HTMLElement)) {
          return;
        }

        this.focusElement(targetCellElement);
      }

      handleEnd(cellElement: HTMLElement) {
        const gridElement = cellElement.closest('[role="grid"]');

        if (!(gridElement instanceof HTMLElement)) {
          return;
        }

        const rowElements = Array.from(
          gridElement.querySelectorAll('[role="row"]'),
        );

        const targetRowElement = rowElements[rowElements.length - 1];

        if (!(targetRowElement instanceof HTMLElement)) {
          return;
        }

        const targetRowElementCells = Array.from(targetRowElement.children);

        const targetCellElement =
          targetRowElementCells[targetRowElementCells.length - 1];

        if (!(targetCellElement instanceof HTMLElement)) {
          return;
        }

        this.focusElement(targetCellElement);
      }

      handleArrowUp(cellElement: HTMLElement) {
        const rowElement = cellElement.closest('[role="row"]');

        if (!rowElement) {
          return;
        }

        const cellIndex = Array.from(rowElement.children).indexOf(cellElement);

        const gridElement = rowElement.closest('[role="grid"]');

        if (!(gridElement instanceof HTMLElement)) {
          return;
        }

        const rowElements = Array.from(
          gridElement.querySelectorAll('[role="row"]'),
        );

        const rowIndex = rowElements.indexOf(rowElement);

        const targetRowElement = rowElements[rowIndex - 1];

        if (!(targetRowElement instanceof HTMLElement)) {
          return;
        }

        const targetRowElementCells = Array.from(targetRowElement.children);

        const targetCellElement =
          targetRowElementCells[
            Math.min(targetRowElementCells.length - 1, cellIndex)
          ];

        if (!(targetCellElement instanceof HTMLElement)) {
          return;
        }

        if (
          this.isKeyboardShiftKeyPressed &&
          !targetCellElement.matches(SELECTABLE_CELL_ELEMENT_SELECTOR)
        ) {
          return;
        }

        this.focusElement(targetCellElement);

        if (!cellElement.matches(SELECTABLE_CELL_ELEMENT_SELECTOR)) {
          return;
        }

        if (this.isKeyboardShiftKeyPressed) {
          if (!this.keyboardHighlightElement) {
            this.isInvertingKeyboardSelection =
              cellElement.hasAttribute('aria-selected');
            this.keyboardHighlightElement = this.initializeHighlightElement(
              this.keyboardHighlightElement,
              cellElement,
            );
            this.keyboardOriginCellElement = cellElement;
          }
          this.updateHighlightElement(
            this.keyboardHighlightElement,
            targetCellElement,
            this.keyboardOriginCellElement || cellElement,
          );
          this.updateSelectedCells(
            this.keyboardHighlightElement,
            this.isInvertingKeyboardSelection,
            this.isKeyboardShiftKeyPressed,
          );
        }
      }

      handleArrowDown(cellElement: HTMLElement) {
        const rowElement = cellElement.closest('[role="row"]');

        if (!rowElement) {
          return;
        }

        const cellIndex = Array.from(rowElement.children).indexOf(cellElement);

        const gridElement = rowElement.closest('[role="grid"]');

        if (!(gridElement instanceof HTMLElement)) {
          return;
        }

        const rowElements = Array.from(
          gridElement.querySelectorAll('[role="row"]'),
        );

        const rowIndex = rowElements.indexOf(rowElement);

        const targetRowElement = rowElements[rowIndex + 1];

        if (!(targetRowElement instanceof HTMLElement)) {
          return;
        }

        const targetRowElementCells = Array.from(targetRowElement.children);

        const targetCellElement =
          targetRowElementCells[
            Math.min(targetRowElementCells.length - 1, cellIndex)
          ];

        if (!(targetCellElement instanceof HTMLElement)) {
          return;
        }

        if (
          this.isKeyboardShiftKeyPressed &&
          !targetCellElement.matches(SELECTABLE_CELL_ELEMENT_SELECTOR)
        ) {
          return;
        }

        this.focusElement(targetCellElement);

        if (!cellElement.matches(SELECTABLE_CELL_ELEMENT_SELECTOR)) {
          return;
        }

        if (this.isKeyboardShiftKeyPressed) {
          if (!this.keyboardHighlightElement) {
            this.isInvertingKeyboardSelection =
              cellElement.hasAttribute('aria-selected');
            this.keyboardHighlightElement = this.initializeHighlightElement(
              this.keyboardHighlightElement,
              cellElement,
            );

            this.keyboardOriginCellElement = cellElement;
          }
          this.updateHighlightElement(
            this.keyboardHighlightElement,
            targetCellElement,
            this.keyboardOriginCellElement || cellElement,
          );
          this.updateSelectedCells(
            this.keyboardHighlightElement,
            this.isInvertingKeyboardSelection,
            this.isKeyboardShiftKeyPressed,
          );
        }
      }

      handleArrowLeft(cellElement: HTMLElement) {
        const previousCellElement = cellElement.previousElementSibling;

        if (!(previousCellElement instanceof HTMLElement)) {
          return;
        }

        if (
          this.isKeyboardShiftKeyPressed &&
          !previousCellElement.matches(SELECTABLE_CELL_ELEMENT_SELECTOR)
        ) {
          return;
        }

        this.focusElement(previousCellElement);

        if (!cellElement.matches(SELECTABLE_CELL_ELEMENT_SELECTOR)) {
          return;
        }

        if (this.isKeyboardShiftKeyPressed) {
          if (!this.keyboardHighlightElement) {
            this.isInvertingKeyboardSelection =
              cellElement.hasAttribute('aria-selected');
            this.keyboardHighlightElement = this.initializeHighlightElement(
              this.keyboardHighlightElement,
              cellElement,
            );

            this.keyboardOriginCellElement = cellElement;
          }
          this.updateHighlightElement(
            this.keyboardHighlightElement,
            previousCellElement,
            this.keyboardOriginCellElement || cellElement,
          );
          this.updateSelectedCells(
            this.keyboardHighlightElement,
            this.isInvertingKeyboardSelection,
            this.isKeyboardShiftKeyPressed,
          );
        }
      }

      handleArrowRight(cellElement: HTMLElement) {
        const nextCellElement = cellElement.nextElementSibling;

        if (!(nextCellElement instanceof HTMLElement)) {
          return;
        }

        if (
          this.isKeyboardShiftKeyPressed &&
          !nextCellElement.matches(SELECTABLE_CELL_ELEMENT_SELECTOR)
        ) {
          return;
        }

        this.focusElement(nextCellElement);

        if (!cellElement.matches(SELECTABLE_CELL_ELEMENT_SELECTOR)) {
          return;
        }

        if (this.isKeyboardShiftKeyPressed) {
          if (!this.keyboardHighlightElement) {
            this.isInvertingKeyboardSelection =
              cellElement.hasAttribute('aria-selected');
            this.keyboardHighlightElement = this.initializeHighlightElement(
              this.keyboardHighlightElement,
              cellElement,
            );

            this.keyboardOriginCellElement = cellElement;
          }
          this.updateHighlightElement(
            this.keyboardHighlightElement,
            nextCellElement,
            this.keyboardOriginCellElement || cellElement,
          );
          this.updateSelectedCells(
            this.keyboardHighlightElement,
            this.isInvertingKeyboardSelection,
            this.isKeyboardShiftKeyPressed,
          );
        }
      }

      focusElement(targetCellElement: HTMLElement) {
        targetCellElement.focus();
      }

      handleKeyup(event: Event) {
        if (!(event instanceof KeyboardEvent)) {
          return;
        }

        this.isKeyboardShiftKeyPressed = event.shiftKey;

        const allCells = Array.from(
          this.gridElement.querySelectorAll(SELECTABLE_CELL_ELEMENT_SELECTOR),
        );

        // if (this.isDragging) {
        //   for (const cell of allCells) {
        //     if (cell.hasAttribute('aria-selected')) {
        //       cell.setAttribute('data-selected', '');
        //     } else {
        //       cell.removeAttribute('data-selected');
        //     }
        //   }
        // }

        if (!this.isKeyboardShiftKeyPressed) {
          if (this.keyboardHighlightElement) {
            this.keyboardHighlightElement.remove();
          }
          this.keyboardHighlightElement = null;
          this.keyboardOriginCellElement = null;
          // this.isDragging = false;

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

      handleKeydown(event: Event) {
        if (!(event instanceof KeyboardEvent)) {
          return;
        }

        if (!this.isKeyboardShiftKeyPressed) {
          this.isKeyboardShiftKeyPressed =
            event.key === 'Shift' || event.shiftKey;

          if (this.isKeyboardShiftKeyPressed) {
            const allCells = Array.from(
              this.gridElement.querySelectorAll(
                SELECTABLE_CELL_ELEMENT_SELECTOR,
              ),
            );

            for (const cell of allCells) {
              if (cell.hasAttribute('aria-selected')) {
                cell.setAttribute('data-selected', '');
              } else {
                cell.removeAttribute('data-selected');
              }
            }
          }
        }

        if (event.key === 'Escape') {
          const selectedCells = Array.from(
            this.gridElement.querySelectorAll(
              `[aria-selected="true"]:is(${SELECTABLE_CELL_ELEMENT_SELECTOR})`,
            ),
          );

          for (const selectedCell of selectedCells) {
            selectedCell.removeAttribute('aria-selected');
            selectedCell.removeAttribute('data-selected');
          }

          if (this.keyboardHighlightElement) {
            this.keyboardHighlightElement.remove();
            this.keyboardHighlightElement = null;
          }
        }

        const cellElement = event.composedPath().find((element) => {
          return (
            element instanceof HTMLElement &&
            element.matches(ANY_CELL_ELEMENT_SELECTOR)
          );
        });

        if (!(cellElement instanceof HTMLElement)) {
          return;
        }

        const editableAutoSaveTextInputElement = cellElement.querySelector(
          'auto-save-text input[type="text"]:not([data-read-only])',
        );

        if (editableAutoSaveTextInputElement) {
          return;
        }

        const flyoutMenuElement = event.composedPath().find(isInFlyoutMenu);

        if (flyoutMenuElement) {
          return;
        }

        switch (event.key) {
          case 'ArrowUp':
            event.preventDefault();
            this.handleArrowUp(cellElement);
            break;
          case 'ArrowDown':
            event.preventDefault();
            this.handleArrowDown(cellElement);
            break;
          case 'ArrowLeft':
            event.preventDefault();
            this.handleArrowLeft(cellElement);
            break;
          case 'ArrowRight':
            event.preventDefault();
            this.handleArrowRight(cellElement);
            break;
          case 'Home':
            event.preventDefault();
            this.handleHome(cellElement);
            break;
          case 'End':
            event.preventDefault();
            this.handleEnd(cellElement);
            break;
          default:
            break;
        }

        const selectedCellElements = Array.from(
          this.querySelectorAll(
            `[aria-selected="true"]:is(${SELECTABLE_CELL_ELEMENT_SELECTOR})`,
          ),
        );

        if (event.key === ' ' && this.isKeyboardShiftKeyPressed) {
          const inputElement = cellElement.querySelector(INPUT_SELECTOR);

          if (!(inputElement instanceof HTMLInputElement)) {
            return;
          }

          if (!inputElement.hasAttribute('data-read-only')) {
            return;
          }

          event.preventDefault();
          event.stopImmediatePropagation();
          event.stopPropagation();

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

          this.isInvertingKeyboardSelection =
            cellElement.hasAttribute('aria-selected');

          this.keyboardHighlightElement = this.initializeHighlightElement(
            this.keyboardHighlightElement,
            cellElement,
          );
          this.keyboardOriginCellElement = cellElement;
          this.updateHighlightElement(
            this.keyboardHighlightElement,
            cellElement,
            cellElement,
          );
          this.updateSelectedCells(
            this.keyboardHighlightElement,
            this.isInvertingKeyboardSelection,
            this.isKeyboardShiftKeyPressed,
          );

          if (this.keyboardHighlightElement) {
            this.keyboardHighlightElement.remove();
          }
          this.keyboardHighlightElement = null;
          this.keyboardOriginCellElement = null;
        }

        if (selectedCellElements.length) {
          if (['Delete', 'Backspace'].includes(event.key)) {
            event.preventDefault();
            event.stopImmediatePropagation();
            event.stopPropagation();

            this.dispatchEvent(
              new CustomEvent('view-container:clear-cells', {
                bubbles: true,
                composed: true,
                detail: selectedCellElements,
              }),
            );
          }
        }
      }
    };
  };
}
