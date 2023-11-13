import {
  getIdb,
  getDatabaseFromIndexedDb,
  reorderRowInIndexedDb,
  editRowInIndexedDb,
} from 'utilities/idb';
import { Referrer } from 'shared/types';

export async function PatchDatabaseRow(
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

  const properties = database.properties || [];
  const rowToPatch = database.rows.find((row) => row.id === id);

  if (!rowToPatch) {
    return new Response('Not found', {
      status: 404,
    });
  }

  if (formData.index !== undefined) {
    await reorderRowInIndexedDb(
      Number(rowToPatch.index),
      Number(formData.index),
      idb,
    );
  } else {
    for (const [key, value] of Object.entries(formData)) {
      if (['_method', '_redirect'].includes(key)) {
        continue;
      }

      rowToPatch[key] = value;
    }

    await editRowInIndexedDb<typeof database>(rowToPatch, idb);
  }

  const redirectUrl = new URL(
    formData._redirect || `/databases/${databaseId}`,
    new URL(event.request.url).origin,
  );
  redirectUrl.search = new URL(event.request.referrer).search;
  return Response.redirect(redirectUrl.href, 303);
}
