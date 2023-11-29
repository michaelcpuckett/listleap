import React from 'react';
import { getUniqueId } from 'shared/getUniqueId';

export function AutoSaveCheckboxElement(
  props: React.PropsWithChildren<{
    form?: string;
    name: string;
    label: string;
    id: string;
    checked: boolean;
    value?: string;
    tabindex?: number;
  }>,
) {
  return (
    <auto-save-checkbox
      id={`auto-save-checkbox--${props.name.replace('[]', '')}--${props.id}`}
    >
      <template shadowrootmode="open">
        <link
          rel="stylesheet"
          href="/host.css"
        />
        <slot></slot>
      </template>
      <input
        form={props.form}
        type="checkbox"
        tabIndex={0}
        id={`auto-save-checkbox--field__${props.name.replace('[]', '')}--${
          props.id
        }`}
        aria-label={props.label}
        name={props.name}
        checked={props.checked}
        value={props.value}
        className="expand-touch-target"
        tabIndex={props.tabindex}
      />
    </auto-save-checkbox>
  );
}
