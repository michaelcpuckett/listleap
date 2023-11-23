const CELL_ELEMENT_SELECTOR = '[role="gridcell"], [role="rowheader"]';

function isHtmlElement(element: unknown): element is HTMLElement {
  return element instanceof HTMLElement;
}

export class ViewContainerElement extends HTMLElement {
  private gridElement: HTMLElement;
  private draggedCellElement: HTMLElement | null = null;
  private highlightElement: HTMLElement | null = null;
  private isShiftKeyPressed = false;
  private isInvertingSelection = false;
  private boundDragstartHandler = this.handleDragstart.bind(this);
  private boundDragendHandler = this.handleDragend.bind(this);
  private boundDragoverHandler = this.handleDragover.bind(this);
  private boundKeydownHandler = this.handleKeydown.bind(this);
  private boundKeyupHandler = this.handleKeyup.bind(this);
  private boundHandleAutoSaveTextSave = this.handleAutoSaveTextSave.bind(this);
  private boundClickHandler = this.handleClick.bind(this);

  constructor() {
    super();

    const gridElement = this.querySelector('[role="grid"]');

    if (!(gridElement instanceof HTMLElement)) {
      throw new Error('Could not find grid element');
    }

    this.gridElement = gridElement;
  }

  connectedCallback() {
    this.addEventListener('mousedown', this.boundDragstartHandler);
    this.addEventListener('touchstart', this.boundDragstartHandler);
    this.addEventListener('mouseover', this.boundDragoverHandler);
    this.addEventListener('touchmove', this.boundDragoverHandler);
    this.addEventListener('mouseup', this.boundDragendHandler, {
      capture: true,
    });
    this.addEventListener('touchend', this.boundDragendHandler, {
      capture: true,
    });
    this.addEventListener('touchcancel', this.boundDragendHandler, {
      capture: true,
    });
    this.addEventListener('keydown', this.boundKeydownHandler);
    this.addEventListener('keyup', this.boundKeyupHandler);
    this.addEventListener(
      'auto-save-text:save',
      this.boundHandleAutoSaveTextSave,
    );
  }

  disconnectedCallback() {
    this.removeEventListener('mousedown', this.boundDragstartHandler);
    this.removeEventListener('touchstart', this.boundDragstartHandler);
    this.removeEventListener('mouseover', this.boundDragoverHandler);
    this.removeEventListener('touchmove', this.boundDragoverHandler);
    this.removeEventListener('mouseup', this.boundDragendHandler, {
      capture: true,
    });
    this.removeEventListener('touchend', this.boundDragendHandler, {
      capture: true,
    });
    this.removeEventListener('touchcancel', this.boundDragendHandler, {
      capture: true,
    });
    this.removeEventListener('keydown', this.boundKeydownHandler);
    this.removeEventListener('keyup', this.boundKeyupHandler);
    this.removeEventListener(
      'auto-save-text:save',
      this.boundHandleAutoSaveTextSave,
    );
  }

  getElementsFromComposedPath(event: Event) {
    const composedPath = event.composedPath();

    const autoSaveTextElement = composedPath.find((element) => {
      if (!(element instanceof HTMLElement)) {
        return false;
      }

      return element.matches('auto-save-text input');
    });

    if (!(autoSaveTextElement instanceof HTMLInputElement)) {
      return;
    }

    const closestCellElement = autoSaveTextElement.closest(
      CELL_ELEMENT_SELECTOR,
    );

    if (!(closestCellElement instanceof HTMLElement)) {
      return;
    }

    return {
      autoSaveTextElement,
      closestCellElement,
    };
  }

  initializeHighlightElement(cellElement: HTMLElement) {
    this.highlightElement = window.document.createElement('div');
    this.highlightElement.classList.add('highlight');
    const { left, top } = cellElement.getBoundingClientRect();
    this.highlightElement.style.top = `${top}px`;
    this.highlightElement.style.left = `${left}px`;

    this.appendChild(this.highlightElement);
  }

