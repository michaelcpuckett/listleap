const FOCUSABLE_ELEMENT_SELECTOR =
  ':is(button, [href], input, select, textarea):not([type="hidden"]):not([disabled]):not([readonly])';

export class DisclosureWidgetElement extends HTMLElement {
  private detailsElement: HTMLDetailsElement;
  private boundToggleHandler = this.handleToggle.bind(this);

  constructor() {
    super();

    const detailsElement = this.querySelector('details');

    if (!(detailsElement instanceof HTMLDetailsElement)) {
      throw new Error('Could not find details element');
    }

    this.detailsElement = detailsElement;
  }

  connectedCallback() {
    this.detailsElement.addEventListener('toggle', this.boundToggleHandler);
  }

  disconnectedCallback() {
    this.detailsElement.removeEventListener('toggle', this.boundToggleHandler);
  }

  handleToggle() {
    const focusableElements = Array.from(
      new Set([
        ...Array.from(
          this.detailsElement.querySelectorAll('*:not(summary)'),
        ).filter((element) => {
          return element.shadowRoot && element.shadowRoot.delegatesFocus;
        }),
        ...Array.from(
          this.detailsElement.querySelectorAll(FOCUSABLE_ELEMENT_SELECTOR),
        ),
      ]),
    );

    if (this.detailsElement.open) {
      for (const foucsableElement of focusableElements) {
        foucsableElement.removeAttribute('tabindex');
      }

      const [firstFocusableItem] = focusableElements;

      if (!(firstFocusableItem instanceof HTMLElement)) {
        return;
      }

      this.focusElement(firstFocusableItem);
    } else {
      for (const focusableElement of focusableElements) {
        focusableElement.setAttribute('tabindex', '-1');
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
}

window.customElements.define('disclosure-widget', DisclosureWidgetElement);
