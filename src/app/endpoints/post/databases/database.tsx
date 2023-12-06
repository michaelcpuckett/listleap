import {
  addBlankRowToIndexedDb,
  addPropertyToIndexedDb,
  deleteDatabaseByIdFromIndexedDb,
  getDatabaseFromIndexedDb,
  getIdb,
} from 'utilities/idb';
import { getUniqueId } from 'shared/getUniqueId';
import { addPartialDatabaseToIndexedDb } from 'utilities/idb';
import { assertIsDatabase } from 'shared/assertions';
import { Property } from 'shared/types';
import {
  ExpressWorkerRequest,
  ExpressWorkerResponse,
} from '@express-worker/app';
import { AdditionalRequestProperties } from '../../../middleware';

export async function PostDatabase(
  req: ExpressWorkerRequest & AdditionalRequestProperties,
  res: ExpressWorkerResponse,
) {
  if (req.data._method !== 'POST') {
    return;
  }

  if (req.data.bulkAction !== undefined) {
    if (req.data.bulkAction === 'DELETE') {
      const rowIds = req.data['row[]'] || [];

      for (const databaseId of rowIds) {
        await deleteDatabaseByIdFromIndexedDb(databaseId);
      }

      res.redirect(req.referrer);
      return;
    } else {
      res.status = 404;
      res.body = 'Not found';
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
    res.status = 404;
    res.body = 'Not found';
    return;
  }

  await addBlankRowToIndexedDb(database, idb);
  await addBlankRowToIndexedDb(database, idb);
  await addBlankRowToIndexedDb(database, idb);

  idb.close();

  const databaseUrl = `/databases/${id}`;
  const url = new URL(databaseUrl, new URL(req.url).origin);

  res.redirect(url.href);
}
