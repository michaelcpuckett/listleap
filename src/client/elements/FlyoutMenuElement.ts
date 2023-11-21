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

    const menuItemElements = Array.from(
      menuElement.querySelectorAll('[role="menuitem"]'),
    ).filter(isHtmlElement);

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
      const [firstMenuItem] = this.menuItemElements;

      if (!(firstMenuItem instanceof HTMLElement)) {
        return;
      }

      firstMenuItem.focus();
    }
  }
}

window.customElements.define('flyout-menu', FlyoutMenuElement);
