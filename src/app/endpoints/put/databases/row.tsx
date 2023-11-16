import {
  Database,
  Referrer,
  NormalizedFormData,
  AnyProperty,
} from 'shared/types';
import { guardIsChecklistRow, guardIsTableRow } from 'shared/assertions';
import {
  getIdb,
  getDatabaseFromIndexedDb,
  editRowInIndexedDb,
  getRowByPositionFromIndexedDb,
  reorderRowInIndexedDb,
  addBlankRowToIndexedDb,
} from 'utilities/idb';
import { formatPropertyValueFromFormData } from 'shared/formatPropertyValueFromFormData';

export async function PutDatabaseRow(
  event: FetchEvent,
  match: RegExpExecArray | null,
  formData: NormalizedFormData,
  referrer: Referrer,
) {
  const idb = await getIdb();
  const databaseId = match?.[1] || '';
  const id = match?.[2] || '';
  const database: Database<AnyProperty[]> | null =
    await getDatabaseFromIndexedDb(databaseId, idb);

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

  const isLastRow =
    database.rows.indexOf(existingRow) === database.rows.length - 1;

  const rowToPut = {
    id: existingRow.id,
    position: existingRow.position,
    databaseId: database.id,
  };

  for (const property of database.properties) {
    const formDataValue = formatPropertyValueFromFormData<typeof property>(
      formData[property.id] || existingRow[property.id],
      property,
    );

    if (formDataValue === undefined) {
      continue;
    }

    rowToPut[property.id] = formDataValue;
  }

  if (
    !(
      guardIsChecklistRow(rowToPut, database) ||
      guardIsTableRow(rowToPut, database)
    )
  ) {
    return new Response('Not found', {
      status: 404,
    });
  }

  if (guardIsChecklistRow(rowToPut, database)) {
    rowToPut.completed = formData.completed === 'on';
  }

  if (formData.position && formData.position !== existingRow.position) {
    const rowToReorder = await getRowByPositionFromIndexedDb(
      formData.position,
      idb,
    );
    await reorderRowInIndexedDb(existingRow, rowToReorder, idb);
    rowToPut.position = formData.position;
  }

  await editRowInIndexedDb<typeof database>(rowToPut, idb);

  if (isLastRow) {
    await addBlankRowToIndexedDb(database, idb);
  }

  const redirectUrl = new URL(
    formData._redirect || `/databases/${databaseId}`,
    new URL(event.request.url).origin,
  );

  return Response.redirect(redirectUrl.href, 303);
}
