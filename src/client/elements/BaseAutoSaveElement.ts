import { getUniqueId } from "../../shared/getUniqueId";
import { DIRTY_ELEMENTS_KEY } from "./UnloadHandlerElement";

export class BaseAutoSaveElement extends HTMLElement {
  protected inputElement: HTMLInputElement;
  protected inputId: string;
  protected unloadHandlerElement: HTMLElement;
  protected boundChangeHandler: (event: Event) => void;
  protected boundInputHandler: (event: Event) => void;

  constructor() {
    super();

    if (!this.shadowRoot) {
      throw new Error("Declarative shadow root not supported");
    }

    const slotElement = this.shadowRoot.querySelector("slot");

    if (!(slotElement instanceof HTMLSlotElement)) {
      throw new Error("No slot element provided");
    }

    const assignedNodes = slotElement.assignedNodes();

    if (!assignedNodes || !assignedNodes.length) {
      throw new Error("No content provided");
    }

    function guardIsHTMLInputElement(node: Node): node is HTMLInputElement {
      return node instanceof HTMLInputElement;
    }

    const inputElement = assignedNodes.find(guardIsHTMLInputElement);

    if (!inputElement) {
      throw new Error("No input element provided");
    }

    const unloadHandlerElement =
      window.document.querySelector("unload-handler");

    if (!(unloadHandlerElement instanceof HTMLElement)) {
      throw new Error("No unload handler element found");
    }

    this.inputElement = inputElement;
    this.inputId = inputElement.id || getUniqueId();
    this.unloadHandlerElement = unloadHandlerElement;
    this.boundChangeHandler = this.handleChange.bind(this);
    this.boundInputHandler = this.handleInput.bind(this);
  }

  protected handleChange() {}

  protected handleInput() {}

  protected markDirty() {
    const prev =
      this.unloadHandlerElement.getAttribute(DIRTY_ELEMENTS_KEY) || "";
    const dirtyElementsArray = !prev ? [] : prev.split(",");
    dirtyElementsArray.push(this.inputId);
    const uniqueDirtyElementsArray = Array.from(new Set(dirtyElementsArray));
    const dirtyElementsString = uniqueDirtyElementsArray.join(",");
    this.unloadHandlerElement.setAttribute(
      DIRTY_ELEMENTS_KEY,
      dirtyElementsString
    );
  }

  protected markClean() {
    const prev =
      this.unloadHandlerElement.getAttribute(DIRTY_ELEMENTS_KEY) || "";
    const dirtyElementsArray = !prev ? [] : prev.split(",");
    const dirtyElementsString = dirtyElementsArray
      .filter((id) => id !== this.inputId)
      .join(",");
    this.unloadHandlerElement.setAttribute(
      DIRTY_ELEMENTS_KEY,
      dirtyElementsString
    );
  }

  protected async patch(url: string, value: string) {
    const formData = new FormData();
    formData.append("_method", "PATCH");
    formData.append(this.inputElement.name, value);

    return window
      .fetch(url, {
        method: "POST",
        body: formData,
      })
      .then((res) => {
        if (res.status === 404) {
          throw new Error("Not found");
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }
}
