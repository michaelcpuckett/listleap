import { Referrer, PartialDatabase, NormalizedFormData } from 'shared/types';
import {
  getIdb,
  getDatabaseFromIndexedDb,
  editPartialDatabaseInIndexedDb,
} from 'utilities/idb';

export async function PatchDatabase(
  event: FetchEvent,
  match: RegExpExecArray | null,
  formData: NormalizedFormData,
  referrer: Referrer,
) {
  const idb = await getIdb();
  const databaseId = match?.[1] || '';
  const database = await getDatabaseFromIndexedDb(databaseId, idb);

  if (!database) {
    idb.close();
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
  idb.close();

  return Response.redirect(event.request.url, 303);
}