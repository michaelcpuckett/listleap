import { Referrer, NormalizedFormData } from 'shared/types';
import { guardIsChecklistRow, guardIsTableRow } from 'shared/assertions';
import { getUniqueId } from 'shared/getUniqueId';
import { formatPropertyValueFromFormData } from 'shared/formatPropertyValueFromFormData';
import {
  getIdb,
  getDatabaseFromIndexedDb,
  addRowToIndexedDb,
  getRowByIdFromIndexedDb,
  deleteRowByIdFromIndexedDb,
} from 'utilities/idb';
import { LexoRank } from 'lexorank';

export async function PostDatabaseRows(
  event: FetchEvent,
  match: RegExpExecArray | null,
  formData: NormalizedFormData,
  referrer: Referrer,
) {
  const idb = await getIdb();
  const id = match?.[1] || '';
  const database = await getDatabaseFromIndexedDb(id, idb);

  if (!database) {
    idb.close();
    return new Response('Not found', {
      status: 404,
    });
  }

  if (formData.bulkAction !== undefined) {
    const rowIds = formData['row[]'] || [];

    if (formData.bulkAction === 'DELETE') {
      for (const rowId of rowIds) {
        const row = await getRowByIdFromIndexedDb(rowId, database.id, idb);

        if (!row) {
          continue;
        }

        await deleteRowByIdFromIndexedDb(row.id, database.id, idb);
      }
    } else {
      throw new Error('Invalid bulk action.');
    }

    idb.close();
    return Response.redirect(event.request.referrer, 303);
  }

  const rowToAdd = {
    id: getUniqueId(),
    databaseId: database.id,
  };

  for (const property of database.properties) {
    const formDataValue = formatPropertyValueFromFormData<typeof property>(
      formData[property.id],
      property,
    );

    if (formDataValue === undefined) {
      continue;
    }

    rowToAdd[property.id] = formDataValue;
  }

  if (
    !guardIsChecklistRow(rowToAdd, database) &&
    !guardIsTableRow(rowToAdd, database)
  ) {
    idb.close();
    const url = new URL(event.request.referrer);
    url.searchParams.set('error', 'Invalid row');

    return Response.redirect(url.href, 303);
  }

  if (guardIsChecklistRow(rowToAdd, database)) {
    rowToAdd.completed = formData.completed === 'on';
  }

  if (formData.position !== undefined) {
    rowToAdd.position = formData.position;
  } else {
    const lastRow = database.rows[database.rows.length - 1];

    if (lastRow) {
      rowToAdd.position = LexoRank.parse(lastRow.position).genNext().toString();
    } else {
      rowToAdd.position = LexoRank.min().toString();
    }
  }

  await addRowToIndexedDb<typeof database>(rowToAdd, idb);
  idb.close();

  return Response.redirect(event.request.referrer, 303);
}