  handleDragstart(event: Event) {
    const elements = this.getElementsFromComposedPath(event);

    if (!elements) {
      return;
    }

    const { closestCellElement } = elements;

    this.isInvertingSelection =
      closestCellElement.hasAttribute('aria-selected');

    if (this.isShiftKeyPressed) {
      if (this.isInvertingSelection) {
        closestCellElement.removeAttribute('aria-selected');
      } else {
        closestCellElement.setAttribute('aria-selected', 'true');
      }
    }

    if (event instanceof TouchEvent) {
      window.document.body.classList.add('prevent-scroll');
    }

    this.initializeHighlightElement(closestCellElement);

    this.draggedCellElement = closestCellElement;
  }

  getElementsFromPoint(event: Event) {
    let closestCellElement: Element | null = null;

    if (event instanceof TouchEvent) {
      const touchLocation = event.changedTouches[0];
      const touchTarget = window.document.elementFromPoint(
        touchLocation.clientX,
        touchLocation.clientY,
      );

      if (touchTarget instanceof Element) {
        closestCellElement = touchTarget.matches(CELL_ELEMENT_SELECTOR)
          ? touchTarget
          : touchTarget.closest(CELL_ELEMENT_SELECTOR);
      }
    } else {
      for (const element of Array.from(event.composedPath())) {
        if (!(element instanceof Element)) {
          continue;
        }

        if (element.matches(CELL_ELEMENT_SELECTOR)) {
          closestCellElement = element;
          break;
        }
      }
    }

    if (!(closestCellElement instanceof HTMLElement)) {
      return;
    }

    const autoSaveTextElement = closestCellElement.querySelector(
      'auto-save-text input',
    );

    if (!(autoSaveTextElement instanceof HTMLElement)) {
      return;
    }

    return {
      autoSaveTextElement,
      closestCellElement,
    };
  }

  updateHighlightElement(
    cellElement: HTMLElement,
    draggedCellElement: HTMLElement,
  ) {
    if (!this.highlightElement) {
      return;
    }
    const closestRowElement = cellElement.closest('[role="row"]');

    if (!(closestRowElement instanceof HTMLElement)) {
      return;
    }

    const closestRowIndex = Array.from(
      this.gridElement.querySelectorAll('[role="row"]'),
    ).indexOf(closestRowElement);

    if (closestRowIndex === -1) {
      return;
    }

    const closestCellIndex = Array.from(
      closestRowElement.querySelectorAll(CELL_ELEMENT_SELECTOR),
    ).indexOf(cellElement);

    if (closestCellIndex === -1) {
      return;
    }

    const draggedRow = draggedCellElement.closest('[role="row"]');

    if (!(draggedRow instanceof HTMLElement)) {
      return;
    }

    const draggedRowTop = draggedRow.getBoundingClientRect().top;
    const closestRowTop = closestRowElement.getBoundingClientRect().top;

    const draggedCellLeft = draggedCellElement.getBoundingClientRect().left;
    const closestCellLeft = cellElement.getBoundingClientRect().left;

    const diffX = closestCellLeft - draggedCellLeft;
    const diffY = closestRowTop - draggedRowTop;

    this.highlightElement.style.height = `${
      Math.abs(diffY) + draggedCellElement.getBoundingClientRect().height
    }px`;
    this.highlightElement.style.width = `${
      Math.abs(diffX) + draggedCellElement.getBoundingClientRect().width
    }px`;

    if (diffX < 0) {
      this.highlightElement.style.left = `${
        cellElement.getBoundingClientRect().left
      }px`;
    } else {
      this.highlightElement.style.left = `${
        draggedCellElement.getBoundingClientRect().left
      }px`;
    }

    if (diffY < 0) {
      this.highlightElement.style.top = `${
        cellElement.getBoundingClientRect().top
      }px`;
    } else {
      this.highlightElement.style.top = `${
        draggedCellElement.getBoundingClientRect().top
      }px`;
    }
  }

