import { URLS_TO_CACHE } from 'utilities/urlsToCache';

export function handleInstall(event: Event) {
  if (!(event instanceof ExtendableEvent)) {
    return;
  }

  event.waitUntil(
    caches
      .open('v1')
      .then(function (cache) {
        return cache.addAll(URLS_TO_CACHE);
      })
      .catch(function (error) {
        console.error(error);
      }),
  );
}
