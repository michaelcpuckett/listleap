import {
  ExpressWorkerRequest,
  ExpressWorkerResponse,
} from '@express-worker/app';
import { openDB } from 'components/elements/NoteRow';

export async function DeleteNote(
  req: ExpressWorkerRequest,
  res: ExpressWorkerResponse,
) {
  await new Promise(async (resolve, reject) => {
    const db = await openDB();
    const transaction = db.transaction('notes', 'readwrite');
    const store = transaction.objectStore('notes');
    const request = store.delete(req.params.id);
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  })
    .then(() => {
      res.redirect(req.referrer || '/');
    })
    .catch((error) => {
      res.status(500).send({ error: error.message });
    });
}
