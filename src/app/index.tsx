import { handleInstall } from './install';
import { handleFetch } from './fetch';

self.addEventListener('install', handleInstall);
self.addEventListener('fetch', handleFetch);

declare module 'react' {
  interface HTMLAttributes<T>
    extends React.AriaAttributes,
      React.DOMAttributes<T> {
    shadowrootmode?: string;
    shadowrootdelegatesfocus?: boolean;
    inert?: string;
  }

  interface CSSProperties {
    [key: `--${string}`]: string | number;
  }
}

type CustomElement = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLElement>,
  HTMLElement
>;

declare global {
  namespace JSX {
    interface IntrinsicElements {
      'auto-save-text': CustomElement;
      'auto-save-checkbox': CustomElement;
      'auto-save-search': CustomElement;
      'clear-search': CustomElement;
      'flyout-menu': CustomElement;
      'unload-handler': CustomElement;
      'post-form': CustomElement;
    }
  }
}
