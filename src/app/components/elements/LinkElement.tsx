export function LinkElement(
  props: React.PropsWithChildren<{
    href: string;
    'full-width'?: boolean;
    currentColor?: boolean;
  }>,
) {
  const currentColorClass = props.currentColor
    ? ' text-color--currentColor '
    : '';
  const fullWidthClass = props['full-width'] ? ' link--full-width ' : '';
  const className = `${currentColorClass}${fullWidthClass}`;

  return (
    <a
      tabIndex={0}
      href={props.href}
      className={className}
    >
      {props.children}
    </a>
  );
}
