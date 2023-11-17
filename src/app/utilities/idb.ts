import { DBSchema, IDBPDatabase, unwrap, wrap } from 'idb';
import {
  AnyRow,
  Database,
  PartialDatabase,
  Row,
  Settings,
  UntypedProperty,
  DynamicPropertyKeyValuePairs,
  AnyProperty,
  AnyDatabase,
} from 'shared/types';
import { getUniqueId } from 'shared/getUniqueId';
import { LexoRank } from 'lexorank/lib/lexoRank';
import { ID } from 'yjs';

const DATABASE_NAME = 'listleap';

interface SwotionSchema extends DBSchema {
  settings: {
    key: string;
    value: keyof Settings;
  };
  databases: {
    key: string;
    value: PartialDatabase;
  };
  [key: `rows--${string}`]: {
    key: string;
    value: Row<AnyDatabase>;
    keyPath: 'id';
    indexes: { id: string; position: string };
  };
  [key: `properties--${string}`]: {
    key: string;
    value: UntypedProperty;
    keyPath: 'id';
    indexes: { id: string; position: string };
  };
}

export type SwotionIDB = IDBPDatabase<SwotionSchema>;

export async function getIdb(options?: {
  onclose: () => void;
}): Promise<SwotionIDB> {
  console.log('getIdb');
  return await new Promise(async (resolve, reject) => {
    const version = await self.indexedDB.databases().then((databases) => {
      const database = databases.find(
        (database) => database.name === DATABASE_NAME,
      );

      return database?.version || 1;
    });

    const openRequest = self.indexedDB.open(DATABASE_NAME, version);

    openRequest.addEventListener('success', () => {
      console.log('success');
      openRequest.result.onclose =
        options?.onclose ||
        (() => {
          console.log('onclose');
        });
      const wrappedIdb = wrap(openRequest.result) as SwotionIDB;
      resolve(wrappedIdb);
    });

    openRequest.addEventListener('upgradeneeded', () => {
      console.log('upgradeneeded');
      openRequest.result.createObjectStore('settings');
      openRequest.result.createObjectStore('databases');
    });

    openRequest.addEventListener('error', (event) => {
      console.log('error', event);
      reject(event);
    });

    openRequest.addEventListener('blocked', (event) => {
      console.log('blocked', event);
      reject(event);
    });
  });
}

export async function getSettingsFromIndexedDb(
  idb: SwotionIDB,
): Promise<Settings> {
  const db = idb as IDBPDatabase<unknown>;
  const tx = db.transaction('settings', 'readonly');
  const store = tx.objectStore('settings');
  const theme = (await store.get('theme')) || '';
  await tx.done;
  return { theme };
}

export function getPropertyTypeFromString(type: string) {
  switch (type) {
    case 'Number':
      return Number;
    case 'Boolean':
      return Boolean;
    case 'String':
    default:
      return String;
  }
}

export function getStringFromPropertyType(
  type: NumberConstructor | BooleanConstructor | StringConstructor,
) {
  switch (type) {
    case Number:
      return 'Number';
    case Boolean:
      return 'Boolean';
    case String:
    default:
      return 'String';
  }
}

export async function getPropertiesByDatabaseIdFromIndexedDb<
  Db extends Database<AnyProperty[]>,
>(databaseId: string, idb: SwotionIDB): Promise<Db['properties']> {
  const db = idb as IDBPDatabase<unknown>;
  const objectStoreName = `properties--${databaseId}`;
  const filteredUntypedProperties = await db.getAllFromIndex(
    objectStoreName,
    'position',
  );
  console.log(filteredUntypedProperties, databaseId);

  const convertType = (property: UntypedProperty): AnyProperty => {
    const { type, ...rest } = property;
    const typedProperty = {
      ...rest,
      type: getPropertyTypeFromString(type),
    };

    return typedProperty;
  };

  function guardIsProperty(property: unknown): property is AnyProperty {
    if (typeof (property as AnyProperty).position !== 'string') {
      return false;
    }

    function isStringType(
      type: AnyProperty['type'] | UntypedProperty['type'],
    ): type is UntypedProperty['type'] {
      return typeof (property as UntypedProperty).type === 'string';
    }

    if (isStringType((property as UntypedProperty).type)) {
      return false;
    }

    const isValidType = [Number, Boolean, String].includes(
      (property as AnyProperty).type,
    );

    return isValidType;
  }

  const filteredProperties = filteredUntypedProperties
    .map(convertType)
    .filter(guardIsProperty);

  return filteredProperties;
}

export async function addPartialDatabaseToIndexedDb(
  partialDatabase: PartialDatabase,
  idb: SwotionIDB,
): Promise<number> {
  const { id, name, type } = partialDatabase;
  const db = idb as IDBPDatabase<unknown>;
  const tx = db.transaction('databases', 'readwrite');
  const store = tx.objectStore('databases');
  store.add(
    {
      id,
      name,
      type,
    },
    partialDatabase.id,
  );

  await tx.done;

  return db.version;
}

