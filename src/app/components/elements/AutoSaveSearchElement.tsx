import React from 'react';
import escapeStringRegexp from 'escape-string-regexp';
import { UnsavedIndicator } from 'components/elements/UnsavedIndicator';
import { getUniqueId } from 'shared/getUniqueId';

export function AutoSaveSearchElement(
  props: React.PropsWithChildren<{
    form?: string;
    placeholder?: string;
    inline?: boolean;
    id: string;
    label: string;
    name: string;
    value: string;
  }>,
) {
  return (
    <auto-save-search
      id={`auto-save-search--${props.name}--${props.id}`}
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
        id={`auto-save-search--field__${props.name}--${props.id}`}
        autoComplete="off"
        aria-label={props.label}
        placeholder={props.placeholder}
        className="input"
        type="search"
        name={props.name}
        value={props.value}
      />
    </auto-save-search>
  );
}
