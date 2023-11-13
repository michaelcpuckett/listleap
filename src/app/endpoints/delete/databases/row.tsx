import {
  getIdb,
  getDatabaseFromIndexedDb,
  deleteRowByIdFromIndexedDb,
} from 'utilities/idb';
import { Referrer } from 'shared/types';

export async function DeleteDatabaseRow(
  event: FetchEvent,
  match: RegExpExecArray | null,
  formData: Record<string, string>,
  referrer: Referrer,
) {
  const idb = await getIdb();
  const databaseId = match?.[1] || '';
  const id = match?.[2] || '';
  const database = await getDatabaseFromIndexedDb(databaseId, idb);

  if (!database) {
    return new Response('Not found', {
      status: 404,
    });
  }

  await deleteRowByIdFromIndexedDb(id, idb);

  const redirectUrl = new URL(
    formData._redirect || `/databases/${databaseId}`,
    new URL(event.request.url).origin,
  );
  return Response.redirect(redirectUrl.href, 303);
}