export async function saveSettingsToIndexedDb(
  settings: Settings,
  idb: SwotionIDB,
): Promise<void> {
  const db = idb as IDBPDatabase<unknown>;
  const tx = db.transaction('settings', 'readwrite');
  const store = tx.objectStore('settings');
  for (const key in settings) {
    await store.put(settings[key], key);
  }
  await tx.done;
}

export async function getDatabaseFromIndexedDb<
  Db extends Database<AnyProperty[]>,
>(id: string, idb: SwotionIDB): Promise<Database<AnyProperty[]> | null> {
  const db = idb as IDBPDatabase<unknown>;
  const tx = db.transaction('databases', 'readwrite');
  const store = tx.objectStore('databases');
  const database = await store.get(id);
  await tx.done;

  if (!database) {
    return null;
  }

  const rows = await getRowsByDatabaseIdFromIndexedDb<Db>(id, idb);
  const properties = await getPropertiesByDatabaseIdFromIndexedDb<Db>(id, idb);

  return {
    ...database,
    rows,
    properties,
  };
}

export async function getPartialDatabasesFromIndexedDb(
  idb: SwotionIDB,
): Promise<PartialDatabase[]> {
  const db = idb as IDBPDatabase<unknown>;
  const tx = db.transaction('databases', 'readwrite');
  const store = tx.objectStore('databases');
  const databases = await store.getAll();
  await tx.done;
  return databases;
}

export async function getRowsByDatabaseIdFromIndexedDb<
  Db extends Database<AnyProperty[]>,
>(databaseId: string, idb: SwotionIDB): Promise<Db['rows']> {
  const db = idb as IDBPDatabase<unknown>;
  console.log(db, 'here');
  const rows = await db.getAllFromIndex(`rows--${databaseId}`, 'position');

  if (!rows.length) {
    return [];
  }

  function guardIsRow(row: unknown): row is AnyRow {
    return typeof (row as AnyRow).position === 'string';
  }

  return rows.filter(guardIsRow).sort((a, b) => {
    return a.position > b.position ? 1 : -1;
  });
}

export async function addRowToIndexedDb<Db extends Database<AnyProperty[]>>(
  row: Db['rows'][number],
  idb: SwotionIDB,
): Promise<void> {
  const db = idb as IDBPDatabase<unknown>;
  const objectStoreName = `rows--${row.databaseId}`;
  const tx = db.transaction(objectStoreName, 'readwrite');
  const store = tx.objectStore(objectStoreName);
  await store.add(row);
  await tx.done;
}

export async function editPartialDatabaseInIndexedDb(
  partialDatabase: PartialDatabase,
  idb: SwotionIDB,
): Promise<void> {
  const db = idb as IDBPDatabase<unknown>;
  const tx = db.transaction('databases', 'readwrite');
  const store = tx.objectStore('databases');
  await store.put(partialDatabase, partialDatabase.id);
  await tx.done;
}

export async function editRowInIndexedDb<Db extends Database<AnyProperty[]>>(
  row: Db['rows'][number],
  idb: SwotionIDB,
): Promise<void> {
  const db = idb as IDBPDatabase<unknown>;
  const objectStoreName = `rows--${row.databaseId}`;
  const tx = db.transaction(objectStoreName, 'readwrite');
  const store = tx.objectStore(objectStoreName);
  await store.put(row);
  await tx.done;
}

export async function reorderRowInIndexedDb(
  rowToReorder: AnyRow,
  rowToFlip: AnyRow | undefined,
  idb: SwotionIDB,
): Promise<void> {
  if (rowToReorder && rowToFlip) {
    const db = idb as IDBPDatabase<unknown>;
    const objectStoreName = `rows--${rowToReorder.databaseId}`;
    const tx = db.transaction(objectStoreName, 'readwrite');
    const store = tx.objectStore(objectStoreName);
    const { position: oldPosition } = rowToReorder;
    const { position: newPosition } = rowToFlip;
    rowToReorder.position = newPosition;
    rowToFlip.position = oldPosition;
    await store.delete(rowToReorder.id);
    await store.delete(rowToFlip.id);
    await store.put(rowToReorder);
    await store.put(rowToFlip);
    await tx.done;
  } else {
    const db = idb as IDBPDatabase<unknown>;
    const objectStoreName = `rows--${rowToReorder.databaseId}`;
    const tx = db.transaction(objectStoreName, 'readwrite');
    const store = tx.objectStore(objectStoreName);

    const rows = await getRowsByDatabaseIdFromIndexedDb(
      rowToReorder.databaseId,
      idb,
    );
    const lastRow = rows[rows.length - 1];

    if (lastRow && lastRow !== rowToReorder) {
      rowToReorder.position = LexoRank.parse(lastRow.position)
        .genNext()
        .toString();
    } else {
      rowToReorder.position = LexoRank.min().toString();
    }
    await store.put(rowToReorder);
    await tx.done;
  }
}

