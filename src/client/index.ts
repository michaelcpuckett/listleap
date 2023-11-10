import "./elements/AutoSaveTextElement";
import "./elements/AutoSaveCheckboxElement";
import "./elements/UnloadHandlerElement";
import "./elements/PostFormElement";

const SCROLL_STORAGE_KEY = "scroll-position-y";
const FOCUS_STORAGE_KEY = "focus-element-id";

const windowY = sessionStorage.getItem(SCROLL_STORAGE_KEY) || 0;
window.scrollTo(0, Number(windowY));

const autofocusElement = window.document.querySelector(
  '[data-auto-focus="true"]'
);
const focusElementId = sessionStorage.getItem(FOCUS_STORAGE_KEY) || "";
const focusElement = window.document.getElementById(focusElementId);

if (autofocusElement instanceof HTMLElement) {
  autofocusElement.focus({
    preventScroll: true,
  });
} else if (focusElement instanceof HTMLElement) {
  focusElement.focus({
    preventScroll: true,
  });
}

const handleScroll = () => {
  window.sessionStorage.setItem(SCROLL_STORAGE_KEY, `${window.scrollY}`);
};

window.addEventListener("scroll", handleScroll);

const handleFocus = () => {
  sessionStorage.setItem(
    FOCUS_STORAGE_KEY,
    window.document.activeElement?.id || ""
  );
};

window.document.body.addEventListener("focusin", handleFocus);
