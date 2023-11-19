const FOCUSABLE_ELEMENTS_SELECTOR =
  'input:not([type="hidden"]):not([hidden]), button:not([hidden]), a:not([hidden]), textarea:not([hidden]), select:not([hidden]), [tabindex]:not([hidden])';

export class GridKeyboardNavigationElement extends HTMLElement {
  private boundKeydownHandler = this.handleKeydown.bind(this);

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

    const target = event.composed
      ? event.composedPath().find((element) => {
          return element instanceof HTMLElement && element.matches('td, th');
        })
      : event.currentTarget;

    if (!(target instanceof HTMLElement)) {
      return;
    }

    const cellElement = target.closest('td, th');

    if (!(cellElement instanceof HTMLElement)) {
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
    const rowElement = cellElement.closest('tr');

    if (!rowElement) {
      return;
    }

    const cellIndex = Array.from(rowElement.children).indexOf(cellElement);

    const tableElement = rowElement.closest('table');

    if (!(tableElement instanceof HTMLElement)) {
      return;
    }

    const rowElements = Array.from(tableElement.querySelectorAll('tr'));

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

    this.focusElement(targetCellElement, cellElement);
  }

  handleArrowDown(cellElement: HTMLElement) {
    const rowElement = cellElement.closest('tr');

    if (!rowElement) {
      return;
    }

    const cellIndex = Array.from(rowElement.children).indexOf(cellElement);

    const tableElement = rowElement.closest('table');

    if (!(tableElement instanceof HTMLElement)) {
      return;
    }

    const rowElements = Array.from(tableElement.querySelectorAll('tr'));

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

    this.focusElement(targetCellElement, cellElement);
  }

  handleArrowLeft(cellElement: HTMLElement) {
    const previousCellElement = cellElement.previousElementSibling;

    if (!(previousCellElement instanceof HTMLElement)) {
      return;
    }

    this.focusElement(previousCellElement, cellElement);
  }

  handleArrowRight(cellElement: HTMLElement) {
    const nextCellElement = cellElement.nextElementSibling;

    if (!(nextCellElement instanceof HTMLElement)) {
      return;
    }

    this.focusElement(nextCellElement, cellElement);
  }

  focusElement(targetCellElement: HTMLElement, cellElement: HTMLElement) {
    const targetCellElementFocusableElements = Array.from(
      targetCellElement.querySelectorAll(FOCUSABLE_ELEMENTS_SELECTOR),
    );

    for (const targetCellElementFocusableElement of targetCellElementFocusableElements) {
      if (targetCellElementFocusableElement instanceof HTMLElement) {
        targetCellElementFocusableElement.dataset.originalTabindex =
          targetCellElementFocusableElement.getAttribute('tabindex') || '';
      }

      targetCellElementFocusableElement.setAttribute('tabindex', '0');
    }

    const [firstFocusableElement] = targetCellElementFocusableElements;

    if (firstFocusableElement instanceof HTMLElement) {
      firstFocusableElement.focus();
    }

    const cellElementFocusableElements = Array.from(
      cellElement.querySelectorAll(FOCUSABLE_ELEMENTS_SELECTOR),
    );

    for (const cellElementFocusableElement of cellElementFocusableElements) {
      if (cellElementFocusableElement instanceof HTMLElement) {
        const originalTabindex =
          cellElementFocusableElement.dataset.originalTabindex;
        cellElementFocusableElement.removeAttribute('data-original-tabindex');
        cellElementFocusableElement.setAttribute(
          'tabindex',
          originalTabindex || '-1',
        );
      } else {
        cellElementFocusableElement.setAttribute('tabindex', '-1');
      }
    }
  }
}

window.customElements.define(
  'grid-keyboard-navigation',
  GridKeyboardNavigationElement,
);
