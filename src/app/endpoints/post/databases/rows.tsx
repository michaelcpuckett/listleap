import {
  Database,
  GetRowByType,
  Property,
  Row,
  Referrer,
  NormalizedFormData,
  AnyProperty,
} from 'shared/types';
import {
  guardIsBooleanDynamicPropertyType,
  guardIsChecklistRow,
  guardIsNumberDynamicPropertyType,
  guardIsStringDynamicPropertyType,
  guardIsTableRow,
} from 'shared/assertions';
import { getUniqueId } from 'shared/getUniqueId';
import {
  getIdb,
  getDatabaseFromIndexedDb,
  addRowToIndexedDb,
  reorderRowInIndexedDb,
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
    return new Response('Not found', {
      status: 404,
    });
  }

  if (formData.bulkAction !== undefined) {
    const rowIds = formData['row[]'] || [];

    if (formData.bulkAction === 'DELETE') {
      for (const rowId of rowIds) {
        const row = await getRowByIdFromIndexedDb(rowId, idb);

        if (!row) {
          continue;
        }

        await deleteRowByIdFromIndexedDb(row.id, idb);
      }
    } else {
      throw new Error('Invalid bulk action.');
    }

    return Response.redirect(event.request.referrer, 303);
  }

  const properties = database.properties || [];

  type TypedRow = GetRowByType<(typeof database)['type']>;

  const rowToAdd: Partial<TypedRow> = {
    id: getUniqueId(),
    databaseId: database.id,
    title: formData.title || '',
  };

  function guardIsRowOfType<T extends Row<AnyProperty[]>>(
    row: Partial<Row<AnyProperty[]>>,
    database: Database<AnyProperty[]>,
  ): row is T {
    return guardIsChecklistRow(row, database) || guardIsTableRow(row, database);
  }

  if (!guardIsRowOfType<TypedRow>(rowToAdd, database)) {
    const url = new URL(event.request.referrer);
    url.searchParams.set('error', 'Invalid row');

    return Response.redirect(url.href, 303);
  }

  if (guardIsChecklistRow(rowToAdd, database)) {
    rowToAdd.completed = formData.completed === 'on';
  }

  for (const property of properties) {
    if (formData[property.id] === undefined) {
      continue;
    }

    if (guardIsStringDynamicPropertyType(property)) {
      rowToAdd[property.id] = `${formData[property.id]}`;
    }

    if (guardIsNumberDynamicPropertyType(property)) {
      rowToAdd[property.id] = Number(formData[property.id]);
    }

    if (guardIsBooleanDynamicPropertyType(property)) {
      rowToAdd[property.id] = formData[property.id] === 'on';
    }
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

  return Response.redirect(event.request.referrer, 303);
}
