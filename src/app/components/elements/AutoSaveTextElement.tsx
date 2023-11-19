import React from 'react';
import escapeStringRegexp from 'escape-string-regexp';
import { getUniqueId } from 'shared/getUniqueId';

export function AutoSaveTextElement(
  props: React.PropsWithChildren<{
    form?: string;
    placeholder?: string;
    inline?: boolean;
    id: string;
    label: string;
    name: string;
    value: string;
    tabindex?: number;
  }>,
) {
  return (
    <auto-save-text
      id={`auto-save-text--${props.name.replace('[]', '')}--${props.id}`}
      data-inline={props.inline ? '' : undefined}
    >
      <template shadowrootmode="open">
        <link
          rel="stylesheet"
          href="/auto-save.css"
        />
        <slot></slot>
      </template>
      <input
        form={props.form}
        id={`auto-save-text--field__${props.name.replace('[]', '')}--${
          props.id
        }`}
        autoComplete="turn-off"
        aria-label={props.label}
        placeholder={props.placeholder}
        type="text"
        className={props.inline ? undefined : 'input'}
        name={props.name}
        value={props.value}
        tabIndex={props.tabindex}
        readOnly
      />
    </auto-save-text>
  );
}
