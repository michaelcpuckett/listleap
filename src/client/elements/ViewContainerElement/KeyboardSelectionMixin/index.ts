import {
  Constructor,
  SelectionMixinBaseClass,
} from '../SelectionMixinBaseClass';
import { handleArrowDown } from './handleArrowDown';
import { handleArrowLeft } from './handleArrowLeft';
import { handleArrowRight } from './handleArrowRight';
import { handleArrowUp } from './handleArrowUp';
import { handleDelete } from './handleDelete';
import { handleEnd } from './handleEnd';
import { handleEscape } from './handleEscape';
import { handleHome } from './handleHome';
import { handleKeydown } from './handleKeydown';
import { handleKeyup } from './handleKeyup';
import { handleSpacebar } from './handleSpacebar';
import { SELECTABLE_CELL_ELEMENT_SELECTOR } from '../constants';

export interface IKeyboardSelectionMixin {
  isKeyboardShiftKeyPressed: boolean;
  isInvertingKeyboardSelection: boolean;
  keyboardOriginCellElement: HTMLElement | null;
  keyboardHighlightElement: HTMLElement | null;
  handleKeydown: (event: Event) => void;
  handleKeyup: (event: Event) => void;
  handleArrowUp: (event: Event, cellElement: HTMLElement) => void;
  handleArrowDown: (event: Event, cellElement: HTMLElement) => void;
  handleArrowLeft: (event: Event, cellElement: HTMLElement) => void;
  handleArrowRight: (event: Event, cellElement: HTMLElement) => void;
  handleHome: (event: Event, cellElement: HTMLElement) => void;
  handleEnd: (event: Event, cellElement: HTMLElement) => void;
  handleEscape: (event: Event) => void;
  handleSpacebar: (event: KeyboardEvent, cellElement: HTMLElement) => void;
  handleDelete: (event: KeyboardEvent, cellElement: HTMLElement) => void;
  sealKeyboardSelectedCells: () => void;
  clearKeyboardHighlight: () => void;
}

function KeyboardSelectionMixinFactory<T extends Constructor>(constructor: T) {
  return class
    extends constructor
    implements SelectionMixinBaseClass, IKeyboardSelectionMixin
  {
    isKeyboardShiftKeyPressed = false;
    isInvertingKeyboardSelection = false;
    keyboardOriginCellElement: HTMLElement | null = null;
    keyboardHighlightElement: HTMLElement | null = null;
    handleKeydown = handleKeydown.bind(this);
    handleKeyup = handleKeyup.bind(this);
    handleArrowUp = handleArrowUp.bind(this);
    handleArrowDown = handleArrowDown.bind(this);
    handleArrowLeft = handleArrowLeft.bind(this);
    handleArrowRight = handleArrowRight.bind(this);
    handleHome = handleHome.bind(this);
    handleEnd = handleEnd.bind(this);
    handleEscape = handleEscape.bind(this);
    handleSpacebar = handleSpacebar.bind(this);
    handleDelete = handleDelete.bind(this);

    connectedCallback() {
      if (constructor.prototype.connectedCallback) {
        constructor.prototype.connectedCallback.call(this);
      }

      this.addEventListener('keydown', this.handleKeydown, {
        capture: true,
      });
      this.addEventListener('keyup', this.handleKeyup);
    }

    disconnectedCallback() {
      if (constructor.prototype.disconnectedCallback) {
        constructor.prototype.disconnectedCallback.call(this);
      }

      this.removeEventListener('keydown', this.handleKeydown, {
        capture: true,
      });
      this.removeEventListener('keyup', this.handleKeyup);
    }

    sealKeyboardSelectedCells() {
      const allCells = Array.from(
        this.gridElement.querySelectorAll(SELECTABLE_CELL_ELEMENT_SELECTOR),
      );

      for (const cell of allCells) {
        if (cell.hasAttribute('aria-selected')) {
          cell.setAttribute('data-selected', '');
        } else {
          cell.removeAttribute('data-selected');
        }
      }
    }

    clearKeyboardHighlight() {
      if (this.keyboardHighlightElement) {
        this.keyboardHighlightElement.remove();
      }

      this.keyboardHighlightElement = null;
      this.keyboardOriginCellElement = null;
    }
  };
}

export function KeyboardSelectionMixin() {
  return KeyboardSelectionMixinFactory;
}
