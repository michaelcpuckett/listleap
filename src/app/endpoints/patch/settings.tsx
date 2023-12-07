import {
  ExpressWorkerRequest,
  ExpressWorkerResponse,
} from '@express-worker/app';
import { getIdb, saveSettingsToIndexedDb } from 'utilities/idb';
import { handleRequest } from 'middleware/index';

export async function PatchSettings(
  req: ExpressWorkerRequest,
  res: ExpressWorkerResponse,
) {
  return handleRequest(async (req, res) => {
    if (req.data._method !== 'PATCH') {
      return;
    }

    const idb = await getIdb();
    const theme = req.data.theme || '';
    const VALID_THEMES = ['light', 'dark'];

    if (!VALID_THEMES.includes(theme)) {
      idb.close();
      res.status = 404;
      res.text('Not found');
      return;
    }

    await saveSettingsToIndexedDb({ theme }, idb);

    idb.close();

    const url = new URL(req.url);

    res.redirect(url.href);
  })(req, res);
}
