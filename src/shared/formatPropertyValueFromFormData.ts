import { NormalizedFormData, Property, PropertyTypes } from './types';
import { guardIsString } from './assertions';

export function formatPropertyValueFromFormData<
  T extends Property<PropertyTypes>,
>(value: NormalizedFormData[number], property: T) {
  if (property.type === String) {
    if (Array.isArray(value)) {
      return value.filter(guardIsString).map((v) => v.trim());
    }

    return value;
  }

  if (property.type === Number) {
    if (Array.isArray(value)) {
      return value.filter(guardIsString).map((v) => Number(v));
    }

    return Number(value);
  }

  if (property.type === Boolean) {
    if (Array.isArray(value)) {
      return value.filter(guardIsString).map((v) => v === 'on');
    }

    return value === 'on';
  }

  throw new Error(`Unknown property type: ${property.type}`);
}
