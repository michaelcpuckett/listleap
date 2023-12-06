import {
  ExpressWorkerRequest,
  ExpressWorkerResponse,
} from '@express-worker/app';
import { HomePage } from 'components/pages/HomePage';
import { renderToString } from 'react-dom/server';
import {
  getIdb,
  getPartialDatabasesFromIndexedDb,
  getSettingsFromIndexedDb,
} from 'utilities/idb';
import { AdditionalRequestProperties } from '../../middleware/index';

export async function GetHome(
  req: ExpressWorkerRequest & AdditionalRequestProperties,
  res: ExpressWorkerResponse,
) {
  const idb = await getIdb();
  const databases = await getPartialDatabasesFromIndexedDb(idb);
  const settings = await getSettingsFromIndexedDb(idb);
  idb.close();

  const renderResult = renderToString(
    <HomePage
      databases={databases}
      settings={settings}
      referrer={req.ref}
    />,
  );

  res.body = `<!DOCTYPE html>${renderResult}`;
  res.headers.set('Content-Type', 'text/html');
}
