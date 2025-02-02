import {
  ExpressWorkerRequest,
  ExpressWorkerResponse,
} from '@express-worker/app';
import { handleRequest } from 'middleware/index';
import {
  deleteDatabaseByIdFromIndexedDb,
  getDatabaseFromIndexedDb,
  getIdb,
} from 'utilities/idb';

export async function DeleteDatabase(
  req: ExpressWorkerRequest,
  res: ExpressWorkerResponse,
) {
  return handleRequest(async (req, res) => {
    if (req.data._method !== 'DELETE') {
      return;
    }

    const idb = await getIdb();
    const databaseId = req.params.databaseId || '';
    const database = await getDatabaseFromIndexedDb(databaseId, idb);
    idb.close();

    if (!database) {
      res.status(404).text('Not found');
      return;
    }

    await deleteDatabaseByIdFromIndexedDb(databaseId);

    const redirectUrl = new URL(
      req.data._redirect || `/`,
      new URL(req.url).origin,
    );

    res.redirect(redirectUrl.href);
  })(req, res);
}
