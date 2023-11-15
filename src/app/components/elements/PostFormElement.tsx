import React from 'react';

export function PostFormElement(
  props: React.PropsWithChildren<{ action: string; id: string }>,
) {
  return (
    <post-form>
      <template shadowrootmode="open">
        <link
          rel="stylesheet"
          href="/post-form.css"
        />
        <slot></slot>
      </template>
      <form
        noValidate
        autoComplete="off"
        action={props.action}
        method="POST"
        id={props.id}
        role="none"
      >
        <input
          type="hidden"
          name="_method"
          value="POST"
        />
        {props.children}
        <button
          type="reset"
          hidden
        >
          Reset
        </button>
      </form>
    </post-form>
  );
}
