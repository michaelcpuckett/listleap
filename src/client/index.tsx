import HomePage from 'app/index';
import NoteDetailPage from 'app/notes/[id]';
import { pathToRegexp } from 'path-to-regexp';
import { createElement } from 'react';
import { hydrateRoot } from 'react-dom/client';

declare global {
  interface Window {
    __INITIAL_DATA__: any;
  }
}

window.addEventListener('pageshow', function (event: PageTransitionEvent) {
  if (event.persisted) {
    window.location.reload();
  }
});

window.addEventListener('DOMContentLoaded', async () => {
  const rootElement = window.document.body;

  if (!rootElement) {
    throw new Error('Root element not found.');
  }

  const Component = (() => {
    if (window.location.pathname === '/') {
      return HomePage;
    }

    const notesPageMatch = pathToRegexp('/notes/:id').regexp.exec(
      window.location.pathname,
    );

    if (notesPageMatch) {
      return NoteDetailPage;
    }

    return null;
  })();

  if (!Component) {
    throw new Error('Path not found.');
  }

  hydrateRoot(
    rootElement,
    createElement(Component as any, { ...window.__INITIAL_DATA__ }),
  );
});
