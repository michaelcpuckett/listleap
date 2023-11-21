export type Referrer = {
  url: string;
  mode?: string;
  index?: number;
  id?: string;
  query?: string;
  filter?: string;
  error?: string;
  autofocus?: string;
};

export interface Settings {
  theme: string;
}

export interface PartialDatabase {
  id: string;
  type: 'CHECKLIST' | 'TABLE' | 'LIST' | 'CALENDAR' | 'BOARD';
  name: string;
}

export interface Database<Properties extends AnyProperty[]>
  extends PartialDatabase {
  properties: Properties;
  rows: Row<AnyDatabase>[];
}

export interface PartialChecklist extends PartialDatabase {
  type: 'CHECKLIST';
}

export interface PartialTable extends PartialDatabase {
  type: 'TABLE';
}

export type Checklist<Db extends AnyDatabase> = PartialChecklist & {
  rows: ChecklistRow<Db>[];
  properties: Db['properties'];
};

export type AnyChecklist = Checklist<AnyDatabase>;

export type Table<Db extends AnyDatabase> = PartialTable & {
  rows: TableRow<Db>[];
  properties: Db['properties'];
};

export type AnyTable = Table<AnyDatabase>;

export interface PartialProperty {
  id: string;
  databaseId: string;
  name: string;
}

export interface UntypedProperty extends PartialProperty {
  position: string;
  type: string;
}

export type PropertyTypes =
  | StringConstructor
  | NumberConstructor
  | BooleanConstructor;

export interface Property<T extends PropertyTypes> extends PartialProperty {
  position: string;
  type: T;
}

export type AnyProperty = Property<PropertyTypes>;

export type DynamicPropertyKey<P extends AnyProperty> = P['id'];

// Infers the type using `infer` keyword
export type DynamicPropertyValue<P extends AnyProperty> =
  P['type'] extends StringConstructor
    ? string | string[]
    : P['type'] extends NumberConstructor
      ? number | number[]
      : P['type'] extends BooleanConstructor
        ? boolean | boolean[]
        : never;

export type DynamicPropertyKeyValuePair<P extends AnyProperty> = {
  [K in DynamicPropertyKey<P>]: DynamicPropertyValue<P>;
};

export type DynamicPropertyKeyValuePairs<P extends AnyProperty[]> = {
  [K in DynamicPropertyKey<P[number]>]: DynamicPropertyValue<P[number]>;
};

export interface PartialRow {
  id: string;
  databaseId: string;
}

export interface PartialTableRow extends PartialRow {}

export interface PartialChecklistRow extends PartialRow {
  completed: boolean;
}

export type Row<Db extends AnyDatabase> = PartialRow & {
  position: string;
} & DynamicPropertyKeyValuePairs<Db['properties']>;

export type ChecklistRow<Db extends AnyDatabase> = Row<Db> &
  PartialChecklistRow;

export type AnyChecklistRow = ChecklistRow<AnyDatabase>;

export type TableRow<Db extends AnyDatabase> = Row<Db> & PartialTableRow;

export type AnyTableRow = TableRow<AnyDatabase>;

export type AnyRow = Row<AnyDatabase>;

export type AnyDatabase = Database<AnyProperty[]>;

export type IsChecklist<Db extends AnyDatabase> = Db['type'] extends 'CHECKLIST'
  ? Db
  : never;

export type IsTable<Db extends AnyDatabase> = Db['type'] extends 'TABLE'
  ? Db
  : never;

export type GetRowByType<Db extends AnyDatabase> = IsTable<Db> extends Db
  ? TableRow<Db>
  : IsChecklist<Db> extends Db
    ? ChecklistRow<Db>
    : never;

interface FormDataWithArrayValue {
  [key: `${string}[]`]: string[] | undefined;
}

interface FormDataWithStringValue {
  [key: string]: string | undefined;
}

export type NormalizedFormData = FormDataWithArrayValue &
  FormDataWithStringValue;
