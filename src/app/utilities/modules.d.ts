type CustomElement = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement> & {
    class?: string;
    tabindex?: string;
  },
  HTMLElement
>;

declare global {
  namespace react {
    interface HTMLAttributes<T>
      extends React.AriaAttributes,
        React.DOMAttributes<T> {
      shadowrootmode?: string;
      shadowrootdelegatesfocus?: string;
      part?: string;
      inert?: string;
    }

    interface CSSProperties {
      [key: `--${string}`]: string | number;
    }
  }

  namespace JSX {
    interface IntrinsicElements {
      'auto-save-text': CustomElement;
      'auto-save-checkbox': CustomElement;
      'auto-save-search': CustomElement;
      'clear-search': CustomElement;
      'flyout-menu': CustomElement;
      'flyout-menu-item': CustomElement;
      'select-all-checkbox': CustomElement;
      'unload-handler': CustomElement;
      'post-form': CustomElement;
      'grid-keyboard-navigation': CustomElement;
      'modal-dialog': CustomElement;
      'view-container': CustomElement;
      'hyper-link': CustomElement;
      'disclosure-widget': CustomElement;
      'column-selector': CustomElement;
    }
  }
}
