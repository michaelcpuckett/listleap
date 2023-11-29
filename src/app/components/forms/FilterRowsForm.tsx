import { LinkElement } from 'components/elements/LinkElement';
import React from 'react';
import { Referrer, Property, AnyChecklistRow } from 'shared/types';

export function FilterRowsForm(
  props: React.PropsWithoutRef<{
    rows: AnyChecklistRow[];
    referrer: Referrer;
  }>,
) {
  const allRowsUrl = new URL(props.referrer.url);
  allRowsUrl.searchParams.delete('filter');

  const completedRowsUrl = new URL(props.referrer.url);
  completedRowsUrl.searchParams.set('filter', 'completed');

  const incompleteRowsUrl = new URL(props.referrer.url);
  incompleteRowsUrl.searchParams.set('filter', 'incompleted');

  return (
    <div
      role="group"
      aria-label="Filter Rows"
    >
      <ul className="no-bullet">
        <li>
          <LinkElement
            current={!props.referrer.filter}
            href={allRowsUrl.href}
          >
            All ({props.rows.length})
          </LinkElement>
        </li>
        <li>
          <LinkElement
            current={props.referrer.filter === 'incompleted'}
            href={incompleteRowsUrl.href}
          >
            Incomplete ({props.rows.filter((row) => !row.completed).length})
          </LinkElement>
        </li>
        <li>
          <LinkElement
            aria-current={props.referrer.filter === 'completed'}
            href={completedRowsUrl.href}
          >
            Completed ({props.rows.filter((row) => row.completed).length})
          </LinkElement>
        </li>
      </ul>
    </div>
  );
}
