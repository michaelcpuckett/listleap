import React from 'react';
import { Referrer } from 'shared/types';

export function AutoSaveTextElement(
  props: React.PropsWithChildren<{
    form?: string;
    referrer: Referrer;
    placeholder?: string;
    inline?: boolean;
    id: string;
    label: string;
    name: string;
    value: string;
    tabindex?: number;
  }>,
) {
  const id = `auto-save-text--field__${props.name.replace('[]', '')}--${
    props.id
  }`;

  return (
    <auto-save-text
      id={`auto-save-text--${props.name.replace('[]', '')}--${props.id}`}
      data-inline={props.inline ? '' : undefined}
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
        id={id}
        data-auto-focus={props.referrer.autofocus === id}
        autoComplete="turn-off"
        aria-label={props.label}
        placeholder={props.placeholder}
        type="text"
        className={props.inline ? undefined : 'input'}
        name={props.name}
        value={props.value}
        tabIndex={props.tabindex}
        data-read-only=""
      />
    </auto-save-text>
  );
}
