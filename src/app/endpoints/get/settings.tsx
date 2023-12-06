import {
  ExpressWorkerResponse,
  ExpressWorkerRequest,
} from '@express-worker/app';
import { HomePage } from 'components/pages/HomePage';
import { SettingsPage } from 'components/pages/SettingsPage';
import { renderToString } from 'react-dom/server';
import { Referrer } from 'shared/types';
import {
  SwotionIDB,
  getIdb,
  getPartialDatabasesFromIndexedDb,
  getSettingsFromIndexedDb,
} from 'utilities/idb';
import { AdditionalRequestProperties } from '../../middleware';

export async function GetSettings(
  req: ExpressWorkerRequest & AdditionalRequestProperties,
  res: ExpressWorkerResponse,
) {
  const idb = await getIdb();
  const settings = await getSettingsFromIndexedDb(idb);
  idb.close();

  const renderResult = renderToString(
    <SettingsPage
      settings={settings}
      referrer={req.ref}
    />,
  );

  res.body = `<!DOCTYPE html>${renderResult}`;
  res.headers.set('Content-Type', 'text/html');
}
