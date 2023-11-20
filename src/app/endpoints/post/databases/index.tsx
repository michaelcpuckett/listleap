import {
  addBlankRowToIndexedDb,
  addPropertyToIndexedDb,
  getDatabaseFromIndexedDb,
  getIdb,
} from 'utilities/idb';
import { getUniqueId } from 'shared/getUniqueId';
import { addPartialDatabaseToIndexedDb } from 'utilities/idb';
import { assertIsDatabase } from 'shared/assertions';
import { Referrer, NormalizedFormData, Property } from 'shared/types';
import { unwrap, wrap } from 'idb';

export async function PostDatabase(
  event: FetchEvent,
  match: RegExpExecArray | null,
  formData: NormalizedFormData,
  referrer: Referrer,
) {
  const id = getUniqueId();

  const partialDatabase = {
    id,
    type: formData.type,
    name: formData.name || '',
    properties: [],
    rows: [],
  };

  assertIsDatabase(partialDatabase);

  await addPartialDatabaseToIndexedDb(partialDatabase);

  const titleProperty: Omit<Property<StringConstructor>, 'position'> = {
    id: 'title',
    name: '',
    databaseId: id,
    type: String,
  };

  const idb = await getIdb();

  await addPropertyToIndexedDb(titleProperty, idb);

  const database = await getDatabaseFromIndexedDb(id, idb);

  if (!database) {
    idb.close();
    return new Response('Not found', {
      status: 404,
    });
  }

  await addBlankRowToIndexedDb(database, idb);
  await addBlankRowToIndexedDb(database, idb);
  await addBlankRowToIndexedDb(database, idb);

  idb.close();

  const databaseUrl = `/databases/${id}`;
  const url = new URL(databaseUrl, new URL(event.request.url).origin);

  return Response.redirect(url.href, 303);
}
