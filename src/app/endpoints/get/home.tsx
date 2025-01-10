import {
  ExpressWorkerRequest,
  ExpressWorkerResponse,
} from '@express-worker/app';
import { getNotes } from 'components/elements/NoteRow';
import HomePage, { metadata } from 'components/pages/HomePage';
import { PageShell } from 'components/pages/PageShell';
import { handleRequest } from 'middleware/index';
import { renderToString } from 'react-dom/server';

export async function GetHome(
  req: ExpressWorkerRequest,
  res: ExpressWorkerResponse,
) {
  return handleRequest(async (req, res) => {
    const initialNotes = await getNotes();
    const initialData = {
      initialNotes,
    };

    const renderResult = renderToString(
      <PageShell
        version={req.version}
        {...metadata}
        initialData={initialData}
      >
        <HomePage {...initialData} />
      </PageShell>,
    );

    res.send(renderResult);
  })(req, res);
}
