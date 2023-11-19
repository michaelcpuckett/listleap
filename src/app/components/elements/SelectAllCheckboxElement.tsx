export function SelectAllCheckboxElement(props: React.PropsWithChildren<{}>) {
  return (
    <select-all-checkbox>
      <template shadowrootmode="open">
        <link
          rel="stylesheet"
          href="/select-all-checkbox.css"
        />
        <slot></slot>
      </template>
      {props.children}
    </select-all-checkbox>
  );
}
