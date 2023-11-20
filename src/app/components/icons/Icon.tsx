export function Icon(
  props: React.PropsWithoutRef<{
    name: string;
    width?: number;
    height?: number;
  }>,
) {
  return (
    <svg
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
      width={props.width ?? 24}
      height={props.height ?? 24}
      fill="currentColor"
    >
      <use
        xmlnsXlink="http://www.w3.org/1999/xlink"
        xlinkHref={`#${props.name}`}
      />
    </svg>
  );
}
