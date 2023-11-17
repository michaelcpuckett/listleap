import {
  getIdb,
  getDatabaseFromIndexedDb,
  reorderRowInIndexedDb,
  editRowInIndexedDb,
  getRowByPositionFromIndexedDb,
} from 'utilities/idb';
import { Referrer, NormalizedFormData } from 'shared/types';
import { guardIsChecklistRow, guardIsTableRow } from 'shared/assertions';
import { formatPropertyValueFromFormData } from 'shared/formatPropertyValueFromFormData';

export async function PatchDatabaseRow(
  event: FetchEvent,
  match: RegExpExecArray | null,
  formData: NormalizedFormData,
  referrer: Referrer,
) {
  const idb = await getIdb();
  const databaseId = match?.[1] || '';
  const id = match?.[2] || '';
  const database = await getDatabaseFromIndexedDb(databaseId, idb);

  if (!database) {
    idb.close();
    return new Response('Not found', {
      status: 404,
    });
  }

  const existingRow = database.rows.find((row) => row.id === id);

  if (!existingRow) {
    idb.close();
    return new Response('Not found', {
      status: 404,
    });
  }

  const rowToPatch = {
    id: existingRow.id,
    position: existingRow.position,
    databaseId: database.id,
  };

  for (const property of database.properties) {
    const formDataValue = formatPropertyValueFromFormData<typeof property>(
      formData[property.id] ?? existingRow[property.id],
      property,
    );

    if (formDataValue === undefined) {
      continue;
    }

    rowToPatch[property.id] = formDataValue;
  }

  if (
    !(
      guardIsChecklistRow(rowToPatch, database) ||
      guardIsTableRow(rowToPatch, database)
    )
  ) {
    idb.close();
    return new Response('Not found', {
      status: 404,
    });
  }

  if (formData.position !== undefined) {
    const rowToReorder = await getRowByPositionFromIndexedDb(
      formData.position,
      databaseId,
      idb,
    );
    await reorderRowInIndexedDb(existingRow, rowToReorder, idb);
    rowToPatch.position = formData.position;
  }

  await editRowInIndexedDb<typeof database>(rowToPatch, idb);
  idb.close();

  const redirectUrl = new URL(
    formData._redirect || `/databases/${databaseId}`,
    new URL(event.request.url).origin,
  );
  redirectUrl.search = new URL(event.request.referrer).search;
  return Response.redirect(redirectUrl.href, 303);
}
