import { DragSelectionMixin, IDragSelectionMixin } from '.';
import { SelectionMixinBaseClass } from '../SelectionMixinBaseClass';

export function handleDragstart(
  this: SelectionMixinBaseClass & IDragSelectionMixin,
  event: Event,
) {
  event.preventDefault();
}
