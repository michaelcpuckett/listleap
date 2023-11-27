import {
  Constructor,
  SelectionMixinBaseClass,
} from '../SelectionMixinBaseClass';
import { handleInput } from './handleInput';

export interface IRowSelectionMixin extends SelectionMixinBaseClass {
  boundInputHandler: (event: Event) => void;
}

export function RowSelectionMixinFactory<T extends Constructor>(
  constructor: T,
) {
  return class
    extends constructor
    implements SelectionMixinBaseClass, IRowSelectionMixin
  {
    boundInputHandler = handleInput.bind(this);

    connectedCallback() {
      if (constructor.prototype.connectedCallback) {
        constructor.prototype.connectedCallback.call(this);
      }

      this.addEventListener('change', this.boundInputHandler);
    }

    disconnectedCallback() {
      if (constructor.prototype.disconnectedCallback) {
        constructor.prototype.disconnectedCallback.call(this);
      }

      this.removeEventListener('input', this.boundInputHandler);
    }
  };
}

export function RowSelectionMixin() {
  return RowSelectionMixinFactory;
}
