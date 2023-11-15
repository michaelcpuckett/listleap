import {
  Database,
  Property,
  GetRowByType,
  Row,
  Referrer,
  NormalizedFormData,
} from 'shared/types';
import { guardIsChecklistRow, guardIsTableRow } from 'shared/assertions';
import {
  getIdb,
  getDatabaseFromIndexedDb,
  editRowInIndexedDb,
  getRowByPositionFromIndexedDb,
  reorderRowInIndexedDb,
} from 'utilities/idb';

export async function PutDatabaseRow(
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

  const properties = database.properties || [];

  type TypedRow = GetRowByType<(typeof database)['type']>;

  const existingRow = database.rows.find((row) => row.id === id);

  if (!existingRow) {
    return new Response('Not found', {
      status: 404,
    });
  }

  const rowToPut: Partial<TypedRow> = {
    id: existingRow.id,
    position: existingRow.position,
    databaseId: database.id,
    title: formData.title,
  };

  function guardIsRowOfType<T extends Row<Property[]>>(
    row: Partial<Row<Property[]>>,
    database: Database<Property[]>,
  ): row is T {
    return guardIsChecklistRow(row, database) || guardIsTableRow(row, database);
  }

  if (!guardIsRowOfType<TypedRow>(rowToPut, database)) {
    const url = new URL(event.request.referrer);
    url.searchParams.set('error', 'Invalid row');

    return Response.redirect(url.href, 303);
  }

  if (guardIsChecklistRow(rowToPut, database)) {
    rowToPut.completed = formData.completed === 'on';
  }

  for (const property of properties) {
    if (formData[property.id] === undefined) {
      continue;
    }

    if (property.type === String) {
      rowToPut[property.id] = `${formData[property.id]}`;
    }

    if (property.type === Number) {
      rowToPut[property.id] = Number(formData[property.id]);
    }

    if (property.type === Boolean) {
      rowToPut[property.id] = formData[property.id] === 'on';
    }
  }

  if (formData.position && formData.position !== existingRow.position) {
    const rowToReorder = await getRowByPositionFromIndexedDb(
      formData.position,
      idb,
    );
    await reorderRowInIndexedDb(rowToPut, rowToReorder, idb);
  }

  await editRowInIndexedDb<typeof database>(rowToPut, idb);

  const redirectUrl = new URL(
    formData._redirect || `/databases/${databaseId}`,
    new URL(event.request.url).origin,
  );

  return Response.redirect(redirectUrl.href, 303);
}
