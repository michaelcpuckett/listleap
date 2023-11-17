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

export async function GetSettings(
  event: FetchEvent,
  match: RegExpExecArray | null,
  referrer: Referrer,
) {
  const idb = await getIdb();
  const settings = await getSettingsFromIndexedDb(idb);
  idb.close();

  const renderResult = renderToString(
    <SettingsPage
      settings={settings}
      referrer={referrer}
    />,
  );

  return new Response(`<!DOCTYPE html>${renderResult}`, {
    headers: { 'Content-Type': 'text/html' },
  });
}
