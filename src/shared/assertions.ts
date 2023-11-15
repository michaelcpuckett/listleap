import {
  Property,
  Checklist,
  AnyDatabase,
  AnyChecklist,
  AnyTable,
  AnyProperty,
} from './types';

export function guardIsDatabase(db: unknown): db is AnyDatabase {
  const hasId = typeof (db as AnyDatabase).id === 'string';
  const hasName = typeof (db as AnyDatabase).name === 'string';
  const hasValidType = [
    'CHECKLIST',
    'TABLE',
    'LIST',
    'CALENDAR',
    'BOARD',
  ].includes((db as AnyDatabase).type);
  const hasPropertiesArray = Array.isArray((db as AnyDatabase).properties);
  const hasRowsArray = Array.isArray((db as AnyDatabase).rows);

  return hasId && hasName && hasValidType && hasPropertiesArray && hasRowsArray;
}

export function assertIsDatabase(db: unknown): asserts db is AnyDatabase {
  if (!guardIsDatabase(db)) {
    throw new Error('Expected database');
  }
}

export function guardIsChecklist(db: unknown): db is Checklist<AnyDatabase> {
  const isDatabase = guardIsDatabase(db);

  if (!isDatabase) {
    return false;
  }

  return db.type === 'CHECKLIST';
}

export function assertIsChecklist(db: unknown): asserts db is AnyChecklist {
  if (!guardIsChecklist(db)) {
    throw new Error('Expected checklist');
  }
}

export function guardIsTable(db: unknown): db is AnyTable {
  const isDatabase = guardIsDatabase(db);

  if (!isDatabase) {
    return false;
  }

  return db.type === 'TABLE';
}

export function assertIsTable(db: unknown): asserts db is AnyTable {
  if (!guardIsTable(db)) {
    throw new Error('Expected table');
  }
}

export function guardIsChecklistRow(
  row: unknown,
  database: AnyDatabase,
): row is (typeof database)['rows'][number] {
  return database.type === 'CHECKLIST';
}

export function guardIsTableRow(
  row: unknown,
  database: AnyDatabase,
): row is (typeof database)['rows'][number] {
  return database.type === 'TABLE';
}

export function guardIsBooleanDynamicPropertyType(
  p: AnyProperty,
): p is Property<BooleanConstructor> {
  return p.type === Boolean;
}

export function guardIsNumberDynamicPropertyType(
  p: AnyProperty,
): p is Property<NumberConstructor> {
  return p.type === Number;
}

export function guardIsStringDynamicPropertyType(
  p: AnyProperty,
): p is Property<StringConstructor> {
  return p.type === String;
}
