import React from 'react';
import { AutoSaveTextElement } from 'components/elements/AutoSaveTextElement';
import { PostFormElement } from 'components/elements/PostFormElement';

export function AddDatabaseForm() {
  return (
    <PostFormElement
      id="new-database"
      action="/databases"
    >
      <AutoSaveTextElement
        name="name"
        label="Name"
        value=""
        id="new-database-name"
      />
      <select
        className="input"
        name="type"
        required
      >
        <option value="CHECKLIST">Checklist</option>
        {null && (
          <>
            <option value="TABLE">Table</option>
            <option value="LIST">List</option>
            <option value="CALENDAR">Calendar</option>
            <option value="BOARD">Board</option>
          </>
        )}
      </select>
      <button
        type="submit"
        className="button"
      >
        Add Database
      </button>
    </PostFormElement>
  );
}
