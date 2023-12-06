import { renderToString } from 'react-dom/server';
import { DatabasePage } from 'components/pages/DatabasePage';
import {
  getIdb,
  getDatabaseFromIndexedDb,
  getSettingsFromIndexedDb,
} from 'utilities/idb';
import {
  ExpressWorkerRequest,
  ExpressWorkerResponse,
} from '@express-worker/app';
import { AdditionalRequestProperties } from '../../../middleware';

export async function GetDatabaseRow(
  req: ExpressWorkerRequest & AdditionalRequestProperties,
  res: ExpressWorkerResponse,
) {
  const idb = await getIdb();
  const databaseId = req.params.databaseId || '';
  const id = req.params.id || '';
  const database = await getDatabaseFromIndexedDb(databaseId, idb);

  if (!database) {
    idb.close();
    res.status = 404;
    res.text('Not found');
    return;
  }

  const row = database.rows.find((row) => row.id === id);

  if (!row) {
    idb.close();
    res.status = 404;
    res.text('Not found');
    return;
  }

  const settings = await getSettingsFromIndexedDb(idb);
  idb.close();

  const mode = new URL(req.url).searchParams.get('mode') || 'EDIT_ROW';

  const renderResult = renderToString(
    <DatabasePage
      database={database}
      referrer={{
        ...req.ref,
        id,
        mode,
      }}
      settings={settings}
    />,
  );

  res.send(`<!DOCTYPE html>${renderResult}`);
}
