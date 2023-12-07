import {
  ExpressWorkerRequest,
  ExpressWorkerResponse,
} from '@express-worker/app';
import { PartialDatabase } from 'shared/types';
import {
  getIdb,
  getDatabaseFromIndexedDb,
  editPartialDatabaseInIndexedDb,
} from 'utilities/idb';
import { handleRequest } from '../../../middleware';

export async function PatchDatabase(
  req: ExpressWorkerRequest,
  res: ExpressWorkerResponse,
) {
  return handleRequest(async (req, res) => {
    if (req.data._method !== 'PATCH') {
      return;
    }

    const idb = await getIdb();
    const databaseId = req.params.databaseId || '';
    const database = await getDatabaseFromIndexedDb(databaseId, idb);

    if (!database) {
      idb.close();
      res.status = 404;
      res.text('Not found');
      return;
    }

    const updatedDatabase: PartialDatabase = {
      id: database.id,
      type: database.type,
      name: typeof req.data.name === 'string' ? req.data.name : database.name,
    };

    await editPartialDatabaseInIndexedDb(updatedDatabase, idb);
    idb.close();

    res.redirect(req.url);
  })(req, res);
}
