import HomePage from 'components/pages/HomePage';
import { createElement } from 'react';
import { hydrateRoot } from 'react-dom/client';

declare global {
  interface Window {
    __INITIAL_DATA__: any;
  }
}

(async () => {
  const rootElement = document.getElementById('root');

  if (!rootElement) {
    throw new Error('Root element not found.');
  }

  const Component = (() => {
    switch (window.location.pathname) {
      case '/':
        return HomePage;
      default:
        return null;
    }
  })();

  if (!Component) {
    throw new Error('Path not found.');
  }

  hydrateRoot(
    rootElement,
    createElement(Component, { ...window.__INITIAL_DATA__ }),
  );
})();
