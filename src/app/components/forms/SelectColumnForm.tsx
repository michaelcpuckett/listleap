import { ButtonElement } from 'components/elements/ButtonElement';
import { AnyProperty } from 'shared/types';

export function SelectColumnForm(
  props: React.PropsWithChildren<{
    property: AnyProperty;
  }>,
) {
  return (
    <column-selector data-property={props.property}>
      <ButtonElement
        full-width
        type="button"
      >
        Select Column
      </ButtonElement>
    </column-selector>
  );
}
