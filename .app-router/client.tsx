import routesConfig from 'app-router/routes';
import { createElement } from 'react';
import { hydrateRoot } from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router';

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

function convertPath(path: string) {
  return path.replace(/\[([^\]]+)\]/g, ':$1');
}

window.addEventListener('DOMContentLoaded', async () => {
  const rootElement = window.document.body;

  if (!rootElement) {
    throw new Error('Root element not found.');
  }

  const Component = () => (
    <BrowserRouter>
      <Routes>
        {Object.entries<{
          Component: React.ComponentType<any>;
          getStaticProps: (
            params: Record<string, string>,
          ) => Promise<Record<string, any>>;
          metadata: {
            title: string;
            description?: string;
          };
        }>(routesConfig).map(([path, { Component }]) => (
          <Route
            key={path}
            path={convertPath(path.replace(/\/$/, ''))}
            element={<Component {...window.__INITIAL_DATA__} />}
          />
        ))}
      </Routes>
    </BrowserRouter>
  );

  hydrateRoot(rootElement, createElement(Component as any));
});
