import React from "react";
import { UnsavedIndicator } from "components/elements/UnsavedIndicator";

export function AutoSaveCheckboxElement(props: React.PropsWithChildren<{ form: string; name: string; label: string; id: string; checked: boolean; }>) {
  return (
    <auto-save-checkbox>
      <template shadowrootmode='open'>
        <link rel="stylesheet" href="/auto-save.css" />
        <slot></slot>
        <UnsavedIndicator />
      </template>
      <input
        form={props.form}
        type="checkbox"
        id={`auto-save-text--field__${props.name}--${props.id}`}
        aria-label={props.label}
        name={props.name}
        checked={props.checked}
      />
    </auto-save-checkbox>
  );
}