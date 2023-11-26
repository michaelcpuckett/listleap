import {
  Constructor,
  SelectionMixinBaseClass,
} from '../SelectionMixinBaseClass';
import { handleKeydown } from './handleKeydown';
import { handleKeyup } from './handleKeyup';
import { handlePointerdown } from './handlePointerdown';
import { handlePointermove } from './handlePointermove';
import { handlePointerup } from './handlePointerup';

export interface IDragSelectionMixin extends SelectionMixinBaseClass {
  isDragShiftKeyPressed: boolean;
  isPointerDown: boolean;
  isDragging: boolean;
  lastSelectedCellElement: HTMLElement | null;
  dragOriginCellElement: HTMLElement | null;
  dragHighlightElement: HTMLElement | null;
  pointerId: number;
  boundPointerdownHandler: (event: Event) => void;
  boundPointermoveHandler: (event: Event) => void;
  boundPointerupHandler: (event: Event) => void;
  boundDragKeydownHandler: (event: Event) => void;
  boundDragKeyupHandler: (event: Event) => void;
}

export function DragSelectionMixinFactory<T extends Constructor>(
  constructor: T,
) {
  return class
    extends constructor
    implements SelectionMixinBaseClass, IDragSelectionMixin
  {
    isDragShiftKeyPressed = false;
    isPointerDown = false;
    isDragging = false;
    lastSelectedCellElement: HTMLElement | null = null;
    dragOriginCellElement: HTMLElement | null = null;
    dragHighlightElement: HTMLElement | null = null;
    pointerId = 0;
    boundPointerdownHandler = handlePointerdown.bind(this);
    boundPointermoveHandler = handlePointermove.bind(this);
    boundPointerupHandler = handlePointerup.bind(this);
    boundDragKeydownHandler = handleKeydown.bind(this);
    boundDragKeyupHandler = handleKeyup.bind(this);

    connectedCallback() {
      if (constructor.prototype.connectedCallback) {
        constructor.prototype.connectedCallback.call(this);
      }

      this.addEventListener('pointerdown', this.boundPointerdownHandler);
      this.addEventListener('pointermove', this.boundPointermoveHandler);
      this.addEventListener('pointerup', this.boundPointerupHandler, {
        capture: true,
      });
      this.addEventListener('pointercancel', this.boundPointerupHandler, {
        capture: true,
      });
      this.addEventListener('keydown', this.boundDragKeydownHandler);
      this.addEventListener('keyup', this.boundDragKeyupHandler);
    }

    disconnectedCallback() {
      if (constructor.prototype.disconnectedCallback) {
        constructor.prototype.disconnectedCallback.call(this);
      }

      this.removeEventListener('pointerdown', this.boundPointerdownHandler);
      this.removeEventListener('pointermove', this.boundPointermoveHandler);
      this.removeEventListener('pointerup', this.boundPointerupHandler, {
        capture: true,
      });
      this.removeEventListener('pointercancel', this.boundPointerupHandler, {
        capture: true,
      });

      this.removeEventListener('keydown', this.boundDragKeydownHandler);
      this.removeEventListener('keyup', this.boundDragKeyupHandler);
    }
  };
}

export function DragSelectionMixin() {
  return DragSelectionMixinFactory;
}
