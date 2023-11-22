const CELL_ELEMENT_SELECTOR = '[role="gridcell"], [role="rowheader"]';

export class ViewContainerElement extends HTMLElement {
  private gridElement: HTMLElement;
  private draggedCellElement: HTMLElement | null = null;
  private highlightElement: HTMLElement | null = null;
  private isShiftKeyPressed = false;
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
    // this.addEventListener('dragstart', this.boundDragstartHandler);
    this.addEventListener('mousedown', this.boundDragstartHandler);
    this.addEventListener('touchstart', this.boundDragstartHandler);
    // this.addEventListener('dragover', this.boundDragoverHandler);
    this.addEventListener('mouseover', this.boundDragoverHandler);
    this.addEventListener('touchmove', this.boundDragoverHandler);
    // this.addEventListener('dragend', this.boundDragendHandler);
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
    // this.addEventListener('pointerdown', this.boundPointerdownHandler);
    // this.addEventListener('click', this.boundClickHandler);
    this.addEventListener(
      'auto-save-text:save',
      this.boundHandleAutoSaveTextSave,
    );
  }

  disconnectedCallback() {
    // this.removeEventListener('dragstart', this.boundDragstartHandler);
    this.removeEventListener('pointerdown', this.boundDragstartHandler);
    // this.removeEventListener('dragover', this.boundDragoverHandler);
    this.removeEventListener('pointerover', this.boundDragoverHandler);
    // this.removeEventListener('dragend', this.boundDragendHandler);
    this.removeEventListener('pointerup', this.boundDragendHandler);
    // this.removeEventListener('drop', this.boundDropHandler);
    // this.removeEventListener('pointerdown', this.boundPointerdownHandler);
    // this.removeEventListener(
    //   'auto-save-text:save',
    //   this.boundHandleAutoSaveTextSave,
    // );
  }

  handleDragstart(event: Event) {
    if (event instanceof PointerEvent) {
      if (event.target instanceof HTMLElement) {
        event.target.releasePointerCapture(event.pointerId);
      }
    }

    const autoSaveTextElement = event.composedPath().find((element) => {
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

    if (event instanceof DragEvent) {
      event.dataTransfer?.setData('text/plain', autoSaveTextElement.id);
      const img = new Image();
      img.src = '/empty.gif';
      event.dataTransfer?.setDragImage(img, 10, 10);
    }

    this.draggedCellElement = closestCellElement;
    if (event instanceof TouchEvent) {
      // event.preventDefault();
      window.document.body.classList.add('prevent-scroll');
    }

    this.highlightElement = window.document.createElement('div');
    this.highlightElement.classList.add('highlight');
    const { left, top } = closestCellElement.getBoundingClientRect();
    this.highlightElement.style.top = `${top}px`;
    this.highlightElement.style.left = `${left}px`;

    this.appendChild(this.highlightElement);
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

    const prevDraggedCellElement = this.draggedCellElement;

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
    closestCellElement.focus();

    if (closestCellElement.getAttribute('aria-selected') === 'true') {
      if (
        this.isShiftKeyPressed &&
        prevDraggedCellElement === closestCellElement
      ) {
        closestCellElement.removeAttribute('aria-selected');
      }
    } else {
      if (this.isShiftKeyPressed) {
        closestCellElement.setAttribute('aria-selected', 'true');
      } else {
        const selectedCells = Array.from(
          this.gridElement.querySelectorAll(
            `${CELL_ELEMENT_SELECTOR}[aria-selected="true"]`,
          ),
        );

        for (const selectedCell of selectedCells) {
          selectedCell.removeAttribute('aria-selected');
        }
      }
    }
  }

  handleDragover(event: Event) {
    if (!this.draggedCellElement) {
      return;
    }

    if (!this.highlightElement) {
      return;
    }

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

    if (!closestCellElement) {
      return;
    }

    const autoSaveTextElement = closestCellElement.querySelector(
      'auto-save-text input',
    );

    if (!(autoSaveTextElement instanceof HTMLElement)) {
      return;
    }

    const closestRowElement = closestCellElement.closest('[role="row"]');

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
    ).indexOf(closestCellElement);

    if (closestCellIndex === -1) {
      return;
    }

    const draggedRow = this.draggedCellElement.closest('[role="row"]');

    if (!(draggedRow instanceof HTMLElement)) {
      return;
    }
    // if (closestCellElement === this.draggedCellElement) {
    //   return;
    // }

    const draggedRowTop = draggedRow.getBoundingClientRect().top;
    const closestRowTop = closestRowElement.getBoundingClientRect().top;

    const draggedCellLeft =
      this.draggedCellElement.getBoundingClientRect().left;
    const closestCellLeft = closestCellElement.getBoundingClientRect().left;

    const diffX = closestCellLeft - draggedCellLeft;
    const diffY = closestRowTop - draggedRowTop;

    if (event instanceof TouchEvent) {
      // event.preventDefault();
    }

    this.highlightElement.style.height = `${
      Math.abs(diffY) + this.draggedCellElement.getBoundingClientRect().height
    }px`;
    this.highlightElement.style.width = `${
      Math.abs(diffX) + this.draggedCellElement.getBoundingClientRect().width
    }px`;

    if (diffX < 0) {
      this.highlightElement.style.left = `${
        closestCellElement.getBoundingClientRect().left
      }px`;
    } else {
      this.highlightElement.style.left = `${
        this.draggedCellElement.getBoundingClientRect().left
      }px`;
    }

    if (diffY < 0) {
      this.highlightElement.style.top = `${
        closestCellElement.getBoundingClientRect().top
      }px`;
    } else {
      this.highlightElement.style.top = `${
        this.draggedCellElement.getBoundingClientRect().top
      }px`;
    }

    const { top, left, bottom, right, height, width } =
      this.highlightElement.getBoundingClientRect();

    for (const cellElement of Array.from(
      this.gridElement.querySelectorAll(CELL_ELEMENT_SELECTOR),
    )) {
      const cellBounds = cellElement.getBoundingClientRect();

      if (
        Math.ceil(cellBounds.top) >= Math.ceil(top) &&
        Math.ceil(cellBounds.bottom) <= Math.ceil(bottom) &&
        Math.ceil(cellBounds.left) >= Math.ceil(left) &&
        Math.ceil(cellBounds.right) <= Math.ceil(right)
      ) {
        cellElement.setAttribute('aria-selected', 'true');

        const inputElement = cellElement.querySelector('auto-save-text input');

        if (!(inputElement instanceof HTMLInputElement)) {
          continue;
        }

        inputElement.classList.add('selected');
      } else {
        if (
          !this.isShiftKeyPressed &&
          !cellElement.hasAttribute('data-selected')
        ) {
          cellElement.removeAttribute('aria-selected');

          const inputElement = cellElement.querySelector(
            'auto-save-text input',
          );

          if (!(inputElement instanceof HTMLInputElement)) {
            continue;
          }

          inputElement.classList.remove('selected');
        }
      }
    }
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
          `${CELL_ELEMENT_SELECTOR}[aria-selected="true"]`,
        ),
      );

      for (const selectedCell of selectedCells) {
        selectedCell.setAttribute('data-selected', '');
      }
    }

    if (event.key === 'Escape') {
      const selectedCells = Array.from(
        this.gridElement.querySelectorAll(
          `${CELL_ELEMENT_SELECTOR}[aria-selected="true"]`,
        ),
      );

      for (const selectedCell of selectedCells) {
        selectedCell.removeAttribute('aria-selected');
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
        `${CELL_ELEMENT_SELECTOR}[aria-selected="true"]`,
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
        `${CELL_ELEMENT_SELECTOR}[aria-selected="true"]`,
      ),
    );

    for (const selectedCell of selectedCells) {
      selectedCell.removeAttribute('aria-selected');
    }
  }
}

window.customElements.define('view-container', ViewContainerElement);
