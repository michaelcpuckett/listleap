import { DBSchema, IDBPDatabase, wrap } from 'idb';
import {
  AnyRow,
  Database,
  PartialDatabase,
  Property,
  Row,
  Settings,
  UntypedProperty,
} from 'shared/types';
import { LexoRank } from 'lexorank/lib/lexoRank';
import { ID } from 'yjs';

interface SwotionSchema extends DBSchema {
  settings: {
    key: string;
    value: keyof Settings;
  };
  databases: {
    key: string;
    value: PartialDatabase;
  };
  rows: {
    key: string;
    value: Row<Property[]>;
    keyPath: 'id';
    indexes: { id: string; position: string; databaseId: string };
  };
  properties: {
    key: number;
    value: Omit<UntypedProperty, 'index'>;
    keyPath: 'index';
    indexes: { id: string; databaseId: string };
  };
}

export type SwotionIDB = IDBPDatabase<SwotionSchema>;

export async function getIdb(): Promise<SwotionIDB> {
  return await new Promise((resolve) => {
    const openRequest = self.indexedDB.open('swotion', 2);

    openRequest.addEventListener('success', () => {
      const wrappedIdb = wrap(openRequest.result) as SwotionIDB;
      resolve(wrappedIdb);
    });

    openRequest.addEventListener('upgradeneeded', () => {
      openRequest.result.createObjectStore('settings');

      openRequest.result.createObjectStore('databases');

      const rowsObjectStore = openRequest.result.createObjectStore('rows', {
        keyPath: 'id',
        autoIncrement: false,
      });
      rowsObjectStore.createIndex('id', 'id', { unique: true });
      rowsObjectStore.createIndex('position', 'position', { unique: true });
      rowsObjectStore.createIndex('databaseId', 'databaseId', {
        unique: false,
      });

      const propertiesObjectStore = openRequest.result.createObjectStore(
        'properties',
        {
          keyPath: 'index',
          autoIncrement: true,
        },
      );
      propertiesObjectStore.createIndex('id', 'id', { unique: true });
      propertiesObjectStore.createIndex('databaseId', 'databaseId', {
        unique: false,
      });
    });

    openRequest.addEventListener('error', (event) => {
      console.error(event);
    });
  });
}

