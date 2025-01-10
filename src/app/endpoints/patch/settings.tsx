import {
  ExpressWorkerRequest,
  ExpressWorkerResponse,
} from '@express-worker/app';
import { handleRequest } from 'middleware/index';
import { getIdb, saveSettingsToIndexedDb } from 'utilities/idb';

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
      res.status(404).text('Not found').end();
      return;
    }

    await saveSettingsToIndexedDb({ theme }, idb);

    idb.close();

    const url = new URL(req.url);

    res.redirect(url.href);
  })(req, res);
}
