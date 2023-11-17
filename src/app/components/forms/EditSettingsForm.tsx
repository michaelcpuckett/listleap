import React from 'react';
import { Settings } from 'shared/types';

export function EditSettingsForm(
  props: React.PropsWithChildren<{ settings: Settings }>,
) {
  return (
    <form
      action="/settings"
      method="POST"
      role="none"
    >
      <input
        type="hidden"
        name="_method"
        value="PATCH"
      />
      <label>
        Theme
        <select name="theme">
          <option
            value="dark"
            selected={props.settings.theme === 'dark' ? true : undefined}
          >
            Dark
          </option>
          <option
            value="light"
            selected={props.settings.theme === 'light' ? true : undefined}
          >
            Light
          </option>
        </select>
      </label>
      <button
        className="button"
        type="submit"
      >
        Save
      </button>
    </form>
  );
}
