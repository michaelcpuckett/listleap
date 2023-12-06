import {
  ExpressWorkerRequest,
  ExpressWorkerResponse,
} from '@express-worker/app';
import { Property } from 'shared/types';
import {
  getIdb,
  getDatabaseFromIndexedDb,
  editPropertyInIndexedDb,
  getPropertyTypeFromString,
  reorderPropertyInIndexedDb,
  getPropertyByPositionFromIndexedDb,
} from 'utilities/idb';
import { AdditionalRequestProperties } from '../../../middleware';

export async function PutDatabaseProperty(
  req: ExpressWorkerRequest & AdditionalRequestProperties,
  res: ExpressWorkerResponse,
) {
  if (req.data._method !== 'PUT') {
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

  const propertyId = req.params.id || '';
  const property = database.properties.find(
    (property) => property.id === propertyId,
  );

  if (!property) {
    idb.close();
    res.status = 404;
    res.text('Not found');
    return;
  }

  const updatedPropertyType = getPropertyTypeFromString(
    typeof req.data.type === 'string' ? database.type : database.name,
  );

  const updatedProperty: Property<typeof updatedPropertyType> = {
    position: property.position,
    id: property.id,
    databaseId: database.id,
    type: updatedPropertyType,
    name: typeof req.data.name === 'string' ? req.data.name : property.name,
  };

  if (req.data.position !== undefined) {
    const propertyToReorder = await getPropertyByPositionFromIndexedDb(
      req.data.position,
      databaseId,
      idb,
    );

    await reorderPropertyInIndexedDb(updatedProperty, propertyToReorder, idb);

    updatedProperty.position = req.data.position;
  }

  await editPropertyInIndexedDb(updatedProperty, idb);
  idb.close();

  const redirectUrl = new URL(
    req.data._redirect || `/databases/${databaseId}`,
    new URL(req.url).origin,
  );

  res.redirect(redirectUrl.href);
}
