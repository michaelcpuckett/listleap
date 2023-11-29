export function ButtonElement(
  props: React.PropsWithChildren<{
    type?: 'button' | 'submit' | 'reset';
    id?: string;
    button?: boolean;
    'full-width'?: boolean;
    currentColor?: boolean;
    bordered?: boolean;
    label?: string;
    disabled?: boolean;
  }>,
) {
  const buttonClass = props.button === false ? '' : 'button ';
  const currentColorClass = props.currentColor
    ? ' text-color--currentColor '
    : '';
  const fullWidthClass = props['full-width'] ? ' button--full-width ' : '';
  const borderedClass = props.bordered ? ' button--bordered ' : '';
  const className = `${buttonClass}${fullWidthClass}${borderedClass}${currentColorClass}`;

  return (
    <button
      tabIndex={0}
      id={props.id}
      aria-label={props.label}
      type={props.type || 'submit'}
      className={className}
      aria-disabled={props.disabled}
    >
      {props.children}
    </button>
  );
}
