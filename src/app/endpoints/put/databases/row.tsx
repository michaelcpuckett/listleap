import {
  ExpressWorkerRequest,
  ExpressWorkerResponse,
} from '@express-worker/app';
import { handleRequest } from 'middleware/index';
import { guardIsChecklistRow, guardIsTableRow } from 'shared/assertions';
import { formatPropertyValueFromFormData } from 'shared/formatPropertyValueFromFormData';
import { AnyProperty, Database } from 'shared/types';
import {
  editRowInIndexedDb,
  getDatabaseFromIndexedDb,
  getIdb,
  getRowByPositionFromIndexedDb,
  reorderRowInIndexedDb,
} from 'utilities/idb';

export async function PutDatabaseRow(
  req: ExpressWorkerRequest,
  res: ExpressWorkerResponse,
) {
  return handleRequest(async (req, res) => {
    if (req.data._method !== 'PUT') {
      return;
    }

    const idb = await getIdb();
    const databaseId = req.params.databaseId || '';
    const database: Database<AnyProperty[]> | null =
      await getDatabaseFromIndexedDb(databaseId, idb);

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

    const rowToPut = {
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

      rowToPut[property.id] = formDataValue;
    }

    if (
      !(
        guardIsChecklistRow(rowToPut, database) ||
        guardIsTableRow(rowToPut, database)
      )
    ) {
      idb.close();
      res.status(404).text('Not found').end();
      return;
    }

    if (guardIsChecklistRow(rowToPut, database)) {
      rowToPut.completed = req.data.completed === 'on';
    }

    if (req.data.position && req.data.position !== existingRow.position) {
      const rowToReorder = await getRowByPositionFromIndexedDb(
        req.data.position,
        databaseId,
        idb,
      );
      await reorderRowInIndexedDb(existingRow, rowToReorder, idb);
      rowToPut.position = req.data.position;
    }

    await editRowInIndexedDb<typeof database>(rowToPut, idb);

    idb.close();

    const redirectUrl = new URL(
      req.data._redirect || `/databases/${databaseId}`,
      new URL(req.url).origin,
    );

    res.redirect(redirectUrl.href);
  })(req, res);
}
