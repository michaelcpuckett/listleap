import { addPropertyToIndexedDb, getIdb } from 'utilities/idb';
import { getUniqueId } from 'shared/getUniqueId';
import { addPartialDatabaseToIndexedDb } from 'utilities/idb';
import { assertIsDatabase } from 'shared/assertions';
import { Referrer, NormalizedFormData, Property } from 'shared/types';
import { unwrap, wrap } from 'idb';

export async function PostDatabase(
  event: FetchEvent,
  match: RegExpExecArray | null,
  formData: NormalizedFormData,
  referrer: Referrer,
) {
  const id = getUniqueId();

  const partialDatabase = {
    id,
    type: formData.type,
    name: formData.name || '',
    properties: [],
    rows: [],
  };

  assertIsDatabase(partialDatabase);

  await new Promise(async (resolveMain, rejectMain) => {
    const rawDb: IDBDatabase = await new Promise(async (resolve, reject) => {
      const version = await self.indexedDB.databases().then((databases) => {
        const database = databases.find(
          (database) => database.name === 'listleap',
        );

        return database?.version || 1;
      });

      const openRequest = self.indexedDB.open('listleap', version + 1);

      openRequest.addEventListener('success', () => {
        openRequest.result.onabort = () => {
          rejectMain(void 0);
        };

        openRequest.result.onerror = () => {
          rejectMain(void 0);
        };

        resolve(openRequest.result);
      });

      openRequest.addEventListener('upgradeneeded', () => {
        const rowsObjectStore = openRequest.result.createObjectStore(
          `rows--${id}`,
          {
            keyPath: 'id',
            autoIncrement: false,
          },
        );
        rowsObjectStore.createIndex('id', 'id', { unique: true });
        rowsObjectStore.createIndex('position', 'position', { unique: true });

        const propertiesObjectStore = openRequest.result.createObjectStore(
          `properties--${id}`,
          {
            keyPath: 'id',
            autoIncrement: false,
          },
        );
        propertiesObjectStore.createIndex('id', 'id', { unique: true });
        propertiesObjectStore.createIndex('position', 'position', {
          unique: true,
        });
      });

      openRequest.addEventListener('error', (event) => {
        reject(event);
      });

      openRequest.addEventListener('blocked', (event) => {
        console.log('blocked', event);
        reject(event);
      });
    });

    const tx = rawDb.transaction('databases', 'readwrite');
    const store = tx.objectStore('databases');
    store.add(
      {
        id: partialDatabase.id,
        name: partialDatabase.name,
        type: partialDatabase.type,
      },
      partialDatabase.id,
    );
    tx.addEventListener('complete', () => {
      rawDb.close();
      resolveMain(void 0);
    });
    tx.addEventListener('error', () => {
      rejectMain(void 0);
    });
    tx.addEventListener('abort', () => {
      rejectMain(void 0);
    });
    tx.commit();
  });

  const titleProperty: Omit<Property<StringConstructor>, 'position'> = {
    id: 'title',
    name: 'Title',
    databaseId: id,
    type: String,
  };

  const idb = await getIdb();

  await addPropertyToIndexedDb(titleProperty, idb);

  idb.close();

  const databaseUrl = `/databases/${id}`;
  const url = new URL(databaseUrl, new URL(event.request.url).origin);

  return Response.redirect(url.href, 303);
}
