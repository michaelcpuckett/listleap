const FOCUSABLE_ELEMENTS_SELECTOR =
  'input:not([type="hidden"]):not([hidden]), button:not([hidden]), a:not([hidden]), textarea:not([hidden]), select:not([hidden]), [tabindex]:not([hidden])';

export class FlyoutMenuElement extends HTMLElement {
  private detailsElement: HTMLDetailsElement;
  private summaryElement: HTMLElement;
  private menuElement: HTMLElement;
  private menuItemElements: HTMLElement[];
  private boundKeydownHandler = this.handleKeydown.bind(this);
  private boundToggleHandler = this.handleToggle.bind(this);
  private boundClickHandler = this.handleClick.bind(this);

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

    this.menuElement = menuElement;

    function isHtmlElement(
      element: Element | HTMLElement,
    ): element is HTMLElement {
      return element instanceof HTMLElement;
    }

    const menuChildren = Array.from(this.menuElement.children).filter(
      isHtmlElement,
    );

    const menuItemElements: HTMLElement[] = [];

    for (const [index, menuItemElement] of menuChildren.entries()) {
      const focusableElement = menuItemElement.matches(
        FOCUSABLE_ELEMENTS_SELECTOR,
      )
        ? menuItemElement
        : menuItemElement.querySelector(FOCUSABLE_ELEMENTS_SELECTOR);

      if (!(focusableElement instanceof HTMLElement)) {
        continue;
      }

      menuItemElements.push(focusableElement);
      focusableElement.setAttribute('role', 'menuitem');
    }

    this.menuItemElements = menuItemElements;
  }

  connectedCallback() {
    this.addEventListener('keydown', this.boundKeydownHandler);
    this.summaryElement.addEventListener('click', this.boundClickHandler);
    this.detailsElement.addEventListener('toggle', this.boundToggleHandler);
  }

  disconnectedCallback() {
    this.removeEventListener('keydown', this.boundKeydownHandler);
    this.summaryElement.removeEventListener('click', this.boundClickHandler);
    this.detailsElement.removeEventListener('toggle', this.boundToggleHandler);
  }

  positionPopover() {
    const { right, top } = this.summaryElement.getBoundingClientRect();

    this.style.setProperty('--popover-left', `${right}px`);
    this.style.setProperty('--popover-top', `${top}px`);
  }

  handleClick(event: Event) {
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
    const previousMenuItemElement =
      this.menuItemElements[menuItemElementIndex - 1] ||
      this.menuItemElements[this.menuItemElements.length - 1];

    if (!(previousMenuItemElement instanceof HTMLElement)) {
      return;
    }

    previousMenuItemElement.focus();
  }

  handleArrowDown(menuItemElement: HTMLElement) {
    const menuItemElementIndex = this.menuItemElements.indexOf(menuItemElement);
    const nextMenuItemElement =
      this.menuItemElements[menuItemElementIndex + 1] ||
      this.menuItemElements[0];

    if (!(nextMenuItemElement instanceof HTMLElement)) {
      return;
    }

    nextMenuItemElement.focus();
  }

  handleToggle() {
    if (this.detailsElement.open) {
      const firstMenuItem = this.querySelector('[role="menuitem"]');

      if (!(firstMenuItem instanceof HTMLElement)) {
        return;
      }

      firstMenuItem.focus();
    }
  }
}

window.customElements.define('flyout-menu', FlyoutMenuElement);
