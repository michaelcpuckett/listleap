import {
  Property,
  Database,
  Checklist,
  Table,
  Row,
  ChecklistRow,
} from './types';

export function guardIsDatabase(db: unknown): db is Database<Property[]> {
  const hasId = typeof (db as Database<Property[]>).id === 'string';
  const hasName = typeof (db as Database<Property[]>).name === 'string';
  const hasValidType = [
    'CHECKLIST',
    'TABLE',
    'LIST',
    'CALENDAR',
    'BOARD',
  ].includes((db as Database<Property[]>).type);
  const hasPropertiesArray = Array.isArray(
    (db as Database<Property[]>).properties,
  );
  const hasRowsArray = Array.isArray((db as Database<Property[]>).rows);

  return hasId && hasName && hasValidType && hasPropertiesArray && hasRowsArray;
}

export function assertIsDatabase(
  db: unknown,
): asserts db is Database<Property[]> {
  if (!guardIsDatabase(db)) {
    throw new Error('Expected database');
  }
}

export function guardIsChecklist(db: unknown): db is Checklist<Property[]> {
  const isDatabase = guardIsDatabase(db);

  if (!isDatabase) {
    return false;
  }

  return db.type === 'CHECKLIST';
}

export function assertIsChecklist(
  db: unknown,
): asserts db is Checklist<Property[]> {
  if (!guardIsChecklist(db)) {
    throw new Error('Expected checklist');
  }
}

export function guardIsTable(db: unknown): db is Table<Property[]> {
  const isDatabase = guardIsDatabase(db);

  if (!isDatabase) {
    return false;
  }

  return db.type === 'TABLE';
}

export function assertIsTable(db: unknown): asserts db is Table<Property[]> {
  if (!guardIsTable(db)) {
    throw new Error('Expected table');
  }
}

export function guardIsChecklistRow(
  row: unknown,
  database: Database<Property[]>,
): row is Checklist<Property[]>['rows'][number] {
  return database.type === 'CHECKLIST';
}

export function guardIsTableRow(
  row: unknown,
  database: Database<Property[]>,
): row is Table<Property[]>['rows'][number] {
  return database.type === 'TABLE';
}
