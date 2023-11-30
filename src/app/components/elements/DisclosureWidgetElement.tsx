export function DisclosureWidgetElement(
  props: React.PropsWithChildren<{
    role?: string;
  }>,
) {
  return (
    <disclosure-widget>
      <details role={props.role}>{props.children}</details>
    </disclosure-widget>
  );
}
