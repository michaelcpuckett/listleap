import {
  ExpressWorkerRequest,
  ExpressWorkerResponse,
} from '@express-worker/app';
import { Referrer, NormalizedFormData } from 'shared/types';
import { getIdb, saveSettingsToIndexedDb } from 'utilities/idb';
import { AdditionalRequestProperties } from '../../middleware';

export async function PatchSettings(
  req: ExpressWorkerRequest & AdditionalRequestProperties,
  res: ExpressWorkerResponse,
) {
  if (req.data._method !== 'PATCH') {
    return;
  }

  const idb = await getIdb();
  const theme = req.data.theme || '';
  const VALID_THEMES = ['light', 'dark'];

  if (!VALID_THEMES.includes(theme)) {
    idb.close();
    res.status = 404;
    res.body = 'Not found';
    return;
  }

  await saveSettingsToIndexedDb({ theme }, idb);

  idb.close();

  const url = new URL(req.referrer);

  res.redirect(url.href);
}
