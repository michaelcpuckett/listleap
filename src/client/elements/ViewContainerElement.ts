const CELL_ELEMENT_SELECTOR =
  '[role="gridcell"], [role="columnheader"], [role="rowheader"]';

export class ViewContainerElement extends HTMLElement {
  private gridElement: HTMLElement;
  private draggedCellElement: HTMLElement | null = null;
  private highlightElement: HTMLElement | null = null;
  private boundDragstartHandler = this.handleDragstart.bind(this);
  private boundDragendHandler = this.handleDragend.bind(this);
  private boundDragoverHandler = this.handleDragover.bind(this);
  private boundPointerdownHandler = this.handlePointerdown.bind(this);
  private boundDropHandler = this.handleDrop.bind(this);
  private boundHandleAutoSaveTextSave = this.handleAutoSaveTextSave.bind(this);

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
    this.addEventListener('pointerdown', this.boundDragstartHandler);
    // this.addEventListener('dragover', this.boundDragoverHandler);
    this.addEventListener('pointerover', this.boundDragoverHandler);
    // this.addEventListener('dragend', this.boundDragendHandler);
    this.addEventListener('pointerup', this.boundDragendHandler);
    // this.addEventListener('pointercancel', this.boundDragendHandler);
    // this.addEventListener('drop', this.boundDropHandler);
    // this.addEventListener('pointerdown', this.boundPointerdownHandler);
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
    console.log('DRAGSTART...');
    if (event instanceof PointerEvent) {
      if (event.target instanceof HTMLElement) {
        // event.target.releasePointerCapture(event.pointerId);
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

    const selectedCells = Array.from(
      this.gridElement.querySelectorAll(
        `${CELL_ELEMENT_SELECTOR}[aria-selected="true"]`,
      ),
    );

    for (const selectedCell of selectedCells) {
      selectedCell.removeAttribute('aria-selected');
    }

    this.highlightElement = window.document.createElement('div');
    this.highlightElement.classList.add('highlight');
    const { left, top, height, width } =
      closestCellElement.getBoundingClientRect();
    // this.highlightElement.style.width = `${width}px`;
    // this.highlightElement.style.height = `${height}px`;
    this.highlightElement.style.top = `${top}px`;
    this.highlightElement.style.left = `${left}px`;

    this.appendChild(this.highlightElement);

    console.log('HIGHLIGHT ELEMENT CREATED.');
  }

  handleDragend() {
    console.log('DRAG END...');

    if (!this.highlightElement) {
      return;
    }

    const { top, left, bottom, right, height, width } =
      this.highlightElement.getBoundingClientRect();
    this.highlightElement.remove();
    this.highlightElement = null;
    this.draggedCellElement = null;
    console.log('REMOVED HIGHLIGHT');

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

    console.log('dragover');

    const autoSaveTextElement = event.composedPath().find((element) => {
      if (!(element instanceof HTMLElement)) {
        return false;
      }

      return element.matches('auto-save-text input');
    });

    if (!(autoSaveTextElement instanceof HTMLElement)) {
      return;
    }

    const closestCellElement = autoSaveTextElement.closest(
      CELL_ELEMENT_SELECTOR,
    );

    if (!(closestCellElement instanceof HTMLElement)) {
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
    if (closestCellElement === this.draggedCellElement) {
      console.log('same, no change...');
      return;
    }

    const draggedRowTop = draggedRow.getBoundingClientRect().top;
    const closestRowTop = closestRowElement.getBoundingClientRect().top;

    const draggedCellLeft =
      this.draggedCellElement.getBoundingClientRect().left;
    const closestCellLeft = closestCellElement.getBoundingClientRect().left;

    const diffX = closestCellLeft - draggedCellLeft;
    const diffY = closestRowTop - draggedRowTop;

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
  }

  handlePointerdown(event: Event) {
    window.document.body.style.overflow = 'hidden';
    const selectedCells = Array.from(
      this.gridElement.querySelectorAll(
        `${CELL_ELEMENT_SELECTOR}[aria-selected="true"]`,
      ),
    );

    for (const selectedCell of selectedCells) {
      selectedCell.removeAttribute('aria-selected');
    }
  }

  handleDrop(event: Event) {
    event.preventDefault();

    if (!this.draggedCellElement) {
      return;
    }

    if (!this.highlightElement) {
      return;
    }

    const autoSaveTextElement = event.composedPath().find((element) => {
      if (!(element instanceof HTMLElement)) {
        return false;
      }

      return element.matches('auto-save-text input');
    });

    if (!(autoSaveTextElement instanceof HTMLElement)) {
      return;
    }

    const closestCellElement = autoSaveTextElement.closest(
      CELL_ELEMENT_SELECTOR,
    );

    if (!(closestCellElement instanceof HTMLElement)) {
      return;
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
}

window.customElements.define('view-container', ViewContainerElement);
