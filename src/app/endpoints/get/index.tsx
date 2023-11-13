import { HomePage } from 'components/pages/HomePage';
import { renderToString } from 'react-dom/server';
import { Referrer } from 'shared/types';
import { SwotionIDB, getIdb, getPartialDatabasesFromIndexedDb, getSettingsFromIndexedDb } from 'utilities/idb';

export async function GetIndex(event: FetchEvent, match: RegExpExecArray|null, referrer: Referrer) {
  const idb = await getIdb();
  const databases = await getPartialDatabasesFromIndexedDb(idb);
  const settings = await getSettingsFromIndexedDb(idb);
  const renderResult = renderToString(
    <HomePage
      databases={databases}
      settings={settings}
      referrer={referrer}
    />
  );

  return new Response(`<!DOCTYPE html>${renderResult}`, {
    headers: { "Content-Type": "text/html" },
  });
}