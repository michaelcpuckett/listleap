# ListLeap

## Overview

**ListLeap** is a local-only [Notion](https://www.notion.so/)-like web app for
tracking any kind of data. Built with Service Workers.

[**Try it out!**](https://listleap.web.app)

## Background

This is a **proof-of-concept** multi-page web app (MPA) where most user
interactions reload the page via HTML `<form>` submits. A Service Worker
intercepts these requests and instantly returns a refreshed page. This makes the
user experience more similar to single-page web apps (SPAs). This technique
minimizes DOM manipulation, as the rendering mechanism is always the page
refresh cycle. The result should be a highly performant web app.

A primary goal of this project is to demonstrate the features of the
[**ExpressWorker** framework](https://github.com/michaelcpuckett/express-worker),
which provides an [Express.js](https://expressjs.com/)-like API for routing
requests inside the Service Worker.

## Architectural Strategy

1. On first visit, serve `dist/index.html` which registers a service worker and
   configures it to handle all network requests by initializing `ExpressWorker`.
   ExpressWorker routes requests to the appropriate handler function in
   `src/app/endpoints/`. The service worker also caches static assets inside
   `dist/` from the remote server.

2. When the service worker intercepts a GET request, either fulfill it with a
   Cache object originally populated by the remote server, or generate a dynamic
   HTML response using
   [`react-dom/server`](https://react.dev/reference/react-dom/server), which
   renders [React](https://reactjs.org/) components to HTML strings. The data
   for these components is stored in IndexedDB.

3. When the service worker intercepts a POST request, process any FormData that
   could have been sent either by an HTML `<form>` or the Fetch API, before
   redirecting or routing it for dynamic HTML rendering. The client sends a
   hidden `_method` field to indicate the intended HTTP method, since HTML forms
   only support GET and POST.

4. When the user interacts with the UI in a way that requires a change to the
   underlying data, re-render HTML using a full page refresh, typically
   triggered by an HTML `<form>` submit. This is similar to the way a
   traditional server-side web app would work.

5. Encapsulate UI logic inside HTML Custom Elements without Shadow DOM, to
   progressively enhance native HTML elements, as described in Jim Nielsen's
   article
   ["HTML Web Components"](https://blog.jim-nielsen.com/2023/html-web-components/).

### Future Work for Remote Server Support

6. Send optimistic updates to the remote server as a side effect, only after
   updating IndexedDB locally.

7. The remote server sends updates to clients via server-sent events or a
   similar protocol.

## Special Considerations

### Frequent Page Reloads

The application saves focus state and scroll position in SessionStorage and
restores them after each page reload. This is necessary to override how the
browser attempts to restore the scroll position. This is a common problem for
SPAs, but it's more noticeable in this app because of the frequent page reloads.

Accessibility appears to be an unsolved problem. Every page load will be
announced to screen readers, along with the full announcement of where they are
focused, potentially deep in the DOM. More investigation is needed.

### Modal States

The user interface can be customized via query parameters. Modals dialogs can be
shown on a page, gated by a query parameter, in an already open state. Closing
the modal means redirecting to the same page without the query parameter.

### Infinite Scroll

Infinite scrolling by definition may not fit with this paradigm, as it requires
appending HTML to the rendered page. Pagination should be used instead. This
could be implemented by adding a query parameter to the URL, which is then
parsed by the service worker to determine which page to render.

### Initial Payload

The size of the service worker file could be a concern as the application grows,
as it needs to be downloaded and parsed before the app can be used. This could
be mitigated by lazy-loading or dynamically importing parts of the service
worker code.

## Development

**Important**: To force a reload of the service worker, change the version
number in `dist/version.txt`.

### Install

```sh
npm install
```

### Build

```sh
npm run build
```

### Watch

```sh
npm run watch
```

### Serve

```sh
npm run serve
```

The `index.html` from the `dist/` directory will be served at `localhost:8080`.

### Hosting

This project is designed for static file hosting. The `dist/` directory contains
all the files needed to run the app.

By default, this is set up to be hosted on Firebase at
[`https://listleap.web.app`](https://listleap.web.app).

### Directory Structure

- `dist/` - Compiled code, plus...
  - `index.html` - Loading page
  - `style.css` - Styles for rendered pages
  - `version.txt` - Version number for Service Worker and cached assets
- `src/` - Source code
  - `app/` - Service Worker code
    - `components/` - React components
      - `elements/` - Web components
      - `pages/` - Page components
    - `endpoints/` - ExpressWorker endpoints
    - `middleware/` - ExpressWorker middleware
    - `utilities/` - Utility functions
    - `index.ts` - Service Worker entry point
  - `client/` - Code for rendered pages
    - `elements/` - Web components
    - `index.ts` - Client-side entry point
  - `shared/` - Shared code
