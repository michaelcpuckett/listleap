import {
  Database,
  Property,
  GetRowByType,
  Row,
  Referrer,
  NormalizedFormData,
  DynamicPropertyKey,
  AnyDatabase,
  AnyProperty,
  AnyRow,
} from 'shared/types';
import {
  guardIsBooleanDynamicPropertyType,
  guardIsChecklistRow,
  guardIsNumberDynamicPropertyType,
  guardIsStringDynamicPropertyType,
  guardIsTableRow,
} from 'shared/assertions';
import {
  getIdb,
  getDatabaseFromIndexedDb,
  editRowInIndexedDb,
  getRowByPositionFromIndexedDb,
  reorderRowInIndexedDb,
  addRowToIndexedDb,
  addBlankRowToIndexedDb,
} from 'utilities/idb';
import { getUniqueId } from 'shared/getUniqueId';

export async function PutDatabaseRow(
  event: FetchEvent,
  match: RegExpExecArray | null,
  formData: NormalizedFormData,
  referrer: Referrer,
) {
  const idb = await getIdb();
  const databaseId = match?.[1] || '';
  const id = match?.[2] || '';
  const database: AnyDatabase | null = await getDatabaseFromIndexedDb(
    databaseId,
    idb,
  );

  if (!database) {
    return new Response('Not found', {
      status: 404,
    });
  }

  type TypedRow = GetRowByType<typeof database>;

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
    title: formData.title || '',
  };

  function guardIsRowOfType<T extends AnyProperty>(
    row: unknown,
    database: AnyDatabase,
  ): row is T {
    return guardIsChecklistRow(row, database) || guardIsTableRow(row, database);
  }

  if (!guardIsRowOfType<TypedRow>(rowToPut, database)) {
    const url = new URL(event.request.referrer);
    url.searchParams.set('error', 'Invalid row');

    return Response.redirect(url.href, 303);
  }

  // if (guardIsChecklistRow(rowToPut, database)) {
  //   rowToPut.completed = formData.completed === 'on';
  // }

  const properties: AnyProperty[] = database.properties || [];

  for (const property of properties) {
    if (formData[property.id] === undefined) {
      continue;
    }

    const key: DynamicPropertyKey<typeof property> = property.id;

    if (guardIsStringDynamicPropertyType(property)) {
      rowToPut[key] = `${formData[property.id]}`;
    }

    if (guardIsNumberDynamicPropertyType(property)) {
      rowToPut[property.id] = Number(formData[property.id]);
    }

    if (guardIsBooleanDynamicPropertyType(property)) {
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

  if (isLastRow) {
    await addBlankRowToIndexedDb(database, idb);
  }

  const redirectUrl = new URL(
    formData._redirect || `/databases/${databaseId}`,
    new URL(event.request.url).origin,
  );

  return Response.redirect(redirectUrl.href, 303);
}