export async function getRowByPositionFromIndexedDb<
  Db extends Database<AnyProperty[]>,
>(
  position: string,
  databaseId: string,
  idb: SwotionIDB,
): Promise<Db['rows'][number]> {
  const db = idb as IDBPDatabase<unknown>;
  const objectStoreName = `rows--${databaseId}`;
  const row = await db.getFromIndex(objectStoreName, 'position', position);

  if (!row) {
    throw new Error('Row not found');
  }

  return row;
}

export async function getRowByIdFromIndexedDb<
  Db extends Database<AnyProperty[]>,
>(
  id: string,
  databaseId: string,
  idb: SwotionIDB,
): Promise<Db['rows'][number] | null> {
  const db = idb as IDBPDatabase<unknown>;
  const objectStoreName = `rows--${databaseId}`;
  return (await db.getFromIndex(objectStoreName, 'id', id)) || null;
}

export async function deleteRowByIdFromIndexedDb(
  id: string,
  databaseId: string,
  idb: SwotionIDB,
): Promise<void> {
  const db = idb as IDBPDatabase<unknown>;
  const objectStoreName = `rows--${databaseId}`;
  const tx = db.transaction(objectStoreName, 'readwrite');
  const store = tx.objectStore(objectStoreName);
  await store.delete(id);
  await tx.done;
}

export async function deletePropertyByIdFromIndexedDb(
  id: string,
  databaseId: string,
  idb: SwotionIDB,
): Promise<void> {
  const db = idb as IDBPDatabase<unknown>;
  const objectStoreName = `properties--${databaseId}`;
  const tx = db.transaction(objectStoreName, 'readwrite');
  const store = tx.objectStore(objectStoreName);
  await store.delete(id);
  await tx.done;
}

export async function addPropertyToIndexedDb<
  Db extends Database<AnyProperty[]>,
>(
  property: Omit<Db['properties'][number], 'position'>,
  idb: SwotionIDB,
): Promise<void> {
  const db = idb as IDBPDatabase<unknown>;
  const objectStoreName = `properties--${property.databaseId}`;
  const allProperties = await db.getAllFromIndex(objectStoreName, 'position');
  const lastProperty = allProperties[allProperties.length - 1];
  const untypedProperty = {
    ...property,
    type: getStringFromPropertyType(property.type),
    position: lastProperty
      ? LexoRank.parse(lastProperty.position).genNext().toString()
      : LexoRank.min().toString(),
  };

  const tx = db.transaction(objectStoreName, 'readwrite');
  const store = tx.objectStore(objectStoreName);
  await store.add(untypedProperty);
  await tx.done;
}

export async function editPropertyInIndexedDb<
  Db extends Database<AnyProperty[]>,
>(property: Db['properties'][number], idb: SwotionIDB): Promise<void> {
  const db = idb as IDBPDatabase<unknown>;
  const objectStoreName = `properties--${property.databaseId}`;
  const tx = db.transaction(objectStoreName, 'readwrite');
  const store = tx.objectStore(objectStoreName);
  const untypedProperty = {
    ...property,
    type: getStringFromPropertyType(property.type),
  };
  await store.put(untypedProperty);
  await tx.done;
}

export async function addBlankRowToIndexedDb<
  Db extends Database<AnyProperty[]>,
>(database: Db, idb: SwotionIDB): Promise<void> {
  const rows = await getRowsByDatabaseIdFromIndexedDb(database.id, idb);
  const lastRow = rows[rows.length - 1];
  const properties = database.properties;
  const dynamicPropertyKeyPairEntries = properties.map(
    (property: AnyProperty) => {
      const key = property.id;
      const isArray = key.endsWith('[]');

      if (isArray) {
        return [key, []];
      }

      if (property.type === String) {
        return [key, ''];
      }

      if (property.type === Number) {
        return [key, 0];
      }

      if (property.type === Boolean) {
        return [key, false];
      }

      throw new Error('Unknown property type');
    },
  );

  const dynamicPropertyKeyPairs: DynamicPropertyKeyValuePairs<
    Db['properties']
  > = Object.fromEntries(dynamicPropertyKeyPairEntries);

  const row: Row<Db> = {
    id: getUniqueId(),
    databaseId: database.id,
    title: '',
    position: LexoRank.min().toString(),
    ...dynamicPropertyKeyPairs,
  };

  if (lastRow) {
    row.position = LexoRank.parse(lastRow.position).genNext().toString();
  }

  const db = idb as IDBPDatabase<unknown>;
  const objectStoreName = `rows--${row.databaseId}`;
  const tx = db.transaction(objectStoreName, 'readwrite');
  const store = tx.objectStore(objectStoreName);
  await store.add(row);
  await tx.done;
}
