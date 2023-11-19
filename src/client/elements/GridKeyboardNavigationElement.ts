const FOCUSABLE_ELEMENTS_SELECTOR =
  'input:not([type="hidden"]):not([hidden]), button:not([hidden]), a:not([hidden]), textarea:not([hidden]), select:not([hidden]), [tabindex]:not([hidden])';

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

      const cellElement = target.closest('td, th');

      if (!(cellElement instanceof HTMLElement)) {
        return;
      }

      const rowElement = cellElement.closest('tr');

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

      const nextFocusableElement = nextCellElement.querySelector(
        FOCUSABLE_ELEMENTS_SELECTOR,
      );

      if (!(nextFocusableElement instanceof HTMLElement)) {
        return;
      }

      nextFocusableElement.focus();
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

    const autofocusElement = this.querySelector('[data-auto-focus="true"]');
    const focusElementId = sessionStorage.getItem(FOCUS_STORAGE_KEY) || '';
    const focusElement = focusElementId
      ? this.querySelector(`#${focusElementId}`)
      : null;
    const autoFocusedElement = autofocusElement || focusElement;

    if (autoFocusedElement instanceof HTMLElement) {
      return;
    }

    const firstRow = this.querySelector('tr');

    if (!firstRow) {
      return;
    }

    const firstCell = firstRow.querySelector('td, th');

    if (!firstCell) {
      return;
    }

    const firstCellFocusableElements = Array.from(
      firstCell.querySelectorAll(FOCUSABLE_ELEMENTS_SELECTOR),
    );

    const [firstFocusableElement] = firstCellFocusableElements;

    if (!(firstFocusableElement instanceof HTMLElement)) {
      return;
    }

    firstFocusableElement.setAttribute(
      'tabindex',
      firstFocusableElement.dataset.originalTabindex || '0',
    );
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
      return element instanceof HTMLElement && element.matches('td, th');
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

  async handleFocusout(event: Event) {
    if (!(event instanceof FocusEvent)) {
      return;
    }

    const previousCellElement = event.composedPath().find((element) => {
      return element instanceof HTMLElement && element.matches('td, th');
    });

    const focusedElement = window.document.activeElement;
    const focusedCellElement =
      focusedElement && this.contains(focusedElement)
        ? focusedElement.closest('td, th')
        : null;

    const unfocusedCellElements = Array.from(
      this.querySelectorAll('td, th'),
    ).filter((cellElement) => {
      return cellElement !== (focusedCellElement || previousCellElement);
    });

    for (const unfocusedCellElement of unfocusedCellElements) {
      const focusableElements = Array.from(
        unfocusedCellElement.querySelectorAll(FOCUSABLE_ELEMENTS_SELECTOR),
      );

      for (const focusableElement of focusableElements) {
        if (focusableElement instanceof HTMLElement) {
          focusableElement.setAttribute('tabindex', '-1');
        }
      }
    }
  }

  handleKeydown(event: Event) {
    if (!(event instanceof KeyboardEvent)) {
      return;
    }

    const target = event.composedPath().find((element) => {
      return element instanceof HTMLElement && element.matches('td, th');
    });

    if (!(target instanceof HTMLElement)) {
      return;
    }

    const cellElement = target.closest('td, th');

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

    this.focusElement(targetCellElement);
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
    const targetCellElementFocusableElements = Array.from(
      targetCellElement.querySelectorAll(FOCUSABLE_ELEMENTS_SELECTOR),
    );

    const [firstFocusableElement] = targetCellElementFocusableElements;

    if (firstFocusableElement instanceof HTMLElement) {
      firstFocusableElement.focus();
    }
  }
}

window.customElements.define(
  'grid-keyboard-navigation',
  GridKeyboardNavigationElement,
);
