import { PartialProperty, Referrer, Property } from 'shared/types';
import {
  getIdb,
  addPropertyToIndexedDb,
  getTypeFromString,
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

  const propertyToAdd: PartialProperty = {
    id: getUniqueId(),
    databaseId,
    name: formData.name,
    type: getTypeFromString(formData.type),
  };

  function guardIsValidProperty(property: unknown): property is Property {
    const hasName =
      typeof (property as Property).name === 'string' &&
      !!(property as Property).name.length;
    const hasType = [String, Number, Boolean].includes(
      (property as Property).type,
    );

    return hasName && hasType;
  }

  if (!guardIsValidProperty(propertyToAdd)) {
    const redirectUrl = new URL(referrer.url);
    redirectUrl.searchParams.set('error', ERROR_CODES['INVALID_PROPERTY']);
    return Response.redirect(redirectUrl.href, 303);
  }

  await addPropertyToIndexedDb<typeof database>(propertyToAdd, idb);

  const redirectUrl = new URL(
    formData._redirect || `/databases/${databaseId}`,
    new URL(event.request.url).origin,
  );

  return Response.redirect(redirectUrl.href, 303);
}
