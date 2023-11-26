import { SelectionMixinBaseClass } from '../SelectionMixinBaseClass';
import { IKeyboardSelectionMixin } from '.';
import {
  SELECTABLE_CELL_ELEMENT_SELECTOR,
  ANY_CELL_ELEMENT_SELECTOR,
  INPUT_SELECTOR,
  isInFlyoutMenu,
} from '../constants';

export function handleKeydown(
  this: SelectionMixinBaseClass & IKeyboardSelectionMixin,
  event: Event,
) {
  if (!(event instanceof KeyboardEvent)) {
    return;
  }

  const isInFlyoutMenuElement = !!event.composedPath().find(isInFlyoutMenu);

  if (isInFlyoutMenuElement) {
    return;
  }

  this.isKeyboardShiftKeyPressed = event.key === 'Shift' || event.shiftKey;

  const cellElement = event.composedPath().find((element) => {
    return (
      element instanceof HTMLElement &&
      element.matches(ANY_CELL_ELEMENT_SELECTOR)
    );
  });

  if (!(cellElement instanceof HTMLElement)) {
    return;
  }

  const isEditingCellElement = cellElement.matches(
    ':has(auto-save-text input[type="text"]:not([data-read-only]))',
  );

  if (isEditingCellElement) {
    return;
  }

  switch (event.key) {
    case 'Escape': {
      this.handleEscape(event);
      break;
    }
    case 'ArrowUp':
      this.handleArrowUp(event, cellElement);
      break;
    case 'ArrowDown':
      this.handleArrowDown(event, cellElement);
      break;
    case 'ArrowLeft':
      this.handleArrowLeft(event, cellElement);
      break;
    case 'ArrowRight':
      this.handleArrowRight(event, cellElement);
      break;
    case 'Home':
      this.handleHome(event, cellElement);
      break;
    case 'End':
      this.handleEnd(event, cellElement);
      break;
    case ' ':
      this.handleSpacebar(event, cellElement);
      break;
    case 'Delete':
    case 'Backspace':
      this.handleDelete(event, cellElement);
    default:
      break;
  }
}
