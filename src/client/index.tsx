import { getCounter } from 'components/elements/Counter';
import { getNotes } from 'components/elements/Note';
import HomePage from 'components/pages/HomePage';
import { hydrateRoot } from 'react-dom/client';

(async () => {
  const rootElement = document.getElementById('root');

  if (!rootElement) {
    throw new Error('Root element not found');
  }

  const initialCount = await getCounter();
  const initialNotes = await getNotes();

  console.log({
    initialNotes,
  });

  hydrateRoot(
    rootElement,
    <HomePage
      initialNotes={initialNotes}
      initialCount={initialCount}
    />,
  );
})();
