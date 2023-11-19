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

    const inputTarget = event.composed
      ? event.composedPath().find((element) => {
          return element instanceof HTMLElement && element.matches('input');
        })
      : event.currentTarget;

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
      if (
        inputTarget instanceof HTMLInputElement &&
        ['search', 'text'].includes(inputTarget.type)
      ) {
        const isSelected =
          inputTarget.selectionStart !== inputTarget.selectionEnd;
        const isFullySelected =
          isSelected &&
          inputTarget.selectionStart === 0 &&
          inputTarget.selectionEnd === inputTarget.value.length;
        const isCursorAtStart =
          inputTarget.selectionStart === 0 && inputTarget.selectionEnd === 0;

        if (!isFullySelected && !isCursorAtStart) {
          return;
        }
      }

      event.preventDefault();
      this.handleArrowLeft(cellElement);
    } else if (event.key === 'ArrowRight') {
      if (
        inputTarget instanceof HTMLInputElement &&
        ['search', 'text'].includes(inputTarget.type)
      ) {
        const isSelected =
          inputTarget.selectionStart !== inputTarget.selectionEnd;
        const isFullySelected =
          isSelected &&
          inputTarget.selectionStart === 0 &&
          inputTarget.selectionEnd === inputTarget.value.length;
        const isCursorAtEnd =
          inputTarget.selectionStart === inputTarget.value.length &&
          inputTarget.selectionEnd === inputTarget.value.length;

        if (!isFullySelected && !isCursorAtEnd) {
          return;
        }
      }

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

    const targetRow = rowElements[rowIndex - 1];

    if (!(targetRow instanceof HTMLElement)) {
      return;
    }

    const targetRowCells = Array.from(targetRow.children);

    const targetCell =
      targetRowCells[Math.min(targetRowCells.length - 1, cellIndex)];

    if (!(targetCell instanceof HTMLElement)) {
      return;
    }

    this.focusElement(targetCell);
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

    const targetRow = rowElements[rowIndex + 1];

    if (!(targetRow instanceof HTMLElement)) {
      return;
    }

    const targetRowCells = Array.from(targetRow.children);

    const targetCell =
      targetRowCells[Math.min(targetRowCells.length - 1, cellIndex)];

    if (!(targetCell instanceof HTMLElement)) {
      return;
    }

    this.focusElement(targetCell);
  }

  handleArrowLeft(cellElement: HTMLElement) {
    const previousCell = cellElement.previousElementSibling;

    if (!(previousCell instanceof HTMLElement)) {
      return;
    }

    this.focusElement(previousCell);
  }

  handleArrowRight(cellElement: HTMLElement) {
    const nextCell = cellElement.nextElementSibling;

    if (!(nextCell instanceof HTMLElement)) {
      return;
    }

    this.focusElement(nextCell);
  }

  focusElement(targetCell: HTMLElement) {
    const focusableElement = targetCell.querySelector(
      'input:not([type="hidden"]):not([hidden]), button:not([hidden]), a:not([hidden]), textarea:not([hidden]), select:not([hidden]), [tabindex]:not([hidden])',
    );

    if (!(focusableElement instanceof HTMLElement)) {
      return;
    }

    focusableElement.focus();

    if (
      focusableElement instanceof HTMLInputElement &&
      focusableElement.value.length > 0 &&
      (focusableElement.type === 'text' || focusableElement.type === 'search')
    ) {
      focusableElement.selectionStart = 0;
      focusableElement.selectionEnd = focusableElement.value.length;
    }
  }
}

window.customElements.define(
  'grid-keyboard-navigation',
  GridKeyboardNavigationElement,
);
