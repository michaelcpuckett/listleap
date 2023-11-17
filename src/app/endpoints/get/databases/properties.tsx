import React from 'react';
import { Referrer } from 'shared/types';
import { renderToString } from 'react-dom/server';
import { DatabasePage } from 'components/pages/DatabasePage';
import {
  getIdb,
  getDatabaseFromIndexedDb,
  getSettingsFromIndexedDb,
} from 'utilities/idb';

export async function GetDatabaseProperties(
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

  const settings = await getSettingsFromIndexedDb(idb);
  idb.close();

  const mode =
    new URL(event.request.url).searchParams.get('mode') || 'ADD_PROPERTY';

  const renderResult = renderToString(
    <DatabasePage
      database={database}
      settings={settings}
      referrer={{
        ...referrer,
        mode,
      }}
    />,
  );

  return new Response(`<!DOCTYPE html>${renderResult}`, {
    headers: { 'Content-Type': 'text/html' },
  });
}
