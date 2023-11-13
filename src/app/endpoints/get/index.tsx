import { HomePage } from 'components/pages/HomePage';
import { renderToString } from 'react-dom/server';
import { Referrer } from 'shared/types';
import { SwotionIDB, getIdb, getPartialDatabasesFromIndexedDb, getSettingsFromIndexedDb } from 'utilities/idb';

export async function GetIndex(referrer: Referrer) {
  const idb = await getIdb();
  const renderResult = await renderHomePage(idb, referrer);

  return new Response(`<!DOCTYPE html>${renderResult}`, {
    headers: { "Content-Type": "text/html" },
  });
}

async function renderHomePage(idb: SwotionIDB, referrer: Referrer) {
  const databases = await getPartialDatabasesFromIndexedDb(idb);
  const settings = await getSettingsFromIndexedDb(idb);

  return renderToString(
    <HomePage
      databases={databases}
      settings={settings}
      referrer={referrer}
    />
  );
}