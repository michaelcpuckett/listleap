import { Referrer, NormalizedFormData } from 'shared/types';
import { getIdb, saveSettingsToIndexedDb } from 'utilities/idb';

export async function PatchSettings(
  event: FetchEvent,
  match: RegExpExecArray | null,
  formData: NormalizedFormData,
  referrer: Referrer,
) {
  const idb = await getIdb();
  const theme = formData.theme || '';
  const VALID_THEMES = ['light', 'dark'];

  if (!VALID_THEMES.includes(theme)) {
    idb.close();
    return new Response('Not found', {
      status: 404,
    });
  }

  await saveSettingsToIndexedDb({ theme }, idb);

  idb.close();

  const url = new URL(event.request.referrer);

  return new Response(null, {
    headers: {
      Location: url.href,
    },
    status: 303,
  });
}
