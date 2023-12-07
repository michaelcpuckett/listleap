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
import {
  AdditionalRequestProperties,
  handleRequest,
} from '../../middleware/index';

export async function GetHome(
  req: ExpressWorkerRequest,
  res: ExpressWorkerResponse,
) {
  return handleRequest(async (req, res) => {
    const idb = await getIdb();
    const databases = await getPartialDatabasesFromIndexedDb(idb);
    const settings = await getSettingsFromIndexedDb(idb);
    idb.close();

    const renderResult = renderToString(
      <HomePage
        databases={databases}
        settings={settings}
        version={req.version}
        query={req.query}
      />,
    );

    res.send(`<!DOCTYPE html>${renderResult}`);
  })(req, res);
}
