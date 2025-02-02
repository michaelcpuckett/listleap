import {
  ExpressWorkerRequest,
  ExpressWorkerResponse,
} from '@express-worker/app';
import { LexoRank } from 'lexorank';
import { handleRequest } from 'middleware/index';
import { guardIsChecklistRow, guardIsTableRow } from 'shared/assertions';
import { formatPropertyValueFromFormData } from 'shared/formatPropertyValueFromFormData';
import { getUniqueId } from 'shared/getUniqueId';
import {
  addRowToIndexedDb,
  deleteRowByIdFromIndexedDb,
  editRowInIndexedDb,
  getDatabaseFromIndexedDb,
  getIdb,
  getRowByIdFromIndexedDb,
} from 'utilities/idb';

export async function PostDatabaseRows(
  req: ExpressWorkerRequest,
  res: ExpressWorkerResponse,
) {
  return handleRequest(async (req, res) => {
    if (req.data._method !== 'POST') {
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

    if (req.data.bulkAction !== undefined) {
      if (req.data.bulkAction === 'DELETE') {
        const rowIds = req.data['row[]'] || [];

        for (const rowId of rowIds) {
          const row = await getRowByIdFromIndexedDb(rowId, database.id, idb);

          if (!row) {
            continue;
          }

          await deleteRowByIdFromIndexedDb(row.id, database.id, idb);
        }
      } else if (req.data.bulkAction === 'CLEAR') {
        const cellEntries = req.data['cell[]'] || [];

        for (const cellEntry of cellEntries) {
          const [rowId, propertyId] = cellEntry.split(':');
          const existingRow = await getRowByIdFromIndexedDb<typeof database>(
            rowId,
            database.id,
            idb,
          );

          if (!existingRow) {
            continue;
          }

          const rowToPatch = {};

          for (const [key, value] of Object.entries(existingRow)) {
            if (key === propertyId) {
              rowToPatch[key] = '';
            } else {
              rowToPatch[key] = value;
            }
          }

          if (
            !guardIsChecklistRow(rowToPatch, database) &&
            !guardIsTableRow(rowToPatch, database)
          ) {
            idb.close();
            res.status(404).text('Not found').end();
            return;
          }

          await editRowInIndexedDb(rowToPatch, idb);
        }
      } else {
        idb.close();
        res.status(404).text('Not found').end();
        return;
      }

      idb.close();
      const redirectUrl = new URL(
        req.data._redirect || `/databases/${databaseId}`,
        new URL(req.url).origin,
      );

      res.redirect(redirectUrl.href);
      return;
    }

    const rowToAdd = {
      id: getUniqueId(),
      databaseId: database.id,
    };

    for (const property of database.properties) {
      const formDataValue = formatPropertyValueFromFormData<typeof property>(
        req.data[property.id],
        property,
      );

      if (formDataValue === undefined) {
        continue;
      }

      rowToAdd[property.id] = formDataValue;
    }

    if (
      !guardIsChecklistRow(rowToAdd, database) &&
      !guardIsTableRow(rowToAdd, database)
    ) {
      idb.close();
      const url = new URL(req.url);
      url.searchParams.set('error', 'Invalid row');

      res.redirect(url.href);
      return;
    }

    if (guardIsChecklistRow(rowToAdd, database)) {
      rowToAdd.completed = req.data.completed === 'on';
    }

    if (req.data.position !== undefined) {
      rowToAdd.position = req.data.position;
    } else {
      const lastRow = database.rows[database.rows.length - 1];

      if (lastRow) {
        rowToAdd.position = LexoRank.parse(lastRow.position)
          .genNext()
          .toString();
      } else {
        rowToAdd.position = LexoRank.middle().toString();
      }
    }

    await addRowToIndexedDb<typeof database>(rowToAdd, idb);
    idb.close();

    const redirectUrl = new URL(
      `/databases/${database.id}`,
      new URL(req.url).origin,
    );
    const autofocusedPropertyName = req.data._autofocus
      ? (
          (req.data._autofocus || '').split('auto-save-text--field__')[1] || ''
        ).split('--')[0]
      : '';
    const firstPropertyName = database.properties[0]?.id || '';
    const propertyName = autofocusedPropertyName || firstPropertyName;
    const autoFocusId = `auto-save-text--field__${propertyName}--${rowToAdd.id}`;
    console.log({
      autofocusedPropertyName,
      propertyName,
    });
    redirectUrl.searchParams.set('autofocus', autoFocusId);

    res.redirect(redirectUrl.href);
  })(req, res);
}
