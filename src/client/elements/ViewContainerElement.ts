const CELL_ELEMENT_SELECTOR =
  '[role="gridcell"], [role="columnheader"], [role="rowheader"]';

export class ViewContainerElement extends HTMLElement {
  private draggedCellElement: HTMLElement | null = null;
  private dropTargetCellElementAtBounds: HTMLElement | null = null;
  private highlightElement: HTMLElement | null = null;

  constructor() {
    super();

    const addRowButtonElement = this.querySelector('#add-new-row-button');

    if (!(addRowButtonElement instanceof HTMLButtonElement)) {
      throw new Error('Could not find add new row button element');
    }

    const addRowFormElement = addRowButtonElement.form;

    if (!(addRowFormElement instanceof HTMLFormElement)) {
      throw new Error('Could not find add new row form element');
    }

    const gridElement = this.querySelector('[role="grid"]');

    if (!(gridElement instanceof HTMLElement)) {
      throw new Error('Could not find grid element');
    }

    this.addEventListener('dragstart', (event) => {
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

      this.draggedCellElement = closestCellElement;

      this.highlightElement = window.document.createElement('div');
      this.highlightElement.classList.add('highlight');
      const { left, top, height, width } =
        closestCellElement.getBoundingClientRect();
      this.highlightElement.style.width = `${width}px`;
      this.highlightElement.style.height = `${height}px`;
      this.highlightElement.style.top = `${top}px`;
      this.highlightElement.style.left = `${left}px`;

      this.appendChild(this.highlightElement);
    });

    this.addEventListener('dragend', () => {
      if (!this.highlightElement) {
        return;
      }
      const { top, left, bottom, right, height, width } =
        this.highlightElement.getBoundingClientRect();
      this.highlightElement?.remove();
      for (const cellElement of Array.from(
        gridElement.querySelectorAll(CELL_ELEMENT_SELECTOR),
      )) {
        const cellBounds = cellElement.getBoundingClientRect();

        if (
          cellBounds.top >= top &&
          cellBounds.top <= top + height &&
          cellBounds.left >= left &&
          cellBounds.left <= left + width
        ) {
          cellElement.setAttribute('aria-selected', 'true');

          const inputElement = cellElement.querySelector(
            'auto-save-text input',
          );

          if (!(inputElement instanceof HTMLInputElement)) {
            continue;
          }

          inputElement.classList.add('selected');
        }
      }
    });

    this.addEventListener('dragover', (event) => {
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

      const closestRowElement = closestCellElement.closest('[role="row"]');

      if (!(closestRowElement instanceof HTMLElement)) {
        return;
      }

      const closestRowIndex = Array.from(
        gridElement.querySelectorAll('[role="row"]'),
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
    });

    const gridRows = Array.from(gridElement.querySelectorAll('[role="row"]'));

    this.addEventListener('auto-save-text:save', (event: Event) => {
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

      const rowIndex = gridRows.indexOf(rowElement);

      if (Number(rowIndex) !== gridRows.length - 1) {
        return;
      }

      addRowFormElement.submit();
    });
  }
}

window.customElements.define('view-container', ViewContainerElement);
