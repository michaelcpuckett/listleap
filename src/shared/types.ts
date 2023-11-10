export type Referrer = {
  url: string;
  mode?: string;
  index?: number;
  id?: string;
  query?: string;
  filter?: string;
};

export interface Settings {
  theme: string;
}

export interface PartialDatabase {
  id: string;
  type: "CHECKLIST" | "TABLE" | "LIST" | "CALENDAR" | "BOARD";
  name: string;
}

export interface Database<Properties extends Property[]>
  extends PartialDatabase {
  properties: Properties;
  rows: Row<Properties>[];
}

export interface PartialChecklist extends PartialDatabase {
  type: "CHECKLIST";
}

export interface PartialTable extends PartialDatabase {
  type: "TABLE";
}

export type Checklist<P extends Property[]> = PartialChecklist & {
  rows: ChecklistRow<P>[];
  properties: P;
};

export type Table<P extends Property[]> = PartialTable & {
  rows: TableRow<P>[];
  properties: P;
};

interface BaseProperty {
  id: string;
  databaseId: string;
  name: string;
  index: number;
}

export interface UntypedProperty extends BaseProperty {
  type: string;
}

export interface Property extends BaseProperty {
  type: StringConstructor | NumberConstructor | BooleanConstructor;
}

type DynamicPropertyKeyValuePair<Properties> = {
  [K in keyof Properties]: Properties[K] extends StringConstructor
    ? string
    : Properties[K] extends NumberConstructor
    ? number
    : Properties[K] extends BooleanConstructor
    ? boolean
    : never;
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

export type Row<Properties extends Property[]> = PartialRow &
  DynamicPropertyKeyValuePair<Properties>;

export type ChecklistRow<Properties extends Property[]> = Row<Properties> &
  PartialChecklistRow;

export type TableRow<Properties extends Property[]> = Row<Properties> &
  PartialTableRow;

export type AnyRow = Row<Property[]>;

export type AnyDatabase = Database<Property[]>;

export type IsChecklist<T extends Database<Property[]>["type"]> =
  T extends Checklist<Property[]>["type"] ? T : never;

export type IsTable<T extends Database<Property[]>["type"]> = T extends Table<
  Property[]
>["type"]
  ? T
  : never;

export type GetRowByType<T extends Database<Property[]>["type"]> =
  T extends IsChecklist<T>
    ? ChecklistRow<Property[]>
    : T extends IsTable<T>
    ? TableRow<Property[]>
    : never;
