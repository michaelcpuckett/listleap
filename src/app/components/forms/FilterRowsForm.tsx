import React from 'react';
import {Referrer, Property, ChecklistRow} from 'shared/types';

export function FilterRowsForm(props: React.PropsWithoutRef<{ rows: ChecklistRow<Property[]>[]; referrer: Referrer }>) {
  const allRowsUrl = new URL(props.referrer.url);
  allRowsUrl.searchParams.delete('filter');

  const completedRowsUrl = new URL(props.referrer.url);
  completedRowsUrl.searchParams.set('filter', 'completed');

  const incompleteRowsUrl = new URL(props.referrer.url);
  incompleteRowsUrl.searchParams.set('filter', 'incompleted');
  
  return (
    <div role="group" aria-label="Filter Rows">
      <ul className="no-bullet">
        <li>
          <a
            aria-current={!props.referrer.filter ? 'page' : undefined}
            href={allRowsUrl.href}>All ({props.rows.length})</a>
        </li>
        <li>
          <a
            aria-current={props.referrer.filter === 'incompleted' ? 'page' : undefined}
            href={incompleteRowsUrl.href}>Incomplete ({props.rows.filter((row) => !row.completed).length})</a>
        </li>
        <li>
          <a
            aria-current={props.referrer.filter === 'completed' ? 'page' : undefined}
            href={completedRowsUrl.href}>Completed ({props.rows.filter((row) => row.completed).length})</a>
        </li>
      </ul>
    </div>
  );
}