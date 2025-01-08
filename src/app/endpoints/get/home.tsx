import {
  ExpressWorkerRequest,
  ExpressWorkerResponse,
} from '@express-worker/app';
import { getCounter } from 'components/elements/Counter';
import { getNotes } from 'components/elements/Note';
import HomePage, { metadata } from 'components/pages/HomePage';
import { PageShell } from 'components/pages/PageShell';
import { handleRequest } from 'middleware/index';
import { renderToString } from 'react-dom/server';

export async function GetHome(
  req: ExpressWorkerRequest,
  res: ExpressWorkerResponse,
) {
  return handleRequest(async (req, res) => {
    const initialCount = await getCounter();
    const initialNotes = await getNotes();

    console.log({
      initialNotes,
    });

    const renderResult = renderToString(
      <PageShell
        version={req.version}
        {...metadata}
      >
        <HomePage
          initialNotes={initialNotes}
          initialCount={initialCount}
        />
      </PageShell>,
    );

    res.send(renderResult);
  })(req, res);
}
