import { HyperLinkElement } from 'components/elements/HyperLinkElement';
import React from 'react';
import { AnyChecklistRow } from 'shared/types';

export function FilterRowsForm(
  props: React.PropsWithoutRef<{
    rows: AnyChecklistRow[];
    query: Record<string, string>;
  }>,
) {
  const allRowsUrl = new URL(props.url);
  allRowsUrl.searchParams.delete('filter');

  const completedRowsUrl = new URL(props.url);
  completedRowsUrl.searchParams.set('filter', 'completed');

  const incompleteRowsUrl = new URL(props.url);
  incompleteRowsUrl.searchParams.set('filter', 'incompleted');

  return (
    <div
      role="group"
      aria-label="Filter Rows"
    >
      <ul className="no-bullet">
        <li>
          <HyperLinkElement
            current={!props.query.filter}
            href={allRowsUrl.href}
          >
            All ({props.rows.length})
          </HyperLinkElement>
        </li>
        <li>
          <HyperLinkElement
            current={props.query.filter === 'incompleted'}
            href={incompleteRowsUrl.href}
          >
            Incomplete ({props.rows.filter((row) => !row.completed).length})
          </HyperLinkElement>
        </li>
        <li>
          <HyperLinkElement
            aria-current={props.query.filter === 'completed'}
            href={completedRowsUrl.href}
          >
            Completed ({props.rows.filter((row) => row.completed).length})
          </HyperLinkElement>
        </li>
      </ul>
    </div>
  );
}
