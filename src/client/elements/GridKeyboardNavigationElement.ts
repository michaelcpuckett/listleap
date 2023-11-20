const FOCUSABLE_ELEMENTS_SELECTOR =
  'input:not([type="hidden"]):not([hidden]), button:not([hidden]), a:not([hidden]), textarea:not([hidden]), select:not([hidden]), [tabindex]:not([hidden])';
const CELL_ELEMENT_SELECTOR =
  '[role="gridcell"], [role="columnheader"], [role="rowheader"]';

const FOCUS_STORAGE_KEY = 'focus-element-id';

export class GridKeyboardNavigationElement extends HTMLElement {
  private boundKeydownHandler = this.handleKeydown.bind(this);
  private boundFocusinHandler = this.handleFocusin.bind(this);
  private boundFocusoutHandler = this.handleFocusout.bind(this);

  constructor() {
    super();
    this.setInitialTabIndices();

    this.addEventListener('auto-save-text:toggle-edit-mode', (event: Event) => {
      if (!(event instanceof CustomEvent)) {
        return;
      }

      const target = event.target;

      if (!(target instanceof HTMLElement)) {
        return;
      }

      const cellElement = target.closest(CELL_ELEMENT_SELECTOR);

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

  setInitialTabIndices() {
    const focusableElements = Array.from(
      this.querySelectorAll(FOCUSABLE_ELEMENTS_SELECTOR),
    );

    for (const focusableElement of focusableElements) {
      if (focusableElement instanceof HTMLElement) {
        focusableElement.dataset.originalTabindex =
          focusableElement.tabIndex.toString();
      }

      focusableElement.setAttribute('tabindex', '-1');
    }

    const autoFocusedElementId =
      sessionStorage.getItem(FOCUS_STORAGE_KEY) || '';
    const autoFocusedElement = autoFocusedElementId
      ? this.querySelector(`#${autoFocusedElementId}`)
      : null;

    const firstFocusableElement =
      autoFocusedElement || this.querySelector(FOCUSABLE_ELEMENTS_SELECTOR);

    if (!(firstFocusableElement instanceof HTMLElement)) {
      return;
    }

    const firstFocusedCellElement = firstFocusableElement.closest(
      CELL_ELEMENT_SELECTOR,
    );

    if (!(firstFocusedCellElement instanceof HTMLElement)) {
      return;
    }

    function isHtmlElement(
      element: HTMLElement | Element,
    ): element is HTMLElement {
      return element instanceof HTMLElement;
    }

    const firstCellFocusableElements = Array.from(
      firstFocusedCellElement.querySelectorAll(FOCUSABLE_ELEMENTS_SELECTOR),
    ).filter(isHtmlElement);

    for (const focusableElement of firstCellFocusableElements) {
      focusableElement.setAttribute(
        'tabindex',
        focusableElement.dataset.originalTabindex || '0',
      );
    }
  }

  connectedCallback() {
    this.addEventListener('keydown', this.boundKeydownHandler);
    this.addEventListener('focusin', this.boundFocusinHandler);
    this.addEventListener('focusout', this.boundFocusoutHandler);
  }

  disconnected() {
    this.removeEventListener('keydown', this.boundKeydownHandler);
    this.removeEventListener('focusin', this.boundFocusinHandler);
    this.removeEventListener('focusout', this.boundFocusoutHandler);
  }

  handleFocusin(event: Event) {
    if (!(event instanceof FocusEvent)) {
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

    const focusableElements = Array.from(
      cellElement.querySelectorAll(FOCUSABLE_ELEMENTS_SELECTOR),
    );

    for (const focusableElement of focusableElements) {
      if (focusableElement instanceof HTMLElement) {
        focusableElement.setAttribute(
          'tabindex',
          focusableElement.dataset.originalTabindex || '0',
        );
      }
    }
  }

  handleFocusout(event: Event) {
    if (!(event instanceof FocusEvent)) {
      return;
    }

    const previousCellElement = event.composedPath().find((element) => {
      return (
        element instanceof HTMLElement && element.matches(CELL_ELEMENT_SELECTOR)
      );
    });

    if (!(previousCellElement instanceof HTMLElement)) {
      return;
    }

    const focusedElement = event.relatedTarget || window.document.activeElement;

    if (!(focusedElement instanceof HTMLElement)) {
      return;
    }

    if (!this.contains(focusedElement)) {
      return;
    }

    const focusableElements = Array.from(
      previousCellElement.querySelectorAll(FOCUSABLE_ELEMENTS_SELECTOR),
    );

    for (const focusableElement of focusableElements) {
      if (focusableElement instanceof HTMLElement) {
        focusableElement.setAttribute('tabindex', '-1');
      }
    }
  }

  handleKeydown(event: Event) {
    if (!(event instanceof KeyboardEvent)) {
      return;
    }

    const target = event.composedPath().find((element) => {
      return (
        element instanceof HTMLElement && element.matches(CELL_ELEMENT_SELECTOR)
      );
    });

    if (!(target instanceof HTMLElement)) {
      return;
    }

    const cellElement = target.closest(CELL_ELEMENT_SELECTOR);

    if (!(cellElement instanceof HTMLElement)) {
      return;
    }

    const editableAutoSaveTextInputElement = event
      .composedPath()
      .find((element) => {
        return (
          element instanceof HTMLInputElement &&
          element.closest('auto-save-text') &&
          !element.readOnly
        );
      });

    if (editableAutoSaveTextInputElement) {
      return;
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault();
      this.handleArrowUp(cellElement);
    } else if (event.key === 'ArrowDown') {
      event.preventDefault();
      this.handleArrowDown(cellElement);
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault();
      this.handleArrowLeft(cellElement);
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      this.handleArrowRight(cellElement);
    }
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
