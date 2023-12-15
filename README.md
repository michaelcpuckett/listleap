# ListLeap

## Overview

**ListLeap** is a local-only [Notion](https://www.notion.so/)-like web app for
tracking To-Do Items.

## Background

This is a **proof-of-concept** multi-page web app (MPA) where most user
interactions reload the page via HTML `<form>` submits. A Service Worker
intercepts these requests and instantly returns a refreshed page. This makes
them more similar to single-page web apps (SPAs) in terms of user experience.
This technique also minimizes DOM manipulation, as the rendering mechanism is
always the page refresh cycle. The result should be a highly performant web app
with a small bundle size.

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

7. Send optimistic updates to the remote server as a side effect, only after
   updating IndexedDB locally.

8. The remote server sends updates to clients via server-sent events or a
   similar protocol.

## Development

**Important**: To force a reload of the service worker, change the version
number in `dist/version.txt`.

### Install

```sh
npm install
```

### Build and Run

```sh
npm start
```

The `index.html` from the `dist/` directory will be served at `localhost:8080`.
The service worker will be registered and the app will be available offline.

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
