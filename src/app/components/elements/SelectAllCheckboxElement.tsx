export function SelectAllCheckboxElement(props: React.PropsWithChildren<{}>) {
  return (
    <select-all-checkbox>
      <template
        shadowrootmode="open"
        shadowrootdelegatesfocus=""
      >
        <link
          rel="stylesheet"
          href="/host.css"
        />
        <slot></slot>
      </template>
      {props.children}
    </select-all-checkbox>
  );
}
