import { IRowSelectionMixin } from '.';
import { SelectionMixinBaseClass } from '../SelectionMixinBaseClass';

export function handleInput(
  this: SelectionMixinBaseClass & IRowSelectionMixin,
  event: Event,
) {
  const cellElement = this.getClosestCellElementFromComposedPath(event);

  if (!(cellElement instanceof HTMLElement)) {
    return;
  }

  const hasRowSelctionCheckbox = cellElement.matches(
    ':has(input[name="row[]"])',
  );

  if (!hasRowSelctionCheckbox) {
    return;
  }

  const rowSelectionCheckbox = cellElement.querySelector('input[name="row[]"]');

  if (!(rowSelectionCheckbox instanceof HTMLInputElement)) {
    return;
  }

  this.clearCellSelection();
}
