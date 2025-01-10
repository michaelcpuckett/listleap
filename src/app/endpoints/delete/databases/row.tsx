import {
  ExpressWorkerRequest,
  ExpressWorkerResponse,
} from '@express-worker/app';
import { handleRequest } from 'middleware/index';
import {
  deleteRowByIdFromIndexedDb,
  getDatabaseFromIndexedDb,
  getIdb,
} from 'utilities/idb';

export async function DeleteDatabaseRow(
  req: ExpressWorkerRequest,
  res: ExpressWorkerResponse,
) {
  return handleRequest(async (req, res) => {
    if (req.data._method !== 'DELETE') {
      return;
    }

    const idb = await getIdb();
    const databaseId = req.params.databaseId || '';
    const id = req.params.id || '';
    const database = await getDatabaseFromIndexedDb(databaseId, idb);

    if (!database) {
      idb.close();
      res.status(404).text('Not found').end();
      return;
    }

    await deleteRowByIdFromIndexedDb(id, databaseId, idb);
    idb.close();

    const redirectUrl = new URL(
      req.data._redirect || `/databases/${databaseId}`,
      new URL(req.url).origin,
    );

    res.redirect(redirectUrl.href);
  })(req, res);
}
