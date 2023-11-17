import React from 'react';
import { UnsavedIndicator } from 'components/elements/UnsavedIndicator';
import { getUniqueId } from 'shared/getUniqueId';

export function AutoSaveCheckboxElement(
  props: React.PropsWithChildren<{
    form?: string;
    name: string;
    label: string;
    id: string;
    checked: boolean;
    value?: string;
  }>,
) {
  return (
    <auto-save-checkbox id={getUniqueId()}>
      <template
        shadowrootmode="open"
        shadowrootdelegatesfocus
      >
        <link
          rel="stylesheet"
          href="/auto-save.css"
        />
        <slot></slot>
      </template>
      <input
        form={props.form}
        type="checkbox"
        id={`auto-save-checkbox--field__${props.name}--${props.id}`}
        aria-label={props.label}
        name={props.name}
        checked={props.checked}
        value={props.value}
        className="expand-touch-target"
      />
    </auto-save-checkbox>
  );
}
