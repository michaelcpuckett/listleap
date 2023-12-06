import {
  getIdb,
  getDatabaseFromIndexedDb,
  deletePropertyByIdFromIndexedDb,
} from 'utilities/idb';
import { Referrer, NormalizedFormData } from 'shared/types';
import {
  ExpressWorkerRequest,
  ExpressWorkerResponse,
} from '@express-worker/app';
import { AdditionalRequestProperties } from '../../../middleware';

export async function DeleteDatabaseProperty(
  req: ExpressWorkerRequest & AdditionalRequestProperties,
  res: ExpressWorkerResponse,
) {
  if (req.data._method !== 'DELETE') {
    return;
  }

  const idb = await getIdb();
  const databaseId = req.params.databaseId || '';
  const id = req.params.id || '';
  const database = await getDatabaseFromIndexedDb(databaseId, idb);

  if (!database) {
    idb.close();
    res.status = 404;
    res.body = 'Not found';
    return;
  }

  await deletePropertyByIdFromIndexedDb(id, databaseId, idb);
  idb.close();

  const redirectUrl = new URL(
    req.data._redirect || `/databases/${databaseId}`,
    new URL(req.url).origin,
  );

  res.redirect(redirectUrl.href);
}
