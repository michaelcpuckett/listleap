import {
  getIdb,
  getDatabaseFromIndexedDb,
  reorderRowInIndexedDb,
  editRowInIndexedDb,
  getRowByPositionFromIndexedDb,
} from 'utilities/idb';
import { Referrer, NormalizedFormData } from 'shared/types';
import { guardIsChecklistRow, guardIsTableRow } from 'shared/assertions';
import { formatPropertyValueFromFormData } from 'shared/formatPropertyValueFromFormData';
import {
  ExpressWorkerRequest,
  ExpressWorkerResponse,
} from '@express-worker/app';
import { AdditionalRequestProperties } from '../../../middleware';

export async function PatchDatabaseRow(
  req: ExpressWorkerRequest & AdditionalRequestProperties,
  res: ExpressWorkerResponse,
) {
  if (req.data._method !== 'PATCH') {
    return;
  }

  const idb = await getIdb();
  const databaseId = req.params.databaseId || '';
  const database = await getDatabaseFromIndexedDb(databaseId, idb);

  if (!database) {
    idb.close();
    res.status = 404;
    res.text('Not found');
    return;
  }

  const id = req.params.id || '';
  const existingRow = database.rows.find((row) => row.id === id);

  if (!existingRow) {
    idb.close();
    res.status = 404;
    res.text('Not found');
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
    res.status = 404;
    res.text('Not found');
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
  redirectUrl.search = new URL(req.referrer).search;

  res.redirect(redirectUrl.href);
}
