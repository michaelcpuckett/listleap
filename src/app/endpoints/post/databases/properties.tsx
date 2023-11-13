import { PartialProperty, Referrer, Property } from 'shared/types';
import {
  getIdb,
  addPropertyToIndexedDb,
  getPropertyTypeFromString,
  getDatabaseFromIndexedDb,
} from 'utilities/idb';
import { getUniqueId } from 'shared/getUniqueId';
import { ERROR_CODES } from 'utilities/errors';

export async function PostDatabaseProperties(
  event: FetchEvent,
  match: RegExpExecArray | null,
  formData: Record<string, string>,
  referrer: Referrer,
) {
  const idb = await getIdb();
  const databaseId = match?.[1] || '';

  const database = await getDatabaseFromIndexedDb(databaseId, idb);

  if (!database) {
    const redirectUrl = new URL(referrer.url);
    redirectUrl.searchParams.set('error', ERROR_CODES['DATABASE_NOT_FOUND']);
    return Response.redirect(redirectUrl.href, 303);
  }

  const propertyToAdd: Omit<Property, 'index'> = {
    id: getUniqueId(),
    databaseId,
    name: formData.name,
    type: getPropertyTypeFromString(formData.type),
  };

  await addPropertyToIndexedDb<typeof database>(propertyToAdd, idb);

  const redirectUrl = new URL(
    formData._redirect || `/databases/${databaseId}/properties`,
    new URL(event.request.url).origin,
  );

  return Response.redirect(redirectUrl.href, 303);
}
