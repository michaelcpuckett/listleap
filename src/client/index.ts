function isShadowRootModeEnum(value: unknown): value is ShadowRootMode {
  return ['open', 'closed'].includes(value as string);
}

function dsdPolyfill(root: unknown) {
  if (
    !(root instanceof Element) &&
    !(root instanceof DocumentFragment) &&
    !(root instanceof Document)
  ) {
    return;
  }

  if (
    HTMLTemplateElement.prototype.hasOwnProperty('shadowRootDelegatesFocus')
  ) {
    return;
  }

  const shadowRootTemplateElements = Array.from(
    root.querySelectorAll('template[shadowrootmode]'),
  );

  for (const shadowRootTemplateElement of shadowRootTemplateElements) {
    if (!(shadowRootTemplateElement instanceof HTMLTemplateElement)) {
      continue;
    }

    const mode = shadowRootTemplateElement.getAttribute('shadowrootmode');

    if (!isShadowRootModeEnum(mode)) {
      continue;
    }

    const delegatesFocus = shadowRootTemplateElement.hasAttribute(
      'shadowrootdelegatesfocus',
    );

    const parentNode = shadowRootTemplateElement.parentNode;

    if (!(parentNode instanceof Element)) {
      continue;
    }

    const shadowRoot = parentNode.attachShadow({ mode, delegatesFocus });
    shadowRoot.appendChild(shadowRootTemplateElement.content);
    shadowRootTemplateElement.remove();
    dsdPolyfill(shadowRoot);
  }
}

dsdPolyfill(document);

import 'elements/AutoSaveTextElement';
import 'elements/AutoSaveCheckboxElement';
import 'elements/AutoSaveSearchElement';
import 'elements/ClearSearchElement';
import 'elements/UnloadHandlerElement';
import 'elements/PostFormElement';
import 'elements/SelectAllCheckboxElement';
import 'elements/ModalDialogElement';
import 'elements/FlyoutMenuElement';
import 'elements/ViewContainerElement';
