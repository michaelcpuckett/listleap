import escapeStringRegexp from "escape-string-regexp";
import { BaseAutoSaveElement } from "elements/BaseAutoSaveElement";

export class AutoSaveTextElement extends BaseAutoSaveElement {
  connectedCallback() {
    this.inputElement.addEventListener("change", this.boundChangeHandler);
  }

  disconnectedCallback() {
    this.inputElement.removeEventListener("change", this.boundChangeHandler);
  }

  override handleChange() {
    const value = this.inputElement.value;
    const formElement = this.inputElement.form;

    if (!formElement) {
      return;
    }

    const formAction = formElement.getAttribute("action");

    if (!formAction) {
      return;
    }

    const method = new FormData(formElement).get("_method")?.toString() || "";

    if (["PUT", "PATCH"].includes(method)) {
      this.patch(formAction, value).then(() => {
        const pattern = !value ? "^$" : "^" + escapeStringRegexp(value) + "$";
        this.inputElement.setAttribute("pattern", pattern);
      });
    } else {
      if (this.inputElement.validity.patternMismatch) {
        this.markDirty();
      } else {
        this.markClean();
      }
    }
  }
}

window.customElements.define("auto-save-text", AutoSaveTextElement);
