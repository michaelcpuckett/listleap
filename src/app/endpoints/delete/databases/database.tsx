import {
  getIdb,
  getDatabaseFromIndexedDb,
  deleteDatabaseByIdFromIndexedDb,
} from 'utilities/idb';
import {
  ExpressWorkerRequest,
  ExpressWorkerResponse,
} from '@express-worker/app';
import { AdditionalRequestProperties } from '../../../middleware';

export async function DeleteDatabase(
  req: ExpressWorkerRequest & AdditionalRequestProperties,
  res: ExpressWorkerResponse,
) {
  if (req.data._method !== 'DELETE') {
    return;
  }

  const idb = await getIdb();
  const databaseId = req.params.databaseId || '';
  const database = await getDatabaseFromIndexedDb(databaseId, idb);
  idb.close();

  if (!database) {
    res.status = 404;
    res.body = 'Not found';
    return;
  }

  await deleteDatabaseByIdFromIndexedDb(databaseId);

  const redirectUrl = new URL(
    req.data._redirect || `/`,
    new URL(req.url).origin,
  );

  res.redirect(redirectUrl.href);
}
