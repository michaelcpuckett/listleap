import { IDragSelectionMixin } from '.';
import { SelectionMixinBaseClass } from '../SelectionMixinBaseClass';

export function handleKeydown(
  this: SelectionMixinBaseClass & IDragSelectionMixin,
  event: Event,
) {
  if (!(event instanceof KeyboardEvent)) {
    return;
  }

  if (!this.isDragShiftKeyPressed) {
    this.isDragShiftKeyPressed = event.key === 'Shift' || event.shiftKey;
  }
}
