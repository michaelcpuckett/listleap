import {
  ExpressWorkerRequest,
  ExpressWorkerResponse,
} from '@express-worker/app';
import { handleRequest } from 'middleware/index';
import { guardIsChecklistRow, guardIsTableRow } from 'shared/assertions';
import { formatPropertyValueFromFormData } from 'shared/formatPropertyValueFromFormData';
import {
  editRowInIndexedDb,
  getDatabaseFromIndexedDb,
  getIdb,
  getRowByPositionFromIndexedDb,
  reorderRowInIndexedDb,
} from 'utilities/idb';

export async function PatchDatabaseRow(
  req: ExpressWorkerRequest,
  res: ExpressWorkerResponse,
) {
  return handleRequest(async (req, res) => {
    if (req.data._method !== 'PATCH') {
      return;
    }

    const idb = await getIdb();
    const databaseId = req.params.databaseId || '';
    const database = await getDatabaseFromIndexedDb(databaseId, idb);

    if (!database) {
      idb.close();
      res.status(404).text('Not found').end();
      return;
    }

    const id = req.params.id || '';
    const existingRow = database.rows.find((row) => row.id === id);

    if (!existingRow) {
      idb.close();
      res.status(404).text('Not found').end();
      return;
    }

    const rowToPatch = {
      id: existingRow.id,
      position: existingRow.position,
      databaseId: database.id,
    };

    for (const property of database.properties) {
      const formDataValue = formatPropertyValueFromFormData<typeof property>(
        req.data[property.id] ?? existingRow[property.id],
        property,
      );

      if (formDataValue === undefined) {
        continue;
      }

      rowToPatch[property.id] = formDataValue;
    }

    if (
      !(
        guardIsChecklistRow(rowToPatch, database) ||
        guardIsTableRow(rowToPatch, database)
      )
    ) {
      idb.close();
      res.status(404).text('Not found').end();
      return;
    }

    if (req.data.position !== undefined) {
      const rowToReorder = await getRowByPositionFromIndexedDb(
        req.data.position,
        databaseId,
        idb,
      );
      await reorderRowInIndexedDb(existingRow, rowToReorder, idb);
      rowToPatch.position = req.data.position;
    }

    await editRowInIndexedDb<typeof database>(rowToPatch, idb);
    idb.close();

    const redirectUrl = new URL(
      req.data._redirect || `/databases/${databaseId}`,
      new URL(req.url).origin,
    );
    redirectUrl.search = new URL(req.url).search;

    res.redirect(redirectUrl.href);
  })(req, res);
}
