window.addEventListener('DOMContentLoaded', () => {
  window.navigator.serviceWorker
    .register('/app.js')
    .then(async (registration) => {
      const serviceWorker =
        registration.installing || registration.waiting || registration.active;

      if (!serviceWorker) {
        throw new Error('Service worker not found.');
      }

      // Wait for service worker to activate.
      await new Promise((resolve) => {
        if (serviceWorker.state === 'activated') {
          resolve();
        } else {
          serviceWorker.addEventListener('statechange', (e) => {
            if (e.target.state === 'activated') {
              resolve();
            }
          });
        }
      });

      window.location.reload();
    })
    .catch((error) => {
      console.error(error);
    });
});