  handleDragover(event: Event) {
    if (!this.draggedCellElement) {
      return;
    }

    if (!this.highlightElement) {
      return;
    }

    const elements = this.getElementsFromPoint(event);

    if (!elements) {
      return;
    }

    const { closestCellElement } = elements;

    this.updateHighlightElement(closestCellElement, this.draggedCellElement);

    const { top, left, bottom, right } =
      this.highlightElement.getBoundingClientRect();

    const allCellElements = Array.from(
      this.gridElement.querySelectorAll(CELL_ELEMENT_SELECTOR),
    ).filter(isHtmlElement);

    const markCellSelected = (cellElement: HTMLElement) => {
      cellElement.setAttribute('aria-selected', 'true');

      const inputElement = cellElement.querySelector('auto-save-text input');

      if (!(inputElement instanceof HTMLInputElement)) {
        return;
      }

      inputElement.classList.add('selected');
    };

    const markCellUnselected = (cellElement: HTMLElement) => {
      cellElement.removeAttribute('aria-selected');
      cellElement.removeAttribute('data-selected');

      const inputElement = cellElement.querySelector('auto-save-text input');

      if (!(inputElement instanceof HTMLInputElement)) {
        return;
      }

      inputElement.classList.remove('selected');
    };

    for (const cellElement of allCellElements) {
      const cellBounds = cellElement.getBoundingClientRect();
      const isWithinBounds =
        Math.ceil(cellBounds.top) >= Math.ceil(top) &&
        Math.ceil(cellBounds.bottom) <= Math.ceil(bottom) &&
        Math.ceil(cellBounds.left) >= Math.ceil(left) &&
        Math.ceil(cellBounds.right) <= Math.ceil(right);

      if (isWithinBounds) {
        markCellSelected(cellElement);
      } else {
        markCellUnselected(cellElement);
      }
    }
  }

  handleDragend(event: Event) {
    if (!this.highlightElement) {
      return;
    }

    if (event instanceof TouchEvent) {
      if (event.touches.length > 0) {
        return;
      }

      window.document.body.classList.remove('prevent-scroll');
    }

    this.highlightElement.remove();
    this.highlightElement = null;
    this.draggedCellElement = null;

    let closestCellElement: Element | null = null;

    if (event instanceof TouchEvent) {
      const touchLocation = event.changedTouches[0];
      const touchTarget = window.document.elementFromPoint(
        touchLocation.clientX,
        touchLocation.clientY,
      );

      if (touchTarget instanceof Element) {
        closestCellElement = touchTarget.matches(CELL_ELEMENT_SELECTOR)
          ? touchTarget
          : touchTarget.closest(CELL_ELEMENT_SELECTOR);
      }
    } else {
      for (const element of Array.from(event.composedPath())) {
        if (!(element instanceof Element)) {
          continue;
        }

        if (element.matches(CELL_ELEMENT_SELECTOR)) {
          closestCellElement = element;
          break;
        }
      }
    }

    if (!(closestCellElement instanceof HTMLElement)) {
      return;
    }

    event.stopImmediatePropagation();
    event.stopPropagation();
    event.preventDefault();

    const markCellSelected = (cellElement: Element) => {
      if (!(cellElement instanceof HTMLElement)) {
        return;
      }

      cellElement.setAttribute('aria-selected', 'true');
      cellElement.setAttribute('data-read-only', '');

      const inputElement = cellElement.querySelector('auto-save-text input');

      if (!(inputElement instanceof HTMLInputElement)) {
        return;
      }

      inputElement.classList.add('selected');
    };

    const markCellUnselected = (cellElement: Element) => {
      if (!(cellElement instanceof HTMLElement)) {
        return;
      }

      cellElement.removeAttribute('aria-selected');
      cellElement.removeAttribute('data-selected');
      cellElement.setAttribute('data-read-only', '');

      const inputElement = cellElement.querySelector('auto-save-text input');

      if (!(inputElement instanceof HTMLInputElement)) {
        return;
      }

      inputElement.classList.remove('selected');
    };

    if (closestCellElement.getAttribute('aria-selected') === 'true') {
      if (this.isShiftKeyPressed) {
        if (this.isInvertingSelection) {
          markCellUnselected(closestCellElement);
        } else {
          markCellSelected(closestCellElement);
        }
      }
    } else {
      if (!this.isShiftKeyPressed) {
        const selectedCells = Array.from(
          this.gridElement.querySelectorAll(
            `[aria-selected="true"]:is(${CELL_ELEMENT_SELECTOR})`,
          ),
        );

        for (const selectedCell of selectedCells) {
          markCellUnselected(selectedCell);
        }
      }
    }

    closestCellElement.focus();
  }

