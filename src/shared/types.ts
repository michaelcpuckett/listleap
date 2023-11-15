export type Referrer = {
  url: string;
  mode?: string;
  index?: number;
  id?: string;
  query?: string;
  filter?: string;
  error?: string;
};

export interface Settings {
  theme: string;
}

export interface PartialDatabase {
  id: string;
  type: 'CHECKLIST' | 'TABLE' | 'LIST' | 'CALENDAR' | 'BOARD';
  name: string;
}

export interface Database<Properties extends Property[]>
  extends PartialDatabase {
  properties: Properties;
  rows: Row<Properties>[];
}

export interface PartialChecklist extends PartialDatabase {
  type: 'CHECKLIST';
}

export interface PartialTable extends PartialDatabase {
  type: 'TABLE';
}

export type Checklist<P extends Property[]> = PartialChecklist & {
  rows: ChecklistRow<P>[];
  properties: P;
};

export type Table<P extends Property[]> = PartialTable & {
  rows: TableRow<P>[];
  properties: P;
};

export interface PartialProperty {
  id: string;
  databaseId: string;
  name: string;
}

export interface UntypedProperty extends PartialProperty {
  index: number;
  type: string;
}

export interface Property extends PartialProperty {
  index: number;
  type: StringConstructor | NumberConstructor | BooleanConstructor;
}

export type DynamicPropertyKey<P extends Property> = P['id'];

// Infers the type using `infer` keyword
export type DynamicPropertyValue<P extends Property> =
  P['type'] extends StringConstructor
    ? string
    : P['type'] extends NumberConstructor
      ? number
      : P['type'] extends BooleanConstructor
        ? boolean
        : never;

export type DynamicPropertyKeyValuePair<P extends Property> = {
  [K in DynamicPropertyKey<P>]: DynamicPropertyValue<P>;
};

export type DynamicPropertyKeyValuePairs<P extends Property[]> = {
  [K in DynamicPropertyKey<P[number]>]: DynamicPropertyValue<P[number]>;
};

export interface PartialRow {
  id: string;
  databaseId: string;
  title: string;
}

export interface PartialTableRow extends PartialRow {}

export interface PartialChecklistRow extends PartialRow {
  completed: boolean;
}

export type Row<Properties extends Property[]> = PartialRow & {
  position: string;
} & DynamicPropertyKeyValuePairs<Properties>;

export type ChecklistRow<Properties extends Property[]> = Row<Properties> &
  PartialChecklistRow;

export type TableRow<Properties extends Property[]> = Row<Properties> &
  PartialTableRow;

export type AnyRow = Row<Property[]>;

export type AnyDatabase = Database<Property[]>;

export type IsChecklist<T extends Database<Property[]>['type']> =
  T extends Checklist<Property[]>['type'] ? T : never;

export type IsTable<T extends Database<Property[]>['type']> = T extends Table<
  Property[]
>['type']
  ? T
  : never;

export type GetRowByType<T extends Database<Property[]>['type']> =
  T extends IsChecklist<T>
    ? ChecklistRow<Property[]>
    : T extends IsTable<T>
      ? TableRow<Property[]>
      : never;

interface FormDataWithArrayValue {
  [key: `${string}[]`]: string[] | undefined;
}

interface FormDataWithStringValue {
  [key: string]: string | undefined;
}

export type NormalizedFormData = FormDataWithArrayValue &
  FormDataWithStringValue;
