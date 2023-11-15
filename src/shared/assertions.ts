import {
  Property,
  Database,
  Checklist,
  Table,
  AnyProperty,
  Row,
  ChecklistRow,
} from './types';

export function guardIsDatabase(db: unknown): db is Database<AnyProperty[]> {
  const hasId = typeof (db as Database<AnyProperty[]>).id === 'string';
  const hasName = typeof (db as Database<AnyProperty[]>).name === 'string';
  const hasValidType = [
    'CHECKLIST',
    'TABLE',
    'LIST',
    'CALENDAR',
    'BOARD',
  ].includes((db as Database<AnyProperty[]>).type);
  const hasPropertiesArray = Array.isArray(
    (db as Database<AnyProperty[]>).properties,
  );
  const hasRowsArray = Array.isArray((db as Database<AnyProperty[]>).rows);

  return hasId && hasName && hasValidType && hasPropertiesArray && hasRowsArray;
}

export function assertIsDatabase(
  db: unknown,
): asserts db is Database<AnyProperty[]> {
  if (!guardIsDatabase(db)) {
    throw new Error('Expected database');
  }
}

export function guardIsChecklist(db: unknown): db is Checklist<AnyProperty[]> {
  const isDatabase = guardIsDatabase(db);

  if (!isDatabase) {
    return false;
  }

  return db.type === 'CHECKLIST';
}

export function assertIsChecklist(
  db: unknown,
): asserts db is Checklist<AnyProperty[]> {
  if (!guardIsChecklist(db)) {
    throw new Error('Expected checklist');
  }
}

export function guardIsTable(db: unknown): db is Table<AnyProperty[]> {
  const isDatabase = guardIsDatabase(db);

  if (!isDatabase) {
    return false;
  }

  return db.type === 'TABLE';
}

export function assertIsTable(db: unknown): asserts db is Table<AnyProperty[]> {
  if (!guardIsTable(db)) {
    throw new Error('Expected table');
  }
}

export function guardIsChecklistRow(
  row: unknown,
  database: Database<AnyProperty[]>,
): row is Checklist<AnyProperty[]>['rows'][number] {
  return database.type === 'CHECKLIST';
}

export function guardIsTableRow(
  row: unknown,
  database: Database<AnyProperty[]>,
): row is Table<AnyProperty[]>['rows'][number] {
  return database.type === 'TABLE';
}

export function guardIsBooleanDynamicPropertyType<
  Db extends Database<AnyProperty[]>,
>(p: Db['properties'][number]): p is Property<BooleanConstructor> {
  return p.type === Boolean;
}

export function guardIsNumberDynamicPropertyType<
  Db extends Database<AnyProperty[]>,
>(p: Db['properties'][number]): p is Property<NumberConstructor> {
  return p.type === Number;
}

export function guardIsStringDynamicPropertyType<
  Db extends Database<AnyProperty[]>,
>(p: Db['properties'][number]): p is Property<StringConstructor> {
  return p.type === String;
}
