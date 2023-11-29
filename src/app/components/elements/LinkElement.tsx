export function LinkElement(
  props: React.PropsWithChildren<{
    href: string;
    current?: boolean;
    'full-width'?: boolean;
    currentColor?: boolean;
    button?: boolean;
    role?: string;
  }>,
) {
  const buttonClass = props.button ? ' button ' : '';
  const currentColorClass = props.currentColor
    ? ' text-color--currentColor '
    : '';
  const fullWidthClass = props['full-width'] ? ' link--full-width ' : '';
  const className = `${currentColorClass}${fullWidthClass}${buttonClass}`;

  return (
    <a
      tabIndex={0}
      href={props.href}
      aria-current={props.current ? 'page' : undefined}
      className={className}
      role={props.role}
    >
      {props.children}
    </a>
  );
}
