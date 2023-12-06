import {
  ExpressWorkerResponse,
  ExpressWorkerRequest,
} from '@express-worker/app';
import { DatabasePage } from 'components/pages/DatabasePage';
import { renderToString } from 'react-dom/server';
import { Database, Property, Referrer, Settings } from 'shared/types';
import {
  getIdb,
  getDatabaseFromIndexedDb,
  getSettingsFromIndexedDb,
} from 'utilities/idb';
import { AdditionalRequestProperties } from '../../../middleware';

export async function GetDatabaseRows(
  req: ExpressWorkerRequest & AdditionalRequestProperties,
  res: ExpressWorkerResponse,
) {
  const idb = await getIdb();
  const databaseId = req.params.databaseId || '';
  const database = await getDatabaseFromIndexedDb(databaseId, idb);

  if (!database) {
    idb.close();
    res.status = 404;
    res.body = 'Not found';
    return;
  }

  const settings = await getSettingsFromIndexedDb(idb);
  idb.close();

  const renderResult = renderToString(
    <DatabasePage
      database={database}
      referrer={req.ref}
      settings={settings}
    />,
  );

  res.body = `<!DOCTYPE html>${renderResult}`;
  res.headers.set('Content-Type', 'text/html');
}
