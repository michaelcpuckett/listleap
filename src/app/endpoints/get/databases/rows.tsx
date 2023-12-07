import {
  ExpressWorkerResponse,
  ExpressWorkerRequest,
} from '@express-worker/app';
import { DatabasePage } from 'components/pages/DatabasePage';
import { renderToString } from 'react-dom/server';
import {
  getIdb,
  getDatabaseFromIndexedDb,
  getSettingsFromIndexedDb,
} from 'utilities/idb';
import { handleRequest } from '../../../middleware';

export async function GetDatabaseRows(
  req: ExpressWorkerRequest,
  res: ExpressWorkerResponse,
) {
  return handleRequest(async (req, res) => {
    const idb = await getIdb();
    const databaseId = req.params.databaseId || '';
    const database = await getDatabaseFromIndexedDb(databaseId, idb);

    if (!database) {
      idb.close();
      res.status = 404;
      res.text('Not found');
      return;
    }

    const settings = await getSettingsFromIndexedDb(idb);
    idb.close();

    const renderResult = renderToString(
      <DatabasePage
        database={database}
        version={req.version}
        query={req.query}
        settings={settings}
      />,
    );

    res.send(`<!DOCTYPE html>${renderResult}`);
  })(req, res);
}
