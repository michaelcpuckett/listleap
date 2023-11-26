import { SelectionMixinBaseClass } from '../SelectionMixinBaseClass';
import { IKeyboardSelectionMixin } from '.';
import {
  SELECTABLE_CELL_ELEMENT_SELECTOR,
  ANY_CELL_ELEMENT_SELECTOR,
  INPUT_SELECTOR,
  isInFlyoutMenu,
} from '../constants';

export function handleDelete(
  this: SelectionMixinBaseClass & IKeyboardSelectionMixin,
  event: KeyboardEvent,
  cellElement: HTMLElement,
) {
  const selectedCellElements = Array.from(
    this.querySelectorAll(
      `[aria-selected="true"]:is(${SELECTABLE_CELL_ELEMENT_SELECTOR})`,
    ),
  );

  if (!selectedCellElements.length) {
    return;
  }

  this.dispatchEvent(
    new CustomEvent('view-container:clear-cells', {
      bubbles: true,
      composed: true,
      detail: selectedCellElements,
    }),
  );
}
