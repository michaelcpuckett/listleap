window.history.scrollRestoration = 'manual';

window.document.documentElement.style.minHeight = `calc(${
  sessionStorage.getItem('scroll-position-y') || 0
}px + 100vh)`;

window.scrollTo(0, Number(sessionStorage.getItem('scroll-position-y') || 0));

window.addEventListener('DOMContentLoaded', () => {
  window.document.documentElement.style.removeProperty('min-height');
});

window.addEventListener('pageshow', (event) => {
  if (event.persisted) {
    window.location.reload();
  }
});
