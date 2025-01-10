import {
  ExpressWorkerRequest,
  ExpressWorkerResponse,
} from '@express-worker/app';
import { DatabasePage } from 'components/pages/DatabasePage';
import { handleRequest } from 'middleware/index';
import { renderToString } from 'react-dom/server';
import {
  getDatabaseFromIndexedDb,
  getIdb,
  getSettingsFromIndexedDb,
} from 'utilities/idb';

export async function GetDatabaseRow(
  req: ExpressWorkerRequest,
  res: ExpressWorkerResponse,
) {
  return handleRequest(async (req, res) => {
    const idb = await getIdb();
    const databaseId = req.params.databaseId || '';
    const id = req.params.id || '';
    const database = await getDatabaseFromIndexedDb(databaseId, idb);

    if (!database) {
      idb.close();
      res.status(404).text('Not found').end();
      return;
    }

    const row = database.rows.find((row) => row.id === id);

    if (!row) {
      idb.close();
      res.status(404).text('Not found').end();
      return;
    }

    const settings = await getSettingsFromIndexedDb(idb);
    idb.close();

    const mode = new URL(req.url).searchParams.get('mode') || 'EDIT_ROW';

    const renderResult = renderToString(
      <DatabasePage
        database={database}
        version={req.version}
        query={{
          ...req.query,
          id,
          mode,
        }}
        settings={settings}
        url={req.url}
      />,
    );

    res.send(`<!DOCTYPE html>${renderResult}`);
  })(req, res);
}
