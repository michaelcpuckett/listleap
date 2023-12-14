# ListLeap

## Overview

A local-only Notion-like app built with Service Workers. Everything is saved to
IndexedDB. No data is sent to a server.

## Features

- [x] Create, edit, and delete Database Tables of To-Do Items
- [x] Create, edit, and delete To-Do Items
- [x] Create, edit, and delete To-Do Item Properties
- [x] Keyboard selection/navigation of the Table UI
- [x] Mouse cursor selection of the Table UI
- [x] Bulk delete To-Do Items
- [x] Search/filter To-Do Items

## Background

This is a proof-of-concept multi-page web app (MPA) where most user interactions
reload the page via HTML Form submits. The Service Worker intercepts requests
and instantly returns a refreshed page. This makes them more similar to
single-page web apps (SPAs) in terms of user experience.

Additional goals of this project are to demonstrate:

- **ExpressWorker** - The app is built with the ExpressWorker framework and is
  designed to demonstrate its features.
- **React on the Server on the Client** - The app is built with the version of
  React for server-generated pages, except running inside a Service Worker.

## Development

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

To force a reload of the service worker, change the version number in
`dist/version.txt`.
