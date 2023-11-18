import {
  Referrer,
  NormalizedFormData,
  PartialDatabase,
  Property,
} from 'shared/types';
import {
  getIdb,
  getDatabaseFromIndexedDb,
  editPropertyInIndexedDb,
  getPropertyTypeFromString,
  reorderPropertyInIndexedDb,
  getPropertyByPositionFromIndexedDb,
} from 'utilities/idb';

export async function PutDatabaseProperty(
  event: FetchEvent,
  match: RegExpExecArray | null,
  formData: NormalizedFormData,
  referrer: Referrer,
) {
  const idb = await getIdb();
  const propertyId = match?.[1] || '';
  const databaseId = match?.[2] || '';
  const database = await getDatabaseFromIndexedDb(databaseId, idb);

  if (!database) {
    idb.close();
    return new Response('Not found', {
      status: 404,
    });
  }

  const property = database.properties.find(
    (property) => property.id === propertyId,
  );

  if (!property) {
    idb.close();
    return new Response('Not found', {
      status: 404,
    });
  }

  const updatedPropertyType = getPropertyTypeFromString(
    typeof formData.type === 'string' ? database.type : database.name,
  );

  const updatedProperty: Property<typeof updatedPropertyType> = {
    position: property.position,
    id: property.id,
    databaseId: database.id,
    type: updatedPropertyType,
    name: typeof formData.name === 'string' ? formData.name : property.name,
  };

  if (formData.position !== undefined) {
    const propertyToReorder = await getPropertyByPositionFromIndexedDb(
      formData.position,
      databaseId,
      idb,
    );

    await reorderPropertyInIndexedDb(updatedProperty, propertyToReorder, idb);

    updatedProperty.position = formData.position;
  }

  await editPropertyInIndexedDb(updatedProperty, idb);
  idb.close();

  const redirectUrl = new URL(
    formData._redirect || `/databases/${databaseId}`,
    new URL(event.request.url).origin,
  );

  return Response.redirect(redirectUrl.href, 303);
}
