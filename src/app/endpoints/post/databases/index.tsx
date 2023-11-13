import { getIdb } from 'utilities/idb';
import { getUniqueId } from 'shared/getUniqueId';
import { addPartialDatabaseToIndexedDb } from 'utilities/idb';
import { assertIsDatabase } from 'shared/assertions';
import { Referrer } from 'shared/types';

export async function PostDatabase(event: FetchEvent, match: RegExpExecArray|null, formData: Record<string, string>, referrer: Referrer) {
  const idb = await getIdb();
  const id = getUniqueId();

  const database = {
    id,
    type: formData.type,
    name: formData.name || '',
    properties: [],
    rows: [],
  };

  assertIsDatabase(database);

  await addPartialDatabaseToIndexedDb(database, idb);

  const databaseUrl = `/databases/${id}`;
  const url = new URL(databaseUrl, new URL(event.request.url).origin);
  
  return Response.redirect(url.href, 303);
}