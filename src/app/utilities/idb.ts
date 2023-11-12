import { DBSchema, IDBPDatabase, wrap } from "idb";
import {
  Database,
  PartialDatabase,
  Property,
  UntypedProperty,
  Row,
  Settings,
} from "../../shared/types";
import { ID } from "yjs";

interface SwotionSchema extends DBSchema {
  databases: {
    key: string;
    value: PartialDatabase;
  };
  rows: {
    key: number;
    value: Row<Property[]>;
    keyPath: "index";
    indexes: { id: string; databaseId: string };
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
      const rowsObjectStore = openRequest.result.createObjectStore("rows", {
        keyPath: "index",
        autoIncrement: true,
      });

      rowsObjectStore.createIndex("id", "id", { unique: true });
      rowsObjectStore.createIndex("databaseId", "databaseId", {
        unique: false,
      });

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

export async function getPropertiesByDatabaseIdFromIndexedDb<
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

  const rows = await getRowsByDatabaseIdFromIndexedDb<Db>(id, idb);
  const properties = await getPropertiesByDatabaseIdFromIndexedDb<Db>(id, idb);

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

export async function getRowsByDatabaseIdFromIndexedDb<
  Db extends Database<Property[]>
>(databaseId: string, idb: SwotionIDB): Promise<Db["rows"]> {
  const rows = await idb.getAllFromIndex("rows", "databaseId", databaseId);

  if (!rows.length) {
    return [];
  }

  return rows;
}

export async function addRowToIndexedDb<Db extends Database<Property[]>>(
  row: Db["rows"][number],
  idb: SwotionIDB
): Promise<void> {
  const tx = idb.transaction("rows", "readwrite");
  const store = tx.objectStore("rows");
  await store.add(row);
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
  await store.put(row);
  await tx.done;
}

export async function reorderRowInIndexedDb(
  oldIndex: number,
  newIndex: number,
  idb: SwotionIDB
): Promise<void> {
  const tx = idb.transaction("rows", "readwrite");
  const store = tx.objectStore("rows");
  const rowToReorder = await store.get(oldIndex);
  const rowToFlip = await store.get(newIndex);

  if (!rowToReorder) {
    throw new Error("Row to reorder not found");
  }

  if (rowToFlip) {
    await store.delete(oldIndex);
  }

  await store.delete(newIndex);

  if (rowToReorder) {
    rowToReorder.index = newIndex;
    await store.put(rowToReorder);
  }

  if (rowToFlip) {
    rowToFlip.index = oldIndex;
    await store.put(rowToFlip);
  }

  await tx.done;
}

async function getRowByIdFromIndexedDb<Db extends Database<Property[]>>(
  id: string,
  idb: SwotionIDB
): Promise<Db["rows"][number]> {
  const [row] = await idb.getAllFromIndex("rows", "id", id);

  if (!row) {
    throw new Error("Row not found");
  }

  return row;
}

export async function deleteRowByIdFromIndexedDb(
  id: string,
  idb: SwotionIDB
): Promise<void> {
  const existingRow = await getRowByIdFromIndexedDb(id, idb);
  await deleteRowByIndexFromIndexedDb(existingRow.index, idb);
}

export async function deleteRowByIndexFromIndexedDb(
  index: number,
  idb: SwotionIDB
): Promise<void> {
  const tx = idb.transaction("rows", "readwrite");
  const store = tx.objectStore("rows");
  await store.delete(index);
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
