/**
 * Column Header Element
 *
 * Uses shadowrootdelegatesfocus to focus the first focusable element when
 * #focus() is called.
 **/
export function ColumnHeaderElement(
  props: React.PropsWithChildren<{
    className?: string;
    label?: string;
  }>,
) {
  return (
    <div
      role="columnheader"
      className={props.className}
      aria-label={props.label}
    >
      <template
        shadowrootmode="open"
        shadowrootdelegatesfocus="true"
      >
        <slot></slot>
      </template>
      {props.children}
    </div>
  );
}

/**
 * Cell (td, th) Element
 *
 * Uses shadowrootdelegatesfocus to focus the first focusable element when
 * #focus() is called.
 **/
export function CellElement(
  props: React.PropsWithChildren<{
    role?: string;
    className?: string;
    label?: string;
    rowId?: string;
    propertyId?: string;
    selectable?: boolean;
  }>,
) {
  return (
    <div
      role={props.role || 'gridcell'}
      className={props.className}
      aria-label={props.label}
      data-row-id={props.rowId}
      data-property-id={props.propertyId}
      data-selectable={props.selectable}
    >
      <template
        shadowrootmode="open"
        shadowrootdelegatesfocus="true"
      >
        <slot></slot>
      </template>
      {props.children}
    </div>
  );
}

/**
 * Row (tr) Element
 */
export function RowElement(props: React.PropsWithChildren<{ label?: string }>) {
  return (
    <div
      role="row"
      aria-label={props.label}
    >
      {props.children}
    </div>
  );
}

/**
 * Row Group (thead, tbody) Element
 */
export function RowGroupElement(
  props: React.PropsWithChildren<{
    label?: string;
  }>,
) {
  return (
    <div
      role="rowgroup"
      aria-label={props.label}
    >
      {props.children}
    </div>
  );
}

export function GridElement(
  props: React.PropsWithChildren<{
    type?: 'table';
    rowCount?: number;
    gridColumnsCss: string;
  }>,
) {
  const typeClass = props.type ? ` view--${props.type} ` : '';
  const className = `view${typeClass}`;

  return (
    <div className="view-scroll-container">
      <div
        role="grid"
        aria-rowcount={props.rowCount}
        className={className}
        style={{
          '--grid-columns': props.gridColumnsCss,
        }}
      >
        {props.children}
      </div>
    </div>
  );
}
