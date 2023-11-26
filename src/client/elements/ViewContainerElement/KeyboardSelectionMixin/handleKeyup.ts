import { SelectionMixinBaseClass } from '../SelectionMixinBaseClass';
import { IKeyboardSelectionMixin } from '.';

export function handleKeyup(
  this: SelectionMixinBaseClass & IKeyboardSelectionMixin,
  event: Event,
) {
  if (!(event instanceof KeyboardEvent)) {
    return;
  }

  this.isKeyboardShiftKeyPressed = event.shiftKey;

  if (!this.isKeyboardShiftKeyPressed) {
    this.clearKeyboardHighlight();
    this.sealKeyboardSelectedCells();
  }
}
