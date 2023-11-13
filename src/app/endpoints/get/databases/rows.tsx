import { DatabasePage } from 'components/pages/DatabasePage';
import { renderToString } from 'react-dom/server';
import { Database, Property, Referrer, Settings } from 'shared/types';
import {
  getIdb,
  getDatabaseFromIndexedDb,
  getSettingsFromIndexedDb,
} from 'utilities/idb';

export async function GetDatabaseRows(
  event: FetchEvent,
  match: RegExpExecArray | null,
  referrer: Referrer,
) {
  const idb = await getIdb();
  const databaseId = match?.[1] || '';
  const database = await getDatabaseFromIndexedDb(databaseId, idb);

  if (!database) {
    return new Response('Not found', {
      status: 404,
    });
  }

  const url = new URL(event.request.url);

  if (url.searchParams.has('query') && !url.searchParams.get('query')) {
    const redirectUrl = new URL(event.request.url);
    const urlSearchParams = new URLSearchParams(redirectUrl.search);
    urlSearchParams.delete('query');
    redirectUrl.search = urlSearchParams.toString();

    return Response.redirect(redirectUrl.href, 302);
  }

  const settings = await getSettingsFromIndexedDb(idb);

  const renderResult = renderToString(
    <DatabasePage
      database={database}
      referrer={referrer}
      settings={settings}
    />,
  );

  return new Response(`<!DOCTYPE html>${renderResult}`, {
    headers: { 'Content-Type': 'text/html' },
  });
}
