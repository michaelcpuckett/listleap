import {
  ExpressWorkerRequest,
  ExpressWorkerResponse,
} from '@express-worker/app';
import { handleRequest } from 'middleware/index';
import { Property } from 'shared/types';
import {
  editPropertyInIndexedDb,
  getDatabaseFromIndexedDb,
  getIdb,
  getPropertyByPositionFromIndexedDb,
  getPropertyTypeFromString,
  reorderPropertyInIndexedDb,
} from 'utilities/idb';

export async function PatchDatabaseProperty(
  req: ExpressWorkerRequest,
  res: ExpressWorkerResponse,
) {
  return handleRequest(async (req, res) => {
    if (req.data._method !== 'PATCH') {
      return;
    }

    const idb = await getIdb();
    const databaseId = req.params.databaseId || '';
    const propertyId = req.params.id || '';
    const database = await getDatabaseFromIndexedDb(databaseId, idb);

    if (!database) {
      idb.close();
      res.status(404).text('Not found').end();
      return;
    }

    const property = database.properties.find(
      (property) => property.id === propertyId,
    );

    if (!property) {
      idb.close();
      res.status(404).text('Not found').end();
      return;
    }

    const updatedPropertyType = getPropertyTypeFromString(database.type);

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
  })(req, res);
}
