import 'elements/AutoSaveTextElement';
import 'elements/AutoSaveCheckboxElement';
import 'elements/AutoSaveSearchElement';
import 'elements/ClearSearchElement';
import 'elements/UnloadHandlerElement';
import 'elements/PostFormElement';
import 'elements/SelectAllCheckboxElement';
import 'elements/GridKeyboardNavigationElement';

const SCROLL_STORAGE_KEY = 'scroll-position-y';
const FOCUS_STORAGE_KEY = 'focus-element-id';

const windowY = sessionStorage.getItem(SCROLL_STORAGE_KEY) || 0;
window.scrollTo(0, Number(windowY));

const autofocusElement = window.document.querySelector(
  '[data-auto-focus="true"]',
);
const focusElementId = sessionStorage.getItem(FOCUS_STORAGE_KEY) || '';
const focusElement = window.document.getElementById(focusElementId);
const elementToAutoFocus = autofocusElement || focusElement;

if (elementToAutoFocus instanceof HTMLElement) {
  elementToAutoFocus.focus({
    preventScroll: true,
  });

  if (
    elementToAutoFocus instanceof HTMLInputElement &&
    elementToAutoFocus.value.length > 0 &&
    (elementToAutoFocus.type === 'text' || elementToAutoFocus.type === 'search')
  ) {
    elementToAutoFocus.selectionStart = elementToAutoFocus.selectionEnd =
      elementToAutoFocus.value.length;
  }
}

const handleScroll = () => {
  window.sessionStorage.setItem(SCROLL_STORAGE_KEY, `${window.scrollY}`);
};

window.addEventListener('scroll', handleScroll);

const handleFocus = () => {
  sessionStorage.setItem(
    FOCUS_STORAGE_KEY,
    window.document.activeElement?.id || '',
  );
};

window.document.body.addEventListener('focusin', handleFocus);
