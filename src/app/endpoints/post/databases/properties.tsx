import {
  getIdb,
  addPropertyToIndexedDb,
  getPropertyTypeFromString,
  getDatabaseFromIndexedDb,
} from 'utilities/idb';
import { getUniqueId } from 'shared/getUniqueId';
import { ERROR_CODES } from 'utilities/errors';
import { guardIsProperty } from 'shared/assertions';
import {
  ExpressWorkerRequest,
  ExpressWorkerResponse,
} from '@express-worker/app';
import { AdditionalRequestProperties } from '../../../middleware';

export async function PostDatabaseProperties(
  req: ExpressWorkerRequest & AdditionalRequestProperties,
  res: ExpressWorkerResponse,
) {
  if (req.data._method !== 'POST') {
    return;
  }

  const idb = await getIdb();
  const databaseId = req.params.databaseId;

  const database = await getDatabaseFromIndexedDb(databaseId, idb);

  if (!database) {
    idb.close();
    const redirectUrl = new URL(req.ref.url);
    redirectUrl.searchParams.set('error', ERROR_CODES['DATABASE_NOT_FOUND']);
    res.redirect(redirectUrl.href);
    return;
  }

  const propertyToAddType = getPropertyTypeFromString(
    req.data.type || 'string',
  );

  const propertyToAdd = {
    id: getUniqueId(),
    databaseId,
    name: req.data.name || '',
    type: propertyToAddType,
    position: req.data.position,
  };

  if (propertyToAdd.position === undefined) {
    delete propertyToAdd.position;
  }

  if (!guardIsProperty(propertyToAdd)) {
    idb.close();
    const url = new URL(req.ref.url);
    url.searchParams.set('error', 'Invalid property');

    res.redirect(url.href);
    return;
  }

  await addPropertyToIndexedDb<typeof database>(propertyToAdd, idb);
  idb.close();

  const redirectUrl = new URL(
    req.data._redirect || `/databases/${databaseId}`,
    new URL(req.url).origin,
  );

  res.redirect(redirectUrl.href);
}
