import {
  getIdb,
  getDatabaseFromIndexedDb,
  reorderRowInIndexedDb,
  editRowInIndexedDb,
  getRowByPositionFromIndexedDb,
} from 'utilities/idb';
import {
  Referrer,
  NormalizedFormData,
  AnyProperty,
  Database,
  Property,
} from 'shared/types';
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
    return new Response('Not found', {
      status: 404,
    });
  }

  const existingRow = database.rows.find((row) => row.id === id);

  if (!existingRow) {
    return new Response('Not found', {
      status: 404,
    });
  }

  const rowToPatch = {
    id: existingRow.id,
    position: existingRow.position,
    databaseId: database.id,
    title: formData.title ?? existingRow.title ?? '',
  };

  for (const property of database.properties) {
    const formDataValue = formatPropertyValueFromFormData<typeof property>(
      formData[property.id],
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
    return new Response('Not found', {
      status: 404,
    });
  }

  if (formData.position !== undefined) {
    const rowToReorder = await getRowByPositionFromIndexedDb(
      formData.position,
      idb,
    );
    await reorderRowInIndexedDb(rowToPatch, rowToReorder, idb);
  }

  await editRowInIndexedDb<typeof database>(rowToPatch, idb);

  const redirectUrl = new URL(
    formData._redirect || `/databases/${databaseId}`,
    new URL(event.request.url).origin,
  );
  redirectUrl.search = new URL(event.request.referrer).search;
  return Response.redirect(redirectUrl.href, 303);
}
