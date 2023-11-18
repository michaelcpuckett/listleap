import {
  getIdb,
  getDatabaseFromIndexedDb,
  deleteRowByIdFromIndexedDb,
  deleteDatabaseByIdFromIndexedDb,
} from 'utilities/idb';
import { Referrer, NormalizedFormData } from 'shared/types';

export async function DeleteDatabase(
  event: FetchEvent,
  match: RegExpExecArray | null,
  formData: NormalizedFormData,
  referrer: Referrer,
) {
  const idb = await getIdb();
  const databaseId = match?.[1] || '';
  const database = await getDatabaseFromIndexedDb(databaseId, idb);
  idb.close();

  if (!database) {
    return new Response('Not found', {
      status: 404,
    });
  }

  await deleteDatabaseByIdFromIndexedDb(databaseId);

  const redirectUrl = new URL(
    formData._redirect || `/`,
    new URL(event.request.url).origin,
  );
  return Response.redirect(redirectUrl.href, 303);
}
