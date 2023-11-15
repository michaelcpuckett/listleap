import React from 'react';
import escapeStringRegexp from 'escape-string-regexp';
import { UnsavedIndicator } from 'components/elements/UnsavedIndicator';
import { getUniqueId } from 'shared/getUniqueId';

export function AutoSaveTextElement(
  props: React.PropsWithChildren<{
    form?: string;
    inline?: boolean;
    id: string;
    label: string;
    name: string;
    value: string;
  }>,
) {
  return (
    <auto-save-text
      id={getUniqueId()}
      data-inline={props.inline ? '' : undefined}
    >
      <template
        shadowrootmode="open"
        shadowrootdelegatesfocus
      >
        <link
          rel="stylesheet"
          href="/auto-save.css"
        />
        <slot></slot>
        <UnsavedIndicator />
      </template>
      <input
        form={props.form}
        id={`auto-save-text--field__${props.name}--${props.id}`}
        autoComplete="off"
        aria-label={props.label}
        type="text"
        name={props.name}
        value={props.value}
      />
    </auto-save-text>
  );
}
