import {
  ExpressWorkerResponse,
  ExpressWorkerRequest,
} from '@express-worker/app';
import { SettingsPage } from 'components/pages/SettingsPage';
import { renderToString } from 'react-dom/server';
import { getIdb, getSettingsFromIndexedDb } from 'utilities/idb';
import { handleRequest } from 'middleware/index';

export async function GetSettings(
  req: ExpressWorkerRequest,
  res: ExpressWorkerResponse,
) {
  return handleRequest(async (req, res) => {
    const idb = await getIdb();
    const settings = await getSettingsFromIndexedDb(idb);
    idb.close();

    const renderResult = renderToString(
      <SettingsPage
        settings={settings}
        version={req.version}
      />,
    );

    res.send(`<!DOCTYPE html>${renderResult}`);
  })(req, res);
}