  handleAutoSaveTextSave(event: Event) {
    if (!(event instanceof CustomEvent)) {
      return;
    }

    const { target } = event;

    if (!(target instanceof HTMLElement)) {
      return;
    }

    const rowElement = target.closest('[role="row"]');

    if (!(rowElement instanceof HTMLElement)) {
      return;
    }

    const gridRows = Array.from(
      this.gridElement.querySelectorAll('[role="row"]'),
    );

    const rowIndex = gridRows.indexOf(rowElement);

    if (Number(rowIndex) !== gridRows.length - 1) {
      return;
    }

    const addRowButtonElement = this.querySelector('#add-new-row-button');

    if (!(addRowButtonElement instanceof HTMLButtonElement)) {
      throw new Error('Could not find add new row button element');
    }

    const addRowFormElement = addRowButtonElement.form;

    if (!(addRowFormElement instanceof HTMLFormElement)) {
      throw new Error('Could not find add new row form element');
    }

    addRowFormElement.submit();
  }

  handleKeydown(event: Event) {
    if (!(event instanceof KeyboardEvent)) {
      return;
    }

    this.isShiftKeyPressed = event.shiftKey || event.key === 'Shift';

    if (this.isShiftKeyPressed) {
      const selectedCells = Array.from(
        this.gridElement.querySelectorAll(
          `[aria-selected="true"]:is(${CELL_ELEMENT_SELECTOR})`,
        ),
      );

      for (const selectedCell of selectedCells) {
        selectedCell.setAttribute('data-selected', '');
      }
    }

    if (event.key === 'Escape') {
      const selectedCells = Array.from(
        this.gridElement.querySelectorAll(
          `[aria-selected="true"]:is(${CELL_ELEMENT_SELECTOR})`,
        ),
      );

      for (const selectedCell of selectedCells) {
        selectedCell.removeAttribute('aria-selected');
        selectedCell.removeAttribute('data-selected');
      }
    }
  }

  handleKeyup(event: Event) {
    if (!(event instanceof KeyboardEvent)) {
      return;
    }

    this.isShiftKeyPressed = false;

    const selectedCells = Array.from(
      this.gridElement.querySelectorAll(
        `[data-selected="true"]:is(${CELL_ELEMENT_SELECTOR})`,
      ),
    );

    for (const selectedCell of selectedCells) {
      selectedCell.removeAttribute('data-selected');
    }
  }

  handleClick() {
    if (this.isShiftKeyPressed) {
      return;
    }

    const selectedCells = Array.from(
      this.gridElement.querySelectorAll(
        `[aria-selected="true"]:is(${CELL_ELEMENT_SELECTOR})`,
      ),
    );

    for (const selectedCell of selectedCells) {
      selectedCell.removeAttribute('aria-selected');
      selectedCell.removeAttribute('data-selected');
    }
  }
}

window.customElements.define('view-container', ViewContainerElement);
