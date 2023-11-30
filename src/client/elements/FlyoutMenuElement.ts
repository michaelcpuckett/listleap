import { FOCUSABLE_ELEMENT_SELECTOR } from 'shared/constants';

export class FlyoutMenuElement extends HTMLElement {
  private detailsElement: HTMLDetailsElement;
  private summaryElement: HTMLElement;
  private menuItemElements: HTMLElement[];
  private boundKeydownHandler = this.handleKeydown.bind(this);
  private boundToggleHandler = this.handleToggle.bind(this);
  private boundClickHandler = this.handleClick.bind(this);
  private boundFocusoutHandler = this.handleFocusout.bind(this);

  constructor() {
    super();

    const detailsElement = this.querySelector('details');

    if (!(detailsElement instanceof HTMLDetailsElement)) {
      throw new Error('Could not find details element');
    }

    this.detailsElement = detailsElement;

    const summaryElement = this.querySelector('summary');

    if (!(summaryElement instanceof HTMLElement)) {
      throw new Error('Could not find summary element');
    }

    this.summaryElement = summaryElement;

    const menuElement = this.querySelector('[role="menu"]');

    if (!(menuElement instanceof HTMLElement)) {
      throw new Error('Could not find menu element');
    }

    function isHtmlElement(
      element: Element | HTMLElement,
    ): element is HTMLElement {
      return element instanceof HTMLElement;
    }

    const menuItemElements = Array.from(
      menuElement.querySelectorAll('[role="menuitem"]'),
    ).filter(isHtmlElement);

    this.menuItemElements = menuItemElements;
  }

  connectedCallback() {
    this.addEventListener('keydown', this.boundKeydownHandler);
    this.addEventListener('focusout', this.boundFocusoutHandler);
    this.summaryElement.addEventListener('click', this.boundClickHandler);
    this.detailsElement.addEventListener('toggle', this.boundToggleHandler);
  }

  disconnectedCallback() {
    this.removeEventListener('keydown', this.boundKeydownHandler);
    this.removeEventListener('focusout', this.boundFocusoutHandler);
    this.summaryElement.removeEventListener('click', this.boundClickHandler);
    this.detailsElement.removeEventListener('toggle', this.boundToggleHandler);
  }

  positionPopover() {
    const { left, top, height, width } =
      this.summaryElement.getBoundingClientRect();

    const translateX =
      left > window.innerWidth / 2 ? `calc(-100% - ${width}px)` : '0px';
    const translateY =
      top > window.innerHeight / 2 ? `calc(-100% + ${height}px)` : '0px';
    const transformValue = `translateX(${translateX}) translateY(${translateY})`;

    this.style.setProperty('--popover-transform', transformValue);
    this.style.setProperty('--popover-left', `${left + width}px`);
    this.style.setProperty('--popover-top', `${top}px`);
  }

  handleClick() {
    this.positionPopover();
  }

  handleKeydown(event: Event) {
    if (!(event instanceof KeyboardEvent)) {
      return;
    }

    if (!this.detailsElement.open) {
      if ([' ', 'Enter'].includes(event.key)) {
        this.positionPopover();
      }

      return;
    }

    if (event.key === 'Escape') {
      this.summaryElement.focus();
      this.detailsElement.open = false;
    }

    const menuItemElement = event.composedPath().find((element) => {
      return (
        element instanceof HTMLElement && element.matches('[role="menuitem"]')
      );
    });

    if (!(menuItemElement instanceof HTMLElement)) {
      return;
    }

    const summaryElement = event.composedPath().find((element) => {
      return element instanceof HTMLElement && element.closest('summary');
    });

    if (summaryElement) {
      return;
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault();
      this.handleArrowUp(menuItemElement);
    } else if (event.key === 'ArrowDown') {
      event.preventDefault();
      this.handleArrowDown(menuItemElement);
    }
  }

  handleArrowUp(menuItemElement: HTMLElement) {
    const menuItemElementIndex = this.menuItemElements.indexOf(menuItemElement);

    if (menuItemElementIndex === -1) {
      return;
    }

    const previousMenuItemElement =
      this.menuItemElements[menuItemElementIndex - 1] ||
      this.menuItemElements[this.menuItemElements.length - 1];

    if (!(previousMenuItemElement instanceof HTMLElement)) {
      return;
    }

    this.focusElement(previousMenuItemElement);
  }

  handleArrowDown(menuItemElement: HTMLElement) {
    const menuItemElementIndex = this.menuItemElements.indexOf(menuItemElement);
    const nextMenuItemElement =
      this.menuItemElements[menuItemElementIndex + 1] ||
      this.menuItemElements[0];

    if (!(nextMenuItemElement instanceof HTMLElement)) {
      return;
    }

    this.focusElement(nextMenuItemElement);
  }

  handleToggle() {
    if (this.detailsElement.open) {
      for (const menuItemElement of this.menuItemElements) {
        menuItemElement.removeAttribute('tabindex');
      }

      const [firstMenuItem] = this.menuItemElements;

      if (!(firstMenuItem instanceof HTMLElement)) {
        return;
      }

      this.focusElement(firstMenuItem);
    } else {
      for (const menuItemElement of this.menuItemElements) {
        menuItemElement.setAttribute('tabindex', '-1');
      }
    }
  }

  focusElement(element: HTMLElement) {
    element.focus();

    if (!element.contains(window.document.activeElement)) {
      const focusableElement = element.querySelector(
        FOCUSABLE_ELEMENT_SELECTOR,
      );

      if (focusableElement instanceof HTMLElement) {
        focusableElement.focus();
      }
    }
  }

  handleFocusout(event: Event) {
    if (!(event instanceof FocusEvent)) {
      return;
    }

    if (!this.detailsElement.open) {
      return;
    }

    const { relatedTarget } = event;

    if (!(relatedTarget instanceof HTMLElement)) {
      return;
    }

    if (this === relatedTarget || this.contains(relatedTarget)) {
      return;
    }

    this.detailsElement.open = false;
  }
}

window.customElements.define('flyout-menu', FlyoutMenuElement);
