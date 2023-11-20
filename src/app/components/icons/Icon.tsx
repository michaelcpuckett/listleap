const SVG_VIEW_BOXES = {
  plus: '125 175 250 250',
  'dots-vertical': '0 0 16 16',
  'arrow-down': '0 0 96.154 96.154',
};

export function Icon(
  props: React.PropsWithoutRef<{
    name: string;
    width?: number;
    height?: number;
  }>,
) {
  const viewBox = SVG_VIEW_BOXES[props.name];

  if (!viewBox) {
    return null;
  }

  return (
    <svg
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      width={props.width ?? 24}
      height={props.height ?? 24}
      fill="currentColor"
      viewBox={viewBox}
    >
      <use
        xmlnsXlink="http://www.w3.org/1999/xlink"
        xlinkHref={`#${props.name}`}
      />
    </svg>
  );
}