export async function getSettingsFromIndexedDb(
  idb: SwotionIDB,
): Promise<Settings> {
  const tx = idb.transaction('settings', 'readonly');
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
  Db extends Database<Property[]>,
>(databaseId: string, idb: SwotionIDB): Promise<Db['properties']> {
  const filteredUntypedProperties = await idb.getAllFromIndex(
    'properties',
    'databaseId',
    databaseId,
  );

  const convertType = (
    property: Omit<UntypedProperty, 'index'>,
  ): Omit<Property, 'index'> => {
    const { type, ...rest } = property;
    const typedProperty = {
      ...rest,
      type: getPropertyTypeFromString(type),
    };

    return typedProperty;
  };

  function guardIsProperty(property: unknown): property is Property {
    if (typeof (property as Property).index !== 'number') {
      return false;
    }

    function isStringType(
      type: Property['type'] | UntypedProperty['type'],
    ): type is UntypedProperty['type'] {
      return typeof (property as UntypedProperty).type === 'string';
    }

    if (isStringType((property as UntypedProperty).type)) {
      return false;
    }

    const isValidType = [Number, Boolean, String].includes(
      (property as Property).type,
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
): Promise<void> {
  const tx = idb.transaction('databases', 'readwrite');
  const store = tx.objectStore('databases');
  const { id, name, type } = partialDatabase;
  await store.add(
    {
      id,
      name,
      type,
    },
    partialDatabase.id,
  );
  await tx.done;
}

export async function saveSettingsToIndexedDb(
  settings: Settings,
  idb: SwotionIDB,
): Promise<void> {
  const tx = idb.transaction('settings', 'readwrite');
  const store = tx.objectStore('settings');
  for (const key in settings) {
    await store.put(settings[key], key);
  }
  await tx.done;
}

export async function getDatabaseFromIndexedDb<Db extends Database<Property[]>>(
  id: string,
  idb: SwotionIDB,
): Promise<Database<Property[]> | null> {
  const tx = idb.transaction('databases', 'readwrite');
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
  const tx = idb.transaction('databases', 'readwrite');
  const store = tx.objectStore('databases');
  const databases = await store.getAll();
  await tx.done;
  return databases;
}

export async function getRowsByDatabaseIdFromIndexedDb<
  Db extends Database<Property[]>,
>(databaseId: string, idb: SwotionIDB): Promise<Db['rows']> {
  const rows = await idb.getAllFromIndex('rows', 'databaseId', databaseId);

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

export async function addRowToIndexedDb<Db extends Database<Property[]>>(
  row: Db['rows'][number],
  idb: SwotionIDB,
): Promise<void> {
  const tx = idb.transaction('rows', 'readwrite');
  const store = tx.objectStore('rows');
  await store.add(row);
  await tx.done;
}

export async function editPartialDatabaseInIndexedDb(
  partialDatabase: PartialDatabase,
  idb: SwotionIDB,
): Promise<void> {
  const tx = idb.transaction('databases', 'readwrite');
  const store = tx.objectStore('databases');
  await store.put(partialDatabase, partialDatabase.id);
  await tx.done;
}

export async function editRowInIndexedDb<Db extends Database<Property[]>>(
  row: Db['rows'][number],
  idb: SwotionIDB,
): Promise<void> {
  const tx = idb.transaction('rows', 'readwrite');
  const store = tx.objectStore('rows');
  await store.put(row);
  await tx.done;
}

export async function reorderRowInIndexedDb(
  rowToReorder: AnyRow,
  rowToFlip: AnyRow | undefined,
  idb: SwotionIDB,
): Promise<void> {
  if (rowToReorder && rowToFlip) {
    const tx = idb.transaction('rows', 'readwrite');
    const store = tx.objectStore('rows');
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
    const tx = idb.transaction('rows', 'readwrite');
    const store = tx.objectStore('rows');

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
  Db extends Database<Property[]>,
>(position: string, idb: SwotionIDB): Promise<Db['rows'][number]> {
  const row = await idb.getFromIndex('rows', 'position', position);

  if (!row) {
    throw new Error('Row not found');
  }

  return row;
}

export async function getRowByIdFromIndexedDb<Db extends Database<Property[]>>(
  id: string,
  idb: SwotionIDB,
): Promise<Db['rows'][number] | null> {
  return (await idb.getFromIndex('rows', 'id', id)) || null;
}

export async function deleteRowByIdFromIndexedDb(
  id: string,
  idb: SwotionIDB,
): Promise<void> {
  const tx = idb.transaction('rows', 'readwrite');
  const store = tx.objectStore('rows');
  await store.delete(id);
  await tx.done;
}

export async function addPropertyToIndexedDb<Db extends Database<Property[]>>(
  property: Omit<Db['properties'][number], 'index'>,
  idb: SwotionIDB,
): Promise<void> {
  const tx = idb.transaction('properties', 'readwrite');
  const store = tx.objectStore('properties');
  const untypedProperty = {
    ...property,
    type: getStringFromPropertyType(property.type),
  };
  await store.add(untypedProperty);
  await tx.done;
}

export async function editPropertyInIndexedDb<Db extends Database<Property[]>>(
  property: Db['properties'][number],
  idb: SwotionIDB,
): Promise<void> {
  const tx = idb.transaction('properties', 'readwrite');
  const store = tx.objectStore('properties');
  const untypedProperty = {
    ...property,
    type: getStringFromPropertyType(property.type),
  };
  await store.put(untypedProperty);
  await tx.done;
}
