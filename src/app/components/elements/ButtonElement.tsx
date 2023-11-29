export function ButtonElement(
  props: React.PropsWithChildren<{
    type?: 'button' | 'submit' | 'reset';
    id?: string;
    button?: boolean;
    'full-width'?: boolean;
    bordered?: boolean;
  }>,
) {
  const buttonClass = props.button === false ? '' : 'button ';
  const fullWidthClass = props['full-width'] ? ' button--full-width ' : '';
  const borderedClass = props.bordered ? ' button--bordered ' : '';
  const className = `${buttonClass}${fullWidthClass}${borderedClass}`;

  return (
    <button
      tabIndex={0}
      id={props.id}
      type={props.type || 'submit'}
      className={className}
    >
      {props.children}
    </button>
  );
}
