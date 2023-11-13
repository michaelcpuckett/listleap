import { Database, GetRowByType, Property, Row, Referrer } from 'shared/types';
import { guardIsChecklistRow, guardIsTableRow } from 'shared/assertions';
import { getUniqueId } from 'shared/getUniqueId';
import { getIdb, getDatabaseFromIndexedDb, addRowToIndexedDb } from 'utilities/idb';

export async function PostDatabaseRows(event: FetchEvent, match: RegExpExecArray|null, formData: Record<string, string>, referrer: Referrer) {
  const idb = await getIdb();
  const id = match?.[1] || '';
  const database = await getDatabaseFromIndexedDb(id, idb);

  if (!database) {
    return new Response("Not found", {
      status: 404,
    });
  }

  const properties = database.properties || [];
  
  type TypedRow = GetRowByType<typeof database['type']>;

  const rowToAdd: Partial<TypedRow> = {
    id: getUniqueId(),
    databaseId: database.id,
    title: formData.title || '',
  };

  function guardIsRowOfType<T extends Row<Property[]>>(row: Partial<Row<Property[]>>, database: Database<Property[]>): row is T {
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

    if (property.type === String) {
      rowToAdd[property.id] = `${formData[property.id]}`;
    }

    if (property.type === Number) {
      rowToAdd[property.id] = Number(formData[property.id]);
    }

    if (property.type === Boolean) {
      rowToAdd[property.id] = formData[property.id] === 'on';
    }
  }

  await addRowToIndexedDb<typeof database>(rowToAdd, idb);

  return Response.redirect(event.request.referrer, 303);
}