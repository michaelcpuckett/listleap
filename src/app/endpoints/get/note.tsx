import {
  ExpressWorkerRequest,
  ExpressWorkerResponse,
} from '@express-worker/app';
import { getNotes } from 'components/elements/NoteRow';
import { metadata } from 'components/pages/HomePage';
import NoteDetailPage from 'components/pages/NoteDetailPage';
import { PageShell } from 'components/pages/PageShell';
import { handleRequest } from 'middleware/index';
import { renderToString } from 'react-dom/server';

export async function GetNote(
  req: ExpressWorkerRequest,
  res: ExpressWorkerResponse,
) {
  return handleRequest(async (req, res) => {
    const initialNote = (await getNotes()).find(
      ({ id }) => id === Number(req.params.id),
    );

    if (!initialNote) {
      res.status(404).send('Not found');
      return;
    }

    const initialData = {
      initialNote,
    };

    const renderResult = renderToString(
      <PageShell
        version={req.version}
        {...metadata}
        initialData={initialData}
      >
        <NoteDetailPage {...initialData} />
      </PageShell>,
    );

    res.send(renderResult);
  })(req, res);
}
