export const ANY_CELL_ELEMENT_SELECTOR =
  '[role="gridcell"], [role="columnheader"], [role="rowheader"]';

export const SELECTABLE_CELL_ELEMENT_SELECTOR = `[data-selectable]:is(${ANY_CELL_ELEMENT_SELECTOR})`;

export const INPUT_SELECTOR =
  ':is(:is(auto-save-search, auto-save-text) input, input[type="checkbox"])';

export const FLYOUT_MENU_SELECTOR = 'flyout-menu [role="menu"]';

export function isInFlyoutMenu(element: Element | HTMLElement | EventTarget) {
  if (!(element instanceof Element)) {
    return false;
  }

  const flyoutMenuElement = element.closest(FLYOUT_MENU_SELECTOR);

  return flyoutMenuElement instanceof HTMLElement;
}

export function isHtmlElement(element: unknown): element is HTMLElement {
  return element instanceof HTMLElement;
}
