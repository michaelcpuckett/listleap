import React from 'react';
import { AnyRow } from 'shared/types';

export function ReorderRowDownForm(props: React.PropsWithoutRef<{ row: AnyRow; index: number; autofocus?: boolean; isDisabled?: boolean; role?: string; tabindex?: number; }>) {
  return (
    <form action={`/databases/${props.row.databaseId}/rows/${props.row.id}`} method="POST" role="none">
      <input type="hidden" name="_method" value="PATCH" />
      <input type="hidden" name="index" value={props.index} />
      <button
        className="button"
        tabIndex={props.tabindex}
        role={props.role}
        type={props.isDisabled ? 'button' : 'submit'}
        data-auto-focus={props.autofocus}
        aria-disabled={props.isDisabled}>
        Move Down
      </button>
    </form>
  );
}