const CELL_ELEMENT_SELECTOR =
  '[role="gridcell"], [role="columnheader"], [role="rowheader"]';

const FLYOUT_MENU_SELECTOR = 'flyout-menu [role="menu"]';

function isInFlyoutMenu(element: Element | HTMLElement | EventTarget) {
  if (!(element instanceof Element)) {
    return false;
  }

  const flyoutMenuElement = element.closest(FLYOUT_MENU_SELECTOR);

  return flyoutMenuElement instanceof HTMLElement;
}

export class GridKeyboardNavigationElement extends HTMLElement {
  private boundKeydownHandler = this.handleKeydown.bind(this);

  constructor() {
    super();

    this.addEventListener('auto-save-text:toggle-edit-mode', (event: Event) => {
      if (!(event instanceof CustomEvent)) {
        return;
      }

      if (!(event.target instanceof HTMLElement)) {
        return;
      }

      const cellElement = event.target.closest(CELL_ELEMENT_SELECTOR);

      if (!(cellElement instanceof HTMLElement)) {
        return;
      }

      const rowElement = cellElement.closest('[role="row"]');

      if (!(rowElement instanceof HTMLElement)) {
        return;
      }

      const cellIndex = Array.from(rowElement.children).indexOf(cellElement);

      const nextRowElement = rowElement.nextElementSibling;

      if (!(nextRowElement instanceof HTMLElement)) {
        return;
      }

      const nextCellElement = nextRowElement.children[cellIndex];

      if (!(nextCellElement instanceof HTMLElement)) {
        return;
      }

      nextCellElement.focus();
    });
  }

  connectedCallback() {
    this.addEventListener('keydown', this.boundKeydownHandler);
  }

  disconnected() {
    this.removeEventListener('keydown', this.boundKeydownHandler);
  }

  handleKeydown(event: Event) {
    if (!(event instanceof KeyboardEvent)) {
      return;
    }

    const cellElement = event.composedPath().find((element) => {
      return (
        element instanceof HTMLElement && element.matches(CELL_ELEMENT_SELECTOR)
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

    this.focusElement(targetCellElement);
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

    this.focusElement(targetCellElement);
  }

  handleArrowLeft(cellElement: HTMLElement) {
    const previousCellElement = cellElement.previousElementSibling;

    if (!(previousCellElement instanceof HTMLElement)) {
      return;
    }

    this.focusElement(previousCellElement);
  }

  handleArrowRight(cellElement: HTMLElement) {
    const nextCellElement = cellElement.nextElementSibling;

    if (!(nextCellElement instanceof HTMLElement)) {
      return;
    }

    this.focusElement(nextCellElement);
  }

  focusElement(targetCellElement: HTMLElement) {
    targetCellElement.focus();
  }
}

window.customElements.define(
  'grid-keyboard-navigation',
  GridKeyboardNavigationElement,
);
