import {
  ExpressWorkerRequest,
  ExpressWorkerResponse,
} from '@express-worker/app';
import { handleRequest } from 'middleware/index';
import { assertIsDatabase } from 'shared/assertions';
import { getUniqueId } from 'shared/getUniqueId';
import { Property } from 'shared/types';
import {
  addBlankRowToIndexedDb,
  addPartialDatabaseToIndexedDb,
  addPropertyToIndexedDb,
  deleteRowByIdFromIndexedDb,
  getDatabaseFromIndexedDb,
  getIdb,
} from 'utilities/idb';

export async function PostDatabase(
  req: ExpressWorkerRequest,
  res: ExpressWorkerResponse,
) {
  return handleRequest(async (req, res) => {
    if (req.data._method !== 'POST') {
      return;
    }

    const databaseId = req.params.databaseId || '';

    if (req.data.bulkAction !== undefined) {
      if (req.data.bulkAction === 'DELETE') {
        const rowIds = req.data['row[]'] || [];

        const idb = await getIdb();

        for (const rowId of rowIds) {
          await deleteRowByIdFromIndexedDb(rowId, databaseId, idb);
        }

        idb.close();

        const redirectUrl = new URL(
          req.data._redirect || `/databases/${databaseId}`,
          new URL(req.url).origin,
        );

        res.redirect(redirectUrl.href);
        return;
      } else {
        res.status(404).text('Not found').end();
        return;
      }
    }

    const id = getUniqueId();

    const partialDatabase = {
      id,
      type: req.data.type,
      name: req.data.name || '',
      properties: [],
      rows: [],
    };

    assertIsDatabase(partialDatabase);

    await addPartialDatabaseToIndexedDb(partialDatabase);

    const titleProperty: Omit<Property<StringConstructor>, 'position'> = {
      id: 'title',
      name: '',
      databaseId: id,
      type: String,
    };

    const idb = await getIdb();

    await addPropertyToIndexedDb(titleProperty, idb);

    const database = await getDatabaseFromIndexedDb(id, idb);

    if (!database) {
      idb.close();
      res.status(404).text('Not found').end();
      return;
    }

    await addBlankRowToIndexedDb(database, idb);
    await addBlankRowToIndexedDb(database, idb);
    await addBlankRowToIndexedDb(database, idb);
    await addBlankRowToIndexedDb(database, idb);
    await addBlankRowToIndexedDb(database, idb);
    await addBlankRowToIndexedDb(database, idb);
    await addBlankRowToIndexedDb(database, idb);
    await addBlankRowToIndexedDb(database, idb);
    await addBlankRowToIndexedDb(database, idb);
    await addBlankRowToIndexedDb(database, idb);

    idb.close();

    const databaseUrl = `/databases/${id}`;
    const url = new URL(databaseUrl, new URL(req.url).origin);

    res.redirect(url.href);
  })(req, res);
}
