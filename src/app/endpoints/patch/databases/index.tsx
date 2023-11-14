import { Referrer, PartialDatabase } from 'shared/types';
import {
  getIdb,
  getDatabaseFromIndexedDb,
  editPartialDatabaseInIndexedDb,
} from 'utilities/idb';

export async function PatchDatabase(
  event: FetchEvent,
  match: RegExpExecArray | null,
  formData: Record<string, string>,
  referrer: Referrer,
) {
  const idb = await getIdb();
  const databaseId = match?.[1] || '';
  const database = await getDatabaseFromIndexedDb(databaseId, idb);

  console.log({
    database,
  });

  if (!database) {
    return new Response('Not found', {
      status: 404,
    });
  }

  const updatedDatabase: PartialDatabase = {
    id: database.id,
    type: database.type,
    name: typeof formData.name === 'string' ? formData.name : database.name,
  };

  await editPartialDatabaseInIndexedDb(updatedDatabase, idb);

  return Response.redirect(event.request.url, 303);
}
