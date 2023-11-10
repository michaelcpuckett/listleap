import { DBSchema, IDBPDatabase, wrap } from "idb";
import {
  Database,
  PartialDatabase,
  Property,
  UntypedProperty,
  Row,
  Settings,
} from "../../shared/types";

interface SwotionSchema extends DBSchema {
  databases: {
    key: string;
    value: PartialDatabase;
  };
  rows: {
    key: string;
    value: Row<Property[]>;
  };
  settings: {
    key: string;
    value: keyof Settings;
  };
  properties: {
    key: string;
    value: UntypedProperty;
  };
}

export type SwotionIDB = IDBPDatabase<SwotionSchema>;

export async function getIdb(): Promise<SwotionIDB> {
  return await new Promise((resolve) => {
    const openRequest = self.indexedDB.open("swotion", 2);

    openRequest.addEventListener("success", () => {
      const wrappedIdb = wrap(openRequest.result) as SwotionIDB;
      resolve(wrappedIdb);
    });

    openRequest.addEventListener("upgradeneeded", () => {
      openRequest.result.createObjectStore("databases");
      openRequest.result.createObjectStore("rows");
      openRequest.result.createObjectStore("settings");
      openRequest.result.createObjectStore("properties");
    });

    openRequest.addEventListener("error", (event) => {
      console.error(event);
    });
  });
}

export async function getSettingsFromIndexedDb(
  idb: SwotionIDB
): Promise<Settings> {
  const tx = idb.transaction("settings", "readwrite");
  const store = tx.objectStore("settings");
  const theme = (await store.get("theme")) || "";
  return { theme };
}

function getTypeFromString(type: string) {
  switch (type) {
    case "Number":
      return Number;
    case "Boolean":
      return Boolean;
    case "String":
    default:
      return String;
  }
}

export async function getPropertiesFromIndexedDb<
  Db extends Database<Property[]>
>(databaseId: string, idb: SwotionIDB): Promise<Db["properties"]> {
  const tx = idb.transaction("properties", "readwrite");
  const store = tx.objectStore("properties");
  const allUntypedProperties = await store.getAll();
  const filteredUntypedProperties = allUntypedProperties.filter(
    (property) => property.databaseId === databaseId
  );

  if (filteredUntypedProperties.length) {
    return filteredUntypedProperties.map(
      (untypedProperty): Property => ({
        ...untypedProperty,
        type: getTypeFromString(untypedProperty.type),
      })
    );
  }

  return [];
}

export async function addPartialDatabaseToIndexedDb(
  partialDatabase: PartialDatabase,
  idb: SwotionIDB
): Promise<void> {
  const tx = idb.transaction("databases", "readwrite");
  const store = tx.objectStore("databases");
  const { id, name, type } = partialDatabase;
  await store.add(
    {
      id,
      name,
      type,
    },
    partialDatabase.id
  );
  await tx.done;
}

export async function saveSettingsToIndexedDb(
  settings: Settings,
  idb: SwotionIDB
): Promise<void> {
  const tx = idb.transaction("settings", "readwrite");
  const store = tx.objectStore("settings");
  for (const key in settings) {
    await store.put(settings[key], key);
  }
  await tx.done;
}

export async function getDatabaseFromIndexedDb<Db extends Database<Property[]>>(
  id: string,
  idb: SwotionIDB
): Promise<Database<Property[]> | null> {
  const tx = idb.transaction("databases", "readwrite");
  const store = tx.objectStore("databases");
  const database = await store.get(id);

  if (!database) {
    return null;
  }

  const rows = await getRowsFromIndexedDb<Db>(id, idb);
  const properties = await getPropertiesFromIndexedDb<Db>(id, idb);

  return {
    ...database,
    rows,
    properties,
  };
}

export async function getPartialDatabasesFromIndexedDb(
  idb: SwotionIDB
): Promise<PartialDatabase[]> {
  const tx = idb.transaction("databases", "readwrite");
  const store = tx.objectStore("databases");
  const databases = await store.getAll();
  return databases;
}

export async function getRowsFromIndexedDb<Db extends Database<Property[]>>(
  id: string,
  idb: SwotionIDB
): Promise<Db["rows"]> {
  const tx = idb.transaction("rows", "readwrite");
  const store = tx.objectStore("rows");
  const rows = await store.getAll();
  return rows.filter((row) => row.databaseId === id);
}

export async function addRowToIndexedDb<Db extends Database<Property[]>>(
  row: Db["rows"][number],
  idb: SwotionIDB
): Promise<void> {
  const tx = idb.transaction("rows", "readwrite");
  const store = tx.objectStore("rows");
  await store.add(row, row.id);
  await tx.done;
}

export async function editPartialDatabaseInIndexedDb(
  partialDatabase: PartialDatabase,
  idb: SwotionIDB
): Promise<void> {
  const tx = idb.transaction("databases", "readwrite");
  const store = tx.objectStore("databases");
  await store.put(partialDatabase, partialDatabase.id);
  await tx.done;
}

export async function editRowInIndexedDb<Db extends Database<Property[]>>(
  row: Db["rows"][number],
  idb: SwotionIDB
): Promise<void> {
  const tx = idb.transaction("rows", "readwrite");
  const store = tx.objectStore("rows");
  await store.put(row, row.id);
  await tx.done;
}

export async function deleteRowFromIndexedDb(
  id: string,
  idb: SwotionIDB
): Promise<void> {
  const tx = idb.transaction("rows", "readwrite");
  const store = tx.objectStore("rows");
  await store.delete(id);
  await tx.done;
}

export async function addUntypedPropertyToIndexedDB(
  untypedProperty: UntypedProperty,
  idb: SwotionIDB
): Promise<void> {
  const tx = idb.transaction("properties", "readwrite");
  const store = tx.objectStore("properties");
  await store.add(untypedProperty, untypedProperty.id);
  await tx.done;
}

export async function editUntypedPropertyInIndexedDB(
  untypedProperty: UntypedProperty,
  idb: SwotionIDB
): Promise<void> {
  const tx = idb.transaction("properties", "readwrite");
  const store = tx.objectStore("properties");
  await store.put(untypedProperty, untypedProperty.id);
  await tx.done;
}
