export const DIRTY_ELEMENTS_KEY = "dirty-elements";

export class UnloadHandlerElement extends HTMLElement {
  constructor() {
    super();
  }

  static get observedAttributes() {
    return ["dirty-elements"];
  }

  attributeChangedCallback(name: string, oldValue: string, newValue: string) {
    if (name === "dirty-elements") {
      if (newValue) {
        this.triggerBeforeUnload();
      } else {
        this.removeBeforeUnload();
      }
    }
  }

  triggerBeforeUnload() {
    if (!window.onbeforeunload) {
      window.onbeforeunload = this.boundBeforeUnloadHandler;
    }
  }

  removeBeforeUnload() {
    if (window.onbeforeunload) {
      window.onbeforeunload = null;
    }
  }

  handleBeforeUnload(event: BeforeUnloadEvent) {
    console.log(event);
    console.log(event.composedPath());
    event.preventDefault();
    event.returnValue = "";
  }

  private boundBeforeUnloadHandler = this.handleBeforeUnload.bind(this);
}

window.customElements.define("unload-handler", UnloadHandlerElement);
