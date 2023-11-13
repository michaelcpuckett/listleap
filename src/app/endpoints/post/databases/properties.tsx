import { UntypedProperty, Referrer } from "shared/types";
import { getIdb, addUntypedPropertyToIndexedDb } from "utilities/idb";
import { getUniqueId } from 'shared/getUniqueId';

export async function PostDatabaseProperties(event: FetchEvent, match: RegExpExecArray|null, formData: Record<string, string>, referrer: Referrer) {
  const idb = await getIdb();
  const databaseId = match?.[1] || '';
  
  const propertyToAdd: UntypedProperty = {
    index: -1,
    id: getUniqueId(),
    databaseId,
    name: formData.name,
    type: formData.type,
  };

  await addUntypedPropertyToIndexedDb(propertyToAdd, idb);

  const redirectUrl = new URL(formData._redirect || `/databases/${databaseId}`, new URL(event.request.url).origin);

  return Response.redirect(redirectUrl.href, 303);
}