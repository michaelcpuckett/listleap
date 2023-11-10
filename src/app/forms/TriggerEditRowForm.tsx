import React from "react";
import { Referrer, AnyRow } from "../../shared/types";

export function TriggerEditRowForm(props: React.PropsWithChildren<{ row: AnyRow; referrer: Referrer; autofocus?: boolean; role?: string; tabindex?: number; }>) {
  return (
    <a
      href={`/databases/${props.row.databaseId}/rows/${props.row.id}`}
      className="button"
      tabIndex={props.tabindex}
      role={props.role || 'button'}
      data-auto-focus={props.autofocus}>
      Edit
    </a>
  )
}