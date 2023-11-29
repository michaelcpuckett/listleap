export function HyperLinkElement(
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
  const className = `link${currentColorClass}${fullWidthClass}${buttonClass}`;

  return (
    <hyper-link
      tabindex="0"
      role={props.role || 'link'}
      data-href={props.href}
      aria-current={props.current ? 'page' : undefined}
      class={className}
    >
      {props.children}
    </hyper-link>
  );
}
