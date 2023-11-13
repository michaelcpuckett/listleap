import React from 'react';
import { UnsavedIndicator } from "components/elements/UnsavedIndicator";

export function NumericalContentEditable(props: React.PropsWithChildren<{ form: string; id: string; label: string; name: string; value: number; }>) {
  return <>
    <input
      form={props.form}
      id={`content-editable-field__${props.name}--${props.id}`}
      autoComplete="off"
      aria-label={props.label}
      type="tel"
      className="content-editable"
      name={props.name}
      value={props.value}
    />
    <UnsavedIndicator />
  </>;
}